"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, MapPin, Plus, Save, Sparkles, Star, Store, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  atualizarCuradoriaCriadorEstabelecimento,
  listarEstabelecimentos,
  listarEstabelecimentosDoCriador,
  obterCriadorPorUserId,
  removerVinculoCriadorEstabelecimento,
  solicitarVinculoCriadorEstabelecimento,
  type CreatorEstablishmentLink,
  type Estabelecimento,
} from "@/services/firebase";
import { useToast } from "@/components/ui/Toast";

export default function CriadorEstabelecimentosPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { user, profile, isLoggedIn, loading } = useAuth();

  const [creatorId, setCreatorId] = useState<string>("");
  const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[]>([]);
  const [links, setLinks] = useState<CreatorEstablishmentLink[]>([]);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isSubmittingId, setIsSubmittingId] = useState<string | null>(null);
  const [isSavingLinkId, setIsSavingLinkId] = useState<string | null>(null);
  const [isRemovingLinkId, setIsRemovingLinkId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [editorialValues, setEditorialValues] = useState<Record<string, { ordem: number; destaque: boolean; observacaoCuradoria: string }>>({});

  const carregarDados = async () => {
    if (!user) return;

    const creator = await obterCriadorPorUserId(user.uid);
    if (!creator) {
      setCreatorId("");
      setLinks([]);
      setEstabelecimentos([]);
      return;
    }

    setCreatorId(creator.id);

    const [listaEstabelecimentos, listaLinks] = await Promise.all([
      listarEstabelecimentos({ status: "ativo" }),
      listarEstabelecimentosDoCriador(creator.id),
    ]);

    setEstabelecimentos(listaEstabelecimentos);
    setLinks(listaLinks);
    setEditorialValues(
      Object.fromEntries(
        listaLinks.map((link) => [
          link.id,
          {
            ordem: link.ordem ?? 0,
            destaque: link.destaque ?? false,
            observacaoCuradoria: link.observacaoCuradoria ?? "",
          },
        ])
      )
    );
  };

  useEffect(() => {
    if (loading) return;

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (profile?.funcao !== "criador" && profile?.funcao !== "admin") {
      router.push("/usuario/dashboard");
      return;
    }

    let active = true;

    carregarDados()
      .catch((error) => {
        console.error("Erro ao carregar estabelecimentos para criador:", error);
        showToast("warning", "Erro", "Nao foi possivel carregar os estabelecimentos disponiveis.");
      })
      .finally(() => {
        if (active) {
          setIsLoadingPage(false);
        }
      });

    return () => {
      active = false;
    };
  }, [isLoggedIn, loading, profile, router, showToast, user]);

  const linkPorEstabelecimentoId = useMemo(() => {
    return new Map(links.map((link) => [link.establishmentId, link]));
  }, [links]);

  const estabelecimentosFiltrados = useMemo(() => {
    const termo = search.trim().toLowerCase();
    if (!termo) return estabelecimentos;

    return estabelecimentos.filter((estabelecimento) => {
      return [estabelecimento.nome, estabelecimento.endereco, estabelecimento.categoria]
        .join(" ")
        .toLowerCase()
        .includes(termo);
    });
  }, [estabelecimentos, search]);

  const linksAtivos = useMemo(() => {
    return links.filter((link) => link.status === "ativo");
  }, [links]);

  const estabelecimentosPorId = useMemo(() => {
    return new Map(estabelecimentos.map((estabelecimento) => [estabelecimento.id, estabelecimento]));
  }, [estabelecimentos]);

  const solicitarVinculo = async (establishmentId: string) => {
    if (!creatorId) {
      showToast("warning", "Perfil incompleto", "Configure primeiro o seu perfil publico de criador.");
      router.push("/criador/perfil");
      return;
    }

    setIsSubmittingId(establishmentId);

    try {
      await solicitarVinculoCriadorEstabelecimento(creatorId, establishmentId);
      await carregarDados();
      showToast("success", "Solicitacao enviada", "O vinculo foi enviado para analise da plataforma.");
    } catch (error) {
      console.error("Erro ao solicitar vinculo:", error);
      showToast("warning", "Erro", "Nao foi possivel solicitar o vinculo com este estabelecimento.");
    } finally {
      setIsSubmittingId(null);
    }
  };

  const atualizarEditorialLocal = (
    linkId: string,
    patch: Partial<{ ordem: number; destaque: boolean; observacaoCuradoria: string }>
  ) => {
    setEditorialValues((current) => ({
      ...current,
      [linkId]: {
        ordem: current[linkId]?.ordem ?? 0,
        destaque: current[linkId]?.destaque ?? false,
        observacaoCuradoria: current[linkId]?.observacaoCuradoria ?? "",
        ...patch,
      },
    }));
  };

  const salvarCuradoria = async (link: CreatorEstablishmentLink) => {
    const values = editorialValues[link.id];
    if (!values) return;

    setIsSavingLinkId(link.id);
    try {
      await atualizarCuradoriaCriadorEstabelecimento(link.id, values);
      await carregarDados();
      showToast("success", "Curadoria atualizada", "A ordem e o destaque deste lugar foram salvos.");
    } catch (error) {
      console.error("Erro ao atualizar curadoria:", error);
      showToast("warning", "Erro", "Nao foi possivel salvar os dados editoriais deste vinculo.");
    } finally {
      setIsSavingLinkId(null);
    }
  };

  const removerDaCuradoria = async (link: CreatorEstablishmentLink) => {
    setIsRemovingLinkId(link.id);
    try {
      await removerVinculoCriadorEstabelecimento(link.id);
      await carregarDados();
      showToast("info", "Vinculo removido", "O estabelecimento saiu da sua curadoria publica.");
    } catch (error) {
      console.error("Erro ao remover vinculo:", error);
      showToast("warning", "Erro", "Nao foi possivel remover este lugar da curadoria.");
    } finally {
      setIsRemovingLinkId(null);
    }
  };

  if (loading || isLoadingPage) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#1a8ccc]" />
        <p className="text-sm text-slate-500">Carregando estabelecimentos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 px-6 py-10 dark:bg-zinc-950/20 md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl border border-slate-200/60 bg-white p-8 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-2xl bg-[#1a8ccc]/10 p-3 text-[#1a8ccc]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Sua curadoria ativa</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-zinc-400">
                Organize a ordem editorial dos lugares ja aprovados, marque destaques e escreva uma nota curta que aparece na pagina publica do criador.
              </p>
            </div>
          </div>

          {linksAtivos.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-8 text-sm text-slate-500 dark:border-zinc-800 dark:text-zinc-400">
              Ainda nao existem estabelecimentos ativos na sua curadoria. Assim que a plataforma aprovar seus vinculos, eles aparecem aqui para organizacao editorial.
            </div>
          ) : (
            <div className="mt-6 grid gap-4">
              {linksAtivos.map((link) => {
                const estabelecimento = estabelecimentosPorId.get(link.establishmentId);
                const values = editorialValues[link.id] ?? {
                  ordem: link.ordem ?? 0,
                  destaque: link.destaque ?? false,
                  observacaoCuradoria: link.observacaoCuradoria ?? "",
                };

                if (!estabelecimento) return null;

                return (
                  <article
                    key={link.id}
                    className="rounded-3xl border border-slate-200/60 bg-slate-50/60 p-5 dark:border-zinc-800 dark:bg-zinc-950/40"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex gap-4">
                        {estabelecimento.logoUrl ? (
                          <img src={estabelecimento.logoUrl} alt={estabelecimento.nome} className="h-16 w-16 rounded-2xl object-cover" />
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1a8ccc]/10 text-[#1a8ccc]">
                            <Store className="h-6 w-6" />
                          </div>
                        )}

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">{estabelecimento.nome}</h3>
                            {values.destaque && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#1a8ccc]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#1a8ccc]">
                                <Star className="h-3 w-3" />
                                Destaque
                              </span>
                            )}
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-zinc-400">{estabelecimento.endereco}</p>
                        </div>
                      </div>

                      <div className="grid gap-4 lg:min-w-[340px]">
                        <div className="grid grid-cols-[120px_1fr] items-center gap-3">
                          <label className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-zinc-400">Ordem</label>
                          <input
                            type="number"
                            min={0}
                            value={values.ordem}
                            onChange={(event) => atualizarEditorialLocal(link.id, { ordem: Number(event.target.value) })}
                            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium outline-none transition focus:border-[#1a8ccc] dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                          />
                        </div>

                        <div className="grid grid-cols-[120px_1fr] items-center gap-3">
                          <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-zinc-400">Destaque</span>
                          <button
                            type="button"
                            onClick={() => atualizarEditorialLocal(link.id, { destaque: !values.destaque })}
                            className={`inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-bold transition-colors ${
                              values.destaque
                                ? "bg-[#1a8ccc] text-white hover:bg-[#1572a6]"
                                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                            }`}
                          >
                            {values.destaque ? "Marcado como destaque" : "Marcar destaque"}
                          </button>
                        </div>

                        <div className="grid gap-2">
                          <label className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-zinc-400">Nota da curadoria</label>
                          <textarea
                            rows={3}
                            value={values.observacaoCuradoria}
                            onChange={(event) => atualizarEditorialLocal(link.id, { observacaoCuradoria: event.target.value })}
                            placeholder="Ex: meu cafe favorito na regiao para almoco rapido."
                            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#1a8ccc] dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                          />
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => removerDaCuradoria(link)}
                            disabled={isRemovingLinkId === link.id}
                            className="inline-flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600 transition-colors hover:bg-rose-100 disabled:opacity-60 dark:bg-rose-950/20 dark:text-rose-400"
                          >
                            {isRemovingLinkId === link.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            Remover
                          </button>
                          <button
                            type="button"
                            onClick={() => salvarCuradoria(link)}
                            disabled={isSavingLinkId === link.id}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#1a8ccc] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1572a6] disabled:opacity-60"
                          >
                            {isSavingLinkId === link.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Salvar curadoria
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200/60 bg-white p-8 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Vincular estabelecimentos</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500 dark:text-zinc-400">
            Pesquise os lugares ativos da plataforma e solicite a vinculacao com a sua curadoria. O estabelecimento continua sendo global da Vizoor; aqui voce apenas pede associacao ao seu perfil.
          </p>

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nome, endereco ou categoria"
            className="mt-6 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition focus:border-[#1a8ccc] dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-white"
          />
        </div>

        <div className="grid gap-4">
          {estabelecimentosFiltrados.map((estabelecimento) => {
            const link = linkPorEstabelecimentoId.get(estabelecimento.id);
            const isSubmitting = isSubmittingId === estabelecimento.id;
            const statusLabel = link?.status === "ativo"
              ? "Vinculado"
              : link?.status === "pendente"
              ? "Em analise"
              : link?.status === "rejeitado"
              ? "Rejeitado"
              : link?.status === "removido"
              ? "Removido"
              : null;

            return (
              <article
                key={estabelecimento.id}
                className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex gap-4">
                    {estabelecimento.logoUrl ? (
                      <img
                        src={estabelecimento.logoUrl}
                        alt={estabelecimento.nome}
                        className="h-16 w-16 rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1a8ccc]/10 text-[#1a8ccc]">
                        <Store className="h-6 w-6" />
                      </div>
                    )}

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">{estabelecimento.nome}</h2>
                        {statusLabel && (
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">
                            {statusLabel}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-zinc-400">
                        {estabelecimento.descricao || "Estabelecimento ativo no mapa global da Vizoor."}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-zinc-400">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 capitalize dark:border-zinc-800 dark:bg-zinc-950/60">
                          <MapPin className="h-3.5 w-3.5 text-[#1a8ccc]" />
                          {estabelecimento.endereco}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 capitalize dark:border-zinc-800 dark:bg-zinc-950/60">
                          {estabelecimento.categoria.replace(/_/g, " ")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {link?.status === "ativo" ? (
                      <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                        Ja vinculado
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => solicitarVinculo(estabelecimento.id)}
                        disabled={isSubmitting || link?.status === "pendente"}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#1a8ccc] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1572a6] disabled:opacity-60"
                      >
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                        {link?.status === "pendente" ? "Aguardando analise" : "Solicitar vinculo"}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}

          {estabelecimentosFiltrados.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500 dark:border-zinc-800 dark:text-zinc-400">
              Nenhum estabelecimento ativo encontrado para este filtro.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

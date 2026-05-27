"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Loader2, Save, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  atualizarPerfilCriador,
  criarPerfilCriador,
  obterCriadorPorUserId,
  type CreatorProfile,
} from "@/services/firebase";
import { useToast } from "@/components/ui/Toast";

const REDES_SOCIAIS_PADRAO = {
  instagram: "",
  tiktok: "",
  youtube: "",
  site: "",
};

const LINKS_EXTERNOS_INICIAIS = [
  { titulo: "", url: "" },
  { titulo: "", url: "" },
];

export default function CriadorPerfilPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { user, profile, isLoggedIn, loading } = useAuth();

  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(null);
  const [nomePublico, setNomePublico] = useState("");
  const [slug, setSlug] = useState("");
  const [bioCurta, setBioCurta] = useState("");
  const [bioCompleta, setBioCompleta] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [capaUrl, setCapaUrl] = useState("");
  const [redesSociais, setRedesSociais] = useState<Record<string, string>>(REDES_SOCIAIS_PADRAO);
  const [linksExternos, setLinksExternos] = useState(LINKS_EXTERNOS_INICIAIS);
  const [roteiroCuradoria, setRoteiroCuradoria] = useState("");
  const [favoritosText, setFavoritosText] = useState("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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

    if (!user) return;

    let active = true;

    obterCriadorPorUserId(user.uid)
      .then((existingProfile) => {
        if (!active) return;

        setCreatorProfile(existingProfile);
        setNomePublico(existingProfile?.nomePublico || profile?.nome || user.displayName || "");
        setSlug(existingProfile?.slug || "");
        setBioCurta(existingProfile?.bioCurta || "");
        setBioCompleta(existingProfile?.bioCompleta || "");
        setCidade(existingProfile?.cidade || "");
        setEstado(existingProfile?.estado || "SP");
        setAvatarUrl(existingProfile?.avatarUrl || profile?.foto || user.photoURL || "");
        setCapaUrl(existingProfile?.capaUrl || "");
        setRedesSociais({
          ...REDES_SOCIAIS_PADRAO,
          ...(existingProfile?.redesSociais || {}),
        });
        setLinksExternos(
          existingProfile?.linksExternos && existingProfile.linksExternos.length > 0
            ? [...existingProfile.linksExternos, ...LINKS_EXTERNOS_INICIAIS].slice(0, 3)
            : LINKS_EXTERNOS_INICIAIS
        );
        setRoteiroCuradoria(existingProfile?.roteiroCuradoria || "");
        setFavoritosText((existingProfile?.favoritos || []).join("\n"));
      })
      .catch((error) => {
        console.error("Erro ao carregar perfil do criador:", error);
        showToast("warning", "Erro", "Nao foi possivel carregar o perfil do criador.");
      })
      .finally(() => {
        if (active) {
          setIsLoadingProfile(false);
        }
      });

    return () => {
      active = false;
    };
  }, [isLoggedIn, loading, profile, router, showToast, user]);

  const handleSave = async () => {
    if (!user) return;

    if (!nomePublico.trim() || !slug.trim() || !bioCurta.trim()) {
      showToast("warning", "Campos obrigatorios", "Preencha nome publico, slug e bio curta.");
      return;
    }

    setIsSaving(true);

    const redesSociaisLimpas = Object.fromEntries(
      Object.entries(redesSociais).filter(([, value]) => value.trim())
    );
    const linksExternosLimpos = linksExternos
      .map((link) => ({ titulo: link.titulo.trim(), url: link.url.trim() }))
      .filter((link) => link.titulo && link.url);
    const favoritos = favoritosText
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    try {
      if (creatorProfile) {
        await atualizarPerfilCriador(creatorProfile.id, {
          nomePublico: nomePublico.trim(),
          slug,
          bioCurta: bioCurta.trim(),
          bioCompleta: bioCompleta.trim(),
          cidade: cidade.trim(),
          estado: estado.trim().toUpperCase(),
          avatarUrl: avatarUrl.trim(),
          capaUrl: capaUrl.trim(),
          redesSociais: redesSociaisLimpas,
          linksExternos: linksExternosLimpos,
          roteiroCuradoria: roteiroCuradoria.trim(),
          favoritos,
        });
      } else {
        const creatorId = await criarPerfilCriador(user.uid, {
          slug,
          nomePublico: nomePublico.trim(),
          bioCurta: bioCurta.trim(),
          bioCompleta: bioCompleta.trim(),
          cidade: cidade.trim(),
          estado: estado.trim().toUpperCase(),
          avatarUrl: avatarUrl.trim(),
          capaUrl: capaUrl.trim(),
          redesSociais: redesSociaisLimpas,
          linksExternos: linksExternosLimpos,
          roteiroCuradoria: roteiroCuradoria.trim(),
          favoritos,
        });
        const createdProfile = await obterCriadorPorUserId(user.uid);
        setCreatorProfile(createdProfile ? { ...createdProfile, id: creatorId } : null);
      }

      const refreshedProfile = await obterCriadorPorUserId(user.uid);
      setCreatorProfile(refreshedProfile);
      if (refreshedProfile) {
        setSlug(refreshedProfile.slug);
      }

      showToast("success", "Perfil salvo", "Seu perfil publico de criador foi atualizado.");
    } catch (error: any) {
      console.error("Erro ao salvar perfil do criador:", error);
      showToast("warning", "Erro", error?.message || "Nao foi possivel salvar o perfil do criador.");
    } finally {
      setIsSaving(false);
    }
  };

  const atualizarRedeSocial = (key: string, value: string) => {
    setRedesSociais((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const atualizarLinkExterno = (index: number, field: "titulo" | "url", value: string) => {
    setLinksExternos((current) =>
      current.map((link, currentIndex) =>
        currentIndex === index
          ? { ...link, [field]: value }
          : link
      )
    );
  };

  if (loading || isLoadingProfile) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#1a8ccc]" />
        <p className="text-sm text-slate-500">Carregando perfil do criador...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 px-6 py-10 dark:bg-zinc-950/20 md:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-3xl border border-slate-200/60 bg-white p-8 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#1a8ccc]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#1a8ccc]">
            <Sparkles className="h-3.5 w-3.5" />
            Perfil publico do criador
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Configurar pagina dedicada</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-zinc-400">
            Defina o nome publico, o slug e as informacoes principais da sua pagina em formato Vizoor. Esta configuracao controla a URL publica e a apresentacao inicial do criador.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-slate-200/60 bg-white p-8 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
            <div className="grid gap-5">
              <label className="grid gap-1.5 text-sm font-semibold text-slate-700 dark:text-zinc-200">
                Nome publico
                <input
                  value={nomePublico}
                  onChange={(event) => setNomePublico(event.target.value)}
                  className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition focus:border-[#1a8ccc] dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-white"
                  placeholder="Ex: Navegando SP"
                />
              </label>

              <label className="grid gap-1.5 text-sm font-semibold text-slate-700 dark:text-zinc-200">
                Slug publico
                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-950/60">
                  <span className="border-r border-slate-200 px-4 text-sm text-slate-500 dark:border-zinc-800 dark:text-zinc-400">vizoor.com.br/</span>
                  <input
                    value={slug}
                    onChange={(event) => setSlug(event.target.value)}
                    className="h-12 flex-1 bg-transparent px-4 text-sm font-medium outline-none dark:text-white"
                    placeholder="navegandosp"
                  />
                </div>
              </label>

              <label className="grid gap-1.5 text-sm font-semibold text-slate-700 dark:text-zinc-200">
                Bio curta
                <textarea
                  value={bioCurta}
                  onChange={(event) => setBioCurta(event.target.value)}
                  rows={4}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#1a8ccc] dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-white"
                  placeholder="Descreva em poucas linhas a sua curadoria local."
                />
              </label>

              <label className="grid gap-1.5 text-sm font-semibold text-slate-700 dark:text-zinc-200">
                Manifesto ou bio completa
                <textarea
                  value={bioCompleta}
                  onChange={(event) => setBioCompleta(event.target.value)}
                  rows={5}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#1a8ccc] dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-white"
                  placeholder="Conte a sua visao de cidade, seu estilo de descoberta e o que orienta essa curadoria."
                />
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-1.5 text-sm font-semibold text-slate-700 dark:text-zinc-200">
                  Cidade
                  <input
                    value={cidade}
                    onChange={(event) => setCidade(event.target.value)}
                    className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition focus:border-[#1a8ccc] dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-white"
                    placeholder="Sao Paulo"
                  />
                </label>

                <label className="grid gap-1.5 text-sm font-semibold text-slate-700 dark:text-zinc-200">
                  Estado
                  <input
                    value={estado}
                    onChange={(event) => setEstado(event.target.value)}
                    maxLength={2}
                    className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium uppercase outline-none transition focus:border-[#1a8ccc] dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-white"
                    placeholder="SP"
                  />
                </label>
              </div>

              <label className="grid gap-1.5 text-sm font-semibold text-slate-700 dark:text-zinc-200">
                URL do avatar
                <input
                  value={avatarUrl}
                  onChange={(event) => setAvatarUrl(event.target.value)}
                  className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition focus:border-[#1a8ccc] dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-white"
                  placeholder="https://..."
                />
              </label>

              <label className="grid gap-1.5 text-sm font-semibold text-slate-700 dark:text-zinc-200">
                URL da capa
                <input
                  value={capaUrl}
                  onChange={(event) => setCapaUrl(event.target.value)}
                  className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition focus:border-[#1a8ccc] dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-white"
                  placeholder="https://..."
                />
              </label>

              <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-5 dark:border-zinc-800 dark:bg-zinc-950/40">
                <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500 dark:text-zinc-400">Redes sociais</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {[
                    { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/seuperfil" },
                    { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@seuperfil" },
                    { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@seucanal" },
                    { key: "site", label: "Site", placeholder: "https://seusite.com.br" },
                  ].map((item) => (
                    <label key={item.key} className="grid gap-1.5 text-sm font-semibold text-slate-700 dark:text-zinc-200">
                      {item.label}
                      <input
                        value={redesSociais[item.key] || ""}
                        onChange={(event) => atualizarRedeSocial(item.key, event.target.value)}
                        className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium outline-none transition focus:border-[#1a8ccc] dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                        placeholder={item.placeholder}
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-5 dark:border-zinc-800 dark:bg-zinc-950/40">
                <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500 dark:text-zinc-400">Links externos</h2>
                <div className="mt-4 grid gap-4">
                  {linksExternos.map((link, index) => (
                    <div key={`${index}-${link.titulo}-${link.url}`} className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
                      <input
                        value={link.titulo}
                        onChange={(event) => atualizarLinkExterno(index, "titulo", event.target.value)}
                        className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium outline-none transition focus:border-[#1a8ccc] dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                        placeholder="Ex: Canal no YouTube"
                      />
                      <input
                        value={link.url}
                        onChange={(event) => atualizarLinkExterno(index, "url", event.target.value)}
                        className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium outline-none transition focus:border-[#1a8ccc] dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                        placeholder="https://..."
                      />
                    </div>
                  ))}
                </div>
              </div>

              <label className="grid gap-1.5 text-sm font-semibold text-slate-700 dark:text-zinc-200">
                Roteiro da curadoria
                <textarea
                  value={roteiroCuradoria}
                  onChange={(event) => setRoteiroCuradoria(event.target.value)}
                  rows={5}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#1a8ccc] dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-white"
                  placeholder="Monte um roteiro curto com bairros, horarios, sequencia de visitas ou dicas para explorar sua selecao."
                />
              </label>

              <label className="grid gap-1.5 text-sm font-semibold text-slate-700 dark:text-zinc-200">
                Favoritos do criador
                <textarea
                  value={favoritosText}
                  onChange={(event) => setFavoritosText(event.target.value)}
                  rows={6}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#1a8ccc] dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-white"
                  placeholder={"Um favorito por linha\nCafe para manha lenta\nAlmoco rapido perto do centro\nBar para fechar a noite"}
                />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-xl bg-[#1a8ccc] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1572a6] disabled:opacity-60"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Salvar perfil publico
              </button>
              <Link
                href="/criador/dashboard"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-950/60"
              >
                Voltar ao painel
              </Link>
            </div>
          </section>

          <aside className="rounded-3xl border border-slate-200/60 bg-white p-8 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
            <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500 dark:text-zinc-400">Preview da URL</h2>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-zinc-800 dark:bg-zinc-950/60">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-zinc-400">Endereco publico</p>
              <p className="mt-2 break-all text-base font-bold text-slate-900 dark:text-white">
                vizoor.com.br/{slug || "seu-slug"}
              </p>
              <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-zinc-300">
                Quando o perfil estiver salvo, esta sera a URL dedicada do criador dentro do ecossistema Vizoor.
              </p>
            </div>

            {creatorProfile?.slug && (
              <Link
                href={`/${creatorProfile.slug}`}
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#1a8ccc] hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                Abrir pagina publica
              </Link>
            )}

            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-5 dark:border-zinc-800">
              <p className="text-sm font-semibold text-slate-700 dark:text-zinc-200">Status atual</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-zinc-300">
                {creatorProfile ? `Perfil criado com status: ${creatorProfile.status}.` : "Voce ainda nao criou o seu perfil publico de criador."}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

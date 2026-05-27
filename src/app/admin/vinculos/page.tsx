"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Loader2, Sparkles, XCircle } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import {
  aprovarVinculoCriadorEstabelecimento,
  listarVinculosDetalhadosCriadorEstabelecimento,
  rejeitarVinculoCriadorEstabelecimento,
  type CreatorEstablishmentLink,
  type CreatorProfile,
  type Estabelecimento,
} from "@/services/firebase";

type DetailedLink = CreatorEstablishmentLink & {
  creator?: CreatorProfile;
  establishment?: Estabelecimento;
};

export default function AdminVinculosPage() {
  const { showToast } = useToast();
  const [vinculos, setVinculos] = useState<DetailedLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"pendente" | "ativo" | "rejeitado" | "todos">("pendente");

  const carregarVinculos = async () => {
    try {
      const list = await listarVinculosDetalhadosCriadorEstabelecimento();
      setVinculos(list);
    } catch (error) {
      console.error("Erro ao carregar vinculos:", error);
      showToast("warning", "Erro", "Nao foi possivel carregar os vinculos pendentes.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarVinculos();
  }, []);

  const handleAprovar = async (linkId: string) => {
    try {
      setIsLoading(true);
      await aprovarVinculoCriadorEstabelecimento(linkId);
      showToast("success", "Vinculo aprovado", "O estabelecimento ja faz parte da curadoria do criador.");
      await carregarVinculos();
    } catch (error) {
      console.error(error);
      showToast("warning", "Erro", "Falha ao aprovar o vinculo.");
      setIsLoading(false);
    }
  };

  const handleRejeitar = async (linkId: string) => {
    try {
      setIsLoading(true);
      await rejeitarVinculoCriadorEstabelecimento(linkId);
      showToast("info", "Vinculo rejeitado", "A solicitacao de curadoria foi rejeitada.");
      await carregarVinculos();
    } catch (error) {
      console.error(error);
      showToast("warning", "Erro", "Falha ao rejeitar o vinculo.");
      setIsLoading(false);
    }
  };

  const vinculosFiltrados = vinculos.filter((link) => {
    if (activeFilter === "todos") return true;
    return link.status === activeFilter;
  });

  const pendentesCount = vinculos.filter((link) => link.status === "pendente").length;
  const ativosCount = vinculos.filter((link) => link.status === "ativo").length;
  const rejeitadosCount = vinculos.filter((link) => link.status === "rejeitado").length;

  if (isLoading && vinculos.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#1a8ccc]" />
        <p className="text-sm text-slate-500">Carregando vinculos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950/20">
      <header className="border-b border-slate-200 bg-white px-6 py-6 dark:border-zinc-800 dark:bg-zinc-900 md:px-8">
        <div className="text-left">
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded-full bg-[#1a8ccc]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#1a8ccc]">
              Administrador da Plataforma
            </span>
          </div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-white">
            <Sparkles className="h-5 w-5 text-[#1a8ccc]" />
            Moderação de Vinculos
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Aprove ou rejeite as solicitacoes de associacao entre criadores e estabelecimentos.
          </p>
        </div>
      </header>

      <div className="space-y-6 px-6 py-8 md:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: "Pendentes", value: pendentesCount, color: "text-amber-500" },
            { label: "Ativos", value: ativosCount, color: "text-emerald-500" },
            { label: "Rejeitados", value: rejeitadosCount, color: "text-rose-500" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
              <p className="text-xs font-medium text-slate-400 dark:text-zinc-500">{item.label}</p>
              <p className={`mt-3 text-3xl font-black leading-none ${item.color}`}>{String(item.value).padStart(2, "0")}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 dark:border-zinc-800">
          {[
            { id: "pendente", label: `Pendentes (${pendentesCount})` },
            { id: "ativo", label: `Ativos (${ativosCount})` },
            { id: "rejeitado", label: `Rejeitados (${rejeitadosCount})` },
            { id: "todos", label: `Todos (${vinculos.length})` },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id as typeof activeFilter)}
              className={`cursor-pointer rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                activeFilter === filter.id
                  ? "bg-[#1a8ccc] text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-zinc-800/80">
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200">Solicitacoes de vinculacao</h3>
            <span className="text-xs text-slate-400">Total filtrado: {vinculosFiltrados.length}</span>
          </div>

          {vinculosFiltrados.length === 0 ? (
            <div className="p-16 text-center text-slate-400">Nenhum vinculo encontrado para este filtro.</div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-zinc-800/50">
              {vinculosFiltrados.map((link) => (
                <div key={link.id} className="flex flex-col justify-between gap-4 p-6 md:flex-row md:items-center">
                  <div className="space-y-1 text-left">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-bold text-slate-800 dark:text-white">
                        {link.creator?.nomePublico || "Criador nao encontrado"}
                      </h4>
                      <span className="text-slate-400">→</span>
                      <h4 className="text-base font-bold text-slate-800 dark:text-white">
                        {link.establishment?.nome || "Estabelecimento nao encontrado"}
                      </h4>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">
                        {link.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      slug: /{link.creator?.slug || "indefinido"}
                    </p>
                    <p className="max-w-xl text-xs leading-relaxed text-slate-500 dark:text-zinc-400">
                      {link.observacaoCuradoria || link.establishment?.descricao || "Sem observacao adicional para este vinculo."}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {link.status !== "ativo" && (
                      <button
                        onClick={() => handleAprovar(link.id)}
                        className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-emerald-600"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Aprovar
                      </button>
                    )}
                    {link.status !== "rejeitado" && (
                      <button
                        onClick={() => handleRejeitar(link.id)}
                        className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-rose-50 px-4 py-2 text-xs font-bold text-rose-500 transition-all hover:bg-rose-100 dark:bg-rose-950/20"
                      >
                        <XCircle className="h-4 w-4" />
                        Rejeitar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

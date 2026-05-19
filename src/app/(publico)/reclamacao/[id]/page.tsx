"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, MapPin, Calendar, Clock, ThumbsUp, ThumbsDown,
  Share2, Flag, MessageCircle, CheckCircle2, User, Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getReclamacao, getTimeline, votar, atualizarStatus,
  type Reclamacao, type TimelineEvent,
} from "@/services/firebase";
import { getCategoryByLabel } from "@/utils/categories";

const statusMap: Record<string, { label: string; color: string; bgColor: string; icon: string }> = {
  aberto:       { label: "Aberto",       color: "#1a8ccc", bgColor: "#E8F2F8", icon: "add_circle" },
  em_analise:   { label: "Em Análise",   color: "#8B5CF6", bgColor: "#EDE9FE", icon: "visibility" },
  em_andamento: { label: "Em Andamento", color: "#F59E0B", bgColor: "#FEF3C7", icon: "engineering" },
  resolvido:    { label: "Resolvido",    color: "#10B981", bgColor: "#D1FAE5", icon: "check_circle" },
  critico:      { label: "Crítico",      color: "#EF4444", bgColor: "#FEE2E2", icon: "error" },
};

export default function ReclamacaoDetalhe({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();

  const [reclamacao, setReclamacao] = useState<Reclamacao | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [voto, setVoto] = useState<"concordo" | "discordo" | null>(null);
  const [concordos, setConcordos] = useState(0);
  const [discordos, setDiscordos] = useState(0);
  const [fotoAtiva, setFotoAtiva] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const rec = await getReclamacao(id);
        if (rec) {
          setReclamacao(rec);
          setConcordos(rec.concordos);
          setDiscordos(rec.discordos);
          // Verifica se o user atual já votou
          if (user && rec.votantes[user.uid]) {
            setVoto(rec.votantes[user.uid]);
          }
        }
        const tl = await getTimeline(id);
        setTimeline(tl);
      } catch (err) {
        console.error("Erro ao carregar os dados da reclamação:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, user]);

  const handleVoto = async (tipo: "concordo" | "discordo") => {
    if (!isLoggedIn || !user) {
      router.push("/login");
      return;
    }
    // Otimistic UI update
    const prevVoto = voto;
    if (voto === tipo) {
      setVoto(null);
      if (tipo === "concordo") setConcordos((v) => v - 1);
      else setDiscordos((v) => v - 1);
    } else {
      if (voto === "concordo") setConcordos((v) => v - 1);
      if (voto === "discordo") setDiscordos((v) => v - 1);
      setVoto(tipo);
      if (tipo === "concordo") setConcordos((v) => v + 1);
      else setDiscordos((v) => v + 1);
    }
    // Persist to Firestore
    try {
      await votar(id, user.uid, tipo);
    } catch (err) {
      console.error("Erro ao votar:", err);
      // Revert
      setVoto(prevVoto);
      if (reclamacao) {
        setConcordos(reclamacao.concordos);
        setDiscordos(reclamacao.discordos);
      }
    }
  };

  const handleFinalizar = async () => {
    if (!user || !reclamacao) return;
    try {
      await atualizarStatus(id, "resolvido", "Marcada como resolvida pelo cidadão.", user.displayName || "Cidadão");
      // Reload
      const rec = await getReclamacao(id);
      if (rec) setReclamacao(rec);
      const tl = await getTimeline(id);
      setTimeline(tl);
    } catch (err) {
      console.error("Erro ao finalizar:", err);
    }
  };

  const formatDate = (ts: any) => {
    if (!ts) return "—";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#1a8ccc] animate-spin" />
      </div>
    );
  }

  if (!reclamacao) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-8 text-center">
        <span className="material-symbols-outlined text-[60px] text-[#E2E8F0] mb-4">search_off</span>
        <h2 className="text-xl font-semibold text-[#112F4E] mb-2">Reclamação não encontrada</h2>
        <p className="text-sm text-[#94A3B8] mb-6">Este registro pode ter sido removido ou o link é inválido.</p>
        <Link href="/" className="px-6 py-3 bg-[#1a8ccc] text-white rounded-xl font-medium text-sm hover:bg-[#1572a6] transition-all">
          Voltar ao Mapa
        </Link>
      </div>
    );
  }

  const st = statusMap[reclamacao.status] ?? statusMap.aberto;
  const cat = getCategoryByLabel(reclamacao.categoria);

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-[#E2E8F0]">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#FAF7F2] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#112F4E]" />
          </button>
          <h1 className="text-sm font-semibold text-[#112F4E]">Reclamação</h1>
          <div className="flex items-center gap-1">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#FAF7F2] transition-colors">
              <Share2 className="w-4.5 h-4.5 text-[#94A3B8]" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#FAF7F2] transition-colors">
              <Flag className="w-4.5 h-4.5 text-[#94A3B8]" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 pb-32">
        {/* Photos carousel */}
        {reclamacao.fotos.length > 0 && (
          <section className="mt-4">
            <div className="relative rounded-2xl overflow-hidden bg-[#E2E8F0] aspect-[16/10]">
              <img
                src={reclamacao.fotos[fotoAtiva]}
                alt={reclamacao.titulo}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                {fotoAtiva + 1}/{reclamacao.fotos.length}
              </div>
            </div>
            {reclamacao.fotos.length > 1 && (
              <div className="flex gap-2 mt-2">
                {reclamacao.fotos.map((foto, i) => (
                  <button
                    key={i}
                    onClick={() => setFotoAtiva(i)}
                    className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                      fotoAtiva === i
                        ? "border-[#1a8ccc] shadow-md"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={foto} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Status + Category Badge */}
        <section className="mt-6 flex items-center gap-2 flex-wrap">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ backgroundColor: st.color + "18", color: st.color }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: st.color }} />
            {st.label}
          </span>
          <span
            className="px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: cat?.bgLight ?? "#E8F2F8", color: cat?.color ?? "#1a8ccc" }}
          >
            {reclamacao.categoria}
          </span>
          {reclamacao.subcategoria && (
            <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#FAF7F2] text-[#4A5D70] border border-[#E2E8F0]">
              {reclamacao.subcategoria}
            </span>
          )}
        </section>

        {/* Title + Description */}
        <section className="mt-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#112F4E] tracking-tight">
            {reclamacao.titulo}
          </h2>
          <p className="mt-3 text-[#4A5D70] text-base leading-relaxed font-light">
            {reclamacao.descricao}
          </p>
        </section>

        {/* Meta Info */}
        <section className="mt-6 space-y-3">
          <div className="flex items-center gap-3 text-sm text-[#4A5D70]">
            <MapPin className="w-4 h-4 text-[#94A3B8] shrink-0" />
            <span>{reclamacao.endereco}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-[#4A5D70]">
            <Calendar className="w-4 h-4 text-[#94A3B8] shrink-0" />
            <span>Criada em {formatDate(reclamacao.criadoEm)}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-[#4A5D70]">
            <Clock className="w-4 h-4 text-[#94A3B8] shrink-0" />
            <span>Última atualização em {formatDate(reclamacao.atualizadoEm)}</span>
          </div>
          {!reclamacao.anonimo && (
            <div className="flex items-center gap-3 text-sm text-[#4A5D70]">
              {reclamacao.autorFoto ? (
                <img src={reclamacao.autorFoto} alt="" className="w-5 h-5 rounded-full object-cover" />
              ) : (
                <User className="w-4 h-4 text-[#94A3B8] shrink-0" />
              )}
              <span>Reportado por <strong className="text-[#112F4E]">{reclamacao.autorNome}</strong></span>
            </div>
          )}
        </section>

        {/* Voting Section */}
        <section className="mt-8 p-5 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">
          <h3 className="text-sm font-semibold text-[#112F4E] mb-1">
            Você também percebe este problema?
          </h3>
          <p className="text-xs text-[#94A3B8] mb-4">
            Sua validação ajuda a priorizar a resolução.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => handleVoto("concordo")}
              className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-medium text-sm transition-all active:scale-[0.97] ${
                voto === "concordo"
                  ? "bg-[#10B981] text-white shadow-md"
                  : "bg-[#FAF7F2] text-[#4A5D70] border border-[#E2E8F0] hover:border-[#10B981] hover:text-[#10B981]"
              }`}
            >
              <ThumbsUp className="w-4.5 h-4.5" />
              <span>Concordo</span>
              <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                voto === "concordo" ? "bg-white/20" : "bg-[#E2E8F0]"
              }`}>{concordos}</span>
            </button>
            <button
              onClick={() => handleVoto("discordo")}
              className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-medium text-sm transition-all active:scale-[0.97] ${
                voto === "discordo"
                  ? "bg-[#EF4444] text-white shadow-md"
                  : "bg-[#FAF7F2] text-[#4A5D70] border border-[#E2E8F0] hover:border-[#EF4444] hover:text-[#EF4444]"
              }`}
            >
              <ThumbsDown className="w-4.5 h-4.5" />
              <span>Discordo</span>
              <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                voto === "discordo" ? "bg-white/20" : "bg-[#E2E8F0]"
              }`}>{discordos}</span>
            </button>
          </div>
        </section>

        {/* Timeline */}
        <section className="mt-8">
          <h3 className="text-sm font-semibold text-[#112F4E] mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#94A3B8]">timeline</span>
            Histórico de Atendimento
          </h3>
          <div className="relative pl-8">
            <div className="absolute left-[15px] top-3 bottom-3 w-0.5 bg-[#E2E8F0]" />
            <div className="space-y-6">
              {timeline.map((step, i) => {
                const stepSt = statusMap[step.status] ?? { label: step.status, color: "#1a8ccc", bgColor: "#E8F2F8", icon: "circle" };
                return (
                  <div key={i} className="relative">
                    <div
                      className="absolute -left-8 top-0.5 w-[30px] h-[30px] rounded-lg flex items-center justify-center z-10"
                      style={{ backgroundColor: stepSt.bgColor }}
                    >
                      <span className="material-symbols-outlined text-[16px]" style={{ color: stepSt.color }}>
                        {stepSt.icon}
                      </span>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-sm ml-2">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-semibold text-[#112F4E]">{step.status}</h4>
                        <span className="text-[11px] text-[#94A3B8]">{formatDate(step.criadoEm)}</span>
                      </div>
                      <p className="text-sm text-[#4A5D70] font-light">{step.descricao}</p>
                      {step.user && step.user !== "Sistema" && (
                        <p className="text-xs text-[#94A3B8] mt-1">Por: {step.user}</p>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Pending step se não está resolvida */}
              {reclamacao.status !== "resolvido" && (
                <div className="relative opacity-50">
                  <div className="absolute -left-8 top-0.5 w-[30px] h-[30px] rounded-lg flex items-center justify-center z-10 bg-[#F5F2ED]">
                    <span className="material-symbols-outlined text-[16px] text-[#94A3B8]">check_circle</span>
                  </div>
                  <div className="bg-white/50 rounded-xl p-4 border border-dashed border-[#E2E8F0] ml-2">
                    <h4 className="text-sm font-medium text-[#94A3B8]">Resolvida</h4>
                    <p className="text-sm text-[#94A3B8] font-light">Aguardando resolução...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Finalize Button */}
        {reclamacao.status !== "resolvido" && isLoggedIn && (user?.uid === reclamacao.autorId) && (
          <section className="mt-8 p-5 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
              <h3 className="text-sm font-semibold text-[#112F4E]">Finalizar Reclamação</h3>
            </div>
            <p className="text-xs text-[#4A5D70] font-light mb-4">
              Se o problema foi resolvido, você pode marcar esta reclamação como finalizada.
            </p>
            <button
              onClick={handleFinalizar}
              className="w-full py-3.5 rounded-xl bg-[#10B981] text-white font-medium text-sm shadow-sm hover:bg-[#059669] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Marcar como Resolvida
            </button>
          </section>
        )}
      </div>

      {/* Bottom sticky bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-xl border-t border-[#E2E8F0] p-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[#10B981]">
              <ThumbsUp className="w-4 h-4" />
              <span className="text-sm font-bold">{concordos}</span>
            </div>
            <span className="text-[#E2E8F0]">|</span>
            <div className="flex items-center gap-1.5 text-[#94A3B8]">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">0</span>
            </div>
          </div>
          <button
            onClick={() => handleVoto("concordo")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all active:scale-95 ${
              voto === "concordo"
                ? "bg-[#10B981] text-white"
                : "bg-[#1a8ccc] text-white hover:bg-[#1572a6]"
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            {voto === "concordo" ? "Concordado!" : "Concordar"}
          </button>
        </div>
      </div>
    </div>
  );
}

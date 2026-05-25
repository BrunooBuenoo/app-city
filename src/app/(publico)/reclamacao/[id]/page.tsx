"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, MapPin, Calendar, Clock, ThumbsUp,
  Share2, Flag, CheckCircle2, User, Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getReclamacao, getTimeline, votar, atualizarStatus,
  getConcordantes,
  type Reclamacao, type TimelineEvent, type Concordante,
} from "@/services/firebase";
import { getCategoryByLabel } from "@/utils/categories";
import { Map, MapMarker, MarkerContent, MapControls } from "@/components/ui/map";
import ConcordantesModal from "@/components/ui/modal/ConcordantesModal";

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
  const { user, profile, isLoggedIn } = useAuth();

  const [reclamacao, setReclamacao] = useState<Reclamacao | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [voto, setVoto] = useState<"concordo" | null>(null);
  const [concordos, setConcordos] = useState(0);
  const [fotoAtiva, setFotoAtiva] = useState(0);

  // Concordantes modal
  const [showConcordantes, setShowConcordantes] = useState(false);
  const [concordantesList, setConcordantesList] = useState<Concordante[]>([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const rec = await getReclamacao(id);
        if (rec) {
          setReclamacao(rec);
          setConcordos(rec.concordos);
          // Extrair concordantes
          const lista = getConcordantes(rec);
          setConcordantesList(lista);
          if (user && rec.votantes[user.uid]) {
            const v = rec.votantes[user.uid];
            const tipo = typeof v === "string" ? v : (v as any)?.tipo;
            if (tipo === "concordo") setVoto("concordo");
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

  const handleVoto = async () => {
    if (!isLoggedIn || !user) {
      router.push("/login");
      return;
    }
    const prevVoto = voto;
    const prevConcordos = concordos;
    if (voto === "concordo") {
      setVoto(null);
      setConcordos((v) => v - 1);
    } else {
      setVoto("concordo");
      setConcordos((v) => v + 1);
    }
    try {
      await votar(id, user.uid, "concordo", user.displayName || "Cidadão", user.photoURL || "");
      // Recarregar concordantes
      const rec = await getReclamacao(id);
      if (rec) {
        setConcordantesList(getConcordantes(rec));
      }
    } catch (err) {
      console.error("Erro ao votar:", err);
      setVoto(prevVoto);
      setConcordos(prevConcordos);
    }
  };

  const handleFinalizar = async () => {
    if (!user || !reclamacao) return;
    try {
      await atualizarStatus(id, "resolvido", "Marcada como resolvida pelo cidadão.", user.displayName || "Cidadão");
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
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#FAF7F2] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#112F4E]" />
          </button>
          <h1 className="text-sm font-semibold text-[#112F4E]">Reclamação #{reclamacao.id.substring(0, 8)}</h1>
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

      <div className="max-w-6xl mx-auto px-4 py-8 pb-32">
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Photos carousel */}
            {reclamacao.fotos.length > 0 && (
              <section className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-sm">
                <div className="relative rounded-xl overflow-hidden bg-[#E2E8F0] aspect-[16/10]">
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
                  <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar">
                    {reclamacao.fotos.map((foto, i) => (
                      <button
                        key={i}
                        onClick={() => setFotoAtiva(i)}
                        className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
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

            {/* Title + Description */}
            <section className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-[#112F4E] tracking-tight leading-tight">
                {reclamacao.titulo}
              </h2>
              <div className="h-px bg-[#F5F2ED]" />
              <p className="text-[#4A5D70] text-sm md:text-base leading-relaxed font-light">
                {reclamacao.descricao}
              </p>
            </section>

            {/* Map */}
            <section className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold text-[#112F4E] flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#94A3B8]">map</span>
                Localização no Mapa
              </h3>
              <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-inner border border-[#E2E8F0] bg-[#FAF7F2]">
                <Map center={[reclamacao.longitude || -49.9458, reclamacao.latitude || -22.2139]} zoom={15}>
                  <MapControls position="bottom-right" showZoom showLocate />
                  <MapMarker latitude={reclamacao.latitude || -22.2139} longitude={reclamacao.longitude || -49.9458}>
                    <MarkerContent>
                      <div className="relative">
                        <div 
                          className="absolute -inset-1.5 rounded-full animate-ping opacity-35" 
                          style={{ backgroundColor: cat?.color || "#1a8ccc" }}
                        />
                        <div 
                          className="w-4.5 h-4.5 rounded-full border-3 border-white shadow relative z-10" 
                          style={{ backgroundColor: cat?.color || "#1a8ccc" }}
                        />
                      </div>
                    </MarkerContent>
                  </MapMarker>
                </Map>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-[#4A5D70]">
                <MapPin className="w-4 h-4 text-[#94A3B8] shrink-0" />
                <span>{reclamacao.endereco}</span>
              </div>
            </section>

            {/* Timeline */}
            <section className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-[#112F4E] mb-5 flex items-center gap-2">
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
                        <div className="bg-[#FAF7F2] rounded-xl p-4 border border-[#E2E8F0] ml-2">
                          <div className="flex items-center justify-between mb-1.5">
                            <h4 className="text-sm font-semibold text-[#112F4E]">{stepSt.label}</h4>
                            <span className="text-[10px] text-[#94A3B8]">{formatDate(step.criadoEm)}</span>
                          </div>
                          <p className="text-xs md:text-sm text-[#4A5D70] font-light leading-relaxed">{step.descricao}</p>
                          {step.user && step.user !== "Sistema" && (
                            <p className="text-[10px] text-[#94A3B8] mt-1.5">Por: {step.user}</p>
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
                      <div className="bg-[#FAF7F2]/55 rounded-xl p-4 border border-dashed border-[#E2E8F0] ml-2">
                        <h4 className="text-sm font-medium text-[#94A3B8]">Resolvida</h4>
                        <p className="text-xs text-[#94A3B8] font-light">Aguardando providências...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Right Column (col-span-5) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* Status & Categorization Card */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm space-y-4">
              <div>
                <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-2">
                  Status e Categorias
                </span>
                <div className="flex gap-2 flex-wrap">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: st.color + "18", color: st.color }}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: st.color }} />
                    {st.label}
                  </span>
                  <span
                    className="px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: cat?.bgLight ?? "#E8F2F8", color: cat?.color ?? "#1a8ccc" }}
                  >
                    {reclamacao.categoria}
                  </span>
                  {reclamacao.subcategoria && (
                    <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#FAF7F2] text-[#4A5D70] border border-[#E2E8F0]">
                      {reclamacao.subcategoria}
                    </span>
                  )}
                </div>
              </div>

              <div className="border-t border-[#F5F2ED] pt-4 space-y-2">
                <div className="flex items-center gap-2.5 text-xs text-[#4A5D70]">
                  <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" />
                  <span>Criada: {formatDate(reclamacao.criadoEm)}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#4A5D70]">
                  <Clock className="w-3.5 h-3.5 text-[#94A3B8]" />
                  <span>Atualizada: {formatDate(reclamacao.atualizadoEm)}</span>
                </div>
                {!reclamacao.anonimo && (
                  <div className="flex items-center gap-2.5 text-xs text-[#4A5D70]">
                    {reclamacao.autorFoto ? (
                      <img src={reclamacao.autorFoto} alt="" className="w-4 h-4 rounded-full object-cover" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-[#94A3B8]" />
                    )}
                    <span>Por: <strong className="text-[#112F4E]">{reclamacao.autorNome}</strong></span>
                  </div>
                )}
              </div>
            </div>

            {/* Voting / Citizen Validation Section — SOMENTE CONCORDO */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold text-[#112F4E]">
                Este problema afeta você também?
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Votos de apoio ajudam a sinalizar e dar relevância cívica ao problema.
              </p>
              
              {/* Botão de concordar */}
              <button
                onClick={handleVoto}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all active:scale-[0.97] cursor-pointer ${
                  voto === "concordo"
                    ? "bg-[#10B981] text-white shadow-sm"
                    : "bg-[#FAF7F2] text-[#4A5D70] border border-[#E2E8F0] hover:border-[#10B981] hover:text-[#10B981]"
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{voto === "concordo" ? "Concordado!" : "Concordar"}</span>
                <span className={`ml-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  voto === "concordo" ? "bg-white/25" : "bg-[#E2E8F0]"
                }`}>{concordos}</span>
              </button>

              {/* Quem concordou — clicável estilo Instagram */}
              {concordos > 0 && (
                <button
                  onClick={() => setShowConcordantes(true)}
                  className="w-full flex items-center gap-3 py-3 px-4 rounded-xl bg-[#FAF7F2] border border-[#E2E8F0] hover:bg-[#F1F5F9] transition-colors cursor-pointer group"
                >
                  {/* Stack de avatares */}
                  <div className="flex -space-x-2">
                    {concordantesList.slice(0, 3).map((c, i) => (
                      <div
                        key={c.uid}
                        className="w-7 h-7 rounded-full border-2 border-white overflow-hidden bg-[#E8F2F8] shadow-sm"
                        style={{ zIndex: 3 - i }}
                      >
                        {c.foto ? (
                          <img src={c.foto} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#1a8ccc] to-[#1572a6] flex items-center justify-center text-white text-[10px] font-bold">
                            {c.nome.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    ))}
                    {concordantesList.length > 3 && (
                      <div className="w-7 h-7 rounded-full border-2 border-white bg-[#E2E8F0] flex items-center justify-center text-[9px] font-bold text-[#4A5D70]">
                        +{concordantesList.length - 3}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-[#4A5D70] group-hover:text-[#112F4E] transition-colors">
                    <strong className="font-semibold">{concordos}</strong> {concordos === 1 ? "pessoa concordou" : "pessoas concordaram"}
                  </span>
                  <span className="material-symbols-outlined text-[14px] text-[#94A3B8] ml-auto">chevron_right</span>
                </button>
              )}
            </div>

            {/* Author Close Action */}
            {reclamacao.status !== "resolvido" && isLoggedIn && (user?.uid === reclamacao.autorId) && (
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm space-y-3">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                  <h3 className="text-sm font-semibold text-[#112F4E]">Resolver Reclamação</h3>
                </div>
                <p className="text-xs text-[#4A5D70] font-light">
                  Se este problema já foi solucionado por ações comunitárias ou outras vias, marque-o como finalizado.
                </p>
                <button
                  onClick={handleFinalizar}
                  className="w-full py-3 rounded-xl bg-[#10B981] text-white font-medium text-xs shadow-sm hover:bg-[#059669] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Finalizar Reclamação
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Bottom sticky bar — SOMENTE CONCORDO */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-xl border-t border-[#E2E8F0] p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setShowConcordantes(true)}
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-1.5 text-[#10B981]">
              <ThumbsUp className="w-4 h-4" />
              <span className="text-sm font-bold">{concordos}</span>
            </div>
            {concordantesList.length > 0 && (
              <>
                <span className="text-[#E2E8F0]">|</span>
                <div className="flex -space-x-1.5">
                  {concordantesList.slice(0, 3).map((c) => (
                    <div key={c.uid} className="w-5 h-5 rounded-full border border-white overflow-hidden bg-[#E8F2F8]">
                      {c.foto ? (
                        <img src={c.foto} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[#1a8ccc] flex items-center justify-center text-white text-[7px] font-bold">
                          {c.nome.charAt(0)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </button>
          <button
            onClick={handleVoto}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all active:scale-95 cursor-pointer ${
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

      {/* Modal de Concordantes */}
      <ConcordantesModal
        isOpen={showConcordantes}
        onClose={() => setShowConcordantes(false)}
        concordantes={concordantesList}
      />
    </div>
  );
}

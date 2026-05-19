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
  adicionarComentario, onComentariosChange,
  type Reclamacao, type TimelineEvent,
} from "@/services/firebase";
import { getCategoryByLabel } from "@/utils/categories";
import { Map, MapMarker, MarkerContent, MapControls } from "@/components/ui/map";

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

  // Comentários
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [novoComentario, setNovoComentario] = useState("");
  const [enviandoComentario, setEnviandoComentario] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const rec = await getReclamacao(id);
        if (rec) {
          setReclamacao(rec);
          setConcordos(rec.concordos);
          setDiscordos(rec.discordos);
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

  // Real-time comments listener
  useEffect(() => {
    const unsubscribe = onComentariosChange(id, (items) => {
      setComentarios(items);
    });
    return () => unsubscribe();
  }, [id]);

  const handleVoto = async (tipo: "concordo" | "discordo") => {
    if (!isLoggedIn || !user) {
      router.push("/login");
      return;
    }
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
    try {
      await votar(id, user.uid, tipo);
    } catch (err) {
      console.error("Erro ao votar:", err);
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
      const rec = await getReclamacao(id);
      if (rec) setReclamacao(rec);
      const tl = await getTimeline(id);
      setTimeline(tl);
    } catch (err) {
      console.error("Erro ao finalizar:", err);
    }
  };

  const handleEnviarComentario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn || !user || !novoComentario.trim()) return;
    setEnviandoComentario(true);
    try {
      await adicionarComentario(
        id,
        user.uid,
        user.displayName || "Cidadão",
        user.photoURL || "",
        novoComentario.trim()
      );
      setNovoComentario("");
    } catch (err) {
      console.error("Erro ao enviar comentário:", err);
    } finally {
      setEnviandoComentario(false);
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
                        <div className="absolute -inset-1.5 rounded-full bg-[#1a8ccc]/35 animate-ping" />
                        <div className="w-4.5 h-4.5 rounded-full border-3 border-white shadow bg-[#1a8ccc] relative z-10" />
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

            {/* Seção de Comentários */}
            <section className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold text-[#112F4E] flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#94A3B8]" />
                Comentários da Comunidade ({comentarios.length})
              </h3>
              
              {/* Lista de Comentários */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {comentarios.length === 0 ? (
                  <p className="text-xs text-[#94A3B8] py-6 font-light text-center">
                    Nenhum comentário ainda. Comece a discussão!
                  </p>
                ) : (
                  comentarios.map((c) => (
                    <div key={c.id} className="flex gap-3 bg-[#FAF7F2] p-3 rounded-xl border border-[#E2E8F0]/80">
                      <div className="w-8 h-8 rounded-full bg-[#1a8ccc]/10 flex items-center justify-center shrink-0 overflow-hidden border border-[#E2E8F0]">
                        {c.autorFoto ? (
                          <img src={c.autorFoto} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-[#1a8ccc] flex items-center justify-center text-white text-xs font-semibold">
                            {c.autorNome ? c.autorNome.charAt(0).toUpperCase() : "?"}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className="text-xs font-bold text-[#112F4E] truncate">{c.autorNome}</span>
                          <span className="text-[9px] text-[#94A3B8] shrink-0">{formatDate(c.criadoEm)}</span>
                        </div>
                        <p className="text-xs text-[#4A5D70] font-light leading-relaxed whitespace-pre-wrap">{c.texto}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Form de Comentário */}
              <div className="border-t border-[#F5F2ED] pt-4">
                {isLoggedIn ? (
                  <form onSubmit={handleEnviarComentario} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Adicione um comentário..."
                      value={novoComentario}
                      onChange={(e) => setNovoComentario(e.target.value)}
                      disabled={enviandoComentario}
                      className="flex-1 px-3 py-2 bg-[#FAF7F2] border border-[#E2E8F0] rounded-xl text-xs text-[#112F4E] placeholder:text-[#94A3B8] outline-none focus:border-[#1a8ccc] transition-all"
                    />
                    <button
                      type="submit"
                      disabled={enviandoComentario || !novoComentario.trim()}
                      className="px-4 py-2 bg-[#1a8ccc] hover:bg-[#1572a6] disabled:bg-gray-300 text-white font-semibold text-xs rounded-xl shadow-sm transition-all active:scale-[0.98] cursor-pointer shrink-0"
                    >
                      Enviar
                    </button>
                  </form>
                ) : (
                  <p className="text-xs text-[#94A3B8] text-center font-light py-1.5">
                    Você precisa{" "}
                    <Link href="/login" className="text-[#1a8ccc] font-bold hover:underline">
                      fazer login
                    </Link>{" "}
                    para comentar.
                  </p>
                )}
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

            {/* Voting / Citizen Validation Section */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold text-[#112F4E]">
                Este problema afeta você também?
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Votos de apoio ajudam a sinalizar a importância do problema para a prefeitura.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleVoto("concordo")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-xs transition-all active:scale-[0.97] cursor-pointer ${
                    voto === "concordo"
                      ? "bg-[#10B981] text-white shadow-sm"
                      : "bg-[#FAF7F2] text-[#4A5D70] border border-[#E2E8F0] hover:border-[#10B981] hover:text-[#10B981]"
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>Concordo</span>
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    voto === "concordo" ? "bg-white/25" : "bg-[#E2E8F0]"
                  }`}>{concordos}</span>
                </button>
                <button
                  onClick={() => handleVoto("discordo")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-xs transition-all active:scale-[0.97] cursor-pointer ${
                    voto === "discordo"
                      ? "bg-[#EF4444] text-white shadow-sm"
                      : "bg-[#FAF7F2] text-[#4A5D70] border border-[#E2E8F0] hover:border-[#EF4444] hover:text-[#EF4444]"
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span>Discordo</span>
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    voto === "discordo" ? "bg-white/25" : "bg-[#E2E8F0]"
                  }`}>{discordos}</span>
                </button>
              </div>
            </div>

            {/* Author Close Action */}
            {reclamacao.status !== "resolvido" && isLoggedIn && (user?.uid === reclamacao.autorId) && (
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm space-y-3">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                  <h3 className="text-sm font-semibold text-[#112F4E]">Resolver Reclamação</h3>
                </div>
                <p className="text-xs text-[#4A5D70] font-light">
                  Se a prefeitura ou a comunidade já resolveu este problema, marque-o como finalizado.
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

      {/* Bottom sticky bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-xl border-t border-[#E2E8F0] p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[#10B981]">
              <ThumbsUp className="w-4 h-4" />
              <span className="text-sm font-bold">{concordos}</span>
            </div>
            <span className="text-[#E2E8F0]">|</span>
            <div className="flex items-center gap-1.5 text-[#94A3B8]">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">{comentarios.length}</span>
            </div>
          </div>
          <button
            onClick={() => handleVoto("concordo")}
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
    </div>
  );
}

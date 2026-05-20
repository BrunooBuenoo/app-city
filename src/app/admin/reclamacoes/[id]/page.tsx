"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, MapPin, Calendar, Clock, User, ThumbsUp,
  CheckCircle2, AlertCircle, ChevronDown, Send, Eye,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getReclamacao, getTimeline, atualizarStatus, type Reclamacao, type TimelineEvent } from "@/services/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/services/firebase/config";
import { Map, MapMarker, MarkerContent, MapControls } from "@/components/ui/map";
import { getCategoryByLabel } from "@/utils/categories";

const statusList = [
  { id: "aberto", label: "Aberto", color: "#1a8ccc", icon: "inbox" },
  { id: "em_analise", label: "Em Análise", color: "#8B5CF6", icon: "visibility" },
  { id: "em_andamento", label: "Em Andamento", color: "#F59E0B", icon: "engineering" },
  { id: "resolvido", label: "Resolvido", color: "#10B981", icon: "check_circle" },
  { id: "critico", label: "Crítico", color: "#EF4444", icon: "warning" },
];

export default function AdminReclamacaoDetalhe({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { user } = useAuth();

  const [reclamacao, setReclamacao] = useState<Reclamacao | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentStatus, setCurrentStatus] = useState<string>("aberto");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [novaObservacao, setNovaObservacao] = useState("");
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  // Carregar dados da reclamação e linha do tempo
  const carregarDados = async () => {
    try {
      const data = await getReclamacao(id);
      if (data) {
        setReclamacao(data);
        setCurrentStatus(data.status);
        const tEvents = await getTimeline(id);
        setTimeline(tEvents);
      } else {
        router.push("/admin/dashboard");
      }
    } catch (err) {
      console.error("Erro ao carregar dados do admin:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [id]);

  const handleStatusChange = async (novoStatus: any) => {
    if (!reclamacao) return;
    const oldStatusLabel = statusList.find((s) => s.id === currentStatus)?.label || currentStatus;
    const newStatusLabel = statusList.find((s) => s.id === novoStatus)?.label || novoStatus;
    
    setIsLoading(true);
    try {
      await atualizarStatus(
        id,
        novoStatus,
        `Status atualizado de "${oldStatusLabel}" para "${newStatusLabel}" por Admin.`,
        user?.displayName || "Admin"
      );
      setCurrentStatus(novoStatus);
      await carregarDados();
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar status.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendNote = async () => {
    if (!novaObservacao.trim()) return;
    setIsSubmittingNote(true);
    try {
      await addDoc(collection(db, "reclamacoes", id, "timeline"), {
        status: "Nota Administrativa",
        descricao: novaObservacao.trim(),
        user: user?.displayName || "Admin",
        criadoEm: serverTimestamp(),
      });
      setNovaObservacao("");
      await carregarDados();
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar observação.");
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "—";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  if (isLoading || !reclamacao) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-[#1a8ccc] animate-spin" />
        <p className="text-sm text-[#4A5D70] font-light">Carregando dados da ocorrência...</p>
      </div>
    );
  }

  const currentStatusInfo = statusList.find((s) => s.id === currentStatus) || statusList[0];
  const cat = getCategoryByLabel(reclamacao.categoria);

  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#F5F2ED]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#FAF7F2] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4.5 h-4.5 text-[#112F4E]" />
          </button>
          <div>
            <h1 className="text-base font-semibold text-[#112F4E]">{reclamacao.titulo}</h1>
            <p className="text-xs text-[#94A3B8]">#{reclamacao.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/reclamacao/${reclamacao.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#4A5D70] border border-[#E2E8F0] rounded-lg hover:bg-[#FAF7F2] transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Ver Público
          </Link>
        </div>
      </header>

      <div className="px-6 pb-8">
        <div className="flex flex-col lg:flex-row gap-6 pt-4 items-start">
          {/* Main Column */}
          <div className="flex-1 space-y-6 w-full">
            {/* Photos */}
            {reclamacao.fotos.length > 0 && (
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                {reclamacao.fotos.map((foto, i) => (
                  <div
                    key={i}
                    className="w-48 h-32 rounded-xl overflow-hidden border border-[#E2E8F0] bg-[#FAF7F2] shrink-0 shadow-sm"
                  >
                    <img src={foto} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="p-5 rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
              <h3 className="text-sm font-semibold text-[#112F4E] mb-2">Descrição da Ocorrência</h3>
              <p className="text-sm text-[#4A5D70] font-light leading-relaxed">
                {reclamacao.descricao}
              </p>
            </div>

            {/* Map Preview */}
            <div className="p-5 rounded-xl border border-[#E2E8F0] bg-white shadow-sm space-y-3">
              <h3 className="text-sm font-semibold text-[#112F4E]">Coordenadas de Localização</h3>
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
                          className="w-4 h-4 rounded-full border-3 border-white shadow relative z-10" 
                          style={{ backgroundColor: cat?.color || "#1a8ccc" }}
                        />
                      </div>
                    </MarkerContent>
                  </MapMarker>
                </Map>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#4A5D70] font-light">
                <MapPin className="w-4 h-4 text-[#94A3B8] shrink-0" />
                <span>{reclamacao.endereco}</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="p-5 rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
              <h3 className="text-sm font-semibold text-[#112F4E] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#94A3B8]">
                  timeline
                </span>
                Histórico de Atendimento
              </h3>

              <div className="relative pl-8 space-y-5">
                <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-[#E2E8F0]" />

                {timeline.map((step, i) => {
                  const stepInfo = statusList.find((s) => s.id === step.status) || {
                    id: "info",
                    label: step.status,
                    color: "#64748B",
                    icon: "info",
                  };
                  return (
                    <div key={i} className="relative">
                      <div
                        className="absolute -left-8 top-0.5 w-[30px] h-[30px] rounded-lg flex items-center justify-center z-10 bg-[#FAF7F2] border border-[#E2E8F0]/65"
                      >
                        <span
                          className="material-symbols-outlined text-[14px]"
                          style={{ color: stepInfo.color }}
                        >
                          {stepInfo.icon}
                        </span>
                      </div>
                      <div className="ml-2">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="text-sm font-semibold text-[#112F4E]">{stepInfo.label}</h4>
                          <span className="text-[10px] text-[#94A3B8] bg-[#FAF7F2] px-1.5 py-0.5 rounded">
                            {step.user}
                          </span>
                        </div>
                        <p className="text-xs text-[#4A5D70] font-light leading-relaxed">{step.descricao}</p>
                        <span className="text-[10px] text-[#94A3B8] mt-1 block">{formatDate(step.criadoEm)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Add observation */}
            <div className="p-5 rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
              <h3 className="text-sm font-semibold text-[#112F4E] mb-3">
                Adicionar Observação Interna
              </h3>
              <textarea
                value={novaObservacao}
                onChange={(e) => setNovaObservacao(e.target.value)}
                placeholder="Insira notas internas ou atualizações de processos..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] bg-[#FAF7F2] text-sm text-[#112F4E] placeholder:text-[#94A3B8] focus:ring-2 focus:ring-[#1a8ccc]/20 focus:border-[#1a8ccc] outline-none transition-all resize-none"
              />
              <div className="flex justify-end mt-3">
                <button
                  onClick={handleSendNote}
                  disabled={!novaObservacao.trim() || isSubmittingNote}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#1a8ccc] text-white text-sm font-medium rounded-lg hover:bg-[#1572a6] transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                >
                  {isSubmittingNote ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  Enviar
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar — Info + Actions */}
          <div className="lg:w-[320px] space-y-4 w-full shrink-0">
            {/* Status Control */}
            <div className="p-5 rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
              <h3 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">
                Controle de Status
              </h3>
              <div className="relative">
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all hover:shadow-sm cursor-pointer"
                  style={{
                    borderColor: currentStatusInfo.color + "40",
                    backgroundColor: currentStatusInfo.color + "08",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-[18px]"
                      style={{ color: currentStatusInfo.color }}
                    >
                      {currentStatusInfo.icon}
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: currentStatusInfo.color }}
                    >
                      {currentStatusInfo.label}
                    </span>
                  </div>
                  <ChevronDown
                    className="w-4 h-4 transition-transform text-slate-500"
                    style={{
                      transform: showStatusDropdown ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>

                {showStatusDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-[#E2E8F0] shadow-lg z-20 overflow-hidden">
                    {statusList.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          handleStatusChange(s.id);
                          setShowStatusDropdown(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-4 py-3 text-sm hover:bg-[#FAF7F2] transition-colors cursor-pointer ${
                          currentStatus === s.id ? "bg-[#FAF7F2] font-semibold" : ""
                        }`}
                      >
                        <span
                          className="material-symbols-outlined text-[16px]"
                          style={{ color: s.color }}
                        >
                          {s.icon}
                        </span>
                        <span style={{ color: s.color }}>{s.label}</span>
                        {currentStatus === s.id && (
                          <CheckCircle2
                            className="w-4 h-4 ml-auto"
                            style={{ color: s.color }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Info Panel */}
            <div className="p-5 rounded-xl border border-[#E2E8F0] bg-white shadow-sm space-y-4">
              <h3 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                Metadados
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-sm">
                  <MapPin className="w-4 h-4 text-[#94A3B8] shrink-0" />
                  <span className="text-[#4A5D70] font-light leading-snug">{reclamacao.endereco}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                  <Calendar className="w-4 h-4 text-[#94A3B8] shrink-0" />
                  <span className="text-[#4A5D70] font-light">Criada: {formatDate(reclamacao.criadoEm)}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                  <Clock className="w-4 h-4 text-[#94A3B8] shrink-0" />
                  <span className="text-[#4A5D70] font-light">Atualizada: {formatDate(reclamacao.atualizadoEm)}</span>
                </div>

                <div className="pt-3 border-t border-[#F5F2ED]">
                  <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider block mb-2 font-bold">
                    Classificação
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-2.5 py-1 bg-[#E8F2F8] text-[#1a8ccc] text-xs font-semibold rounded-md">
                      {reclamacao.categoria}
                    </span>
                    {reclamacao.subcategoria && (
                      <span className="px-2.5 py-1 bg-[#FAF7F2] text-[#4A5D70] text-xs font-semibold rounded-md border border-[#E2E8F0]">
                        {reclamacao.subcategoria}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F5F2ED]">
                  <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider block mb-2 font-bold">
                    Engajamento
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <ThumbsUp className="w-4 h-4 text-[#10B981]" />
                      <span className="text-sm font-semibold text-[#112F4E]">
                        {reclamacao.concordos}
                      </span>
                    </div>
                    <span className="text-xs text-[#94A3B8]">Concordos</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Author Info */}
            <div className="p-5 rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
              <h3 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">
                Autor do Relato
              </h3>
              {reclamacao.anonimo ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E2E8F0] flex items-center justify-center text-[#94A3B8]">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#112F4E]">Anônimo</p>
                    <p className="text-xs text-[#94A3B8]">Identidade protegida</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {reclamacao.autorFoto ? (
                    <img src={reclamacao.autorFoto} alt="" className="w-10 h-10 rounded-full object-cover border border-[#E2E8F0]" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#1a8ccc] flex items-center justify-center text-white text-sm font-bold">
                      {reclamacao.autorNome.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-[#112F4E] truncate max-w-[180px]">{reclamacao.autorNome}</p>
                    <p className="text-[11px] text-[#94A3B8]">ID: {reclamacao.autorId.substring(0, 10)}...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <button
                onClick={() => handleStatusChange("resolvido")}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#10B981] text-white text-sm font-medium hover:bg-[#059669] active:scale-[0.98] transition-all cursor-pointer shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                Marcar como Resolvida
              </button>
              <button
                onClick={() => handleStatusChange("critico")}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-[#EF4444]/35 text-[#EF4444] text-sm font-medium hover:bg-[#FEE2E2] active:scale-[0.98] transition-all cursor-pointer shadow-sm"
              >
                <AlertCircle className="w-4 h-4" />
                Marcar como Crítica
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

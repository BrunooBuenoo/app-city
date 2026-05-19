"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, MapPin, Calendar, Clock, User, ThumbsUp,
  CheckCircle2, AlertCircle, ChevronDown, Send, Image as ImageIcon,
  Eye, Flag, MoreHorizontal,
} from "lucide-react";

// Mock data
const reclamacao = {
  id: "rec-001",
  titulo: "Buraco na Via",
  descricao:
    "Cratera aberta na Rua São Luiz, próximo ao número 320. O buraco apareceu após as fortes chuvas da semana passada e está causando risco para motoristas e pedestres. Já vi dois carros danificarem os pneus no local.",
  categoria: "Infraestrutura",
  subcategoria: "Pavimentação",
  status: "em_andamento",
  endereco: "Rua São Luiz, 320 - Cascata",
  criadoEm: "12 de Maio, 2026",
  atualizadoEm: "18 de Maio, 2026",
  anonimo: false,
  autor: "Maria Silva",
  autorEmail: "maria.silva@email.com",
  autorTelefone: "(14) 99999-1234",
  concordos: 28,
  discordos: 3,
  fotos: [
    "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1590496793929-36417d3117de?w=600&h=400&fit=crop",
  ],
};

const statusList = [
  { id: "aberto", label: "Aberto", color: "#1a8ccc", icon: "inbox" },
  { id: "em_analise", label: "Em Análise", color: "#8B5CF6", icon: "visibility" },
  { id: "em_andamento", label: "Em Andamento", color: "#F59E0B", icon: "engineering" },
  { id: "resolvido", label: "Resolvido", color: "#10B981", icon: "check_circle" },
  { id: "critico", label: "Crítico", color: "#EF4444", icon: "warning" },
];

const timeline = [
  {
    status: "Criada",
    data: "12 Mai 2026, 14:32",
    descricao: "Reclamação registrada por Maria Silva.",
    user: "Sistema",
    icon: "add_circle",
    color: "#1a8ccc",
    bgColor: "#E8F2F8",
  },
  {
    status: "Em Análise",
    data: "13 Mai 2026, 09:15",
    descricao: "Reclamação atribuída à Secretaria de Obras.",
    user: "Admin",
    icon: "visibility",
    color: "#8B5CF6",
    bgColor: "#EDE9FE",
  },
  {
    status: "Em Andamento",
    data: "16 Mai 2026, 11:00",
    descricao: "Equipe de manutenção designada. Previsão de reparo: 22/05.",
    user: "Admin",
    icon: "engineering",
    color: "#F59E0B",
    bgColor: "#FEF3C7",
  },
];

export default function AdminReclamacaoDetalhe() {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState("em_andamento");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [novaObservacao, setNovaObservacao] = useState("");

  const currentStatusInfo = statusList.find((s) => s.id === currentStatus)!;

  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#F5F2ED]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#FAF7F2] transition-colors"
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

      <div className="px-6 pb-6">
        <div className="flex flex-col lg:flex-row gap-6 pt-4">
          {/* Main Column */}
          <div className="flex-1 space-y-6">
            {/* Photos */}
            {reclamacao.fotos.length > 0 && (
              <div className="flex gap-3 overflow-x-auto no-scrollbar">
                {reclamacao.fotos.map((foto, i) => (
                  <div
                    key={i}
                    className="w-48 h-32 rounded-xl overflow-hidden border border-[#E2E8F0] bg-[#FAF7F2] shrink-0"
                  >
                    <img src={foto} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="p-4 rounded-xl border border-[#E2E8F0]">
              <h3 className="text-sm font-medium text-[#112F4E] mb-2">Descrição</h3>
              <p className="text-sm text-[#4A5D70] font-light leading-relaxed">
                {reclamacao.descricao}
              </p>
            </div>

            {/* Timeline */}
            <div className="p-4 rounded-xl border border-[#E2E8F0]">
              <h3 className="text-sm font-medium text-[#112F4E] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#94A3B8]">
                  timeline
                </span>
                Histórico de Atendimento
              </h3>

              <div className="relative pl-8 space-y-5">
                <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-[#E2E8F0]" />

                {timeline.map((step, i) => (
                  <div key={i} className="relative">
                    <div
                      className="absolute -left-8 top-0.5 w-[30px] h-[30px] rounded-lg flex items-center justify-center z-10"
                      style={{ backgroundColor: step.bgColor }}
                    >
                      <span
                        className="material-symbols-outlined text-[14px]"
                        style={{ color: step.color }}
                      >
                        {step.icon}
                      </span>
                    </div>
                    <div className="ml-2">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="text-sm font-semibold text-[#112F4E]">{step.status}</h4>
                        <span className="text-[10px] text-[#94A3B8] bg-[#FAF7F2] px-1.5 py-0.5 rounded">
                          {step.user}
                        </span>
                      </div>
                      <p className="text-xs text-[#4A5D70] font-light">{step.descricao}</p>
                      <span className="text-[10px] text-[#94A3B8] mt-1 block">{step.data}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add observation */}
            <div className="p-4 rounded-xl border border-[#E2E8F0]">
              <h3 className="text-sm font-medium text-[#112F4E] mb-3">
                Adicionar Observação
              </h3>
              <textarea
                value={novaObservacao}
                onChange={(e) => setNovaObservacao(e.target.value)}
                placeholder="Adicione uma nota interna ou atualização..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] bg-[#FAF7F2] text-sm text-[#112F4E] placeholder:text-[#94A3B8] focus:ring-2 focus:ring-[#1a8ccc]/20 focus:border-[#1a8ccc] outline-none transition-all resize-none"
              />
              <div className="flex justify-end mt-3">
                <button
                  disabled={!novaObservacao.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#1a8ccc] text-white text-sm font-medium rounded-lg hover:bg-[#1572a6] transition-colors disabled:opacity-40 disabled:pointer-events-none"
                >
                  <Send className="w-3.5 h-3.5" />
                  Enviar
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar — Info + Actions */}
          <div className="lg:w-[320px] space-y-4">
            {/* Status Control — Fluxo 8 */}
            <div className="p-4 rounded-xl border border-[#E2E8F0]">
              <h3 className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-3">
                Status Atual
              </h3>
              <div className="relative">
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all hover:shadow-sm"
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
                    className="w-4 h-4 transition-transform"
                    style={{
                      color: currentStatusInfo.color,
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
                          setCurrentStatus(s.id);
                          setShowStatusDropdown(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-4 py-3 text-sm hover:bg-[#FAF7F2] transition-colors ${
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

            {/* Info */}
            <div className="p-4 rounded-xl border border-[#E2E8F0] space-y-3">
              <h3 className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-1">
                Informações
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-sm">
                  <MapPin className="w-4 h-4 text-[#94A3B8] shrink-0" />
                  <span className="text-[#4A5D70]">{reclamacao.endereco}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                  <Calendar className="w-4 h-4 text-[#94A3B8] shrink-0" />
                  <span className="text-[#4A5D70]">{reclamacao.criadoEm}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                  <Clock className="w-4 h-4 text-[#94A3B8] shrink-0" />
                  <span className="text-[#4A5D70]">{reclamacao.atualizadoEm}</span>
                </div>

                <div className="pt-2 border-t border-[#F5F2ED]">
                  <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider block mb-2">
                    Categoria
                  </span>
                  <div className="flex gap-2">
                    <span className="px-2.5 py-1 bg-[#E8F2F8] text-[#1a8ccc] text-xs font-medium rounded-md">
                      {reclamacao.categoria}
                    </span>
                    <span className="px-2.5 py-1 bg-[#FAF7F2] text-[#4A5D70] text-xs font-medium rounded-md border border-[#E2E8F0]">
                      {reclamacao.subcategoria}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#F5F2ED]">
                  <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider block mb-2">
                    Engajamento
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <ThumbsUp className="w-4 h-4 text-[#10B981]" />
                      <span className="text-sm font-semibold text-[#112F4E]">
                        {reclamacao.concordos}
                      </span>
                    </div>
                    <span className="text-xs text-[#94A3B8]">concordos</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Author Info */}
            <div className="p-4 rounded-xl border border-[#E2E8F0]">
              <h3 className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-3">
                Autor
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1a8ccc] flex items-center justify-center text-white text-sm font-bold">
                  {reclamacao.autor.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#112F4E]">{reclamacao.autor}</p>
                  <p className="text-xs text-[#94A3B8]">{reclamacao.autorEmail}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions — Fluxo 8 */}
            <div className="space-y-2">
              <button
                onClick={() => setCurrentStatus("resolvido")}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#10B981] text-white text-sm font-medium hover:bg-[#059669] active:scale-[0.98] transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                Marcar como Resolvida
              </button>
              <button
                onClick={() => setCurrentStatus("critico")}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-[#EF4444]/30 text-[#EF4444] text-sm font-medium hover:bg-[#FEE2E2] active:scale-[0.98] transition-all"
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

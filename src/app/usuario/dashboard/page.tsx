"use client";

import React from "react";
import Link from "next/link";
import { FileText, CheckCircle, Clock, Heart, Wrench, Lightbulb, Trash2, Droplets, TrendingUp, TrendingDown, MoreHorizontal, MoreVertical, BarChart3, ReceiptText, Filter, Calendar, Plus } from "lucide-react";

export default function UsuarioDashboard() {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1280px] mx-auto">
      {/* Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-[28px] font-bold text-[#112F4E] tracking-tight">
            Bem-vindo de volta, Cidadão
          </h1>
          <p className="text-[#94A3B8] text-[14px] md:text-[15px] mt-1">
            Acompanhe suas reclamações e veja o que acontece na cidade.
          </p>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 md:px-4 py-2.5 bg-[#FAF7F2] rounded-xl border border-[#E2E8F0] text-[13px] text-[#4A5D70]">
            <Calendar className="w-4 h-4 text-[#94A3B8]" />
            {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
          </div>
          <Link href="/reclamacao/nova">
            <button className="flex items-center gap-2 bg-[#1a8ccc] text-white text-[13px] font-semibold px-4 md:px-5 py-2.5 rounded-xl hover:bg-[#1572a6] transition-colors shadow-sm">
              <Plus className="w-4 h-4" />
              Nova Reclamação
            </button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-5 md:mb-6">
        {[
          { Icon: FileText, label: "Minhas Reclamações", value: "12", change: "+3.2%", up: true, iconBg: "bg-[#E8F2F8]", iconColor: "text-[#1a8ccc]" },
          { Icon: CheckCircle, label: "Resolvidas", value: "8", change: "Alta", up: true, iconBg: "bg-[#D1FAE5]", iconColor: "text-[#10B981]" },
          { Icon: Clock, label: "Em Andamento", value: "3", change: "-5%", up: false, iconBg: "bg-[#FEF3C7]", iconColor: "text-[#F59E0B]" },
          { Icon: Heart, label: "Concordos", value: "45", change: "+42", up: true, iconBg: "bg-[#FEE2E2]", iconColor: "text-[#EF4444]" },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-2xl border border-[#E2E8F0] p-4 md:p-6">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className={`w-8 h-8 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                <card.Icon className={`w-[18px] h-[18px] ${card.iconColor}`} strokeWidth={2.2} />
              </div>
              <button className="hidden md:block text-[#94A3B8] hover:text-[#4A5D70]">
                <MoreHorizontal className="w-[18px] h-[18px]" />
              </button>
            </div>
            <p className="text-[11px] md:text-[13px] font-medium text-[#94A3B8] md:text-[#4A5D70] mb-1">{card.label}</p>
            <h2 className="text-[24px] md:text-[32px] font-bold text-[#112F4E] tracking-tight leading-none mb-1 md:mb-2">{card.value}</h2>
            <div className="flex items-center gap-1">
              {card.up ? <TrendingUp className="w-3 h-3 text-[#10B981]" /> : <TrendingDown className="w-3 h-3 text-[#EF4444]" />}
              <span className={`text-[11px] md:text-[12px] font-semibold ${card.up ? "text-[#10B981]" : "text-[#EF4444]"}`}>{card.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 md:gap-4 mb-5 md:mb-6">
        {/* Categories */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[15px] md:text-[16px] font-semibold text-[#112F4E]">Minhas Categorias</span>
            <Link href="/usuario/minhas-reclamacoes" className="text-[13px] font-medium text-[#1a8ccc] hover:underline">Ver Todas</Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { Icon: Wrench, label: "Infraestrutura", value: "5", status: "Ativa", statusColor: "#10B981" },
              { Icon: Lightbulb, label: "Iluminação", value: "3", status: "Ativa", statusColor: "#10B981" },
              { Icon: Trash2, label: "Limpeza", value: "2", status: "Ativa", statusColor: "#10B981" },
              { Icon: Droplets, label: "Saneamento", value: "2", status: "Pendente", statusColor: "#94A3B8" },
            ].map((cat) => (
              <div key={cat.label} className="bg-[#FAF7F2] rounded-xl p-3 md:p-3.5 border border-[#E2E8F0]">
                <div className="flex items-center justify-between mb-2">
                  <cat.Icon className="w-5 h-5 text-[#4A5D70]" />
                  <button className="text-[#94A3B8] hover:text-[#4A5D70]">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[12px] md:text-[13px] font-medium text-[#4A5D70]">{cat.label}</p>
                <p className="text-[16px] md:text-[18px] font-bold text-[#112F4E] mt-0.5">{cat.value}</p>
                <p className="text-[11px] font-semibold mt-1" style={{ color: cat.statusColor }}>{cat.status}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Chart */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-[#E2E8F0] p-5 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 md:mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#E8F2F8] flex items-center justify-center">
                <BarChart3 className="w-[18px] h-[18px] text-[#1a8ccc]" />
              </div>
              <span className="text-[15px] md:text-[16px] font-semibold text-[#112F4E]">Atividade</span>
            </div>
            <select className="text-[13px] text-[#4A5D70] bg-[#FAF7F2] border border-[#E2E8F0] rounded-lg px-3 py-1.5 outline-none self-start">
              <option>Este Mês</option>
              <option>Último Mês</option>
            </select>
          </div>
          <div className="flex items-end gap-3 h-[140px] md:h-[180px]">
            {["Sem 1", "Sem 2", "Sem 3", "Sem 4"].map((label, i) => {
              const heights = [50, 75, 40, 90];
              const isHighlight = i === 3;
              return (
                <div key={label} className="flex-1 flex flex-col items-center gap-2">
                  {isHighlight && (
                    <div className="bg-[#112F4E] text-white text-[11px] font-semibold px-2 py-1 rounded-lg whitespace-nowrap mb-1">
                      +5 reclamações
                    </div>
                  )}
                  <div className="w-full">
                    <div
                      className={`w-full rounded-lg transition-all ${isHighlight ? "bg-[#1a8ccc]" : "bg-[#1a8ccc]/15 hover:bg-[#1a8ccc]/30"}`}
                      style={{ height: `${heights[i]}%`, minHeight: "24px" }}
                    />
                  </div>
                  <span className="text-[10px] md:text-[11px] text-[#94A3B8]">{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
        <div className="p-4 md:p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#E8F2F8] flex items-center justify-center">
              <ReceiptText className="w-[18px] h-[18px] text-[#1a8ccc]" />
            </div>
            <span className="text-[15px] md:text-[16px] font-semibold text-[#112F4E]">Atividade Recente</span>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-[13px] text-[#4A5D70] hover:bg-[#FAF7F2] transition-colors">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filtrar</span>
          </button>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-[#F5F2ED]">
          {[
            { Icon: Lightbulb, label: "Iluminação Pública", date: "18 Mai", local: "Centro", status: "Em Andamento", statusColor: "#F59E0B" },
            { Icon: Wrench, label: "Buraco na Via", date: "17 Mai", local: "Rua das Azaleias", status: "Resolvido", statusColor: "#10B981" },
            { Icon: Trash2, label: "Coleta de Lixo", date: "16 Mai", local: "Jd. Marília", status: "Aguardando", statusColor: "#1a8ccc" },
          ].map((row) => (
            <div key={row.label} className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 bg-[#FAF7F2] border border-[#E2E8F0] rounded-lg flex items-center justify-center shrink-0">
                <row.Icon className="w-[18px] h-[18px] text-[#4A5D70]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-[#112F4E] truncate">{row.label}</p>
                <p className="text-[12px] text-[#94A3B8]">{row.local} · {row.date}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: row.statusColor }} />
                <span className="text-[12px] font-medium" style={{ color: row.statusColor }}>{row.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-t border-b border-[#E2E8F0] bg-[#FAF7F2]">
                {["Atividade", "Data", "Localização", "Status"].map((h) => (
                  <th key={h} className="px-6 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F2ED]">
              {[
                { Icon: Lightbulb, label: "Iluminação Pública", date: "Seg, 18 Mai 2026", local: "Av. Sampaio Vidal, Centro", status: "Em Andamento", statusColor: "#F59E0B" },
                { Icon: Wrench, label: "Buraco na Via", date: "Dom, 17 Mai 2026", local: "Rua das Azaleias, 452", status: "Resolvido", statusColor: "#10B981" },
                { Icon: Trash2, label: "Coleta de Lixo", date: "Sáb, 16 Mai 2026", local: "Bairro Jd. Marília", status: "Aguardando", statusColor: "#1a8ccc" },
              ].map((row) => (
                <tr key={row.label} className="hover:bg-[#FAF7F2]/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#FAF7F2] border border-[#E2E8F0] rounded-lg flex items-center justify-center">
                        <row.Icon className="w-[16px] h-[16px] text-[#4A5D70]" />
                      </div>
                      <span className="text-[14px] font-medium text-[#112F4E]">{row.label}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[#4A5D70]">{row.date}</td>
                  <td className="px-6 py-4 text-[13px] text-[#4A5D70]">{row.local}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: row.statusColor }} />
                      <span className="text-[13px] font-medium" style={{ color: row.statusColor }}>{row.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

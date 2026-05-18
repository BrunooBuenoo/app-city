"use client";

import React from "react";
import { Inbox, Clock, CheckCircle, TrendingUp, TrendingDown, BarChart3, PieChart, ReceiptText, Filter, MoreHorizontal, Download, Calendar } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1280px] mx-auto">
      {/* Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-[28px] font-bold text-[#112F4E] tracking-tight">
            Bem-vindo de volta, Admin
          </h1>
          <p className="text-[#94A3B8] text-[14px] md:text-[15px] mt-1">
            Acompanhe as métricas da plataforma e gerencie as solicitações.
          </p>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 md:px-4 py-2.5 bg-[#FAF7F2] rounded-xl border border-[#E2E8F0] text-[13px] text-[#4A5D70]">
            <Calendar className="w-4 h-4 text-[#94A3B8]" />
            {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
          </div>
          <button className="flex items-center gap-2 bg-[#1a8ccc] text-white text-[13px] font-semibold px-4 md:px-5 py-2.5 rounded-xl hover:bg-[#1572a6] transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-5 md:mb-6">
        {[
          { Icon: Inbox, label: "Total de Reclamações", value: "1.284", change: "+3.2%", up: true, iconBg: "bg-[#E8F2F8]", iconColor: "text-[#1a8ccc]" },
          { Icon: Clock, label: "Em Aberto", value: "432", change: "-2.1%", up: false, iconBg: "bg-[#FEF3C7]", iconColor: "text-[#F59E0B]" },
          { Icon: CheckCircle, label: "Resolvidas", value: "742", change: "+4.5%", up: true, iconBg: "bg-[#D1FAE5]", iconColor: "text-[#10B981]" },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-2xl border border-[#E2E8F0] p-5 md:p-6">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                  <card.Icon className={`w-[18px] h-[18px] ${card.iconColor}`} />
                </div>
                <span className="text-[13px] md:text-[14px] font-medium text-[#4A5D70]">{card.label}</span>
              </div>
              <button className="text-[#94A3B8] hover:text-[#4A5D70]">
                <MoreHorizontal className="w-[18px] h-[18px]" />
              </button>
            </div>
            <h2 className="text-[28px] md:text-[36px] font-bold text-[#112F4E] tracking-tight leading-none mb-2">{card.value}</h2>
            <div className="flex items-center gap-1.5">
              {card.up ? <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" /> : <TrendingDown className="w-3.5 h-3.5 text-[#EF4444]" />}
              <span className={`text-[12px] font-semibold ${card.up ? "text-[#10B981]" : "text-[#EF4444]"}`}>{card.change}</span>
              <span className="text-[12px] text-[#94A3B8]">desde o mês passado</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Status — stacks on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 md:gap-4 mb-5 md:mb-6">
        {/* Chart */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-[#E2E8F0] p-5 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 md:mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#E8F2F8] flex items-center justify-center">
                <BarChart3 className="w-[18px] h-[18px] text-[#1a8ccc]" />
              </div>
              <span className="text-[15px] md:text-[16px] font-semibold text-[#112F4E]">Visão Geral</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-[#1a8ccc]" />
                <span className="text-[12px] text-[#94A3B8]">Reclamações</span>
              </div>
              <select className="text-[13px] text-[#4A5D70] bg-[#FAF7F2] border border-[#E2E8F0] rounded-lg px-3 py-1.5 outline-none">
                <option>Este Ano</option>
                <option>Último Ano</option>
              </select>
            </div>
          </div>
          <div className="flex items-end gap-1.5 md:gap-2 h-[160px] md:h-[200px]">
            {[
              { month: "Jan", h: 40 }, { month: "Fev", h: 55 }, { month: "Mar", h: 45 },
              { month: "Abr", h: 60 }, { month: "Mai", h: 50 }, { month: "Jun", h: 70 },
              { month: "Jul", h: 65 }, { month: "Ago", h: 85, highlight: true }, { month: "Set", h: 55 },
              { month: "Out", h: 45 }, { month: "Nov", h: 60 }, { month: "Dez", h: 50 },
            ].map((bar) => (
              <div key={bar.month} className="flex-1 flex flex-col items-center gap-1 md:gap-2">
                <div className="w-full relative group">
                  {bar.highlight && (
                    <div className="hidden md:block absolute -top-10 left-1/2 -translate-x-1/2 bg-[#112F4E] text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap">
                      Reclamações<br /><span className="text-[#7CC8ED]">847</span>
                    </div>
                  )}
                  <div
                    className={`w-full rounded-t-md transition-all duration-300 ${bar.highlight ? "bg-[#1a8ccc]" : "bg-[#1a8ccc]/15 hover:bg-[#1a8ccc]/30"}`}
                    style={{ height: `${bar.h}%`, minHeight: "16px" }}
                  />
                </div>
                <span className="text-[10px] md:text-[11px] text-[#94A3B8]">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] p-5 md:p-6 flex flex-col gap-3 md:gap-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-[#E8F2F8] flex items-center justify-center">
              <PieChart className="w-[18px] h-[18px] text-[#1a8ccc]" />
            </div>
            <span className="text-[15px] md:text-[16px] font-semibold text-[#112F4E]">Por Status</span>
          </div>
          {[
            { label: "Abertas", value: "432", pct: 34, color: "#1a8ccc" },
            { label: "Em Andamento", value: "23", pct: 2, color: "#F59E0B" },
            { label: "Resolvidas", value: "742", pct: 58, color: "#10B981" },
            { label: "Críticas", value: "87", pct: 6, color: "#EF4444" },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[13px] font-medium text-[#4A5D70]">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-bold text-[#112F4E]">{item.value}</span>
                  <span className="text-[11px] text-[#94A3B8]">{item.pct}%</span>
                </div>
              </div>
              <div className="w-full h-2 bg-[#F5F2ED] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
        <div className="p-4 md:p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#E8F2F8] flex items-center justify-center">
              <ReceiptText className="w-[18px] h-[18px] text-[#1a8ccc]" />
            </div>
            <span className="text-[15px] md:text-[16px] font-semibold text-[#112F4E]">Reclamações Recentes</span>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-[13px] text-[#4A5D70] hover:bg-[#FAF7F2] transition-colors">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filtrar</span>
          </button>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-[#F5F2ED]">
          {[
            { letter: "A", bg: "bg-[#E8F2F8]", color: "text-[#1a8ccc]", label: "Buraco na Via", date: "12 Out", bairro: "Cascata", status: "Crítico", statusColor: "#EF4444" },
            { letter: "B", bg: "bg-[#FEF3C7]", color: "text-[#F59E0B]", label: "Lâmpada Queimada", date: "11 Out", bairro: "Fragata", status: "Aberto", statusColor: "#1a8ccc" },
            { letter: "C", bg: "bg-[#D1FAE5]", color: "text-[#10B981]", label: "Acúmulo de Lixo", date: "10 Out", bairro: "Maria Izabel", status: "Resolvido", statusColor: "#10B981" },
            { letter: "D", bg: "bg-[#FEE2E2]", color: "text-[#EF4444]", label: "Vazamento de Esgoto", date: "09 Out", bairro: "Palmital", status: "Urgente", statusColor: "#EF4444" },
          ].map((row) => (
            <div key={row.label} className="p-4 flex items-center gap-3">
              <div className={`w-9 h-9 ${row.bg} ${row.color} rounded-lg flex items-center justify-center text-[13px] font-bold shrink-0`}>
                {row.letter}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-[#112F4E] truncate">{row.label}</p>
                <p className="text-[12px] text-[#94A3B8]">{row.bairro} · {row.date}</p>
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
                {["Atividade", "Data", "Bairro", "Status"].map((h) => (
                  <th key={h} className="px-6 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F2ED]">
              {[
                { letter: "A", bg: "bg-[#E8F2F8]", color: "text-[#1a8ccc]", label: "Buraco na Via", date: "Seg, 12 Out 2026", bairro: "Cascata", status: "Crítico", statusColor: "#EF4444" },
                { letter: "B", bg: "bg-[#FEF3C7]", color: "text-[#F59E0B]", label: "Lâmpada Queimada", date: "Dom, 11 Out 2026", bairro: "Fragata", status: "Aberto", statusColor: "#1a8ccc" },
                { letter: "C", bg: "bg-[#D1FAE5]", color: "text-[#10B981]", label: "Acúmulo de Lixo", date: "Sáb, 10 Out 2026", bairro: "Maria Izabel", status: "Resolvido", statusColor: "#10B981" },
                { letter: "D", bg: "bg-[#FEE2E2]", color: "text-[#EF4444]", label: "Vazamento de Esgoto", date: "Sex, 09 Out 2026", bairro: "Palmital", status: "Urgente", statusColor: "#EF4444" },
              ].map((row) => (
                <tr key={row.label} className="hover:bg-[#FAF7F2]/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${row.bg} ${row.color} rounded-lg flex items-center justify-center text-[13px] font-bold`}>{row.letter}</div>
                      <span className="text-[14px] font-medium text-[#112F4E]">{row.label}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[#4A5D70]">{row.date}</td>
                  <td className="px-6 py-4 text-[13px] text-[#4A5D70]">{row.bairro}</td>
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

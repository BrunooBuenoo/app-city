"use client";

import React, { useState } from "react";
import {
  BarChart3, Bell, Calendar, TrendingUp, TrendingDown,
  Inbox, Clock, CheckCircle, MoreHorizontal, Filter,
  ReceiptText, PieChart, Info, ChevronLeft, ChevronRight,
  Download,
} from "lucide-react";

const dateFilters = [
  { id: "hoje", label: "Hoje" },
  { id: "mes", label: "Esse mês" },
  { id: "30dias", label: "Últimos 30 dias" },
  { id: "90dias", label: "Últimos 90 dias" },
  { id: "total", label: "Todo o período" },
];

export default function AdminDashboard() {
  const [activeFilter, setActiveFilter] = useState("hoje");

  return (
    <>
      {/* Header — inline inside the white card */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#F5F2ED]">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#112F4E]" />
          <h1 className="text-lg font-semibold text-[#112F4E]">Dashboard</h1>
        </div>
        <button className="p-2 hover:bg-[#FAF7F2] rounded-lg transition-colors relative">
          <Bell className="w-5 h-5 text-[#94A3B8]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full ring-2 ring-white" />
        </button>
      </header>

      <div className="px-6 pb-6 space-y-4">
        {/* Date Filter Pills */}
        <div className="flex items-center gap-2 pt-4 overflow-x-auto no-scrollbar">
          {dateFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeFilter === filter.id
                  ? "bg-[#1a8ccc] text-white"
                  : "bg-white text-[#112F4E] border border-[#E2E8F0] hover:bg-[#FAF7F2]"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Stats Cards — gradient style */}
        <div className="flex flex-col sm:flex-row gap-4">
          {[
            { label: "Total de Reclamações", value: "1.284", color: "from-blue-50 to-blue-100/50", Icon: Inbox, trend: "+3.2%", up: true },
            { label: "Em Aberto", value: "432", color: "from-yellow-50 to-yellow-100/50", Icon: Clock, trend: "-2.1%", up: false },
            { label: "Resolvidas", value: "742", color: "from-green-50 to-green-100/50", Icon: CheckCircle, trend: "+4.5%", up: true },
          ].map((stat) => (
            <div key={stat.label} className={`flex-1 p-4 rounded-xl bg-gradient-to-r ${stat.color}`}>
              <div className="flex items-center gap-2 mb-2">
                <stat.Icon className="w-4 h-4 text-[#94A3B8]" />
                <p className="text-sm text-[#4A5D70]">{stat.label}</p>
              </div>
              <p className="text-2xl font-semibold text-[#112F4E]">{stat.value}</p>
              <div className="flex items-center gap-1 mt-1">
                {stat.up ? <TrendingUp className="w-3 h-3 text-[#10B981]" /> : <TrendingDown className="w-3 h-3 text-[#EF4444]" />}
                <span className={`text-xs font-medium ${stat.up ? "text-[#10B981]" : "text-[#EF4444]"}`}>{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Status Distribution Card */}
        <div className="p-4 rounded-xl border border-[#E2E8F0]">
          <div className="flex items-center gap-2 mb-3">
            <PieChart className="w-4 h-4 text-[#94A3B8]" />
            <h3 className="text-sm font-medium text-[#112F4E]">Distribuição por status</h3>
          </div>
          {/* Progress bar */}
          <div className="w-full h-3 rounded-full flex overflow-hidden mb-4">
            <div className="bg-[#1a8ccc] h-full" style={{ width: "34%" }} />
            <div className="bg-[#F59E0B] h-full" style={{ width: "2%" }} />
            <div className="bg-[#10B981] h-full" style={{ width: "58%" }} />
            <div className="bg-[#EF4444] h-full" style={{ width: "6%" }} />
          </div>
          <div className="space-y-1.5">
            {[
              { color: "#1a8ccc", label: "Abertas", value: "432" },
              { color: "#F59E0B", label: "Em Andamento", value: "23" },
              { color: "#10B981", label: "Resolvidas", value: "742" },
              { color: "#EF4444", label: "Críticas", value: "87" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-[#4A5D70]">{item.label}</span>
                </div>
                <span className="text-sm font-medium text-[#112F4E]">{item.value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#112F4E]" />
                <span className="text-sm font-medium text-[#112F4E]">Total</span>
              </div>
              <span className="text-sm font-medium text-[#112F4E]">1.284</span>
            </div>
          </div>
        </div>

        {/* Chart Cards — 2 columns */}
        <div className="flex flex-col lg:flex-row gap-4">
          {[
            { title: "Desempenho mensal", Icon: TrendingUp },
            { title: "Evolução de resoluções", Icon: BarChart3 },
          ].map((chart) => (
            <div key={chart.title} className="flex-1 p-4 rounded-xl border border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <chart.Icon className="w-4 h-4 text-[#94A3B8]" />
                  <h3 className="text-sm font-medium text-[#112F4E]">{chart.title}</h3>
                </div>
                <button className="p-1 hover:bg-[#FAF7F2] rounded transition-colors">
                  <Info className="w-4 h-4 text-[#94A3B8]" />
                </button>
              </div>
              {/* Chart area */}
              <div className="h-[180px] flex items-end gap-1.5 px-1">
                {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"].map((m, i) => {
                  const heights = [35, 45, 40, 55, 48, 65, 60, 80, 50, 42, 55, 48];
                  const isHighlight = i === 7;
                  return (
                    <div key={m} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className={`w-full rounded-t-sm transition-all ${isHighlight ? "bg-[#1a8ccc]" : "bg-[#1a8ccc]/12 hover:bg-[#1a8ccc]/25"}`}
                        style={{ height: `${heights[i]}%`, minHeight: "8px" }}
                      />
                      <span className="text-[9px] text-[#94A3B8]">{m}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Cards — Distribution + Calendar */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Distribution by category */}
          <div className="flex-1 p-4 rounded-xl border border-[#E2E8F0] min-h-[200px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-[#94A3B8]" />
                <h3 className="text-sm font-medium text-[#112F4E]">Reclamações por categoria</h3>
              </div>
              <button className="p-1 hover:bg-[#FAF7F2] rounded transition-colors">
                <Info className="w-4 h-4 text-[#94A3B8]" />
              </button>
            </div>
            <div className="space-y-2">
              {[
                { label: "Infraestrutura", value: 42, color: "#1a8ccc" },
                { label: "Iluminação", value: 28, color: "#F59E0B" },
                { label: "Limpeza", value: 18, color: "#10B981" },
                { label: "Saneamento", value: 12, color: "#8B5CF6" },
              ].map((cat) => (
                <div key={cat.label} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: cat.color }} />
                  <span className="text-sm text-[#4A5D70] flex-1">{cat.label}</span>
                  <div className="w-24 h-2 bg-[#F5F2ED] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${cat.value}%`, backgroundColor: cat.color }} />
                  </div>
                  <span className="text-xs text-[#94A3B8] w-8 text-right">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar Card */}
          <div className="flex-1 p-4 rounded-xl border border-[#E2E8F0] min-h-[200px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#94A3B8]" />
                <h3 className="text-sm font-medium text-[#112F4E]">Calendário de reclamações</h3>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1 hover:bg-[#FAF7F2] rounded transition-colors">
                  <ChevronLeft className="w-4 h-4 text-[#94A3B8]" />
                </button>
                <span className="text-sm text-[#4A5D70] px-1">Mai 2026</span>
                <button className="p-1 hover:bg-[#FAF7F2] rounded transition-colors">
                  <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
                <div key={d} className="text-[10px] text-[#94A3B8] py-1.5">{d}</div>
              ))}
              {Array.from({ length: 35 }).map((_, i) => {
                const day = i - 3;
                const hasData = [3, 7, 12, 18, 22].includes(day);
                return (
                  <div key={i} className="h-7 flex items-center justify-center rounded-md text-xs text-[#4A5D70]">
                    {day > 0 && day <= 31 && (
                      <span className={`w-6 h-6 flex items-center justify-center rounded-md ${hasData ? "bg-[#1a8ccc]/10 text-[#1a8ccc] font-medium" : ""}`}>
                        {day}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Complaints Table */}
        <div className="rounded-xl border border-[#E2E8F0] overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ReceiptText className="w-4 h-4 text-[#94A3B8]" />
              <h3 className="text-sm font-medium text-[#112F4E]">Reclamações Recentes</h3>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-xs text-[#4A5D70] hover:bg-[#FAF7F2] transition-colors">
              <Filter className="w-3.5 h-3.5" />
              Filtrar
            </button>
          </div>

          {/* Mobile */}
          <div className="md:hidden divide-y divide-[#F5F2ED]">
            {[
              { letter: "A", bg: "bg-blue-50", color: "text-[#1a8ccc]", label: "Buraco na Via", date: "12 Out", bairro: "Cascata", status: "Crítico", statusColor: "#EF4444" },
              { letter: "B", bg: "bg-yellow-50", color: "text-[#F59E0B]", label: "Lâmpada Queimada", date: "11 Out", bairro: "Fragata", status: "Aberto", statusColor: "#1a8ccc" },
              { letter: "C", bg: "bg-green-50", color: "text-[#10B981]", label: "Acúmulo de Lixo", date: "10 Out", bairro: "Maria Izabel", status: "Resolvido", statusColor: "#10B981" },
            ].map((row) => (
              <div key={row.label} className="p-4 flex items-center gap-3">
                <div className={`w-8 h-8 ${row.bg} ${row.color} rounded-lg flex items-center justify-center text-xs font-bold shrink-0`}>
                  {row.letter}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#112F4E] truncate">{row.label}</p>
                  <p className="text-xs text-[#94A3B8]">{row.bairro} · {row.date}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: row.statusColor }} />
                  <span className="text-xs font-medium" style={{ color: row.statusColor }}>{row.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-t border-b border-[#E2E8F0] bg-[#FAFAF8]">
                  {["Atividade", "Data", "Bairro", "Status"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-xs font-medium text-[#94A3B8]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F2ED]">
                {[
                  { letter: "A", bg: "bg-blue-50", color: "text-[#1a8ccc]", label: "Buraco na Via", date: "Seg, 12 Out 2026", bairro: "Cascata", status: "Crítico", statusColor: "#EF4444" },
                  { letter: "B", bg: "bg-yellow-50", color: "text-[#F59E0B]", label: "Lâmpada Queimada", date: "Dom, 11 Out 2026", bairro: "Fragata", status: "Aberto", statusColor: "#1a8ccc" },
                  { letter: "C", bg: "bg-green-50", color: "text-[#10B981]", label: "Acúmulo de Lixo", date: "Sáb, 10 Out 2026", bairro: "Maria Izabel", status: "Resolvido", statusColor: "#10B981" },
                ].map((row) => (
                  <tr key={row.label} className="hover:bg-[#FAFAF8]/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 ${row.bg} ${row.color} rounded-md flex items-center justify-center text-xs font-bold`}>{row.letter}</div>
                        <span className="text-sm text-[#112F4E]">{row.label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#4A5D70]">{row.date}</td>
                    <td className="px-4 py-3 text-sm text-[#4A5D70]">{row.bairro}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: row.statusColor }} />
                        <span className="text-sm font-medium" style={{ color: row.statusColor }}>{row.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

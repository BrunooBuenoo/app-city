"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BarChart3, Bell, Calendar, TrendingUp, TrendingDown,
  FileText, CheckCircle, Clock, Heart, Wrench, Lightbulb, Trash2, Droplets,
  MoreHorizontal, Filter, ReceiptText, PieChart, Info,
  ChevronLeft, ChevronRight, Plus,
} from "lucide-react";

const dateFilters = [
  { id: "hoje", label: "Hoje" },
  { id: "mes", label: "Esse mês" },
  { id: "30dias", label: "Últimos 30 dias" },
  { id: "total", label: "Todo o período" },
];

export default function UsuarioDashboard() {
  const [activeFilter, setActiveFilter] = useState("mes");

  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-[#F5F2ED]">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#112F4E]" />
          <h1 className="text-lg font-semibold text-[#112F4E]">Meu Painel</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/reclamacao/nova">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#1a8ccc] text-white rounded-full hover:bg-[#1572a6] transition-colors">
              <Plus className="w-3.5 h-3.5" />
              Nova
            </button>
          </Link>
          <button className="p-2 hover:bg-[#FAF7F2] rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-[#94A3B8]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F59E0B] rounded-full ring-2 ring-white" />
          </button>
        </div>
      </header>

      <div className="px-4 md:px-6 pb-6 space-y-4">
        {/* Date Filter */}
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

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Minhas Reclamações", value: "12", color: "from-blue-50 to-blue-100/50", Icon: FileText, trend: "+3.2%", up: true },
            { label: "Resolvidas", value: "8", color: "from-green-50 to-green-100/50", Icon: CheckCircle, trend: "Alta", up: true },
            { label: "Em Andamento", value: "3", color: "from-yellow-50 to-yellow-100/50", Icon: Clock, trend: "-5%", up: false },
            { label: "Concordos", value: "45", color: "from-red-50 to-red-100/50", Icon: Heart, trend: "+42", up: true },
          ].map((stat) => (
            <div key={stat.label} className={`p-3 md:p-4 rounded-xl bg-gradient-to-r ${stat.color}`}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <stat.Icon className="w-3.5 h-3.5 text-[#94A3B8]" />
                <p className="text-[11px] md:text-sm text-[#4A5D70] truncate">{stat.label}</p>
              </div>
              <p className="text-xl md:text-2xl font-semibold text-[#112F4E]">{stat.value}</p>
              <div className="flex items-center gap-1 mt-1">
                {stat.up ? <TrendingUp className="w-3 h-3 text-[#10B981]" /> : <TrendingDown className="w-3 h-3 text-[#EF4444]" />}
                <span className={`text-[10px] md:text-xs font-medium ${stat.up ? "text-[#10B981]" : "text-[#EF4444]"}`}>{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Categories Card */}
        <div className="p-4 rounded-xl border border-[#E2E8F0]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#94A3B8]" />
              <h3 className="text-sm font-medium text-[#112F4E]">Minhas Categorias</h3>
            </div>
            <Link href="/usuario/minhas-reclamacoes" className="text-xs font-medium text-[#1a8ccc] hover:underline">Ver Todas</Link>
          </div>
          <div className="w-full h-3 rounded-full flex overflow-hidden mb-4">
            <div className="bg-[#1a8ccc] h-full" style={{ width: "42%" }} />
            <div className="bg-[#F59E0B] h-full" style={{ width: "25%" }} />
            <div className="bg-[#10B981] h-full" style={{ width: "17%" }} />
            <div className="bg-[#8B5CF6] h-full" style={{ width: "16%" }} />
          </div>
          <div className="space-y-1.5">
            {[
              { Icon: Wrench, color: "#1a8ccc", label: "Infraestrutura", value: "5" },
              { Icon: Lightbulb, color: "#F59E0B", label: "Iluminação", value: "3" },
              { Icon: Trash2, color: "#10B981", label: "Limpeza", value: "2" },
              { Icon: Droplets, color: "#8B5CF6", label: "Saneamento", value: "2" },
            ].map((cat) => (
              <div key={cat.label} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: cat.color }} />
                  <cat.Icon className="w-3.5 h-3.5 text-[#94A3B8]" />
                  <span className="text-sm text-[#4A5D70]">{cat.label}</span>
                </div>
                <span className="text-sm font-medium text-[#112F4E]">{cat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Chart */}
        <div className="p-4 rounded-xl border border-[#E2E8F0]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#94A3B8]" />
              <h3 className="text-sm font-medium text-[#112F4E]">Atividade Semanal</h3>
            </div>
            <button className="p-1 hover:bg-[#FAF7F2] rounded transition-colors">
              <Info className="w-4 h-4 text-[#94A3B8]" />
            </button>
          </div>
          <div className="h-[140px] md:h-[180px] flex items-end gap-3">
            {["Sem 1", "Sem 2", "Sem 3", "Sem 4"].map((label, i) => {
              const heights = [50, 75, 40, 90];
              const isHighlight = i === 3;
              return (
                <div key={label} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full">
                    <div
                      className={`w-full rounded-lg transition-all ${isHighlight ? "bg-[#1a8ccc]" : "bg-[#1a8ccc]/12 hover:bg-[#1a8ccc]/25"}`}
                      style={{ height: `${heights[i]}%`, minHeight: "20px" }}
                    />
                  </div>
                  <span className="text-[10px] md:text-xs text-[#94A3B8]">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-[#E2E8F0] overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ReceiptText className="w-4 h-4 text-[#94A3B8]" />
              <h3 className="text-sm font-medium text-[#112F4E]">Atividade Recente</h3>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-xs text-[#4A5D70] hover:bg-[#FAF7F2] transition-colors">
              <Filter className="w-3.5 h-3.5" />
              Filtrar
            </button>
          </div>
          <div className="divide-y divide-[#F5F2ED]">
            {[
              { Icon: Lightbulb, label: "Iluminação Pública", date: "18 Mai", local: "Centro", status: "Em Andamento", statusColor: "#F59E0B" },
              { Icon: Wrench, label: "Buraco na Via", date: "17 Mai", local: "Rua das Azaleias", status: "Resolvido", statusColor: "#10B981" },
              { Icon: Trash2, label: "Coleta de Lixo", date: "16 Mai", local: "Jd. Marília", status: "Aguardando", statusColor: "#1a8ccc" },
            ].map((row) => (
              <div key={row.label} className="p-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-[#FAF7F2] border border-[#E2E8F0] rounded-lg flex items-center justify-center shrink-0">
                  <row.Icon className="w-4 h-4 text-[#4A5D70]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#112F4E] truncate">{row.label}</p>
                  <p className="text-xs text-[#94A3B8]">{row.local} · {row.date}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: row.statusColor }} />
                  <span className="text-xs font-medium" style={{ color: row.statusColor }}>{row.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

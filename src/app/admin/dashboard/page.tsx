"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3, Bell, Calendar as CalendarIcon, TrendingUp, TrendingDown,
  Inbox, Clock, CheckCircle, MoreHorizontal, Filter,
  ReceiptText, PieChart, Info, ChevronLeft, ChevronRight,
  Loader2,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { onReclamacoesChange, type Reclamacao } from "@/services/firebase";
import { CATEGORIES, getCategoryByLabel } from "@/utils/categories";

const dateFilters = [
  { id: "hoje", label: "Hoje" },
  { id: "mes", label: "Esse mês" },
  { id: "30dias", label: "Últimos 30 dias" },
  { id: "90dias", label: "Últimos 90 dias" },
  { id: "total", label: "Todo o período" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("mes");
  const { showToast } = useToast();

  const [reclamacoes, setReclamacoes] = useState<Reclamacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Controle de mês do calendário
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());

  // Iniciar listener do Firestore
  useEffect(() => {
    const unsubscribe = onReclamacoesChange(
      (items) => {
        setReclamacoes(items);
        setIsLoading(false);
      },
      (error) => {
        console.error("Erro no listener do admin dashboard:", error);
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Notificação simulada
  useEffect(() => {
    const timer = setTimeout(() => {
      showToast("info", "Nova reclamação recebida", "Vazamento de esgoto registrado no Jd. Marília");
    }, 4500);
    return () => clearTimeout(timer);
  }, [showToast]);

  // Filtro de data
  const filteredReclamacoes = reclamacoes.filter((r) => {
    if (!r.criadoEm) return true;
    const date = r.criadoEm.toDate();
    const now = new Date();
    if (activeFilter === "hoje") {
      return date.toDateString() === now.toDateString();
    }
    if (activeFilter === "mes") {
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }
    if (activeFilter === "30dias") {
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30;
    }
    if (activeFilter === "90dias") {
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 90;
    }
    return true; // "total"
  });

  // Métricas
  const totalCount = filteredReclamacoes.length;
  const abertoCount = filteredReclamacoes.filter((r) => r.status === "aberto").length;
  const emAndamentoCount = filteredReclamacoes.filter((r) => r.status === "em_andamento" || r.status === "em_analise").length;
  const resolvidoCount = filteredReclamacoes.filter((r) => r.status === "resolvido").length;
  const criticoCount = filteredReclamacoes.filter((r) => r.status === "critico").length;

  const totalStats = totalCount || 1;
  const pctAbertas = Math.round((abertoCount / totalStats) * 100);
  const pctAndamento = Math.round((emAndamentoCount / totalStats) * 100);
  const pctResolvidas = Math.round((resolvidoCount / totalStats) * 100);
  const pctCriticas = Math.round((criticoCount / totalStats) * 100);

  // Distribuição mensal de reclamações criadas e resolvidas
  const monthlyCreated = Array(12).fill(0);
  const monthlyResolved = Array(12).fill(0);

  reclamacoes.forEach((r) => {
    if (!r.criadoEm) return;
    const date = r.criadoEm.toDate();
    const month = date.getMonth(); // 0 a 11
    monthlyCreated[month]++;
    if (r.status === "resolvido") {
      monthlyResolved[month]++;
    }
  });

  const maxCreated = Math.max(...monthlyCreated, 1);
  const maxResolved = Math.max(...monthlyResolved, 1);

  // Distribuição por categoria
  const categoryCounts: Record<string, number> = {};
  filteredReclamacoes.forEach((r) => {
    const matched = getCategoryByLabel(r.categoria);
    const catLabel = matched ? matched.label : "Outros";
    categoryCounts[catLabel] = (categoryCounts[catLabel] || 0) + 1;
  });

  const categoryDistribution = CATEGORIES.map((cat) => {
    const count = categoryCounts[cat.label] || 0;
    const pct = totalCount ? Math.round((count / totalCount) * 100) : 0;
    return {
      label: cat.label,
      color: cat.color,
      count,
      pct,
    };
  })
    .filter((c) => c.count > 0 || ["Infraestrutura", "Iluminação Pública", "Limpeza Urbana", "Saneamento"].includes(c.label))
    .sort((a, b) => b.count - a.count);

  // Calendário interativo
  const calYear = currentCalendarDate.getFullYear();
  const calMonth = currentCalendarDate.getMonth();
  const calMonthName = currentCalendarDate.toLocaleString("pt-BR", { month: "long", year: "numeric" });

  const firstDayOfMonth = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  const calendarDaysList: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDaysList.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDaysList.push(d);
  }

  const calendarComplaintDays = new Set<number>();
  reclamacoes.forEach((r) => {
    if (r.criadoEm) {
      const date = r.criadoEm.toDate();
      if (date.getMonth() === calMonth && date.getFullYear() === calYear) {
        calendarComplaintDays.add(date.getDate());
      }
    }
  });

  const handlePrevMonth = () => {
    setCurrentCalendarDate(new Date(calYear, calMonth - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentCalendarDate(new Date(calYear, calMonth + 1, 1));
  };

  // Helper para categoria
  const getCatDetails = (categoria: string) => {
    const cat = getCategoryByLabel(categoria);
    if (cat) {
      return {
        letter: cat.label.charAt(0),
        color: cat.color,
        bgLight: cat.bgLight,
      };
    }
    return { letter: "O", color: "#64748B", bgLight: "#F1F5F9" };
  };

  // Helper para status
  const getStatusDetails = (status: string) => {
    const clean = status || "aberto";
    if (clean === "critico") return { label: "Crítico", color: "#EF4444" };
    if (clean === "resolvido") return { label: "Resolvido", color: "#10B981" };
    if (clean === "em_andamento" || clean === "em_analise") return { label: "Em Andamento", color: "#F59E0B" };
    return { label: "Aberto", color: "#1a8ccc" };
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "—";
    const date = timestamp.toDate();
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-[#1a8ccc] animate-spin" />
        <p className="text-sm text-[#4A5D70] font-light">Carregando dados do painel...</p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#F5F2ED]">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#112F4E]" />
          <h1 className="text-lg font-semibold text-[#112F4E]">Dashboard Administrativo</h1>
        </div>
        <button className="p-2 hover:bg-[#FAF7F2] rounded-lg transition-colors relative cursor-pointer">
          <Bell className="w-5 h-5 text-[#94A3B8]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full ring-2 ring-white" />
        </button>
      </header>

      <div className="px-6 pb-8 space-y-6">
        {/* Date Filter Pills */}
        <div className="flex items-center justify-between pt-4 gap-4 flex-wrap">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {dateFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === filter.id
                    ? "bg-[#1a8ccc] text-white shadow-sm"
                    : "bg-white text-[#112F4E] border border-[#E2E8F0] hover:bg-[#FAF7F2]"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Reclamações Filtradas", value: totalCount, color: "from-blue-50 to-blue-100/50", Icon: Inbox, trend: "Atualizado", up: true },
            { label: "Em Aberto", value: abertoCount, color: "from-sky-50 to-sky-100/50", Icon: Clock, trend: `${pctAbertas}% do total`, up: true },
            { label: "Em Progresso / Análise", value: emAndamentoCount, color: "from-amber-50 to-amber-100/50", Icon: Clock, trend: `${pctAndamento}% do total`, up: true },
            { label: "Resolvidas", value: resolvidoCount, color: "from-green-50 to-green-100/50", Icon: CheckCircle, trend: `${pctResolvidas}% do total`, up: true },
          ].map((stat) => (
            <div key={stat.label} className={`p-4 rounded-xl bg-gradient-to-r ${stat.color} border border-[#E2E8F0]/30 shadow-sm`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-[#4A5D70] uppercase tracking-wider">{stat.label}</p>
                <stat.Icon className="w-4 h-4 text-[#94A3B8]" />
              </div>
              <p className="text-3xl font-bold text-[#112F4E]">{stat.value}</p>
              <div className="flex items-center gap-1 mt-1 text-[11px] text-[#94A3B8]">
                <span>{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Status Distribution Progress Bar */}
        <div className="p-5 rounded-xl border border-[#E2E8F0] bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#94A3B8]" />
              <h3 className="text-sm font-semibold text-[#112F4E]">Proporção por Status (Período)</h3>
            </div>
            <span className="text-xs font-semibold text-[#4A5D70]">Total: {totalCount} relatos</span>
          </div>

          <div className="w-full h-3.5 rounded-full flex overflow-hidden bg-[#FAF7F2] border border-[#E2E8F0]">
            <div className="bg-[#1a8ccc] h-full transition-all duration-500" style={{ width: `${pctAbertas}%` }} title={`Abertas: ${pctAbertas}%`} />
            <div className="bg-[#F59E0B] h-full transition-all duration-500" style={{ width: `${pctAndamento}%` }} title={`Em Andamento: ${pctAndamento}%`} />
            <div className="bg-[#10B981] h-full transition-all duration-500" style={{ width: `${pctResolvidas}%` }} title={`Resolvidas: ${pctResolvidas}%`} />
            <div className="bg-[#EF4444] h-full transition-all duration-500" style={{ width: `${pctCriticas}%` }} title={`Críticas: ${pctCriticas}%`} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {[
              { color: "#1a8ccc", label: "Abertas", value: abertoCount, pct: pctAbertas },
              { color: "#F59E0B", label: "Em Progresso", value: emAndamentoCount, pct: pctAndamento },
              { color: "#10B981", label: "Resolvidas", value: resolvidoCount, pct: pctResolvidas },
              { color: "#EF4444", label: "Críticas", value: criticoCount, pct: pctCriticas },
            ].map((item) => (
              <div key={item.label} className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E2E8F0]/50 flex flex-col">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-[#4A5D70] font-medium">{item.label}</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-bold text-[#112F4E]">{item.value}</span>
                  <span className="text-[10px] text-[#94A3B8]">({item.pct}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts — 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Criadas */}
          <div className="p-5 rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#94A3B8]" />
                <h3 className="text-sm font-semibold text-[#112F4E]">Volume Mensal de Relatos (Total)</h3>
              </div>
              <button className="p-1 hover:bg-[#FAF7F2] rounded transition-colors cursor-pointer">
                <Info className="w-4 h-4 text-[#94A3B8]" />
              </button>
            </div>
            <div className="h-[180px] flex items-end gap-1.5 px-1 pt-4">
              {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"].map((m, i) => {
                const count = monthlyCreated[i];
                const heightPct = Math.round((count / maxCreated) * 80) + 10; // min 10% to show bar
                const hasValue = count > 0;
                return (
                  <div key={m} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative">
                    {hasValue && (
                      <span className="absolute bottom-full mb-1 bg-[#112F4E] text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                        {count}
                      </span>
                    )}
                    <div
                      className={`w-full rounded-t transition-all ${
                        hasValue ? "bg-[#1a8ccc] hover:bg-[#1572a6]" : "bg-[#1a8ccc]/10"
                      }`}
                      style={{ height: hasValue ? `${heightPct}%` : "8%" }}
                    />
                    <span className="text-[10px] text-[#94A3B8] font-light">{m}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart 2: Resolvidas */}
          <div className="p-5 rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#94A3B8]" />
                <h3 className="text-sm font-semibold text-[#112F4E]">Resoluções de Ocorrências</h3>
              </div>
              <button className="p-1 hover:bg-[#FAF7F2] rounded transition-colors cursor-pointer">
                <Info className="w-4 h-4 text-[#94A3B8]" />
              </button>
            </div>
            <div className="h-[180px] flex items-end gap-1.5 px-1 pt-4">
              {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"].map((m, i) => {
                const count = monthlyResolved[i];
                const heightPct = Math.round((count / maxResolved) * 80) + 10;
                const hasValue = count > 0;
                return (
                  <div key={m} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative">
                    {hasValue && (
                      <span className="absolute bottom-full mb-1 bg-[#112F4E] text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                        {count}
                      </span>
                    )}
                    <div
                      className={`w-full rounded-t transition-all ${
                        hasValue ? "bg-[#10B981] hover:bg-[#059669]" : "bg-[#10B981]/10"
                      }`}
                      style={{ height: hasValue ? `${heightPct}%` : "8%" }}
                    />
                    <span className="text-[10px] text-[#94A3B8] font-light">{m}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Details — Category Breakdown + Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Breakdown */}
          <div className="p-5 rounded-xl border border-[#E2E8F0] bg-white shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-[#94A3B8]" />
                  <h3 className="text-sm font-semibold text-[#112F4E]">Incidência por Categoria</h3>
                </div>
              </div>
              <div className="space-y-3.5">
                {categoryDistribution.map((cat) => (
                  <div key={cat.label} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="text-sm text-[#4A5D70] flex-1 truncate">{cat.label}</span>
                    <div className="w-32 h-2.5 bg-[#FAF7F2] rounded-full overflow-hidden border border-[#E2E8F0]/30 shrink-0">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${cat.pct}%`, backgroundColor: cat.color }} />
                    </div>
                    <span className="text-xs font-bold text-[#112F4E] w-12 text-right">{cat.count} ({cat.pct}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fully Interactive Calendar */}
          <div className="p-5 rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#94A3B8]" />
                <h3 className="text-sm font-semibold text-[#112F4E]">Registro Diário</h3>
              </div>
              <div className="flex items-center gap-1 border border-[#E2E8F0] rounded-lg p-0.5 bg-[#FAF7F2]">
                <button
                  onClick={handlePrevMonth}
                  className="p-1 hover:bg-white rounded transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-[#4A5D70]" />
                </button>
                <span className="text-xs font-semibold text-[#112F4E] px-2 capitalize">{calMonthName}</span>
                <button
                  onClick={handleNextMonth}
                  className="p-1 hover:bg-white rounded transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 text-[#4A5D70]" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
                <div key={i} className="text-[10px] font-bold text-[#94A3B8] py-1">{d}</div>
              ))}
              {calendarDaysList.map((day, i) => {
                const hasComplaint = day !== null && calendarComplaintDays.has(day);
                return (
                  <div key={i} className="h-8 flex items-center justify-center rounded-lg text-xs">
                    {day !== null ? (
                      <span
                        className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${
                          hasComplaint
                            ? "bg-[#1a8ccc] text-white font-bold shadow-sm"
                            : "text-[#4A5D70] hover:bg-[#FAF7F2]"
                        }`}
                        title={hasComplaint ? `${day} de ${calMonthName} possui reclamações` : ""}
                      >
                        {day}
                      </span>
                    ) : (
                      <span className="w-7 h-7" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Complaints Table */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <ReceiptText className="w-4 h-4 text-[#94A3B8]" />
              <h3 className="text-sm font-semibold text-[#112F4E]">Ocorrências Recentes</h3>
            </div>
            <span className="text-xs font-medium text-[#94A3B8]">
              Clique em uma linha para gerenciar
            </span>
          </div>

          {filteredReclamacoes.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#94A3B8]">
              Nenhuma reclamação encontrada para o filtro de data ativo.
            </div>
          ) : (
            <>
              {/* Mobile List View */}
              <div className="md:hidden divide-y divide-[#F5F2ED]">
                {filteredReclamacoes.slice(0, 6).map((row) => {
                  const cat = getCatDetails(row.categoria);
                  const st = getStatusDetails(row.status);
                  return (
                    <div
                      key={row.id}
                      onClick={() => router.push(`/admin/reclamacoes/${row.id}`)}
                      className="p-4 flex items-center gap-3 active:bg-[#FAF7F2] transition-colors"
                    >
                      <div 
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 shadow-sm border border-[#E2E8F0]/30"
                        style={{ backgroundColor: cat.bgLight, color: cat.color }}
                      >
                        {cat.letter}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#112F4E] truncate">{row.titulo}</p>
                        <p className="text-xs text-[#94A3B8] font-light">
                          {row.endereco.split(",")[0]} · {formatDate(row.criadoEm)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: st.color }} />
                        <span className="text-xs font-semibold" style={{ color: st.color }}>{st.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] bg-[#FAF7F2]/60">
                      {["Atividade / Título", "Data de Registro", "Endereço", "Status"].map((h) => (
                        <th key={h} className="px-5 py-3 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5F2ED]">
                    {filteredReclamacoes.slice(0, 10).map((row) => {
                      const cat = getCatDetails(row.categoria);
                      const st = getStatusDetails(row.status);
                      return (
                        <tr
                          key={row.id}
                          onClick={() => router.push(`/admin/reclamacoes/${row.id}`)}
                          className="hover:bg-[#FAF7F2]/50 transition-colors cursor-pointer group"
                        >
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border border-[#E2E8F0]/40 group-hover:scale-105 transition-transform"
                                style={{ backgroundColor: cat.bgLight, color: cat.color }}
                              >
                                {cat.letter}
                              </div>
                              <div>
                                <span className="text-sm font-semibold text-[#112F4E] group-hover:text-[#1a8ccc] transition-colors">{row.titulo}</span>
                                <span className="block text-[10px] text-[#94A3B8] mt-0.5">{row.categoria} {row.subcategoria ? `· ${row.subcategoria}` : ""}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-sm text-[#4A5D70] font-light">{formatDate(row.criadoEm)}</td>
                          <td className="px-5 py-3.5 text-sm text-[#4A5D70] font-light truncate max-w-[240px]" title={row.endereco}>
                            {row.endereco}
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: st.color }} />
                              <span className="text-sm font-semibold" style={{ color: st.color }}>{st.label}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

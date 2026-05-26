"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp, TrendingDown,
  Clock, CheckCircle, MoreHorizontal,
  Loader2, ChevronLeft, ChevronRight,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { onReclamacoesChange, type Reclamacao } from "@/services/firebase";
import { useCategorias } from "@/hooks/useCategorias";

const dateFilters = [
  { id: "hoje", label: "Hoje" },
  { id: "mes", label: "Esse mês" },
  { id: "30dias", label: "Últimos 30 dias" },
  { id: "90dias", label: "Últimos 90 dias" },
  { id: "total", label: "Todo o período" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const { categorias: CATEGORIES, obterCategoriaPorLabel: getCategoryByLabel } = useCategorias();
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
    const month = date.getMonth();
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
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--color-text-muted)" }} />
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Carregando dados...</p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between px-6 md:px-8 py-5 border-b" style={{ borderColor: "var(--color-border)" }}>
        <div>
          <h1 className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>Dashboard</h1>
          <p className="text-[13px] mt-0.5" style={{ color: "var(--color-text-muted)" }}>
            Visão geral das ocorrências
          </p>
        </div>
      </header>

      <div className="px-6 md:px-8 pb-8 space-y-6">
        {/* Date Filter Pills */}
        <div className="flex items-center gap-2 pt-5 overflow-x-auto no-scrollbar">
          {dateFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-3.5 py-1.5 text-[13px] font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === filter.id
                  ? "text-white shadow-sm"
                  : "border"
              }`}
              style={
                activeFilter === filter.id
                  ? { backgroundColor: "#1a8ccc" }
                  : { backgroundColor: "var(--color-surface)", color: "var(--color-text-secondary)", borderColor: "var(--color-border)" }
              }
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Stats Cards — Brightly style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total de Reclamações", value: totalCount, pct: null, up: true },
            { label: "Em Aberto", value: abertoCount, pct: pctAbertas, up: true },
            { label: "Em Andamento", value: emAndamentoCount, pct: pctAndamento, up: true },
            { label: "Resolvidas", value: resolvidoCount, pct: pctResolvidas, up: true },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-5 rounded-xl border"
              style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}
            >
              <p className="text-[13px] mb-3" style={{ color: "var(--color-text-muted)" }}>{stat.label}</p>
              <p className="text-[32px] font-bold leading-none mb-2" style={{ color: "var(--color-text)" }}>{String(stat.value).padStart(2, "0")}</p>
              {stat.pct !== null && (
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[12px] font-medium text-emerald-500">{stat.pct}%</span>
                  <span className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>do total</span>
                </div>
              )}
              {stat.pct === null && (
                <span className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>Período filtrado</span>
              )}
            </div>
          ))}
        </div>

        {/* Status Distribution — Slim bar */}
        <div
          className="p-5 rounded-xl border space-y-4"
          style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-semibold" style={{ color: "var(--color-text)" }}>Proporção por Status</h3>
            <span className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>Total: {totalCount} relatos</span>
          </div>

          <div className="w-full h-2 rounded-full flex overflow-hidden" style={{ backgroundColor: "var(--color-bg-alt)" }}>
            <div className="bg-[#1a8ccc] h-full transition-all duration-500" style={{ width: `${pctAbertas}%` }} />
            <div className="bg-[#F59E0B] h-full transition-all duration-500" style={{ width: `${pctAndamento}%` }} />
            <div className="bg-[#10B981] h-full transition-all duration-500" style={{ width: `${pctResolvidas}%` }} />
            <div className="bg-[#EF4444] h-full transition-all duration-500" style={{ width: `${pctCriticas}%` }} />
          </div>

          <div className="flex flex-wrap gap-4">
            {[
              { color: "#1a8ccc", label: "Abertas", value: abertoCount, pct: pctAbertas },
              { color: "#F59E0B", label: "Em Progresso", value: emAndamentoCount, pct: pctAndamento },
              { color: "#10B981", label: "Resolvidas", value: resolvidoCount, pct: pctResolvidas },
              { color: "#EF4444", label: "Críticas", value: criticoCount, pct: pctCriticas },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[12px]" style={{ color: "var(--color-text-secondary)" }}>
                  {item.label} <strong className="font-semibold" style={{ color: "var(--color-text)" }}>{item.value}</strong> ({item.pct}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Charts — 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Chart 1: Criadas */}
          <div
            className="p-5 rounded-xl border"
            style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}
          >
            <h3 className="text-[14px] font-semibold mb-5" style={{ color: "var(--color-text)" }}>Volume Mensal de Relatos</h3>
            <div className="h-[160px] flex items-end gap-1.5 px-1">
              {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"].map((m, i) => {
                const count = monthlyCreated[i];
                const heightPct = Math.round((count / maxCreated) * 80) + 10;
                const hasValue = count > 0;
                return (
                  <div key={m} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative">
                    {hasValue && (
                      <span
                        className="absolute bottom-full mb-1 text-[10px] font-semibold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"
                        style={{ backgroundColor: "var(--color-text)", color: "var(--color-surface)" }}
                      >
                        {count}
                      </span>
                    )}
                    <div
                      className={`w-full rounded transition-all ${
                        hasValue ? "bg-[#1a8ccc] hover:bg-[#1572a6]" : ""
                      }`}
                      style={{
                        height: hasValue ? `${heightPct}%` : "6%",
                        backgroundColor: hasValue ? undefined : "var(--color-bg-alt)",
                      }}
                    />
                    <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>{m}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart 2: Resolvidas */}
          <div
            className="p-5 rounded-xl border"
            style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}
          >
            <h3 className="text-[14px] font-semibold mb-5" style={{ color: "var(--color-text)" }}>Resoluções de Ocorrências</h3>
            <div className="h-[160px] flex items-end gap-1.5 px-1">
              {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"].map((m, i) => {
                const count = monthlyResolved[i];
                const heightPct = Math.round((count / maxResolved) * 80) + 10;
                const hasValue = count > 0;
                return (
                  <div key={m} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative">
                    {hasValue && (
                      <span
                        className="absolute bottom-full mb-1 text-[10px] font-semibold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"
                        style={{ backgroundColor: "var(--color-text)", color: "var(--color-surface)" }}
                      >
                        {count}
                      </span>
                    )}
                    <div
                      className={`w-full rounded transition-all ${
                        hasValue ? "bg-[#10B981] hover:bg-[#059669]" : ""
                      }`}
                      style={{
                        height: hasValue ? `${heightPct}%` : "6%",
                        backgroundColor: hasValue ? undefined : "var(--color-bg-alt)",
                      }}
                    />
                    <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>{m}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Details — Category Breakdown + Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Category Breakdown */}
          <div
            className="p-5 rounded-xl border flex flex-col"
            style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}
          >
            <h3 className="text-[14px] font-semibold mb-5" style={{ color: "var(--color-text)" }}>Incidência por Categoria</h3>
            <div className="space-y-3">
              {categoryDistribution.map((cat) => (
                <div key={cat.label} className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-[13px] flex-1 truncate" style={{ color: "var(--color-text-secondary)" }}>{cat.label}</span>
                  <div className="w-24 h-1.5 rounded-full overflow-hidden shrink-0" style={{ backgroundColor: "var(--color-bg-alt)" }}>
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${cat.pct}%`, backgroundColor: cat.color }} />
                  </div>
                  <span className="text-[12px] font-medium w-16 text-right" style={{ color: "var(--color-text)" }}>{cat.count} ({cat.pct}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar */}
          <div
            className="p-5 rounded-xl border"
            style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[14px] font-semibold" style={{ color: "var(--color-text)" }}>Registro Diário</h3>
              <div className="flex items-center gap-1 border rounded-md p-0.5" style={{ borderColor: "var(--color-border)" }}>
                <button
                  onClick={handlePrevMonth}
                  className="p-1 hover:bg-[var(--color-bg-alt)] rounded transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" style={{ color: "var(--color-text-secondary)" }} />
                </button>
                <span className="text-[12px] font-medium px-2 capitalize" style={{ color: "var(--color-text)" }}>{calMonthName}</span>
                <button
                  onClick={handleNextMonth}
                  className="p-1 hover:bg-[var(--color-bg-alt)] rounded transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" style={{ color: "var(--color-text-secondary)" }} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
                <div key={i} className="text-[11px] font-medium py-1.5" style={{ color: "var(--color-text-muted)" }}>{d}</div>
              ))}
              {calendarDaysList.map((day, i) => {
                const hasComplaint = day !== null && calendarComplaintDays.has(day);
                return (
                  <div key={i} className="h-8 flex items-center justify-center">
                    {day !== null ? (
                      <span
                        className={`w-7 h-7 flex items-center justify-center rounded-md text-[12px] transition-colors ${
                          hasComplaint
                            ? "bg-[#1a8ccc] text-white font-semibold"
                            : "hover:bg-[var(--color-bg-alt)]"
                        }`}
                        style={!hasComplaint ? { color: "var(--color-text-secondary)" } : undefined}
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

        {/* Recent Complaints Table — Brightly style */}
        <div
          className="rounded-xl border overflow-hidden"
          style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}
        >
          <div className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: "var(--color-border)" }}>
            <h3 className="text-[14px] font-semibold" style={{ color: "var(--color-text)" }}>Ocorrências Recentes</h3>
            <span className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>
              Clique para gerenciar
            </span>
          </div>

          {filteredReclamacoes.length === 0 ? (
            <div className="p-10 text-center text-[13px]" style={{ color: "var(--color-text-muted)" }}>
              Nenhuma reclamação encontrada para o filtro ativo.
            </div>
          ) : (
            <>
              {/* Mobile List View */}
              <div className="md:hidden divide-y" style={{ borderColor: "var(--color-border)" }}>
                {filteredReclamacoes.slice(0, 6).map((row) => {
                  const cat = getCatDetails(row.categoria);
                  const st = getStatusDetails(row.status);
                  return (
                    <div
                      key={row.id}
                      onClick={() => router.push(`/admin/reclamacoes/${row.id}`)}
                      className="px-4 py-3.5 flex items-center gap-3 cursor-pointer transition-colors"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      <div 
                        className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-semibold shrink-0"
                        style={{ backgroundColor: cat.bgLight, color: cat.color }}
                      >
                        {cat.letter}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium truncate" style={{ color: "var(--color-text)" }}>{row.titulo}</p>
                        <p className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>
                          {row.endereco.split(",")[0]} · {formatDate(row.criadoEm)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: st.color }} />
                        <span className="text-[12px] font-medium" style={{ color: st.color }}>{st.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg)" }}>
                      {["Título", "Data", "Endereço", "Status", ""].map((h) => (
                        <th key={h} className="px-6 py-3 text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReclamacoes.slice(0, 10).map((row) => {
                      const cat = getCatDetails(row.categoria);
                      const st = getStatusDetails(row.status);
                      return (
                        <tr
                          key={row.id}
                          onClick={() => router.push(`/admin/reclamacoes/${row.id}`)}
                          className="border-b cursor-pointer transition-colors group"
                          style={{ borderColor: "var(--color-border)" }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--color-bg)"}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold shrink-0"
                                style={{ backgroundColor: cat.bgLight, color: cat.color }}
                              >
                                {cat.letter}
                              </div>
                              <div>
                                <span className="text-[13px] font-medium" style={{ color: "var(--color-text)" }}>{row.titulo}</span>
                                <span className="block text-[11px] mt-0.5" style={{ color: "var(--color-text-muted)" }}>{row.categoria}{row.subcategoria ? ` · ${row.subcategoria}` : ""}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-3.5 text-[13px]" style={{ color: "var(--color-text-secondary)" }}>{formatDate(row.criadoEm)}</td>
                          <td className="px-6 py-3.5 text-[13px] truncate max-w-[200px]" style={{ color: "var(--color-text-secondary)" }} title={row.endereco}>
                            {row.endereco}
                          </td>
                          <td className="px-6 py-3.5">
                            <span
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
                              style={{ backgroundColor: `${st.color}12`, color: st.color }}
                            >
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: st.color }} />
                              {st.label}
                            </span>
                          </td>
                          <td className="px-6 py-3.5">
                            <button className="p-1 rounded-md cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--color-text-muted)" }}>
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
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

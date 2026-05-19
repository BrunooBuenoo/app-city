"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3, Bell, Calendar, TrendingUp, TrendingDown,
  FileText, CheckCircle, Clock, Heart, Wrench, Lightbulb, Trash2, Droplets,
  MoreHorizontal, Filter, ReceiptText, PieChart, Info,
  ChevronLeft, ChevronRight, Plus, Shield, HelpCircle, Loader2,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/contexts/AuthContext";
import { onReclamacoesChange, type Reclamacao } from "@/services/firebase";

const dateFilters = [
  { id: "hoje", label: "Hoje" },
  { id: "mes", label: "Esse mês" },
  { id: "30dias", label: "Últimos 30 dias" },
  { id: "total", label: "Todo o período" },
];

const categoryColors: Record<string, string> = {
  "Infraestrutura": "#1a8ccc",
  "Iluminação": "#F59E0B",
  "Limpeza": "#10B981",
  "Saneamento": "#8B5CF6",
  "Segurança": "#6366F1",
  "Transporte": "#EC4899",
  "Saúde": "#EF4444",
  "Outros": "#64748B",
};

export default function UsuarioDashboard() {
  const { user, isLoggedIn, loading } = useAuth();
  const [activeFilter, setActiveFilter] = useState("mes");
  const { showToast } = useToast();

  const [reclamacoes, setReclamacoes] = useState<Reclamacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Iniciar listener das reclamações do usuário
  useEffect(() => {
    if (!user) return;

    const unsubscribe = onReclamacoesChange(
      (items) => {
        // Filtrar apenas as reclamações cujo autorId é o do usuário logado
        const userRecs = items.filter((r) => r.autorId === user.uid);
        setReclamacoes(userRecs);
        setIsLoading(false);
      },
      (error) => {
        console.error("Erro ao carregar dados do usuário no painel:", error);
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, [user]);

  // Notificação simulada
  useEffect(() => {
    if (reclamacoes.length > 0) {
      const timer = setTimeout(() => {
        showToast("success", "Atualização no seu painel", "Seus relatórios de ocorrência foram carregados.");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [reclamacoes.length, showToast]);

  const getCategoryIcon = (category: string) => {
    const clean = (category || "").toLowerCase();
    if (clean.includes("infra") || clean.includes("obras") || clean.includes("buraco")) return Wrench;
    if (clean.includes("ilumina") || clean.includes("luz") || clean.includes("poste")) return Lightbulb;
    if (clean.includes("limp") || clean.includes("lixo")) return Trash2;
    if (clean.includes("sanea") || clean.includes("esgoto") || clean.includes("água")) return Droplets;
    if (clean.includes("segur")) return Shield;
    return HelpCircle;
  };

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
    return true; // "total"
  });

  // Cálculos dinâmicos
  const totalCount = filteredReclamacoes.length;
  const resolvidoCount = filteredReclamacoes.filter((r) => r.status === "resolvido").length;
  const emAndamentoCount = filteredReclamacoes.filter((r) => r.status === "em_andamento" || r.status === "em_analise").length;
  const totalConcordos = filteredReclamacoes.reduce((acc, r) => acc + (r.concordos || 0), 0);

  // Proporção de categorias
  const categoryCounts: Record<string, number> = {};
  filteredReclamacoes.forEach((r) => {
    const cat = r.categoria || "Outros";
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const categoriesData = Object.entries(categoryCounts).map(([label, count]) => {
    const pct = totalCount ? Math.round((count / totalCount) * 100) : 0;
    return {
      label,
      count,
      pct,
      color: categoryColors[label] || "#64748B",
      Icon: getCategoryIcon(label),
    };
  }).sort((a, b) => b.count - a.count);

  // Atividade Semanal (relação de reclamações criadas nas últimas 4 semanas)
  const getWeeklyData = () => {
    const counts = [0, 0, 0, 0];
    const now = new Date();
    reclamacoes.forEach((r) => {
      if (!r.criadoEm) return;
      const date = r.criadoEm.toDate();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const weekIndex = Math.floor(diffDays / 7);
      if (weekIndex >= 0 && weekIndex < 4) {
        counts[3 - weekIndex]++; // 0 para Sem 1, 3 para Sem 4 (mais recente)
      }
    });
    return counts;
  };

  const weeklyCounts = getWeeklyData();
  const maxWeeklyCount = Math.max(...weeklyCounts, 1);

  const getStatusColor = (status: string) => {
    if (status === "resolvido") return "#10B981";
    if (status === "em_andamento" || status === "em_analise") return "#F59E0B";
    if (status === "critico") return "#EF4444";
    return "#1a8ccc";
  };

  const getStatusLabel = (status: string) => {
    if (status === "resolvido") return "Resolvido";
    if (status === "em_andamento") return "Em Andamento";
    if (status === "em_analise") return "Em Análise";
    if (status === "critico") return "Crítico";
    return "Aberto";
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "—";
    const date = timestamp.toDate();
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  };

  if (loading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-[#1a8ccc] animate-spin" />
        <p className="text-sm text-[#4A5D70] font-light">Carregando meu painel...</p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-[#F5F2ED]">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#112F4E]" />
          <h1 className="text-lg font-semibold text-[#112F4E]">Meu Painel de Cidadão</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/reclamacao/nova">
            <button className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-[#1a8ccc] text-white rounded-full hover:bg-[#1572a6] transition-colors cursor-pointer shadow-sm">
              <Plus className="w-3.5 h-3.5" />
              Nova Reclamação
            </button>
          </Link>
          <button className="p-2 hover:bg-[#FAF7F2] rounded-lg transition-colors relative cursor-pointer">
            <Bell className="w-5 h-5 text-[#94A3B8]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F59E0B] rounded-full ring-2 ring-white" />
          </button>
        </div>
      </header>

      <div className="px-4 md:px-6 pb-6 space-y-5">
        {/* Date Filter */}
        <div className="flex items-center gap-2 pt-4 overflow-x-auto no-scrollbar">
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

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Minhas Reclamações", value: totalCount, color: "from-blue-50 to-blue-100/50", Icon: FileText, trend: "Cadastradas", up: true },
            { label: "Resolvidas", value: resolvidoCount, color: "from-green-50 to-green-100/50", Icon: CheckCircle, trend: "Concluídas", up: true },
            { label: "Em Progresso", value: emAndamentoCount, color: "from-yellow-50 to-yellow-100/50", Icon: Clock, trend: "Acompanhando", up: true },
            { label: "Apoios Recebidos", value: totalConcordos, color: "from-red-50 to-red-100/50", Icon: Heart, trend: "Concordos", up: true },
          ].map((stat) => (
            <div key={stat.label} className={`p-3.5 md:p-4 rounded-xl bg-gradient-to-r ${stat.color} border border-[#E2E8F0]/30 shadow-sm`}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <stat.Icon className="w-3.5 h-3.5 text-[#94A3B8]" />
                <p className="text-[11px] md:text-xs font-semibold text-[#4A5D70] truncate uppercase tracking-wider">{stat.label}</p>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-[#112F4E]">{stat.value}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[10px] text-[#94A3B8] font-light">{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Categories breakdown and weekly chart grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Categories Card */}
          <div className="p-5 rounded-xl border border-[#E2E8F0] bg-white shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-[#94A3B8]" />
                  <h3 className="text-sm font-semibold text-[#112F4E]">Incidência de Categorias</h3>
                </div>
                <Link href="/usuario/minhas-reclamacoes" className="text-xs font-semibold text-[#1a8ccc] hover:underline">Ver Todas</Link>
              </div>
              
              {categoriesData.length === 0 ? (
                <p className="text-xs text-[#94A3B8] text-center py-6 font-light">Nenhuma reclamação registrada no período.</p>
              ) : (
                <>
                  {/* Dynamic Progress Bar */}
                  <div className="w-full h-3 rounded-full flex overflow-hidden mb-4 border border-[#E2E8F0] bg-[#FAF7F2]">
                    {categoriesData.map((cat, i) => (
                      <div
                        key={i}
                        className="h-full transition-all"
                        style={{ width: `${cat.pct}%`, backgroundColor: cat.color }}
                        title={`${cat.label}: ${cat.pct}%`}
                      />
                    ))}
                  </div>
                  
                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                    {categoriesData.map((cat, i) => (
                      <div key={i} className="flex items-center justify-between py-0.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: cat.color }} />
                          <cat.Icon className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                          <span className="text-xs text-[#4A5D70] truncate">{cat.label}</span>
                        </div>
                        <span className="text-xs font-semibold text-[#112F4E]">{cat.count} ({cat.pct}%)</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Activity Chart */}
          <div className="p-5 rounded-xl border border-[#E2E8F0] bg-white shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#94A3B8]" />
                  <h3 className="text-sm font-semibold text-[#112F4E]">Frequência de Ocorrências (Semanal)</h3>
                </div>
              </div>
              <div className="h-[140px] flex items-end gap-3 pt-4 px-2">
                {["Sem 1", "Sem 2", "Sem 3", "Sem 4"].map((label, i) => {
                  const count = weeklyCounts[i];
                  const heightPct = Math.round((count / maxWeeklyCount) * 80) + 10;
                  const isHighlight = i === 3;
                  return (
                    <div key={label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                      {count > 0 && (
                        <span className="absolute bottom-full mb-1 bg-[#112F4E] text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                          {count}
                        </span>
                      )}
                      <div
                        className={`w-full rounded-t transition-all ${
                          isHighlight ? "bg-[#1a8ccc]" : "bg-[#1a8ccc]/15 hover:bg-[#1a8ccc]/30"
                        }`}
                        style={{ height: count > 0 ? `${heightPct}%` : "10%" }}
                      />
                      <span className="text-[10px] text-[#94A3B8] font-light">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <ReceiptText className="w-4 h-4 text-[#94A3B8]" />
              <h3 className="text-sm font-semibold text-[#112F4E]">Histórico Recente</h3>
            </div>
            <Link href="/usuario/minhas-reclamacoes" className="text-xs font-semibold text-[#1a8ccc] hover:underline">
              Ver lista completa
            </Link>
          </div>
          
          {filteredReclamacoes.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#94A3B8] font-light">
              Nenhuma reclamação ativa. Clique em "Nova Reclamação" para registrar o seu primeiro relato!
            </div>
          ) : (
            <div className="divide-y divide-[#F5F2ED]">
              {filteredReclamacoes.slice(0, 4).map((row) => {
                const Icon = getCategoryIcon(row.categoria);
                const color = getStatusColor(row.status);
                return (
                  <Link href={`/reclamacao/${row.id}`} key={row.id} className="block hover:bg-[#FAF7F2]/40 transition-colors">
                    <div className="p-4 flex items-center gap-3">
                      <div className="w-8.5 h-8.5 bg-[#FAF7F2] border border-[#E2E8F0] rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                        <Icon className="w-4 h-4 text-[#4A5D70]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#112F4E] truncate">{row.titulo}</p>
                        <p className="text-xs text-[#94A3B8] font-light">
                          {row.endereco.split(",")[0]} · {formatDate(row.criadoEm)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                        <span className="text-xs font-semibold" style={{ color: color }}>{getStatusLabel(row.status)}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

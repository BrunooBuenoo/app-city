"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  BarChart3, Bell, TrendingUp,
  FileText, CheckCircle, Clock, Heart, Wrench, Lightbulb, Trash2, Droplets,
  PieChart, Loader2, Plus, Shield, HelpCircle,
  Trophy, Flame, ChevronRight,
  MoreHorizontal, Filter, ReceiptText, Info,
  ChevronLeft, School, Bus, TreePine, PawPrint, Activity,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/contexts/AuthContext";
import { onReclamacoesChange, type Reclamacao } from "@/services/firebase";
import {
  calculateUserXP,
  getNextRankProgress,
  buildLeaderboard,
  RANKS,
  calcularNivel,
} from "@/utils/gamification";
import { CATEGORIES, getCategoryByLabel } from "@/utils/categories";
import InsigniaBadge from "@/components/ui/InsigniaBadge";

const dateFilters = [
  { id: "hoje", label: "Hoje" },
  { id: "mes", label: "Esse mês" },
  { id: "30dias", label: "Últimos 30 dias" },
  { id: "total", label: "Todo o período" },
];

const categoryColors: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((cat) => [cat.label, cat.color])
);

export default function UsuarioDashboard() {
  const { user, profile, isLoggedIn, loading } = useAuth();
  const [activeFilter, setActiveFilter] = useState("mes");
  const { showToast } = useToast();

  const [allReclamacoes, setAllReclamacoes] = useState<Reclamacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onReclamacoesChange(
      (items) => {
        setAllReclamacoes(items);
        setIsLoading(false);
      },
      (error) => {
        console.error("Erro ao carregar dados do usuário no painel:", error);
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // XP and Rank
  const userXP = useMemo(
    () => (user ? calculateUserXP(user.uid, allReclamacoes) : 0),
    [user, allReclamacoes]
  );
  const rankInfo = useMemo(() => getNextRankProgress(userXP), [userXP]);
  const leaderboard = useMemo(() => buildLeaderboard(allReclamacoes), [allReclamacoes]);
  const userPosition = useMemo(() => {
    if (!user) return -1;
    return leaderboard.findIndex((e) => e.uid === user.uid) + 1;
  }, [leaderboard, user]);

  // Filter user's own complaints
  const reclamacoes = useMemo(
    () => allReclamacoes.filter((r) => user && r.autorId === user.uid),
    [allReclamacoes, user]
  );

  const categoryIconMap: Record<string, any> = {
    saude: Activity,
    transporte: Bus,
    infraestrutura: Wrench,
    seguranca: Shield,
    educacao: School,
    limpeza: Trash2,
    meio_ambiente: TreePine,
    iluminacao: Lightbulb,
    saneamento: Droplets,
    bem_estar_animal: PawPrint,
  };

  const getCategoryIcon = (categoryLabel: string) => {
    const cleanLabel = (categoryLabel || "").toLowerCase().trim();
    const cat = CATEGORIES.find(
      (c) => c.label.toLowerCase() === cleanLabel || c.id.toLowerCase() === cleanLabel
    );
    if (cat && categoryIconMap[cat.id]) {
      return categoryIconMap[cat.id];
    }
    return HelpCircle;
  };

  // Date filter
  const filteredReclamacoes = reclamacoes.filter((r) => {
    if (!r.criadoEm) return true;
    const date = r.criadoEm.toDate();
    const now = new Date();
    if (activeFilter === "hoje") return date.toDateString() === now.toDateString();
    if (activeFilter === "mes") return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    if (activeFilter === "30dias") {
      const diffDays = Math.ceil(Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays <= 30;
    }
    return true;
  });

  // Stats
  const totalCount = filteredReclamacoes.length;
  const resolvidoCount = filteredReclamacoes.filter((r) => r.status === "resolvido").length;
  const emAndamentoCount = filteredReclamacoes.filter((r) => r.status === "em_andamento" || r.status === "em_analise").length;
  const totalConcordos = filteredReclamacoes.reduce((acc, r) => acc + (r.concordos || 0), 0);

  // Categories
  const categoryCounts: Record<string, number> = {};
  filteredReclamacoes.forEach((r) => {
    const cat = r.categoria || "Outros";
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });
  const categoriesData = Object.entries(categoryCounts).map(([label, count]) => ({
    label,
    count,
    pct: totalCount ? Math.round((count / totalCount) * 100) : 0,
    color: categoryColors[label] || "#64748B",
    Icon: getCategoryIcon(label),
  })).sort((a, b) => b.count - a.count);

  // Weekly activity
  const getWeeklyData = () => {
    const counts = [0, 0, 0, 0];
    const now = new Date();
    reclamacoes.forEach((r) => {
      if (!r.criadoEm) return;
      const date = r.criadoEm.toDate();
      const diffDays = Math.floor(Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      const weekIndex = Math.floor(diffDays / 7);
      if (weekIndex >= 0 && weekIndex < 4) counts[3 - weekIndex]++;
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
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--color-primary)" }} />
        <p className="text-sm font-light" style={{ color: "var(--color-text-secondary)" }}>Carregando meu painel...</p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between px-4 md:px-6 py-4 border-b" style={{ borderColor: "var(--color-border-light)" }}>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" style={{ color: "var(--color-text)" }} />
          <h1 className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>Meu Painel de Cidadão</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/usuario/reclamacao/nova">
            <button className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-[#1a8ccc] text-white rounded-full hover:bg-[#1572a6] transition-colors cursor-pointer shadow-sm">
              <Plus className="w-3.5 h-3.5" />
              Nova Reclamação
            </button>
          </Link>
          <button className="p-2 rounded-lg transition-colors relative cursor-pointer" style={{ color: "var(--color-text-muted)" }}>
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F59E0B] rounded-full ring-2 ring-[var(--color-surface)]" />
          </button>
        </div>
      </header>

      <div className="px-4 md:px-6 pb-6 space-y-5">
        {/* Card de Gamificação Premium */}
        {(() => {
          const pontos = profile?.pontos || 0;
          const nivelInfo = calcularNivel(pontos);
          return (
            <div className="p-5 rounded-2xl border overflow-hidden relative mt-4" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}>
              <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-gradient-to-br from-[#1a8ccc]/10 to-[#8B5CF6]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex flex-col lg:flex-row items-center justify-between gap-5 relative z-10">
                <div className="flex items-center gap-4 w-full lg:w-auto">
                  <div className="shrink-0 select-none animate-[bounce_4s_infinite]">
                    <InsigniaBadge nivelId={nivelInfo.id} size="lg" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider block mb-0.5" style={{ color: "var(--color-text-muted)" }}>
                      Nível de Cidadania
                    </span>
                    <h2 className="text-base font-bold flex items-center gap-1.5 leading-snug" style={{ color: "var(--color-text)" }}>
                      {nivelInfo.nome}
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase" style={{ backgroundColor: "var(--color-primary-container)", color: "var(--color-on-primary-container)" }}>
                        {pontos} pts
                      </span>
                    </h2>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {nivelInfo.pontosRestantes > 0 ? (
                        <div className="flex items-center gap-1 text-xs font-light" style={{ color: "var(--color-text-muted)" }}>
                          <span>Faltam</span>
                          <strong className="font-semibold" style={{ color: "var(--color-text-secondary)" }}>{nivelInfo.pontosRestantes} pts</strong>
                          <span>para</span>
                          <span className="text-[#8B5CF6] font-semibold flex items-center gap-1">
                            {nivelInfo.proximoNivelNome}
                            <InsigniaBadge nivelId={calcularNivel(nivelInfo.proximoNivelPontos).id} size="sm" />
                          </span>
                        </div>
                      ) : (
                        <span className="text-[#10B981] font-semibold text-xs flex items-center gap-1">
                          Nível Máximo Atingido! Guardião Lendário!
                          <InsigniaBadge nivelId="lendario" size="sm" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-72 space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Progresso do Nível</span>
                    <span className="font-bold" style={{ color: "var(--color-text)" }}>{nivelInfo.progresso}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full overflow-hidden shadow-inner p-0.5 border" style={{ backgroundColor: "var(--color-bg-alt)", borderColor: "var(--color-border)" }}>
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-[#1a8ccc] to-[#8B5CF6] transition-all duration-700 shadow-sm"
                      style={{ width: `${nivelInfo.progresso}%` }}
                    />
                  </div>
                </div>

                <div className="w-full lg:w-auto shrink-0 flex gap-2">
                  <Link href="/usuario/ranking" className="w-full lg:w-auto">
                    <button className="w-full flex items-center justify-center gap-1 px-4 py-2.5 rounded-xl border font-semibold text-xs transition-all cursor-pointer active:scale-95" style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
                      <span className="material-symbols-outlined text-[15px] text-[#F59E0B]" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                      Ver Ranking Global
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })()}
        {/* Date Filter */}
        <div className="flex items-center gap-2 pt-1 overflow-x-auto no-scrollbar">
          {dateFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === filter.id
                  ? "bg-[#1a8ccc] text-white shadow-sm"
                  : "border"
              }`}
              style={activeFilter !== filter.id ? { backgroundColor: "var(--color-surface)", color: "var(--color-text)", borderColor: "var(--color-border)" } : undefined}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Minhas Reclamações", value: totalCount, color: "from-blue-50 to-blue-100/50", Icon: FileText, trend: "Cadastradas" },
            { label: "Resolvidas", value: resolvidoCount, color: "from-green-50 to-green-100/50", Icon: CheckCircle, trend: "Concluídas" },
            { label: "Em Progresso", value: emAndamentoCount, color: "from-yellow-50 to-yellow-100/50", Icon: Clock, trend: "Acompanhando" },
            { label: "Apoios Recebidos", value: totalConcordos, color: "from-red-50 to-red-100/50", Icon: Heart, trend: "Concordos" },
          ].map((stat) => (
            <div key={stat.label} className="p-3.5 md:p-4 rounded-xl border" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <stat.Icon className="w-3.5 h-3.5" style={{ color: "var(--color-text-muted)" }} />
                <p className="text-[11px] md:text-xs font-semibold truncate uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>{stat.label}</p>
              </div>
              <p className="text-2xl md:text-3xl font-bold" style={{ color: "var(--color-text)" }}>{stat.value}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[10px] font-light" style={{ color: "var(--color-text-muted)" }}>{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Categories + Weekly grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Categories Card */}
          <div className="p-5 rounded-xl border flex flex-col justify-between" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <PieChart className="w-4 h-4" style={{ color: "var(--color-text-muted)" }} />
                  <h3 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>Incidência de Categorias</h3>
                </div>
                <Link href="/usuario/minhas-reclamacoes" className="text-xs font-semibold text-[#1a8ccc] hover:underline">Ver Todas</Link>
              </div>
              
              {categoriesData.length === 0 ? (
                <p className="text-xs text-center py-6 font-light" style={{ color: "var(--color-text-muted)" }}>Nenhuma reclamação registrada no período.</p>
              ) : (
                <>
                  <div className="w-full h-3 rounded-full flex overflow-hidden mb-4 border" style={{ backgroundColor: "var(--color-bg-alt)", borderColor: "var(--color-border)" }}>
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
                          <cat.Icon className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--color-text-muted)" }} />
                          <span className="text-xs truncate" style={{ color: "var(--color-text-secondary)" }}>{cat.label}</span>
                        </div>
                        <span className="text-xs font-semibold" style={{ color: "var(--color-text)" }}>{cat.count} ({cat.pct}%)</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Activity Chart */}
          <div className="p-5 rounded-xl border flex flex-col justify-between" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" style={{ color: "var(--color-text-muted)" }} />
                  <h3 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>Frequência Semanal</h3>
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
                        <span className="absolute bottom-full mb-1 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" style={{ backgroundColor: "var(--color-text)" }}>
                          {count}
                        </span>
                      )}
                      <div
                        className={`w-full rounded-t transition-all ${
                          isHighlight ? "bg-[#1a8ccc]" : "bg-[#1a8ccc]/15 hover:bg-[#1a8ccc]/30"
                        }`}
                        style={{ height: count > 0 ? `${heightPct}%` : "10%" }}
                      />
                      <span className="text-[10px] font-light" style={{ color: "var(--color-text-muted)" }}>{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}>
          <div className="p-4 flex items-center justify-between border-b" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" style={{ color: "var(--color-text-muted)" }} />
              <h3 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>Histórico Recente</h3>
            </div>
            <Link href="/usuario/minhas-reclamacoes" className="text-xs font-semibold text-[#1a8ccc] hover:underline">
              Ver lista completa
            </Link>
          </div>
          
          {filteredReclamacoes.length === 0 ? (
            <div className="p-8 text-center text-xs font-light" style={{ color: "var(--color-text-muted)" }}>
              Nenhuma reclamação ativa. Clique em &quot;Nova Reclamação&quot; para registrar o seu primeiro relato!
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: "var(--color-border-light)" }}>
              {filteredReclamacoes.slice(0, 4).map((row) => {
                const Icon = getCategoryIcon(row.categoria);
                const color = getStatusColor(row.status);
                return (
                  <Link href={`/reclamacao/${row.id}`} key={row.id} className="block transition-colors" style={{ borderColor: "var(--color-border-light)" }}>
                    <div className="p-4 flex items-center gap-3">
                      <div className="w-8.5 h-8.5 rounded-xl flex items-center justify-center shrink-0 border" style={{ backgroundColor: "var(--color-bg-alt)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}>
                        <Icon className="w-4 h-4" style={{ color: "var(--color-text-secondary)" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: "var(--color-text)" }}>{row.titulo}</p>
                        <p className="text-xs font-light" style={{ color: "var(--color-text-muted)" }}>
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

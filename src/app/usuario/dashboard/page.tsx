"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  FileText, CheckCircle, Clock, Heart, Wrench, Lightbulb, Trash2, Droplets,
  Loader2, Plus, Shield, HelpCircle,
  ChevronRight, School, Bus, TreePine, PawPrint, Activity,
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
import { useCategorias } from "@/hooks/useCategorias";
import InsigniaBadge from "@/components/ui/InsigniaBadge";

const dateFilters = [
  { id: "hoje", label: "Hoje" },
  { id: "mes", label: "Esse mês" },
  { id: "30dias", label: "Últimos 30 dias" },
  { id: "total", label: "Todo o período" },
];

export default function UsuarioDashboard() {
  const { user, profile, isLoggedIn, loading } = useAuth();
  const { categorias: CATEGORIES } = useCategorias();

  const categoryColors = useMemo(() => {
    return Object.fromEntries(CATEGORIES.map((cat) => [cat.label, cat.color]));
  }, [CATEGORIES]);
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
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--color-text-muted)" }} />
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Carregando painel...</p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between px-4 md:px-8 py-5 border-b" style={{ borderColor: "var(--color-border)" }}>
        <div>
          <h1 className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>Meu Painel</h1>
          <p className="text-[13px] mt-0.5" style={{ color: "var(--color-text-muted)" }}>
            Acompanhe suas reclamações
          </p>
        </div>
        <Link href="/usuario/reclamacao/nova">
          <button className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium bg-[#1a8ccc] text-white rounded-lg hover:bg-[#1572a6] transition-colors cursor-pointer">
            <Plus className="w-4 h-4" />
            Nova Reclamação
          </button>
        </Link>
      </header>

      <div className="px-4 md:px-8 pb-8 space-y-5">
        {/* Gamification Card — Clean version */}
        {(() => {
          const pontos = profile?.pontos || 0;
          const nivelInfo = calcularNivel(pontos);
          return (
            <div
              className="p-5 rounded-xl border mt-5"
              style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}
            >
              <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
                <div className="flex items-center gap-4 w-full lg:w-auto">
                  <div className="shrink-0 select-none">
                    <InsigniaBadge nivelId={nivelInfo.id} size="lg" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-medium uppercase tracking-wider block mb-0.5" style={{ color: "var(--color-text-muted)" }}>
                      Nível de Cidadania
                    </span>
                    <h2 className="text-[15px] font-semibold flex items-center gap-2 leading-snug" style={{ color: "var(--color-text)" }}>
                      {nivelInfo.nome}
                      <span
                        className="px-2 py-0.5 rounded-md text-[11px] font-semibold"
                        style={{ backgroundColor: "var(--color-primary-container)", color: "var(--color-on-primary-container)" }}
                      >
                        {pontos} pts
                      </span>
                    </h2>
                    <div className="flex items-center gap-1.5 mt-1">
                      {nivelInfo.pontosRestantes > 0 ? (
                        <div className="flex items-center gap-1 text-[12px]" style={{ color: "var(--color-text-muted)" }}>
                          <span>Faltam</span>
                          <strong className="font-semibold" style={{ color: "var(--color-text-secondary)" }}>{nivelInfo.pontosRestantes} pts</strong>
                          <span>para</span>
                          <span className="font-medium flex items-center gap-1" style={{ color: "var(--color-primary)" }}>
                            {nivelInfo.proximoNivelNome}
                            <InsigniaBadge nivelId={calcularNivel(nivelInfo.proximoNivelPontos).id} size="sm" />
                          </span>
                        </div>
                      ) : (
                        <span className="text-[#10B981] font-medium text-[12px] flex items-center gap-1">
                          Nível Máximo Atingido
                          <InsigniaBadge nivelId="lendario" size="sm" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-64 space-y-1.5">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-medium" style={{ color: "var(--color-text-muted)" }}>Progresso</span>
                    <span className="font-semibold" style={{ color: "var(--color-text)" }}>{nivelInfo.progresso}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--color-bg-alt)" }}>
                    <div 
                      className="h-full rounded-full bg-[#1a8ccc] transition-all duration-700"
                      style={{ width: `${nivelInfo.progresso}%` }}
                    />
                  </div>
                </div>

                <Link href="/usuario/ranking" className="shrink-0">
                  <button
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border font-medium text-[13px] transition-colors cursor-pointer"
                    style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--color-bg-alt)"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    Ver Ranking
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          );
        })()}

        {/* Date Filter */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {dateFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-3.5 py-1.5 text-[13px] font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === filter.id
                  ? "text-white"
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Reclamações", value: totalCount, sub: "Cadastradas" },
            { label: "Resolvidas", value: resolvidoCount, sub: "Concluídas" },
            { label: "Em Progresso", value: emAndamentoCount, sub: "Acompanhando" },
            { label: "Apoios", value: totalConcordos, sub: "Concordos recebidos" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-4 rounded-xl border"
              style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}
            >
              <p className="text-[12px] mb-2" style={{ color: "var(--color-text-muted)" }}>{stat.label}</p>
              <p className="text-[28px] font-bold leading-none mb-1" style={{ color: "var(--color-text)" }}>{String(stat.value).padStart(2, "0")}</p>
              <span className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>{stat.sub}</span>
            </div>
          ))}
        </div>

        {/* Categories + Weekly grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Categories Card */}
          <div
            className="p-5 rounded-xl border flex flex-col"
            style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold" style={{ color: "var(--color-text)" }}>Categorias</h3>
              <Link href="/usuario/minhas-reclamacoes" className="text-[12px] font-medium" style={{ color: "var(--color-primary)" }}>
                Ver Todas
              </Link>
            </div>
            
            {categoriesData.length === 0 ? (
              <p className="text-[12px] text-center py-6" style={{ color: "var(--color-text-muted)" }}>Nenhuma reclamação registrada no período.</p>
            ) : (
              <>
                <div className="w-full h-2 rounded-full flex overflow-hidden mb-4" style={{ backgroundColor: "var(--color-bg-alt)" }}>
                  {categoriesData.map((cat, i) => (
                    <div
                      key={i}
                      className="h-full transition-all"
                      style={{ width: `${cat.pct}%`, backgroundColor: cat.color }}
                      title={`${cat.label}: ${cat.pct}%`}
                    />
                  ))}
                </div>
                <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
                  {categoriesData.map((cat, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                        <span className="text-[13px] truncate" style={{ color: "var(--color-text-secondary)" }}>{cat.label}</span>
                      </div>
                      <span className="text-[12px] font-medium" style={{ color: "var(--color-text)" }}>{cat.count} ({cat.pct}%)</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Activity Chart */}
          <div
            className="p-5 rounded-xl border flex flex-col"
            style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}
          >
            <h3 className="text-[14px] font-semibold mb-5" style={{ color: "var(--color-text)" }}>Frequência Semanal</h3>
            <div className="h-[140px] flex items-end gap-4 pt-4 px-2">
              {["Sem 1", "Sem 2", "Sem 3", "Sem 4"].map((label, i) => {
                const count = weeklyCounts[i];
                const heightPct = Math.round((count / maxWeeklyCount) * 80) + 10;
                const isHighlight = i === 3;
                return (
                  <div key={label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                    {count > 0 && (
                      <span
                        className="absolute bottom-full mb-1 text-[10px] font-semibold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"
                        style={{ backgroundColor: "var(--color-text)", color: "var(--color-surface)" }}
                      >
                        {count}
                      </span>
                    )}
                    <div
                      className="w-full rounded transition-all"
                      style={{
                        height: count > 0 ? `${heightPct}%` : "10%",
                        backgroundColor: isHighlight ? "#1a8ccc" : "var(--color-bg-alt)",
                      }}
                    />
                    <span className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>{label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div
          className="rounded-xl border overflow-hidden"
          style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}
        >
          <div className="px-5 py-4 flex items-center justify-between border-b" style={{ borderColor: "var(--color-border)" }}>
            <h3 className="text-[14px] font-semibold" style={{ color: "var(--color-text)" }}>Histórico Recente</h3>
            <Link href="/usuario/minhas-reclamacoes" className="text-[12px] font-medium" style={{ color: "var(--color-primary)" }}>
              Ver tudo
            </Link>
          </div>
          
          {filteredReclamacoes.length === 0 ? (
            <div className="p-10 text-center text-[13px]" style={{ color: "var(--color-text-muted)" }}>
              Nenhuma reclamação ativa. Clique em "Nova Reclamação" para registrar.
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>
              {filteredReclamacoes.slice(0, 4).map((row) => {
                const color = getStatusColor(row.status);
                return (
                  <Link href={`/reclamacao/${row.id}`} key={row.id} className="block transition-colors" onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--color-bg)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                    <div className="px-5 py-3.5 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium truncate" style={{ color: "var(--color-text)" }}>{row.titulo}</p>
                        <p className="text-[11px] mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                          {row.endereco.split(",")[0]} · {formatDate(row.criadoEm)}
                        </p>
                      </div>
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium shrink-0"
                        style={{ backgroundColor: `${color}12`, color: color }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                        {getStatusLabel(row.status)}
                      </span>
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

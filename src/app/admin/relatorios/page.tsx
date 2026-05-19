"use client";

import React, { useState, useEffect } from "react";
import {
  FileText, Download, TrendingUp, TrendingDown, BarChart3,
  Calendar, PieChart, Activity, ArrowUpRight,
} from "lucide-react";
import { onReclamacoesChange, type Reclamacao } from "@/services/firebase";

const statusLabels: Record<string, string> = {
  aberto: "Aberto",
  em_analise: "Em Análise",
  em_andamento: "Em Andamento",
  resolvido: "Resolvido",
  critico: "Crítico",
};

const statusColors: Record<string, string> = {
  aberto: "#1a8ccc",
  em_analise: "#8B5CF6",
  em_andamento: "#F59E0B",
  resolvido: "#10B981",
  critico: "#EF4444",
};

export default function Relatorios() {
  const [reclamacoes, setReclamacoes] = useState<Reclamacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onReclamacoesChange(
      (items) => {
        setReclamacoes(items);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Métricas
  const total = reclamacoes.length;
  const resolvidas = reclamacoes.filter((r) => r.status === "resolvido").length;
  const taxaResolucao = total > 0 ? Math.round((resolvidas / total) * 100) : 0;
  const abertas = reclamacoes.filter((r) => r.status === "aberto").length;
  const criticas = reclamacoes.filter((r) => r.status === "critico").length;

  // Status breakdown
  const statusBreakdown = Object.entries(statusLabels).map(([key, label]) => {
    const count = reclamacoes.filter((r) => r.status === key).length;
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return { key, label, count, pct, color: statusColors[key] };
  });

  // Categorias
  const categoriaMap = new Map<string, number>();
  reclamacoes.forEach((r) => {
    categoriaMap.set(r.categoria, (categoriaMap.get(r.categoria) || 0) + 1);
  });
  const topCategorias = [...categoriaMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // Reclamações dos últimos 7 dias
  const now = Date.now();
  const last7 = reclamacoes.filter((r) => {
    const ts = r.criadoEm?.toDate ? r.criadoEm.toDate().getTime() : 0;
    return now - ts < 7 * 24 * 3600 * 1000;
  }).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-3 border-[#1a8ccc] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#112F4E] tracking-tight">Relatórios</h1>
          <p className="text-sm text-[#94A3B8] mt-1">Visão analítica do sistema de reclamações</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Total de Reclamações", value: total, icon: FileText, color: "#1a8ccc", sub: `${last7} nos últimos 7 dias` },
          { label: "Taxa de Resolução", value: `${taxaResolucao}%`, icon: TrendingUp, color: "#10B981", sub: `${resolvidas} resolvidas` },
          { label: "Abertas", value: abertas, icon: Activity, color: "#F59E0B", sub: "Aguardando análise" },
          { label: "Críticas", value: criticas, icon: TrendingDown, color: "#EF4444", sub: "Necessitam atenção" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">{kpi.label}</span>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: kpi.color + "15" }}>
                <kpi.icon className="w-4.5 h-4.5" style={{ color: kpi.color }} />
              </div>
            </div>
            <p className="text-3xl font-bold text-[#112F4E]">{kpi.value}</p>
            <p className="text-xs text-[#94A3B8] font-light">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-[#112F4E] mb-5 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-[#94A3B8]" />
            Distribuição por Status
          </h3>
          <div className="space-y-3">
            {statusBreakdown.map((s) => (
              <div key={s.key} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="font-medium text-[#112F4E]">{s.label}</span>
                  </div>
                  <span className="text-[#94A3B8] font-medium">{s.count} ({s.pct}%)</span>
                </div>
                <div className="h-2 bg-[#FAF7F2] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${s.pct}%`, backgroundColor: s.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categorias */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-[#112F4E] mb-5 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#94A3B8]" />
            Top Categorias
          </h3>
          {topCategorias.length === 0 ? (
            <p className="text-xs text-[#94A3B8] text-center py-6">Sem dados ainda.</p>
          ) : (
            <div className="space-y-3">
              {topCategorias.map(([cat, count], i) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                const colors = ["#1a8ccc", "#8B5CF6", "#F59E0B", "#10B981", "#EF4444", "#EC4899"];
                const c = colors[i % colors.length];
                return (
                  <div key={cat} className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-[#112F4E] w-28 truncate">{cat}</span>
                    <div className="flex-1 h-2.5 bg-[#FAF7F2] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: c }}
                      />
                    </div>
                    <span className="text-xs font-bold text-[#4A5D70] w-10 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Filter, Eye, EyeOff, Loader2 } from "lucide-react";
import { Map, MapMarker, MarkerContent, MapControls } from "@/components/ui/map";
import { onReclamacoesChange, type Reclamacao } from "@/services/firebase";
import { getCategoryByLabel, CATEGORIES } from "@/utils/categories";

const statusLabels: Record<string, { label: string; color: string }> = {
  aberto: { label: "Aberto", color: "#1a8ccc" },
  em_analise: { label: "Em Análise", color: "#8B5CF6" },
  em_andamento: { label: "Em Andamento", color: "#F59E0B" },
  resolvido: { label: "Resolvido", color: "#10B981" },
  critico: { label: "Crítico", color: "#EF4444" },
};

export default function AdminMapaPage() {
  const router = useRouter();
  const [reclamacoes, setReclamacoes] = useState<Reclamacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showResolvidas, setShowResolvidas] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [filterCategory, setFilterCategory] = useState<string>("todas");

  useEffect(() => {
    const unsubscribe = onReclamacoesChange(
      (items) => {
        setReclamacoes(items);
        setIsLoading(false);
      },
      (error) => {
        console.error("Erro no listener do mapa admin:", error);
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const filteredReclamacoes = useMemo(() => {
    return reclamacoes.filter((r) => {
      if (filterStatus !== "todos" && r.status !== filterStatus) return false;
      if (filterCategory !== "todas") {
        const clean = (r.categoria || "").toLowerCase();
        if (!clean.includes(filterCategory.toLowerCase())) return false;
      }
      if (!showResolvidas && r.status === "resolvido") return false;
      return true;
    });
  }, [reclamacoes, filterStatus, filterCategory, showResolvidas]);

  const stats = useMemo(() => {
    const total = filteredReclamacoes.length;
    const abertas = filteredReclamacoes.filter((r) => r.status === "aberto").length;
    const resolvidas = filteredReclamacoes.filter((r) => r.status === "resolvido").length;
    return { total, abertas, resolvidas };
  }, [filteredReclamacoes]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--color-primary)" }} />
        <p className="text-sm font-light" style={{ color: "var(--color-text-secondary)" }}>Carregando mapa...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b shrink-0" style={{ borderColor: "var(--color-border-light)" }}>
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#1a8ccc]" />
          <h1 className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>Mapa de Ocorrências</h1>
        </div>
        <div className="flex items-center gap-3 text-xs" style={{ color: "var(--color-text-secondary)" }}>
          <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#1a8ccc] font-bold">{stats.total} total</span>
          <span className="px-2.5 py-1 rounded-full bg-blue-50/60 text-[#1a8ccc] font-medium">{stats.abertas} abertas</span>
          <span className="px-2.5 py-1 rounded-full bg-green-50 text-[#10B981] font-medium">{stats.resolvidas} resolvidas</span>
        </div>
      </header>

      {/* Filters Bar */}
      <div className="flex items-center gap-3 px-6 py-3 border-b shrink-0 overflow-x-auto no-scrollbar" style={{ borderColor: "var(--color-border-light)" }}>
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5" style={{ color: "var(--color-text-muted)" }} />
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Filtros:</span>
        </div>

        {/* Status filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="text-xs px-3 py-1.5 rounded-lg border outline-none cursor-pointer"
          style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
        >
          <option value="todos">Todos Status</option>
          {Object.entries(statusLabels).map(([key, val]) => (
            <option key={key} value={key}>{val.label}</option>
          ))}
        </select>

        {/* Category filter */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="text-xs px-3 py-1.5 rounded-lg border outline-none cursor-pointer"
          style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
        >
          <option value="todas">Todas Categorias</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.label}>{cat.label}</option>
          ))}
        </select>

        {/* Toggle resolvidas */}
        <button
          onClick={() => setShowResolvidas(!showResolvidas)}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
            showResolvidas
              ? "border-[#10B981] bg-green-50 text-[#10B981]"
              : "border-[#E2E8F0] bg-white text-[#94A3B8]"
          }`}
        >
          {showResolvidas ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          Resolvidas
        </button>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <Map center={[-49.9458, -22.2139]} zoom={13}>
          <MapControls position="bottom-right" showZoom showLocate />

          {filteredReclamacoes.map((rec) => {
            if (!rec.latitude || !rec.longitude) return null;

            const cat = getCategoryByLabel(rec.categoria) ?? { color: "#94A3B8" };
            const isResolvida = rec.status === "resolvido";
            const isHovered = hoveredId === rec.id;
            const pinColor = cat.color;

            return (
              <MapMarker
                key={rec.id}
                longitude={rec.longitude}
                latitude={rec.latitude}
              >
                <MarkerContent>
                  <div
                    className="relative group cursor-pointer"
                    onMouseEnter={() => setHoveredId(rec.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => router.push(`/admin/reclamacoes/${rec.id}`)}
                  >
                    {/* Tooltip on hover */}
                    {isHovered && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-[200px] rounded-xl shadow-lg border p-3 z-50 pointer-events-none" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}>
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: pinColor }}>
                          {rec.categoria}
                        </p>
                        <p className="text-xs font-semibold truncate" style={{ color: "var(--color-text)" }}>{rec.titulo}</p>
                        <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t" style={{ borderColor: "var(--color-border-light)" }}>
                          <span className="text-[10px] font-semibold" style={{ color: statusLabels[rec.status]?.color }}>
                            {statusLabels[rec.status]?.label}
                          </span>
                          <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>{rec.concordos} concordos</span>
                        </div>
                        {/* Arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent" style={{ borderTopColor: "var(--color-surface)" }} />
                      </div>
                    )}

                    {!isResolvida && (
                      <div
                        className="absolute -inset-3 rounded-full animate-ping opacity-20"
                        style={{ backgroundColor: pinColor, animationDuration: "2.5s" }}
                      />
                    )}
                    <div
                      className={`w-4 h-4 rounded-full border-[3px] border-white shadow-lg relative z-10 transition-all duration-200 ${
                        isHovered ? "scale-150" : "group-hover:scale-125"
                      }`}
                      style={{
                        backgroundColor: pinColor,
                        opacity: isResolvida && !isHovered ? 0.5 : 1,
                      }}
                    />
                  </div>
                </MarkerContent>
              </MapMarker>
            );
          })}
        </Map>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 backdrop-blur-md rounded-xl shadow-lg border p-3 z-10 max-w-[180px]" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}>
          <p className="text-[9px] font-black uppercase tracking-widest mb-2" style={{ color: "var(--color-text)" }}>Legenda</p>
          <div className="space-y-1.5">
            {Object.entries(statusLabels).map(([key, val]) => (
              <div key={key} className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                    key === "resolvido" ? "opacity-50" : ""
                  }`}
                  style={{ backgroundColor: val.color }}
                />
                <span className="text-[10px]" style={{ color: "var(--color-text-secondary)" }}>
                  {val.label}
                  {key === "resolvido" && " (transparente)"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

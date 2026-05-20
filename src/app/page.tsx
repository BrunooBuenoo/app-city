"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Map, MapMarker, MarkerContent, MapControls, useMap } from "@/components/ui/map";
import MapNavbar from "@/components/layout/MapNavbar";
import LoginRequiredModal from "@/components/ui/modal/LoginRequiredModal";
import { getCategoryByLabel } from "@/utils/categories";
import { useAuth } from "@/contexts/AuthContext";
import { onReclamacoesChange, type Reclamacao } from "@/services/firebase";
import { findClusteredComplaints, getClusterCounts } from "@/utils/clustering";
import { ThumbsUp, AlertTriangle, TrendingUp } from "lucide-react";

const statusLabels: Record<string, { label: string; color: string }> = {
  aberto: { label: "Aberto", color: "#1a8ccc" },
  em_analise: { label: "Em Análise", color: "#8B5CF6" },
  em_andamento: { label: "Em Andamento", color: "#F59E0B" },
  resolvido: { label: "Resolvido", color: "#10B981" },
  critico: { label: "Crítico", color: "#EF4444" },
};

// ─── Inner component that has access to map context ───
function MapContent({
  reclamacoes,
  filteredReclamacoes,
  clusteredIds,
  clusterCounts,
  flyToTarget,
  setFlyToTarget,
}: {
  reclamacoes: Reclamacao[];
  filteredReclamacoes: Reclamacao[];
  clusteredIds: Set<string>;
  clusterCounts: Map<string, number>;
  flyToTarget: { lng: number; lat: number; id: string } | null;
  setFlyToTarget: (v: { lng: number; lat: number; id: string } | null) => void;
}) {
  const { map, isLoaded } = useMap();
  const [bouncingPin, setBouncingPin] = useState<string | null>(null);

  // Fly-to animation when target is set
  useEffect(() => {
    if (!map || !isLoaded || !flyToTarget) return;

    map.flyTo({
      center: [flyToTarget.lng, flyToTarget.lat],
      zoom: 17,
      duration: 2000,
      essential: true,
    });

    // Trigger bounce animation on the target pin
    setBouncingPin(flyToTarget.id);
    const timer = setTimeout(() => {
      setBouncingPin(null);
      setFlyToTarget(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [flyToTarget, map, isLoaded, setFlyToTarget]);

  return (
    <>
      <MapControls position="bottom-right" showZoom showLocate />

      {/* Pins vindos do Firestore em tempo real filtrados */}
      {filteredReclamacoes.map((rec) => {
        if (!rec.latitude || !rec.longitude) return null;

        const isInCluster = clusteredIds.has(rec.id);
        const neighborCount = clusterCounts.get(rec.id);
        const cat = getCategoryByLabel(rec.categoria) ?? { color: "#94A3B8" };
        const pinColor = isInCluster ? "#EF4444" : cat.color;
        const isBouncing = bouncingPin === rec.id;

        return (
          <MapMarker key={rec.id} longitude={rec.longitude} latitude={rec.latitude}>
            <MarkerContent>
              <Link href={`/reclamacao/${rec.id}`}>
                <div className={`relative group cursor-pointer ${isBouncing ? "animate-bounce" : ""}`}>
                  {/* Alert icon for clustered */}
                  {isInCluster && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-lg flex items-center gap-0.5 whitespace-nowrap z-20">
                      <AlertTriangle className="w-2.5 h-2.5" />
                      {neighborCount}
                    </div>
                  )}
                  <div
                    className="absolute -inset-3 rounded-full animate-ping opacity-20"
                    style={{ backgroundColor: pinColor, animationDuration: isInCluster ? "1.5s" : "2.5s" }}
                  />
                  <div
                    className={`w-4 h-4 rounded-full border-[3px] border-white shadow-lg relative z-10 group-hover:scale-125 transition-transform ${
                      isInCluster ? "ring-2 ring-red-400/50" : ""
                    }`}
                    style={{ backgroundColor: pinColor }}
                  />
                </div>
              </Link>
            </MarkerContent>
          </MapMarker>
        );
      })}
    </>
  );
}

export default function Home() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [reclamacoes, setReclamacoes] = useState<Reclamacao[]>([]);
  const [flyToTarget, setFlyToTarget] = useState<{ lng: number; lat: number; id: string } | null>(null);

  // Filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Listener em tempo real do Firestore
  useEffect(() => {
    const unsubscribe = onReclamacoesChange(
      (items) => {
        setReclamacoes(items);
      },
      (error) => {
        console.error("Erro ao carregar as reclamações em tempo real:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleFabClick = () => {
    if (isLoggedIn) {
      router.push("/reclamacao/nova");
    } else {
      setShowLoginModal(true);
    }
  };

  // Filtragem dinâmica
  const filteredReclamacoes = useMemo(() => {
    return reclamacoes.filter((rec) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const titleMatch = (rec.titulo || "").toLowerCase().includes(q);
        const descMatch = (rec.descricao || "").toLowerCase().includes(q);
        const addrMatch = (rec.endereco || "").toLowerCase().includes(q);
        if (!titleMatch && !descMatch && !addrMatch) return false;
      }
      if (selectedCategory) {
        const cleanRecCat = (rec.categoria || "").toLowerCase();
        const cleanSelCat = selectedCategory.toLowerCase();
        if (!cleanRecCat.includes(cleanSelCat)) return false;
      }
      if (selectedStatus && rec.status !== selectedStatus) {
        return false;
      }
      return true;
    });
  }, [reclamacoes, searchQuery, selectedCategory, selectedStatus]);

  // Clustering
  const clusteredIds = useMemo(
    () => findClusteredComplaints(filteredReclamacoes, 200),
    [filteredReclamacoes]
  );
  const clusterCounts = useMemo(
    () => getClusterCounts(filteredReclamacoes, 200),
    [filteredReclamacoes]
  );

  // Top 3 reclamações abertas com mais concordos
  const topReclamacoes = useMemo(() => {
    return [...filteredReclamacoes]
      .filter((r) => r.status !== "resolvido" && r.concordos > 0 && r.latitude && r.longitude)
      .sort((a, b) => b.concordos - a.concordos)
      .slice(0, 3);
  }, [filteredReclamacoes]);

  const handleFlyTo = useCallback((rec: Reclamacao) => {
    setFlyToTarget({
      lng: rec.longitude,
      lat: rec.latitude,
      id: rec.id,
    });
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Full-screen Interactive Map */}
      <div className="absolute inset-0 z-0">
        <Map center={[-49.9458, -22.2139]} zoom={14}>
          <MapContent
            reclamacoes={reclamacoes}
            filteredReclamacoes={filteredReclamacoes}
            clusteredIds={clusteredIds}
            clusterCounts={clusterCounts}
            flyToTarget={flyToTarget}
            setFlyToTarget={setFlyToTarget}
          />
        </Map>
      </div>

      {/* MapNavbar com propriedades de filtro */}
      <MapNavbar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      {/* ─── Top 3 Popular Complaints Pills ─── */}
      {topReclamacoes.length > 0 && (
        <div className="absolute top-[100px] left-1/2 -translate-x-1/2 w-full max-w-7xl z-20 px-4 pointer-events-none">
          <div className="flex gap-2 justify-center flex-wrap">
            {topReclamacoes.map((rec, i) => {
              const cat = getCategoryByLabel(rec.categoria);
              return (
                <button
                  key={rec.id}
                  onClick={() => handleFlyTo(rec)}
                  className="pointer-events-auto flex items-center gap-2 px-3.5 py-2 bg-white/95 backdrop-blur-xl rounded-full shadow-elevated border border-white/50 hover:shadow-[0_8px_24px_rgba(17,47,78,0.12)] hover:-translate-y-0.5 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className="material-symbols-outlined text-[16px]"
                      style={{ color: cat?.color ?? "#94A3B8" }}
                    >
                      {cat?.icon ?? "report"}
                    </span>
                    <span className="text-xs font-semibold text-[#112F4E] truncate max-w-[120px] md:max-w-[180px]">
                      {rec.titulo}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#10B981]/10 text-[#10B981]">
                    <ThumbsUp className="w-3 h-3" />
                    <span className="text-[10px] font-bold">{rec.concordos}</span>
                  </div>
                  {i === 0 && (
                    <div className="flex items-center gap-0.5 text-[#F59E0B]">
                      <TrendingUp className="w-3 h-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Desktop navigation tooltip */}
      <div className="absolute bottom-[240px] md:bottom-[245px] left-1/2 -translate-x-1/2 w-full max-w-7xl z-30 px-4 pointer-events-none">
        <div className="flex justify-start w-full">
          <div className="hidden md:flex pointer-events-auto flex-col gap-1 p-2.5 rounded-xl bg-white/90 backdrop-blur-md border border-[#E2E8F0] shadow-[0_4px_12px_rgba(0,0,0,0.05)] select-none max-w-[175px]">
            <div className="flex items-center gap-1 pb-1 border-b border-[#F1F5F9]">
              <span className="material-symbols-outlined text-[12px] text-[#1a8ccc] font-bold">mouse</span>
              <span className="text-[9px] font-black text-[#112F4E] uppercase tracking-widest">Navegação</span>
            </div>
            <div className="flex flex-col gap-1 text-[9px] font-bold text-[#64748B] mt-1">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[12px] text-[#1a8ccc]">pan_tool_alt</span>
                <span>Botão Esquerdo - Mover-se</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[12px] text-[#1a8ccc]">rotate_90_degrees_cw</span>
                <span>Botão Direito - Girar</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[12px] text-[#1a8ccc]">zoom_in</span>
                <span>Scroll - Zoom</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={handleFabClick}
        className="absolute bottom-44 md:bottom-36 right-4 z-30 w-14 h-14 bg-[#1a8ccc] hover:bg-[#1572a6] text-white rounded-2xl flex items-center justify-center shadow-elevated active:scale-95 hover:scale-105 transition-all cursor-pointer"
      >
        <span className="material-symbols-outlined text-[28px]">add</span>
      </button>

      {/* Bottom Cards Carousel — dados reais filtrados */}
      <div className="absolute bottom-10 md:bottom-12 left-0 right-0 z-20 px-4">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {filteredReclamacoes.slice(0, 10).map((card) => {
            const cat = getCategoryByLabel(card.categoria);
            const catColor = cat?.color ?? "#94A3B8";
            const st = statusLabels[card.status] ?? { label: card.status, color: "#94A3B8" };
            const isInCluster = clusteredIds.has(card.id);

            return (
              <Link
                key={card.id}
                href={`/reclamacao/${card.id}`}
                className={`min-w-[300px] max-w-[340px] bg-white/95 backdrop-blur-xl p-5 rounded-2xl shadow-elevated border flex flex-col gap-3 cursor-pointer hover:shadow-[0_12px_32px_rgba(17,47,78,0.1)] hover:-translate-y-1 transition-all duration-200 shrink-0 ${
                  isInCluster
                    ? "border-red-300 ring-1 ring-red-200"
                    : "border-white/50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    {isInCluster && (
                      <div className="flex items-center gap-1 text-[10px] font-bold text-red-500 uppercase tracking-wider mb-1">
                        <AlertTriangle className="w-3 h-3" />
                        Região crítica
                      </div>
                    )}
                    <span
                      className="text-[11px] font-bold uppercase tracking-widest"
                      style={{ color: catColor }}
                    >
                      {cat?.label ?? card.categoria}
                    </span>
                    <h3 className="text-base font-semibold text-[#112F4E] mt-0.5 truncate">
                      {card.titulo}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-[#4A5D70] leading-relaxed line-clamp-2 font-light">
                  {card.descricao}
                </p>
                <div className="flex justify-between items-center pt-2 border-t border-[#F5F2ED]">
                  <div className="flex items-center gap-1.5 text-[#94A3B8]">
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      favorite
                    </span>
                    <span className="text-xs font-medium">{card.concordos} Concordos</span>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: st.color }}>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: st.color }} />
                    {st.label}
                  </span>
                </div>
              </Link>
            );
          })}

          {/* Empty state */}
          {filteredReclamacoes.length === 0 && (
            <div className="min-w-[300px] bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-elevated border border-white/50 text-center">
              <span className="material-symbols-outlined text-[40px] text-[#E2E8F0] mb-2 block">map</span>
              <p className="text-sm text-[#94A3B8]">Nenhuma reclamação encontrada.</p>
            </div>
          )}
        </div>
      </div>

      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}

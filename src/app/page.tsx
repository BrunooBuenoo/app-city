"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Map, MapMarker, MarkerContent, MapControls } from "@/components/ui/map";
import MapNavbar from "@/components/layout/MapNavbar";
import LoginRequiredModal from "@/components/ui/modal/LoginRequiredModal";
import { getCategoryByLabel } from "@/utils/categories";
import { useAuth } from "@/contexts/AuthContext";
import { onReclamacoesChange, type Reclamacao } from "@/services/firebase";

const statusLabels: Record<string, { label: string; color: string }> = {
  aberto: { label: "Aberto", color: "#1a8ccc" },
  em_analise: { label: "Em Análise", color: "#8B5CF6" },
  em_andamento: { label: "Em Andamento", color: "#F59E0B" },
  resolvido: { label: "Resolvido", color: "#10B981" },
  critico: { label: "Crítico", color: "#EF4444" },
};

export default function Home() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [reclamacoes, setReclamacoes] = useState<Reclamacao[]>([]);

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

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Full-screen Interactive Map */}
      <div className="absolute inset-0 z-0">
        <Map center={[-49.9458, -22.2139]} zoom={14}>
          <MapControls position="bottom-right" showZoom showLocate />

          {/* Pins vindos do Firestore em tempo real */}
          {reclamacoes.map((rec) => {
            if (!rec.latitude || !rec.longitude) return null;
            const cat = getCategoryByLabel(rec.categoria) ?? { color: "#94A3B8" };
            const pinColor = cat.color;

            return (
              <MapMarker key={rec.id} longitude={rec.longitude} latitude={rec.latitude}>
                <MarkerContent>
                  <Link href={`/reclamacao/${rec.id}`}>
                    <div className="relative group cursor-pointer">
                      <div
                        className="absolute -inset-3 rounded-full animate-ping opacity-20"
                        style={{ backgroundColor: pinColor, animationDuration: "2.5s" }}
                      />
                      <div
                        className="w-4 h-4 rounded-full border-[3px] border-white shadow-lg relative z-10 group-hover:scale-125 transition-transform"
                        style={{ backgroundColor: pinColor }}
                      />
                    </div>
                  </Link>
                </MarkerContent>
              </MapMarker>
            );
          })}
        </Map>
      </div>

      {/* MapNavbar */}
      <MapNavbar />

      {/* FAB */}
      <button
        onClick={handleFabClick}
        className="absolute bottom-36 md:bottom-28 right-4 z-30 w-14 h-14 bg-[#1a8ccc] hover:bg-[#1572a6] text-white rounded-2xl flex items-center justify-center shadow-elevated active:scale-95 hover:scale-105 transition-all"
      >
        <span className="material-symbols-outlined text-[28px]">add</span>
      </button>

      {/* Bottom Cards Carousel — dados reais */}
      <div className="absolute bottom-6 md:bottom-8 left-0 right-0 z-20 px-4">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {reclamacoes.slice(0, 10).map((card) => {
            const cat = getCategoryByLabel(card.categoria);
            const catColor = cat?.color ?? "#94A3B8";
            const st = statusLabels[card.status] ?? { label: card.status, color: "#94A3B8" };

            return (
              <Link
                key={card.id}
                href={`/reclamacao/${card.id}`}
                className="min-w-[300px] max-w-[340px] bg-white/95 backdrop-blur-xl p-5 rounded-2xl shadow-elevated border border-white/50 flex flex-col gap-3 cursor-pointer hover:shadow-[0_12px_32px_rgba(17,47,78,0.1)] hover:-translate-y-1 transition-all duration-200 shrink-0"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span
                      className="text-[11px] font-bold uppercase tracking-widest"
                      style={{ color: catColor }}
                    >
                      {cat?.label ?? card.categoria}
                    </span>
                    <h3 className="text-base font-semibold text-[#112F4E] mt-0.5">
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
          {reclamacoes.length === 0 && (
            <div className="min-w-[300px] bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-elevated border border-white/50 text-center">
              <span className="material-symbols-outlined text-[40px] text-[#E2E8F0] mb-2 block">map</span>
              <p className="text-sm text-[#94A3B8]">Nenhuma reclamação ainda. Seja o primeiro!</p>
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

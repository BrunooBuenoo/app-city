"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Map, MapMarker, MarkerContent, MapControls } from "@/components/ui/map";
import MapNavbar from "@/components/layout/MapNavbar";
import LoginRequiredModal from "@/components/ui/modal/LoginRequiredModal";
import { getCategoryByLabel } from "@/utils/categories";
import { useAuth } from "@/contexts/AuthContext";
import { onReclamacoesChange, votar, type Reclamacao } from "@/services/firebase";

const statusLabels: Record<string, { label: string; color: string }> = {
  aberto: { label: "Aberto", color: "#1a8ccc" },
  em_analise: { label: "Em Análise", color: "#8B5CF6" },
  em_andamento: { label: "Em Andamento", color: "#F59E0B" },
  resolvido: { label: "Resolvido", color: "#10B981" },
  critico: { label: "Crítico", color: "#EF4444" },
};

// Subcomponente encapsulado para cada Pin 3D para isolar o estado de erro de imagem
function MapPin3D({ 
  rec, 
  pinColor, 
  cat, 
  isLoggedIn, 
  user, 
  setShowLoginModal 
}: { 
  rec: Reclamacao; 
  pinColor: string; 
  cat: any; 
  isLoggedIn: boolean; 
  user: any; 
  setShowLoginModal: (show: boolean) => void;
}) {
  const [imgError, setImgError] = useState(false);
  const temFoto = rec.fotos && rec.fotos.length > 0 && !imgError;
  const fotoUrl = temFoto ? rec.fotos[0] : "";
  const totalConcordos = rec.concordos ?? 0;
  const userVotouConcordo = user ? (rec.votantes?.[user.uid] === "concordo") : false;

  return (
    <MapMarker longitude={rec.longitude} latitude={rec.latitude}>
      <MarkerContent>
        <div className="relative flex flex-col items-center select-none group perspective-[1000px] pb-3">
          
          {/* SOMBRA 3D NO CHÃO DO MAPA */}
          <div 
            className="absolute bottom-1 w-6 h-1.5 bg-black/35 rounded-full blur-[1.5px] transition-all duration-300 group-hover:scale-125 group-hover:blur-[2.5px] group-hover:opacity-40" 
            style={{ transform: "rotateX(60deg) translateZ(-2px)", pointerEvents: "none" }}
          />
          
          {/* ANEL PULSANTE DE FRENTE PARA O CHÃO */}
          <div
            className="absolute bottom-[-2px] w-8 h-8 rounded-full border-2 animate-ping opacity-30"
            style={{ 
              borderColor: pinColor, 
              transform: "rotateX(75deg)", 
              animationDuration: "2.5s",
              pointerEvents: "none"
            }}
          />

          {/* CORPO FLUTUANTE DO PIN (COM INCLINAÇÃO 3D E TRANSLATE NO HOVER) */}
          <div 
            className="relative flex flex-col items-center transition-all duration-300 ease-out origin-bottom transform-style-3d group-hover:-translate-y-3 group-hover:rotateY(10deg) group-hover:rotateX(10deg)"
            style={{ 
              transform: "translateZ(0px)",
            }}
          >
            {/* BALÃO / CONTAINER DO CARD 3D */}
            <Link href={`/reclamacao/${rec.id}`}>
              <div 
                className="relative rounded-2xl border-2 bg-white flex items-center justify-center shadow-[0_12px_24px_rgba(0,0,0,0.15)] transition-all overflow-hidden shrink-0 transform-style-3d"
                style={{ 
                  width: "48px",
                  height: "48px",
                  borderColor: pinColor,
                  boxShadow: `0 10px 20px -5px ${pinColor}4D, 0 12px 24px -10px rgba(0,0,0,0.3)`
                }}
              >
                {/* MINIATURA DA FOTO EM 3D OU ÍCONE DA CATEGORIA */}
                {temFoto ? (
                  <img 
                    src={fotoUrl} 
                    alt={rec.titulo} 
                    width={48}
                    height={48}
                    onError={() => {
                      console.warn(`Falha ao carregar imagem para a reclamação ${rec.id}. Ativando fallback.`);
                      setImgError(true);
                    }}
                    className="w-full h-full object-cover rounded-xl scale-95 group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center rounded-xl font-bold text-lg select-none text-white scale-95 group-hover:scale-105 transition-transform duration-300"
                    style={{ backgroundColor: pinColor }}
                  >
                    {cat.label ? cat.label.charAt(0) : rec.categoria.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </Link>

            {/* CONECTOR (A PONTA DO BALÃO DO PIN QUE APONTA PRO CHÃO) */}
            <div 
              className="w-3 h-3 rotate-45 -mt-1.5 border-r border-b bg-white shadow-[2px_2px_2px_rgba(0,0,0,0.05)]"
              style={{ 
                borderColor: pinColor,
                backgroundColor: temFoto ? "#ffffff" : pinColor
              }}
            />

            {/* BOTÃO / PÍLULA DE CONCORDÂNCIA 3D FLUTUANTE */}
            <button
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isLoggedIn) {
                  setShowLoginModal(true);
                  return;
                }
                if (user) {
                  try {
                    await votar(rec.id, user.uid, "concordo");
                  } catch (err) {
                    console.error("Erro ao votar:", err);
                  }
                }
              }}
              className="absolute -top-3 -right-5 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-extrabold shadow-[0_6px_12px_rgba(0,0,0,0.15)] active:scale-90 hover:scale-105 transition-all select-none transform-style-3d cursor-pointer"
              style={{
                backgroundColor: userVotouConcordo ? pinColor : "#ffffff",
                color: userVotouConcordo ? "#ffffff" : "#112F4E",
                borderColor: pinColor,
                transform: "translateZ(8px)",
                boxShadow: userVotouConcordo 
                  ? `0 4px 10px ${pinColor}66, 0 2px 4px rgba(0,0,0,0.15)`
                  : `0 4px 8px rgba(0,0,0,0.1)`
              }}
            >
              <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: `"${userVotouConcordo ? 'FILL' : 'FILL'} ${userVotouConcordo ? 1 : 0}"` }}>
                favorite
              </span>
              <span>{totalConcordos}</span>
            </button>

          </div>
        </div>
      </MarkerContent>
    </MapMarker>
  );
}

export default function Home() {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [reclamacoes, setReclamacoes] = useState<Reclamacao[]>([]);

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
      router.push("/usuario/reclamacao/nova");
    } else {
      setShowLoginModal(true);
    }
  };

  // Filtragem dinâmica
  const filteredReclamacoes = reclamacoes.filter((rec) => {
    // 1. Filtro de Busca
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const titleMatch = (rec.titulo || "").toLowerCase().includes(q);
      const descMatch = (rec.descricao || "").toLowerCase().includes(q);
      const addrMatch = (rec.endereco || "").toLowerCase().includes(q);
      if (!titleMatch && !descMatch && !addrMatch) return false;
    }
    // 2. Filtro de Categoria
    if (selectedCategory) {
      const cleanRecCat = (rec.categoria || "").toLowerCase();
      const cleanSelCat = selectedCategory.toLowerCase();
      if (!cleanRecCat.includes(cleanSelCat)) return false;
    }
    // 3. Filtro de Status
    if (selectedStatus && rec.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Full-screen Interactive Map */}
      <div className="absolute inset-0 z-0">
        <Map center={[-49.9458, -22.2139]} zoom={14}>
          <MapControls position="bottom-right" showZoom showLocate />

          {/* Pins vindos do Firestore em tempo real filtrados */}
          {filteredReclamacoes.map((rec) => {
            if (!rec.latitude || !rec.longitude) return null;
            const cat = getCategoryByLabel(rec.categoria) ?? { color: "#94A3B8" };
            const pinColor = cat.color;

            return (
              <MapPin3D 
                key={rec.id}
                rec={rec}
                pinColor={pinColor}
                cat={cat}
                isLoggedIn={isLoggedIn}
                user={user}
                setShowLoginModal={setShowLoginModal}
              />
            );
          })}
        </Map>
      </div>

      {/* Faixas de Desfoque Gradual (Glassmorphism de profundidade limitado ao grid max-w-7xl) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[92px] px-3 md:px-4 z-10 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-b from-white/65 via-white/15 to-transparent backdrop-blur-[3px] rounded-b-2xl" />
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[230px] md:h-[240px] px-4 z-10 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-t from-white/75 via-white/15 to-transparent backdrop-blur-[3px] rounded-t-2xl" />
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

      {/* FAB Container para alinhar com a lateral direita (reta do avatar na navbar) */}
      <div className="absolute bottom-[240px] md:bottom-[245px] left-1/2 -translate-x-1/2 w-full max-w-7xl z-30 px-4 pointer-events-none">
        <div className="flex justify-end w-full">
          <button
            onClick={handleFabClick}
            className="w-14 h-14 bg-[#1a8ccc] hover:bg-[#1572a6] text-white rounded-2xl flex items-center justify-center shadow-elevated active:scale-95 hover:scale-105 transition-all cursor-pointer pointer-events-auto"
          >
            <span className="material-symbols-outlined text-[28px]">add</span>
          </button>
        </div>
      </div>

      {/* Bottom Cards Carousel — dados reais filtrados */}
      <div className="absolute bottom-10 md:bottom-12 left-1/2 -translate-x-1/2 w-full max-w-7xl z-20 px-4">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {filteredReclamacoes.slice(0, 10).map((card) => {
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

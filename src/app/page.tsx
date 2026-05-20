"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Map, MapMarker, MarkerContent, MapControls, MapPopup, useMap } from "@/components/ui/map";
import MapNavbar from "@/components/layout/MapNavbar";
import LoginRequiredModal from "@/components/ui/modal/LoginRequiredModal";
import { getCategoryByLabel } from "@/utils/categories";
import { useAuth } from "@/contexts/AuthContext";
import { onReclamacoesChange, votar, type Reclamacao } from "@/services/firebase";
import { findClusteredComplaints, getClusterCounts } from "@/utils/clustering";
import { ThumbsUp, AlertTriangle, TrendingUp } from "lucide-react";

const statusLabels: Record<string, { label: string; color: string }> = {
  aberto: { label: "Aberto", color: "#1a8ccc" },
  em_analise: { label: "Em Análise", color: "#8B5CF6" },
  em_andamento: { label: "Em Andamento", color: "#F59E0B" },
  resolvido: { label: "Resolvido", color: "#10B981" },
  critico: { label: "Crítico", color: "#EF4444" },
};
// Subcomponente encapsulado para cada Pin 3D para isolar o estado de erro de imagem (Atualizado para trigger de deploy)
function MapPin3D({ 
  rec, 
  pinColor, 
  cat, 
  isLoggedIn, 
  user, 
  setShowLoginModal,
  offsetX = 0, // Desvio lateral horizontal
  offsetY = 0, // Deslocamento vertical dinâmico
}: { 
  rec: Reclamacao; 
  pinColor: string; 
  cat: any; 
  isLoggedIn: boolean; 
  user: any; 
  setShowLoginModal: (show: boolean) => void;
  offsetX?: number;
  offsetY?: number;
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

          {/* HASTE DE CONEXÃO RADIAL (PONTILHADA VERMELHA) */}
          {offsetY > 0 && (() => {
            const d = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
            const graus = Math.atan2(offsetX, offsetY) * (180 / Math.PI);
            return (
              <div 
                className="absolute origin-bottom animate-scale-up"
                style={{ 
                  height: `${d - 16}px`,
                  bottom: "20px",
                  left: "50%",
                  borderLeft: "2px dashed #EF4444",
                  transform: `translateX(-50%) rotate(${graus}deg)`,
                  opacity: 0.85,
                  pointerEvents: "none"
                }}
              />
            );
          })()}
 
          {/* CORPO FLUTUANTE DO PIN (COM INCLINAÇÃO 3D E TRANSLATE NO HOVER + OFFSET RADIAL) */}
          <div 
            className="relative flex flex-col items-center transition-all duration-500 ease-out origin-bottom transform-style-3d group-hover:-translate-y-3 group-hover:rotateY(10deg) group-hover:rotateX(10deg)"
            style={{ 
              transform: `translate(${offsetX}px, ${-offsetY}px)`,
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
                    className="w-full h-full flex items-center justify-center rounded-xl select-none text-white scale-95 group-hover:scale-105 transition-transform duration-300"
                    style={{ backgroundColor: pinColor }}
                  >
                    <span className="material-symbols-outlined text-[24px]">
                      {cat.icon || "help_outline"}
                    </span>
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

            {/* MINI BADGE DE CATEGORIA NO CANTO SUPERIOR ESQUERDO (Para pins com foto para fácil identificação) */}
            {temFoto && (
              <div
                className="absolute -top-3 -left-5 z-20 flex items-center justify-center w-6 h-6 rounded-full border text-white shadow-[0_6px_12px_rgba(0,0,0,0.15)] select-none transform-style-3d hover:scale-110 transition-transform cursor-pointer"
                style={{
                  backgroundColor: pinColor,
                  borderColor: "#ffffff",
                  transform: "translateZ(8px)",
                }}
                title={`Categoria: ${cat.label}`}
              >
                <span className="material-symbols-outlined text-[13px] font-bold">
                  {cat.icon || "help_outline"}
                </span>
              </div>
            )}

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

// Subcomponente premium para agrupar marcadores idênticos no mesmo local
function MapMultiPin3D({
  reclamacoes,
  isLoggedIn,
  user,
  setShowLoginModal,
}: {
  reclamacoes: Reclamacao[];
  isLoggedIn: boolean;
  user: any;
  setShowLoginModal: (show: boolean) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Usamos o primeiro como âncora geográfica
  const ancor = reclamacoes[0];
  const totalReclamacoes = reclamacoes.length;
  const pinColor = "#8B5CF6"; // Roxo elegante para aglomerados (clusters) multi-tema

  // Se estiver expandido, renderizamos todos os pins empilhados verticalmente + botão de fechar na base!
  if (isExpanded) {
    return (
      <>
        {/* Renderiza cada reclamação com um desvio lateral e vertical radial (espalhamento em leque) */}
        {reclamacoes.map((rec, i) => {
          const cat = getCategoryByLabel(rec.categoria) ?? { color: "#94A3B8" };
          const pinColor = cat.color;

          // Fórmula de dispersão radial (leque) uniforme
          const minAngle = -50;
          const maxAngle = 50;
          const total = reclamacoes.length;
          
          let angle = 0;
          if (total > 1) {
            angle = minAngle + (i * (maxAngle - minAngle)) / (total - 1);
          }
          const rad = angle * (Math.PI / 180);
          
          const radius = 80; // Raio de dispersão
          const baseHeight = 55; // Altura de base para não sobrepor o botão de fechar
          
          const offsetX = Math.round(Math.sin(rad) * radius);
          const offsetY = Math.round(baseHeight + Math.cos(rad) * radius);

          return (
            <MapPin3D
              key={`expanded-${rec.id}`}
              rec={rec}
              pinColor={pinColor}
              cat={cat}
              isLoggedIn={isLoggedIn}
              user={user}
              setShowLoginModal={setShowLoginModal}
              offsetX={offsetX}
              offsetY={offsetY}
            />
          );
        })}

        {/* Botão de fechar sutil na base geográfica no chão */}
        <MapMarker longitude={ancor.longitude} latitude={ancor.latitude}>
          <MarkerContent>
            <div className="relative flex flex-col items-center">
              {/* SOMBRA 3D NO CHÃO DO MAPA */}
              <div 
                className="absolute bottom-1 w-6 h-1.5 bg-black/35 rounded-full blur-[1.5px] transition-all" 
                style={{ transform: "rotateX(60deg) translateZ(-2px)", pointerEvents: "none" }}
              />
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="w-8 h-8 rounded-full bg-[#EF4444] border-2 border-white text-white shadow-elevated flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer animate-scale-up z-30"
                style={{
                  transform: "translateY(28px) translateZ(10px)",
                }}
                title="Recolher relatos"
              >
                <span className="material-symbols-outlined text-[16px] font-bold">close</span>
              </button>
            </div>
          </MarkerContent>
        </MapMarker>
      </>
    );
  }

  // Se estiver fechado (estado inicial), renderiza o MultiPin roxo com a contagem acumulada
  return (
    <MapMarker longitude={ancor.longitude} latitude={ancor.latitude}>
      <MarkerContent>
        <div 
          onClick={() => setIsExpanded(true)}
          className="relative flex flex-col items-center select-none group perspective-[1000px] pb-3"
          title="Clique para expandir relatos deste local"
        >
          {/* SOMBRA 3D NO CHÃO DO MAPA */}
          <div 
            className="absolute bottom-1 w-7 h-1.5 bg-black/40 rounded-full blur-[1.5px] transition-all duration-300 group-hover:scale-125 group-hover:blur-[2.5px] group-hover:opacity-50" 
            style={{ transform: "rotateX(60deg) translateZ(-2px)", pointerEvents: "none" }}
          />
          
          {/* ANEL PULSANTE DUPLO VERMELHO DE EMERGÊNCIA */}
          <div
            className="absolute bottom-[-2px] w-10 h-10 rounded-full border-2 animate-ping opacity-35"
            style={{ 
              borderColor: "#EF4444", 
              transform: "rotateX(75deg)", 
              animationDuration: "1.8s",
              pointerEvents: "none"
            }}
          />

          {/* CORPO FLUTUANTE DO PIN MULTIPLO AMPLIADO */}
          <div 
            className="relative flex flex-col items-center transition-all duration-300 ease-out origin-bottom transform-style-3d group-hover:-translate-y-3 group-hover:scale-105"
          >
            {/* BALÃO EMPILHADO VERMELHO MAIOR */}
            <div 
              className="relative rounded-2xl border-2 bg-gradient-to-tr from-[#B91C1C] to-[#EF4444] flex items-center justify-center shadow-lg transition-all overflow-hidden shrink-0"
              style={{ 
                width: "54px",
                height: "54px",
                borderColor: "#ffffff",
                boxShadow: `0 10px 22px -4px rgba(239, 68, 68, 0.5), 0 12px 24px -10px rgba(0,0,0,0.35)`
              }}
            >
              <div className="flex flex-col items-center justify-center text-white select-none">
                <span className="material-symbols-outlined text-[28px] animate-pulse">warning</span>
              </div>
            </div>

            {/* CONECTOR VERMELHO */}
            <div 
              className="w-3.5 h-3.5 rotate-45 -mt-1.5 border-r border-b bg-[#B91C1C] shadow-[2px_2px_2px_rgba(0,0,0,0.05)] border-white"
            />

            {/* BADGE DE NÚMERO SUPERIOR DIREITO */}
            <div className="absolute -top-3 -right-4 z-20 flex items-center justify-center w-6.5 h-6.5 rounded-full bg-[#112F4E] border-2 border-white text-[10px] font-black text-white shadow-md animate-bounce">
              {totalReclamacoes}
            </div>
          </div>
        </div>
      </MarkerContent>
    </MapMarker>
  );
}

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
  const { isLoggedIn, user } = useAuth();
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
      router.push("/usuario/reclamacao/nova");
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
          <MapControls position="bottom-right" showZoom showLocate />

          {/* Pins vindos do Firestore em tempo real filtrados com agrupamento inteligente */}
          {(() => {
            const getCoordKey = (lat: number, lng: number) => {
              return `${lat.toFixed(5)},${lng.toFixed(5)}`;
            };

            const agrupadas: Record<string, Reclamacao[]> = {};
            filteredReclamacoes.forEach((rec) => {
              if (!rec.latitude || !rec.longitude) return;
              const key = getCoordKey(rec.latitude, rec.longitude);
              if (!agrupadas[key]) agrupadas[key] = [];
              agrupadas[key].push(rec);
            });

            return Object.values(agrupadas).map((grupo) => {
              if (grupo.length === 0) return null;
              
              if (grupo.length === 1) {
                const rec = grupo[0];
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
              } else {
                const ancor = grupo[0];
                return (
                  <MapMultiPin3D
                    key={`group-${ancor.id}`}
                    reclamacoes={grupo}
                    isLoggedIn={isLoggedIn}
                    user={user}
                    setShowLoginModal={setShowLoginModal}
                  />
                );
              }
            });
          })()}
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

      {/* Legenda de Navegação do Mapa (Alinhado com a lateral esquerda do grid, na reta do FAB) */}
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


      {/* Bottom Cards Carousel — dados reais filtrados */}
      <div className="absolute bottom-10 md:bottom-12 left-1/2 -translate-x-1/2 w-full max-w-7xl z-20 px-4">
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

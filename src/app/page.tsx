"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Map, MapMarker, MarkerContent, MapControls, MapPopup, useMap } from "@/components/ui/map";
import MapNavbar from "@/components/layout/MapNavbar";
import LoginRequiredModal from "@/components/ui/modal/LoginRequiredModal";
import ParceriaModal from "@/components/ui/modal/ParceriaModal";
import { getCategoryByLabel } from "@/utils/categories";
import { useAuth } from "@/contexts/AuthContext";
import { onEstabelecimentosChange, listarCupons, resgatarCupom, type Estabelecimento, type Cupom } from "@/services/firebase";
import { findClusteredComplaints, getClusterCounts } from "@/utils/clustering";
import { Tag, MapPin, Compass, Trophy, Star, Phone, Loader2, Sparkles, X, Store } from "lucide-react";
import CamadaClimatica from "@/components/clima/camada-climatica";
import BotaoClima from "@/components/clima/botao-clima";
import { ClimaProvider } from "@/contexts/ClimaContext";
import { cn } from "@/lib/utils";

const statusLabels: Record<string, { label: string; color: string }> = {
  pendente_aprovacao: { label: "Pendente", color: "#F59E0B" },
  ativo: { label: "Ativo", color: "#10B981" },
  suspenso: { label: "Suspenso", color: "#EF4444" },
};

const ESTABELECIMENTOS_MOCKADOS: Estabelecimento[] = [
  {
    id: "mock-masp",
    empresaId: "empresa-mock-masp",
    nome: "MASP - Museu de Arte de SP",
    descricao: "O Museu de Arte de São Paulo Assis Chateaubriand é um marco na Avenida Paulista. Famoso por seu vão livre de 74 metros sustentado por colunas vermelhas, abriga um acervo fabuloso de obras de arte ocidentais e exposições deslumbrantes.",
    categoria: "educacao_servicos",
    logoUrl: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=150&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&auto=format&fit=crop&q=80",
    latitude: -23.5614,
    longitude: -46.6559,
    endereco: "Av. Paulista, 1578 - Bela Vista, São Paulo - SP",
    telefone: "(11) 3149-5959",
    status: "ativo",
    criadoEm: null,
    cardapioUrl: "https://masp.org.br/exposicoes",
    servicos: "Terça-feira grátis: 10h às 20h. Quarta a Domingo: 10h às 18h. Segunda-feira: Fechado.",
  },
  {
    id: "mock-pinacoteca",
    empresaId: "empresa-mock-pina",
    nome: "Pinacoteca de São Paulo",
    descricao: "O museu de artes visuais mais antigo do estado de São Paulo, fundado in 1905. O icônico edifício de tijolos projetado por Ramos de Azevedo na Praça da Luz abriga um dos acervos mais expressivos de arte brasileira do país.",
    categoria: "educacao_servicos",
    logoUrl: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=150&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=600&auto=format&fit=crop&q=80",
    latitude: -23.5342,
    longitude: -46.6341,
    endereco: "Praça da Luz, 2 - Luz, São Paulo - SP",
    telefone: "(11) 3324-1000",
    status: "ativo",
    criadoEm: null,
    cardapioUrl: "https://pinacoteca.org.br/programacao",
    servicos: "Quarta a Segunda: 10h às 18h. Quinta-feira grátis das 18h às 20h. Terça-feira: Fechado.",
  },
  {
    id: "mock-zoologico",
    empresaId: "empresa-mock-zoo",
    nome: "Zoológico de São Paulo",
    descricao: "Com mais de 3.000 animais, o Zoológico de São Paulo é o maior do Brasil. Está inserido em uma exuberante reserva preservada de Mata Atlântica e promove diversão educativa, conscientização e conservação ambiental para toda a família.",
    categoria: "educacao_servicos",
    logoUrl: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=150&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&auto=format&fit=crop&q=80",
    latitude: -23.6508,
    longitude: -46.6214,
    endereco: "Av. Miguel Estéfano, 4241 - Água Funda, São Paulo - SP",
    telefone: "(11) 4967-0700",
    status: "ativo",
    criadoEm: null,
    cardapioUrl: "https://zoologico.com.br/ingressos",
    servicos: "Diariamente: 09h às 17h (Entrada permitida até as 16h). Passeios noturnos guiados sob agendamento.",
  },
  {
    id: "mock-mercadao",
    empresaId: "empresa-mock-merc",
    nome: "Mercado Municipal de São Paulo (Mercadão)",
    descricao: "Famoso no mundo inteiro, o Mercadão é um verdadeiro polo gastronômico no centro da cidade. Conhecido por seus vitrais maravilhosos, boxes de frutas exóticas raras e o lendário sanduíche gigante de mortadela quente com queijo.",
    categoria: "alimentacao",
    logoUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80",
    latitude: -23.5417,
    longitude: -46.6289,
    endereco: "Rua da Cantareira, 306 - Centro Histórico, São Paulo - SP",
    telefone: "(11) 3313-3365",
    status: "ativo",
    criadoEm: null,
    cardapioUrl: "https://www.instagram.com/oportaldomercadao/",
    servicos: "Segunda a Sábado: 06h às 18h. Domingo e Feriados: 06h às 16h. Estacionamento privado no local.",
  },
  {
    id: "mock-ibirapuera",
    empresaId: "empresa-mock-ibira",
    nome: "Parque do Ibirapuera",
    descricao: "Considerado o pulmão verde da capital paulista e o parque urbano mais visitado da América Latina. Oferece ciclovias, lagos, museus de renome (como o MAM), auditórios de Oscar Niemeyer e uma vasta área de piquenique sob as árvores.",
    categoria: "saude_beleza",
    logoUrl: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=150&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=600&auto=format&fit=crop&q=80",
    latitude: -23.5874,
    longitude: -46.6558,
    endereco: "Av. Pedro Álvares Cabral - Vila Mariana, São Paulo - SP",
    telefone: "(11) 3889-6100",
    status: "ativo",
    criadoEm: null,
    cardapioUrl: "https://parqueibirapuera.org",
    servicos: "Aberto diariamente das 05h às 00h. Entrada totalmente gratuita. Aluguel de bicicletas nos portões 3 e 4.",
  },
];
// Subcomponente encapsulado para cada Pin 3D para isolar o estado de erro de imagem
function MapPin3D({
  rec,
  pinColor,
  cat,
  isLoggedIn,
  user,
  setShowLoginModal,
  offsetX = 0, // Desvio lateral horizontal
  offsetY = 0, // Deslocamento vertical dinâmico
  isHot = false, // Se o pin pertence aos destaques
  onVerCupons,
}: {
  rec: Estabelecimento;
  pinColor: string;
  cat: any;
  isLoggedIn: boolean;
  user: any;
  setShowLoginModal: (show: boolean) => void;
  offsetX?: number;
  offsetY?: number;
  isHot?: boolean;
  onVerCupons: (rec: Estabelecimento) => void;
}) {
  const [imgError, setImgError] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const temFoto = rec.logoUrl && !imgError;
  const fotoUrl = temFoto ? rec.logoUrl : "";

  return (
    <MapMarker 
      longitude={rec.longitude} 
      latitude={rec.latitude} 
      onClick={(e: any) => {
        if (e && e.stopPropagation) e.stopPropagation();
        setShowPopup(true);
      }}
    >
      <MarkerContent>
        <div className="relative flex flex-col items-center select-none group perspective-[1000px] pb-3">

          {/* SOMBRA 3D NO CHÃO DO MAPA */}
          <div
            className="absolute w-7 h-2 bg-black/50 blur-[2.5px] transition-all duration-300 group-hover:scale-125 group-hover:blur-[3.5px] group-hover:opacity-30"
            style={{ transform: "translateY(2px) rotateX(65deg)", pointerEvents: "none" }}
          />

          {/* ANEL PULSANTE DE FRENTE PARA O CHÃO */}
          <div
            className="absolute w-8 h-8 rounded-full border-[2.5px] animate-ping opacity-30"
            style={{
              borderColor: pinColor,
              transform: "translateY(-4px) rotateX(75deg)",
              animationDuration: "2.5s",
              pointerEvents: "none"
            }}
          />

          {/* ANÉIS PULSANTES DE DESTAQUE */}
          {isHot && (
            <>
              <div
                className="absolute w-12 h-12 rounded-full border-[2.5px] border-amber-500 animate-ping opacity-75"
                style={{
                  transform: "translateY(-4px) rotateX(75deg)",
                  animationDuration: "2s",
                  pointerEvents: "none",
                }}
              />
            </>
          )}

          {/* HASTE DE CONEXÃO RADIAL (PONTILHADA) */}
          {offsetY > 0 && (() => {
            const d = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
            const graus = Math.atan2(offsetX, offsetY) * (180 / Math.PI);
            return (
              <div
                className="absolute origin-bottom animate-scale-up"
                style={{
                  height: `${d - 4}px`,
                  bottom: "2px",
                  left: "50%",
                  borderLeft: "2px dashed #F59E0B",
                  transform: `translateX(-50%) rotate(${graus}deg)`,
                  opacity: 0.85,
                  pointerEvents: "none"
                }}
              />
            );
          })()}

          {/* CORPO FLUTUANTE DO PIN (TEARDROP PREMIUM) */}
          <div
            className="relative flex flex-col items-center transition-transform duration-400 ease-out origin-bottom group-hover:-translate-y-2 group-hover:scale-[1.03]"
            style={{
              transform: `translate(${offsetX}px, ${-offsetY}px)`,
              zIndex: isHot ? 40 : 10,
            }}
          >
            <div className="cursor-pointer pointer-events-auto">
              {/* SHAPE DO TEARDROP */}
              <div className="relative w-[44px] h-[44px] flex items-center justify-center">
                <div 
                  className="absolute inset-0 rounded-[50%_50%_50%_4px] rotate-[-45deg] border-[2.5px] border-white transition-colors duration-300"
                  style={{ 
                    backgroundColor: pinColor,
                    boxShadow: `inset 2px 2px 4px rgba(255,255,255,0.5), inset -2px -2px 4px rgba(0,0,0,0.15), 0 10px 18px -4px ${pinColor}80, 0 4px 6px -2px rgba(0,0,0,0.2)` 
                  }}
                />
                
                {/* Círculo Interno com o conteúdo */}
                <div 
                  className="absolute inset-[4px] rounded-full bg-white flex items-center justify-center overflow-hidden z-10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
                >
                  {temFoto ? (
                    <img
                      src={fotoUrl}
                      alt={rec.nome}
                      onError={() => {
                        console.warn(`Falha ao carregar imagem para o estabelecimento ${rec.id}.`);
                        setImgError(true);
                      }}
                      className="w-full h-full object-cover scale-105"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-[20px]" style={{ color: pinColor }}>
                      {cat.icon || "help_outline"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* MINI BADGE DE CATEGORIA NO CANTO SUPERIOR ESQUERDO */}
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

            {/* PÍLULA DE DESCONTOS/CUPONS FLUTUANTE */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onVerCupons(rec);
              }}
              className="absolute -top-3 -right-5 z-20 flex items-center gap-1 px-2 py-0.5 bg-white dark:bg-zinc-900 border rounded-full text-[9px] font-extrabold shadow-[0_6px_12px_rgba(0,0,0,0.15)] select-none transform-style-3d cursor-pointer border-[#10B981] text-[#10B981] hover:scale-105 active:scale-95 transition-all"
              style={{
                transform: "translateZ(8px)"
              }}
            >
              <Tag className="w-2.5 h-2.5 text-[#10B981]" />
              <span>Cupons</span>
            </button>

          </div>
        </div>
      </MarkerContent>

      {/* POPUP DE VISUALIZAÇÃO RÁPIDA (MODAL NO MAPA) */}
      {showPopup && (
        <QuickViewPopup 
          rec={rec} 
          cat={cat} 
          pinColor={pinColor} 
          temFoto={temFoto} 
          fotoUrl={fotoUrl} 
          onClose={() => setShowPopup(false)} 
          onVerCupons={onVerCupons}
          offsetY={offsetY} 
          offsetX={offsetX} 
        />
      )}
    </MapMarker>
  );
}

// COMPONENTE DE MODAL RÁPIDO DO MAPA
function QuickViewPopup({
  rec,
  cat,
  pinColor,
  temFoto,
  fotoUrl,
  onClose,
  onVerCupons,
  offsetY = 0,
  offsetX = 0,
}: {
  rec: Estabelecimento;
  cat: any;
  pinColor: string;
  temFoto: boolean;
  fotoUrl: string;
  onClose: () => void;
  onVerCupons: (rec: Estabelecimento) => void;
  offsetY?: number;
  offsetX?: number;
}) {
  return (
    <MapPopup
      longitude={rec.longitude}
      latitude={rec.latitude}
      onClose={onClose}
      offset={offsetY > 0 ? [offsetX, -offsetY - 20] : 30}
      className="p-0 border-none bg-transparent shadow-none"
    >
      <div className="w-[280px] sm:w-[300px] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-2xl overflow-hidden shadow-[0_20px_60px_-10px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-zinc-800 pointer-events-auto">
        {rec.bannerUrl ? (
          <div className="h-[120px] w-full relative">
            <img src={rec.bannerUrl} alt={rec.nome} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <button 
              onClick={onClose}
              className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors backdrop-blur-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
            <div className="absolute bottom-3 left-3 right-3 text-white flex items-center gap-2">
              {temFoto && (
                <img src={fotoUrl} className="w-8 h-8 rounded-full border border-white object-cover bg-white shrink-0" alt="logo" />
              )}
              <span className="text-sm font-bold truncate flex-1">{rec.nome}</span>
            </div>
          </div>
        ) : (
          <div className="p-4 pb-3 border-b border-slate-100 dark:border-zinc-800 flex items-start gap-3 relative" style={{ backgroundColor: `${pinColor}10` }}>
            <button 
              onClick={onClose}
              className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
            {temFoto ? (
              <img src={fotoUrl} className="w-10 h-10 rounded-full object-cover border bg-white shrink-0" alt="logo" />
            ) : (
              <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-white shadow-sm mt-1" style={{ backgroundColor: pinColor }}>
                <span className="material-symbols-outlined">{cat.icon}</span>
              </div>
            )}
            <h3 className="font-bold text-slate-800 dark:text-zinc-100 flex-1 line-clamp-2 pr-4">{rec.nome}</h3>
          </div>
        )}

        {/* Content */}
        <div className="p-4 space-y-3 text-left">
          <p className="text-[13px] leading-snug text-slate-600 dark:text-zinc-300 line-clamp-3 font-light">
            {rec.descricao || "Nenhuma descrição disponível para este parceiro."}
          </p>

          <div className="text-[11px] text-slate-500 dark:text-zinc-400 space-y-1.5">
            {rec.telefone && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{rec.telefone}</span>
              </div>
            )}
            {rec.endereco && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{rec.endereco}</span>
              </div>
            )}
            {rec.cardapioUrl && (
              <div className="flex items-center gap-1.5 text-blue-500 font-bold">
                <span className="material-symbols-outlined text-[13px] shrink-0">restaurant_menu</span>
                <a href={rec.cardapioUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">Visualizar Cardápio</a>
              </div>
            )}
            {rec.servicos && (
              <div className="flex items-start gap-1.5 text-purple-500 font-bold">
                <span className="material-symbols-outlined text-[13px] shrink-0 mt-0.5">design_services</span>
                <span className="line-clamp-2">Serviços: {rec.servicos}</span>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider" style={{ backgroundColor: `${statusLabels[rec.status]?.color || "#94A3B8"}20`, color: statusLabels[rec.status]?.color || "#94A3B8" }}>
              {statusLabels[rec.status]?.label || "Desconhecido"}
            </span>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onVerCupons(rec);
              }}
              className="text-xs font-bold text-[#10B981] hover:text-[#059669] flex items-center gap-1 group/link cursor-pointer"
            >
              Ver Benefícios 
              <span className="material-symbols-outlined text-[14px] group-hover/link:translate-x-0.5 transition-transform">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </MapPopup>
  );
}





// Subcomponente dedicado a salvar o estado de visualização do mapa (viewport) no localStorage
function MapViewportPersistence() {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded) return;

    // Salvar estado de posicionamento sempre que o mapa parar de mover, girar ou inclinar
    const handleMoveEnd = () => {
      try {
        const center = map.getCenter();
        const zoom = map.getZoom();
        const bearing = map.getBearing();
        const pitch = map.getPitch();

        const viewport = {
          center: [center.lng, center.lat],
          zoom,
          bearing,
          pitch,
        };

        localStorage.setItem("navegandosp:map_viewport", JSON.stringify(viewport));
      } catch (err) {
        console.error("[MapViewportPersistence] Erro ao salvar viewport:", err);
      }
    };

    map.on("moveend", handleMoveEnd);
    return () => {
      map.off("moveend", handleMoveEnd);
    };
  }, [map, isLoaded]);

  return null;
}

// ─── Inner component that has access to map context ───
function MapContent({
  reclamacoes,
  filteredReclamacoes,
  clusteredIds,
  clusterCounts,
  flyToTarget,
  setFlyToTarget,
  onVerCupons,
}: {
  reclamacoes: Estabelecimento[];
  filteredReclamacoes: Estabelecimento[];
  clusteredIds: Set<string>;
  clusterCounts: Map<string, number>;
  flyToTarget: { lng: number; lat: number; id: string } | null;
  setFlyToTarget: (v: { lng: number; lat: number; id: string } | null) => void;
  onVerCupons: (rec: Estabelecimento) => void;
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
          <SimpleMapPin 
            key={rec.id} 
            rec={rec} 
            isInCluster={isInCluster} 
            neighborCount={neighborCount || 0} 
            cat={cat} 
            pinColor={pinColor} 
            isBouncing={isBouncing} 
            onVerCupons={onVerCupons}
          />
        );
      })}
    </>
  );
}

// COMPONENTE DO PIN SIMPLES
function SimpleMapPin({
  rec,
  isInCluster,
  neighborCount,
  cat,
  pinColor,
  isBouncing,
  onVerCupons,
}: {
  rec: Estabelecimento;
  isInCluster: boolean;
  neighborCount: number;
  cat: any;
  pinColor: string;
  isBouncing: boolean;
  onVerCupons: (rec: Estabelecimento) => void;
}) {
  const [showPopup, setShowPopup] = useState(false);
  const [imgError, setImgError] = useState(false);
  const temFoto = rec.logoUrl && !imgError;
  const fotoUrl = temFoto ? rec.logoUrl : "";

  return (
    <MapMarker 
      longitude={rec.longitude} 
      latitude={rec.latitude}
      onClick={(e: any) => {
        if (e && e.stopPropagation) e.stopPropagation();
        setShowPopup(true);
      }}
    >
      <MarkerContent>
        <div className={`relative group cursor-pointer pointer-events-auto ${isBouncing ? "animate-bounce" : ""}`}>
          {isInCluster && (
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-lg flex items-center gap-0.5 whitespace-nowrap z-20">
              <Star className="w-2.5 h-2.5 text-white" />
              {neighborCount}
            </div>
          )}
          <div
            className="absolute -inset-3 rounded-full animate-ping opacity-20"
            style={{ backgroundColor: pinColor, animationDuration: isInCluster ? "1.5s" : "2.5s" }}
          />
          <div
            className={`w-4 h-4 rounded-full border-[3px] border-white shadow-lg relative z-10 group-hover:scale-125 transition-transform ${isInCluster ? "ring-2 ring-red-400/50" : ""}`}
            style={{ backgroundColor: pinColor }}
          />
        </div>
      </MarkerContent>

      {showPopup && (
        <QuickViewPopup 
          rec={rec} 
          cat={cat} 
          pinColor={pinColor} 
          temFoto={temFoto} 
          fotoUrl={fotoUrl} 
          onClose={() => setShowPopup(false)} 
          onVerCupons={onVerCupons}
          offsetY={0} 
          offsetX={0} 
        />
      )}
    </MapMarker>
  );
}

// COMPONENTE PARA DESTACAR A RUA (WAZE-LIKE) E MOVER O MAPA
function MapHighlight({ geojson, bbox }: { geojson?: any; bbox?: string[] }) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded || !geojson) return;

    const sourceId = "highlight-source";
    const fillLayerId = "highlight-layer-fill";
    const lineLayerId = "highlight-layer-line";
    const circleLayerId = "highlight-layer-circle";

    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: "geojson",
        data: geojson,
      });
    } else {
      (map.getSource(sourceId) as any).setData(geojson);
    }

    if (!map.getLayer(fillLayerId)) {
      map.addLayer({
        id: fillLayerId,
        type: "fill",
        source: sourceId,
        filter: ["==", "$type", "Polygon"],
        paint: {
          "fill-color": "#8B5CF6", // Waze-like purple/blue
          "fill-opacity": 0.2,
        },
      });
    }

    if (!map.getLayer(lineLayerId)) {
      map.addLayer({
        id: lineLayerId,
        type: "line",
        source: sourceId,
        filter: ["!=", "$type", "Point"],
        paint: {
          "line-color": "#8B5CF6",
          "line-width": 6,
          "line-opacity": 0.8,
        },
      });
    }

    if (!map.getLayer(circleLayerId)) {
      map.addLayer({
        id: circleLayerId,
        type: "circle",
        source: sourceId,
        filter: ["==", "$type", "Point"],
        paint: {
          "circle-radius": 10,
          "circle-color": "#8B5CF6",
          "circle-stroke-width": 3,
          "circle-stroke-color": "#FFFFFF",
          "circle-opacity": 0.8,
        },
      });
    }

    if (bbox) {
      map.fitBounds([
        [parseFloat(bbox[2]), parseFloat(bbox[0])], // [minLng, minLat]
        [parseFloat(bbox[3]), parseFloat(bbox[1])], // [maxLng, maxLat]
      ], { padding: 50, duration: 2000 });
    }

    return () => {
      // Limpeza das camadas ao desmontar para sumir com o destaque
      if (map.getLayer(fillLayerId)) map.removeLayer(fillLayerId);
      if (map.getLayer(lineLayerId)) map.removeLayer(lineLayerId);
      if (map.getLayer(circleLayerId)) map.removeLayer(circleLayerId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    };
  }, [map, isLoaded, geojson, bbox]);

  return null;
}

// COMPONENTE PARA RECUPERAR A LOCALIZACAO DO USUARIO (WAZE-LIKE)
function UserLocationManager({
  userLocation,
  setUserLocation,
}: {
  userLocation: { lat: number; lng: number } | null;
  setUserLocation: (loc: { lat: number; lng: number } | null) => void;
}) {
  const { map, isLoaded } = useMap();
  const [hasFlown, setHasFlown] = useState(false);

  useEffect(() => {
    if (!map || !isLoaded) return;

    if (!userLocation && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
        },
        (err) => {
          console.warn("Geolocalização indisponível ou negada pelo usuário.");
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, [map, isLoaded, userLocation, setUserLocation]);

  useEffect(() => {
    if (map && isLoaded && userLocation && !hasFlown) {
      map.flyTo({
        center: [userLocation.lng, userLocation.lat],
        zoom: 15.5,
        duration: 2500,
        essential: true,
      });
      setHasFlown(true);
    }
  }, [map, isLoaded, userLocation, hasFlown]);

  if (!userLocation) return null;

  return (
    <MapMarker latitude={userLocation.lat} longitude={userLocation.lng}>
      <MarkerContent>
        <div className="relative group cursor-pointer z-50 pointer-events-none">
          <div
            className="absolute -inset-3 rounded-full animate-ping opacity-30 bg-[#1a8ccc]"
            style={{ animationDuration: "2.5s" }}
          />
          <div className="w-5 h-5 rounded-full border-[2.5px] border-white shadow-lg relative z-10 bg-[#1a8ccc] flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          </div>
        </div>
      </MarkerContent>
    </MapMarker>
  );
}

// COMPONENTE PARA VOLTAR O MAPA AO LIMPAR A BUSCA
function MapAutoRecenter({
  highlightedAddress,
  userLocation,
  initialViewport,
}: {
  highlightedAddress: any;
  userLocation: { lat: number; lng: number } | null;
  initialViewport: any;
}) {
  const { map, isLoaded } = useMap();
  const prevHighlight = useRef(highlightedAddress);

  useEffect(() => {
    if (!map || !isLoaded) return;

    if (prevHighlight.current && !highlightedAddress) {
      if (userLocation) {
        map.flyTo({
          center: [userLocation.lng, userLocation.lat],
          zoom: 15.5,
          duration: 1500,
          essential: true,
        });
      } else if (initialViewport) {
        map.flyTo({
          center: initialViewport.center,
          zoom: initialViewport.zoom,
          duration: 1500,
          essential: true,
        });
      }
    }

    prevHighlight.current = highlightedAddress;
  }, [highlightedAddress, userLocation, initialViewport, map, isLoaded]);

  return null;
}

export default function Home() {
  const router = useRouter();
  const { isLoggedIn, profile, user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showParceriaModal, setShowParceriaModal] = useState(false);
  const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[]>([]);
  const [selectedEstabelecimento, setSelectedEstabelecimento] = useState<Estabelecimento | null>(null);
  const [cupons, setCupons] = useState<Cupom[]>([]);
  const [loadingCupons, setLoadingCupons] = useState(false);
  const [showCuponsModal, setShowCuponsModal] = useState(false);
  const [resgateSucessoCodigo, setResgateSucessoCodigo] = useState<string | null>(null);
  const [resgatandoId, setResgatandoId] = useState<string | null>(null);

  const [flyToTarget, setFlyToTarget] = useState<{ lng: number; lat: number; id: string } | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Viewport inicial persistida no cliente
  const [initialViewport, setInitialViewport] = useState<{
    center: [number, number];
    zoom: number;
    bearing: number;
    pitch: number;
  } | null>(null);

  // Estados para recolher/expandir seções
  const [showTopPills, setShowTopPills] = useState(false);
  const [showBottomCarousel, setShowBottomCarousel] = useState(false);

  // Filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [highlightedAddress, setHighlightedAddress] = useState<any>(null);

  // Efeito pós-montagem para recuperar viewport salva
  useEffect(() => {
    const saved = localStorage.getItem("navegandosp:map_viewport");
    if (saved) {
      try {
        const viewport = JSON.parse(saved);
        const [lng, lat] = viewport.center;

        // Limita a recuperação automática a coordenadas da Grande São Paulo Capital
        // Isso evita que viewports antigas de desenvolvimento (ex: Marília) centralizem o mapa incorretamente
        const centroSP = [-46.6333, -23.5505];
        const distLng = Math.abs(lng - centroSP[0]);
        const distLat = Math.abs(lat - centroSP[1]);
        const pertoDaCapital = distLng <= 0.6 && distLat <= 0.6;

        if (pertoDaCapital) {
          setInitialViewport({
            center: [lng, lat],
            zoom: viewport.zoom ?? 12,
            bearing: viewport.bearing ?? 0,
            pitch: viewport.pitch ?? 0,
          });
          return;
        }
      } catch (err) {
        console.error("Erro ao recuperar viewport inicial:", err);
      }
    }

    setInitialViewport({
      center: [-46.6333, -23.5505],
      zoom: 12,
      bearing: 0,
      pitch: 0,
    });
  }, []);

  // Solicitar geolocalização ao acessar o mapa
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.warn("Geolocalização negada ou indisponível:", err.message);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);

  // Listener em tempo real do Firestore
  useEffect(() => {
    const unsubscribe = onEstabelecimentosChange(
      (items) => {
        setEstabelecimentos(items);
      },
      (error) => {
        console.error("Erro ao carregar os estabelecimentos em tempo real:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleFabClick = () => {
    if (isLoggedIn) {
      if (profile?.funcao === "empresa" || profile?.funcao === "admin") {
        router.push("/empresa/dashboard");
      } else {
        setShowParceriaModal(true);
      }
    } else {
      setShowParceriaModal(true);
    }
  };

  const handleVerCupons = async (estab: Estabelecimento) => {
    setSelectedEstabelecimento(estab);
    setLoadingCupons(true);
    setShowCuponsModal(true);
    setResgateSucessoCodigo(null);

    if (estab.id.startsWith("mock-")) {
      // Cupons mockados para locais turísticos de São Paulo
      const mocks: Record<string, Cupom[]> = {
        "mock-masp": [
          {
            id: "cupom-masp-1",
            titulo: "10% OFF na Loja MASP",
            descricao: "Válido para catálogos de exposições, souvenirs e produtos exclusivos na loja oficial do museu.",
            codigoBase: "MASPARTE",
            validade: null,
            limitePorUsuario: 1,
            ativo: true,
            criadoEm: null,
          },
          {
            id: "cupom-masp-2",
            titulo: "Café Espresso Cortesia",
            descricao: "Ganhe um café espresso cortesia ao consumir qualquer fatia de bolo ou salgado no MASP Café.",
            codigoBase: "MASPCAFE",
            validade: null,
            limitePorUsuario: 1,
            ativo: true,
            criadoEm: null,
          },
        ],
        "mock-pinacoteca": [
          {
            id: "cupom-pina-1",
            titulo: "Guia de Áudio Gratuito",
            descricao: "Retire o dispositivo de áudio-guia na recepção sem custo e mergulhe na história da arte brasileira.",
            codigoBase: "PINAAUDIO",
            validade: null,
            limitePorUsuario: 1,
            ativo: true,
            criadoEm: null,
          },
          {
            id: "cupom-pina-2",
            titulo: "10% OFF na Flor Café Pinacoteca",
            descricao: "Desconto especial em cafés especiais e quitutes na charmosa cafeteria integrada ao Jardim da Luz.",
            codigoBase: "FLORPINA",
            validade: null,
            limitePorUsuario: 1,
            ativo: true,
            criadoEm: null,
          },
        ],
        "mock-zoologico": [
          {
            id: "cupom-zoo-1",
            titulo: "15% de Desconto na Entrada Inteira",
            descricao: "Apresente o cupom na bilheteria física e ganhe 15% de desconto na compra de ingresso tipo Inteira.",
            codigoBase: "ZOOSP15",
            validade: null,
            limitePorUsuario: 1,
            ativo: true,
            criadoEm: null,
          },
          {
            id: "cupom-zoo-2",
            titulo: "Cortesia Picolé no Zoo Lanches",
            descricao: "Ganhe um picolé de frutas na compra de qualquer combo infantil no quiosque central.",
            codigoBase: "ZOOPICOLE",
            validade: null,
            limitePorUsuario: 1,
            ativo: true,
            criadoEm: null,
          },
        ],
        "mock-mercadao": [
          {
            id: "cupom-merc-1",
            titulo: "Refrigerante Cortesia no Bar do Mané",
            descricao: "Ganhe uma lata de refrigerante ou guaraná ao pedir o famoso e gigantesco sanduíche de mortadela.",
            codigoBase: "MORTADELA",
            validade: null,
            limitePorUsuario: 1,
            ativo: true,
            criadoEm: null,
          },
        ],
        "mock-ibirapuera": [
          {
            id: "cupom-ibira-1",
            titulo: "10% OFF no Aluguel de Bicicletas",
            descricao: "Desconto válido para a primeira hora de locação de bicicletas individuais nos portões 3 ou 4.",
            codigoBase: "IBIRABIKE",
            validade: null,
            limitePorUsuario: 1,
            ativo: true,
            criadoEm: null,
          },
        ],
      };

      setCupons(mocks[estab.id] || []);
      setLoadingCupons(false);
      return;
    }

    try {
      const list = await listarCupons(estab.empresaId, estab.id, true);
      setCupons(list);
    } catch (err) {
      console.error("Erro ao listar cupons:", err);
    }
    setLoadingCupons(false);
  };

  const handleResgatarCupom = async (cupom: Cupom) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    if (!user || !selectedEstabelecimento) return;
    setResgatandoId(cupom.id);

    if (selectedEstabelecimento.id.startsWith("mock-")) {
      // Simulação instantânea de resgate para estabelecimentos de demonstração
      setTimeout(() => {
        const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
        const codigo = `${cupom.codigoBase}-${randomStr}`;
        setResgateSucessoCodigo(codigo);
        setResgatandoId(null);
      }, 800);
      return;
    }

    try {
      const codigo = await resgatarCupom(
        selectedEstabelecimento.empresaId,
        selectedEstabelecimento.id,
        selectedEstabelecimento.nome,
        cupom.id,
        cupom.titulo,
        user.uid,
        cupom.codigoBase
      );
      setResgateSucessoCodigo(codigo);
    } catch (err) {
      console.error("Erro ao resgatar cupom:", err);
      alert("Não foi possível resgatar o cupom. Tente novamente.");
    }
    setResgatandoId(null);
  };

  // Filtragem dinâmica
  const filteredEstabelecimentos = useMemo(() => {
    // Mescla estabelecimentos em tempo real com as atrações e passeios mockados em São Paulo
    const todosEstabelecimentos = [...estabelecimentos, ...ESTABELECIMENTOS_MOCKADOS];

    return todosEstabelecimentos.filter((estab) => {
      if (selectedStatus && estab.status !== selectedStatus) {
        return false;
      }
      if (selectedCategory) {
        const cleanRecCat = (estab.categoria || "").toLowerCase();
        const cleanSelCat = selectedCategory.toLowerCase();
        if (!cleanRecCat.includes(cleanSelCat)) return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase().trim();
        const nameMatch = estab.nome.toLowerCase().includes(query);
        const descMatch = estab.descricao.toLowerCase().includes(query);
        const addrMatch = estab.endereco.toLowerCase().includes(query);
        if (!nameMatch && !descMatch && !addrMatch) return false;
      }
      return true;
    });
  }, [estabelecimentos, selectedCategory, selectedStatus, searchQuery]);

  // Clustering
  const clusteredIds = useMemo(
    () => findClusteredComplaints(filteredEstabelecimentos as any, 200),
    [filteredEstabelecimentos]
  );
  const clusterCounts = useMemo(
    () => getClusterCounts(filteredEstabelecimentos as any, 200),
    [filteredEstabelecimentos]
  );

  // Estabelecimentos em Destaque (Destaques)
  const topEstabelecimentos = useMemo(() => {
    return [...filteredEstabelecimentos].slice(0, 3);
  }, [filteredEstabelecimentos]);

  const topReclamacoesIds = useMemo(() => {
    return new Set(topEstabelecimentos.map((e) => e.id));
  }, [topEstabelecimentos]);

  const [isMobile, setIsMobile] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Monitorar redimensionamento
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Altura estimada da Navbar
  const navbarHeight = useMemo(() => {
    if (isMobile) {
      let height = 76;
      if (filtersOpen) height += 156;
      if (mobileMenuOpen) height += 172;
      return height;
    } else {
      let height = 88;
      if (filtersOpen) height += 96;
      return height;
    }
  }, [isMobile, filtersOpen, mobileMenuOpen]);

  const pillsTop = navbarHeight + 12;

  const buttonsTop = useMemo(() => {
    const hasPills = topEstabelecimentos.length > 0 && showTopPills;
    if (hasPills) {
      return pillsTop + 55;
    } else {
      return navbarHeight + (isMobile ? 12 : 16);
    }
  }, [navbarHeight, pillsTop, topEstabelecimentos.length, showTopPills, isMobile]);

  const handleFlyTo = useCallback((rec: Estabelecimento) => {
    setFlyToTarget({
      lng: rec.longitude,
      lat: rec.latitude,
      id: rec.id,
    });
  }, []);

  return (
    <ClimaProvider>
      <div className="relative w-screen h-[100dvh] overflow-hidden">
        {/* Full-screen Interactive Map */}
        <div className="absolute inset-0 z-0">
          {initialViewport ? (
            <Map
              center={initialViewport.center}
              zoom={initialViewport.zoom}
              bearing={initialViewport.bearing}
              pitch={initialViewport.pitch}
            >
              <MapViewportPersistence />
              <MapControls position="bottom-right" showZoom showLocate />
              <CamadaClimatica buttonsTop={buttonsTop} />

              {/* Pins vindos do Firestore em tempo real filtrados */}
              {filteredEstabelecimentos.map((rec) => {
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
                    isHot={topReclamacoesIds.has(rec.id)}
                    onVerCupons={handleVerCupons}
                  />
                );
              })}

              {highlightedAddress && highlightedAddress.geojson && (
                <MapHighlight 
                  geojson={highlightedAddress.geojson} 
                  bbox={highlightedAddress.boundingbox} 
                />
              )}

              <UserLocationManager
                userLocation={userLocation}
                setUserLocation={setUserLocation}
              />
              <MapAutoRecenter
                highlightedAddress={highlightedAddress}
                userLocation={userLocation}
                initialViewport={initialViewport}
              />
            </Map>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 transition-all duration-300">
              <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-elevated">
                <Loader2 className="w-8 h-8 text-[#1a8ccc] animate-spin" />
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Carregando mapa interativo...</span>
              </div>
            </div>
          )}
        </div>

        {/* Faixas de Desfoque Gradual (Glassmorphism de profundidade limitado ao grid max-w-7xl) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[92px] px-3 md:px-4 z-10 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-b from-white/65 dark:from-zinc-950/80 via-white/15 dark:via-zinc-950/20 to-transparent backdrop-blur-[3px] rounded-b-2xl" />
        </div>
        <div
          className={cn(
            "absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[230px] md:h-[240px] px-4 z-10 pointer-events-none transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) transform-gpu",
            showBottomCarousel
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6 scale-95"
          )}
        >
          <div className="w-full h-full bg-gradient-to-t from-white/75 dark:from-zinc-950/90 via-white/15 dark:via-zinc-950/20 to-transparent backdrop-blur-[3px] rounded-t-2xl" />
        </div>

        {/* MapNavbar com propriedades de filtro e callbacks de redimensionamento */}
        <MapNavbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          onFiltersToggle={setFiltersOpen}
          onMobileMenuToggle={setMobileMenuOpen}
          onAddressSelect={setHighlightedAddress}
        />

        {/* ─── Top 3 Popular Partners Pills ─── */}
        {topEstabelecimentos.length > 0 && (
          <div
            className={cn(
              "absolute left-1/2 -translate-x-1/2 w-full max-w-7xl z-20 px-2 md:px-4 pointer-events-none transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) transform-gpu",
              showTopPills
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 -translate-y-12 scale-95 pointer-events-none"
            )}
            style={{ top: `${pillsTop}px` }}
          >
            <div 
              className="flex flex-nowrap gap-2 overflow-x-auto pb-3 pt-1 px-2 items-center justify-start md:justify-center snap-x snap-mandatory [&::-webkit-scrollbar]:hidden pointer-events-auto w-max max-w-full mx-auto"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {topEstabelecimentos.map((rec, i) => {
                const cat = getCategoryByLabel(rec.categoria);
                return (
                  <button
                    key={rec.id}
                    onClick={() => handleFlyTo(rec)}
                    className="shrink-0 snap-center pointer-events-auto flex items-center gap-2 px-3.5 py-2 bg-white/95 dark:bg-zinc-900/90 backdrop-blur-xl rounded-full shadow-elevated border border-white/50 dark:border-zinc-800/50 hover:shadow-[0_8px_24px_rgba(17,47,78,0.12)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 transition-all cursor-pointer group animate-in fade-in zoom-in-95 duration-300"
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className="material-symbols-outlined text-[16px]"
                        style={{ color: cat?.color ?? "#94A3B8" }}
                      >
                        {cat?.icon ?? "storefront"}
                      </span>
                      <span className="text-xs font-semibold text-[#112F4E] dark:text-zinc-100 truncate max-w-[120px] md:max-w-[180px]">
                        {rec.nome}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#10B981]/10 text-[#10B981]">
                      <Tag className="w-3 h-3 text-[#10B981]" />
                      <span className="text-[10px] font-bold">Cupons</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Botão de Alternar Destaques */}
        {topEstabelecimentos.length > 0 && (
          <div 
            className="absolute left-4 md:left-[calc((100vw-1280px)/2+16px)] z-30 pointer-events-none transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)"
            style={{ top: `${buttonsTop}px` }}
          >
            <button
              onClick={() => setShowTopPills(!showTopPills)}
              className={cn(
                "flex items-center rounded-full border shadow-elevated transition-all duration-300 pointer-events-auto active:scale-95 group cursor-pointer",
                !showTopPills ? "w-9 h-9 justify-center p-0" : "gap-2 px-4 py-2.5",
                showTopPills
                  ? "bg-amber-500 border-amber-400 text-white hover:bg-amber-600 hover:border-amber-500 shadow-[0_4px_14px_rgba(245,158,11,0.4)]"
                  : "bg-white/95 dark:bg-zinc-900/90 backdrop-blur-xl border-slate-200 dark:border-zinc-800/50 text-[#112F4E] dark:text-zinc-100 hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-[0_8px_24px_rgba(17,47,78,0.12)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] hover:-translate-y-0.5"
              )}
              title={showTopPills ? "Recolher parceiros em destaque" : "Mostrar parceiros em destaque"}
            >
              <div className={cn("relative transition-transform duration-500", showTopPills && "scale-110")}>
                <Star className={cn("w-5 h-5 transition-colors", showTopPills ? "text-white" : "text-[#112F4E] dark:text-zinc-100 group-hover:animate-bounce")} />
              </div>
              <span 
                className={cn(
                  "text-xs font-bold tracking-wide uppercase select-none",
                  !showTopPills && "hidden"
                )}
              >
                Parceiros
              </span>
            </button>
          </div>
        )}

        {/* Botão de Clima Flutuante no Top-Right */}
        <div 
          className="absolute right-4 md:right-[calc((100vw-1280px)/2+16px)] z-30 pointer-events-none transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)"
          style={{ top: `${buttonsTop}px` }}
        >
          <BotaoClima />
        </div>

        {/* FAB Container para alinhar com a lateral direita (reta do avatar na navbar) */}
        <div
          className={cn(
            "absolute left-1/2 -translate-x-1/2 w-full max-w-7xl z-30 px-4 pointer-events-none transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)",
            showBottomCarousel
              ? "bottom-[240px] md:bottom-[245px]"
              : "bottom-[100px] md:bottom-[110px]"
          )}
        >
          <div className="flex justify-end w-full">
            {isLoggedIn && (profile?.funcao === "empresa" || profile?.funcao === "admin") ? (
              <button
                onClick={handleFabClick}
                title="Cadastrar Novo Estabelecimento"
                className="w-14 h-14 bg-[#1a8ccc] hover:bg-[#1572a6] text-white rounded-2xl flex items-center justify-center shadow-elevated active:scale-95 hover:scale-105 transition-all cursor-pointer pointer-events-auto group relative"
              >
                <span className="material-symbols-outlined text-[28px]">add</span>
                <span className="absolute right-16 scale-0 group-hover:scale-100 transition-all duration-200 bg-zinc-900/90 dark:bg-white/95 text-white dark:text-zinc-900 text-[10px] font-bold py-1.5 px-3 rounded-lg shadow-md whitespace-nowrap">
                  Novo Estabelecimento
                </span>
              </button>
            ) : (
              <button
                onClick={handleFabClick}
                className="h-14 px-5 bg-gradient-to-r from-[#1a8ccc] to-[#1572a6] hover:from-[#1572a6] hover:to-[#1a8ccc] text-white rounded-2xl flex items-center gap-2 shadow-elevated hover:shadow-[0_8px_30px_rgba(26,140,204,0.3)] active:scale-95 hover:scale-105 transition-all cursor-pointer pointer-events-auto"
              >
                <Store className="w-5 h-5 animate-pulse text-sky-200" />
                <span className="text-xs font-black tracking-wider uppercase select-none">Seja um Parceiro</span>
              </button>
            )}
          </div>
        </div>

        {/* Legenda de Navegação do Mapa (Alinhado com a lateral esquerda do grid, na reta do FAB) */}
        <div
          className={cn(
            "absolute left-1/2 -translate-x-1/2 w-full max-w-7xl z-30 px-4 pointer-events-none transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)",
            showBottomCarousel
              ? "bottom-[240px] md:bottom-[245px]"
              : "bottom-[100px] md:bottom-[110px]"
          )}
        >
          <div className="flex justify-start w-full">
            <div className="hidden md:flex pointer-events-auto flex-col gap-1 p-2.5 rounded-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-[#E2E8F0] dark:border-zinc-800 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-none select-none max-w-[175px]">
              <div className="flex items-center gap-1 pb-1 border-b border-[#F1F5F9] dark:border-zinc-800/80">
                <span className="material-symbols-outlined text-[12px] text-[#1a8ccc] font-bold">mouse</span>
                <span className="text-[9px] font-black text-[#112F4E] dark:text-zinc-100 uppercase tracking-widest">Navegação</span>
              </div>
              <div className="flex flex-col gap-1 text-[9px] font-bold text-[#64748B] dark:text-zinc-400 mt-1">
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


        {/* Bottom Cards Carousel */}
        <div
          className={cn(
            "absolute left-1/2 -translate-x-1/2 w-full max-w-7xl z-20 px-4 transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) transform-gpu",
            showBottomCarousel
              ? "bottom-10 md:bottom-12 opacity-100 translate-y-0 scale-100"
              : "bottom-[-10px] opacity-0 translate-y-[120%] scale-95 pointer-events-none"
          )}
        >
          {/* Botão para recolher a lista */}
          {showBottomCarousel && (
            <div className="flex justify-center mb-2 animate-in fade-in duration-300">
              <button
                onClick={() => setShowBottomCarousel(false)}
                className="pointer-events-auto flex items-center gap-1.5 px-4 py-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md hover:bg-white dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shadow-[0_6px_20px_rgba(17,47,78,0.08)] dark:shadow-none rounded-full text-[10.5px] font-bold text-[#112F4E] dark:text-zinc-100 hover:text-[#1a8ccc] active:scale-95 transition-all select-none cursor-pointer tracking-wider uppercase"
              >
                <span>RECOLHER</span>
                <span className="material-symbols-outlined text-[14px] font-bold">expand_more</span>
              </button>
            </div>
          )}

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {filteredEstabelecimentos.slice(0, 10).map((card) => {
              const cat = getCategoryByLabel(card.categoria);
              const catColor = cat?.color ?? "#94A3B8";
              const st = statusLabels[card.status] ?? { label: card.status, color: "#94A3B8" };

              return (
                <div
                  key={card.id}
                  onClick={() => handleVerCupons(card)}
                  className="min-w-[300px] max-w-[340px] bg-white/95 dark:bg-zinc-900/90 backdrop-blur-xl p-5 rounded-2xl shadow-elevated border border-white/50 dark:border-zinc-800/50 flex flex-col gap-3 cursor-pointer hover:shadow-[0_12px_32px_rgba(17,47,78,0.1)] dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all duration-200 shrink-0"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span
                        className="text-[11px] font-bold uppercase tracking-widest"
                        style={{ color: catColor }}
                      >
                        {cat?.label ?? card.categoria}
                      </span>
                      <h3 className="text-base font-semibold text-[#112F4E] dark:text-zinc-100 mt-0.5 truncate">
                        {card.nome}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-[#4A5D70] dark:text-zinc-300 leading-relaxed line-clamp-2 font-light">
                    {card.descricao}
                  </p>
                  <div className="flex justify-between items-center pt-2 border-t border-[#F5F2ED] dark:border-zinc-800/50">
                    <div className="flex items-center gap-1 text-[#10B981]">
                      <Tag className="w-3.5 h-3.5 text-[#10B981]" />
                      <span className="text-xs font-semibold">Resgatar Benefícios</span>
                    </div>
                    <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: st.color }}>
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: st.color }} />
                      {st.label}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Empty state */}
            {filteredEstabelecimentos.length === 0 && (
              <div className="min-w-[300px] bg-white/95 dark:bg-zinc-900/90 backdrop-blur-xl p-6 rounded-2xl shadow-elevated border border-white/50 dark:border-zinc-800/50 text-center">
                <span className="material-symbols-outlined text-[40px] text-[#E2E8F0] dark:text-zinc-700 mb-2 block">storefront</span>
                <p className="text-sm text-[#94A3B8] dark:text-zinc-400">Nenhum parceiro comercial encontrado.</p>
              </div>
            )}
          </div>
        </div>

        {/* Botão flutuante para expandir carrossel inferior quando estiver recolhido */}
        {!showBottomCarousel && (
          <div className="absolute bottom-10 md:bottom-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-in slide-in-from-bottom-6 duration-500 cubic-bezier(0.16, 1, 0.3, 1)">
            <button
              onClick={() => setShowBottomCarousel(true)}
              className="pointer-events-auto flex items-center gap-1.5 px-4 py-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md hover:bg-white dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shadow-[0_6px_20px_rgba(17,47,78,0.08)] dark:shadow-none rounded-full text-[10.5px] font-bold text-[#112F4E] dark:text-zinc-100 hover:text-[#1a8ccc] active:scale-95 transition-all select-none cursor-pointer tracking-wider uppercase"
            >
              <span className="material-symbols-outlined text-[14px] font-bold">expand_less</span>
              <span>Últimos parceiros ({filteredEstabelecimentos.length})</span>
            </button>
          </div>
        )}

        {/* MODAL DE BENEFÍCIOS & CUPONS (GLASSMORPHISM PREMIUM) */}
        {showCuponsModal && selectedEstabelecimento && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-lg bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-3xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-slate-200/50 dark:border-zinc-800/50 animate-in zoom-in-95 duration-300">
              
              {/* Header com Banner e Logo */}
              <div className="relative h-[160px] bg-gradient-to-br from-[#112F4E] to-[#1E4E80] flex items-end p-6">
                {selectedEstabelecimento.bannerUrl && (
                  <img src={selectedEstabelecimento.bannerUrl} alt="banner" className="absolute inset-0 w-full h-full object-cover opacity-60 animate-fade-in" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                
                <button
                  onClick={() => setShowCuponsModal(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all backdrop-blur-md cursor-pointer border-none z-20"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="relative flex items-center gap-4 z-10">
                  {selectedEstabelecimento.logoUrl ? (
                    <img src={selectedEstabelecimento.logoUrl} className="w-16 h-16 rounded-2xl border-2 border-white object-cover bg-white shadow-md shrink-0 animate-scale-up" alt="logo" />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-[#E8F2F8] text-[#1a8ccc] flex items-center justify-center text-3xl shadow-md shrink-0">
                      <span className="material-symbols-outlined">storefront</span>
                    </div>
                  )}
                  <div className="text-white text-left">
                    <h2 className="text-xl font-bold tracking-tight">{selectedEstabelecimento.nome}</h2>
                    <p className="text-xs text-slate-350">{selectedEstabelecimento.endereco}</p>
                  </div>
                </div>
              </div>

              {/* Informações Comerciais Adicionais (Serviços e Menu) */}
              {(selectedEstabelecimento.servicos || selectedEstabelecimento.cardapioUrl) && (
                <div className="px-6 pt-5 pb-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-800 text-left">
                  {selectedEstabelecimento.servicos && (
                    <div className="flex-1 space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-purple-650 dark:text-purple-400 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">design_services</span>
                        Serviços & Especialidades
                      </span>
                      <p className="text-xs text-slate-650 dark:text-zinc-350 leading-relaxed font-light">
                        {selectedEstabelecimento.servicos}
                      </p>
                    </div>
                  )}
                  {selectedEstabelecimento.cardapioUrl && (
                    <div className="shrink-0 flex items-center">
                      <a
                        href={selectedEstabelecimento.cardapioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 active:scale-[0.98] transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[15px]">restaurant_menu</span>
                        VER CARDÁPIO / MENU
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Lista de Cupons */}
              <div className="p-6 max-h-[350px] overflow-y-auto space-y-4">
                {loadingCupons ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-3">
                    <Loader2 className="w-8 h-8 text-[#10B981] animate-spin" />
                    <p className="text-xs text-slate-400">Carregando benefícios ativos...</p>
                  </div>
                ) : cupons.length === 0 ? (
                  <div className="text-center py-10">
                    <span className="material-symbols-outlined text-[48px] text-slate-300 mb-2 block">confirmation_number</span>
                    <p className="text-sm font-medium text-slate-500">Nenhum cupom ativo para este parceiro no momento.</p>
                  </div>
                ) : (
                  cupons.map((cupom) => {
                    const isResgatando = resgatandoId === cupom.id;
                    return (
                      <div 
                        key={cupom.id} 
                        className="p-5 border border-dashed border-[#10B981]/40 rounded-2xl bg-[#10B981]/5 hover:bg-[#10B981]/10 transition-colors flex flex-col gap-3"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-base font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-1.5 leading-none">
                              <Tag className="w-4 h-4 text-[#10B981]" />
                              {cupom.titulo}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2.5 font-light leading-relaxed">
                              {cupom.descricao}
                            </p>
                          </div>
                        </div>

                        {cupom.validade && (
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">schedule</span>
                            Válido até: {new Date(cupom.validade.toMillis()).toLocaleDateString("pt-BR")}
                          </span>
                        )}

                        {resgateSucessoCodigo && selectedEstabelecimento && (
                          <div className="mt-2 p-3.5 bg-white dark:bg-zinc-950 rounded-xl border-2 border-emerald-500 text-center animate-in slide-in-from-bottom-2 duration-300">
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block tracking-widest uppercase">CÓDIGO DE RESGATE GERADO!</span>
                            <span className="text-xl font-black text-slate-800 dark:text-white block mt-1 tracking-wider uppercase">{resgateSucessoCodigo}</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(resgateSucessoCodigo);
                                alert("Código copiado para a área de transferência!");
                              }}
                              className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-2 inline-flex items-center gap-1 hover:underline cursor-pointer border-none bg-transparent"
                            >
                              <span className="material-symbols-outlined text-[13px]">content_copy</span>
                              Copiar código
                            </button>
                            <p className="text-[9px] text-slate-400 dark:text-zinc-500 mt-2 font-light">
                              Apresente este código no balcão do parceiro para obter o desconto.
                            </p>
                          </div>
                        )}

                        {!resgateSucessoCodigo && (
                          <button
                            onClick={() => handleResgatarCupom(cupom)}
                            disabled={isResgatando}
                            className="w-full h-11 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
                          >
                            {isResgatando ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Gerando cupom...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4 animate-pulse" />
                                GERAR CUPOM DE DESCONTO
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Rodapé */}
              <div className="p-4 bg-slate-50 dark:bg-zinc-900/60 border-t border-slate-100 dark:border-zinc-800 flex justify-between items-center text-[10px] text-slate-400">
                <span>Navegando SP</span>
                <span>Patrocínios & Parcerias Comerciais</span>
              </div>
            </div>
          </div>
        )}

        <LoginRequiredModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />

        <ParceriaModal
          isOpen={showParceriaModal}
          onClose={() => setShowParceriaModal(false)}
          onLoginClick={() => setShowLoginModal(true)}
        />

        {/* Estilos Globais para Partículas e Animação Elástica do Botão de Concordar */}
        <style jsx global>{`
          @keyframes float-heart {
            0% {
              opacity: 0;
              transform: translateY(0) scale(0.3) rotate(0deg);
            }
            15% {
              opacity: 0.95;
              transform: translateY(-8px) scale(1.1);
            }
            100% {
              opacity: 0;
              transform: translateY(-45px) scale(0.5);
            }
          }
          .animate-float-heart {
            animation: float-heart 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          @keyframes elastic-bounce {
            0% { transform: scale(1) translateZ(8px); }
            30% { transform: scale(1.22, 0.78) translateZ(8px); }
            45% { transform: scale(0.78, 1.22) translateZ(8px); }
            60% { transform: scale(1.12, 0.88) translateZ(8px); }
            75% { transform: scale(0.96, 1.04) translateZ(8px); }
            90% { transform: scale(1.02, 0.98) translateZ(8px); }
            100% { transform: scale(1) translateZ(8px); }
          }
          .animate-elastic {
            animation: elastic-bounce 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          }
        `}</style>
      </div>
    </ClimaProvider>
  );
}

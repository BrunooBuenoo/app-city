"use client";

import React from "react";
import Link from "next/link";
import { Map, MapMarker, MarkerContent, MapControls } from "@/components/ui/map";

const pins = [
  {
    lng: -49.9458,
    lat: -22.2139,
    color: "#EF4444",
    category: "Iluminação",
    title: "Poste Apagado",
    description: "Lâmpada queimada na Av. República, dificulta a visibilidade à noite.",
    distance: "200m",
    concordos: 12,
    status: "Em Andamento",
    statusColor: "#F59E0B",
    catColor: "#1a8ccc",
  },
  {
    lng: -49.935,
    lat: -22.205,
    color: "#F59E0B",
    category: "Infraestrutura",
    title: "Buraco na Via",
    description: "Cratera aberta na R. São Luiz após as últimas chuvas intensas.",
    distance: "450m",
    concordos: 28,
    status: "Urgente",
    statusColor: "#EF4444",
    catColor: "#EF4444",
  },
  {
    lng: -49.955,
    lat: -22.225,
    color: "#1a8ccc",
    category: "Limpeza",
    title: "Acúmulo de Lixo",
    description: "Entulho acumulado no canteiro central da Av. Castro Alves.",
    distance: "1.2km",
    concordos: 5,
    status: "Pendente",
    statusColor: "#94A3B8",
    catColor: "#10B981",
  },
];

export default function MapaPrincipal() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Full-screen Interactive Map */}
      <div className="absolute inset-0 z-0">
        <Map center={[-49.9458, -22.2139]} zoom={14}>
          {/* Map Controls */}
          <MapControls
            position="bottom-right"
            showZoom
            showLocate
          />

          {/* Real Markers */}
          {pins.map((pin) => (
            <MapMarker key={pin.title} longitude={pin.lng} latitude={pin.lat}>
              <MarkerContent>
                <div className="relative group cursor-pointer">
                  {/* Pulse ring */}
                  <div
                    className="absolute -inset-3 rounded-full animate-ping opacity-20"
                    style={{ backgroundColor: pin.color, animationDuration: "2.5s" }}
                  />
                  {/* Pin dot */}
                  <div
                    className="w-4 h-4 rounded-full border-[3px] border-white shadow-lg relative z-10 group-hover:scale-125 transition-transform"
                    style={{ backgroundColor: pin.color }}
                  />
                </div>
              </MarkerContent>
            </MapMarker>
          ))}
        </Map>
      </div>

      {/* Top Bar — Search + Back */}
      <div className="absolute top-0 left-0 right-0 z-30 p-4 flex items-center gap-3">
        <Link
          href="/"
          className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center shadow-elevated border border-[#E2E8F0] hover:scale-105 transition-transform shrink-0"
        >
          <span className="material-symbols-outlined text-[#112F4E] text-[22px]">arrow_back</span>
        </Link>
        <div className="flex-1 relative">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] text-[20px]">
            search
          </span>
          <input
            className="w-full bg-white/95 backdrop-blur-xl border border-[#E2E8F0] rounded-2xl pl-11 pr-4 py-3 text-sm text-[#112F4E] placeholder:text-[#94A3B8] shadow-elevated focus:ring-2 focus:ring-[#1a8ccc]/20 outline-none transition-all"
            placeholder="Buscar endereço ou reclamação..."
            type="text"
          />
        </div>
        <button className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center shadow-elevated border border-[#E2E8F0] hover:scale-105 transition-transform shrink-0">
          <span className="material-symbols-outlined text-[#4A5D70] text-[22px]">tune</span>
        </button>
      </div>

      {/* FAB — Report Problem */}
      <Link
        href="/reclamacao/nova"
        className="absolute bottom-36 md:bottom-28 right-4 z-30 w-14 h-14 bg-[#1a8ccc] hover:bg-[#1572a6] text-white rounded-2xl flex items-center justify-center shadow-elevated active:scale-95 hover:scale-105 transition-all"
      >
        <span className="material-symbols-outlined text-[28px]">add</span>
      </Link>

      {/* Bottom Cards Carousel */}
      <div className="absolute bottom-6 md:bottom-8 left-0 right-0 z-20 px-4">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {pins.map((card) => (
            <div
              key={card.title}
              className="min-w-[300px] max-w-[340px] bg-white/95 backdrop-blur-xl p-5 rounded-2xl shadow-elevated border border-white/50 flex flex-col gap-3 cursor-pointer hover:shadow-[0_12px_32px_rgba(17,47,78,0.1)] hover:-translate-y-1 transition-all duration-200 shrink-0"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <span
                    className="text-[11px] font-bold uppercase tracking-widest"
                    style={{ color: card.catColor }}
                  >
                    {card.category}
                  </span>
                  <h3 className="text-base font-semibold text-[#112F4E] mt-0.5">{card.title}</h3>
                </div>
                <span className="bg-[#E8F2F8] text-[#1a8ccc] px-2.5 py-1 rounded-lg text-[11px] font-semibold shrink-0">
                  {card.distance}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-[#4A5D70] leading-relaxed line-clamp-2 font-light">
                {card.description}
              </p>

              {/* Footer */}
              <div className="flex justify-between items-center pt-2 border-t border-[#F5F2ED]">
                <div className="flex items-center gap-1.5 text-[#94A3B8]">
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    favorite
                  </span>
                  <span className="text-xs font-medium">{card.concordos} Concordos</span>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: card.statusColor }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: card.statusColor }} />
                  {card.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

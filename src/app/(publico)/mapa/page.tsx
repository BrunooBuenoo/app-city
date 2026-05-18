import React from "react";
import Link from "next/link";

export default function MapaPrincipal() {
  const cards = [
    {
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

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Full-screen Map */}
      <div className="absolute inset-0 z-0">
        <img
          alt="Mapa da cidade de Marília"
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkwtJ2MKf2IFZQRHidwATZPPCl3bFbP0Fhbb0dD7EW3h9HXiRU_cQxVrtlyGyh_Gfb02fybXYWMkqAzSEGaK9S8ZC3EYR-hsimGRNpHTsGHFmgCNC7i_U1vZozgoiBC8RwVbpMMpLv1ka3Ev8WDgzb8yLFVWGyF0c_qu-bokolpnZNB_TvTzyDu2aGz3oKpsWrYo2ob_n6YStaAkfDCRUx1ZHh-p8GKW18Jy3L1PtVB-o0ZQGPhtO9h6vGnJYVYjrfUKlfPwIcz3tT"
        />
        {/* Subtle overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#112F4E]/5 via-transparent to-[#112F4E]/20 pointer-events-none" />
      </div>

      {/* Map Pins */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {[
          { top: "35%", left: "28%", color: "#EF4444" },
          { top: "55%", left: "58%", color: "#F59E0B" },
          { top: "22%", left: "72%", color: "#1a8ccc" },
        ].map((pin, i) => (
          <div key={i} className="absolute" style={{ top: pin.top, left: pin.left }}>
            <div className="relative">
              {/* Pulse ring */}
              <div
                className="absolute -inset-3 rounded-full animate-ping opacity-20"
                style={{ backgroundColor: pin.color, animationDuration: "2s" }}
              />
              {/* Pin dot */}
              <div
                className="w-4 h-4 rounded-full border-[3px] border-white shadow-lg relative z-10"
                style={{ backgroundColor: pin.color }}
              />
            </div>
          </div>
        ))}
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

      {/* Map Controls — Right Side */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-1.5">
        <button className="w-10 h-10 bg-white/95 backdrop-blur rounded-xl flex items-center justify-center border border-[#E2E8F0] shadow-card hover:bg-[#FAF7F2] transition-colors">
          <span className="material-symbols-outlined text-[18px] text-[#4A5D70]">add</span>
        </button>
        <button className="w-10 h-10 bg-white/95 backdrop-blur rounded-xl flex items-center justify-center border border-[#E2E8F0] shadow-card hover:bg-[#FAF7F2] transition-colors">
          <span className="material-symbols-outlined text-[18px] text-[#4A5D70]">remove</span>
        </button>
        <div className="h-px bg-[#E2E8F0] my-0.5" />
        <button className="w-10 h-10 bg-white/95 backdrop-blur rounded-xl flex items-center justify-center border border-[#E2E8F0] shadow-card hover:bg-[#FAF7F2] transition-colors">
          <span className="material-symbols-outlined text-[18px] text-[#4A5D70]">my_location</span>
        </button>
        <button className="w-10 h-10 bg-white/95 backdrop-blur rounded-xl flex items-center justify-center border border-[#E2E8F0] shadow-card hover:bg-[#FAF7F2] transition-colors">
          <span className="material-symbols-outlined text-[18px] text-[#4A5D70]">layers</span>
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
          {cards.map((card) => (
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

import React from "react";
import Link from "next/link";

export default function MinhasReclamacoes() {
  const summaryCards = [
    { label: "Total", value: "12", color: "#1a8ccc" },
    { label: "Resolvidas", value: "8", color: "#10B981" },
    { label: "Em Andamento", value: "3", color: "#F59E0B" },
    { label: "Concordos", value: "45", color: "#EF4444", hasHeart: true },
  ];

  const complaints = [
    {
      icon: "water_damage", cat: "Infraestrutura", title: "Vazamento de Esgoto",
      status: "Em Andamento", statusClass: "bg-[#FEF3C7] text-[#B45309]",
      location: "Rua das Flores, 123 - Centro", date: "12 de Outubro, 2023",
      concordos: 24, iconBg: "bg-[#FEE2E2]", iconColor: "text-[#991B1B]",
    },
    {
      icon: "lightbulb", cat: "Serviços", title: "Iluminação Pública",
      status: "Resolvido", statusClass: "bg-[#D1FAE5] text-[#065F46]",
      location: "Av. Sampaio Vidal, 450", date: "08 de Outubro, 2023",
      concordos: 12, iconBg: "bg-[#E8F2F8]", iconColor: "text-[#1a8ccc]",
    },
    {
      icon: "delete", cat: "Saneamento", title: "Acúmulo de Lixo",
      status: "Em Andamento", statusClass: "bg-[#FEF3C7] text-[#B45309]",
      location: "Praça Saturnino de Brito", date: "05 de Outubro, 2023",
      concordos: 9, iconBg: "bg-[#FEF3C7]", iconColor: "text-[#B45309]",
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-[1280px] mx-auto w-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#112F4E] tracking-tight">Minhas Reclamações</h2>
        <p className="text-[#4A5D70] text-base mt-1 font-light">Acompanhe o andamento das suas solicitações.</p>
      </div>

      {/* Summary Cards */}
      <section>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {summaryCards.map((card) => (
            <div key={card.label} className="min-w-[140px] flex-shrink-0 bg-white p-4 rounded-2xl shadow-card border border-[#E2E8F0]">
              <span className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider block mb-2">{card.label}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-bold" style={{ color: card.color }}>{card.value}</span>
                {card.hasHeart && (
                  <span className="material-symbols-outlined text-[#EF4444] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Complaints List */}
      <section className="mt-8 space-y-3">
        <h3 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-widest mb-2">Recentes</h3>

        {complaints.map((c) => (
          <div key={c.title} className="bg-white p-5 rounded-2xl shadow-card border border-[#E2E8F0] flex flex-col gap-4 hover:shadow-card-hover transition-shadow">
            {/* Top Row */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl ${c.iconBg} flex items-center justify-center`}>
                  <span className={`material-symbols-outlined ${c.iconColor} text-[22px]`}>{c.icon}</span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#112F4E]">{c.title}</h3>
                  <p className="text-sm text-[#94A3B8]">{c.cat}</p>
                </div>
              </div>
              <span className={`px-3 py-1 ${c.statusClass} text-[11px] font-semibold rounded-full`}>{c.status}</span>
            </div>

            {/* Details */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-[#4A5D70]">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
                <span className="text-sm">{c.location}</span>
              </div>
              <div className="flex items-center gap-2 text-[#4A5D70]">
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                <span className="text-sm">{c.date}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-3 border-t border-[#F5F2ED]">
              <div className="flex items-center gap-1.5 text-[#EF4444]">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                <span className="text-sm font-semibold">{c.concordos} Concordos</span>
              </div>
              <button className="text-[#1a8ccc] text-sm font-semibold flex items-center gap-1 hover:underline">
                Ver detalhes
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* FAB */}
      <Link href="/reclamacao/nova">
        <button className="fixed bottom-24 md:bottom-8 right-6 w-14 h-14 bg-[#1a8ccc] hover:bg-[#1572a6] text-white rounded-2xl shadow-elevated flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-50">
          <span className="material-symbols-outlined text-[28px]">add</span>
        </button>
      </Link>
    </div>
  );
}

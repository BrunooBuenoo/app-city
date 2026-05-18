import React from "react";
import Link from "next/link";

export default function UsuarioDashboard() {
  return (
    <div className="p-4 md:p-8">
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#112F4E] tracking-tight">Meu Painel</h2>
          <p className="text-[#4A5D70] text-base mt-1 font-light">Bem-vindo de volta. Veja o que está acontecendo na cidade hoje.</p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Minhas Reclamações", value: "12", badge: "+12%", icon: "description", color: "#1a8ccc", badgeBg: "bg-[#E8F2F8]", badgeText: "text-[#1a8ccc]", iconBg: "bg-[#E8F2F8]" },
            { label: "Minhas Resolvidas", value: "8", badge: "Alta", icon: "check_circle", color: "#10B981", badgeBg: "bg-[#D1FAE5]", badgeText: "text-[#065F46]", iconBg: "bg-[#D1FAE5]" },
            { label: "Em Andamento", value: "3", badge: "-5%", icon: "pending", color: "#F59E0B", badgeBg: "bg-[#FEF3C7]", badgeText: "text-[#B45309]", iconBg: "bg-[#FEF3C7]" },
            { label: "Concordos Recebidos", value: "45", badge: "+42", icon: "favorite", color: "#EF4444", badgeBg: "bg-[#FEE2E2]", badgeText: "text-[#991B1B]", iconBg: "bg-[#FEE2E2]" },
          ].map((card) => (
            <div key={card.label} className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-card hover:shadow-card-hover transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 ${card.iconBg} rounded-xl`} style={{ color: card.color }}>
                  <span className="material-symbols-outlined text-[22px]">{card.icon}</span>
                </div>
                <div className={`${card.badgeBg} ${card.badgeText} text-[11px] font-semibold px-2.5 py-1 rounded-lg`}>{card.badge}</div>
              </div>
              <p className="text-[#94A3B8] text-xs font-medium uppercase tracking-wider">{card.label}</p>
              <h3 className="text-2xl font-bold text-[#112F4E] mt-1 mb-4">{card.value}</h3>
              <div className="h-10 w-full flex items-end gap-1">
                {[1/4, 1/2, 1/3, 2/3, 1].map((h, i) => (
                  <div key={i} className="w-full rounded-t-sm transition-all" style={{ height: `${h * 100}%`, backgroundColor: card.color, opacity: 0.15 + (i * 0.2) }}></div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-card overflow-hidden flex-1 flex flex-col">
          <div className="p-5 md:p-6 border-b border-[#E2E8F0] flex justify-between items-center">
            <h3 className="text-lg font-semibold text-[#112F4E]">Meus Relatórios Recentes</h3>
            <button className="text-[#1a8ccc] text-sm font-semibold hover:underline transition-all">Ver todos</button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#FAF7F2]">
                  {["Categoria", "Status", "Concordos", "Localização", "Data"].map((h, i) => (
                    <th key={h} className={`px-6 py-3.5 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider ${i === 2 ? "text-center" : ""} ${i === 4 ? "text-right" : ""}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F2ED]">
                {[
                  { icon: "lightbulb", cat: "Iluminação Pública", status: "Em Andamento", statusClass: "bg-[#FEF3C7] text-[#B45309]", concordos: "124", local: "Av. Sampaio Vidal, Centro", data: "Hoje, 14:30", iconBg: "bg-[#E8F2F8]", iconColor: "text-[#1a8ccc]" },
                  { icon: "construction", cat: "Buraco na Via", status: "Resolvido", statusClass: "bg-[#D1FAE5] text-[#065F46]", concordos: "89", local: "Rua das Azaleias, 452", data: "Ontem, 09:15", iconBg: "bg-[#FEE2E2]", iconColor: "text-[#991B1B]" },
                  { icon: "delete", cat: "Coleta de Lixo", status: "Aguardando", statusClass: "bg-[#E8F2F8] text-[#1a8ccc]", concordos: "45", local: "Bairro Jd. Marília", data: "12 Mai, 16:40", iconBg: "bg-[#FEF3C7]", iconColor: "text-[#B45309]" },
                ].map((row) => (
                  <tr key={row.cat} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-xl ${row.iconBg} ${row.iconColor} flex items-center justify-center`}>
                          <span className="material-symbols-outlined text-[20px]">{row.icon}</span>
                        </div>
                        <span className="text-sm font-medium text-[#112F4E]">{row.cat}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5"><span className={`px-3 py-1 rounded-full text-[11px] font-semibold ${row.statusClass}`}>{row.status}</span></td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex items-center justify-center gap-1 text-[#4A5D70]">
                        <span className="material-symbols-outlined text-[16px] text-[#EF4444]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                        <span className="text-sm">{row.concordos}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-[#4A5D70]">
                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                        <span className="text-sm">{row.local}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right"><span className="text-sm text-[#94A3B8]">{row.data}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

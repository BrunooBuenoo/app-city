import React from "react";
import Link from "next/link";

export default function UsuarioDashboard() {
  return (
    <div className="p-4 md:p-8 max-w-[1280px] mx-auto">
      {/* Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-[28px] font-bold text-[#112F4E] tracking-tight">
            Bem-vindo de volta, Cidadão
          </h1>
          <p className="text-[#94A3B8] text-[15px] mt-1">
            Acompanhe suas reclamações e veja o que acontece na cidade.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#FAF7F2] rounded-xl border border-[#E2E8F0] text-[13px] text-[#4A5D70]">
            <span className="material-symbols-outlined text-[16px] text-[#94A3B8]">calendar_today</span>
            {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
          </div>
          <Link href="/reclamacao/nova">
            <button className="flex items-center gap-2 bg-[#1a8ccc] text-white text-[13px] font-semibold px-5 py-2.5 rounded-xl hover:bg-[#1572a6] transition-colors shadow-sm">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Nova Reclamação
            </button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { icon: "description", label: "Minhas Reclamações", value: "12", change: "+3.2%", changeUp: true, iconBg: "bg-[#E8F2F8]", iconColor: "text-[#1a8ccc]" },
          { icon: "check_circle", label: "Resolvidas", value: "8", change: "Alta", changeUp: true, iconBg: "bg-[#D1FAE5]", iconColor: "text-[#10B981]" },
          { icon: "pending", label: "Em Andamento", value: "3", change: "-5%", changeUp: false, iconBg: "bg-[#FEF3C7]", iconColor: "text-[#F59E0B]" },
          { icon: "favorite", label: "Concordos Recebidos", value: "45", change: "+42", changeUp: true, iconBg: "bg-[#FEE2E2]", iconColor: "text-[#EF4444]" },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                  <span className={`material-symbols-outlined ${card.iconColor} text-[18px]`} style={{ fontVariationSettings: "'FILL' 1" }}>{card.icon}</span>
                </div>
                <span className="text-[13px] font-medium text-[#4A5D70]">{card.label}</span>
              </div>
              <button className="text-[#94A3B8] hover:text-[#4A5D70]">
                <span className="material-symbols-outlined text-[18px]">more_horiz</span>
              </button>
            </div>
            <h2 className="text-[32px] font-bold text-[#112F4E] tracking-tight leading-none mb-2">{card.value}</h2>
            <div className="flex items-center gap-1.5">
              <span className={`text-[12px] font-semibold ${card.changeUp ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                {card.change} {card.changeUp ? "↑" : "↓"}
              </span>
              <span className="text-[12px] text-[#94A3B8]">desde o mês passado</span>
            </div>
          </div>
        ))}
      </div>

      {/* Second Row — Wallet-style cards + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        {/* My Complaints Summary */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[16px] font-semibold text-[#112F4E]">Minhas Categorias</span>
            <Link href="/usuario/minhas-reclamacoes" className="text-[13px] font-medium text-[#1a8ccc] hover:underline">Ver Todas</Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { emoji: "🔧", label: "Infraestrutura", value: "5", status: "Ativa", statusColor: "#10B981" },
              { emoji: "💡", label: "Iluminação", value: "3", status: "Ativa", statusColor: "#10B981" },
              { emoji: "🗑️", label: "Limpeza", value: "2", status: "Ativa", statusColor: "#10B981" },
              { emoji: "💧", label: "Saneamento", value: "2", status: "Pendente", statusColor: "#94A3B8" },
            ].map((cat) => (
              <div key={cat.label} className="bg-[#FAF7F2] rounded-xl p-3.5 border border-[#E2E8F0]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">{cat.emoji}</span>
                  <button className="text-[#94A3B8] hover:text-[#4A5D70]">
                    <span className="material-symbols-outlined text-[16px]">more_vert</span>
                  </button>
                </div>
                <p className="text-[13px] font-medium text-[#4A5D70]">{cat.label}</p>
                <p className="text-[18px] font-bold text-[#112F4E] mt-0.5">{cat.value}</p>
                <p className="text-[11px] font-semibold mt-1" style={{ color: cat.statusColor }}>{cat.status}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline / Progress */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-[#E2E8F0] p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#E8F2F8] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#1a8ccc] text-[18px]">insights</span>
              </div>
              <span className="text-[16px] font-semibold text-[#112F4E]">Atividade</span>
            </div>
            <select className="text-[13px] text-[#4A5D70] bg-[#FAF7F2] border border-[#E2E8F0] rounded-lg px-3 py-1.5 outline-none">
              <option>Este Mês</option>
              <option>Último Mês</option>
            </select>
          </div>
          {/* Bar Chart */}
          <div className="flex items-end gap-3 h-[180px]">
            {["Sem 1", "Sem 2", "Sem 3", "Sem 4"].map((label, i) => {
              const heights = [50, 75, 40, 90];
              const isHighlight = i === 3;
              return (
                <div key={label} className="flex-1 flex flex-col items-center gap-2">
                  {isHighlight && (
                    <div className="bg-[#112F4E] text-white text-[11px] font-semibold px-2 py-1 rounded-lg whitespace-nowrap mb-1">
                      +5 reclamações
                    </div>
                  )}
                  <div className="w-full relative">
                    <div
                      className={`w-full rounded-lg transition-all ${isHighlight ? "bg-[#1a8ccc]" : "bg-[#1a8ccc]/15 hover:bg-[#1a8ccc]/30"}`}
                      style={{ height: `${heights[i]}%`, minHeight: "30px" }}
                    />
                  </div>
                  <span className="text-[11px] text-[#94A3B8]">{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
        <div className="p-5 md:p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#E8F2F8] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#1a8ccc] text-[18px]">receipt_long</span>
            </div>
            <span className="text-[16px] font-semibold text-[#112F4E]">Atividade Recente</span>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-[13px] text-[#4A5D70] hover:bg-[#FAF7F2] transition-colors">
            <span className="material-symbols-outlined text-[16px]">filter_list</span>
            Filtrar
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-t border-b border-[#E2E8F0] bg-[#FAF7F2]">
                {["Atividade", "Data", "Localização", "Status"].map((h) => (
                  <th key={h} className="px-6 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F2ED]">
              {[
                { icon: "💡", label: "Iluminação Pública", date: "Seg, 18 Mai 2026", local: "Av. Sampaio Vidal, Centro", status: "Em Andamento", statusColor: "#F59E0B" },
                { icon: "🔧", label: "Buraco na Via", date: "Dom, 17 Mai 2026", local: "Rua das Azaleias, 452", status: "Resolvido", statusColor: "#10B981" },
                { icon: "🗑️", label: "Coleta de Lixo", date: "Sáb, 16 Mai 2026", local: "Bairro Jd. Marília", status: "Aguardando", statusColor: "#1a8ccc" },
              ].map((row) => (
                <tr key={row.label} className="hover:bg-[#FAF7F2]/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#FAF7F2] border border-[#E2E8F0] rounded-lg flex items-center justify-center text-[14px]">
                        {row.icon}
                      </div>
                      <span className="text-[14px] font-medium text-[#112F4E]">{row.label}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[#4A5D70]">{row.date}</td>
                  <td className="px-6 py-4 text-[13px] text-[#4A5D70]">{row.local}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: row.statusColor }} />
                      <span className="text-[13px] font-medium" style={{ color: row.statusColor }}>{row.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

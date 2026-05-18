import React from "react";

export default function AdminDashboard() {
  return (
    <div className="p-6 md:p-8 max-w-[1280px] mx-auto">
      {/* Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-[28px] font-bold text-[#112F4E] tracking-tight">
            Bem-vindo de volta, Admin
          </h1>
          <p className="text-[#94A3B8] text-[15px] mt-1">
            Acompanhe as métricas da plataforma e gerencie as solicitações.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#FAF7F2] rounded-xl border border-[#E2E8F0] text-[13px] text-[#4A5D70]">
            <span className="material-symbols-outlined text-[16px] text-[#94A3B8]">calendar_today</span>
            {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
          </div>
          <button className="flex items-center gap-2 bg-[#1a8ccc] text-white text-[13px] font-semibold px-5 py-2.5 rounded-xl hover:bg-[#1572a6] transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Exportar
          </button>
        </div>
      </div>

      {/* KPI Grid — Oripio style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Main big card */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#E8F2F8] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#1a8ccc] text-[18px]">inbox</span>
              </div>
              <span className="text-[14px] font-medium text-[#4A5D70]">Total de Reclamações</span>
            </div>
          </div>
          <h2 className="text-[36px] font-bold text-[#112F4E] tracking-tight leading-none mb-2">1.284</h2>
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] font-semibold text-[#10B981]">+3.2% ↑</span>
            <span className="text-[12px] text-[#94A3B8]">desde o mês passado</span>
          </div>
        </div>

        {/* Abertas */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#F59E0B] text-[18px]">pending</span>
              </div>
              <span className="text-[14px] font-medium text-[#4A5D70]">Em Aberto</span>
            </div>
            <button className="text-[#94A3B8] hover:text-[#4A5D70]">
              <span className="material-symbols-outlined text-[18px]">more_horiz</span>
            </button>
          </div>
          <h2 className="text-[36px] font-bold text-[#112F4E] tracking-tight leading-none mb-2">432</h2>
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] font-semibold text-[#EF4444]">-2.1% ↓</span>
            <span className="text-[12px] text-[#94A3B8]">desde o mês passado</span>
          </div>
        </div>

        {/* Resolvidas */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#D1FAE5] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#10B981] text-[18px]">check_circle</span>
              </div>
              <span className="text-[14px] font-medium text-[#4A5D70]">Resolvidas</span>
            </div>
            <button className="text-[#94A3B8] hover:text-[#4A5D70]">
              <span className="material-symbols-outlined text-[18px]">more_horiz</span>
            </button>
          </div>
          <h2 className="text-[36px] font-bold text-[#112F4E] tracking-tight leading-none mb-2">742</h2>
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] font-semibold text-[#10B981]">+4.5% ↑</span>
            <span className="text-[12px] text-[#94A3B8]">desde o mês passado</span>
          </div>
        </div>
      </div>

      {/* Second Row — Chart + Mini Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        {/* Chart Area */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-[#E2E8F0] p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#E8F2F8] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#1a8ccc] text-[18px]">insights</span>
              </div>
              <span className="text-[16px] font-semibold text-[#112F4E]">Visão Geral</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-[#1a8ccc]" />
                <span className="text-[12px] text-[#94A3B8]">Reclamações</span>
              </div>
              <select className="text-[13px] text-[#4A5D70] bg-[#FAF7F2] border border-[#E2E8F0] rounded-lg px-3 py-1.5 outline-none">
                <option>Este Ano</option>
                <option>Último Ano</option>
              </select>
            </div>
          </div>
          {/* Bar Chart Simulation */}
          <div className="flex items-end gap-2 h-[200px] px-2">
            {[
              { month: "Jan", h: 40 }, { month: "Fev", h: 55 }, { month: "Mar", h: 45 },
              { month: "Abr", h: 60 }, { month: "Mai", h: 50 }, { month: "Jun", h: 70 },
              { month: "Jul", h: 65 }, { month: "Ago", h: 85, highlight: true }, { month: "Set", h: 55 },
              { month: "Out", h: 45 }, { month: "Nov", h: 60 }, { month: "Dez", h: 50 },
            ].map((bar) => (
              <div key={bar.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full relative group">
                  {bar.highlight && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#112F4E] text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap">
                      Reclamações<br />
                      <span className="text-[#7CC8ED]">847</span>
                    </div>
                  )}
                  <div
                    className={`w-full rounded-t-md transition-all duration-300 ${bar.highlight ? "bg-[#1a8ccc]" : "bg-[#1a8ccc]/15 hover:bg-[#1a8ccc]/30"}`}
                    style={{ height: `${bar.h}%`, minHeight: "20px" }}
                  />
                </div>
                <span className="text-[11px] text-[#94A3B8]">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-[#E8F2F8] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#1a8ccc] text-[18px]">pie_chart</span>
            </div>
            <span className="text-[16px] font-semibold text-[#112F4E]">Por Status</span>
          </div>

          {[
            { label: "Abertas", value: "432", pct: 34, color: "#1a8ccc" },
            { label: "Em Andamento", value: "23", pct: 2, color: "#F59E0B" },
            { label: "Resolvidas", value: "742", pct: 58, color: "#10B981" },
            { label: "Críticas", value: "87", pct: 6, color: "#EF4444" },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[13px] font-medium text-[#4A5D70]">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-bold text-[#112F4E]">{item.value}</span>
                  <span className="text-[11px] text-[#94A3B8]">{item.pct}%</span>
                </div>
              </div>
              <div className="w-full h-2 bg-[#F5F2ED] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Complaints Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
        <div className="p-5 md:p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#E8F2F8] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#1a8ccc] text-[18px]">receipt_long</span>
            </div>
            <span className="text-[16px] font-semibold text-[#112F4E]">Reclamações Recentes</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-[13px] text-[#4A5D70] hover:bg-[#FAF7F2] transition-colors">
              <span className="material-symbols-outlined text-[16px]">filter_list</span>
              Filtrar
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-t border-b border-[#E2E8F0] bg-[#FAF7F2]">
                {["Atividade", "Data", "Bairro", "Status"].map((h) => (
                  <th key={h} className="px-6 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F2ED]">
              {[
                { icon: "A", iconBg: "bg-[#E8F2F8]", iconColor: "text-[#1a8ccc]", label: "Buraco na Via", date: "Seg, 12 Out 2026", bairro: "Cascata", status: "Crítico", statusColor: "#EF4444" },
                { icon: "B", iconBg: "bg-[#FEF3C7]", iconColor: "text-[#F59E0B]", label: "Lâmpada Queimada", date: "Dom, 11 Out 2026", bairro: "Fragata", status: "Aberto", statusColor: "#1a8ccc" },
                { icon: "C", iconBg: "bg-[#D1FAE5]", iconColor: "text-[#10B981]", label: "Acúmulo de Lixo", date: "Sáb, 10 Out 2026", bairro: "Maria Izabel", status: "Resolvido", statusColor: "#10B981" },
                { icon: "D", iconBg: "bg-[#FEE2E2]", iconColor: "text-[#EF4444]", label: "Vazamento de Esgoto", date: "Sex, 09 Out 2026", bairro: "Palmital", status: "Urgente", statusColor: "#EF4444" },
              ].map((row) => (
                <tr key={row.label} className="hover:bg-[#FAF7F2]/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${row.iconBg} ${row.iconColor} rounded-lg flex items-center justify-center text-[13px] font-bold`}>
                        {row.icon}
                      </div>
                      <span className="text-[14px] font-medium text-[#112F4E]">{row.label}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[#4A5D70]">{row.date}</td>
                  <td className="px-6 py-4 text-[13px] text-[#4A5D70]">{row.bairro}</td>
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

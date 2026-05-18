import React from "react";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="p-6 md:p-8 max-w-[1280px] mx-auto space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-[#112F4E] tracking-tight">Painel Administrativo</h2>
        <p className="text-[#4A5D70] text-base mt-1 font-light">Visão geral das solicitações e métricas da plataforma.</p>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total de Reclamações", value: "1.284", color: "#112F4E", spark: "M0 35 Q 20 5, 40 25 T 80 15 T 100 30", sparkColor: "#1a8ccc" },
          { label: "Abertas", value: "432", color: "#1a8ccc", spark: "M0 20 Q 25 35, 50 10 T 100 25", sparkColor: "#1a8ccc" },
          { label: "Críticas", value: "87", color: "#EF4444", spark: "M0 10 L 20 30 L 40 5 L 60 35 L 80 15 L 100 25", sparkColor: "#EF4444" },
          { label: "Resolvidas", value: "742", color: "#10B981", spark: "M0 35 L 25 25 L 50 30 L 100 5", sparkColor: "#10B981" },
          { label: "Reabertas", value: "23", color: "#F59E0B", spark: "M0 20 L 50 20 L 100 20", sparkColor: "#F59E0B" },
        ].map((card) => (
          <div key={card.label} className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-card hover:shadow-card-hover transition-shadow">
            <p className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-3">{card.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold" style={{ color: card.color }}>{card.value}</h3>
              <div className="w-16 h-8 opacity-40" style={{ color: card.sparkColor }}>
                <svg className="w-full h-full fill-none stroke-current stroke-2" viewBox="0 0 100 40"><path d={card.spark}></path></svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Map */}
      <section className="relative h-[500px] w-full bg-white rounded-3xl overflow-hidden border-8 border-white shadow-elevated">
        <div className="absolute inset-0 grayscale opacity-60">
          <img alt="City Map" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeTThu0vAiC4G_6CGCUb9xU6o7ENl4Y6-Mrl6gFAspsKB8Ws-5uJhJebQZzgq6LVN-WCUUILC__ThDKanwUtCPEx9iYIaXOVKTjMr5j5YyAXWN-zukchrUbgLems0dx7lcuAhpwDfdRahksRRmMFhfh5BnuLM7ffHUl22ExCb7Y_RGSma4K0_jcxTtTTcAmnS8pE_0jFu50Ck99Zqf4oqHMNKySy94EIG3G7PKzbVqPe11JmHMofKivDpp-SFT3f4csoddxITZU2GU" />
        </div>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] left-[30%] w-64 h-64 bg-[#EF4444]/10 rounded-full blur-3xl"></div>
          <div className="absolute top-[50%] left-[60%] w-96 h-96 bg-[#1a8ccc]/10 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4"><div className="w-4 h-4 bg-[#EF4444] rounded-full pulsing-pin border-2 border-white"></div></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-10 h-10 bg-white/90 backdrop-blur rounded-xl border border-[#E2E8F0] flex items-center justify-center font-bold text-[#1a8ccc] shadow-card cursor-pointer hover:scale-110 transition-transform text-sm">124</div>
          </div>
          <div className="absolute top-2/3 left-[70%]">
            <div className="w-8 h-8 bg-white/90 backdrop-blur rounded-xl border border-[#E2E8F0] flex items-center justify-center font-bold text-[#1a8ccc] shadow-card cursor-pointer hover:scale-110 transition-transform text-xs">42</div>
          </div>
        </div>
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#E2E8F0] shadow-card max-w-[180px]">
          <h4 className="text-xs font-semibold text-[#112F4E] mb-2 uppercase tracking-wider">Intensidade</h4>
          <div className="flex-1 h-1.5 bg-gradient-to-r from-[#1a8ccc]/20 via-[#F59E0B]/40 to-[#EF4444]/60 rounded-full mb-2"></div>
          <div className="flex justify-between text-[10px] text-[#94A3B8] font-medium"><span>Baixa</span><span>Crítica</span></div>
        </div>
      </section>

      {/* Table */}
      <section className="bg-white rounded-2xl border border-[#E2E8F0] shadow-card overflow-hidden">
        <div className="p-5 md:p-6 border-b border-[#E2E8F0] flex justify-between items-center">
          <h3 className="text-lg font-semibold text-[#112F4E]">Relatórios Recentes</h3>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#4A5D70] hover:bg-[#FAF7F2] transition-all">Filtrar</button>
            <button className="px-4 py-2 bg-[#1a8ccc] text-white rounded-xl text-xs font-medium hover:bg-[#1572a6] transition-all">Ver Todos</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF7F2]">
                {["Categoria", "Subcategoria", "Bairro", "Status", "Concordos", "Data"].map((h, i) => (
                  <th key={h} className={`px-6 py-3.5 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider border-b border-[#E2E8F0] ${i === 4 ? "text-center" : ""} ${i === 5 ? "text-right" : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F2ED]">
              {[
                { icon: "engineering", cat: "Infraestrutura", sub: "Buraco na Via", bairro: "Cascata", status: "Crítico", statusClass: "bg-[#FEE2E2] text-[#991B1B]", concordos: "124", data: "12 Out, 14:30", iconBg: "bg-[#E8F2F8]", iconColor: "text-[#1a8ccc]" },
                { icon: "light_mode", cat: "Iluminação", sub: "Lâmpada Queimada", bairro: "Fragata", status: "Aberto", statusClass: "bg-[#E8F2F8] text-[#1a8ccc]", concordos: "45", data: "12 Out, 13:15", iconBg: "bg-[#FEF3C7]", iconColor: "text-[#B45309]" },
                { icon: "delete", cat: "Limpeza Urbana", sub: "Acúmulo de Lixo", bairro: "Maria Izabel", status: "Resolvido", statusClass: "bg-[#D1FAE5] text-[#065F46]", concordos: "12", data: "11 Out, 18:40", iconBg: "bg-[#D1FAE5]", iconColor: "text-[#065F46]" },
                { icon: "water_drop", cat: "Saneamento", sub: "Vazamento de Esgoto", bairro: "Palmital", status: "Crítico", statusClass: "bg-[#FEE2E2] text-[#991B1B]", concordos: "210", data: "11 Out, 09:20", iconBg: "bg-[#FEE2E2]", iconColor: "text-[#991B1B]" },
              ].map((row) => (
                <tr key={row.sub} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="px-6 py-4"><div className="flex items-center gap-3"><div className={`w-8 h-8 rounded-xl ${row.iconBg} flex items-center justify-center ${row.iconColor}`}><span className="material-symbols-outlined text-[18px]">{row.icon}</span></div><span className="text-sm font-medium text-[#112F4E]">{row.cat}</span></div></td>
                  <td className="px-6 py-4 text-sm text-[#4A5D70]">{row.sub}</td>
                  <td className="px-6 py-4 text-sm text-[#4A5D70]">{row.bairro}</td>
                  <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full ${row.statusClass} text-[11px] font-semibold uppercase tracking-wider`}>{row.status}</span></td>
                  <td className="px-6 py-4 text-center text-sm font-semibold text-[#112F4E]">{row.concordos}</td>
                  <td className="px-6 py-4 text-right text-sm text-[#94A3B8]">{row.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 flex items-center justify-between border-t border-[#F5F2ED]">
          <p className="text-sm text-[#94A3B8]">Mostrando 4 de 1.284 resultados</p>
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] hover:bg-[#FAF7F2] transition-colors"><span className="material-symbols-outlined text-[16px] text-[#4A5D70]">chevron_left</span></button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1a8ccc] text-white text-xs font-semibold">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] hover:bg-[#FAF7F2] transition-colors text-xs text-[#4A5D70]">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] hover:bg-[#FAF7F2] transition-colors text-xs text-[#4A5D70]">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] hover:bg-[#FAF7F2] transition-colors"><span className="material-symbols-outlined text-[16px] text-[#4A5D70]">chevron_right</span></button>
          </div>
        </div>
      </section>
    </div>
  );
}

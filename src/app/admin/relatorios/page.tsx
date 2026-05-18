import React from "react";

export default function Relatorios() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="w-20 h-20 rounded-3xl bg-[#E8F2F8] flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-[#1a8ccc] text-[40px]">bar_chart</span>
      </div>
      <h2 className="text-2xl font-semibold text-[#112F4E] mb-2">Relatórios</h2>
      <p className="text-[#4A5D70] text-base font-light max-w-md">
        Relatórios e análises detalhadas estarão disponíveis em breve. Estamos preparando esta funcionalidade para você.
      </p>
      <div className="mt-8 flex items-center gap-2 text-[#94A3B8] text-sm">
        <span className="material-symbols-outlined text-[18px]">construction</span>
        Em desenvolvimento
      </div>
    </div>
  );
}

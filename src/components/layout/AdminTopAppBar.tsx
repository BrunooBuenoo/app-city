"use client";

import React from "react";

export default function AdminTopAppBar() {
  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] z-40 bg-white/80 backdrop-blur-xl border-b border-[#E2E8F0] flex justify-between items-center h-16 px-8 ml-64">
      {/* Search */}
      <div className="flex items-center flex-1">
        <div className="relative w-full max-w-md group">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] text-[20px] group-focus-within:text-[#1a8ccc] transition-colors">
            search
          </span>
          <input
            className="w-full bg-[#FAF7F2] border border-[#E2E8F0] rounded-xl pl-11 pr-4 py-2.5 text-sm text-[#112F4E] placeholder:text-[#94A3B8] focus:ring-2 focus:ring-[#1a8ccc]/20 focus:border-[#1a8ccc]/30 transition-all outline-none"
            placeholder="Pesquisar reclamações, usuários..."
            type="text"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button className="p-2.5 text-[#4A5D70] hover:text-[#1a8ccc] hover:bg-[#E8F2F8] rounded-xl transition-all relative">
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#F59E0B] rounded-full ring-2 ring-white"></span>
        </button>
        <button className="p-2.5 text-[#4A5D70] hover:text-[#1a8ccc] hover:bg-[#E8F2F8] rounded-xl transition-all">
          <span className="material-symbols-outlined text-[22px]">settings</span>
        </button>

        <div className="h-8 w-px bg-[#E2E8F0] mx-2"></div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-[#112F4E] leading-tight">
              Admin
            </p>
            <p className="text-[11px] text-[#94A3B8]">
              Gestor
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#E8F2F8] flex items-center justify-center overflow-hidden border border-[#E2E8F0]">
            <span className="material-symbols-outlined text-[#1a8ccc] text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              account_circle
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

"use client";

import React from "react";
import { HelpCircle, Mail, Bell, Calendar } from "lucide-react";

export default function AdminTopAppBar() {
  const today = new Date();
  const dateStr = today.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "long", year: "numeric" });

  return (
    <header className="fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] z-40 bg-white/80 backdrop-blur-xl border-b border-[#E2E8F0] flex justify-between items-center h-16 px-4 md:px-8">
      {/* Left — Mobile menu + title */}
      <div className="flex items-center gap-3 md:hidden">
        <span className="material-symbols-outlined text-[#1a8ccc] text-[24px]">menu</span>
        <span className="text-[16px] font-semibold text-[#112F4E]">Painel Admin</span>
      </div>
      <div className="hidden md:block" />

      {/* Right — Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        <div className="hidden lg:flex items-center gap-2 px-3 md:px-4 py-2 bg-[#FAF7F2] rounded-xl border border-[#E2E8F0] text-[13px] text-[#4A5D70]">
          <Calendar className="w-4 h-4 text-[#94A3B8]" />
          <span className="capitalize">{dateStr}</span>
        </div>
        <button className="w-9 h-9 rounded-xl flex items-center justify-center text-[#4A5D70] hover:bg-[#F5F2ED] transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>
        <button className="hidden sm:flex w-9 h-9 rounded-xl items-center justify-center text-[#4A5D70] hover:bg-[#F5F2ED] transition-colors">
          <Mail className="w-5 h-5" />
        </button>
        <button className="w-9 h-9 rounded-xl flex items-center justify-center text-[#4A5D70] hover:bg-[#F5F2ED] transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full ring-2 ring-white" />
        </button>
        <div className="h-8 w-px bg-[#E2E8F0] hidden sm:block" />
        <div className="w-9 h-9 rounded-full bg-[#E8F2F8] flex items-center justify-center border border-[#E2E8F0] overflow-hidden">
          <span className="material-symbols-outlined text-[#1a8ccc] text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            account_circle
          </span>
        </div>
      </div>
    </header>
  );
}

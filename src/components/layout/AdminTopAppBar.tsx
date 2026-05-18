"use client";

import React from "react";

export default function AdminTopAppBar() {
  const today = new Date();
  const dateStr = today.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "long", year: "numeric" });

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] z-40 bg-white/80 backdrop-blur-xl border-b border-[#E2E8F0] flex justify-between items-center h-16 px-8 ml-64">
      {/* Left — empty or breadcrumb */}
      <div />

      {/* Right — Actions */}
      <div className="flex items-center gap-3">
        {/* Date Badge */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#FAF7F2] rounded-xl border border-[#E2E8F0] text-[13px] text-[#4A5D70]">
          <span className="material-symbols-outlined text-[16px] text-[#94A3B8]">calendar_today</span>
          <span className="capitalize">{dateStr}</span>
        </div>

        {/* Icon buttons */}
        <button className="w-9 h-9 rounded-xl flex items-center justify-center text-[#4A5D70] hover:bg-[#F5F2ED] transition-colors relative">
          <span className="material-symbols-outlined text-[20px]">help_outline</span>
        </button>
        <button className="w-9 h-9 rounded-xl flex items-center justify-center text-[#4A5D70] hover:bg-[#F5F2ED] transition-colors relative">
          <span className="material-symbols-outlined text-[20px]">mail</span>
        </button>
        <button className="w-9 h-9 rounded-xl flex items-center justify-center text-[#4A5D70] hover:bg-[#F5F2ED] transition-colors relative">
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full ring-2 ring-white" />
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-[#E2E8F0]" />

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-[#E8F2F8] flex items-center justify-center border border-[#E2E8F0] overflow-hidden">
          <span className="material-symbols-outlined text-[#1a8ccc] text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            account_circle
          </span>
        </div>
      </div>
    </header>
  );
}

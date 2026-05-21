"use client";

import React from "react";
import { CloudSun } from "lucide-react";
import { useClima } from "@/hooks/use-clima";
import { cn } from "@/lib/utils";

interface BotaoClimaProps {
  className?: string;
}

export default function BotaoClima({ className }: BotaoClimaProps) {
  const { isActive, toggleActive, weather } = useClima();

  return (
    <button
      onClick={toggleActive}
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 rounded-full border shadow-elevated transition-all duration-300 pointer-events-auto active:scale-95 group",
        isActive
          ? "bg-amber-500 border-amber-400 text-white hover:bg-amber-600 hover:border-amber-500 shadow-[0_4px_14px_rgba(245,158,11,0.4)]"
          : "bg-white/95 backdrop-blur-xl border-slate-200 text-[#112F4E] hover:border-slate-300 hover:shadow-[0_8px_24px_rgba(17,47,78,0.12)] hover:-translate-y-0.5",
        className
      )}
      title="Ativar/Desativar Camada Climática Realtime"
    >
      <div className={cn("relative transition-transform duration-500", isActive && "rotate-[15deg] scale-110")}>
        <CloudSun className={cn("w-5 h-5 transition-colors", isActive ? "text-white" : "text-amber-500 group-hover:animate-bounce")} />
      </div>
      <span className="text-xs font-bold tracking-wide uppercase select-none">
        {isActive ? "Clima Ativo" : "Clima"}
      </span>
      {isActive && weather && (
        <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-black animate-fade-in">
          {weather.temp}°C
        </span>
      )}
    </button>
  );
}

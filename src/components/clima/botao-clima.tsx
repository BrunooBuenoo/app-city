"use client";

import React from "react";
import { CloudSun, Sun, CloudRain, Cloud, CloudLightning, CloudFog } from "lucide-react";
import { useClima } from "@/hooks/use-clima";
import { cn } from "@/lib/utils";

interface BotaoClimaProps {
  className?: string;
}

export default function BotaoClima({ className }: BotaoClimaProps) {
  const { isActive, toggleActive, weather, isExpanded } = useClima();

  const isCollapsed = isActive && !isExpanded;

  const renderIcon = () => {
    const iconClass = cn("w-5 h-5 transition-colors", isActive ? "text-white" : "text-amber-500 group-hover:animate-bounce");
    
    if (isCollapsed && weather) {
      switch (weather.condition) {
        case "sol":
          return <Sun className={iconClass} />;
        case "chuva":
          return <CloudRain className={iconClass} />;
        case "nublado":
          return <Cloud className={iconClass} />;
        case "tempestade":
          return <CloudLightning className={iconClass} />;
        case "neblina":
          return <CloudFog className={iconClass} />;
        default:
          return <Sun className={iconClass} />;
      }
    }
    
    return <CloudSun className={iconClass} />;
  };

  return (
    <button
      onClick={toggleActive}
      className={cn(
        "flex items-center rounded-full border shadow-elevated transition-all duration-300 pointer-events-auto active:scale-95 group",
        isCollapsed ? "gap-1.5 px-3 py-2" : "gap-2 px-4 py-2.5",
        isActive
          ? "bg-amber-500 border-amber-400 text-white hover:bg-amber-600 hover:border-amber-500 shadow-[0_4px_14px_rgba(245,158,11,0.4)]"
          : "bg-white/95 dark:bg-zinc-900/90 backdrop-blur-xl border-slate-200 dark:border-zinc-800/50 text-[#112F4E] dark:text-zinc-100 hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-[0_8px_24px_rgba(17,47,78,0.12)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] hover:-translate-y-0.5",
        className
      )}
      title="Ativar/Desativar Camada Climática Realtime"
    >
      <div className={cn("relative transition-transform duration-500", isActive && "rotate-[15deg] scale-110")}>
        {renderIcon()}
      </div>
      
      <span 
        className={cn(
          "text-xs font-bold tracking-wide uppercase select-none",
          isCollapsed && "hidden"
        )}
      >
        {isActive ? "Clima Ativo" : "Clima"}
      </span>
      
      {isActive && weather && (
        <span className={cn(
          "bg-white/20 rounded-full font-black animate-fade-in",
          isCollapsed ? "text-[12px] px-2.5 py-0.5" : "text-[10px] px-2 py-0.5"
        )}>
          {weather.temp}°C
        </span>
      )}
    </button>
  );
}

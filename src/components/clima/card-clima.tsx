"use client";

import React, { useState } from "react";
import { 
  Sun, 
  CloudRain, 
  Cloud, 
  CloudLightning, 
  CloudFog, 
  Wind, 
  Thermometer, 
  Sparkles,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useClima } from "@/hooks/use-clima";
import { type WeatherData } from "@/services/clima/openweather";
import { cn } from "@/lib/utils";

export default function CardClima() {
  const { weather, loading, forcedCondition, setForcedCondition, refreshWeather, isExpanded, setIsExpanded } = useClima();
  const [showSimulator, setShowSimulator] = useState(false);

  if (loading && !weather) {
    return (
      <div className="bg-white/60 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/20 dark:border-zinc-800/50 p-3 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex items-center justify-center gap-2.5 w-[210px] animate-pulse pointer-events-auto">
        <RefreshCw className="w-3 h-3 text-amber-500 animate-spin" />
        <span className="text-[10px] font-medium text-slate-500 dark:text-zinc-400">Buscando clima...</span>
      </div>
    );
  }

  if (!weather) return null;

  const getWeatherIcon = (condition: WeatherData["condition"]) => {
    const iconClass = "w-6 h-6 stroke-[1.5]";
    switch (condition) {
      case "sol":
        return <Sun className={cn(iconClass, "text-amber-500 animate-[spin_30s_linear_infinite]")} />;
      case "chuva":
        return <CloudRain className={cn(iconClass, "text-blue-500 animate-pulse")} style={{ animationDuration: "3s" }} />;
      case "nublado":
        return <Cloud className={cn(iconClass, "text-slate-400 animate-pulse")} style={{ animationDuration: "5s" }} />;
      case "tempestade":
        return <CloudLightning className={cn(iconClass, "text-indigo-500 animate-pulse")} style={{ animationDuration: "1.5s" }} />;
      case "neblina":
        return <CloudFog className={cn(iconClass, "text-teal-500 animate-pulse")} style={{ animationDuration: "6s" }} />;
      default:
        return <Sun className={cn(iconClass, "text-amber-500")} />;
    }
  };

  return (
    <div 
      className={cn(
        "backdrop-blur-xl border border-white/25 dark:border-zinc-800/50 pointer-events-auto transition-all duration-300",
        isExpanded 
          ? "bg-white/60 dark:bg-zinc-900/80 shadow-[0_12px_40px_rgba(0,0,0,0.03)] p-3.5 gap-3 w-[210px] rounded-2xl flex flex-col hover:shadow-[0_16px_48px_rgba(0,0,0,0.05)] hover:bg-white/70 dark:hover:bg-zinc-900/90 hover:-translate-y-0.5" 
          : "bg-white/95 dark:bg-zinc-900/90 shadow-sm w-9 h-9 rounded-full flex items-center justify-center cursor-pointer ml-auto hover:bg-white dark:hover:bg-zinc-800 active:scale-95 hover:-translate-y-0.5"
      )}
      onClick={() => {
        if (!isExpanded) setIsExpanded(true);
      }}
      style={{ animation: "slide-down-card 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
      title={!isExpanded ? "Expandir detalhes" : undefined}
    >
      {!isExpanded && (
        <ChevronDown className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
      )}

      {isExpanded && (
        <>
          {/* Cabeçalho ultra-minimalista com botão de ajuste de clima */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <span className={cn(
                "text-[8px] font-bold tracking-wider px-1.5 py-0.5 rounded-md uppercase",
                weather.isMocked 
                  ? "bg-slate-500/10 text-slate-500 dark:text-zinc-400" 
                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              )}>
                {weather.isMocked ? "Simulado" : "Tempo Real"}
              </span>
              <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-medium">São Paulo, SP</span>
            </div>
            
            <div className="flex items-center gap-0.5">
              {/* Botão sutil de controle demo */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const nextShow = !showSimulator;
                  setShowSimulator(nextShow);
                  
                  if (nextShow) {
                    if (!forcedCondition) {
                      setForcedCondition("sol");
                    }
                  } else {
                    setForcedCondition(undefined);
                  }
                }}
                className={cn(
                  "p-1 rounded-md transition-all cursor-pointer hover:bg-slate-100/80 dark:hover:bg-zinc-800 active:scale-90",
                  showSimulator ? "text-[#112F4E] dark:text-zinc-200 bg-slate-100 dark:bg-zinc-800" : "text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"
                )}
                title="Simulador de Clima"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>

              {/* Botão de recolher/expandir */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
                className="p-1 rounded-md transition-all cursor-pointer hover:bg-slate-100/80 dark:hover:bg-zinc-800 active:scale-90 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"
                title="Recolher detalhes"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bloco de Temperatura Principal e Ícone */}
          <div className="flex items-center justify-between mt-0.5">
            <div className="flex flex-col">
              <span className="text-3xl font-light text-[#112F4E] dark:text-zinc-100 tracking-tighter leading-none">
                {weather.temp}°C
              </span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 capitalize mt-1 leading-none">
                {weather.description}
              </span>
            </div>
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-50/50 dark:bg-zinc-800/50">
              {getWeatherIcon(weather.condition)}
            </div>
          </div>

          {/* Métricas compactas em linha única */}
          <div className="flex items-center justify-between text-[10.5px] text-slate-500 dark:text-zinc-400 font-medium pt-2.5 border-t border-slate-100/80 dark:border-zinc-700/80">
            <div className="flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-slate-400 stroke-[1.8]" />
              <span>Sens. {weather.feelsLike}°C</span>
            </div>
            
            <div className="w-[1px] h-3 bg-slate-200/80 dark:bg-zinc-700/80" />
            
            <div className="flex items-center gap-1">
              <Wind className="w-3 h-3 text-slate-400 stroke-[1.8]" />
              <span>{weather.windSpeed} km/h</span>
            </div>
          </div>

          {/* Painel do Simulador deslizante */}
          {showSimulator && (
            <div className="flex flex-col gap-2 pt-2.5 border-t border-dashed border-slate-200/80 dark:border-zinc-700/80 mt-0.5 animate-slide-down">
              <div className="flex justify-between items-center">
                <span className="text-[8px] font-bold text-slate-400 tracking-wider uppercase">Controle de Clima</span>
                <button 
                  onClick={refreshWeather}
                  className="p-0.5 text-slate-400 hover:text-[#112F4E] dark:hover:text-zinc-100 active:rotate-45 transition-transform duration-200 cursor-pointer"
                  title="Atualizar dados reais"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-1">
                {(["sol", "chuva", "nublado", "tempestade", "neblina"] as const).map((cond) => (
                  <button
                    key={cond}
                    onClick={() => setForcedCondition(cond === forcedCondition ? undefined : cond)}
                    className={cn(
                      "px-1.5 py-1 text-[8px] font-bold rounded-lg border transition-all text-center capitalize cursor-pointer",
                      forcedCondition === cond
                        ? "bg-[#112F4E] dark:bg-zinc-700 border-[#112F4E] dark:border-zinc-600 text-white shadow-sm"
                        : "bg-white/60 dark:bg-zinc-800 border-slate-200/60 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-700 hover:text-[#112F4E] dark:hover:text-zinc-200"
                    )}
                  >
                    {cond}
                  </button>
                ))}
                
                <button
                  onClick={() => setForcedCondition(undefined)}
                  className={cn(
                    "px-1.5 py-1 text-[8px] font-bold rounded-lg border transition-all text-center col-span-2 cursor-pointer",
                    !forcedCondition
                      ? "bg-emerald-500 border-emerald-400 text-white shadow-sm"
                      : "bg-white/60 dark:bg-zinc-800 border-slate-200/60 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-700 hover:text-[#112F4E] dark:hover:text-zinc-200"
                  )}
                >
                  Usar Tempo Real
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <style jsx global>{`
        @keyframes slide-down-card {
          0% {
            opacity: 0;
            transform: translateY(-8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-down {
          animation: slide-down-animation 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes slide-down-animation {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}


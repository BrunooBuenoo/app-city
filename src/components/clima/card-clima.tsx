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
  RefreshCw
} from "lucide-react";
import { useClima } from "@/hooks/use-clima";
import { type WeatherData } from "@/services/clima/openweather";
import { cn } from "@/lib/utils";

export default function CardClima() {
  const { weather, loading, forcedCondition, setForcedCondition, refreshWeather } = useClima();
  const [showSimulator, setShowSimulator] = useState(false);

  if (loading && !weather) {
    return (
      <div className="bg-white/60 backdrop-blur-xl border border-white/20 p-3 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex items-center justify-center gap-2.5 w-[210px] animate-pulse pointer-events-auto">
        <RefreshCw className="w-3 h-3 text-amber-500 animate-spin" />
        <span className="text-[10px] font-medium text-slate-500">Buscando clima...</span>
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
      className="bg-white/60 backdrop-blur-xl border border-white/25 p-3.5 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.03)] w-[210px] flex flex-col gap-3 pointer-events-auto transition-all duration-300 hover:shadow-[0_16px_48px_rgba(0,0,0,0.05)] hover:bg-white/70 hover:-translate-y-0.5"
      style={{ animation: "slide-down-card 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
    >
      {/* Cabeçalho ultra-minimalista com botão de ajuste de clima */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <span className={cn(
            "text-[8px] font-bold tracking-wider px-1.5 py-0.5 rounded-md uppercase",
            weather.isMocked 
              ? "bg-slate-500/10 text-slate-500" 
              : "bg-emerald-500/10 text-emerald-600"
          )}>
            {weather.isMocked ? "Simulado" : "Tempo Real"}
          </span>
          <span className="text-[9px] text-slate-400 font-medium">Marília, SP</span>
        </div>
        
        {/* Botão sutil de controle demo */}
        <button
          onClick={() => setShowSimulator(!showSimulator)}
          className={cn(
            "p-1 rounded-md transition-all cursor-pointer hover:bg-slate-100/80 active:scale-90",
            showSimulator ? "text-[#112F4E] bg-slate-100" : "text-slate-400 hover:text-slate-600"
          )}
          title="Simulador de Clima"
        >
          <Sparkles className="w-3 h-3" />
        </button>
      </div>

      {/* Bloco de Temperatura Principal e Ícone */}
      <div className="flex items-center justify-between mt-0.5">
        <div className="flex flex-col">
          <span className="text-3xl font-light text-[#112F4E] tracking-tighter leading-none">
            {weather.temp}°C
          </span>
          <span className="text-[11px] font-medium text-slate-500 capitalize mt-1 leading-none">
            {weather.description}
          </span>
        </div>
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-50/50">
          {getWeatherIcon(weather.condition)}
        </div>
      </div>

      {/* Métricas compactas em linha única */}
      <div className="flex items-center justify-between text-[10.5px] text-slate-500 font-medium pt-2.5 border-t border-slate-100/80">
        <div className="flex items-center gap-1">
          <Thermometer className="w-3 h-3 text-slate-400 stroke-[1.8]" />
          <span>Sens. {weather.feelsLike}°C</span>
        </div>
        
        <div className="w-[1px] h-3 bg-slate-200/80" />
        
        <div className="flex items-center gap-1">
          <Wind className="w-3 h-3 text-slate-400 stroke-[1.8]" />
          <span>{weather.windSpeed} km/h</span>
        </div>
      </div>

      {/* Painel do Simulador deslizante */}
      {showSimulator && (
        <div className="flex flex-col gap-2 pt-2.5 border-t border-dashed border-slate-200/80 mt-0.5 animate-slide-down">
          <div className="flex justify-between items-center">
            <span className="text-[8px] font-bold text-slate-400 tracking-wider uppercase">Controle de Clima</span>
            <button 
              onClick={refreshWeather}
              className="p-0.5 text-slate-400 hover:text-[#112F4E] active:rotate-45 transition-transform duration-200 cursor-pointer"
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
                    ? "bg-[#112F4E] border-[#112F4E] text-white shadow-sm"
                    : "bg-white/60 border-slate-200/60 text-slate-500 hover:bg-slate-50 hover:text-[#112F4E]"
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
                  : "bg-white/60 border-slate-200/60 text-slate-500 hover:bg-slate-50"
              )}
            >
              Usar Tempo Real
            </button>
          </div>
        </div>
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

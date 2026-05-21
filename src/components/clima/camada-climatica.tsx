"use client";

import React, { useEffect } from "react";
import { useClima } from "@/hooks/use-clima";
import OverlaySol from "./overlay-sol";
import OverlayChuva from "./overlay-chuva";
import OverlayNeblina from "./overlay-neblina";
import OverlayTempestade from "./overlay-tempestade";
import OverlayNuvens from "./overlay-nuvens";
import CardClima from "./card-clima";

interface CamadaClimaticaProps {
  buttonsTop?: number;
}

export default function CamadaClimatica({ buttonsTop }: CamadaClimaticaProps) {
  const { isActive, weather } = useClima();

  // 1. Efeito independente para o Ciclo Dia/Noite/Golden Hour
  useEffect(() => {
    const updateTimePeriod = () => {
      const hours = new Date().getHours();
      document.body.classList.remove("time-day", "time-golden", "time-night");
      
      if (hours >= 17 && hours < 18.5) {
        // Golden Hour (17:00 às 18:30)
        document.body.classList.add("time-golden");
      } else if (hours >= 18.5 || hours < 6) {
        // Noturno (18:30 às 06:00)
        document.body.classList.add("time-night");
      } else {
        // Diurno (06:00 às 17:00)
        document.body.classList.add("time-day");
      }
    };

    updateTimePeriod();
    const interval = setInterval(updateTimePeriod, 60000); // Atualiza a cada 60s
    
    return () => {
      clearInterval(interval);
      document.body.classList.remove("time-day", "time-golden", "time-night");
    };
  }, []);

  // 2. Aplica classe/filtro climático no canvas do mapa baseado no estado ativo
  useEffect(() => {
    if (!isActive || !weather) {
      document.body.classList.remove(
        "weather-sol",
        "weather-chuva",
        "weather-nublado",
        "weather-tempestade",
        "weather-neblina"
      );
      return;
    }

    document.body.classList.remove(
      "weather-sol",
      "weather-chuva",
      "weather-nublado",
      "weather-tempestade",
      "weather-neblina"
    );

    document.body.classList.add(`weather-${weather.condition}`);

    return () => {
      document.body.classList.remove(
        "weather-sol",
        "weather-chuva",
        "weather-nublado",
        "weather-tempestade",
        "weather-neblina"
      );
    };
  }, [isActive, weather]);

  return (
    <>
      {/* 1. Efeitos visuais atmosféricos por cima do mapa (somente se ativo) */}
      {isActive && weather && (
        <div className="absolute inset-0 w-full h-full pointer-events-none z-[1] select-none">
          {weather.condition === "sol" && <OverlaySol />}
          {weather.condition === "chuva" && <OverlayChuva />}
          {weather.condition === "neblina" && <OverlayNeblina />}
          {weather.condition === "tempestade" && <OverlayTempestade />}
          {weather.condition === "nublado" && (
            <div 
              className="absolute inset-0 bg-slate-700/10 pointer-events-none" 
              style={{ mixBlendMode: "multiply" }} 
            />
          )}
          {/* Nuvens Flutuantes reativas renderizadas sobre o clima ativo */}
          <OverlayNuvens />
        </div>
      )}

      {/* 2. Mini Card Informativo flutuante na tela (somente se ativo) */}
      {isActive && weather && (
        <div 
          className="absolute right-4 md:right-[calc((100vw-1280px)/2+16px)] z-30 pointer-events-none transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) animate-in fade-in slide-in-from-right-4 duration-300"
          style={{ top: `${buttonsTop ? buttonsTop + 52 : 222}px` }}
        >
          <CardClima />
        </div>
      )}

      {/* 3. Injeção de Estilos CSS Globais para os filtros de cor do mapa e ciclo temporal */}
      <style jsx global>{`
        /* Animação suave para as transições de filtro do canvas do mapa */
        .maplibregl-canvas {
          transition: filter 2.5s cubic-bezier(0.25, 1, 0.5, 1) !important;
        }

        /* --- 1. DIA PADRÃO (06h - 17h) --- */
        .time-day.weather-sol .maplibregl-canvas {
          filter: sepia(0.08) brightness(1.05) saturate(1.1) contrast(0.98);
        }
        .time-day.weather-chuva .maplibregl-canvas {
          filter: contrast(0.96) saturate(0.75) brightness(0.84) sepia(0.04);
        }
        .time-day.weather-nublado .maplibregl-canvas {
          filter: contrast(0.9) brightness(0.88) saturate(0.72);
        }
        .time-day.weather-tempestade .maplibregl-canvas {
          filter: brightness(0.68) contrast(1.1) saturate(0.6) sepia(0.06);
        }
        .time-day.weather-neblina .maplibregl-canvas {
          filter: blur(0.3px) contrast(0.9) brightness(0.92) saturate(0.8);
        }

        /* --- 2. HORA DE OURO / GOLDEN HOUR (17h - 18h30) --- */
        /* Estado padrão de Golden Hour sem clima ativo */
        .time-golden .maplibregl-canvas {
          filter: sepia(0.24) brightness(0.94) saturate(1.22) contrast(0.97) hue-rotate(-5deg);
        }
        .time-golden.weather-sol .maplibregl-canvas {
          filter: sepia(0.32) brightness(0.98) saturate(1.35) contrast(0.95) hue-rotate(-8deg);
        }
        .time-golden.weather-chuva .maplibregl-canvas {
          filter: sepia(0.2) brightness(0.78) saturate(0.95) contrast(0.92) hue-rotate(-2deg);
        }
        .time-golden.weather-nublado .maplibregl-canvas {
          filter: sepia(0.18) brightness(0.8) saturate(0.9) contrast(0.92);
        }
        .time-golden.weather-tempestade .maplibregl-canvas {
          filter: sepia(0.15) brightness(0.6) contrast(1.05) saturate(0.7) hue-rotate(-2deg);
        }
        .time-golden.weather-neblina .maplibregl-canvas {
          filter: blur(0.3px) sepia(0.22) brightness(0.84) saturate(1.0) contrast(0.92);
        }

        /* --- 3. NOTURNO (18h30 - 06h) --- */
        /* Estado padrão noturno sem clima ativo */
        .time-night .maplibregl-canvas {
          filter: brightness(0.48) saturate(0.72) contrast(1.1) hue-rotate(15deg);
        }
        .time-night.weather-sol .maplibregl-canvas {
          /* Noite com céu limpo / lua brilhante */
          filter: brightness(0.52) saturate(0.78) contrast(1.15) hue-rotate(18deg);
        }
        .time-night.weather-chuva .maplibregl-canvas {
          filter: brightness(0.38) saturate(0.55) contrast(1.05) hue-rotate(22deg);
        }
        .time-night.weather-nublado .maplibregl-canvas {
          filter: brightness(0.4) saturate(0.58) contrast(1.02) hue-rotate(20deg);
        }
        .time-night.weather-tempestade .maplibregl-canvas {
          filter: brightness(0.3) saturate(0.48) contrast(1.2) hue-rotate(25deg);
        }
        .time-night.weather-neblina .maplibregl-canvas {
          filter: blur(0.4px) brightness(0.42) saturate(0.62) contrast(0.98) hue-rotate(18deg);
        }

        /* Brilho nos marcadores de relatos em modo noturno (efeito neon sutil premium) */
        .time-night .maplibregl-marker {
          filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.12)) drop-shadow(0 0 2px rgba(255, 255, 255, 0.2));
          transition: filter 0.3s ease;
        }
      `}</style>
    </>
  );
}


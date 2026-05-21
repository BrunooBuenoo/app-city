"use client";

import React, { useEffect } from "react";
import { useClima } from "@/hooks/use-clima";
import OverlaySol from "./overlay-sol";
import OverlayChuva from "./overlay-chuva";
import OverlayNeblina from "./overlay-neblina";
import OverlayTempestade from "./overlay-tempestade";
import CardClima from "./card-clima";

export default function CamadaClimatica() {
  const { isActive, weather } = useClima();

  // Aplica classe/filtro global no canvas do mapa para alterar a tonalidade visual
  useEffect(() => {
    if (!isActive || !weather) {
      // Remover filtros ao desativar
      document.body.classList.remove(
        "weather-sol",
        "weather-chuva",
        "weather-nublado",
        "weather-tempestade",
        "weather-neblina"
      );
      return;
    }

    // Limpar filtros anteriores
    document.body.classList.remove(
      "weather-sol",
      "weather-chuva",
      "weather-nublado",
      "weather-tempestade",
      "weather-neblina"
    );

    // Adicionar novo filtro climático
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

  if (!isActive || !weather) return null;

  return (
    <>
      {/* 1. Efeitos visuais atmosféricos por cima do mapa */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-[1] select-none">
        {weather.condition === "sol" && <OverlaySol />}
        {weather.condition === "chuva" && <OverlayChuva />}
        {weather.condition === "neblina" && <OverlayNeblina />}
        {weather.condition === "tempestade" && <OverlayTempestade />}
        {weather.condition === "nublado" && (
          // Efeito de sombra nublada sutil geral
          <div 
            className="absolute inset-0 bg-slate-700/10 pointer-events-none" 
            style={{ mixBlendMode: "multiply" }} 
          />
        )}
      </div>

      {/* 2. Mini Card Informativo flutuante na tela (Top-Right no Grid, stackado abaixo do botão de Clima) */}
      <div className="absolute top-[222px] right-4 md:right-[calc((100vw-1280px)/2+16px)] z-30 pointer-events-none animate-in fade-in slide-in-from-right-4 duration-300">
        <CardClima />
      </div>

      {/* 3. Injeção de Estilos CSS Globais para os filtros de cor do mapa */}
      <style jsx global>{`
        /* Animação suave para as transições de filtro do canvas do mapa */
        .maplibregl-canvas {
          transition: filter 2.5s cubic-bezier(0.25, 1, 0.5, 1) !important;
        }

        /* Tonalidade Solar: Filtro quente dourado suave */
        .weather-sol .maplibregl-canvas {
          filter: sepia(0.08) brightness(1.05) saturate(1.1) contrast(0.98);
        }

        /* Tonalidade de Chuva: Filtro dessaturado, frio e levemente escurecido */
        .weather-chuva .maplibregl-canvas {
          filter: contrast(0.96) saturate(0.75) brightness(0.84) sepia(0.04);
        }

        /* Tonalidade Nublada: Cores frias, redução de saturação e contraste */
        .weather-nublado .maplibregl-canvas {
          filter: contrast(0.9) brightness(0.88) saturate(0.72);
        }

        /* Tonalidade de Tempestade: Muito escurecido, alto contraste */
        .weather-tempestade .maplibregl-canvas {
          filter: brightness(0.68) contrast(1.1) saturate(0.6) sepia(0.06);
        }

        /* Tonalidade de Neblina: Leve desfoque, cores suaves e baixa saturação */
        .weather-neblina .maplibregl-canvas {
          filter: blur(0.3px) contrast(0.9) brightness(0.92) saturate(0.8);
        }
      `}</style>
    </>
  );
}

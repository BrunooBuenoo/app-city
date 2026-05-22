"use client";

import React from "react";
import { useClima } from "@/hooks/use-clima";

export default function OverlayNuvens() {
  const { weather } = useClima();
  
  // Se o clima for sol, as nuvens devem ser ainda mais dispersas e sutis
  const isSol = weather?.condition === "sol";
  const windSpeed = weather?.windSpeed ?? 10;
  
  // Calcula o tempo de transição das nuvens baseado na velocidade real do vento.
  // Quanto mais vento, menor é o tempo de transição (passa mais rápido).
  const duration1 = Math.max(20, 160 - windSpeed * 3) + "s";
  const duration2 = Math.max(25, 200 - windSpeed * 3.5) + "s";
  const duration3 = Math.max(30, 240 - windSpeed * 4) + "s";

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-[1]">
      {/* Nuvem 1 (Pequena e rápida) */}
      <div 
        className="absolute top-[8%] left-[-300px] w-[320px] h-[100px] rounded-full bg-gradient-to-r from-white/8 via-white/12 to-white/4 blur-xl pointer-events-none"
        style={{
          animation: `float-cloud ${duration1} linear infinite 0s`,
          opacity: isSol ? 0.4 : 1,
        }}
      />

      {/* Nuvem 2 (Média e mais alta) */}
      <div 
        className="absolute top-[25%] left-[-450px] w-[460px] h-[130px] rounded-full bg-gradient-to-r from-white/6 via-white/10 to-white/2 blur-2xl pointer-events-none"
        style={{
          animation: `float-cloud ${duration2} linear infinite -40s`,
          opacity: isSol ? 0.3 : 1,
        }}
      />

      {/* Nuvem 3 (Lenta, ampla e mais baixa) */}
      <div 
        className="absolute top-[55%] left-[-600px] w-[600px] h-[160px] rounded-full bg-gradient-to-r from-white/4 via-white/8 to-white/2 blur-3xl pointer-events-none"
        style={{
          animation: `float-cloud ${duration3} linear infinite -85s`,
          opacity: isSol ? 0.2 : 1,
        }}
      />

      <style jsx global>{`
        @keyframes float-cloud {
          0% {
            transform: translateX(-100%) translateY(0);
          }
          100% {
            transform: translateX(100vw) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}


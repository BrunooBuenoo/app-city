"use client";

import React from "react";

export default function OverlayNeblina() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-[1]">
      {/* Camada de Névoa 1 - Movimento lento da esquerda para a direita */}
      <div 
        className="absolute inset-0 w-[200%] h-full opacity-35"
        style={{
          background: "linear-gradient(90deg, rgba(241, 245, 249, 0.08) 0%, rgba(226, 232, 240, 0.22) 25%, rgba(241, 245, 249, 0.08) 50%, rgba(226, 232, 240, 0.22) 75%, rgba(241, 245, 249, 0.08) 100%)",
          animation: "drift-nevoa-slow 60s linear infinite",
          filter: "blur(20px)",
        }}
      />

      {/* Camada de Névoa 2 - Movimento um pouco mais rápido e inclinado */}
      <div 
        className="absolute -top-[10%] -left-[50%] w-[200%] h-[120%] opacity-25"
        style={{
          background: "radial-gradient(ellipse at center, rgba(255,255,255,0.2) 0%, rgba(241, 245, 249, 0.1) 40%, transparent 80%)",
          animation: "drift-nevoa-fast 40s linear infinite",
          filter: "blur(30px)",
        }}
      />

      {/* Overlay Geral de Desfoque de Profundidade Sutil para reduzir o contraste do mapa */}
      <div 
        className="absolute inset-0 w-full h-full bg-slate-500/5 pointer-events-none"
        style={{ backdropFilter: "blur(0.4px) contrast(0.92) saturate(0.85)" }}
      />

      <style jsx global>{`
        @keyframes drift-nevoa-slow {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes drift-nevoa-fast {
          0% {
            transform: translate(0%, 0%) rotate(0deg);
          }
          50% {
            transform: translate(-10%, 5%) rotate(2deg);
          }
          100% {
            transform: translate(0%, 0%) rotate(0deg);
          }
        }
      `}</style>
    </div>
  );
}

"use client";

import React from "react";

export default function OverlaySol() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-[1]">
      {/* Brilho Solar Suave no canto superior direito */}
      <div 
        className="absolute top-0 right-0 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full translate-x-1/4 -translate-y-1/4 pointer-events-none opacity-80"
        style={{
          background: "radial-gradient(circle, rgba(254, 243, 199, 0.28) 0%, rgba(251, 191, 36, 0.06) 45%, rgba(251, 191, 36, 0.01) 70%, transparent 100%)",
          mixBlendMode: "screen",
          animation: "pulse-solar 12s ease-in-out infinite alternate"
        }}
      />
      
      {/* Lens Flare Cinematográfico Sutil (Linha de luz dourada elegante cruzando o mapa) */}
      <div 
        className="absolute top-[20%] right-[20%] w-[120%] h-[2px] -rotate-12 pointer-events-none opacity-30"
        style={{
          background: "linear-gradient(90deg, transparent 10%, rgba(253, 224, 71, 0.08) 45%, rgba(254, 243, 199, 0.15) 50%, rgba(253, 224, 71, 0.08) 55%, transparent 90%)",
          filter: "blur(4px)",
          mixBlendMode: "screen"
        }}
      />

      <style jsx global>{`
        @keyframes pulse-solar {
          0% {
            transform: translate(25%, -25%) scale(0.95);
            opacity: 0.7;
          }
          100% {
            transform: translate(25%, -25%) scale(1.05);
            opacity: 0.95;
          }
        }
      `}</style>
    </div>
  );
}

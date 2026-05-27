"use client";

import React, { useId } from "react";

interface VizoorLogoProps {
  className?: string;
  height?: number;
  inverted?: boolean;
}

export default function VizoorLogo({ className = "", height = 28, inverted = false }: VizoorLogoProps) {
  const uid = useId().replace(/:/g, "");
  const gradId = `vz-g-${uid}`;

  return (
    <svg
      viewBox="0 0 280 70"
      height={height}
      className={`vizoor-logo ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Vizoor"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a6bcc" />
          <stop offset="100%" stopColor="#00d9ffff" />
        </linearGradient>
      </defs>

      {/* Texto "viz" */}
      <text
        x="0"
        y="66"
        fill={inverted ? "#ffffff" : "currentColor"}
        fontFamily="'Plus Jakarta Sans', 'Inter', 'Helvetica Neue', sans-serif"
        fontWeight="800"
        fontSize="65"
        letterSpacing="0"
      >
        viz
      </text>

      {/* Olho Esquerdo — Azul Escuro (Marinho) */}
      <circle cx="120" cy="42" r="26" fill="#e40202ff" />
      <g className="vizoor-eye" style={{ transformBox: "fill-box" as any, transformOrigin: "center" }}>
        <circle cx="120" cy="42" r="15" fill="#ffffffff" />
        <circle cx="120" cy="42" r="9.5" fill="#080e1e" />
        <circle cx="124" cy="37" r="3" fill="white" opacity="0.9" />
      </g>

      {/* Olho Direito — Gradiente Azul */}
      <circle cx="170" cy="42" r="26" fill={`url(#${gradId})`} />
      <g className="vizoor-eye vizoor-eye-r" style={{ transformBox: "fill-box" as any, transformOrigin: "center" }}>
        <circle cx="170" cy="42" r="15" fill="#ffffffff" />
        <circle cx="170" cy="42" r="9.5" fill="#080e1e" />
        <circle cx="174" cy="37" r="3" fill="white" opacity="0.9" />
      </g>

      {/* Texto "r" */}
      <text
        x="202"
        y="66"
        fill={inverted ? "#ffffff" : "currentColor"}
        fontFamily="'Plus Jakarta Sans', 'Inter', 'Helvetica Neue', sans-serif"
        fontWeight="800"
        fontSize="65"
        letterSpacing="-1.5"
      >
        r
      </text>
    </svg>
  );
}

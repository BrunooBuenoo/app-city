"use client";

import React, { useId } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

interface VizoorLogoProps {
  className?: string;
  height?: number;
  inverted?: boolean;
}

export default function VizoorLogo({ className = "", height = 28, inverted = false }: VizoorLogoProps) {
  const uid = useId().replace(/:/g, "");
  const gradId = `vz-g-${uid}`;
  const { setTheme } = useTheme();
  const router = useRouter();

  // Manipuladores de clique com parada de propagação para não conflitar com Links pais
  const handleVizClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push("/");
  };

  const handleLeftEyeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setTheme("light");
  };

  const handleRightEyeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setTheme("dark");
  };

  const handleRClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setTheme("system");
  };

  return (
    <svg
      viewBox="0 0 280 70"
      height={height}
      className={`vizoor-logo select-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Vizoor"
      style={{ display: "block" }}
    >
      <defs>
        {/* Gradiente Azul Elétrico do Tema Escuro */}
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="30%" stopColor="#007bffff" />
          <stop offset="60%" stopColor="#00d5ffff" />
          <stop offset="90%" stopColor="#AA4EFF" />
        </linearGradient>
      </defs>

      {/* Texto "viz" ➔ Redireciona para o Mapa */}
      <text
        x="0"
        y="66"
        onClick={handleVizClick}
        fill={inverted ? "#ffffff" : "currentColor"}
        fontFamily="'Plus Jakarta Sans', 'Inter', 'Helvetica Neue', sans-serif"
        fontWeight="800"
        fontSize="65"
        letterSpacing="0"
        className="cursor-pointer hover:opacity-80 transition-opacity duration-300"
      >
        viz
      </text>

      {/* Olho Esquerdo ➔ Muda para Tema Claro (Light) */}
      <g
        onClick={handleLeftEyeClick}
        className="cursor-pointer hover:scale-[1.08] transition-transform duration-300"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      >
        {/* Acessibilidade Padrão W3C SVG */}
        <title>Mudar para Tema Claro</title>

        {/* Fundo do Olho */}
        <circle
          cx="120"
          cy="42"
          r="26"
          className="fill-[#e40202] dark:fill-[url(#vz-g-uid)] transition-all duration-500"
          style={{
            fill: `url(#${gradId})`,
          }}
        />
        <circle
          cx="120"
          cy="42"
          r="26"
          className="fill-[#e40202] dark:opacity-0 transition-all duration-500"
          style={{
            fill: `url(#${gradId})`,
          }}
        />
        
        {/* Pupila e Brilho */}
        <g className="vizoor-eye" style={{ transformBox: "fill-box" as any, transformOrigin: "center" }}>
          <circle cx="120" cy="42" r="15" fill="#ffffffff" />
          <circle cx="120" cy="42" r="9.5" fill="#080e1e" />
          <circle cx="124" cy="37" r="3" fill="white" opacity="0.9" />
        </g>
      </g>

      {/* Olho Direito ➔ Muda para Tema Escuro (Dark) */}
      <g
        onClick={handleRightEyeClick}
        className="cursor-pointer hover:scale-[1.08] transition-transform duration-300"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      >
        {/* Acessibilidade Padrão W3C SVG */}
        <title>Mudar para Tema Escuro</title>

        {/* Fundo do Olho */}
        <circle
          cx="170"
          cy="42"
          r="26"
          className="fill-[#e40202] dark:fill-[url(#vz-g-uid)] transition-all duration-500"
          style={{
            fill: `url(#${gradId})`,
          }}
        />
        <circle
          cx="170"
          cy="42"
          r="26"
          className="fill-[#e40202] dark:opacity-0 transition-all duration-500"
          style={{
            fill: `url(#${gradId})`,
          }}
        />
        
        {/* Pupila e Brilho */}
        <g className="vizoor-eye vizoor-eye-r" style={{ transformBox: "fill-box" as any, transformOrigin: "center" }}>
          <circle cx="170" cy="42" r="15" fill="#ffffffff" />
          <circle cx="170" cy="42" r="9.5" fill="#080e1e" />
          <circle cx="174" cy="37" r="3" fill="white" opacity="0.9" />
        </g>
      </g>

      {/* Texto "r" ➔ Muda para o Tema do Dispositivo (System) */}
      <text
        x="202"
        y="66"
        onClick={handleRClick}
        fill={inverted ? "#ffffff" : "currentColor"}
        fontFamily="'Plus Jakarta Sans', 'Inter', 'Helvetica Neue', sans-serif"
        fontWeight="800"
        fontSize="65"
        letterSpacing="-1.5"
        className="cursor-pointer hover:opacity-80 transition-opacity duration-300"
      >
        {/* Elemento de título de acessibilidade para elementos de texto no SVG */}
        <title>Mudar para o Tema do Dispositivo</title>
        r
      </text>
    </svg>
  );
}

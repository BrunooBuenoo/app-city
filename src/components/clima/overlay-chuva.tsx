"use client";

import React, { useEffect, useRef } from "react";

export default function OverlayChuva() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    // Ajustar tamanho no resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // Estrutura da gota de chuva
    interface Drop {
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
      width: number;
    }

    const slant = -2.0; // Inclinação elegante da chuva caindo no vento
    const margin = Math.abs(slant) * 80; // Margem de compensação de vento lateral para cobertura total da tela

    // Aumentamos a densidade de gotas para ficar bem visível no mapa claro/escuro
    const dropCount = Math.min(Math.floor((width * height) / 3500), 280); 
    const drops: Drop[] = [];

    // Inicializar gotas
    for (let i = 0; i < dropCount; i++) {
      drops.push({
        x: Math.random() * (width + margin * 2) - margin, // Gera gotas cobrindo também as margens laterais externas
        y: Math.random() * height - height,
        length: 16 + Math.random() * 18, // Gotas mais longas e visíveis
        speed: 12 + Math.random() * 6,   // Velocidade fluida
        opacity: 0.38 + Math.random() * 0.38, // Aumentamos a opacidade para fácil visualização
        width: 1.2 + Math.random() * 0.8, // Espessura um pouco maior
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < dropCount; i++) {
        const d = drops[i];

        // Desenhar pingo de chuva
        ctx.beginPath();
        // Usamos um tom de azul claro brilhante quase branco para máximo contraste contra o mapa
        ctx.strokeStyle = `rgba(207, 226, 255, ${d.opacity})`; 
        ctx.lineWidth = d.width;
        ctx.lineCap = "round";
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + slant, d.y + d.length);
        ctx.stroke();

        // Atualizar posição
        d.y += d.speed;
        d.x += slant;

        // Resetar gota quando sai da tela
        if (d.y > height) {
          d.y = -d.length;
          d.x = Math.random() * (width + margin * 2) - margin; // Preenche de borda a borda considerando o desvio lateral
          d.speed = 12 + Math.random() * 6;
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}

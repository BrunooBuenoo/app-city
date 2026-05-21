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

    // Aumentamos a densidade de gotas para ficar bem visível no mapa claro/escuro
    const dropCount = Math.min(Math.floor((width * height) / 3500), 280); 
    const drops: Drop[] = [];

    // Inicializar gotas
    for (let i = 0; i < dropCount; i++) {
      drops.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        length: 16 + Math.random() * 18, // Gotas mais longas e visíveis
        speed: 12 + Math.random() * 6,   // Velocidade fluida
        opacity: 0.38 + Math.random() * 0.38, // Aumentamos a opacidade para fácil visualização
        width: 1.2 + Math.random() * 0.8, // Espessura um pouco maior
      });
    }

    const slant = -2.0; // Inclinação elegante da chuva caindo no vento

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
          d.x = Math.random() * (width + Math.abs(slant)) - slant;
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

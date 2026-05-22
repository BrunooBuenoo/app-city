"use client";

import React, { useEffect, useRef } from "react";

export default function OverlayTempestade() {
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

    // Estrutura das gotas de chuva fortes
    interface HeavyDrop {
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
      width: number;
    }

    // Estrutura do splash da gota batendo na tela (efeito 3D)
    interface ScreenSplash {
      id: number;
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      opacity: number;
      speed: number;
    }

    const slant = -4.5; // Vento muito forte e inclinado
    const margin = Math.abs(slant) * 80; // Margem de compensação de vento lateral para cobertura total da tela

    // Aumentamos drasticamente a densidade para uma tempestade avassaladora
    const dropCount = Math.min(Math.floor((width * height) / 1800), 500); 
    const drops: HeavyDrop[] = [];
    const splashes: ScreenSplash[] = [];

    for (let i = 0; i < dropCount; i++) {
      drops.push({
        x: Math.random() * (width + margin * 2) - margin, // Gera gotas cobrindo também as margens laterais externas
        y: Math.random() * height - height,
        length: 22 + Math.random() * 24, // Traços longos e dinâmicos
        speed: 18 + Math.random() * 10,   // Queda ultra-rápida
        opacity: 0.48 + Math.random() * 0.42, // Altíssima visibilidade
        width: 1.5 + Math.random() * 1.5, // Espessura grossa de chuva pesada
      });
    }

    // Controle dos relâmpagos (flashes mais frequentes e potentes: a cada 2 a 5.5 segundos)
    let flashOpacity = 0;
    let timeToNextFlash = 120 + Math.random() * 200; 

    const draw = () => {
      // Limpar a tela
      ctx.clearRect(0, 0, width, height);

      // 1. Desenhar a chuva torrencial
      for (let i = 0; i < dropCount; i++) {
        const d = drops[i];

        ctx.beginPath();
        ctx.strokeStyle = `rgba(235, 243, 255, ${d.opacity})`; // Tom cinza-azulado brilhante
        ctx.lineWidth = d.width;
        ctx.lineCap = "round";
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + slant, d.y + d.length);
        ctx.stroke();

        d.y += d.speed;
        d.x += slant;

        if (d.y > height) {
          d.y = -d.length;
          d.x = Math.random() * (width + margin * 2) - margin; // Preenche perfeitamente de borda a borda considerando o desvio lateral
          d.speed = 18 + Math.random() * 10;
        }
      }

      // 2. Ocasionalmente gera uma gota colidindo com a tela (efeito 3D premium - mais frequente na tempestade)
      if (Math.random() < 0.035) { // 3.5% de chance por frame
        splashes.push({
          id: Math.random(),
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 1,
          maxRadius: 12 + Math.random() * 18,
          opacity: 0.15 + Math.random() * 0.22,
          speed: 0.8 + Math.random() * 0.7
        });
      }

      // 3. Desenhar e animar os splashes de gotas na tela
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        
        ctx.beginPath();
        // Círculo principal translúcido da gota batendo
        ctx.strokeStyle = `rgba(230, 242, 255, ${s.opacity})`;
        ctx.lineWidth = 1.2;
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Círculo interno menor para dar efeito de refração 3D
        if (s.radius > 3) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(230, 242, 255, ${s.opacity * 0.45})`;
          ctx.lineWidth = 0.8;
          ctx.arc(s.x, s.y, s.radius * 0.5, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Atualizar estado
        s.radius += s.speed;
        s.opacity -= 0.015; // esmaecimento linear mais rápido sob turbulência

        if (s.opacity <= 0 || s.radius >= s.maxRadius) {
          splashes.splice(i, 1);
        }
      }

      // 2. Processar e Desenhar Relâmpago (Flash Cinematográfico)
      timeToNextFlash--;
      if (timeToNextFlash <= 0) {
        // Disparar flash muito mais forte e dramático (opacidade de 0.78 a 1.0)
        flashOpacity = 0.78 + Math.random() * 0.22;
        // Intervalo curto entre relâmpagos
        timeToNextFlash = 120 + Math.random() * 210; 
      }

      if (flashOpacity > 0) {
        // Desenhar overlay do relâmpago
        ctx.fillStyle = `rgba(255, 255, 255, ${flashOpacity})`;
        ctx.fillRect(0, 0, width, height);
        
        // Decaimento suave e cinematográfico
        flashOpacity *= 0.88; 
        if (flashOpacity < 0.01) {
          flashOpacity = 0;
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

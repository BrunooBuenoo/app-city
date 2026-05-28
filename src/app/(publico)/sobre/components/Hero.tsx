"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Sparkles, ArrowDown } from "lucide-react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Valores de movimentação do mouse para efeito Parallax 3D
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Molas suaves para física com inércia premium
  const springConfig = { damping: 40, stiffness: 200, mass: 0.5 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Transformações para dar percepção de camadas de profundidade (Depth Layers)
  const layer1X = useTransform(springX, [-0.5, 0.5], [-15, 15]);
  const layer1Y = useTransform(springY, [-0.5, 0.5], [-15, 15]);

  const layer2X = useTransform(springX, [-0.5, 0.5], [-35, 35]);
  const layer2Y = useTransform(springY, [-0.5, 0.5], [-35, 35]);

  const layer3X = useTransform(springX, [-0.5, 0.5], [10, -10]);
  const layer3Y = useTransform(springY, [-0.5, 0.5], [10, -10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Normaliza a posição de -0.5 a 0.5
    const relativeX = (e.clientX - rect.left) / width - 0.5;
    const relativeY = (e.clientY - rect.top) / height - 0.5;

    mouseX.set(relativeX);
    mouseY.set(relativeY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen w-full flex flex-col justify-center items-center text-center px-6 md:px-12 py-32 overflow-hidden z-10 select-none"
    >
      {/* Elemento Decorativo Flutuante de Fundo (Camada Traseira 3) */}
      <motion.div
        style={{ x: layer3X, y: layer3Y }}
        className="absolute w-[80vw] h-[80vw] max-w-[800px] border border-zinc-200/30 dark:border-white/5 rounded-full pointer-events-none opacity-50 z-0 flex items-center justify-center"
      >
        <div className="w-[80%] h-[80%] border border-zinc-200/20 dark:border-white/[0.03] rounded-full flex items-center justify-center">
          <div className="w-[60%] h-[60%] border border-zinc-200/10 dark:border-white/[0.02] rounded-full" />
        </div>
      </motion.div>

      {/* Conteúdo Central */}
      <div className="relative z-10 flex flex-col items-center max-w-5xl">
        
        {/* Badge Neon Premium */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-100/60 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-md text-xs font-semibold text-zinc-600 dark:text-zinc-300 shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] mb-8 transition-colors duration-500"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
          <span className="bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">
            Explore a cidade de verdade
          </span>
        </motion.div>

        {/* Título Oversized com Depth Parallax (Camada Intermediária 1) */}
        <motion.h1
          style={{ x: layer1X, y: layer1Y }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="text-4xl sm:text-6xl md:text-[6.5rem] font-medium tracking-tight text-zinc-900 dark:text-white leading-[1.05] mb-8 font-sans transition-colors duration-500"
        >
          A cidade além
          <br />
          <span className="relative inline-block font-bold">
            <span className="absolute -inset-x-2 inset-y-1 bg-gradient-to-r from-[#1a6bcc]/15 to-purple-500/15 dark:from-[#1a6bcc]/20 dark:to-purple-500/20 blur-xl opacity-60 rounded-3xl" />
            <span className="relative bg-gradient-to-r from-[#1a6bcc] via-cyan-500 to-purple-500 dark:via-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">
              das telas.
            </span>
          </span>
        </motion.h1>

        {/* Descrição Premium com Subtítulo Clean (Camada de Profundidade Superior 2) */}
        <motion.p
          style={{ x: layer2X, y: layer2Y }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="text-sm md:text-xl text-zinc-600 dark:text-zinc-400 font-light max-w-3xl leading-relaxed mb-12 tracking-wide transition-colors duration-500"
        >
          Encontre os melhores restaurantes, pousadas, cafeterias e atrações escondidas 
          indicadas por <strong>pessoas reais que vivem cada cidade</strong>. Menos tempo no feed 
          de redes sociais, mais tempo colecionando momentos reais.
        </motion.p>

        {/* CTAs Iniciais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <a
            href="/"
            className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 text-sm font-bold rounded-full transition-all duration-300 active:scale-95 shadow-[0_4px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_30px_rgba(255,255,255,0.12)]"
          >
            Explorar o Mapa
          </a>
          <a
            href="#manifesto"
            className="px-8 py-4 bg-zinc-100/50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 text-sm font-bold rounded-full transition-all duration-300 active:scale-95 backdrop-blur-md"
          >
            Por que existimos
          </a>
        </motion.div>
      </div>

      {/* Indicador de Scroll para Descer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-10 flex flex-col items-center gap-1.5 text-zinc-500"
      >
        <span className="text-[9px] uppercase tracking-[0.25em] font-bold">Deslize</span>
        <ArrowDown className="w-4 h-4 animate-bounce" />
      </motion.div>
    </section>
  );
}

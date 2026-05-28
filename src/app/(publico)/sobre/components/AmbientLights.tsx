"use client";

import React from "react";
import { motion } from "framer-motion";

export default function AmbientLights() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#FAF7F2] dark:bg-zinc-950 transition-colors duration-500">
      {/* Luz Superior Esquerda — Ciano/Azul */}
      <motion.div
        initial={{ x: -100, y: -100, opacity: 0.08 }}
        animate={{
          x: [-120, -80, -100],
          y: [-120, -60, -100],
          opacity: [0.08, 0.15, 0.08],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 left-0 w-[50vw] h-[50vw] max-w-[600px] rounded-full bg-cyan-500/10 dark:bg-cyan-500/20 blur-[130px] transition-all duration-500"
      />

      {/* Luz Central Direita — Roxo/Lilás */}
      <motion.div
        initial={{ x: 100, y: 150, opacity: 0.05 }}
        animate={{
          x: [80, 120, 100],
          y: [120, 180, 150],
          opacity: [0.05, 0.12, 0.05],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[30%] right-[-10%] w-[45vw] h-[45vw] max-w-[550px] rounded-full bg-purple-500/8 dark:bg-purple-500/15 blur-[150px] transition-all duration-500"
      />

      {/* Luz Inferior Esquerda — Azul Royal */}
      <motion.div
        initial={{ x: -50, y: 100, opacity: 0.04 }}
        animate={{
          x: [-80, -30, -50],
          y: [80, 130, 100],
          opacity: [0.04, 0.09, 0.04],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[20%] left-[-5%] w-[40vw] h-[40vw] max-w-[500px] rounded-full bg-[#1a6bcc]/5 dark:bg-[#1a6bcc]/10 blur-[120px] transition-all duration-500"
      />

      {/* Luz de Encerramento Inferior Direita */}
      <motion.div
        initial={{ opacity: 0.06 }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.06, 0.12, 0.06],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-0 right-0 w-[60vw] h-[60vw] max-w-[700px] rounded-full bg-purple-600/8 dark:bg-purple-600/15 blur-[160px] transition-all duration-500"
      />

      {/* Grid de Pontos Urbanos Sutis em Background */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.015] transition-opacity duration-500"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Textura de Noise Analógico Premium */}
      <div 
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.02] mix-blend-overlay transition-opacity duration-500"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

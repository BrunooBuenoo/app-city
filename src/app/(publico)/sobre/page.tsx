"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";

// Importação dos componentes modulares e premium específicos da página
import AmbientLights from "./components/AmbientLights";
import NavbarCustom from "./components/NavbarCustom";
import Hero from "./components/Hero";
import Manifesto from "./components/Manifesto";
import ConnectedCity from "./components/ConnectedCity";
import CategoryGrid from "./components/CategoryGrid";
import RealTimeMetrics from "./components/RealTimeMetrics";
import Timeline from "./components/Timeline";
import FooterPremium from "./components/FooterPremium";

export default function SobrePage() {
  // Ajuste do título da aba do navegador dinamicamente (SEO e marca consistente)
  useEffect(() => {
    document.title = "Manifesto Vizoor — Descubra a cidade além das telas";
  }, []);

  return (
    <div className="bg-[#FAF7F2] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen relative font-sans overflow-x-hidden antialiased transition-colors duration-500 selection:bg-cyan-500/20 selection:text-white">
      {/* 1. Efeitos de Iluminação Ambiente e Noise Analógico */}
      <AmbientLights />

      {/* 2. Menu Superior Premium Transparente */}
      <NavbarCustom />

      {/* Orquestrador de Movimento e Entrada Suave Cinematográfica */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative z-10"
      >
        {/* 3. Hero Section Cinematográfica */}
        <Hero />

        {/* 4. Manifesto com Word Scroll Reveal */}
        <Manifesto />

        {/* 5. Simulação Interativa "Como a Comunidade se Conecta" */}
        <ConnectedCity />

        {/* 6. Grade de Categorias com Efeito Spotlight */}
        <CategoryGrid />

        {/* 7. Métricas Vivas da Comunidade com Contadores de Inércia */}
        <RealTimeMetrics />

        {/* 8. Linha do Tempo e Crescimento da Jornada */}
        <Timeline />

        {/* 9. CTA Premium e Rodapé Emocional */}
        <FooterPremium />
      </motion.main>
    </div>
  );
}

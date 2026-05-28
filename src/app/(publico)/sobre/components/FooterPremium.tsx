"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowUp, Heart } from "lucide-react";
import { motion } from "framer-motion";
import VizoorLogo from "@/components/ui/VizoorLogo";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function FooterPremium() {
  const footerRef = useRef<HTMLDivElement>(null);
  const ctaTitleRef = useRef<HTMLHeadingElement>(null);
  const ctaDescRef = useRef<HTMLParagraphElement>(null);
  const ctaButtonsRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const footer = footerRef.current;
    const ctaTitle = ctaTitleRef.current;
    const ctaDesc = ctaDescRef.current;
    const ctaButtons = ctaButtonsRef.current;
    const glow = glowRef.current;

    if (!footer || !ctaTitle || !ctaDesc || !ctaButtons || !glow) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      // Estado Inicial: Título gigante, descrição e botões deslocados e ocultos
      gsap.set(ctaTitle, { opacity: 0, y: 50 });
      gsap.set(ctaDesc, { opacity: 0, y: 30 });
      gsap.set(ctaButtons, { opacity: 0, y: 30 });
      gsap.set(glow, { opacity: 0, scale: 0.8 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footer,
          start: "top 85%",      // Inicia a aparição sutil
          end: "bottom bottom",  // Estende até o final absoluto da rolagem física da página
          scrub: 1.2,            // Acompanhamento ultra-suave e cadenciado
        }
      });

      // Revelação cadenciada e teatral: cada parte do rodapé ganha a sua própria coordenada física de scroll
      tl.to(glow, { opacity: 1, scale: 1, duration: 0.8, ease: "power1.out" })
        .to({}, { duration: 0.2 })   // Pausa de rolagem

        .to(ctaTitle, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })
        .to({}, { duration: 0.25 })  // Pausa de rolagem após o surgimento do título gigante

        .to(ctaDesc, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" })
        .to({}, { duration: 0.25 })  // Pausa de rolagem após a descrição surgir

        .to(ctaButtons, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" })
        .to({}, { duration: 0.3 });  // Estabilidade de finalização sólida
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative w-full z-10 border-t border-zinc-200/50 dark:border-zinc-900/60 bg-white dark:bg-zinc-950 overflow-hidden transition-colors duration-500"
    >
      {/* ─── Seção do CTA Emocional Superior ─── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-32 text-center relative z-10">
        {/* Luz Flutuante no Centro do CTA */}
        <div
          ref={glowRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-[90px] pointer-events-none z-0 transition-opacity duration-1000"
        />

        <div className="relative z-10 max-w-4xl mx-auto space-y-10">
          <h3
            ref={ctaTitleRef}
            className="text-4xl sm:text-6xl md:text-[5.5rem] font-medium tracking-tight text-zinc-900 dark:text-white leading-[1.1] transition-colors duration-500"
          >
            Vamos viver a cidade
            <br />
            <span className="bg-gradient-to-r from-cyan-600 via-blue-500 to-purple-600 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-400 bg-clip-text text-transparent font-bold">
              de verdade?
            </span>
          </h3>

          <p
            ref={ctaDescRef}
            className="text-sm md:text-xl text-zinc-650 dark:text-zinc-400 font-light max-w-xl mx-auto leading-relaxed transition-colors duration-500"
          >
            Junte-se à comunidade de pessoas apaixonadas por explorar novos cantos, 
            apoiar criadores locais e valorizar as melhores experiências.
          </p>

          <div
            ref={ctaButtonsRef}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <Link
              href="/cadastro"
              className="relative inline-flex items-center gap-1.5 px-8 py-4 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 text-sm font-bold rounded-full overflow-hidden transition-all duration-300 active:scale-95 shadow-[0_4px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_30px_rgba(255,255,255,0.12)] group"
            >
              <span>Começar a Explorar</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="/cadastro"
              className="px-8 py-4 bg-zinc-100/50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 text-sm font-bold rounded-full transition-all duration-300 active:scale-95 backdrop-blur-md"
            >
              Divulgar meu Estabelecimento
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Seção de Links e Copyright ─── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 border-t border-zinc-150 dark:border-zinc-900/80 relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 transition-colors duration-500">
        
        {/* Lado Esquerdo: Logo & Marca */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-2 group">
            <VizoorLogo height={24} className="text-zinc-900 dark:text-white transition-colors duration-500" />
            <span className="text-[10px] tracking-widest font-extrabold text-cyan-600 bg-cyan-100/50 dark:text-cyan-400 dark:bg-cyan-950/50 border border-cyan-200/40 dark:border-cyan-800/40 px-2 py-0.5 rounded-full uppercase scale-90">
              City
            </span>
          </div>
          <p className="text-[11px] font-light text-zinc-400 dark:text-zinc-500 text-center md:text-left leading-relaxed transition-colors duration-500">
            Plataforma social de descoberta local baseada em experiências reais
            <br />
            e recomendações sinceras de criadores locais por todo o Brasil.
          </p>
        </div>

        {/* Centro: Links Gerais Úteis */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          <Link href="/" className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
            Explorar Mapa
          </Link>
          <Link href="/sobre" className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
            Manifesto
          </Link>
          <Link href="/termos" className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
            Termos de Uso
          </Link>
          <Link href="/termos?tab=privacidade" className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
            Privacidade
          </Link>
        </div>

        {/* Lado Direito: Ações Extra e Voltar ao Topo */}
        <div className="flex items-center gap-4">
          {/* Botão de Voltar ao Topo */}
          <button
            onClick={handleScrollToTop}
            className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 flex items-center justify-center text-zinc-500 dark:text-cyan-450 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all duration-300 shadow-sm dark:shadow-md cursor-pointer"
            title="Voltar ao Topo"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* ─── Barra de Copyright Inferior ─── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-12 border-t border-zinc-100 dark:border-zinc-900/40 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-light text-zinc-450 dark:text-zinc-650 relative z-10 transition-colors duration-500">
        <span>
          © {new Date().getFullYear()} Vizoor (App City). Todos os direitos reservados.
        </span>
        <span className="flex items-center gap-1.5 justify-center">
          Desenvolvido com <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" /> para aproximar exploradores e cidades.
        </span>
      </div>
    </footer>
  );
}

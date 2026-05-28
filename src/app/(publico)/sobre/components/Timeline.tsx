"use client";

import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Lightbulb, Calendar, Rocket, Compass } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TimelineItemProps {
  year: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  index: number;
  markerRef?: React.Ref<HTMLDivElement>;
  cardRef?: React.Ref<HTMLDivElement>;
}

function TimelineItem({ year, title, description, icon: Icon, index, markerRef, cardRef }: TimelineItemProps) {
  const isEven = index % 2 === 0;

  return (
    <div className={`relative flex flex-col md:flex-row items-center justify-between w-full mb-20 last:mb-0 ${isEven ? "md:flex-row-reverse" : ""}`}>
      {/* Marcador Central (desktop) / Lateral (mobile) */}
      <div ref={markerRef} className="absolute left-6 md:left-1/2 -translate-x-1/2 flex items-center justify-center z-20">
        <div
          className="w-12 h-12 rounded-full bg-white dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-500 hover:text-cyan-500 hover:border-cyan-500 dark:hover:text-cyan-400 dark:hover:border-cyan-500 transition-colors duration-300 shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.8)]"
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Caixa de Conteúdo */}
      <div
        ref={cardRef}
        className={`w-full md:w-[45%] pl-16 md:pl-0 ${isEven ? "md:text-right" : "md:text-left"}`}
      >
        <div className={`p-8 rounded-3xl bg-white/80 dark:bg-zinc-900/10 border border-zinc-200 dark:border-zinc-900/80 backdrop-blur-xl flex flex-col justify-between shadow-sm hover:border-zinc-300 dark:hover:border-zinc-800/60 transition-all duration-305 group relative overflow-hidden`}>
          {/* Luz Guia de Efeito Hover Interna */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/0 via-cyan-500/0 to-cyan-500/[0.02] dark:to-cyan-500/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <span className="text-xs font-black tracking-widest text-cyan-600 bg-cyan-50/50 border border-zinc-150/80 dark:text-cyan-400 dark:bg-cyan-950/40 dark:border-cyan-800/40 px-3 py-1 rounded-full uppercase self-start md:self-auto inline-block mb-4 transition-colors duration-500 relative z-10">
            {year}
          </span>
          <h4 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight leading-snug mb-3 transition-colors duration-500 relative z-10">{title}</h4>
          <p className="text-xs font-light text-zinc-650 dark:text-zinc-400 leading-relaxed transition-colors duration-500 relative z-10">
            {description}
          </p>
        </div>
      </div>

      {/* Espaçador Oculto no Desktop para Alinhamento */}
      <div className="hidden md:block w-[45%]" />
    </div>
  );
}

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const pathBrilhanteRef = useRef<SVGPathElement>(null);

  // Referências individuais para cartões e marcadores de cada um dos 4 anos
  const marker1Ref = useRef<HTMLDivElement>(null);
  const marker2Ref = useRef<HTMLDivElement>(null);
  const marker3Ref = useRef<HTMLDivElement>(null);
  const marker4Ref = useRef<HTMLDivElement>(null);

  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const card4Ref = useRef<HTMLDivElement>(null);

  // useScroll do Framer Motion dedicado exclusivamente ao preenchimento móvel linear
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const lineHeightMobile = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const items = [
    {
      year: "2024",
      title: "Onde tudo começou",
      description: "Nascemos com a missão simples de inspirar as pessoas a desligarem o celular e saírem de casa para viver a cidade de verdade, valorizando experiências físicas reais.",
      icon: Lightbulb,
    },
    {
      year: "2025",
      title: "Primeiros passos em São Paulo",
      description: "Lançamos o app integrando criadores de conteúdo pioneiros, como o Navegando SP, ajudando as pessoas a descobrirem lugares incríveis e economizarem com cupons especiais.",
      icon: Rocket,
    },
    {
      year: "2026",
      title: "Ganhando o país",
      description: "Expandimos para novos estados e cidades brasileiras, conectando cada vez mais exploradores locais e facilitando a parceria direta com negócios locais de bairro.",
      icon: Calendar,
    },
    {
      year: "2027 e Além",
      title: "O futuro da discovery local",
      description: "Nossa meta é construir a maior rede social urbana e comunitária do Brasil, aproximando exploradores e os pequenos estabelecimentos que dão vida à cidade.",
      icon: Compass,
    },
  ];

  useEffect(() => {
    const container = containerRef.current;
    const title = titleRef.current;
    const pathBrilhante = pathBrilhanteRef.current;

    const marker1 = marker1Ref.current;
    const marker2 = marker2Ref.current;
    const marker3 = marker3Ref.current;
    const marker4 = marker4Ref.current;

    const card1 = card1Ref.current;
    const card2 = card2Ref.current;
    const card3 = card3Ref.current;
    const card4 = card4Ref.current;

    if (
      !container ||
      !title ||
      !pathBrilhante ||
      !marker1 ||
      !marker2 ||
      !marker3 ||
      !marker4 ||
      !card1 ||
      !card2 ||
      !card3 ||
      !card4
    )
      return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      // Medição dinâmica do comprimento do path brilhante para sincronia perfeita e sem fantasmas
      const pathLength = pathBrilhante.getTotalLength();

      // Estado Inicial: Cabeçalho, marcadores e cartões invisíveis e ligeiramente deslocados no desktop
      gsap.set(title, { opacity: 0, y: 40 });
      gsap.set(pathBrilhante, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength
      });
      gsap.set([marker1, marker2, marker3, marker4], { opacity: 0, scale: 0.5 });
      gsap.set([card1, card3], { opacity: 0, scale: 0.93, x: -35 }); // cartões da esquerda
      gsap.set([card2, card4], { opacity: 0, scale: 0.93, x: 35 });  // cartões da direita

      // 1. Animação de Entrada do Cabeçalho da Seção por Scroll
      gsap.to(title, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container,
          start: "top 95%",
          end: "top 45%",
          scrub: 1,
        }
      });

      // 2. Timeline com ScrollTrigger de Scrub para desenhar a linha senoidal e carregar os cards síncronos
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 55%",       // Inicia o desenho quando a timeline aponta no meio-inferior da tela
          end: "bottom 80%",      // Finaliza o desenho completo
          scrub: 1.2,             // Rolagem ultra suave e cadenciada
        }
      });

      // Mapeamento de Luxo de Sincronia Cronológica:
      // O comprimento do path do SVG senoidal de viewBox 0 0 100 1200 é medido dinamicamente.
      // Usamos frações do comprimento real para garantir 100% de precisão de preenchimento
      // e evitar qualquer repetição de tracejado ou cores surgindo no rodapé prematuramente:

      // Passo 1: Desenha a linha curvando até o centro do Card 1 na esquerda (y = 145, que representa ~12.08% da extensão do path)
      tl.to(pathBrilhante, { strokeDashoffset: pathLength * (1 - 0.1208), duration: 1.0, ease: "none" })
        .to(marker1, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.6)" }, "-=0.3")
        .to(card1, { opacity: 1, scale: 1, x: 0, duration: 0.55, ease: "power2.out" }, "-=0.2")
        
      // Passo 2: Continua a linha senoidal e vai até o centro do Card 2 na direita (y = 455, que representa ~37.92% da extensão do path)
        .to(pathBrilhante, { strokeDashoffset: pathLength * (1 - 0.3792), duration: 1.3, ease: "none" })
        .to(marker2, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.6)" }, "-=0.3")
        .to(card2, { opacity: 1, scale: 1, x: 0, duration: 0.55, ease: "power2.out" }, "-=0.2")

      // Passo 3: Continua a linha e curva até o centro do Card 3 na esquerda (y = 765, que representa ~63.75% da extensão do path)
        .to(pathBrilhante, { strokeDashoffset: pathLength * (1 - 0.6375), duration: 1.3, ease: "none" })
        .to(marker3, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.6)" }, "-=0.3")
        .to(card3, { opacity: 1, scale: 1, x: 0, duration: 0.55, ease: "power2.out" }, "-=0.2")

      // Passo 4: Continua a linha e serpenteia até o centro do Card 4 na direita (y = 1075, que representa ~89.58% da extensão do path)
        .to(pathBrilhante, { strokeDashoffset: pathLength * (1 - 0.8958), duration: 1.3, ease: "none" })
        .to(marker4, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.6)" }, "-=0.3")
        .to(card4, { opacity: 1, scale: 1, x: 0, duration: 0.55, ease: "power2.out" }, "-=0.2")

      // Passo final: A linha brilhante termina no centro inferior da timeline (Y=1200, 100% da extensão)
        .to(pathBrilhante, { strokeDashoffset: 0, duration: 0.5, ease: "none" });
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="timeline"
      className="relative w-full py-32 px-6 md:px-12 z-10 overflow-hidden border-t border-zinc-200/50 dark:border-zinc-900/60 bg-transparent transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <div ref={titleRef} className="text-center max-w-3xl mx-auto mb-28">
          <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-[#1a6bcc] mb-4">
            Como a Vizoor está crescendo
          </h2>
          <h3 className="text-3xl sm:text-5xl font-medium tracking-tight text-zinc-900 dark:text-white leading-tight transition-colors duration-500">
            Nossa jornada de exploração
            <br />
            <span className="bg-gradient-to-r from-cyan-600 via-blue-500 to-purple-600 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-400 bg-clip-text text-transparent font-bold">
              e parceria.
            </span>
          </h3>
        </div>

        {/* Linha do Tempo */}
        <div className="relative max-w-5xl mx-auto">
          
          {/* ─── DESKTOP: Linha Curva Senoidal Serpenteante (SVG) ─── */}
          {/* Linha Curva de Fundo Escura */}
          <svg
            viewBox="0 0 100 1200"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-[calc(100%-32px)] top-4 bottom-4 z-0 pointer-events-none hidden md:block transition-colors duration-500"
          >
            <path
              d="M50,0 C35,40 22.5,80 22.5,145 C22.5,210 35,250 50,300 C65,350 77.5,390 77.5,455 C77.5,520 65,560 50,610 C35,660 22.5,700 22.5,765 C22.5,830 35,870 50,920 C65,970 77.5,1010 77.5,1075 C77.5,1140 65,1180 50,1200"
              fill="none"
              stroke="currentColor"
              vectorEffect="non-scaling-stroke"
              className="text-zinc-200 dark:text-zinc-900 transition-colors duration-500"
              strokeWidth="1.5"
            />
          </svg>

          {/* Linha Curva de Progresso Brilhante */}
          <svg
            viewBox="0 0 100 1200"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-[calc(100%-32px)] top-4 bottom-4 z-10 pointer-events-none hidden md:block"
          >
            <defs>
              <linearGradient id="timelineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
            <path
              ref={pathBrilhanteRef}
              d="M50,0 C35,40 22.5,80 22.5,145 C22.5,210 35,250 50,300 C65,350 77.5,390 77.5,455 C77.5,520 65,560 50,610 C35,660 22.5,700 22.5,765 C22.5,830 35,870 50,920 C65,970 77.5,1010 77.5,1075 C77.5,1140 65,1180 50,1200"
              fill="none"
              stroke="url(#timelineGradient)"
              vectorEffect="non-scaling-stroke"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="4000"
              strokeDashoffset="4000"
              className="drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
            />
          </svg>

          {/* ─── MOBILE: Linha Vertical Reta Clássica ─── */}
          {/* Linha Fundo Escura */}
          <div className="absolute left-6 -translate-x-1/2 top-4 bottom-4 w-[2px] bg-zinc-200 dark:bg-zinc-900 block md:hidden z-0 transition-colors duration-500" />
          
          {/* Linha Progresso Brilhante */}
          <motion.div
            style={{ height: lineHeightMobile }}
            className="absolute left-6 -translate-x-1/2 top-4 w-[2px] bg-gradient-to-b from-cyan-500 via-blue-500 to-purple-500 block md:hidden z-10 origin-top shadow-[0_0_8px_rgba(34,211,238,0.4)]"
          />

          {/* Itens */}
          <div className="relative z-10">
            {items.map((item, index) => {
              const markerRef = 
                index === 0 ? marker1Ref :
                index === 1 ? marker2Ref :
                index === 2 ? marker3Ref :
                marker4Ref;

              const cardRef = 
                index === 0 ? card1Ref :
                index === 1 ? card2Ref :
                index === 2 ? card3Ref :
                card4Ref;

              return (
                <TimelineItem
                  key={index}
                  index={index}
                  year={item.year}
                  title={item.title}
                  description={item.description}
                  icon={item.icon}
                  markerRef={markerRef}
                  cardRef={cardRef}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

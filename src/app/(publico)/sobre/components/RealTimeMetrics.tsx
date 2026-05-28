"use client";

import React, { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { Map, Compass, Users, PiggyBank } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface CounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
}

function AnimatedCounter({ value, suffix = "", prefix = "" }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 45,
    stiffness: 150,
    mass: 0.8,
  });

  useEffect(() => {
    if (inView) {
      motionValue.set(value);
    }
  }, [inView, value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = prefix + Math.floor(latest).toLocaleString("pt-BR") + suffix;
      }
    });
  }, [springValue, suffix, prefix]);

  return <span ref={ref} className="font-sans font-extrabold tracking-tighter" />;
}

export default function RealTimeMetrics() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const card4Ref = useRef<HTMLDivElement>(null);

  const metrics = [
    {
      id: "cities",
      title: "Cidades exploradas",
      value: 150,
      suffix: "+",
      prefix: "",
      description: "Municípios mapeados ativamente por quem realmente conhece os melhores pontos.",
      icon: Map,
      color: "from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-500",
    },
    {
      id: "experiences",
      title: "Lugares cadastrados",
      value: 25400,
      suffix: "+",
      prefix: "",
      description: "Restaurantes, cafeterias, hotéis e segredos locais para você conhecer.",
      icon: Compass,
      color: "from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500",
    },
    {
      id: "creators",
      title: "Criadores de confiança",
      value: 1250,
      suffix: "+",
      prefix: "",
      description: "Moradores reais compartilhando experiências sinceras e roteiros bacanas.",
      icon: Users,
      color: "from-purple-600 to-emerald-600 dark:from-purple-500 dark:to-emerald-500",
    },
    {
      id: "savings",
      title: "Benefícios aproveitados",
      value: 1840000,
      suffix: "+",
      prefix: "R$ ",
      description: "Economia real gerada nas saídas e economizada diretamente nos caixas locais.",
      icon: PiggyBank,
      color: "from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400",
    },
  ];

  useEffect(() => {
    const container = containerRef.current;
    const trigger = triggerRef.current;
    const title = titleRef.current;
    const card1 = card1Ref.current;
    const card2 = card2Ref.current;
    const card3 = card3Ref.current;
    const card4 = card4Ref.current;

    if (!container || !trigger || !title || !card1 || !card2 || !card3 || !card4) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      // Estado Inicial: Título e cards ocultos abaixo para revelação por scroll no desktop
      gsap.set(title, { opacity: 0, y: 40 });
      gsap.set(card1, { opacity: 0, y: 40 });
      gsap.set(card2, { opacity: 0, y: 40 });
      gsap.set(card3, { opacity: 0, y: 40 });
      gsap.set(card4, { opacity: 0, y: 40 });

      // 1. ScrollTrigger independente para revelar o Título dinamicamente à medida que a seção ENTRA na tela por baixo
      gsap.to(title, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power1.out",
        scrollTrigger: {
          trigger: container,
          start: "top 95%",    // Inicia a aparição bem no início, quando o topo da seção aponta no rodapé da janela
          end: "top 30%",      // Finaliza o fade-in e estabiliza 100% sólido bem antes de travar no topo
          scrub: 1,            // Acompanhamento ultra suave de rolagem física
        }
      });

      // 2. Timeline com Pinning para a revelação sequencial e cadenciada dos cards
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",      // Fixa a seção na tela quando o topo se alinha com o topo da viewport
          end: "bottom bottom",  // Solta a seção quando a rolagem da pista (220vh) acaba
          scrub: 1.2,            // Scroll suave amortecido
          pin: trigger,          // Prende a div viewport
        }
      });

      // Como o título já estará 100% nítido, sólido e fixo quando a tela travar,
      // a timeline inicia imediatamente a materialização sequencial dos cards abaixo dele:
      tl.to(card1, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
        .to({}, { duration: 0.2 })  // Pausa de rolagem

        .to(card2, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
        .to({}, { duration: 0.2 })  // Pausa de rolagem

        .to(card3, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
        .to({}, { duration: 0.2 })  // Pausa de rolagem

        .to(card4, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
        .to({}, { duration: 0.5 }); // Pausa final de leitura
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="metricas"
      className="relative w-full lg:h-[220vh] bg-transparent border-t border-zinc-200/50 dark:border-zinc-900/60 transition-colors duration-500 z-10"
    >
      {/* Contêiner Sticky Interno que permanece preso na tela (Viewport h-screen) */}
      <div
        ref={triggerRef}
        className="w-full lg:h-screen lg:sticky lg:top-0 flex flex-col justify-start pt-24 lg:pt-32 px-6 md:px-12 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto w-full">
          {/* Cabeçalho */}
          <div ref={titleRef} className="text-center max-w-3xl mx-auto mb-10 lg:mb-12">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-[#1a6bcc] mb-4">
              Nossa comunidade exploradora
            </h2>
            <h3 className="text-3xl sm:text-5xl font-medium tracking-tight text-zinc-900 dark:text-white leading-tight transition-colors duration-500">
              Milhares de pessoas descobrindo
              <br />
              <span className="bg-gradient-to-r from-cyan-600 via-blue-500 to-purple-600 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-400 bg-clip-text text-transparent font-bold">
                lugares reais todos os dias.
              </span>
            </h3>
            <p className="text-xs font-light text-zinc-550 dark:text-zinc-550 mt-6 max-w-xl mx-auto leading-relaxed transition-colors duration-500">
              Mais do que rolar o feed, incentivamos você a sair de casa, viver novas histórias e apoiar o comércio do seu bairro.
            </p>
          </div>

          {/* Grade de Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              const cardRef = 
                index === 0 ? card1Ref :
                index === 1 ? card2Ref :
                index === 2 ? card3Ref :
                card4Ref;

              return (
                <div
                  ref={cardRef}
                  key={metric.id}
                  className="relative p-8 rounded-3xl bg-white/80 dark:bg-zinc-900/10 border border-zinc-200 dark:border-zinc-900/80 backdrop-blur-xl flex flex-col justify-between shadow-sm hover:border-zinc-300 dark:hover:border-zinc-800/80 transition-all duration-300 group"
                >
                  {/* Linha Fina Brilhante no Topo */}
                  <div className={`absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r ${metric.color} opacity-40 dark:opacity-30 group-hover:opacity-80 dark:group-hover:opacity-60 transition-opacity`} />

                  <div className="space-y-6">
                    {/* Ícone */}
                    <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-900 flex items-center justify-center text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors duration-500">
                      <Icon className="w-4.5 h-4.5" />
                    </div>

                    {/* Número Animado */}
                    <div className="space-y-1">
                      <div className={`text-4xl md:text-5xl font-black bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`}>
                        <AnimatedCounter value={metric.value} suffix={metric.suffix} prefix={metric.prefix} />
                      </div>
                      <h4 className="text-sm font-bold text-zinc-850 dark:text-white tracking-wide transition-colors duration-500">{metric.title}</h4>
                    </div>
                  </div>

                  {/* Descrição */}
                  <p className="text-[11px] leading-relaxed font-light text-zinc-500 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-400 transition-colors duration-300 mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-900/50">
                    {metric.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Utensils, Home, Compass, Coffee, ShoppingBag, ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registra o ScrollTrigger de forma segura para Next.js no lado do cliente
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface CategoryCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  innerRef?: React.Ref<HTMLDivElement>;
}

function CategoryCard({ title, description, icon: Icon, color, innerRef }: CategoryCardProps) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={innerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative h-[208px] rounded-3xl bg-white/80 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-900/80 backdrop-blur-xl overflow-hidden p-6 flex flex-col justify-between group transition-all duration-500 hover:border-zinc-300 dark:hover:border-zinc-800 shadow-sm hover:shadow-md dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.01)] cursor-pointer"
    >
      {/* Efeito Spotlight de Gradiente Radial que Acompanha o Mouse */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          opacity: isHovered ? 0.85 : 0,
          background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, ${color}15, transparent 80%)`,
        }}
      />

      {/* Círculo do Brilho de Borda no Hover */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 border border-transparent rounded-3xl"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(200px circle at ${coords.x}px ${coords.y}px, ${color}30, transparent 60%)`,
          WebkitMaskImage: "linear-gradient(white, white) content-box, linear-gradient(white, white)",
          WebkitMaskComposite: "destination-out",
          maskComposite: "exclude",
        }}
      />

      {/* Topo do Card: Ícone e Categoria */}
      <div className="space-y-3 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-900 flex items-center justify-center text-zinc-400 transition-colors duration-500 group-hover:text-zinc-900 dark:group-hover:text-white">
          <Icon className="w-4.5 h-4.5 transition-transform duration-500 group-hover:scale-110" />
        </div>

        <div className="space-y-1">
          <h4 className="text-base font-bold text-zinc-900 dark:text-white tracking-tight transition-colors duration-500">{title}</h4>
          <p className="text-xs font-light text-zinc-650 dark:text-zinc-400 leading-relaxed line-clamp-2 transition-colors duration-500">
            {description}
          </p>
        </div>
      </div>

      {/* Rodapé do Card: Ação Simples */}
      <div className="flex items-center justify-between text-xs font-bold text-zinc-400 dark:text-zinc-500 transition-colors duration-500 group-hover:text-zinc-950 dark:group-hover:text-white relative z-10 pt-2 border-t border-zinc-100 dark:border-zinc-900/50">
        <span>Explorar Categoria</span>
        <ArrowRight className="w-4 h-4 transition-transform duration-500 -translate-x-1 group-hover:translate-x-0" />
      </div>
    </div>
  );
}

export default function CategoryGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const card4Ref = useRef<HTMLDivElement>(null);
  const card5Ref = useRef<HTMLDivElement>(null);
  const card6Ref = useRef<HTMLDivElement>(null);

  const categories = [
    {
      title: "Alimentação & Gastronomia",
      description: "Restaurantes acolhedores, bistrôs românticos e hamburguerias de bairro testadas e recomendadas por exploradores reais.",
      icon: Utensils,
      color: "#22d3ee", // ciano
    },
    {
      title: "Hospedagens & Pousadas",
      description: "Pousadas aconchegantes na serra, hotéis charmosos de fim de semana e estadias únicas para recarregar as energias.",
      icon: Home,
      color: "#a855f7", // roxo
    },
    {
      title: "Atrações & Lazer",
      description: "Pontos turísticos escondidos, eventos locais, parques para passar a tarde e experiências urbanas ricas.",
      icon: Compass,
      color: "#3b82f6", // azul royal
    },
    {
      title: "Cafés & Cafeterias",
      description: "Cafés charmosos para ler um livro, padarias artesanais com pães quentinhos e docerias irresistíveis.",
      icon: Coffee,
      color: "#eab308", // amarelo
    },
    {
      title: "Lojas & Comércio Local",
      description: "Lojas de conceito local, marcas independentes e pequenos comércios de bairro que merecem sua visita.",
      icon: ShoppingBag,
      color: "#10b981", // verde/esmeralda
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
    const card5 = card5Ref.current;
    const card6 = card6Ref.current;

    if (!container || !trigger || !title || !card1 || !card2 || !card3 || !card4 || !card5 || !card6) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      // Estado Inicial: Título e cards ocultos abaixo para revelação por scroll no desktop
      gsap.set(title, { opacity: 0, y: 40 });
      gsap.set(card1, { opacity: 0, y: 40 });
      gsap.set(card2, { opacity: 0, y: 40 });
      gsap.set(card3, { opacity: 0, y: 40 });
      gsap.set(card4, { opacity: 0, y: 40 });
      gsap.set(card5, { opacity: 0, y: 40 });
      gsap.set(card6, { opacity: 0, y: 40 });

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

      // 2. Timeline com Pinning focada puramente no surgimento sequencial dos cards
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",      // Fixa a seção na tela quando o topo se alinha com o topo da viewport
          end: "bottom bottom",  // Solta a seção quando a rolagem da pista (240vh) acaba
          scrub: 1.2,            // Scroll suave amortecido
          pin: trigger,          // Prende a div viewport
        }
      });

      // Como o título já estará 100% nítido, sólido e fixo quando a tela travar,
      // a timeline inicia imediatamente a materialização sequencial dos cards abaixo dele:
      tl.to(card1, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
        .to({}, { duration: 0.15 })

        .to(card2, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
        .to({}, { duration: 0.15 })

        .to(card3, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
        .to({}, { duration: 0.2 })

        .to(card4, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
        .to({}, { duration: 0.15 })

        .to(card5, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
        .to({}, { duration: 0.15 })

        .to(card6, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
        .to({}, { duration: 0.5 }); // Pausa final para visualização de tudo sólido
    });

    return () => {
      mm.revert(); // Restaura o layout em redimensionamentos ou desmontagem do componente
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="categorias"
      className="relative w-full lg:h-[240vh] bg-transparent border-t border-zinc-200/50 dark:border-zinc-900/60 transition-colors duration-500 z-10"
    >
      {/* Contêiner Sticky Interno que permanece preso na tela (Viewport h-screen) */}
      <div
        ref={triggerRef}
        className="w-full lg:h-screen lg:sticky lg:top-0 flex flex-col justify-start pt-24 lg:pt-32 px-6 md:px-12 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto w-full">
          {/* Título */}
          <div ref={titleRef} className="max-w-3xl mb-8 lg:mb-12 text-left">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-[#1a6bcc] mb-4">
              Lugares que você vai amar explorar
            </h2>
            <h3 className="text-3xl sm:text-5xl font-medium tracking-tight text-zinc-900 dark:text-white leading-tight transition-colors duration-500">
              Descubra lugares incríveis através de
              <br />
              <span className="bg-gradient-to-r from-cyan-600 via-blue-500 to-purple-600 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-400 bg-clip-text text-transparent font-bold">
                pessoas reais.
              </span>
            </h3>
            <p className="text-xs font-light text-zinc-550 dark:text-zinc-500 mt-6 max-w-xl leading-relaxed transition-colors duration-500">
              Navegue por um mapa completo alimentado pelas recomendações autênticas de criadores locais. Encontre os cantos mais legais e aproveite benefícios exclusivos.
            </p>
          </div>

          {/* Grade de Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, index) => {
              const cardRef = 
                index === 0 ? card1Ref :
                index === 1 ? card2Ref :
                index === 2 ? card3Ref :
                index === 3 ? card4Ref :
                card5Ref;

              return (
                <CategoryCard
                  key={index}
                  title={cat.title}
                  description={cat.description}
                  icon={cat.icon}
                  color={cat.color}
                  innerRef={cardRef}
                />
              );
            })}

            {/* Card de Fim Conceitual */}
            <div 
              ref={card6Ref}
              className="relative h-[208px] rounded-3xl bg-gradient-to-br from-zinc-50 to-zinc-100/50 dark:from-zinc-900/10 dark:to-zinc-900/30 border border-dashed border-zinc-200 dark:border-zinc-800/80 p-6 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 group"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200/60 dark:bg-zinc-950/50 dark:border-zinc-900 flex items-center justify-center text-zinc-400 dark:text-zinc-650">
                  <span className="material-symbols-outlined text-[18px] font-bold text-cyan-500 animate-pulse">add_circle</span>
                </div>
                <h4 className="text-base font-bold text-zinc-800 dark:text-zinc-300 transition-colors duration-500">Quer indicar um lugar?</h4>
                <p className="text-xs font-light text-zinc-500 dark:text-zinc-500 leading-relaxed line-clamp-2 transition-colors duration-500">
                  Você conhece um lugar incrível? Quer crescer como criador local ou atrair clientes? Junte-se a nós.
                </p>
              </div>
              <Link
                href="/cadastro"
                className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors flex items-center gap-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-900/50"
              >
                Falar com a Comunidade
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

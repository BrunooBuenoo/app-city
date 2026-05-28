"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Server, Compass, ArrowRight, CheckCircle2, MessageSquarePlus, Store } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registra o ScrollTrigger de forma segura para Next.js no lado do cliente
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ConnectedCity() {
  const [activeStep, setActiveStep] = useState(0);

  // Referências para a orquestração do scroll pinning do GSAP
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

  const steps = [
    {
      id: 0,
      title: "1. Criadores indicam lugares",
      description: "Criadores locais apaixonados postam vídeos, roteiros e dicas autênticas das suas cafeterias, restaurantes e pousadas favoritas com vantagens exclusivas.",
      icon: MessageSquarePlus,
      color: "from-cyan-400 to-blue-500",
      accent: "text-cyan-600 dark:text-cyan-400",
    },
    {
      id: 1,
      title: "2. Você descobre no mapa",
      description: "Explore o mapa para encontrar novos cantos no seu bairro ou planejar seu próximo passeio, salvando os seus lugares favoritos em listas para quando for sair.",
      icon: Compass,
      color: "from-blue-500 to-purple-500",
      accent: "text-blue-600 dark:text-blue-400",
    },
    {
      id: 2,
      title: "3. Viva a cidade de verdade",
      description: "Visite os lugares no mundo real, desfrute de novas experiências presenciais, resgate os seus benefícios direto no caixa e apoie o comércio local.",
      icon: Store,
      color: "from-purple-500 to-emerald-500",
      accent: "text-purple-600 dark:text-purple-400",
    },
  ];

  useEffect(() => {
    const container = containerRef.current;
    const trigger = triggerRef.current;
    const title = titleRef.current;
    const panel = panelRef.current;
    const card1 = card1Ref.current;
    const card2 = card2Ref.current;
    const card3 = card3Ref.current;

    if (!container || !trigger || !title || !panel || !card1 || !card2 || !card3) return;

    // Usamos gsap.matchMedia para desativar o pinning e ocultações no mobile,
    // garantindo que o layout seja exibido de forma estática convencional e acessível em celulares/tablets.
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      // Estado Inicial: Elementos totalmente ocultos para o início vazio da rolagem no desktop
      gsap.set(title, { opacity: 0, y: 40 });
      gsap.set(card1, { opacity: 0, y: 40 });
      gsap.set(card2, { opacity: 0, y: 40 });
      gsap.set(card3, { opacity: 0, y: 40 });
      gsap.set(panel, { opacity: 0, scale: 0.95 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",      // Fixa a seção quando o topo alinha com o topo da tela
          end: "bottom bottom",  // Solta a seção quando a rolagem da pista (280vh) acaba
          scrub: 1.2,            // Acompanhamento suave e amortecido de scroll
          pin: trigger,          // Prende a div de viewport interna na tela
          onUpdate: (self) => {
            const prog = self.progress;
            // Sincroniza dinamicamente o passo ativo do simulador da direita baseado nas etapas de revelação
            if (prog < 0.28) {
              setActiveStep(0);
            } else if (prog >= 0.28 && prog < 0.58) {
              setActiveStep(1);
            } else {
              setActiveStep(2);
            }
          }
        }
      });

      // 1. Primeiramente surge o TÍTULO (suave e elegante)
      tl.to(title, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })
        .to({}, { duration: 0.3 }) // Pausa de estabilidade

      // 2. Surge o PRIMEIRO CARD
        .to(card1, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })
        .to({}, { duration: 0.3 })

      // 3. Surge o SEGUNDO CARD (fica abaixo do primeiro, mantendo o primeiro 100% visível)
        .to(card2, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })
        .to({}, { duration: 0.3 })

      // 4. Surge o TERCEIRO CARD (fica abaixo dos dois primeiros, mantendo todos 100% visíveis)
        .to(card3, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })
        .to({}, { duration: 0.4 }) // Pausa maior antes de revelar o painel

      // 5. Após surgir todos os cards, surge o SIMULADOR DA DIREITA com suas animações internas
        .to(panel, { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" })
        .to({}, { duration: 0.6 }); // Pausa de finalização para leitura de tudo sólido
    });

    return () => {
      mm.revert(); // Limpa e restaura 100% do layout original sem efeitos colaterais
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="cidade-conectada"
      className="relative w-full lg:h-[280vh] bg-transparent border-t border-zinc-200/50 dark:border-zinc-900/60 transition-colors duration-500 z-10"
    >
      {/* Contêiner Sticky Interno que permanece preso na tela (Viewport h-screen) */}
      <div
        ref={triggerRef}
        className="w-full lg:h-screen lg:sticky lg:top-0 flex flex-col justify-center px-6 md:px-12 py-32 lg:py-0 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto w-full">
          {/* Título de Introdução */}
          <div ref={titleRef} className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-[#1a6bcc] mb-4">
              Como a comunidade se conecta
            </h2>
            <h3 className="text-3xl sm:text-5xl font-medium tracking-tight text-zinc-900 dark:text-white leading-tight transition-colors duration-500">
              Como a Vizoor funciona
              <br />
              <span className="bg-gradient-to-r from-cyan-600 via-blue-500 to-purple-600 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-400 bg-clip-text text-transparent font-bold">
                para você.
              </span>
            </h3>
          </div>

          {/* Layout de Duas Colunas */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Coluna Esquerda: Fluxo de Passos Interativos (Cards Sequenciais de Cima para Baixo) */}
            <div className="lg:col-span-5 relative w-full space-y-6">
              {steps.map((step) => {
                const Icon = step.icon;
                const isActive = activeStep === step.id;
                // O card é considerado sólido se ele já foi revelado pelo progresso do scroll
                const isSolid = activeStep >= step.id;

                return (
                  <div
                    key={step.id}
                    ref={step.id === 0 ? card1Ref : step.id === 1 ? card2Ref : card3Ref}
                    onClick={() => {
                      // Clique interativo convencional no mobile
                      if (typeof window !== "undefined" && window.innerWidth < 1024) {
                        setActiveStep(step.id);
                      }
                    }}
                    className={`p-6 rounded-2xl border transition-all duration-500 cursor-pointer select-none group w-full overflow-hidden relative ${
                      isSolid
                        ? "bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
                        : "bg-transparent border-transparent lg:bg-white/40 lg:dark:bg-zinc-900/10 lg:border-zinc-200/50 lg:dark:border-zinc-900/40 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/10"
                    }`}
                  >
                    {/* Linha Lateral de Progresso */}
                    {isActive && (
                      <motion.div
                        layoutId="activeStepBorder"
                        className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-cyan-500 to-purple-500 dark:from-cyan-400 dark:to-purple-500"
                      />
                    )}

                    <div className="flex gap-4 items-start">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500 ${
                          isSolid
                            ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                            : "bg-zinc-200/30 dark:bg-zinc-900/30 border-zinc-200/50 dark:border-zinc-800/50 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-650 dark:group-hover:text-zinc-300"
                        }`}
                      >
                        <Icon className={`w-5 h-5 transition-colors duration-500 ${isActive ? step.accent : (isSolid ? "text-zinc-700 dark:text-zinc-300" : "")}`} />
                      </div>

                      <div className="flex-1">
                        <h4
                          className={`text-base font-bold transition-colors duration-300 ${
                            isSolid ? "text-zinc-900 dark:text-white" : "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-650 dark:group-hover:text-zinc-300"
                          }`}
                        >
                          {step.title}
                        </h4>
                        <p
                          className={`text-xs leading-relaxed font-light mt-2 transition-opacity duration-500 ${
                            isSolid ? "text-zinc-600 dark:text-zinc-300 opacity-100" : "text-zinc-450 dark:text-zinc-500 opacity-60 group-hover:opacity-80"
                          }`}
                        >
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Coluna Direita: Painel Gráfico de Simulação de Fluxo de Dados */}
            <div ref={panelRef} className="lg:col-span-7 flex justify-center w-full">
              <div className="relative w-full max-w-[550px] aspect-[4/3] bg-white/70 dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-900/80 rounded-3xl backdrop-blur-md overflow-hidden p-8 flex items-center justify-center shadow-md dark:shadow-[inset_0_2px_4px_rgba(255,255,255,0.02)] transition-colors duration-500">
                
                {/* Luz Ambiente Interna */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none" />

                {/* Animação do Circuito Interativo */}
                <div className="relative w-full h-full flex items-center justify-between">
                  
                  {/* Nó A: Criador */}
                  <div className="flex flex-col items-center gap-3 relative z-10">
                    <motion.div
                      animate={
                        activeStep === 0
                          ? { scale: [1, 1.15, 1], borderColor: "#3b82f6" }
                          : { scale: 1, borderColor: "#e2e8f0" }
                      }
                      transition={{ repeat: activeStep === 0 ? Infinity : 0, duration: 2 }}
                      className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shadow-md dark:shadow-lg transition-colors duration-500"
                    >
                      <User className={`w-6 h-6 ${activeStep === 0 ? "text-cyan-500 dark:text-cyan-400" : "text-zinc-400 dark:text-zinc-500"}`} />
                    </motion.div>
                    <span className="text-[10px] font-bold tracking-wider text-zinc-500 dark:text-zinc-400">Criadores Locais</span>
                  </div>

                  {/* Fluxos Luminosos Centrais */}
                  <div className="absolute inset-x-16 top-1/2 -translate-y-1/2 h-[2px] bg-zinc-100 dark:bg-zinc-900 z-0">
                    {/* Linhas de Fluxo de Luzes com framer-motion */}
                    <AnimatePresence mode="wait">
                      {activeStep === 0 && (
                        <motion.div
                          key="flow-1"
                          initial={{ left: "0%" }}
                          animate={{ left: "100%" }}
                          exit={{ opacity: 0 }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                          className="absolute top-1/2 -translate-y-1/2 w-16 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
                        />
                      )}
                      {activeStep === 1 && (
                        <motion.div
                          key="flow-2"
                          initial={{ scale: [0.95, 1.05, 0.95] }}
                          animate={{ scale: [0.95, 1.1, 0.95] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/20 to-purple-500/10 dark:from-cyan-400/20 dark:via-blue-500/30 dark:to-purple-500/20 blur-sm rounded-full"
                        />
                      )}
                      {activeStep === 2 && (
                        <motion.div
                          key="flow-3"
                          initial={{ right: "0%" }}
                          animate={{ right: "100%" }}
                          exit={{ opacity: 0 }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                          className="absolute top-1/2 -translate-y-1/2 w-16 h-[2px] bg-gradient-to-l from-transparent via-emerald-500 to-transparent"
                        />
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Nó B: Core Vizoor */}
                  <div className="flex flex-col items-center gap-3 relative z-10">
                    <motion.div
                      animate={
                        activeStep === 1
                          ? { rotate: 360, borderColor: "#3b82f6" }
                          : { rotate: 0, borderColor: "#e2e8f0" }
                      }
                      transition={{
                        rotate: { repeat: activeStep === 1 ? Infinity : 0, duration: 10, ease: "linear" },
                        borderColor: { duration: 0.5 },
                      }}
                      className="w-20 h-20 rounded-full bg-white dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 flex items-center justify-center shadow-lg dark:shadow-[0_0_30px_rgba(0,0,0,0.8)] relative transition-colors duration-500"
                    >
                      <Server className={`w-8 h-8 ${activeStep === 1 ? "text-blue-500 dark:text-blue-400" : "text-zinc-400 dark:text-zinc-500"}`} />
                      
                      {/* Luzes Pulsantes de Processamento */}
                      {activeStep === 1 && (
                        <div className="absolute inset-0 rounded-full border-2 border-blue-500 animate-ping opacity-25" />
                      )}
                    </motion.div>
                    <span className="text-[10px] font-bold tracking-wider text-zinc-500 dark:text-zinc-400">Vizoor Core</span>
                  </div>

                  {/* Nó C: Estabelecimento Físico */}
                  <div className="flex flex-col items-center gap-3 relative z-10">
                    <motion.div
                      animate={
                        activeStep === 2
                          ? { scale: [1, 1.15, 1], borderColor: "#10b981" }
                          : { scale: 1, borderColor: "#e2e8f0" }
                      }
                      transition={{ repeat: activeStep === 2 ? Infinity : 0, duration: 2 }}
                      className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shadow-md dark:shadow-lg transition-colors duration-500"
                    >
                      {activeStep === 2 ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
                      ) : (
                        <Store className="w-6 h-6 text-zinc-400 dark:text-zinc-500" />
                      )}
                    </motion.div>
                    <span className="text-[10px] font-bold tracking-wider text-zinc-500 dark:text-zinc-400">Mundo Real</span>
                  </div>

                </div>

                {/* Banner de Feedback Interno */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white dark:bg-zinc-900/90 border border-zinc-150 dark:border-zinc-800/60 shadow-md flex items-center justify-between text-xs transition-colors duration-500">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      activeStep === 0 ? "bg-cyan-500 dark:bg-cyan-400 animate-pulse" :
                      activeStep === 1 ? "bg-blue-500 dark:bg-blue-400 animate-pulse" :
                      "bg-emerald-500 dark:bg-emerald-400 animate-pulse"
                    }`} />
                    <span className="text-zinc-500 dark:text-zinc-400 font-light">Comunidade em Ação:</span>
                    <span className="text-zinc-900 dark:text-white font-bold">
                      {activeStep === 0 ? "Criador Postando" :
                       activeStep === 1 ? "Lugares no Mapa" :
                       "Visita Presencial"}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

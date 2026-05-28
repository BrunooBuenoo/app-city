"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Quote } from "lucide-react";

interface WordProps {
  children: string;
  progress: any;
  range: [number, number];
}

function Word({ children, progress, range }: WordProps) {
  // A opacidade muda de forma contínua e suave de acordo com o scroll daquela palavra.
  // Começa em 0.0 (totalmente invisível para as palavras mais abaixo) e vai até 1.0 (sólido completo).
  // IMPORTANTE: Removemos transições de CSS deste elemento para permitir que o Framer Motion atualize a opacidade a 120 FPS sem lag.
  const opacity = useTransform(progress, range, [0, 1]);
  
  return (
    <motion.span 
      style={{ opacity }} 
      className="text-zinc-950 dark:text-white font-sans font-medium mr-2 md:mr-3.5 my-0.5 md:my-1 inline-block"
    >
      {children}
    </motion.span>
  );
}

export default function Manifesto() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Captura o progresso de rolagem de forma natural (sem travar a tela).
  // Começa a revelar quando o topo da seção chega em 80% da viewport e termina quando chega em 20%.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"],
  });

  const text = 
    "Acreditamos que uma cidade não é feita apenas de ruas e prédios. Ela é feita de pessoas, de risadas ao redor de uma mesa de café, de tardes ensolaradas no parque e daquela atração escondida que só quem mora ali conhece. Passamos muito tempo rolando feeds e assistindo a viagens pelas telas, enquanto a vida de verdade acontece lá fora. A Vizoor nasceu para ajudar você a viver a cidade de verdade. Juntamos pessoas apaixonadas por explorar com os melhores estabelecimentos locais. Do restaurante de massas da esquina à pousada charmosa de fim de semana, transformamos criadores locais em guias de confiança. Tudo isso em um mapa vivo, para que você salve seus favoritos, apoie o comércio do seu bairro e encontre lugares que realmente valem a visita. Desligue as telas e venha descobrir.";
  
  const words = text.split(" ");
  const totalWords = words.length;

  return (
    <section
      ref={containerRef}
      id="manifesto"
      className="relative w-full flex flex-col justify-start items-center px-6 md:px-12 py-32 md:py-48 z-10 bg-transparent"
    >
      {/* Elementos visuais de conexão no topo */}
      <div className="absolute top-0 w-[1px] h-24 bg-gradient-to-b from-[#1a6bcc] to-transparent opacity-40 dark:opacity-60" />

      {/* Ícone de Destaque com animação suave */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.8, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-11 h-11 rounded-2xl bg-white border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800/80 flex items-center justify-center mb-6 shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-colors duration-500"
      >
        <Quote className="w-4.5 h-4.5 text-[#1a6bcc] dark:text-cyan-400" />
      </motion.div>

      {/* Título de seção sutil */}
      <h2 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[#1a6bcc] mb-8 select-none">
        Por que a Vizoor existe
      </h2>

      {/* Container de Texto Centralizado com Scroll Reveal Agressivo por Palavra */}
      <div className="max-w-5xl text-left md:text-center mt-2 px-2 md:px-6">
        <p className="text-xl sm:text-2xl md:text-[2.5rem] lg:text-[2.7rem] font-light leading-[1.4] tracking-tight flex flex-wrap justify-start md:justify-center">
          {words.map((word, index) => {
            // Distribuição do progresso otimizada para legibilidade:
            // O início do fade-in é distribuído de 0% a 68% do progresso de scroll da seção,
            // e cada palavra leva 8% para revelar. Isso garante que todo o manifesto esteja
            // 100% sólido e visível em 76% do scroll, bem antes de a última linha sair da tela.
            const start = (index / totalWords) * 0.68;
            const end = start + 0.08;
            
            return (
              <Word
                key={index}
                progress={scrollYProgress}
                range={[start, end]}
              >
                {word}
              </Word>
            );
          })}
        </p>
      </div>

      {/* Linha Inferior com Fim Gradual */}
      <div className="absolute bottom-0 w-[1px] h-24 bg-gradient-to-t from-[#1a6bcc]/40 to-transparent opacity-40 dark:opacity-60" />
    </section>
  );
}

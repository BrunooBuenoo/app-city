"use client";

import Link from "next/link";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Map, MapMarker, MarkerContent } from "@/components/ui/map";
import { MapPin, ThumbsUp, CheckCircle2, Trophy, Users, FileText, Flame, Eye, Shield, ShieldAlert, Award, PlusCircle } from "lucide-react";
import { type Reclamacao } from "@/services/firebase";
import { getCategoryByLabel } from "@/utils/categories";

// Patent ranks data (keep in sync with gamification.ts)
const RANKS_DISPLAY = [
  { level: 1, name: "Observador", icon: Eye, minXP: 0, color: "#94A3B8", gradient: "from-slate-200 to-slate-300", desc: "Comece participando. Crie sua primeira reclamação." },
  { level: 2, name: "Colaborador", icon: Users, minXP: 50, color: "#1a8ccc", gradient: "from-sky-200 to-blue-300", desc: "Concorde com reclamações e ajude a comunidade." },
  { level: 3, name: "Guardião", icon: Shield, minXP: 150, color: "#8B5CF6", gradient: "from-purple-200 to-violet-300", desc: "Sua participação ativa está fazendo diferença!" },
  { level: 4, name: "Protetor", icon: ShieldAlert, minXP: 400, color: "#F59E0B", gradient: "from-amber-200 to-yellow-300", desc: "Cidadão exemplar com grande impacto na cidade." },
  { level: 5, name: "Herói da Cidade", icon: Trophy, minXP: 1000, color: "#EF4444", gradient: "from-rose-200 to-red-300", desc: "O mais alto nível. Você é um verdadeiro herói!" },
];

const stats = [
  { label: "Cidadãos Ativos", value: "500+", icon: Users },
  { label: "Reclamações Registradas", value: "1.200+", icon: FileText },
  { label: "Problemas Resolvidos", value: "340+", icon: CheckCircle2 },
];

// Descobrir a região com mais reclamações (célula de grade geográfica mais densa)
const findDensestRegion = (recs: Reclamacao[]): [number, number] => {
  if (recs.length === 0) return [-49.9458, -22.2139]; // Centro padrão de Marília

  // Tamanho da grade (aprox. 1km x 1km)
  const gridSize = 0.01;
  const grid: Record<string, Reclamacao[]> = {};

  recs.forEach((rec) => {
    if (!rec.latitude || !rec.longitude) return;
    const latBin = Math.floor(rec.latitude / gridSize);
    const lngBin = Math.floor(rec.longitude / gridSize);
    const key = `${latBin},${lngBin}`;
    if (!grid[key]) grid[key] = [];
    grid[key].push(rec);
  });

  // Achar a célula com mais reclamações
  let densestKey = "";
  let maxCount = 0;

  Object.entries(grid).forEach(([key, list]) => {
    if (list.length > maxCount) {
      maxCount = list.length;
      densestKey = key;
    }
  });

  if (!densestKey) return [-49.9458, -22.2139];

  const densestList = grid[densestKey];
  // Tirar a média das coordenadas do cluster mais denso para achar o centroide
  const sumLat = densestList.reduce((sum, r) => sum + r.latitude, 0);
  const sumLng = densestList.reduce((sum, r) => sum + r.longitude, 0);
  return [sumLng / densestList.length, sumLat / densestList.length];
};

export default function Sobre() {
  const [reclamacoes, setReclamacoes] = useState<Reclamacao[]>([]);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/publico/mapa")
      .then((res) => res.json())
      .then((data) => {
        if (active && Array.isArray(data)) {
          setReclamacoes(data);
        }
      })
      .catch((err) => console.error("Erro ao carregar dados de mapa públicos:", err));

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    const preventScroll = (e: WheelEvent | TouchEvent) => {
      e.preventDefault();
    };

    container.addEventListener("wheel", preventScroll, { passive: false });
    container.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      container.removeEventListener("wheel", preventScroll);
      container.removeEventListener("touchmove", preventScroll);
    };
  }, []);

  const mapCenter = useMemo(() => {
    return findDensestRegion(reclamacoes);
  }, [reclamacoes]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-zinc-950 flex flex-col text-[#112F4E] dark:text-zinc-100 transition-colors duration-300">
      <Navbar />

      <main className="flex-1 flex flex-col">
        {/* ─── Hero Section ─── */}
        <section className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center overflow-visible">
          <div className="flex flex-col gap-8 text-center lg:text-left z-10">
            <div className="inline-flex items-center w-fit mx-auto lg:mx-0 px-5 py-2.5 rounded-full bg-[#E8F2F8] dark:bg-[#1a8ccc]/10 text-[#1a8ccc] dark:text-[#38bdf8] text-sm font-bold tracking-wide uppercase">
              Transformando a nossa cidade
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-[5rem] font-medium text-[#112F4E] dark:text-zinc-100 tracking-tight leading-[1.05]">
              Cuidando de <br className="hidden lg:block" />
              <span className="text-[#1a8ccc] dark:text-[#38bdf8] italic font-serif">Marília</span>, Juntos.
            </h2>
            
            <p className="text-lg md:text-xl text-[#4A5D70] dark:text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Sua voz faz a diferença. Reporte problemas de infraestrutura, acompanhe solicitações e ajude a construir uma cidade melhor para todos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-4">
              <Link
                href="/"
                className="flex items-center justify-center gap-2 px-8 py-5 bg-[#1a8ccc] dark:bg-[#0ea5e9] text-white rounded-full text-lg font-medium hover:bg-[#1572a6] dark:hover:bg-[#0284c7] hover:-translate-y-1 transition-all shadow-md hover:shadow-lg"
              >
                <MapPin className="w-5 h-5" />
                Reportar Problema
              </Link>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 px-8 py-5 bg-white dark:bg-zinc-900 border-2 border-[#E2E8F0] dark:border-zinc-800 text-[#112F4E] dark:text-zinc-200 rounded-full text-lg font-medium shadow-sm hover:border-[#112F4E] dark:hover:border-zinc-300 hover:-translate-y-1 transition-all"
              >
                Ver Mapa
              </Link>
            </div>
          </div>
          
          {/* Hero Map Container */}
          <div 
            ref={mapContainerRef}
            className="relative h-[500px] w-full lg:w-[110%] lg:-ml-[5%] rounded-[3rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)] border-8 border-white dark:border-zinc-900 bg-white dark:bg-zinc-900"
          >
            <div className="absolute inset-0">
              <Map center={mapCenter} zoom={13}>
                {reclamacoes.map((rec) => {
                  const cat = getCategoryByLabel(rec.categoria) ?? { color: "#94A3B8" };
                  return (
                    <MapMarker key={rec.id} longitude={rec.longitude} latitude={rec.latitude}>
                      <MarkerContent>
                        <div 
                          className="w-5 h-5 rounded-full border-2 border-white shadow-md animate-pulse cursor-pointer hover:scale-125 transition-transform" 
                          style={{ backgroundColor: cat.color }}
                          title={rec.titulo}
                        />
                      </MarkerContent>
                    </MapMarker>
                  );
                })}
              </Map>
            </div>
          </div>

          {/* Victor no Dinossauro */}
          <div className="absolute bottom-0 right-0 z-30 pointer-events-none translate-y-[30%] sm:translate-y-[25%] md:translate-y-[20%] lg:translate-y-[15%] translate-x-[5%] sm:translate-x-[3%] md:translate-x-0">
            <img 
              src="/image/victor.png" 
              alt="Victor no Dinossauro" 
              className="w-[180px] sm:w-[240px] md:w-[350px] lg:w-[450px] xl:w-[550px] h-auto object-contain"
            />
          </div>
        </section>

        {/* ─── Stats Counter ─── */}
        <section className="w-full bg-white dark:bg-zinc-900 py-12 px-6 border-y border-[#E2E8F0] dark:border-zinc-800 relative z-20 transition-colors duration-300">
          <div className="max-w-[1000px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center">
                <stat.icon className="w-8 h-8 text-[#1a8ccc] dark:text-[#38bdf8] mb-3" />
                <p className="text-4xl md:text-5xl font-bold text-[#112F4E] dark:text-zinc-100 tracking-tight">{stat.value}</p>
                <p className="text-sm text-[#94A3B8] dark:text-zinc-550 font-medium mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── How It Works ─── */}
        <section className="w-full bg-white dark:bg-zinc-900 py-24 px-6 md:px-12 rounded-t-[4rem] mt-8 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.15)] relative z-20 overflow-hidden transition-colors duration-300">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid lg:grid-cols-12 gap-12">
              {/* Left Side */}
              <div className="lg:col-span-4 flex flex-col justify-center pt-8">
                <p className="text-[#1a8ccc] dark:text-[#38bdf8] text-sm font-bold tracking-wide uppercase mb-4">
                  COMO FUNCIONA
                </p>
                <h2 className="text-4xl md:text-5xl font-medium text-[#112F4E] dark:text-zinc-100 leading-tight mb-6">
                  Um processo simples
                  <br />
                  e transparente
                </h2>
                <p className="text-[#4A5D70] dark:text-zinc-400 text-lg font-light leading-relaxed mb-8 max-w-md">
                  Entenda como a sua solicitação entra para o radar comunitário e ganha força para cobrar soluções eficientes.
                </p>
                <Link href="/" className="bg-[#1a8ccc] dark:bg-[#0ea5e9] hover:bg-[#1572a6] dark:hover:bg-[#0284c7] text-white font-medium px-8 py-4 rounded-full w-fit transition-all hover:-translate-y-1 shadow-sm">
                  Reportar Agora
                </Link>
              </div>

              {/* Right Side - Timeline with curved path */}
              <div className="lg:col-span-8 relative min-h-[500px] hidden lg:block">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 700 500" fill="none" preserveAspectRatio="xMidYMid meet">
                  <path d="M 0 400 Q 150 420 250 350 Q 350 280 400 300 Q 500 340 550 250 Q 620 150 700 180" strokeWidth="3" fill="none" strokeLinecap="round" className="text-[#1a8ccc] dark:text-[#38bdf8] stroke-current opacity-40 dark:opacity-30" />
                  <path d="M 680 185 L 700 180" strokeWidth="3" strokeDasharray="8 8" fill="none" className="text-[#1a8ccc] dark:text-[#38bdf8] stroke-current opacity-40 dark:opacity-30" />
                </svg>

                {[
                  { left: "10%", bottom: "10%", num: "1", color: "#1a8ccc", title: "Reporte o Problema", desc: "Tire uma foto, descreva o que aconteceu e marque no mapa. Em menos de 2 minutos." },
                  { left: "40%", top: "35%", num: "2", color: "#F59E0B", title: "Acompanhe o Status", desc: "Receba notificações e interaja com a comunidade dando \"Concordo\" em relatos próximos." },
                  { right: "5%", top: "5%", num: "3", color: "#10B981", title: "Problema Resolvido", desc: "A cobrança comunitária surte efeito e as melhorias urbanas são conquistadas." },
                ].map((step) => (
                  <div
                    key={step.num}
                    className="absolute flex flex-col items-start transition-transform hover:-translate-y-2 duration-300"
                    style={{ left: step.left, right: step.right, top: step.top, bottom: step.bottom }}
                  >
                    <span className="absolute -left-12 -top-20 text-[180px] font-bold text-[#F1F5F9] dark:text-zinc-800/25 select-none pointer-events-none leading-none">{step.num}</span>
                    <div className="relative z-10 w-5 h-5 rounded-full mb-4 shadow-md dark:shadow-zinc-950/50" style={{ backgroundColor: step.color }} />
                    <div className="relative z-10 max-w-[250px] bg-white/60 dark:bg-zinc-950/65 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-transparent dark:border-zinc-800/80">
                      <h3 className="text-xl font-bold text-[#112F4E] dark:text-zinc-100 mb-2">{step.title}</h3>
                      <p className="text-[#4A5D70] dark:text-zinc-400 text-sm leading-relaxed font-light">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Timeline */}
              <div className="lg:hidden flex flex-col gap-12 mt-12 relative px-4">
                <div className="absolute left-10 top-8 bottom-8 w-1 bg-[#E8F2F8] dark:bg-zinc-800 rounded-full" />
                {[
                  { color: "text-[#1a8ccc] dark:text-[#38bdf8]", bg: "bg-[#E8F2F8] dark:bg-[#1a8ccc]/25", title: "Reporte o Problema", desc: "Tire uma foto, descreva o que aconteceu e marque no mapa." },
                  { color: "text-[#F59E0B] dark:text-[#fbbf24]", bg: "bg-[#FEF3C7] dark:bg-[#F59E0B]/25", title: "Acompanhe o Status", desc: "Receba notificações e interaja com a comunidade." },
                  { color: "text-[#10B981] dark:text-[#34d399]", bg: "bg-[#D1FAE5] dark:bg-[#10B981]/25", title: "Problema Resolvido", desc: "A cobrança comunitária surte efeito e a melhoria urbana é realizada." },
                ].map((step, i) => (
                  <div key={i} className="flex gap-6 relative z-10">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold shrink-0 text-xl shadow-sm ${step.bg} ${step.color}`}>{i + 1}</div>
                    <div>
                      <h3 className="text-xl font-bold text-[#112F4E] dark:text-zinc-100 mb-2 mt-3">{step.title}</h3>
                      <p className="text-[#4A5D70] dark:text-zinc-400 text-base leading-relaxed font-light">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── Patentes / Gamificação ─── */}
        <section id="patentes" className="w-full bg-[#FAF7F2] dark:bg-zinc-950 py-24 px-6 md:px-12 scroll-mt-20 transition-colors duration-300">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FEF3C7] dark:bg-[#F59E0B]/10 text-[#D97706] dark:text-amber-400 text-sm font-bold tracking-wide uppercase mb-6">
                <Trophy className="w-4 h-4" />
                Gamificação
              </div>
              <h2 className="text-4xl md:text-5xl font-medium text-[#112F4E] dark:text-zinc-100 tracking-tight leading-tight mb-4">
                Níveis de Cidadão
              </h2>
              <p className="text-lg text-[#4A5D70] dark:text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed">
                Quanto mais você participa, mais sobe de patente. Cada concordância, cada reclamação resolvida conta pontos que elevam seu nível na comunidade.
              </p>
            </div>

            {/* XP Rules */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {[
                { icon: PlusCircle, label: "Criar reclamação", xp: "+5 XP" },
                { icon: ThumbsUp, label: "Concordar", xp: "+1 XP" },
                { icon: CheckCircle2, label: "Concordo resolvido", xp: "+10 XP" },
                { icon: Award, label: "Sua reclamação resolvida", xp: "+20 XP" },
              ].map((rule) => (
                <div key={rule.label} className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-[#E2E8F0] dark:border-zinc-800 shadow-sm text-center flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-[#E8F2F8] dark:bg-zinc-800/80 text-[#1a8ccc] dark:text-[#38bdf8] flex items-center justify-center mb-3">
                    <rule.icon className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-[#4A5D70] dark:text-zinc-400 font-medium mb-1">{rule.label}</p>
                  <p className="text-sm font-bold text-[#1a8ccc] dark:text-[#38bdf8]">{rule.xp}</p>
                </div>
              ))}
            </div>

            {/* Rank Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {RANKS_DISPLAY.map((rank, i) => (
                <div
                  key={rank.level}
                  className={`relative p-6 rounded-2xl border shadow-sm text-center transition-all hover:-translate-y-1 hover:shadow-md ${
                    i === 4
                      ? "border-amber-200 dark:border-amber-900/50 bg-gradient-to-b from-[#FEF3C7] to-white dark:from-[#FEF3C7]/15 dark:to-zinc-900"
                      : "border-[#E2E8F0] dark:border-zinc-800 bg-white dark:bg-zinc-900"
                  }`}
                >
                  {i === 4 && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#F59E0B] text-white text-[9px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                      Max Level
                    </div>
                  )}
                  <div className="w-14 h-14 rounded-2xl bg-[#E8F2F8] dark:bg-zinc-800 text-[#1a8ccc] dark:text-[#38bdf8] flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <rank.icon className="w-7 h-7" style={{ color: rank.color }} />
                  </div>
                  <h3 className="text-base font-bold text-[#112F4E] dark:text-zinc-100 mb-1">{rank.name}</h3>
                  <div className="flex items-center justify-center gap-1 mb-3">
                    <Flame className="w-3.5 h-3.5" style={{ color: rank.color }} />
                    <span className="text-sm font-bold" style={{ color: rank.color }}>
                      {rank.minXP}+ XP
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8] dark:text-zinc-400 font-light leading-relaxed">{rank.desc}</p>
                  {/* Level indicator */}
                  <div className="mt-3 flex items-center justify-center gap-1">
                    {[...Array(5)].map((_, j) => (
                      <div
                        key={j}
                        className={`w-2 h-2 rounded-full ${j <= i ? "" : "bg-[#E2E8F0] dark:bg-zinc-700 opacity-20"}`}
                        style={{ backgroundColor: j <= i ? rank.color : undefined }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center mt-12">
              <Link
                href="/usuario/ranking"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#1a8ccc] dark:bg-[#0ea5e9] text-white rounded-full text-base font-medium hover:bg-[#1572a6] dark:hover:bg-[#0284c7] shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <Trophy className="w-5 h-5" />
                Ver Ranking Completo
              </Link>
            </div>
          </div>
        </section>

        {/* ─── CTA Final ─── */}
        <section className="w-full bg-gradient-to-br from-[#E8F2F8] to-[#FAF7F2] dark:from-zinc-900 dark:to-zinc-950 py-20 px-6 md:px-12 relative overflow-hidden transition-colors duration-300">
          {/* Decorative circles */}
          <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-[#1a8ccc]/5 dark:bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute top-0 left-1/4 w-[200px] h-[200px] bg-[#1a8ccc]/5 dark:bg-white/5 rounded-full -translate-y-1/2" />

          <div className="relative max-w-[900px] mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-medium text-[#112F4E] dark:text-white leading-tight mb-6">
              Pronto para fazer a<br />
              <span className="text-[#1a8ccc] dark:text-[#38BDF8]">diferença</span>?
            </h2>
            <p className="text-lg text-[#4A5D70] dark:text-[#94A3B8] font-light max-w-xl mx-auto mb-10 leading-relaxed">
              Junte-se a centenas de cidadãos que já estão transformando Marília. 
              Cada reclamação é um passo para uma cidade melhor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="flex items-center justify-center gap-2 px-10 py-5 bg-[#1a8ccc] dark:bg-[#0ea5e9] text-white rounded-full text-lg font-medium hover:bg-[#1572a6] dark:hover:bg-[#0284c7] shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <MapPin className="w-5 h-5" />
                Começar Agora
              </Link>
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 px-10 py-5 bg-white dark:bg-white/10 border border-[#E2E8F0] dark:border-white/20 text-[#112F4E] dark:text-white rounded-full text-lg font-medium hover:bg-[#FAF7F2] dark:hover:bg-white/20 hover:-translate-y-1 transition-all"
              >
                Fazer Login
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import Link from "next/link";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Map, MapMarker, MarkerContent } from "@/components/ui/map";
import { MapPin, Gift, Percent, Star, Users, Building, ShieldCheck, Tag, ArrowRight, Sparkles, Compass, Store, TrendingUp, MessageSquare } from "lucide-react";

type PublicMapEstabelecimento = {
  id: string;
  nome: string;
  categoria: string;
  latitude: number;
  longitude: number;
  logoUrl: string;
  endereco: string;
};

export default function Sobre() {
  const [estabelecimentos, setEstabelecimentos] = useState<PublicMapEstabelecimento[]>([]);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/publico/mapa", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Falha ao carregar mapa publico: ${response.status}`);
        }

        const data = await response.json();
        if (active && Array.isArray(data)) {
          setEstabelecimentos(data);
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

  // Centro padrão de São Paulo
  const mapCenter = useMemo<[number, number]>(() => {
    if (estabelecimentos.length > 0) {
      const sumLat = estabelecimentos.reduce((sum, r) => sum + r.latitude, 0);
      const sumLng = estabelecimentos.reduce((sum, r) => sum + r.longitude, 0);
      return [sumLng / estabelecimentos.length, sumLat / estabelecimentos.length];
    }
    return [-46.6333, -23.5505];
  }, [estabelecimentos]);

  // Cores de pin por categoria
  const getCategoryColor = (categoria: string) => {
    if (categoria === "alimentacao") return "#F59E0B";
    if (categoria === "automotivo") return "#38BDF8";
    if (categoria === "saude_beleza") return "#10B981";
    if (categoria === "comercio_varejo") return "#6366F1";
    if (categoria === "educacao_servicos") return "#8B5CF6";
    return "#64748B";
  };

  const steps = [
    {
      num: "1",
      color: "#1a8ccc",
      title: "Explore o Mapa",
      desc: "Navegue pelo mapa e descubra restaurantes, hoteis, cafeterias, atracoes e experiencias indicadas por quem realmente vive a cidade.",
    },
    {
      num: "2",
      color: "#F59E0B",
      title: "Escolha seu proximo lugar",
      desc: "Abra os pins, compare opcoes, veja categorias e encontre lugares novos para viver experiencias reais por todo o Brasil.",
    },
    {
      num: "3",
      color: "#10B981",
      title: "Viva a experiencia",
      desc: "Saia do scroll infinito e transforme descoberta digital em memoria real, passeio, refeicao, viagem ou encontro no mundo fisico.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-zinc-950 flex flex-col text-[#112F4E] dark:text-zinc-100 transition-colors duration-300">
      <Navbar />

      <main className="flex-1 flex flex-col">
        {/* ─── Hero Section ─── */}
        <section className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center overflow-visible">
          <div className="flex flex-col gap-8 text-center lg:text-left z-10">
            <div className="inline-flex items-center w-fit mx-auto lg:mx-0 px-5 py-2.5 rounded-full bg-[#E8F2F8] dark:bg-[#1a8ccc]/10 text-[#1a8ccc] dark:text-[#38bdf8] text-sm font-bold tracking-wide uppercase">
              Descoberta real com curadoria humana
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-[4.2rem] font-semibold text-[#112F4E] dark:text-zinc-100 tracking-tight leading-[1.05]">
              O mundo real ainda <br className="hidden lg:block" />
              <span className="text-[#F59E0B] italic font-serif">esta la fora</span>
            </h2>
            
            <p className="text-lg md:text-xl text-[#4A5D70] dark:text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              <span className="font-bold text-[#1a8ccc] dark:text-[#38bdf8] block mb-2">Descubra restaurantes, hoteis, atracoes, cafeterias e experiencias incriveis atraves de pessoas que realmente vivem cada cidade.</span>
              Explore o mapa, encontre novos lugares e viva experiencias reais por todo o Brasil.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-4">
              <Link
                href="/"
                className="flex items-center justify-center gap-2 px-8 py-5 bg-[#1a8ccc] dark:bg-[#0ea5e9] text-white rounded-full text-lg font-semibold hover:bg-[#1572a6] dark:hover:bg-[#0284c7] hover:-translate-y-1 transition-all shadow-md hover:shadow-lg min-w-[180px]"
              >
                <Compass className="w-5 h-5 animate-spin-slow" />
                Navegar
              </Link>
              <Link
                href="#criadores"
                className="flex items-center justify-center gap-2 px-8 py-5 bg-white dark:bg-zinc-900 border-2 border-[#E2E8F0] dark:border-zinc-800 text-[#112F4E] dark:text-zinc-200 rounded-full text-lg font-semibold shadow-sm hover:border-[#1a8ccc] dark:hover:border-zinc-300 hover:-translate-y-1 transition-all min-w-[180px]"
              >
                <Users className="w-5 h-5 text-slate-500 shrink-0 animate-pulse" />
                Sou criador
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
                {estabelecimentos.map((estab) => {
                  const color = getCategoryColor(estab.categoria);
                  return (
                    <MapMarker key={estab.id} longitude={estab.longitude} latitude={estab.latitude}>
                      <MarkerContent>
                        <div 
                          className="w-5 h-5 rounded-full border-2 border-white shadow-md animate-pulse cursor-pointer hover:scale-125 transition-transform" 
                          style={{ backgroundColor: color }}
                          title={estab.nome}
                        />
                      </MarkerContent>
                    </MapMarker>
                  );
                })}
              </Map>
            </div>
          </div>

          {/* Removido o mascote Dino de Marília */}
        </section>

        {/* ─── Stats Counter ─── */}
        <section className="w-full bg-white dark:bg-zinc-900 py-12 px-6 border-y border-[#E2E8F0] dark:border-zinc-800 relative z-20 transition-colors duration-300">
          <div className="max-w-[1000px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { label: "Lugares para descobrir", value: "1.500+", icon: MapPin },
              { label: "Criadores mapeando cidades", value: "80+", icon: Users },
              { label: "Experiencias conectadas", value: "3.200+", icon: Sparkles },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center">
                <stat.icon className="w-8 h-8 text-[#1a8ccc] dark:text-[#38bdf8] mb-3" />
                <p className="text-4xl md:text-5xl font-bold text-[#112F4E] dark:text-zinc-100 tracking-tight">{stat.value}</p>
                <p className="text-sm text-[#94A3B8] dark:text-zinc-500 font-medium mt-1">{stat.label}</p>
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
                  Como descobrir melhor o
                  <br />
                  que existe ao seu redor
                </h2>
                <p className="text-[#4A5D70] dark:text-zinc-400 text-lg font-light leading-relaxed mb-8 max-w-md">
                  A Vizoor junta mapa, contexto local e curadoria humana para transformar descoberta em experiencia presencial.
                </p>
                <Link href="/" className="bg-[#1a8ccc] dark:bg-[#0ea5e9] hover:bg-[#1572a6] dark:hover:bg-[#0284c7] text-white font-medium px-8 py-4 rounded-full w-fit transition-all hover:-translate-y-1 shadow-sm">
                  Explorar o mapa
                </Link>
              </div>

              {/* Right Side - Timeline with curved path */}
              <div className="lg:col-span-8 relative min-h-[500px] hidden lg:block">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 700 500" fill="none" preserveAspectRatio="xMidYMid meet">
                  <path d="M 0 400 Q 150 420 250 350 Q 350 280 400 300 Q 500 340 550 250 Q 620 150 700 180" strokeWidth="3" fill="none" strokeLinecap="round" className="text-[#1a8ccc] dark:text-[#38bdf8] stroke-current opacity-40 dark:opacity-30" />
                  <path d="M 680 185 L 700 180" strokeWidth="3" strokeDasharray="8 8" fill="none" className="text-[#1a8ccc] dark:text-[#38bdf8] stroke-current opacity-40 dark:opacity-30" />
                </svg>

                {steps.map((step) => (
                  <div
                    key={step.num}
                    className="absolute flex flex-col items-start transition-transform hover:-translate-y-2 duration-300"
                    style={
                      step.num === "1"
                        ? { left: "10%", bottom: "10%" }
                        : step.num === "2"
                        ? { left: "40%", top: "35%" }
                        : { right: "5%", top: "5%" }
                    }
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
                {steps.map((step, i) => (
                  <div key={i} className="flex gap-6 relative z-10">
                    <div 
                      className="w-14 h-14 rounded-full flex items-center justify-center font-bold shrink-0 text-xl shadow-sm"
                      style={{ backgroundColor: `${step.color}15`, color: step.color }}
                    >
                      {step.num}
                    </div>
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

        {/* ─── Categorias do Mapa ─── */}
        <section className="w-full bg-[#FAF7F2] dark:bg-zinc-950 py-24 px-6 md:px-12 transition-colors duration-300">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FEF3C7] dark:bg-[#F59E0B]/10 text-[#D97706] dark:text-amber-400 text-sm font-bold tracking-wide uppercase mb-6">
                <Sparkles className="w-4 h-4" />
                Variedade
              </div>
              <h2 className="text-4xl md:text-5xl font-medium text-[#112F4E] dark:text-zinc-100 tracking-tight leading-tight mb-4">
                Categorias do mapa
              </h2>
              <p className="text-lg text-[#4A5D70] dark:text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed">
                A Vizoor organiza o mundo real em categorias simples para voce descobrir lugares, experiencias e servicos com mais contexto.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { label: "Alimentação", color: "#F59E0B", icon: Gift, desc: "Restaurantes, lanchonetes, padarias, bares e cafeterias para descobrir na cidade." },
                { label: "Automotivo", color: "#38BDF8", icon: Compass, desc: "Postos, oficinas, lava-rapidos e servicos automotivos uteis no percurso." },
                { label: "Saúde & Beleza", color: "#10B981", icon: ShieldCheck, desc: "Academias, estudios, saloes, clinicas e enderecos de bem-estar." },
                { label: "Comércio & Varejo", color: "#6366F1", icon: Tag, desc: "Lojas, galerias, boutiques e pontos comerciais para explorar e comprar." },
                { label: "Educação & Serviços", color: "#8B5CF6", icon: Star, desc: "Cursos, escolas, papelarias, espacos culturais e servicos do dia a dia." },
              ].map((cat, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl border border-[#E2E8F0] dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center flex flex-col justify-between hover:-translate-y-1 transition-all"
                >
                  <div>
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm"
                      style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                    >
                      <cat.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-[#112F4E] dark:text-zinc-100 mb-2">{cat.label}</h3>
                    <p className="text-xs text-[#94A3B8] dark:text-zinc-400 font-light leading-relaxed">{cat.desc}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-dashed border-zinc-100 dark:border-zinc-800/80">
                    <span 
                      className="text-[10px] font-bold uppercase tracking-wider"
                      style={{ color: cat.color }}
                    >
                      Explorar categoria
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="criadores" className="w-full bg-white dark:bg-zinc-900 py-24 px-6 md:px-12 transition-colors duration-300 border-t border-slate-100 dark:border-zinc-800">
          <div className="max-w-[1200px] mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center">
            <div className="space-y-8 text-left">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E8F2F8] dark:bg-[#1a8ccc]/10 text-[#1a8ccc] dark:text-[#38bdf8] text-sm font-bold tracking-wide uppercase">
                <Users className="w-4 h-4" />
                Para criadores de conteudo
              </div>

              <h2 className="text-4xl md:text-5xl font-semibold text-[#112F4E] dark:text-zinc-100 tracking-tight leading-tight">
                Sua audiencia ja confia em voce. <span className="text-[#F59E0B] italic font-serif">Agora ela pode explorar com voce.</span>
              </h2>

              <p className="text-lg text-[#4A5D70] dark:text-zinc-400 font-light leading-relaxed">
                Crie sua pagina dedicada, publique sua curadoria no mapa, destaque os lugares que realmente fazem parte da sua rotina e transforme recomendacao em descoberta geografica.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  "Pagina publica com slug proprio dentro da Vizoor.",
                  "Curadoria com mapa, destaques, roteiro e favoritos.",
                  "Links sociais e identidade editorial do criador.",
                  "Conexao entre audiencia, cidade e experiencia real.",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-4 text-sm leading-6 text-slate-600 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-300">
                    {item}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 px-8 py-4.5 bg-[#1a8ccc] hover:bg-[#1572a6] text-white rounded-full font-medium transition-all shadow-md hover:-translate-y-0.5 text-base"
                >
                  <Sparkles className="w-4.5 h-4.5" />
                  Quero criar minha pagina
                </Link>
                <Link
                  href="/criador/dashboard"
                  className="flex items-center justify-center gap-2 px-8 py-4.5 bg-white dark:bg-zinc-900 border-2 border-slate-200 dark:border-zinc-800 text-[#112F4E] dark:text-zinc-200 rounded-full font-medium shadow-sm hover:border-[#1a8ccc] dark:hover:border-zinc-300 active:scale-[0.98] transition-all text-base"
                >
                  <ArrowRight className="w-4.5 h-4.5" />
                  Ver area do criador
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  title: "Mapa curado",
                  desc: "Mostre no mapa os lugares que voce recomenda de verdade.",
                  icon: Compass,
                  color: "#1a8ccc",
                },
                {
                  title: "Destaques editoriais",
                  desc: "Organize ordem, destaque e notas para dar contexto as suas escolhas.",
                  icon: Star,
                  color: "#F59E0B",
                },
                {
                  title: "Roteiro e favoritos",
                  desc: "Monte percursos, selecoes e listas de referencia para sua comunidade.",
                  icon: Tag,
                  color: "#10B981",
                },
                {
                  title: "Perfil publico forte",
                  desc: "Reforce sua identidade com bio, capa, links externos e redes sociais.",
                  icon: MessageSquare,
                  color: "#8B5CF6",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-6 rounded-3xl border border-slate-250 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl hover:-translate-y-1 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.02)] text-left space-y-3"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: `${item.color}15`, color: item.color }}
                  >
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#112F4E] dark:text-zinc-100">{item.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 font-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Seção Para Anunciantes / Parceiros ─── */}
        <section id="anunciantes" className="w-full bg-white dark:bg-zinc-900 py-24 px-6 md:px-12 transition-colors duration-300 relative overflow-hidden border-t border-slate-100 dark:border-zinc-800">
          <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-gradient-to-br from-[#1a8ccc]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-0 top-0 w-[200px] h-[200px] bg-gradient-to-bl from-[#F59E0B]/10 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="max-w-[1200px] mx-auto z-10 relative">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              {/* Informações Persuasivas */}
              <div className="space-y-8 text-left">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E8F2F8] dark:bg-[#1a8ccc]/10 text-[#1a8ccc] dark:text-[#38bdf8] text-sm font-bold tracking-wide uppercase">
                  <TrendingUp className="w-4 h-4 text-[#1a8ccc] dark:text-[#38bdf8]" />
                  Para estabelecimentos
                </div>

                <h2 className="text-4xl md:text-5xl font-semibold text-[#112F4E] dark:text-zinc-100 tracking-tight leading-tight">
                  Coloque seu estabelecimento onde as pessoas <span className="text-[#F59E0B] italic font-serif">estao realmente procurando</span>.
                </h2>

                <p className="text-lg text-[#4A5D70] dark:text-zinc-400 font-light leading-relaxed">
                  A Vizoor conecta seu lugar a consumidores em busca de experiencias reais e a criadores que influenciam escolhas no territorio. Ganhe visibilidade, contexto e presenca qualificada no mapa.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <a
                    href="https://wa.me/5511999999999?text=Ol%C3%A1!%20Gostaria%20de%20anunciar%20meu%20estabelecimento%20no%20mapa%20do%20Navegando%20SP."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-8 py-4.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-medium transition-all shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-[0.98] hover:-translate-y-0.5 cursor-pointer text-base"
                  >
                    <MessageSquare className="w-4.5 h-4.5 fill-white text-emerald-500 shrink-0" />
                    Quero Anunciar via WhatsApp
                  </a>

                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 px-8 py-4.5 bg-white dark:bg-zinc-900 border-2 border-slate-200 dark:border-zinc-800 text-[#112F4E] dark:text-zinc-200 rounded-full font-medium shadow-sm hover:border-[#1a8ccc] dark:hover:border-zinc-300 active:scale-[0.98] transition-all text-base"
                  >
                    <Store className="w-4.5 h-4.5 text-slate-500" />
                    Área do Parceiro
                  </Link>
                </div>
              </div>

              {/* Grid de valor para estabelecimentos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    title: "Vitrine 3D Interativa",
                    desc: "Seu comércio em destaque no mapa visualizado por milhares de consumidores qualificados em SP.",
                    icon: Store,
                    color: "#1a8ccc",
                  },
                  {
                    title: "Campanhas e ativações",
                    desc: "Crie acoes comerciais, promocoes e chamadas contextuais para atrair mais visitas qualificadas.",
                    icon: Gift,
                    color: "#F59E0B",
                  },
                  {
                    title: "Menu & Serviços Online",
                    desc: "Anexe links diretos para seu cardápio digital ou liste seus serviços em destaque no pin do seu local.",
                    icon: Compass,
                    color: "#10B981",
                  },
                  {
                    title: "Painel de Controle",
                    desc: "Gerencie suas filiais, altere dados de contato e acompanhe o número total de cupons resgatados no caixa.",
                    icon: ShieldCheck,
                    color: "#8B5CF6",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-3xl border border-slate-250 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl hover:-translate-y-1 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.02)] text-left space-y-3"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                      style={{ backgroundColor: `${item.color}15`, color: item.color }}
                    >
                      <item.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-[#112F4E] dark:text-zinc-100">{item.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 font-light leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* ─── CTA Final ─── */}
        <section className="w-full bg-gradient-to-br from-[#E8F2F8] to-[#FAF7F2] dark:from-zinc-900 dark:to-zinc-950 py-20 px-6 md:px-12 relative overflow-hidden transition-colors duration-300">
          <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-[#1a8ccc]/5 dark:bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute top-0 left-1/4 w-[200px] h-[200px] bg-[#1a8ccc]/5 dark:bg-white/5 rounded-full -translate-y-1/2" />

          <div className="relative max-w-[1000px] mx-auto text-center space-y-10">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-5xl font-medium text-[#112F4E] dark:text-white leading-tight">
                Pronto para fazer parte da <span className="text-[#F59E0B] dark:text-[#fbbf24]">Vizoor</span>?
              </h2>
              <p className="text-base md:text-lg text-[#4A5D70] dark:text-[#94A3B8] font-light max-w-2xl mx-auto leading-relaxed">
                Primeiro para quem quer viver a cidade de verdade, depois para quem a traduz em curadoria e por fim para quem quer ser encontrado no momento certo.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link
                href="/"
                className="flex items-center justify-center gap-2 px-10 py-5 bg-[#1a8ccc] dark:bg-[#0ea5e9] text-white rounded-full text-lg font-semibold hover:bg-[#1572a6] dark:hover:bg-[#0284c7] shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all w-full sm:w-auto"
              >
                <Compass className="w-5 h-5 animate-spin-slow" />
                Explorar o mapa
              </Link>

              <Link
                href="#criadores"
                className="flex items-center justify-center gap-2 px-10 py-5 bg-white dark:bg-zinc-900 border-2 border-slate-200 dark:border-zinc-800 text-[#112F4E] dark:text-zinc-200 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all w-full sm:w-auto"
              >
                <Users className="w-5 h-5" />
                Sou criador
              </Link>

              <a
                href="https://wa.me/5511999999999?text=Ol%C3%A1!%20Gostaria%20de%20anunciar%20minha%20empresa%20no%20Navegando%20SP."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-10 py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full text-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all w-full sm:w-auto cursor-pointer"
              >
                <MessageSquare className="w-5 h-5 fill-white text-emerald-500 shrink-0 animate-bounce" style={{ animationDuration: '3s' }} />
                Anunciar Estabelecimento
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

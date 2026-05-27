"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  ShieldCheck, 
  Eye, 
  Lock, 
  MapPin, 
  Trophy, 
  BookOpen, 
  Scale, 
  FileText, 
  HelpCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  UserCheck,
  Zap,
  Fingerprint,
  Mail,
  User,
  AlertTriangle,
  Camera,
  Map,
  Trash2,
  Shield
} from "lucide-react";

// Conteúdo estruturado para a plataforma de patrocínios Navegando SP
const SECTIONS_TERMOS = [
  {
    id: "objetivo",
    title: "1. Objetivo da Plataforma",
    icon: Scale,
    content: (
      <>
        <p className="mb-4">
          O <strong>Navegando SP</strong> é uma plataforma comercial colaborativa e interativa dedicada a geolocalizar, divulgar e gerenciar patrocínios, vantagens comerciais e cupons de desconto em estabelecimentos de todo o Estado de São Paulo (SP).
        </p>
        <p>
          Nosso objetivo é fortalecer o comércio local paulista, conectando consumidores a ótimas vantagens comerciais e impulsionando a visibilidade de patrocinadores parceiros de forma inovadora e premium.
        </p>
      </>
    )
  },
  {
    id: "postagens",
    title: "2. Cadastro e Diretrizes de Parcerias",
    icon: FileText,
    content: (
      <>
        <p className="mb-4">
          Para resgatar benefícios ou cadastrar estabelecimentos na plataforma, os usuários devem se autenticar de forma simples utilizando a sua <strong>Conta do Google</strong>. Ao interagir no app, você concorda que:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li><strong>Legitimidade Comercial:</strong> Os cupons, descontos e informações cadastrais dos estabelecimentos parceiros devem ser verídicos e cumpridos integralmente nos caixas físicos.</li>
          <li><strong>Conduta Ética:</strong> A plataforma é estritamente de fins comerciais e promocionais. Qualquer conteúdo difamatório, ofensivo ou inadequado nas descrições de lojas e cupons resultará em banimento imediato.</li>
          <li><strong>Propriedade de Logos e Imagens:</strong> As fotos e marcas publicadas devem pertencer legalmente aos respectivos parceiros comerciais.</li>
        </ul>
        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 rounded-r-xl text-sm">
          <p className="font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 mb-1">
            <AlertCircle className="w-4 h-4 shrink-0" /> Conteúdo Comercial Abusivo
          </p>
          Cupons falsos, publicações enganosas ou fraudes em sistemas de descontos serão banidos sumariamente pela moderação do Navegando SP.
        </div>
      </>
    )
  },
  {
    id: "gamificacao",
    title: "3. Sistema de Fidelidade SP e Pontos",
    icon: Trophy,
    content: (
      <>
        <p className="mb-4">
          Implementamos uma dinâmica de fidelidade saudável com pontos e níveis de patrocinadores (como "Navegador Iniciante", "Navegador Bronze", "Parceiro Platina") para engajar a comunidade. As regras são:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Cadastrar novos cupons válidos (Parceiros) concede <strong>+10 pontos</strong>.</li>
          <li>Resgatar cupons de vantagens concede <strong>+5 pontos</strong> pela fidelização.</li>
          <li>Validar o cupom no caixa do estabelecimento físico concede <strong>+20 pontos</strong> de economia ativa.</li>
        </ul>
        <p className="mb-4">
          Tentar fraudar a geração e validação de cupons por meios artificiais acarretará em exclusão da conta e invalidação imediata dos cupons pendentes.
        </p>
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border-l-4 border-rose-500 rounded-r-xl text-sm">
          <p className="font-semibold text-rose-800 dark:text-rose-300 flex items-center gap-1.5 mb-1">
            <Zap className="w-4 h-4 shrink-0" /> Fraudes e Bloqueios
          </p>
          Tentativas de burlar os resgates ou simular visitas inexistentes zerarão totalmente os pontos de fidelidade acumulados pelo usuário.
        </div>
      </>
    )
  },
  {
    id: "moderacao",
    title: "4. Direitos e Moderação de Estabelecimentos",
    icon: ShieldCheck,
    content: (
      <>
        <p className="mb-4">
          A administração do Navegando SP reserva-se o direito de moderar e auditar os estabelecimentos e cupons cadastrados para garantir a melhor experiência comercial:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Aprovar, rejeitar ou suspender perfis de estabelecimentos parceiros com base na veracidade das informações apresentadas.</li>
          <li>Organizar cupons em suas categorias mercadológicas adequadas (Alimentação, Automotivo, Saúde/Beleza, Varejo, Serviços).</li>
          <li>Auxiliar os caixas e parceiros locais na validação e gestão dos tokens de resgates exclusivos da plataforma.</li>
        </ul>
      </>
    )
  }
];

const SECTIONS_PRIVACIDADE = [
  {
    id: "coleta",
    title: "1. Coleta e Uso Mínimo de Dados",
    icon: Lock,
    content: (
      <>
        <p className="mb-4">
          Coletamos estritamente os dados necessários para gerenciar com segurança os seus cupons e o seu posicionamento de busca no mapa de parcerias:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="p-4 bg-white dark:bg-zinc-900 border border-[#E2E8F0] dark:border-zinc-800 rounded-2xl flex flex-col items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E8F2F8] dark:bg-zinc-800 text-[#1a8ccc] dark:text-[#38bdf8] flex items-center justify-center shadow-sm shrink-0">
              <Mail className="w-4.5 h-4.5" />
            </div>
            <div>
              <h4 className="font-bold text-xs mb-1">Autenticação</h4>
              <p className="text-xs text-[#4A5D70] dark:text-zinc-400 font-light">E-mail do Google para login seguro na plataforma comercial.</p>
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 border border-[#E2E8F0] dark:border-zinc-800 rounded-2xl flex flex-col items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E8F2F8] dark:bg-zinc-800 text-[#1a8ccc] dark:text-[#38bdf8] flex items-center justify-center shadow-sm shrink-0">
              <User className="w-4.5 h-4.5" />
            </div>
            <div>
              <h4 className="font-bold text-xs mb-1">Perfil Público</h4>
              <p className="text-xs text-[#4A5D70] dark:text-zinc-400 font-light">Apelido e nível de fidelidade exibidos nas parcerias do mapa.</p>
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 border border-[#E2E8F0] dark:border-zinc-800 rounded-2xl flex flex-col items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E8F2F8] dark:bg-zinc-800 text-[#1a8ccc] dark:text-[#38bdf8] flex items-center justify-center shadow-sm shrink-0">
              <MapPin className="w-4.5 h-4.5" />
            </div>
            <div>
              <h4 className="font-bold text-xs mb-1">Geolocalização</h4>
              <p className="text-xs text-[#4A5D70] dark:text-zinc-400 font-light">Coordenadas geográficas dos estabelecimentos patrocinadores.</p>
            </div>
          </div>
        </div>
        <p>
          <strong>Importante:</strong> Não compartilhamos dados de contato de forma indevida e nos mantemos estritamente focados na fidelização e patrocínios no Estado de São Paulo.
        </p>
      </>
    )
  },
  {
    id: "exposicao",
    title: "2. Exposição Pública de Patrocinadores",
    icon: MapPin,
    content: (
      <>
        <p className="mb-4">
          A localização, as fotos do banner/logotipo, o contato comercial e os cupons ativos dos estabelecimentos cadastrados são dados **estritamente públicos** para fins publicitários e comerciais.
        </p>
        <p className="mb-4">
          Os dados sensíveis de e-mail e login do navegador dos usuários e empresários são sigilosos e permanecem blindados contra qualquer tipo de varredura ou indexação pública.
        </p>
        <div className="p-4 bg-sky-50 dark:bg-sky-950/20 border-l-4 border-sky-500 rounded-r-xl text-sm">
          <p className="font-semibold text-sky-800 dark:text-sky-300 flex items-center gap-1.5 mb-1">
            <Eye className="w-4 h-4 shrink-0" /> Segurança Comercial
          </p>
          Certifique-se de preencher dados corretos e fotos profissionais do seu estabelecimento para maximizar o seu retorno de patrocínio no Navegando SP.
        </div>
      </>
    )
  },
  {
    id: "seguranca",
    title: "3. Segurança da API e LGPD",
    icon: Fingerprint,
    content: (
      <>
        <p className="mb-4">
          Adotamos políticas rígidas de conformidade com a <strong>LGPD (Lei Geral de Proteção de Dados)</strong> para blindar as chaves de integração do banco de dados e APIs:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li><strong>Proxy de API:</strong> As chamadas para os parceiros do mapa de patrocínio são filtradas por uma rota proxy local no servidor em `/api/publico/mapa`, evitando vazamentos e protegendo dados sensíveis.</li>
          <li><strong>Criptografia no Firestore:</strong> Todas as informações de resgates e regras do Firebase são rigidamente protegidas por regras de segurança do Firestore (`firestore.rules`).</li>
        </ul>
      </>
    )
  },
  {
    id: "cookies",
    title: "4. Cookies e Armazenamento Local",
    icon: BookOpen,
    content: (
      <>
        <p className="mb-4">
          Utilizamos `LocalStorage` e cookies funcionais apenas para:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Manter a sua sessão autenticada com segurança no painel.</li>
          <li>Salvar as preferências do seu mapa e o Tema do App (Claro/Escuro).</li>
        </ul>
      </>
    )
  },
  {
    id: "exclusao",
    title: "5. Direitos do Usuário (Exclusão Permanente)",
    icon: UserCheck,
    content: (
      <>
        <p className="mb-4">
          Em total conformidade com a LGPD, você possui controle absoluto da sua conta. Você pode:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Editar seus dados cadastrais e avatar a qualquer momento na tela de Perfil.</li>
          <li><strong>Deletar sua Conta:</strong> Disponibilizamos uma opção em seu painel privado para excluir sua conta e remover permanentemente seus dados dos nossos servidores e bases de dados do Firebase.</li>
        </ul>
      </>
    )
  }
];

function TermosContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const tabParam = searchParams.get("tab");
  const initialTab = tabParam === "privacidade" ? "privacidade" : "termos";
  
  const [activeTab, setActiveTab] = useState<"termos" | "privacidade">(initialTab);
  const [activeAnchor, setActiveAnchor] = useState<string>("");

  useEffect(() => {
    if (tabParam === "privacidade" || tabParam === "termos") {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tab: "termos" | "privacidade") => {
    setActiveTab(tab);
    setActiveAnchor("");
    router.push(`/termos?tab=${tab}`, { scroll: false });
  };

  const currentSections = activeTab === "termos" ? SECTIONS_TERMOS : SECTIONS_PRIVACIDADE;

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      
      for (const section of currentSections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveAnchor(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentSections]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      {/* Tabs Navigation */}
      <div className="flex justify-center mb-16">
        <div className="relative p-1.5 bg-[#FAF7F2] dark:bg-zinc-900 border border-[#E2E8F0] dark:border-zinc-800 rounded-full flex items-center gap-1 shadow-inner">
          <button
            onClick={() => handleTabChange("termos")}
            className={`relative px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
              activeTab === "termos"
                ? "bg-[#1a8ccc] text-white shadow-md"
                : "text-[#4A5D70] dark:text-zinc-400 hover:text-[#112F4E] dark:hover:text-zinc-200"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Termos de Uso
          </button>
          <button
            onClick={() => handleTabChange("privacidade")}
            className={`relative px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
              activeTab === "privacidade"
                ? "bg-[#1a8ccc] text-white shadow-md"
                : "text-[#4A5D70] dark:text-zinc-400 hover:text-[#112F4E] dark:hover:text-zinc-200"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Política de Privacidade
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Coluna Esquerda: Índice Sticky & Resumo */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-8">
          
          <div className="p-6 bg-white dark:bg-zinc-900/50 backdrop-blur-md border border-[#E2E8F0] dark:border-zinc-800/80 rounded-3xl shadow-sm">
            <h3 className="text-xs font-bold text-[#112F4E] dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#1a8ccc]" />
              Sumário do Documento
            </h3>
            <ul className="space-y-1">
              {currentSections.map((sec) => (
                <li key={sec.id}>
                  <a
                    href={`#${sec.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(sec.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                      setActiveAnchor(sec.id);
                    }}
                    className={`block px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      activeAnchor === sec.id
                        ? "bg-[#E8F2F8] dark:bg-[#1a8ccc]/10 text-[#1a8ccc] dark:text-[#38bdf8] font-bold"
                        : "text-[#4A5D70] dark:text-zinc-400 hover:text-[#112F4E] dark:hover:text-zinc-200 hover:bg-[#FAF7F2] dark:hover:bg-zinc-900/50"
                    }`}
                  >
                    {sec.title.substring(3)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative p-6 bg-gradient-to-br from-[#E8F2F8] to-white dark:from-zinc-900 dark:to-zinc-950 border border-sky-100 dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#1a8ccc]/5 dark:bg-white/5 rounded-full translate-x-10 -translate-y-10" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1a8ccc]/10 text-[#1a8ccc] dark:text-[#38bdf8] text-[10px] font-bold uppercase tracking-wider mb-4">
                <HelpCircle className="w-3.5 h-3.5" />
                Resumo sem Juridiquês
              </div>
              
              <h4 className="text-lg font-bold text-[#112F4E] dark:text-white mb-2 leading-tight">
                Entenda em português claro
              </h4>
              <p className="text-xs text-[#4A5D70] dark:text-zinc-400 font-light leading-relaxed mb-6">
                Simplificamos as diretrizes do Navegando SP para facilitar o seu entendimento:
              </p>

              {activeTab === "termos" ? (
                <ul className="space-y-4 text-xs">
                  <li className="flex gap-3 items-start">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#112F4E] dark:text-zinc-200 block mb-0.5">Cupons e Valores Reais</strong>
                      <span className="text-[#4A5D70] dark:text-zinc-400 font-light">Todas as vantagens devem ser reais e cumpridas fisicamente pelas lojas credenciadas.</span>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <Camera className="w-5 h-5 text-[#1a8ccc] dark:text-[#38bdf8] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#112F4E] dark:text-zinc-200 block mb-0.5">Apenas Marcas Legítimas</strong>
                      <span className="text-[#4A5D70] dark:text-zinc-400 font-light">Fotos e logotipos devem corresponder aos estabelecimentos e produtos reais.</span>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <Trophy className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#112F4E] dark:text-zinc-200 block mb-0.5">Fidelidade Saudável</strong>
                      <span className="text-[#4A5D70] dark:text-zinc-400 font-light">Os pontos de fidelidade premiam a navegação real. Fraudes invalidam sua pontuação.</span>
                    </div>
                  </li>
                </ul>
              ) : (
                <ul className="space-y-4 text-xs">
                  <li className="flex gap-3 items-start">
                    <Shield className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#112F4E] dark:text-zinc-200 block mb-0.5">Seu E-mail Sob Sigilo</strong>
                      <span className="text-[#4A5D70] dark:text-zinc-400 font-light">Ele serve unicamente para login. Não o compartilhamos com marqueteiros ou spams.</span>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <Map className="w-5 h-5 text-[#1a8ccc] dark:text-[#38bdf8] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#112F4E] dark:text-zinc-200 block mb-0.5">Publicidade Segura</strong>
                      <span className="text-[#4A5D70] dark:text-zinc-400 font-light">Cupons e localizações de lojas são públicos, mas o resto dos seus dados de perfil são blindados.</span>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <Trash2 className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#112F4E] dark:text-zinc-200 block mb-0.5">Direito à Exclusão</strong>
                      <span className="text-[#4A5D70] dark:text-zinc-400 font-light">Apague sua conta e todos os cupons salvos dos nossos servidores com apenas um clique.</span>
                    </div>
                  </li>
                </ul>
              )}
            </div>
          </div>

        </aside>

        {/* Coluna Direita: Conteúdo Principal */}
        <main className="lg:col-span-8 bg-white dark:bg-zinc-900/40 border border-[#E2E8F0] dark:border-zinc-800/80 rounded-[2.5rem] p-6 md:p-10 shadow-sm space-y-12">
          {currentSections.map((sec) => {
            const IconComponent = sec.icon;
            return (
              <section
                key={sec.id}
                id={sec.id}
                className="scroll-mt-24 pb-10 border-b border-slate-100 dark:border-zinc-800 last:border-b-0 last:pb-0 group"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#E8F2F8] dark:bg-zinc-800 text-[#1a8ccc] dark:text-[#38bdf8] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-[#112F4E] dark:text-zinc-100 leading-tight">
                    {sec.title}
                  </h3>
                </div>
                
                <div className="text-[#4A5D70] dark:text-zinc-350 text-[15px] leading-relaxed font-light space-y-4 pr-2">
                  {sec.content}
                </div>
              </section>
            );
          })}
        </main>

      </div>
    </div>
  );
}

export default function TermosEPrivacidade() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-zinc-950 flex flex-col text-[#112F4E] dark:text-zinc-100 transition-colors duration-300">
      <Navbar />

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12 pt-16 pb-8 text-center overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#1a8ccc]/5 dark:bg-white/5 rounded-full -translate-y-1/2 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E8F2F8] dark:bg-[#1a8ccc]/10 text-[#1a8ccc] dark:text-[#38bdf8] text-sm font-bold tracking-wide uppercase shadow-sm">
              <ShieldCheck className="w-4 h-4 animate-pulse" />
              Leitura Transparente
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-[4rem] font-medium text-[#112F4E] dark:text-zinc-100 tracking-tight leading-[1.1]">
              Termos de Uso & <br className="sm:hidden" />
              <span className="text-[#1a8ccc] dark:text-[#38bdf8] italic font-serif">Privacidade</span>
            </h2>
            
            <p className="text-base md:text-lg text-[#4A5D70] dark:text-zinc-400 font-light leading-relaxed">
              Diretrizes claras, transparentes e sem juridiquês complexo para você interagir com segurança na plataforma comercial 
              <strong> Navegando SP</strong>.
            </p>

            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-[#E2E8F0] dark:border-zinc-800 rounded-full shadow-sm text-xs text-[#94A3B8] font-medium">
              <Clock className="w-3.5 h-3.5 text-[#1a8ccc]" />
              <span>Última atualização: 27 de Maio de 2026</span>
            </div>
          </div>
        </section>

        {/* Conteúdo com Abas */}
        <section className="w-full relative z-20">
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-10 h-10 border-4 border-[#1a8ccc] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-[#94A3B8] font-light">Carregando diretrizes de privacidade...</p>
            </div>
          }>
            <TermosContent />
          </Suspense>
        </section>

        {/* Seção de Suporte a Dúvidas */}
        <section className="w-full bg-white dark:bg-zinc-900 py-16 px-6 md:px-12 border-t border-[#E2E8F0] dark:border-zinc-800 relative z-20 transition-colors duration-300">
          <div className="max-w-[800px] mx-auto text-center flex flex-col items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F2F8] dark:bg-zinc-800 flex items-center justify-center shadow-sm">
              <HelpCircle className="w-6 h-6 text-[#1a8ccc] dark:text-[#38bdf8]" />
            </div>
            <h3 className="text-2xl font-bold text-[#112F4E] dark:text-zinc-100">Restou alguma dúvida?</h3>
            <p className="text-sm md:text-base text-[#4A5D70] dark:text-zinc-400 font-light leading-relaxed">
              Nossa prioridade número um é a sua transparência e segurança. Se possuir qualquer questionamento comercial sobre as regras do Navegando SP ou deseja sugerir melhorias nas políticas, fale conosco.
            </p>
            <Link
              href="mailto:suporte@omnistring.com"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#FAF7F2] dark:bg-zinc-900 border border-[#E2E8F0] dark:border-zinc-800 text-[#112F4E] dark:text-zinc-200 rounded-2xl text-sm font-semibold hover:border-[#112F4E] dark:hover:border-zinc-300 hover:-translate-y-0.5 transition-all shadow-sm"
            >
              Falar com o Suporte
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

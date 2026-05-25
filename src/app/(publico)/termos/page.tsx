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

// Conteúdo estruturado para fácil manutenção e renderização dinâmica
const SECTIONS_TERMOS = [
  {
    id: "objetivo",
    title: "1. Objetivo da Plataforma",
    icon: Scale,
    content: (
      <>
        <p className="mb-4">
          O <strong>SAC Marília ao Contrário</strong> é uma iniciativa cívica independente, de caráter social e colaborativo, dedicada a mapear, fiscalizar e documentar problemas de infraestrutura urbana, saneamento, iluminação pública e zeladoria na cidade de Marília/SP.
        </p>
        <p>
          Nosso objetivo é dar voz aos cidadãos, promovendo a união da comunidade para cobrar transparência e eficiência das equipes responsáveis de forma positiva e estruturada.
        </p>
      </>
    )
  },
  {
    id: "postagens",
    title: "2. Cadastro e Diretrizes de Publicação",
    icon: FileText,
    content: (
      <>
        <p className="mb-4">
          Para registrar uma reclamação ou relato na plataforma, o usuário deve se autenticar de forma simples e segura utilizando exclusivamente a sua <strong>Conta do Google</strong>. Ao publicar qualquer conteúdo, você concorda que:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li><strong>Veracidade:</strong> O problema relatado deve ser real, localizado em Marília e retratar fielmente a situação de infraestrutura.</li>
          <li><strong>Zeladoria e Foco Cívico:</strong> O alvo das reclamações devem ser bueiros, asfalto, calçadas, postes ou outros bens públicos. É estritamente proibido focar em pessoas físicas, direcionar ofensas de cunho moral ou fazer ataques pessoais.</li>
          <li><strong>Propriedade das Imagens:</strong> As fotos anexadas devem retratar exclusivamente o problema urbano sob fiscalização.</li>
        </ul>
        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 rounded-r-xl text-sm">
          <p className="font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 mb-1">
            <AlertCircle className="w-4 h-4 shrink-0" /> Conteúdo Abusivo
          </p>
          Publicações que contenham propaganda eleitoral ou comercial, nudez, discurso de ódio ou imagens não relacionadas ao urbanismo de Marília serão sumariamente removidas pela administração.
        </div>
      </>
    )
  },
  {
    id: "gamificacao",
    title: "3. Gamificação, XP e Patentes Cívicas",
    icon: Trophy,
    content: (
      <>
        <p className="mb-4">
          Implementamos uma dinâmica de gamificação saudável (XP e Patentes como "Observador", "Colaborador" e "Guardião") para reconhecer os cidadãos mais ativos. As regras de engajamento são:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Cada novo relato honesto gera <strong>+5 XP</strong>.</li>
          <li>Apoiar o relato de um vizinho através do botão "Concordar" confere <strong>+1 XP</strong>.</li>
          <li>Problemas confirmados como resolvidos geram bônus de XP para quem reportou e quem concordou.</li>
        </ul>
        <p className="mb-4">
          Para manter o ranking justo e confiável, monitoramos e coibimos atitudes artificiais (como "farpar" pontos votando repetidamente em problemas inexistentes ou criando dezenas de contas falsas).
        </p>
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border-l-4 border-rose-500 rounded-r-xl text-sm">
          <p className="font-semibold text-rose-800 dark:text-rose-300 flex items-center gap-1.5 mb-1">
            <Zap className="w-4 h-4 shrink-0" /> Penalidades
          </p>
          Usuários identificados fraudando o sistema de gamificação terão sua pontuação totalmente zerada e, em caso de reincidência, a conta será desativada permanentemente.
        </div>
      </>
    )
  },
  {
    id: "moderacao",
    title: "4. Moderação de Relatos e Direitos da Administração",
    icon: ShieldCheck,
    content: (
      <>
        <p className="mb-4">
          Como plataforma moderada de forma colaborativa, a equipe de administração do SAC Marília ao Contrário reserva-se o direito de:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Corrigir erros ortográficos evidentes ou alterar a categoria do relato para melhor organização (ex: mudar de "Asfalto" para "Iluminação" caso a foto ilustre um poste quebrado).</li>
          <li>Mesclar reclamações duplicadas criadas por usuários diferentes na exata mesma coordenada geográfica, consolidando os votos de "Concordo" e comentários em um único ponto para maximizar o impacto social.</li>
          <li>Marcar um relato como resolvido caso haja comprovação documental ou fotográfica da melhoria urbana.</li>
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
          Nosso compromisso fundamental é a privacidade e a segurança digital de quem colabora com o aplicativo. Para usufruir da plataforma, nós coletamos estritamente os seguintes dados:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="p-4 bg-white dark:bg-zinc-900 border border-[#E2E8F0] dark:border-zinc-800 rounded-2xl flex flex-col items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E8F2F8] dark:bg-zinc-800 text-[#1a8ccc] dark:text-[#38bdf8] flex items-center justify-center shadow-sm shrink-0">
              <Mail className="w-4.5 h-4.5" />
            </div>
            <div>
              <h4 className="font-bold text-xs mb-1">Autenticação</h4>
              <p className="text-xs text-[#4A5D70] dark:text-zinc-400 font-light">E-mail fornecido pelo Google para autenticação segura (sem senhas locais).</p>
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 border border-[#E2E8F0] dark:border-zinc-800 rounded-2xl flex flex-col items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E8F2F8] dark:bg-zinc-800 text-[#1a8ccc] dark:text-[#38bdf8] flex items-center justify-center shadow-sm shrink-0">
              <User className="w-4.5 h-4.5" />
            </div>
            <div>
              <h4 className="font-bold text-xs mb-1">Perfil Público</h4>
              <p className="text-xs text-[#4A5D70] dark:text-zinc-400 font-light">Nome de usuário ou apelido escolhido para os rankings cívicos.</p>
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 border border-[#E2E8F0] dark:border-zinc-800 rounded-2xl flex flex-col items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E8F2F8] dark:bg-zinc-800 text-[#1a8ccc] dark:text-[#38bdf8] flex items-center justify-center shadow-sm shrink-0">
              <MapPin className="w-4.5 h-4.5" />
            </div>
            <div>
              <h4 className="font-bold text-xs mb-1">Geolocalização</h4>
              <p className="text-xs text-[#4A5D70] dark:text-zinc-400 font-light">Coordenadas geográficas exatas do problema reportado.</p>
            </div>
          </div>
        </div>
        <p>
          <strong>Importante:</strong> Nós não solicitamos, coletamos ou armazenamos CPF, endereço residencial privado do cidadão, número de telefone ou quaisquer dados bancários/financeiros.
        </p>
      </>
    )
  },
  {
    id: "exposicao",
    title: "2. Exposição Pública de Relatos no Mapa",
    icon: MapPin,
    content: (
      <>
        <p className="mb-4">
          Por ser uma ferramenta de controle social e transparência, <strong>a foto, o título, a descrição, a categoria e a geolocalização dos relatos criados são públicos</strong> e ficam visíveis no mapa interativo para qualquer visitante da plataforma.
        </p>
        <p className="mb-4">
          Entretanto, o seu endereço de e-mail de cadastro é **estritamente sigiloso** e nunca é exibido publicamente no mapa ou para outros cidadãos. Apenas o seu apelido e patente de gamificação acompanham suas postagens no feed de atualizações.
        </p>
        <div className="p-4 bg-sky-50 dark:bg-sky-950/20 border-l-4 border-sky-500 rounded-r-xl text-sm">
          <p className="font-semibold text-sky-800 dark:text-sky-300 flex items-center gap-1.5 mb-1">
            <Eye className="w-4 h-4 shrink-0" /> Dica de Segurança Cívica
          </p>
          Ao tirar fotos de buracos ou vazamentos na sua rua, certifique-se de não enquadrar rostos de pessoas de forma nítida ou placas de veículos privados, preservando a intimidade da vizinhança.
        </div>
      </>
    )
  },
  {
    id: "seguranca",
    title: "3. Segurança da API e Proteção de Dados (LGPD)",
    icon: Fingerprint,
    content: (
      <>
        <p className="mb-4">
          Adotamos políticas rígidas de segurança para impedir vazamentos de informações ou varreduras automatizadas por parte de agentes maliciosos:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li><strong>API Blindada no Servidor:</strong> Criamos um canal proxy centralizado em `/api/publico/mapa`. Esse canal filtra as informações brutas do banco de dados (Firebase Firestore) e expõe exclusivamente os 5 dados indispensáveis para desenhar os pontos no mapa, eliminando o tráfego de dados internos sensíveis no navegador do usuário.</li>
          <li><strong>Controle de Cache:</strong> Ativamos sistemas inteligentes de cacheamento temporário para mitigar ataques de negação de serviço e preservar a integridade da nossa infraestrutura.</li>
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
          Utilizamos recursos mínimos de armazenamento interno do seu navegador (como `LocalStorage` e cookies básicos de sessão) para finalidades exclusivamente funcionais:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Manter a sua sessão autenticada com segurança enquanto você navega entre as abas e cria novos relatos.</li>
          <li>Lembrar a sua preferência estética de visualização (Tema Claro, Escuro ou Sincronizado com o Sistema Operacional).</li>
        </ul>
        <p className="mt-4">
          Nós <strong>nunca</strong> usamos cookies de rastreamento comportamental de terceiros, redes de publicidade direcionada ou ferramentas de remarketing comercial.
        </p>
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
          Em total conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD)</strong>, você é o proprietário absoluto das suas informações. A qualquer momento, você pode:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Editar suas informações de perfil público diretamente no Portal do Cidadão.</li>
          <li>Apagar um relato específico que você criou de forma instantânea.</li>
          <li><strong>Excluir sua Conta Permanentemente:</strong> Disponibilizamos uma opção em seu painel privado que deleta sua conta e todos os dados associados a ela de forma definitiva dos nossos servidores e bases de dados do Firebase.</li>
        </ul>
      </>
    )
  }
];

// Componente secundário que contém a lógica de abas e leitura dos Search Params
function TermosContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Lê a aba ativa da URL por padrão (?tab=termos ou ?tab=privacidade)
  const tabParam = searchParams.get("tab");
  const initialTab = tabParam === "privacidade" ? "privacidade" : "termos";
  
  const [activeTab, setActiveTab] = useState<"termos" | "privacidade">(initialTab);
  const [activeAnchor, setActiveAnchor] = useState<string>("");

  // Sincroniza a aba se o query param mudar
  useEffect(() => {
    if (tabParam === "privacidade" || tabParam === "termos") {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Função para trocar de aba e atualizar a URL de forma suave (sem forçar reload)
  const handleTabChange = (tab: "termos" | "privacidade") => {
    setActiveTab(tab);
    setActiveAnchor("");
    router.push(`/termos?tab=${tab}`, { scroll: false });
  };

  const currentSections = activeTab === "termos" ? SECTIONS_TERMOS : SECTIONS_PRIVACIDADE;

  // Efeito de destaque do link de âncora baseado na rolagem
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
      {/* ─── Tabs Navigation ─── */}
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

      {/* ─── Main Two Column Layout ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* ─── Coluna Esquerda: Índice Sticky & Resumo "Português Claro" ─── */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-8">
          
          {/* Índice Interativo */}
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

          {/* Card Resumo sem Juridiquês */}
          <div className="relative p-6 bg-gradient-to-br from-[#E8F2F8] to-white dark:from-zinc-900 dark:to-zinc-950 border border-sky-100 dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden">
            {/* Background patterns */}
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
                Leis são complexas. Por isso, resumimos as regras mais importantes da aba atual de forma simples e direta para você:
              </p>

              {activeTab === "termos" ? (
                <ul className="space-y-4 text-xs">
                  <li className="flex gap-3 items-start">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <strong className="text-[#112F4E] dark:text-zinc-200 block mb-0.5">Nada de ataques pessoais</strong>
                      <span className="text-[#4A5D70] dark:text-zinc-400 font-light">O app serve para fiscalizar buracos, postes apagados e asfalto, e não moradores ou funcionários da cidade.</span>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <Camera className="w-5 h-5 text-[#1a8ccc] dark:text-[#38bdf8] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#112F4E] dark:text-zinc-200 block mb-0.5">Fotos autênticas</strong>
                      <span className="text-[#4A5D70] dark:text-zinc-400 font-light">Colabore enviando imagens reais do problema urbano no local apontado no mapa de Marília.</span>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <Trophy className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#112F4E] dark:text-zinc-200 block mb-0.5">Sem trapaça de XP</strong>
                      <span className="text-[#4A5D70] dark:text-zinc-400 font-light">As patentes cívicas são para valorizar a ajuda honesta. Tentar inflar o XP artificialmente zera sua pontuação.</span>
                    </div>
                  </li>
                </ul>
              ) : (
                <ul className="space-y-4 text-xs">
                  <li className="flex gap-3 items-start">
                    <Shield className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#112F4E] dark:text-zinc-200 block mb-0.5">Seu e-mail é guardado a sete chaves</strong>
                      <span className="text-[#4A5D70] dark:text-zinc-400 font-light">Ele serve apenas para fazer login seguro. Nunca o exibiremos no mapa público nem venderemos a marqueteiros.</span>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <Map className="w-5 h-5 text-[#1a8ccc] dark:text-[#38bdf8] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#112F4E] dark:text-zinc-200 block mb-0.5">O mapa é seguro</strong>
                      <span className="text-[#4A5D70] dark:text-zinc-400 font-light">As coordenadas e as fotos do problema são públicas, mas todo o resto é blindado em servidores protegidos.</span>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <Trash2 className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#112F4E] dark:text-zinc-200 block mb-0.5">Liberdade de exclusão</strong>
                      <span className="text-[#4A5D70] dark:text-zinc-400 font-light">Você tem controle da sua conta e relatos. Se decidir sair, apagamos todos os seus dados definitivamente com um clique.</span>
                    </div>
                  </li>
                </ul>
              )}
            </div>
          </div>

        </aside>

        {/* ─── Coluna Direita: Conteúdo Principal e Detalhado ─── */}
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

// Componente wrapper principal
export default function TermosEPrivacidade() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-zinc-950 flex flex-col text-[#112F4E] dark:text-zinc-100 transition-colors duration-300">
      <Navbar />

      <main className="flex-1 flex flex-col">
        {/* ─── Hero Section ─── */}
        <section className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12 pt-16 pb-8 text-center overflow-hidden">
          {/* Decorative circles */}
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
              Diretrizes claras, transparentes e sem pegadinhas para você colaborar com total segurança no aplicativo 
              <strong> SAC Marília ao Contrário</strong>.
            </p>

            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-[#E2E8F0] dark:border-zinc-800 rounded-full shadow-sm text-xs text-[#94A3B8] font-medium">
              <Clock className="w-3.5 h-3.5 text-[#1a8ccc]" />
              <span>Última atualização: 25 de Maio de 2026</span>
            </div>
          </div>
        </section>

        {/* ─── Conteúdo com Abas (Carregamento via Suspense para mitigar problemas de build no NextJS) ─── */}
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

        {/* ─── Seção de Suporte a Dúvidas ─── */}
        <section className="w-full bg-white dark:bg-zinc-900 py-16 px-6 md:px-12 border-t border-[#E2E8F0] dark:border-zinc-800 relative z-20 transition-colors duration-300">
          <div className="max-w-[800px] mx-auto text-center flex flex-col items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F2F8] dark:bg-zinc-800 flex items-center justify-center shadow-sm">
              <HelpCircle className="w-6 h-6 text-[#1a8ccc] dark:text-[#38bdf8]" />
            </div>
            <h3 className="text-2xl font-bold text-[#112F4E] dark:text-zinc-100">Restou alguma dúvida?</h3>
            <p className="text-sm md:text-base text-[#4A5D70] dark:text-zinc-400 font-light leading-relaxed">
              Transparência é a nossa prioridade número um. Se você tem questionamentos sobre como os dados do Firebase funcionam, 
              ou quer sugerir alguma melhoria técnica nas nossas políticas, fale diretamente conosco.
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

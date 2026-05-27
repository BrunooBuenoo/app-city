"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import VizoorLogo from "@/components/ui/VizoorLogo";
import { 
  Shield, 
  MapPin, 
  Users, 
  ArrowRight, 
  Compass, 
  ChevronLeft,
  Sparkles,
  Trophy,
  CheckCircle
} from "lucide-react";
import { signInWithGoogle, getUserProfile } from "@/services/firebase";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "@/components/layout/ThemeToggle";

export default function Login() {
  const router = useRouter();
  const { isLoggedIn, profile, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [error, setError] = useState("");

  // Se já logado de antemão, redireciona de forma inteligente
  useEffect(() => {
    if (!loading && isLoggedIn && profile) {
      if (profile.funcao === "admin") {
        router.push("/admin/dashboard");
      } else if (profile.funcao === "empresa") {
        router.push("/empresa/dashboard");
      } else if (profile.funcao === "parceiro") {
        router.push("/parceiro/dashboard");
      } else if (profile.perfilCompleto) {
        router.push("/usuario/dashboard");
      } else {
        router.push("/completar-perfil");
      }
    }
  }, [loading, isLoggedIn, profile, router]);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setError("");

    // Chamamos signInWithGoogle de forma síncrona dentro do evento de clique.
    signInWithGoogle(isAdminLogin)
      .then(async (user) => {
        const userProfile = await getUserProfile(user.uid);
        if (userProfile?.funcao === "admin") {
          router.push("/admin/dashboard");
        } else if (userProfile?.funcao === "empresa") {
          router.push("/empresa/dashboard");
        } else if (userProfile?.funcao === "parceiro") {
          router.push("/parceiro/dashboard");
        } else if (userProfile?.perfilCompleto) {
          router.push("/usuario/dashboard");
        } else {
          router.push("/completar-perfil");
        }
      })
      .catch((err: any) => {
        console.error("Login error:", err);
        setError("Não foi possível realizar o login com o Google. Tente novamente.");
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-zinc-950 flex flex-col text-[#112F4E] dark:text-zinc-100 transition-colors duration-300 relative overflow-hidden">
      
      {/* Botão de Voltar para a Landing Page (Sobre) e ThemeToggle flutuantes no topo */}
      <div className="absolute top-6 left-6 right-6 z-50 flex items-center justify-between pointer-events-none">
        <Link 
          href="/sobre" 
          className="pointer-events-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/80 dark:bg-zinc-900/80 hover:bg-white dark:hover:bg-zinc-900 text-[#4A5D70] dark:text-zinc-300 hover:text-[#112F4E] dark:hover:text-zinc-100 border border-[#E2E8F0] dark:border-zinc-800 backdrop-blur-md text-xs font-semibold shadow-sm hover:shadow transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          Conhecer o Clube
        </Link>
        
        <div className="pointer-events-auto bg-white/80 dark:bg-zinc-900/80 border border-[#E2E8F0] dark:border-zinc-800 rounded-xl p-1 backdrop-blur-md shadow-sm">
          <ThemeToggle />
        </div>
      </div>
      
      {/* Barra estética fina no topo da página */}
      <div className="w-full h-1.5 bg-gradient-to-r from-[#1a8ccc] via-[#10B981] to-[#F59E0B] relative z-40" />

      <div className="flex-1 flex flex-col lg:flex-row">
        
        {/* ─── Coluna Esquerda: Branding & Ilustração Hero ─── */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#112F4E] to-[#1E4E80] dark:from-zinc-950 dark:to-zinc-900 p-16 flex-col justify-between relative overflow-hidden border-r border-[#E2E8F0]/10 dark:border-zinc-800/40">
          
          {/* Círculos decorativos fluidos de vidro no fundo */}
          <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-[#1a8ccc]/10 dark:bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-[#10B981]/5 dark:bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl pointer-events-none" />

          {/* Logo do App */}
          <div className="relative z-10">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <VizoorLogo height={36} inverted />
            </Link>
          </div>

          {/* Conteúdo Informativo */}
          <div className="relative z-10 space-y-10 my-auto max-w-lg">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 text-white text-[10px] font-extrabold uppercase tracking-widest shadow-sm">
              Apoie o comércio local e economize
            </div>

            <h1 className="text-4xl xl:text-5xl font-medium text-white leading-[1.1] tracking-tight">
              Os melhores cupons de <br />
              <span className="text-[#38BDF8] italic font-serif">São Paulo.</span>
            </h1>
            
            <p className="text-white/60 text-lg font-light leading-relaxed">
              Aproveite benefícios e patrocínios incríveis no comércio do Estado de São Paulo. Resgate cupons exclusivos de restaurantes, clínicas, oficinas e muito mais.
            </p>

            {/* Diferenciais da Plataforma */}
            <div className="space-y-4 pt-4">
              {[
                { Icon: MapPin, text: "Encontre parceiros comerciais de todas as categorias no mapa", color: "text-[#38BDF8] bg-[#38BDF8]/10" },
                { Icon: Users, text: "Resgate cupons e descontos exclusivos diretamente no balcão", color: "text-[#34D399] bg-[#34D399]/10" },
                { Icon: Trophy, text: "Descubra novos locais parceiros perto de você", color: "text-amber-400 bg-amber-400/10" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg ${item.color} flex items-center justify-center shrink-0`}>
                    <item.Icon className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-white/70 text-sm font-light">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rodapé do Painel Esquerdo */}
          <div className="relative z-10">
            <p className="text-white/30 text-xs">
              © 2026 Navegando SP. Todos os direitos reservados.
            </p>
          </div>

          {/* Ilustração icônica da Hero */}
          <div className="absolute bottom-0 right-0 z-30 pointer-events-none translate-y-[20%] translate-x-[5%] scale-90 xl:scale-100 origin-bottom-right transition-transform duration-300">
            <img 
              src="/image/victor.png" 
              alt="Navegando SP" 
              className="w-[280px] xl:w-[350px] h-auto object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.3)] animate-[float_6s_ease-in-out_infinite]"
              style={{
                filter: "drop-shadow(0 20px 40px rgba(0, 0, 0, 0.25))"
              }}
            />
          </div>
        </div>

        {/* ─── Coluna Direita: Painel e Formulário de Login ─── */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-20">
          
          {/* Fundo decorativo para mobile */}
          <div className="lg:hidden absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 right-0 w-64 h-64 bg-[#1a8ccc]/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl" />
          </div>

          <div className="w-full max-w-md space-y-8 relative z-10">
            
            {/* Logo do App visível apenas no Mobile */}
            <div className="lg:hidden text-center mb-4">
              <div className="inline-flex items-center gap-3">
                <VizoorLogo height={36} />
              </div>
            </div>

            {/* Cabeçalho de Boas-vindas */}
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-3 text-[#112F4E] dark:text-white">
                Bem-vindo de volta
              </h2>
              <p className="text-sm md:text-base font-light leading-relaxed text-[#4A5D70] dark:text-zinc-400">
                Entre de forma instantânea com sua conta Google para acessar seus cupons de descontos e mapa comercial.
              </p>
            </div>

            {/* Controles de Autenticação */}
            <div className="space-y-4">
              
              {/* Checkbox Admin */}
              <label 
                className="flex items-center gap-3 px-4 py-3.5 border rounded-2xl cursor-pointer transition-all duration-300 select-none bg-white dark:bg-zinc-900 border-[#E2E8F0] dark:border-zinc-800 hover:border-[#1a8ccc] dark:hover:border-zinc-700 shadow-sm"
              >
                <input
                  type="checkbox"
                  checked={isAdminLogin}
                  onChange={(e) => setIsAdminLogin(e.target.checked)}
                  className="w-4.5 h-4.5 rounded border-slate-350 dark:border-zinc-700 text-[#1a8ccc] focus:ring-[#1a8ccc] accent-[#1a8ccc] cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="text-xs md:text-sm font-semibold text-[#112F4E] dark:text-zinc-200">
                    Entrar como Administrador
                  </span>
                  <span className="text-[10px] text-[#94A3B8] font-light">
                    Apenas para moderadores gerais
                  </span>
                </div>
              </label>


              {/* Botão de Login com Google - Premium */}
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-6 py-4.5 border-2 rounded-2xl font-semibold text-base shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:pointer-events-none bg-white dark:bg-zinc-900 border-[#E2E8F0] dark:border-zinc-800 hover:border-[#1a8ccc] dark:hover:border-zinc-700 text-[#112F4E] dark:text-white"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-[#1a8ccc] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5.5 h-5.5 shrink-0" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                )}
                <span>{isLoading ? "Conectando..." : "Entrar com Google"}</span>
              </button>

              {/* Mensagem de Erro formatada */}
              {error && (
                <p className="text-sm text-center text-[#EF4444] bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 px-4 py-3 rounded-xl font-medium">
                  {error}
                </p>
              )}

              {/* Divisor Visual */}
              <div className="flex items-center gap-4 py-2">
                <div className="flex-1 h-px bg-[#E2E8F0] dark:bg-zinc-800" />
                <span className="text-xs font-bold tracking-widest text-[#94A3B8]" style={{ fontVariant: "all-small-caps" }}>ou</span>
                <div className="flex-1 h-px bg-[#E2E8F0] dark:bg-zinc-800" />
              </div>

              {/* Botão Secundário: Explorar Mapa sem Login */}
              <Link
                href="/"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 border rounded-2xl font-semibold text-sm transition-all duration-300 bg-white dark:bg-zinc-900/50 hover:bg-[#FAF7F2] dark:hover:bg-zinc-900 border-[#E2E8F0] dark:border-zinc-800 text-[#4A5D70] dark:text-zinc-300 hover:text-[#112F4E] dark:hover:text-white"
              >
                <Compass className="w-4.5 h-4.5 text-[#1a8ccc] dark:text-[#38bdf8] shrink-0" />
                Explorar o mapa anonimamente
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Aceitação de Termos com links corretos */}
            <p className="text-center text-xs leading-relaxed text-[#94A3B8] px-4 font-light">
              Ao continuar e se autenticar, você concorda com os nossos <br />
              <Link href="/termos?tab=termos" className="text-[#1a8ccc] dark:text-[#38bdf8] font-semibold hover:underline underline-offset-2">
                Termos de Uso
              </Link>
              {" "}e{" "}
              <Link href="/termos?tab=privacidade" className="text-[#1a8ccc] dark:text-[#38bdf8] font-semibold hover:underline underline-offset-2">
                Política de Privacidade
              </Link>
              .
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

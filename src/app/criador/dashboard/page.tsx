"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Loader2, MapPin, Settings, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function CriadorDashboardPage() {
  const router = useRouter();
  const { isLoggedIn, loading, profile } = useAuth();

  // TODO: Reativar autenticação quando o login estiver implementado
  // useEffect(() => {
  //   if (loading) return;
  //   if (!isLoggedIn) {
  //     router.push("/login");
  //     return;
  //   }
  //   if (profile?.funcao !== "criador" && profile?.funcao !== "admin") {
  //     router.push("/usuario/dashboard");
  //   }
  // }, [isLoggedIn, loading, profile, router]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#1a8ccc]" />
        <p className="text-sm text-slate-500">Carregando area do criador...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 px-6 py-10 dark:bg-zinc-950/20 md:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200/60 bg-white p-8 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#1a8ccc]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#1a8ccc]">
          <Sparkles className="h-3.5 w-3.5" />
          Area do criador
        </div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Painel inicial do criador
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-zinc-400">
          A base do papel criador ja esta ativa na autenticacao e nas regras do projeto. O proximo passo e conectar este painel ao perfil publico, ao slug e aos vinculos com estabelecimentos.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/criador/perfil"
            className="inline-flex items-center gap-2 rounded-xl bg-[#1a8ccc] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1572a6]"
          >
            <Settings className="h-4 w-4" />
            Configurar perfil publico
          </Link>
          <Link
            href="/criador/estabelecimentos"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-950/60"
          >
            <MapPin className="h-4 w-4" />
            Vincular estabelecimentos
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-950/60"
          >
            <ExternalLink className="h-4 w-4" />
            Ver mapa global
          </Link>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import VizoorLogo from "@/components/ui/VizoorLogo";

// ─── PICTOGRAMAS AUTORAIS SVG INLINE ───
const IconSeta = ({ className = "w-3 h-3" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function Footer() {
  // Painéis disponíveis para teste sem autenticação
  const paineis = [
    {
      label: "Administrador",
      href: "/admin/dashboard",
      desc: "Gestão completa da plataforma",
      cor: "bg-slate-900 dark:bg-white/10 hover:bg-slate-800 dark:hover:bg-white/15 text-white",
      emoji: "⚙️"
    },
    {
      label: "Criador de Conteúdo",
      href: "/criador/dashboard",
      desc: "Curadorias, roteiros e parcerias",
      cor: "bg-[#ffb700] hover:bg-[#e0a100] text-white",
      emoji: "✦"
    },
    {
      label: "Empresa / Estabelecimento",
      href: "/empresa/dashboard",
      desc: "Métricas, cupons e visitas reais",
      cor: "bg-[#0084ff] hover:bg-[#0074e0] text-white",
      emoji: "◆"
    },
    {
      label: "Usuário / Explorador",
      href: "/usuario/dashboard",
      desc: "Histórico, ranking e perfil",
      cor: "bg-emerald-500 hover:bg-emerald-600 text-white",
      emoji: "◉"
    }
  ];

  return (
    <footer className="bg-white dark:bg-zinc-950 pt-20 pb-8 px-6 md:px-12 mt-auto relative overflow-hidden border-t border-slate-200/60 dark:border-zinc-900 transition-colors duration-300">
      {/* Gradiente sutil de fundo */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none opacity-0 dark:opacity-100 transition-opacity" />

      <div className="relative max-w-[1400px] mx-auto">

        {/* ─── SEÇÃO DE PAINÉIS (Acesso Direto sem Autenticação) ─── */}
        <div className="mb-16 pb-12 border-b border-slate-200/60 dark:border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em]">
              Painéis do Sistema
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[7.5px] font-bold uppercase tracking-wider">
              Modo Teste
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {paineis.map((painel) => (
              <Link
                key={painel.href}
                href={painel.href}
                className={`flex items-center gap-3.5 px-5 py-3.5 rounded-2xl font-medium text-sm transition-all active:scale-[0.98] duration-200 ${painel.cor}`}
              >
                <span className="text-base leading-none opacity-80">{painel.emoji}</span>
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-[13px] leading-tight">{painel.label}</span>
                  <span className="text-[10px] opacity-70 font-light leading-tight mt-0.5">{painel.desc}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ─── GRID PRINCIPAL ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Marca */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4 group inline-flex">
              <VizoorLogo height={34} />
            </Link>
            <p className="text-slate-500 dark:text-zinc-400 font-light text-sm leading-relaxed">
              Plataforma social de descoberta local. Conectando pessoas, criadores regionais e estabelecimentos físicos através de um mapa social inteligente.
            </p>
          </div>

          {/* Links da Plataforma */}
          <div>
            <h4 className="text-[9px] font-bold text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-5">
              Plataforma
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Mapa Global", href: "/" },
                { label: "Sobre a Vizoor", href: "/sobre" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5 group"
                  >
                    <IconSeta className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ecossistema */}
          <div>
            <h4 className="text-[9px] font-bold text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-5">
              Ecossistema
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Para Estabelecimentos", href: "/sobre#anunciantes" },
                { label: "Para Criadores", href: "/sobre#criadores" },
                { label: "Termos de Uso", href: "/termos?tab=termos" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5 group"
                  >
                    <IconSeta className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Acesso Rápido */}
          <div>
            <h4 className="text-[9px] font-bold text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-5">
              Acesso Rápido
            </h4>
            <div className="space-y-3">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/50 dark:border-white/5 text-slate-700 dark:text-white rounded-xl font-medium text-[13px] transition-all"
              >
                <span className="text-xs opacity-50">⚙️</span>
                Portal Administrativo
              </Link>
              <Link
                href="/criador/dashboard"
                className="flex items-center gap-2.5 px-4 py-2.5 bg-[#ffb700]/10 hover:bg-[#ffb700]/20 border border-[#ffb700]/10 text-[#b37f00] dark:text-[#ffb700] rounded-xl font-medium text-[13px] transition-all"
              >
                <span className="text-xs">✦</span>
                Portal do Criador
              </Link>
              <Link
                href="/usuario/dashboard"
                className="flex items-center gap-2.5 px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-xl font-medium text-[13px] transition-all"
              >
                <span className="text-xs">◉</span>
                Portal do Explorador
              </Link>
            </div>
          </div>
        </div>

        {/* ─── BARRA INFERIOR ─── */}
        <div className="pt-8 border-t border-slate-200/60 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400 dark:text-zinc-600">
            © 2026 Vizoor. Todos os direitos reservados.
          </p>
          <p className="text-sm text-slate-400/80 dark:text-zinc-600/80 font-light">
            Desenvolvido por <span className="font-semibold text-[#0084ff] dark:text-[#38bdf8]">Omnistring</span>
          </p>
          <div className="flex gap-6 text-sm text-slate-400 dark:text-zinc-600">
            <Link href="/termos?tab=termos" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Termos de Uso
            </Link>
            <Link href="/termos?tab=privacidade" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
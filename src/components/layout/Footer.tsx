import Link from "next/link";
import { MapPin, Trophy, Mail, Phone, ArrowRight } from "lucide-react";
import VizoorLogo from "@/components/ui/VizoorLogo";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-zinc-950 pt-20 pb-8 px-6 md:px-12 mt-auto relative overflow-hidden border-t border-[#E2E8F0] dark:border-zinc-900 transition-colors duration-300">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none opacity-0 dark:opacity-100 transition-opacity" />

      <div className="relative max-w-[1400px] mx-auto">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4 group inline-flex">
              <VizoorLogo height={34} />
            </Link>
            <p className="text-[#4A5D70] dark:text-[#94A3B8] font-light text-sm leading-relaxed">
              Plataforma de patrocínios e parcerias comerciais no Estado de São Paulo.
              Conectando você com as melhores vantagens.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-bold text-[#112F4E] dark:text-white uppercase tracking-widest mb-5">
              Plataforma
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Mapa Interativo", href: "/" },
                { label: "Sobre Nós", href: "/sobre" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#4A5D70] dark:text-[#94A3B8] hover:text-[#112F4E] dark:hover:text-white transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Gamificação */}
          <div>
            <h4 className="text-xs font-bold text-[#112F4E] dark:text-white uppercase tracking-widest mb-5">
              Fidelidade SP
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Níveis de Patrocinador", href: "/sobre#niveis", icon: "🛡️" },
                { label: "Regras de Fidelidade", href: "/termos?tab=termos", icon: "📋" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#4A5D70] dark:text-[#94A3B8] hover:text-[#112F4E] dark:hover:text-white transition-colors flex items-center gap-2"
                  >
                    <span>{link.icon}</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Portais */}
          <div>
            <h4 className="text-xs font-bold text-[#112F4E] dark:text-white uppercase tracking-widest mb-5">
              Acesso Rápido
            </h4>
            <div className="space-y-3">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 px-5 py-3 bg-[#FAF7F2] dark:bg-white/5 hover:bg-[#FAF7F2]/80 dark:hover:bg-white/10 border border-[#E2E8F0] dark:border-white/10 text-[#112F4E] dark:text-white rounded-xl font-medium text-sm transition-all"
              >
                <span className="material-symbols-outlined text-[16px] text-[#94A3B8]">admin_panel_settings</span>
                Portal Administrativo
              </Link>
              <Link
                href="/usuario/dashboard"
                className="flex items-center gap-2 px-5 py-3 bg-[#1a8ccc] dark:bg-[#0ea5e9] hover:bg-[#1572a6] dark:hover:bg-[#0284c7] text-white rounded-xl font-medium text-sm transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">person</span>
                Portal do Navegador
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#94A3B8] dark:text-[#64748B]">
            © 2026 Navegando SP. Todos os direitos reservados.
          </p>
          <p className="text-sm text-[#94A3B8]/80 dark:text-[#64748B]/80 font-light">
            Desenvolvido por <span className="font-semibold text-[#1a8ccc] dark:text-[#38bdf8]">Omnistring</span>
          </p>
          <div className="flex gap-6 text-sm text-[#94A3B8] dark:text-[#64748B]">
            <Link href="/termos?tab=termos" className="hover:text-[#112F4E] dark:hover:text-white transition-colors">
              Termos de Uso
            </Link>
            <Link href="/termos?tab=privacidade" className="hover:text-[#112F4E] dark:hover:text-white transition-colors">
              Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
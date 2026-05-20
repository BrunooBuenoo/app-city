import Link from "next/link";
import { MapPin, Trophy, Mail, Phone, ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0F2A42] pt-20 pb-8 px-6 md:px-12 mt-auto relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F33] to-transparent pointer-events-none" />

      <div className="relative max-w-[1400px] mx-auto">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a8ccc] to-[#1572a6] flex items-center justify-center shadow-md">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-base font-bold text-white block leading-tight">
                  SAC Marília
                </span>
                <span className="text-[10px] text-[#94A3B8] font-medium tracking-wide">
                  ao Contrário
                </span>
              </div>
            </div>
            <p className="text-[#94A3B8] font-light text-sm leading-relaxed">
              Plataforma de gestão urbana participativa.
              Sua voz transforma a cidade.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-5">
              Plataforma
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Mapa Interativo", href: "/" },
                { label: "Conheça o SAC", href: "/sobre" },
                { label: "Registrar Problema", href: "/reclamacao/nova" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#94A3B8] hover:text-white transition-colors flex items-center gap-1.5 group"
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
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-5">
              Gamificação
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Ranking de Cidadãos", href: "/usuario/ranking", icon: "🏆" },
                { label: "Patentes e Níveis", href: "/sobre#patentes", icon: "🛡️" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#94A3B8] hover:text-white transition-colors flex items-center gap-2"
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
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-5">
              Acesso Rápido
            </h4>
            <div className="space-y-3">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-medium text-sm transition-all"
              >
                <span className="material-symbols-outlined text-[16px] text-[#94A3B8]">admin_panel_settings</span>
                Portal Administrativo
              </Link>
              <Link
                href="/usuario/dashboard"
                className="flex items-center gap-2 px-5 py-3 bg-[#1a8ccc] hover:bg-[#1572a6] text-white rounded-xl font-medium text-sm transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">person</span>
                Portal do Cidadão
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#64748B]">
            © 2026 SAC Marília ao Contrário. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-sm text-[#64748B]">
            <Link href="/termos" className="hover:text-white transition-colors">
              Termos de Uso
            </Link>
            <Link href="/privacidade" className="hover:text-white transition-colors">
              Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
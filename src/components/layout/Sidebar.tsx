"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

export default function Sidebar() {
  const pathname = usePathname();

  const mainMenu = [
    { href: "/usuario/dashboard", icon: "dashboard", label: "Dashboard" },
    { href: "/usuario/minhas-reclamacoes", icon: "assignment", label: "Reclamações" },
    { href: "/mapa", icon: "map", label: "Mapa" },
  ];

  const features = [
    { href: "#", icon: "notifications", label: "Alertas" },
    { href: "/completar-perfil", icon: "person", label: "Perfil" },
    { href: "#", icon: "chat", label: "Feedback" },
  ];

  const general = [
    { href: "#", icon: "settings", label: "Configurações" },
    { href: "#", icon: "help", label: "Ajuda" },
    { href: "/", icon: "logout", label: "Sair" },
  ];

  const renderLink = (link: { href: string; icon: string; label: string }) => {
    const isActive = pathname === link.href;
    return (
      <Link
        key={link.label}
        href={link.href}
        className={clsx(
          "flex items-center gap-3 px-4 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 relative",
          isActive
            ? "bg-[#1a8ccc] text-white shadow-sm"
            : "text-[#4A5D70] hover:bg-[#F5F2ED]"
        )}
      >
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#1a8ccc] rounded-r-full -ml-3" />
        )}
        <span
          className={clsx("material-symbols-outlined text-[20px]", isActive ? "text-white" : "text-[#94A3B8]")}
          style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
        >
          {link.icon}
        </span>
        <span>{link.label}</span>
      </Link>
    );
  };

  return (
    <aside className="hidden md:flex h-screen w-64 fixed left-0 top-0 bg-white border-r border-[#E2E8F0] flex-col z-50">
      {/* Brand */}
      <div className="px-5 pt-5 pb-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#1a8ccc] flex items-center justify-center group-hover:scale-105 transition-transform">
            <span className="text-white text-base font-bold">S</span>
          </div>
          <span className="text-[16px] font-bold text-[#112F4E]">Sac Marília</span>
        </Link>
        <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#94A3B8] hover:bg-[#F5F2ED] transition-colors">
          <span className="material-symbols-outlined text-[18px]">chevron_left</span>
        </button>
      </div>

      {/* Search */}
      <div className="px-4 mb-4">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] text-[18px]">search</span>
          <input
            className="w-full bg-[#FAF7F2] border border-[#E2E8F0] rounded-xl pl-9 pr-3 py-2 text-[13px] text-[#112F4E] placeholder:text-[#94A3B8] outline-none focus:ring-2 focus:ring-[#1a8ccc]/15 transition-all"
            placeholder="Buscar..."
            type="text"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 overflow-y-auto no-scrollbar">
        <div className="mb-5">
          <p className="px-4 mb-2 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest">Menu Principal</p>
          <div className="space-y-0.5">{mainMenu.map(renderLink)}</div>
        </div>
        <div className="mb-5">
          <p className="px-4 mb-2 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest">Recursos</p>
          <div className="space-y-0.5">{features.map(renderLink)}</div>
        </div>
        <div className="mb-5">
          <p className="px-4 mb-2 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest">Geral</p>
          <div className="space-y-0.5">{general.map(renderLink)}</div>
        </div>
      </nav>

      {/* Bottom CTA */}
      <div className="px-4 pb-4 pt-2">
        <div className="bg-gradient-to-br from-[#1a8ccc] to-[#1572a6] rounded-2xl p-4 text-white">
          <p className="text-sm font-bold mb-0.5">Nova Reclamação</p>
          <p className="text-[11px] text-white/70 leading-snug mb-3">Reporte um problema na cidade</p>
          <Link href="/reclamacao/nova">
            <button className="w-full bg-white text-[#1a8ccc] text-[13px] font-semibold py-2 rounded-xl hover:bg-white/90 transition-colors">
              Reportar
            </button>
          </Link>
        </div>
      </div>
    </aside>
  );
}

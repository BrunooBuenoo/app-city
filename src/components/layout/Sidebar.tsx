"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/usuario/dashboard", icon: "dashboard", label: "Painel" },
    { href: "/usuario/minhas-reclamacoes", icon: "assignment", label: "Reclamações" },
    { href: "/mapa", icon: "map", label: "Mapa" },
    { href: "#", icon: "notifications", label: "Alertas" },
    { href: "/completar-perfil", icon: "person", label: "Perfil" },
  ];

  return (
    <aside className="hidden md:flex h-screen w-64 fixed left-0 top-0 bg-white border-r border-[#E2E8F0] flex-col z-50">
      {/* Brand */}
      <div className="px-6 pt-7 pb-6 border-b border-[#E2E8F0]">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#1a8ccc] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <span className="text-white text-xl font-bold leading-none">S</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#112F4E] leading-tight tracking-tight">
              Sac do Marília <span className="text-[#1a8ccc]">ao Contrário</span>
            </h1>
            <p className="text-[11px] text-[#94A3B8] font-medium tracking-widest uppercase">
              Cidadão
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.label}
              href={link.href}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative",
                isActive
                  ? "bg-[#E8F2F8] text-[#1a8ccc]"
                  : "text-[#4A5D70] hover:bg-[#FAF7F2] hover:text-[#112F4E]"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#1a8ccc] rounded-r-full" />
              )}
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {link.icon}
              </span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 pb-5 pt-3 border-t border-[#E2E8F0]">
        <Link href="/">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[#4A5D70] text-sm font-medium hover:bg-[#FAF7F2] hover:text-[#112F4E] transition-all">
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Sair
          </button>
        </Link>
      </div>
    </aside>
  );
}

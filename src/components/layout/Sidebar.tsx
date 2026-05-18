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
    <aside className="hidden md:flex h-screen w-64 fixed left-0 top-0 border-r border-outline-variant bg-surface shadow-sm flex-col p-unit z-50">
      <div className="mb-gutter flex items-center gap-3 px-2 mt-4">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-on-primary text-headline-sm">
            map
          </span>
        </div>
        <div>
          <h1 className="font-headline-sm text-[20px] font-bold text-primary leading-tight">
            App Marília
          </h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            Cidadão
          </p>
        </div>
      </div>
      <nav className="flex-1 space-y-2 mt-4">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.label}
              href={link.href}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-colors",
                isActive
                  ? "text-primary bg-primary-fixed-dim/20"
                  : "text-on-surface-variant hover:bg-surface-container-high active:scale-95 duration-150"
              )}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>{link.icon}</span>
              <span className="font-label-lg text-label-lg">{link.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-gutter border-t border-outline-variant pb-4">
        <Link href="/">
          <button className="w-full flex items-center justify-center gap-2 text-on-surface-variant py-3 rounded-xl font-label-lg text-label-lg hover:bg-surface-container-high transition-all">
            <span className="material-symbols-outlined">logout</span> Sair
          </button>
        </Link>
      </div>
    </aside>
  );
}

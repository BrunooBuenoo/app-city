"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/admin/dashboard", icon: "dashboard", label: "Painel" },
    { href: "/admin/relatorios", icon: "report", label: "Relatórios" },
    { href: "#", icon: "map", label: "Mapa" },
    { href: "/admin/categorias", icon: "category", label: "Categorias" },
    { href: "/admin/usuarios", icon: "group", label: "Usuários" },
    { href: "#", icon: "analytics", label: "Análise" },
  ];

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 border-r border-outline-variant dark:border-outline bg-surface dark:bg-inverse-surface shadow-sm flex flex-col p-unit z-50">
      <div className="mb-gutter flex items-center gap-3 px-2 mt-4">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-on-primary text-headline-sm">
            copy_all
          </span>
        </div>
        <div>
          <h1 className="font-headline-sm text-headline-sm font-bold text-primary dark:text-inverse-primary leading-tight">
            Sac Marília
          </h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            Admin
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
                  ? "text-primary dark:text-inverse-primary bg-primary-fixed-dim/20 dark:bg-primary-container/30"
                  : "text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-variant active:scale-95 duration-150"
              )}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>{link.icon}</span>
              <span className="font-label-lg text-label-lg">{link.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-gutter border-t border-outline-variant pb-4">
        <button className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-3 rounded-xl font-label-lg text-label-lg hover:bg-primary-container transition-all shadow-sm">
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            upload
          </span>{" "}
          Exportar
        </button>
      </div>
    </aside>
  );
}

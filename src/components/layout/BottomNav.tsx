"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

export default function BottomNav() {
  const pathname = usePathname();

  const links = [
    { href: "/mapa", icon: "home", label: "Início" },
    { href: "/usuario/minhas-reclamacoes", icon: "assignment", label: "Reclamações" },
    { href: "#", icon: "notifications", label: "Alertas" },
    { href: "/completar-perfil", icon: "person", label: "Perfil" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-5 pt-2.5 bg-white/90 backdrop-blur-xl border-t border-[#E2E8F0]">
      {links.map((link) => {
        const isActive = pathname === link.href || (link.href === '/mapa' && pathname === '/usuario/dashboard'); 
        return (
          <Link
            key={link.label}
            href={link.href}
            className={clsx(
              "flex flex-col items-center justify-center gap-0.5 px-4 py-1.5 transition-all duration-200 active:scale-90 rounded-xl",
              isActive
                ? "text-[#1a8ccc]"
                : "text-[#94A3B8] hover:text-[#4A5D70]"
            )}
          >
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {link.icon}
            </span>
            <span className="text-[11px] font-medium">{link.label}</span>
            {isActive && (
              <div className="w-4 h-0.5 bg-[#1a8ccc] rounded-full mt-0.5" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

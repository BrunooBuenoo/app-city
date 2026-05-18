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
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 bg-surface-container-lowest/80 backdrop-blur-md shadow-[0_-4px_20px_rgba(26,28,30,0.04)] rounded-t-xl">
      {links.map((link) => {
        const isActive = pathname === link.href || (link.href === '/mapa' && pathname === '/usuario/dashboard'); 
        return (
          <Link
            key={link.label}
            href={link.href}
            className={clsx(
              "flex flex-col items-center justify-center px-4 py-1 transition-colors active:scale-90 duration-200",
              isActive
                ? "bg-secondary-container text-on-secondary-container rounded-full"
                : "text-on-surface-variant hover:text-primary"
            )}
          >
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
              {link.icon}
            </span>
            <span className="font-label-md text-label-md">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

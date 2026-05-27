"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MapPin, Plus, Clock, User } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const items = [
    { href: "/usuario/dashboard", icon: Home, label: "Meu Painel" },
    { href: "/", icon: MapPin, label: "Mapa" },
    { href: "/usuario/perfil", icon: User, label: "Perfil" },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t flex items-center justify-around h-16 px-2"
      style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      {items.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center justify-center gap-0.5 py-2 px-3 rounded-lg transition-all"
            style={{
              color: isActive ? "var(--color-primary)" : "var(--color-text-muted)",
            }}
          >
            <item.icon className={`w-5 h-5 ${isActive ? "" : ""}`} />
            <span className={`text-[10px] ${isActive ? "font-semibold" : "font-medium"}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

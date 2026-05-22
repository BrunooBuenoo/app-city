"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MapPin, PlusCircle, Clock, User } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const items = [
    { href: "/usuario/dashboard", icon: Home, label: "Home" },
    { href: "/", icon: MapPin, label: "Mapa" },
    { href: "/usuario/reclamacao/nova", icon: PlusCircle, label: "Registrar", isAction: true },
    { href: "/usuario/historico", icon: Clock, label: "Alertas" },
    { href: "/usuario/perfil", icon: User, label: "Perfil" },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 glass-panel border-t flex items-center justify-around h-16 px-2"
      style={{ borderColor: "var(--color-border)" }}
    >
      {items.map((item) => {
        const isActive = pathname === item.href;

        if (item.isAction) {
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center justify-center -mt-5 w-14 h-14 rounded-2xl bg-[#1a8ccc] text-white shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              <item.icon className="w-6 h-6" />
            </Link>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center justify-center gap-0.5 py-2 px-3 rounded-xl transition-all"
            style={{
              color: isActive ? "var(--color-primary)" : "var(--color-text-muted)",
            }}
          >
            <item.icon className={`w-5 h-5 transition-transform ${isActive ? "scale-110" : ""}`} />
            <span className={`text-[10px] ${isActive ? "font-bold" : "font-medium"}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

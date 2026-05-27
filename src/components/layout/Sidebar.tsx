"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home, MapPin, FileText, Clock, Trophy, User,
  LogOut, Shield,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { signOutUser } from "@/services/firebase";
import ThemeToggle from "@/components/ui/ThemeToggle";

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isExpanded, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile } = useAuth();

  const handleLogout = async () => {
    await signOutUser();
    router.push("/");
  };

  const menuItems = [
    { href: "/usuario/dashboard", icon: Home, label: "Dashboard" },
    { href: "/", icon: MapPin, label: "Mapa" },
    { href: "/usuario/minhas-reclamacoes", icon: FileText, label: "Reclamações" },
    { href: "/usuario/historico", icon: Clock, label: "Histórico" },
    { href: "/usuario/ranking", icon: Trophy, label: "Ranking" },
    { href: "/usuario/perfil", icon: User, label: "Perfil" },
  ];

  const userPhoto = profile?.foto || user?.photoURL || "";
  const userName = profile?.nome || user?.displayName || "Usuário";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <aside
      className="hidden md:flex flex-col h-full w-[220px] py-5 shrink-0 border-r"
      style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      {/* Logo */}
      <div className="px-5 mb-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-br from-[#1a8ccc] to-[#1572a6] flex items-center justify-center shadow-sm group-hover:shadow-md transition-all shrink-0">
            <MapPin className="w-4.5 h-4.5 text-white" />
          </div>
          <div className="text-left leading-none">
            <span className="text-xs font-extrabold block" style={{ color: "var(--color-text)" }}>
              SAC Marília
            </span>
            <span className="text-[10px] font-bold tracking-wide" style={{ color: "var(--color-text-secondary)" }}>
              ao Contrário
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-0.5 px-3 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group"
              style={{
                backgroundColor: isActive ? "var(--color-primary-container)" : "transparent",
                color: isActive ? "var(--color-primary)" : "var(--color-text-secondary)",
                fontWeight: isActive ? 600 : 400,
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = "var(--color-bg-alt)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              {isActive && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full"
                  style={{ backgroundColor: "var(--color-primary)" }}
                />
              )}
              <item.icon className="w-[18px] h-[18px] shrink-0" />
              <span className="text-[14px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="flex flex-col gap-1 px-3 mt-auto pt-4">
        <div className="h-px mx-2 mb-2" style={{ backgroundColor: "var(--color-border)" }} />

        <ThemeToggle compact />

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer hover:bg-red-50 dark:hover:bg-red-500/10 group"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <LogOut className="w-[18px] h-[18px] shrink-0 group-hover:text-red-500 transition-colors" />
          <span className="text-[14px] group-hover:text-red-500 transition-colors">Sair</span>
        </button>

        {/* User info */}
        <div className="flex items-center gap-3 px-3 py-3 mt-1 rounded-lg" style={{ backgroundColor: "var(--color-bg-alt)" }}>
          <div
            className="w-9 h-9 rounded-full overflow-hidden shrink-0 border"
            style={{ borderColor: "var(--color-border)" }}
          >
            {userPhoto ? (
              <img src={userPhoto} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#1a8ccc] flex items-center justify-center text-white text-sm font-semibold">
                {userInitial}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold truncate" style={{ color: "var(--color-text)" }}>
              {userName}
            </p>
            <p className="text-[11px] truncate" style={{ color: "var(--color-text-muted)" }}>
              Painel do Cidadão
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

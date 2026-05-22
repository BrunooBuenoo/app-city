"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home, MapPin, FileText, Clock, Trophy, User,
  HelpCircle, LogOut, ChevronDown, ChevronUp, Settings, Shield,
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
    { href: "/usuario/minhas-reclamacoes", icon: FileText, label: "Minhas Reclamações" },
    { href: "/usuario/historico", icon: Clock, label: "Histórico" },
    { href: "/usuario/ranking", icon: Trophy, label: "Ranking" },
    { href: "/usuario/perfil", icon: User, label: "Perfil" },
  ];

  const userName = profile?.nome || user?.displayName || "Usuário";
  const userEmail = profile?.email || user?.email || "";
  const userPhoto = profile?.foto || user?.photoURL || "";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <aside
      className={`hidden md:flex flex-col h-full transition-all duration-300 ${
        isExpanded ? "w-[240px]" : "w-[64px]"
      }`}
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 p-3">
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-9 h-9 rounded-xl transition-colors shrink-0 cursor-pointer"
          style={{ color: "var(--color-primary)" }}
          title={isExpanded ? "Recolher" : "Expandir"}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-bg-alt)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>
        {isExpanded && (
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1a8ccc] to-[#1572a6] flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold block truncate leading-tight" style={{ color: "var(--color-text)" }}>
                SAC Marília
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-primary)" }}>
                Painel Cidadão
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="h-px mx-3" style={{ backgroundColor: "var(--color-border)" }} />

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`relative flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200 group`}
              style={{
                backgroundColor: isActive ? "var(--color-primary-container)" : "transparent",
                color: isActive ? "var(--color-primary)" : "var(--color-text-secondary)",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = "var(--color-bg-alt)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
              }}
              title={!isExpanded ? item.label : undefined}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full" style={{ backgroundColor: "var(--color-primary)" }} />
              )}
              <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform ${isActive ? "scale-110" : "group-hover:scale-105"}`} />
              {isExpanded && (
                <span className={`text-sm ${isActive ? "font-semibold" : "font-medium"}`}>
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="px-2 py-3 space-y-2">
        <div className="h-px mx-1 mb-2" style={{ backgroundColor: "var(--color-border)" }} />

        {/* Theme Toggle */}
        {isExpanded ? (
          <div className="px-1">
            <ThemeToggle />
          </div>
        ) : (
          <div className="flex justify-center">
            <ThemeToggle compact />
          </div>
        )}

        <button
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl transition-colors cursor-pointer"
          style={{ color: "var(--color-text-secondary)" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-bg-alt)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          title={!isExpanded ? "Suporte" : undefined}
        >
          <HelpCircle className="w-5 h-5 flex-shrink-0" />
          {isExpanded && <span className="text-sm font-medium">Suporte</span>}
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl transition-colors cursor-pointer hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
          style={{ color: "var(--color-text-secondary)" }}
          title={!isExpanded ? "Sair" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isExpanded && <span className="text-sm font-medium">Sair</span>}
        </button>

        {/* User Card */}
        <div
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border mt-1 ${isExpanded ? "" : "justify-center"}`}
          style={{
            backgroundColor: "var(--color-surface-elevated)",
            borderColor: "var(--color-border)",
          }}
        >
          <div className="w-8 h-8 rounded-full overflow-hidden shadow-sm shrink-0 border-2" style={{ borderColor: "var(--color-surface)" }}>
            {userPhoto ? (
              <img src={userPhoto} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#1a8ccc] to-[#1572a6] flex items-center justify-center text-white text-sm font-bold">
                {userInitial}
              </div>
            )}
          </div>
          {isExpanded && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: "var(--color-text)" }}>{userName}</p>
              <p className="text-[9px] truncate" style={{ color: "var(--color-text-muted)" }}>{userEmail}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

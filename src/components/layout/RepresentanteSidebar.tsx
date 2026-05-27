"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Store, Tag, BarChart2,
  LogOut, MapPin, Building2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { signOutUser } from "@/services/firebase";
import ThemeToggle from "@/components/ui/ThemeToggle";
import VizoorLogo from "@/components/ui/VizoorLogo";

interface RepresentanteSidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export default function RepresentanteSidebar({ isExpanded, onToggle }: RepresentanteSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile } = useAuth();

  const handleLogout = async () => {
    await signOutUser();
    router.push("/");
  };

  const menuItems = [
    { href: "/representante/dashboard", icon: LayoutDashboard, label: "Painel Geral" },
    { href: "/representante/parceiros", icon: Store, label: "Parceiros" },
    { href: "/representante/cupons", icon: Tag, label: "Cupons Ativos" },
    { href: "/representante/relatorios", icon: BarChart2, label: "Relatórios" },
  ];

  const userPhoto = profile?.foto || user?.photoURL || "";
  const userName = profile?.nome || user?.displayName || "Representante";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <aside
      className="hidden md:flex flex-col h-full w-[220px] py-5 shrink-0 border-r"
      style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      {/* Logo */}
      <div className="px-5 mb-6">
        <Link href="/" className="flex items-center group">
          <VizoorLogo height={26} />
        </Link>
      </div>

      {/* Badge de papel */}
      <div className="px-4 mb-4">
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-[#F59E0B]/10 text-[#F59E0B] w-full">
          <Building2 className="w-3.5 h-3.5" />
          Gestor de Cidade
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-0.5 px-3 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
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
              <div className="w-full h-full bg-[#F59E0B] flex items-center justify-center text-white text-sm font-semibold">
                {userInitial}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold truncate" style={{ color: "var(--color-text)" }}>
              {userName}
            </p>
            <p className="text-[11px] truncate" style={{ color: "var(--color-text-muted)" }}>
              Gestor de Cidade
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

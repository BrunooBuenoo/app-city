"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3, ClipboardList, FileText, FolderOpen, Users,
  HelpCircle, LogOut, MapPin, Shield,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { signOutUser } from "@/services/firebase";
import ThemeToggle from "@/components/ui/ThemeToggle";

interface AdminSidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export default function AdminSidebar({ isExpanded, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile } = useAuth();

  const handleLogout = async () => {
    await signOutUser();
    router.push("/");
  };

  const menuItems = [
    { href: "/admin/dashboard", icon: BarChart3, label: "Dashboard" },
    { href: "/admin/mapa", icon: MapPin, label: "Mapa" },
    { href: "/admin/reclamacoes", icon: ClipboardList, label: "Reclamações" },
    { href: "/admin/relatorios", icon: FileText, label: "Relatórios" },
    { href: "/admin/categorias", icon: FolderOpen, label: "Categorias" },
    { href: "/admin/usuarios", icon: Users, label: "Usuários" },
  ];

  const userPhoto = profile?.foto || user?.photoURL || "";
  const userName = profile?.nome || user?.displayName || "Admin";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <aside
      className="hidden md:flex flex-col items-center h-full w-[68px] py-3 gap-1 shrink-0"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* Logo */}
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] flex items-center justify-center mb-1 shrink-0">
        <Shield className="w-5 h-5 text-white" />
      </div>

      <div className="w-8 h-px my-1 shrink-0" style={{ backgroundColor: "var(--color-border)" }} />

      {/* Navigation */}
      <nav className="flex-1 flex flex-col items-center gap-0.5 w-full px-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.label}
              href={item.href}
              className="relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200 group"
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
              title={item.label}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full" style={{ backgroundColor: "var(--color-primary)" }} />
              )}
              <item.icon className={`w-5 h-5 transition-transform ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="flex flex-col items-center gap-1 w-full px-2 shrink-0">
        <div className="w-8 h-px mb-1" style={{ backgroundColor: "var(--color-border)" }} />

        <ThemeToggle compact />

        <button
          className="flex items-center justify-center w-11 h-11 rounded-xl transition-colors cursor-pointer"
          style={{ color: "var(--color-text-secondary)" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-bg-alt)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          title="Suporte"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-11 h-11 rounded-xl transition-colors cursor-pointer hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
          style={{ color: "var(--color-text-secondary)" }}
          title="Sair"
        >
          <LogOut className="w-5 h-5" />
        </button>

        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full overflow-hidden shadow-sm shrink-0 border-2 mt-1 cursor-pointer"
          style={{ borderColor: "var(--color-border)" }}
          title={userName}
        >
          {userPhoto ? (
            <img src={userPhoto} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] flex items-center justify-center text-white text-sm font-bold">
              {userInitial}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

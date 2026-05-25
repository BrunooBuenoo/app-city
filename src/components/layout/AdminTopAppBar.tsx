"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  HelpCircle, Mail, Bell, Calendar, Menu, X, BarChart3, 
  ClipboardList, FileText, FolderOpen, Users, LogOut, MapPin,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { signOutUser } from "@/services/firebase";

export default function AdminTopAppBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const today = new Date();
  const dateStr = today.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "long", year: "numeric" });

  const userPhoto = profile?.foto || user?.photoURL || "";
  const userName = profile?.nome || user?.displayName || "Admin";
  const userInitial = userName.charAt(0).toUpperCase();

  const adminMenuItems = [
    { href: "/admin/dashboard", icon: BarChart3, label: "Dashboard" },
    { href: "/admin/mapa", icon: MapPin, label: "Mapa" },
    { href: "/admin/reclamacoes", icon: ClipboardList, label: "Reclamações" },
    { href: "/admin/relatorios", icon: FileText, label: "Relatórios" },
    { href: "/admin/categorias", icon: FolderOpen, label: "Categorias" },
    { href: "/admin/usuarios", icon: Users, label: "Usuários" },
  ];

  const handleSignOut = async () => {
    await signOutUser();
    setIsDrawerOpen(false);
    router.push("/");
  };

  return (
    <>
      <header
        className="fixed top-0 right-0 w-full z-40 glass-panel flex justify-between items-center h-16 px-4 md:px-8 border-b"
        style={{ borderColor: "var(--color-border)" }}
      >
        {/* Left — Mobile menu + title */}
        <div className="flex items-center gap-3 md:hidden">
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center justify-center w-10 h-10 rounded-xl transition-colors active:scale-95 duration-100 cursor-pointer"
            style={{ color: "var(--color-primary)" }}
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-[16px] font-bold" style={{ color: "var(--color-text)" }}>Painel Admin</span>
        </div>
        <div className="hidden md:block" />

        {/* Right — Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          <div
            className="hidden lg:flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl border text-[13px]"
            style={{
              backgroundColor: "var(--color-bg-alt)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-secondary)",
            }}
          >
            <Calendar className="w-4 h-4" style={{ color: "var(--color-text-muted)" }} />
            <span className="capitalize">{dateStr}</span>
          </div>
          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          <button
            className="hidden sm:flex w-9 h-9 rounded-xl items-center justify-center transition-colors cursor-pointer"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <Mail className="w-5 h-5" />
          </button>
          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center relative cursor-pointer"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full ring-2 ring-[var(--color-surface)]" />
          </button>
          <div className="h-8 w-px hidden sm:block" style={{ backgroundColor: "var(--color-border)" }} />
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center border overflow-hidden"
            style={{ backgroundColor: "var(--color-primary-container)", borderColor: "var(--color-border)" }}
          >
            {userPhoto ? (
              <img src={userPhoto} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-[22px]" style={{ color: "var(--color-primary)", fontVariationSettings: "'FILL' 1" }}>
                account_circle
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Slide-out Mobile Admin Navigation Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 backdrop-blur-sm transition-opacity"
            style={{ backgroundColor: "var(--overlay-bg)" }}
          />
          <div
            className="relative w-4/5 max-w-xs h-full shadow-2xl flex flex-col justify-between p-4 z-10 transition-transform duration-300"
            style={{ backgroundColor: "var(--color-bg)" }}
          >
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b" style={{ borderColor: "var(--color-border)" }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#1a8ccc] flex items-center justify-center">
                    <span className="text-white text-xs font-bold">S</span>
                  </div>
                  <span className="font-bold text-sm" style={{ color: "var(--color-text)" }}>Painel Admin</span>
                </div>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 rounded-lg transition-colors cursor-pointer"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {adminMenuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsDrawerOpen(false)}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors"
                      style={{
                        backgroundColor: isActive ? "var(--color-primary-container)" : "transparent",
                        color: isActive ? "var(--color-primary)" : "var(--color-text-secondary)",
                        fontWeight: isActive ? "600" : "400",
                      }}
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 space-y-2 border-t" style={{ borderColor: "var(--color-border)" }}>
              <button 
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors text-[#EF4444] hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                <span className="text-sm font-semibold">Sair Administrativo</span>
              </button>

              <div className="flex items-center gap-3 px-3 py-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center border overflow-hidden shrink-0"
                  style={{ backgroundColor: "var(--color-primary-container)", borderColor: "var(--color-border)" }}
                >
                  {userPhoto ? (
                    <img src={userPhoto} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-semibold" style={{ color: "var(--color-primary)" }}>
                      {userInitial}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: "var(--color-text)" }}>{userName}</p>
                  <p className="text-[10px] truncate" style={{ color: "var(--color-text-muted)" }}>Painel de Controle</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

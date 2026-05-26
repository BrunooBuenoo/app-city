"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Menu, X, Home, FileText, Clock, Trophy, User, LogOut, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { signOutUser } from "@/services/firebase";

export default function TopAppBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const userPhoto = profile?.foto || user?.photoURL || "";
  const userName = profile?.nome || user?.displayName || "Usuário";
  const userInitial = userName.charAt(0).toUpperCase();

  const menuItems = [
    { href: "/usuario/dashboard", icon: Home, label: "Dashboard" },
    { href: "/", icon: MapPin, label: "Mapa" },
    { href: "/usuario/minhas-reclamacoes", icon: FileText, label: "Minhas Reclamações" },
    { href: "/usuario/historico", icon: Clock, label: "Histórico" },
    { href: "/usuario/ranking", icon: Trophy, label: "Ranking" },
    { href: "/usuario/perfil", icon: User, label: "Perfil" },
  ];

  const handleSignOut = async () => {
    await signOutUser();
    setIsDrawerOpen(false);
    router.push("/");
  };

  return (
    <>
      <header
        className="fixed top-0 right-0 w-full z-40 flex justify-between items-center h-14 px-4 border-b"
        style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
      >
        {/* Left — Mobile menu */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors active:scale-95 duration-100 cursor-pointer"
            style={{ color: "var(--color-text)" }}
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-[15px] font-semibold" style={{ color: "var(--color-text)" }}>SAC Marília</span>
        </div>
        <div className="hidden md:block" />

        {/* Right — Minimal actions */}
        <div className="flex items-center gap-2">
          <button
            className="w-9 h-9 rounded-lg flex items-center justify-center relative cursor-pointer transition-colors"
            style={{ color: "var(--color-text-muted)" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--color-bg-alt)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full ring-2 ring-[var(--color-surface)]" />
          </button>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center border overflow-hidden cursor-pointer"
            style={{ borderColor: "var(--color-border)" }}
          >
            {userPhoto ? (
              <img src={userPhoto} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#1a8ccc] flex items-center justify-center text-white text-[12px] font-semibold">
                {userInitial}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Slide-out Mobile Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 transition-opacity"
            style={{ backgroundColor: "var(--overlay-bg)" }}
          />
          <div
            className="relative w-4/5 max-w-[280px] h-full flex flex-col justify-between p-5 z-10"
            style={{ backgroundColor: "var(--color-surface)" }}
          >
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b" style={{ borderColor: "var(--color-border)" }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#1a8ccc] flex items-center justify-center">
                    <span className="text-white text-xs font-bold">S</span>
                  </div>
                  <span className="font-semibold text-[15px]" style={{ color: "var(--color-text)" }}>SAC Marília</span>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 rounded-lg transition-colors cursor-pointer"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-0.5">
                {menuItems.map((item) => {
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
                        fontWeight: isActive ? 600 : 400,
                      }}
                    >
                      <item.icon className="w-[18px] h-[18px] shrink-0" />
                      <span className="text-[14px]">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 space-y-2 border-t" style={{ borderColor: "var(--color-border)" }}>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer"
              >
                <LogOut className="w-[18px] h-[18px] shrink-0" />
                <span className="text-[14px] font-medium">Sair</span>
              </button>

              <div className="flex items-center gap-3 px-3 py-3 rounded-lg" style={{ backgroundColor: "var(--color-bg-alt)" }}>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center border overflow-hidden shrink-0"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  {userPhoto ? (
                    <img src={userPhoto} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#1a8ccc] flex items-center justify-center text-white text-[11px] font-semibold">
                      {userInitial}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold truncate" style={{ color: "var(--color-text)" }}>{userName}</p>
                  <p className="text-[11px] truncate" style={{ color: "var(--color-text-muted)" }}>Painel do Cidadão</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

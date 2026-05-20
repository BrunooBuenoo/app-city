"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { signOutUser } from "@/services/firebase";
import { 
  BarChart3, ClipboardList, MapPin, Bell, User, MessageCircle, 
  LogOut, X, Menu, Settings, HelpCircle 
} from "lucide-react";

export default function TopAppBar() {
  const pathname = usePathname();
  const { user, isLoggedIn } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  let title = "Sac do Marília ao Contrário";
  if (pathname === "/usuario/dashboard") title = "Meu Painel";
  if (pathname === "/usuario/minhas-reclamacoes") title = "Minhas Reclamações";
  if (pathname === "/usuario/reclamacao/nova") title = "Novo Relatório";
  if (pathname === "/completar-perfil") title = "Concluir Perfil";
  if (pathname === "/mapa") title = "Mapa";
  if (pathname === "/usuario/perfil") title = "Perfil";
  if (pathname === "/usuario/historico") title = "Histórico de Alertas";

  const isInnerPage = ["/usuario/reclamacao/nova", "/completar-perfil"].includes(pathname);

  const menuItems = [
    { href: "/usuario/dashboard", icon: BarChart3, label: "Dashboard" },
    { href: "/usuario/minhas-reclamacoes", icon: ClipboardList, label: "Reclamações" },
    { href: "/", icon: MapPin, label: "Mapa Interativo" },
    { href: "/usuario/reclamacao/nova", icon: MessageCircle, label: "Nova Ocorrência" },
    { href: "/usuario/historico", icon: Bell, label: "Histórico" },
    { href: "/usuario/perfil", icon: User, label: "Perfil" },
  ];

  const handleSignOut = async () => {
    await signOutUser();
    setIsDrawerOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] z-40 bg-white/80 backdrop-blur-xl border-b border-[#E2E8F0] flex items-center justify-between h-16 px-4 md:px-8">
        <div className="flex items-center gap-3">
          {isInnerPage ? (
            <Link href="/usuario/dashboard" className="md:hidden">
              <button className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-[#FAF7F2] transition-colors active:scale-95 duration-100">
                <span className="material-symbols-outlined text-[#1a8ccc]">arrow_back</span>
              </button>
            </Link>
          ) : (
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-[#FAF7F2] transition-colors active:scale-95 duration-100 md:hidden cursor-pointer"
            >
              <Menu className="w-5 h-5 text-[#1a8ccc]" />
            </button>
          )}
          <h1 className="text-lg font-semibold text-[#112F4E]">
            {title}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Notification Link */}
          <Link href="/usuario/historico">
            <button className="p-2.5 text-[#4A5D70] hover:text-[#1a8ccc] hover:bg-[#E8F2F8] rounded-xl transition-all relative cursor-pointer">
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#F59E0B] rounded-full ring-2 ring-white"></span>
            </button>
          </Link>

          {/* Profile Link */}
          <Link href="/usuario/perfil">
            <button className="w-10 h-10 rounded-xl bg-[#E8F2F8] flex items-center justify-center overflow-hidden border border-[#E2E8F0] hover:border-[#1a8ccc]/30 transition-all cursor-pointer">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-[#1a8ccc] text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  account_circle
                </span>
              )}
            </button>
          </Link>
        </div>
      </header>

      {/* Slide-out Mobile Navigation Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div 
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
          />

          {/* Content */}
          <div className="relative w-4/5 max-w-xs bg-[#FAF7F2] h-full shadow-2xl flex flex-col justify-between p-4 z-10 transition-transform duration-300">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#1a8ccc] flex items-center justify-center">
                    <span className="text-white text-xs font-bold">S</span>
                  </div>
                  <span className="font-bold text-sm text-[#112F4E]">SAC Marília</span>
                </div>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 hover:bg-black/5 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-[#4A5D70]" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsDrawerOpen(false)}
                      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? "bg-[#E8F2F8] text-[#1a8ccc] font-semibold"
                          : "text-[#4A5D70] hover:bg-black/5"
                      }`}
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Actions */}
            <div className="border-t border-[#E2E8F0] pt-4 space-y-2">
              <button 
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors text-[#EF4444] hover:bg-red-50 cursor-pointer"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                <span className="text-sm font-semibold">Sair da Conta</span>
              </button>

              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-8 h-8 rounded-full bg-[#1a8ccc]/10 flex items-center justify-center text-[#1a8ccc] border border-[#1a8ccc]/20 font-semibold text-xs uppercase">
                  {user?.displayName ? user.displayName.slice(0, 2) : "C"}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#112F4E] truncate">{user?.displayName || "Cidadão"}</p>
                  <p className="text-[10px] text-[#94A3B8] truncate">{user?.email || ""}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

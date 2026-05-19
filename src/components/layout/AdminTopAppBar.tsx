"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  HelpCircle, Mail, Bell, Calendar, Menu, X, BarChart3, 
  ClipboardList, FileText, FolderOpen, Users, LogOut 
} from "lucide-react";
import { signOutUser } from "@/services/firebase";

export default function AdminTopAppBar() {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const today = new Date();
  const dateStr = today.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "long", year: "numeric" });

  const adminMenuItems = [
    { href: "/admin/dashboard", icon: BarChart3, label: "Dashboard" },
    { href: "/admin/reclamacoes", icon: ClipboardList, label: "Reclamações" },
    { href: "/admin/relatorios", icon: FileText, label: "Relatórios" },
    { href: "/admin/categorias", icon: FolderOpen, label: "Categorias" },
    { href: "/admin/usuarios", icon: Users, label: "Usuários" },
  ];

  const handleSignOut = async () => {
    await signOutUser();
    setIsDrawerOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] z-40 bg-white/80 backdrop-blur-xl border-b border-[#E2E8F0] flex justify-between items-center h-16 px-4 md:px-8">
        {/* Left — Mobile menu + title */}
        <div className="flex items-center gap-3 md:hidden">
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-[#FAF7F2] transition-colors active:scale-95 duration-100 cursor-pointer"
          >
            <Menu className="w-5 h-5 text-[#1a8ccc]" />
          </button>
          <span className="text-[16px] font-bold text-[#112F4E]">Painel Admin</span>
        </div>
        <div className="hidden md:block" />

        {/* Right — Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 md:px-4 py-2 bg-[#FAF7F2] rounded-xl border border-[#E2E8F0] text-[13px] text-[#4A5D70]">
            <Calendar className="w-4 h-4 text-[#94A3B8]" />
            <span className="capitalize">{dateStr}</span>
          </div>
          <button className="w-9 h-9 rounded-xl flex items-center justify-center text-[#4A5D70] hover:bg-[#F5F2ED] transition-colors cursor-pointer">
            <HelpCircle className="w-5 h-5" />
          </button>
          <button className="hidden sm:flex w-9 h-9 rounded-xl items-center justify-center text-[#4A5D70] hover:bg-[#F5F2ED] transition-colors cursor-pointer">
            <Mail className="w-5 h-5" />
          </button>
          <button className="w-9 h-9 rounded-xl flex items-center justify-center text-[#4A5D70] hover:bg-[#F5F2ED] transition-colors relative cursor-pointer">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full ring-2 ring-white" />
          </button>
          <div className="h-8 w-px bg-[#E2E8F0] hidden sm:block" />
          <div className="w-9 h-9 rounded-full bg-[#E8F2F8] flex items-center justify-center border border-[#E2E8F0] overflow-hidden">
            <span className="material-symbols-outlined text-[#1a8ccc] text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              account_circle
            </span>
          </div>
        </div>
      </header>

      {/* Slide-out Mobile Admin Navigation Drawer */}
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
                  <span className="font-bold text-sm text-[#112F4E]">Painel Admin</span>
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
                {adminMenuItems.map((item) => {
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
                <span className="text-sm font-semibold">Sair Administrativo</span>
              </button>

              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-8 h-8 rounded-full bg-[#1a8ccc]/10 flex items-center justify-center text-[#1a8ccc] border border-[#1a8ccc]/20 font-semibold text-xs">
                  A
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#112F4E] truncate">Administrador</p>
                  <p className="text-[10px] text-[#94A3B8] truncate">Painel de Controle</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

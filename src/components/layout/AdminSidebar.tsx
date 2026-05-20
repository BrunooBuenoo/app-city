"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  BarChart3,
  ClipboardList,
  FileText,
  FolderOpen,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  MapPin,
  Bell,
  Shield,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { signOutUser } from "@/services/firebase";

interface AdminSidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export default function AdminSidebar({ isExpanded, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile } = useAuth();
  const [isManagementExpanded, setIsManagementExpanded] = useState(true);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      router.push("/");
    } catch (error) {
      console.error("Erro ao deslogar administrador:", error);
    }
  };

  const mainItems = [
    { href: "/admin/dashboard", icon: BarChart3, label: "Dashboard" },
    { href: "/admin/mapa", icon: MapPin, label: "Mapa", badge: null },
  ];

  const managementItems = [
    { href: "/admin/reclamacoes", icon: ClipboardList, label: "Reclamações" },
    { href: "/admin/relatorios", icon: FileText, label: "Relatórios" },
    { href: "/admin/categorias", icon: FolderOpen, label: "Categorias" },
    { href: "/admin/usuarios", icon: Users, label: "Usuários" },
  ];

  const handleLogout = async () => {
    await signOutUser();
    router.push("/");
  };

  const userName = profile?.nome || user?.displayName || "Admin";
  const userEmail = profile?.email || user?.email || "";
  const userPhoto = profile?.foto || user?.photoURL || "";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <aside
      className={`hidden md:flex flex-col h-full bg-[#FAF7F2] transition-all duration-300 ${
        isExpanded ? "w-[240px]" : "w-[64px]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 p-3">
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-black/5 transition-colors shrink-0"
          title={isExpanded ? "Recolher" : "Expandir"}
        >
          <span className="material-symbols-outlined text-[#1a8ccc] text-[22px]">menu</span>
        </button>
        {isExpanded && (
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1a8ccc] to-[#1572a6] flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-[#112F4E] block truncate leading-tight">
                SAC Marília
              </span>
              <span className="text-[9px] text-[#1a8ccc] font-semibold uppercase tracking-wider">
                Painel Admin
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="h-px bg-[#E2E8F0] mx-3" />

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-1">
        {mainItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`relative flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-[#1a8ccc]/10 text-[#1a8ccc] shadow-sm"
                  : "text-[#4A5D70] hover:bg-black/5 hover:text-[#112F4E]"
              }`}
              title={!isExpanded ? item.label : undefined}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#1a8ccc] rounded-r-full" />
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

        {/* Separator */}
        <div className="h-px bg-[#E2E8F0] mx-1 my-2" />

        {/* Management Section */}
        <button
          onClick={() => isExpanded && setIsManagementExpanded(!isManagementExpanded)}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl transition-colors text-[#94A3B8] hover:text-[#4A5D70] hover:bg-black/5"
          title={!isExpanded ? "Gestão" : undefined}
        >
          <Settings className="w-4.5 h-4.5 flex-shrink-0" />
          {isExpanded && (
            <>
              <span className="text-[10px] font-bold flex-1 text-left uppercase tracking-wider">Gestão</span>
              {isManagementExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </>
          )}
        </button>

        {(isExpanded ? isManagementExpanded : true) && (
          <div className={`space-y-0.5 ${isExpanded ? "ml-2" : ""}`}>
            {managementItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`relative flex items-center gap-3 w-full px-3 py-2 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "bg-[#1a8ccc]/10 text-[#1a8ccc]"
                      : "text-[#4A5D70] hover:bg-black/5 hover:text-[#112F4E]"
                  }`}
                  title={!isExpanded ? item.label : undefined}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-[#1a8ccc] rounded-r-full" />
                  )}
                  <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "" : "group-hover:scale-105"} transition-transform`} />
                  {isExpanded && (
                    <span className={`text-sm ${isActive ? "font-semibold" : ""}`}>{item.label}</span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Bottom Section */}
      <div className="px-2 py-3 space-y-1">
        <div className="h-px bg-[#E2E8F0] mx-1 mb-2" />

        <button
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl transition-colors text-[#4A5D70] hover:bg-black/5"
          title={!isExpanded ? "Suporte" : undefined}
        >
          <HelpCircle className="w-5 h-5 flex-shrink-0" />
          {isExpanded && <span className="text-sm font-medium">Suporte</span>}
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl transition-colors text-[#4A5D70] hover:bg-red-50 hover:text-red-500"
          title={!isExpanded ? "Sair" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isExpanded && <span className="text-sm font-medium">Sair</span>}
        </button>

        {/* User Card */}
        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/60 border border-[#E2E8F0]/50 mt-1 ${isExpanded ? "" : "justify-center"}`}>
          <div className="w-8 h-8 rounded-full overflow-hidden shadow-sm shrink-0 border-2 border-white">
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
              <p className="text-xs font-semibold text-[#112F4E] truncate">{userName}</p>
              <p className="text-[9px] text-[#94A3B8] truncate">{userEmail}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

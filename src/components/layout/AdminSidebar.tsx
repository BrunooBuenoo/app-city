"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3, ClipboardList, FileText, FolderOpen, Users,
  LogOut, MapPin, Shield, Bell, CheckCheck, Trash2, X, Building2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { signOutUser } from "@/services/firebase";
import ThemeToggle from "@/components/ui/ThemeToggle";
import VizoorLogo from "@/components/ui/VizoorLogo";
import { useNotifications } from "@/contexts/NotificationContext";

interface AdminSidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export default function AdminSidebar({ isExpanded, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile } = useAuth();
  
  // Estado local para abrir popover no desktop
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Hook de Notificações em Tempo Real
  const { 
    notificacoes, 
    naoLidasCount, 
    triggerShake, 
    marcarComoLida, 
    marcarTodasComoLidas,
    removerNotificacao
  } = useNotifications();

  const handleLogout = async () => {
    await signOutUser();
    router.push("/");
  };

  const menuItems = [
    { href: "/admin/dashboard", icon: BarChart3, label: "Dashboard" },
    { href: "/admin/criadores", icon: Users, label: "Criadores" },
    { href: "/admin/vinculos", icon: ClipboardList, label: "Vinculos" },
    { href: "/representante/dashboard", icon: Building2, label: "Representantes" },
    { href: "/admin/categorias", icon: FolderOpen, label: "Categorias" },
  ];

  const userPhoto = profile?.foto || user?.photoURL || "";
  const userName = profile?.nome || user?.displayName || "Admin";
  const userInitial = userName.charAt(0).toUpperCase();

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Formata o tempo relativo de forma simples
  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "agora";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `há ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `há ${hours} h`;
    const days = Math.floor(hours / 24);
    return `há ${days} dias`;
  };

  // Ação ao clicar em uma notificação
  const handleNotifClick = (id: string, link: string) => {
    marcarComoLida(id);
    setIsNotificationsOpen(false);
    router.push(link);
  };

  return (
    <aside
      className="hidden md:flex flex-col h-full w-[220px] py-5 shrink-0 border-r"
      style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      {/* Cabeçalho do Sidebar com Logo + Sino de Notificações */}
      <div className="flex items-center justify-between px-4 mb-6 relative" ref={notificationsRef}>
        <Link href="/" className="flex items-center group">
          <VizoorLogo height={26} />
        </Link>

        {/* Sino de Notificações com Badge e Shake */}
        <button
          onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          className={`w-8 h-8 rounded-lg flex items-center justify-center relative cursor-pointer transition-all duration-150 active:scale-95 ${
            triggerShake ? "animate-bell-shake" : ""
          } ${
            isNotificationsOpen ? "bg-[var(--color-bg-alt)] text-[#1a8ccc]" : "text-[var(--color-text-muted)] hover:bg-[var(--color-bg-alt)]"
          }`}
        >
          <Bell className="w-[17px] h-[17px]" />
          {naoLidasCount > 0 && (
            <span 
              className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-0.5 bg-[#EF4444] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center border"
              style={{ borderColor: "var(--color-surface)" }}
            >
              {naoLidasCount}
            </span>
          )}
        </button>

        {/* DROPDOWN POPOVER DE NOTIFICAÇÕES DESKTOP */}
        {isNotificationsOpen && (
          <div 
            className="absolute left-full top-0 ml-2.5 w-80 rounded-2xl border shadow-2xl overflow-hidden z-50 animate-in fade-in-0 slide-in-from-left-3 duration-200 backdrop-blur-md"
            style={{ 
              backgroundColor: "rgba(var(--color-surface-rgb, 255, 255, 255), 0.93)", 
              borderColor: "var(--color-border)",
              boxShadow: "0 10px 40px rgba(0,0,0,0.12)"
            }}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--color-border)" }}>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-text)" }}>Notificações</span>
                {naoLidasCount > 0 && (
                  <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-[#1a8ccc]/10 text-[#1a8ccc] rounded-md">{naoLidasCount} novas</span>
                )}
              </div>
              {naoLidasCount > 0 && (
                <button
                  onClick={marcarTodasComoLidas}
                  title="Marcar todas como lidas"
                  className="p-1 rounded hover:bg-[var(--color-bg-alt)] text-[#1a8ccc] transition-colors cursor-pointer"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Feed List */}
            <div className="max-h-[320px] overflow-y-auto divide-y" style={{ borderColor: "var(--color-border)" }}>
              {notificacoes.length === 0 ? (
                <div className="py-10 text-center space-y-2">
                  <span className="text-2xl block">🌌</span>
                  <p className="text-xs font-light" style={{ color: "var(--color-text-muted)" }}>Tudo limpo por aqui!</p>
                </div>
              ) : (
                notificacoes.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 flex items-start gap-3 transition-colors relative group cursor-pointer ${
                      !item.lida ? "bg-[#1a8ccc]/5" : "hover:bg-[var(--color-bg-alt)]"
                    }`}
                    onClick={() => handleNotifClick(item.id, "/admin/dashboard")}
                  >
                    {/* Indicador de Não Lido */}
                    {!item.lida && (
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#1a8ccc] rounded-full" />
                    )}
                    
                    {/* Icone */}
                    <div 
                      className="w-8 h-8 rounded-full bg-[#E8F2F8] flex items-center justify-center shrink-0"
                      style={{ paddingLeft: !item.lida ? "4px" : "0" }}
                    >
                      <Bell className="w-4 h-4 text-[#1a8ccc]" />
                    </div>

                    {/* Conteúdo */}
                    <div className="flex-1 min-w-0" style={{ paddingLeft: !item.lida ? "4px" : "0" }}>
                      <p className="text-xs font-bold leading-tight truncate" style={{ color: "var(--color-text)" }}>{item.titulo}</p>
                      <p className="text-[11px] leading-snug mt-0.5 line-clamp-2" style={{ color: "var(--color-text-secondary)" }}>{item.mensagem}</p>
                      <span className="text-[9px] block mt-1 font-semibold" style={{ color: "var(--color-text-muted)" }}>{formatTimeAgo(item.criadoEm)}</span>
                    </div>

                    {/* Remover */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removerNotificacao(item.id);
                      }}
                      title="Remover"
                      className="p-1 rounded opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 text-gray-400 transition-all shrink-0 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t text-center" style={{ borderColor: "var(--color-border)" }}>
              <Link
                href="/admin/dashboard"
                onClick={() => setIsNotificationsOpen(false)}
                className="text-[11px] font-bold text-[#1a8ccc] hover:underline cursor-pointer block"
              >
                Ver todas as aprovações pendentes
              </Link>
            </div>
          </div>
        )}
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
              Administrador da Plataforma
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

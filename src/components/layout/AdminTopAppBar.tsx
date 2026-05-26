"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Bell, Menu, X, BarChart3, CheckCheck, Trash2,
  ClipboardList, FileText, FolderOpen, Users, LogOut, MapPin,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { signOutUser } from "@/services/firebase";
import { useNotifications } from "@/contexts/NotificationContext";

export default function AdminTopAppBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile } = useAuth();
  
  // Estados locais
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // Hook de Notificações em Tempo Real
  const { 
    notificacoes, 
    naoLidasCount, 
    triggerShake, 
    marcarComoLida, 
    marcarTodasComoLidas,
    removerNotificacao
  } = useNotifications();

  const notificationsRef = useRef<HTMLDivElement>(null);

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

  // Ação ao clicar em um item de notificação
  const handleNotifClick = (id: string, link: string) => {
    marcarComoLida(id);
    setIsNotificationsOpen(false);
    router.push(link);
  };

  return (
    <>
      <header
        className="fixed top-0 right-0 w-full z-40 flex justify-between items-center h-14 px-4 border-b"
        style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
      >
        {/* Left — Mobile menu + title */}
        <div className="flex items-center gap-3 md:hidden">
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors active:scale-95 duration-100 cursor-pointer"
            style={{ color: "var(--color-text)" }}
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-[15px] font-semibold" style={{ color: "var(--color-text)" }}>Painel Admin</span>
        </div>
        <div className="hidden md:block" />
 
        {/* Right — Actions with Notifications Dropdown */}
        <div className="flex items-center gap-2 relative" ref={notificationsRef}>
          {/* Sino de Notificações */}
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center relative cursor-pointer transition-all duration-150 active:scale-95 ${
              triggerShake ? "animate-bell-shake" : ""
            } ${
              isNotificationsOpen ? "bg-[var(--color-bg-alt)] text-[#1a8ccc]" : "text-[var(--color-text-muted)] hover:bg-[var(--color-bg-alt)]"
            }`}
          >
            <Bell className="w-[18px] h-[18px]" />
            {naoLidasCount > 0 && (
              <span 
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#EF4444] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border-2"
                style={{ borderColor: "var(--color-surface)" }}
              >
                {naoLidasCount}
              </span>
            )}
          </button>

          {/* DROPDOWN POPOVER DE NOTIFICAÇÕES (Elegante Glassmorphism) */}
          {isNotificationsOpen && (
            <div 
              className="absolute right-0 top-11 w-80 max-w-[90vw] rounded-2xl border shadow-2xl overflow-hidden z-50 animate-in fade-in-0 slide-in-from-top-3 duration-200 backdrop-blur-md"
              style={{ 
                backgroundColor: "rgba(var(--color-surface-rgb, 255, 255, 255), 0.93)", 
                borderColor: "var(--color-border)",
                boxShadow: "0 10px 40px rgba(0,0,0,0.12)"
              }}
            >
              {/* Dropdown Header */}
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

              {/* Dropdown Body / Feed */}
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
                      onClick={() => handleNotifClick(item.id, item.link)}
                    >
                      {/* Ponto Azul de Não Lido */}
                      {!item.lida && (
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#1a8ccc] rounded-full" />
                      )}
                      
                      {/* Icone / Categoria */}
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

                      {/* Excluir Notificação individual (hover) */}
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

              {/* Dropdown Footer */}
              <div className="px-4 py-2 border-t text-center" style={{ borderColor: "var(--color-border)" }}>
                <Link
                  href="/admin/reclamacoes"
                  onClick={() => setIsNotificationsOpen(false)}
                  className="text-[11px] font-bold text-[#1a8ccc] hover:underline cursor-pointer block"
                >
                  Ver todos os relatos
                </Link>
              </div>
            </div>
          )}

          {/* User Profile Avatar */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center border overflow-hidden cursor-pointer shrink-0"
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
 
      {/* Slide-out Mobile Admin Navigation Drawer */}
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
                  <span className="font-semibold text-[15px]" style={{ color: "var(--color-text)" }}>Painel Admin</span>
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
                  <p className="text-[11px] truncate" style={{ color: "var(--color-text-muted)" }}>Administrador</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

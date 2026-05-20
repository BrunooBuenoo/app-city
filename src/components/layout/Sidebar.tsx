"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  ClipboardList,
  MapPin,
  Bell as BellIcon,
  User,
  MessageCircle,
  Settings,
  LogOut,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  HelpCircle,
  Trophy,
  Flame,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { signOutUser, onReclamacoesChange, type Reclamacao } from "@/services/firebase";
import { calculateUserXP, getUserRank, getNextRankProgress } from "@/utils/gamification";

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isExpanded, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile } = useAuth();
  const [isFeaturesExpanded, setIsFeaturesExpanded] = useState(true);
  const [reclamacoes, setReclamacoes] = useState<Reclamacao[]>([]);

  // Listener para calcular XP
  useEffect(() => {
    const unsubscribe = onReclamacoesChange(
      (items) => setReclamacoes(items),
      () => {}
    );
    return () => unsubscribe();
  }, []);

  const userXP = useMemo(
    () => (user ? calculateUserXP(user.uid, reclamacoes) : 0),
    [user, reclamacoes]
  );
  const rankInfo = useMemo(() => getNextRankProgress(userXP), [userXP]);

  const mainItems = [
    { href: "/usuario/dashboard", icon: BarChart3, label: "Dashboard" },
    { href: "/usuario/ranking", icon: Trophy, label: "Ranking" },
  ];

  const featureItems = [
    { href: "/usuario/minhas-reclamacoes", icon: ClipboardList, label: "Reclamações" },
    { href: "/", icon: MapPin, label: "Mapa" },
    { href: "/reclamacao/nova", icon: MessageCircle, label: "Nova Reclamação" },
    { href: "/usuario/historico", icon: BellIcon, label: "Histórico" },
    { href: "/usuario/perfil", icon: User, label: "Perfil" },
  ];

  const handleLogout = async () => {
    await signOutUser();
    router.push("/");
  };

  const userName = profile?.nome || user?.displayName || "Cidadão";
  const userPhoto = profile?.foto || user?.photoURL || "";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <aside
      className={`hidden md:flex flex-col h-full bg-[#FAF7F2] transition-all duration-300 ${
        isExpanded ? "w-[240px]" : "w-[64px]"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 p-3">
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-black/5 transition-colors shrink-0"
          title={isExpanded ? "Recolher" : "Expandir"}
        >
          <span className="material-symbols-outlined text-[#1a8ccc] text-[22px]">menu</span>
        </button>
        {isExpanded && (
          <div className="min-w-0">
            <span className="text-xs font-bold text-[#112F4E] block truncate leading-tight">
              SAC Marília
            </span>
            <span className="text-[9px] text-[#94A3B8] font-medium">
              ao Contrário
            </span>
          </div>
        )}
      </div>

      {/* Rank Badge */}
      {isExpanded && user && (
        <Link href="/usuario/ranking">
          <div className="mx-3 mb-2 p-3 rounded-xl border border-[#E2E8F0]/50 bg-white/60 hover:bg-white/90 transition-colors cursor-pointer">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-lg">{rankInfo.current.icon}</span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Sua patente</p>
                <p className="text-xs font-bold" style={{ color: rankInfo.current.color }}>
                  {rankInfo.current.name}
                </p>
              </div>
              <div className="ml-auto flex items-center gap-1 text-[#F59E0B]">
                <Flame className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">{userXP}</span>
              </div>
            </div>
            {rankInfo.next && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] text-[#94A3B8]">
                    {rankInfo.xpToNext} XP para {rankInfo.next.name}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${rankInfo.progress}%`,
                      background: rankInfo.current.gradient,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </Link>
      )}

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

        {/* Features */}
        <button
          onClick={() => isExpanded && setIsFeaturesExpanded(!isFeaturesExpanded)}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl transition-colors text-[#94A3B8] hover:text-[#4A5D70] hover:bg-black/5"
          title={!isExpanded ? "Recursos" : undefined}
        >
          <Settings className="w-4.5 h-4.5 flex-shrink-0" />
          {isExpanded && (
            <>
              <span className="text-[10px] font-bold flex-1 text-left uppercase tracking-wider">Recursos</span>
              {isFeaturesExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </>
          )}
        </button>

        {(isExpanded ? isFeaturesExpanded : true) && (
          <div className={`space-y-0.5 ${isExpanded ? "ml-2" : ""}`}>
            {featureItems.map((item) => {
              const isActive = pathname === item.href;
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
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {isExpanded && <span className="text-sm">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-3 space-y-1">
        <div className="h-px bg-[#E2E8F0] mx-1 mb-2" />

        <button
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl transition-colors text-[#4A5D70] hover:bg-black/5"
          title={!isExpanded ? "Ajuda" : undefined}
        >
          <HelpCircle className="w-5 h-5 flex-shrink-0" />
          {isExpanded && <span className="text-sm font-medium">Ajuda</span>}
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl transition-colors text-[#4A5D70] hover:bg-red-50 hover:text-red-500"
          title={!isExpanded ? "Sair" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isExpanded && <span className="text-sm font-medium">Sair</span>}
        </button>

        {/* User Card with Rank */}
        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/60 border border-[#E2E8F0]/50 mt-1 ${isExpanded ? "" : "justify-center"}`}>
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-full overflow-hidden shadow-sm border-2 border-white">
              {userPhoto ? (
                <img src={userPhoto} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#1a8ccc] to-[#1572a6] flex items-center justify-center text-white text-sm font-bold">
                  {userInitial}
                </div>
              )}
            </div>
            {/* Rank emoji badge */}
            <span className="absolute -bottom-1 -right-1 text-[10px]">{rankInfo.current.icon}</span>
          </div>
          {isExpanded && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#112F4E] truncate">{userName}</p>
              <p className="text-[9px] font-semibold truncate" style={{ color: rankInfo.current.color }}>
                {rankInfo.current.name}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

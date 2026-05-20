"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOutUser } from "@/services/firebase";
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
  Copy,
  HelpCircle,
} from "lucide-react";

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isExpanded, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isFeaturesExpanded, setIsFeaturesExpanded] = useState(true);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      router.push("/");
    } catch (error) {
      console.error("Erro ao deslogar cidadão:", error);
    }
  };

  const mainItems = [
    { href: "/usuario/dashboard", icon: BarChart3, label: "Dashboard" },
  ];

  const featureItems = [
    { href: "/usuario/minhas-reclamacoes", icon: ClipboardList, label: "Reclamações" },
    { href: "/", icon: MapPin, label: "Mapa" },
    { href: "/usuario/reclamacao/nova", icon: MessageCircle, label: "Nova Reclamação" },
    { href: "/usuario/historico", icon: BellIcon, label: "Histórico" },
    { href: "/usuario/perfil", icon: User, label: "Perfil" },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col h-full bg-[#FAF7F2] transition-all duration-300 ${
        isExpanded ? "w-[220px]" : "w-[60px]"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 p-3">
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-black/5 transition-colors shrink-0"
        >
          <span className="material-symbols-outlined text-[#1a8ccc] text-[22px]">menu</span>
        </button>
        {isExpanded && (
          <span className="text-xs font-bold text-[#112F4E] leading-tight truncate">
            Sac do Marília<br />ao Contrário
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-2 overflow-y-auto">
        {mainItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors mb-1 ${
                isActive
                  ? "bg-[#E8F2F8] text-[#1a8ccc]"
                  : "text-[#4A5D70] hover:bg-black/5"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isExpanded && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}

        {/* Features */}
        <button
          onClick={() => isExpanded && setIsFeaturesExpanded(!isFeaturesExpanded)}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors text-[#4A5D70] hover:bg-black/5 mb-1"
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {isExpanded && (
            <>
              <span className="text-sm font-medium flex-1 text-left">Recursos</span>
              {isFeaturesExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </>
          )}
        </button>

        {isExpanded && isFeaturesExpanded && (
          <div className="ml-4 space-y-0.5">
            {featureItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#E8F2F8] text-[#1a8ccc]"
                      : "text-[#4A5D70] hover:bg-black/5"
                  }`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-2">
        <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors text-[#4A5D70] hover:bg-black/5 mb-1">
          <HelpCircle className="w-5 h-5 flex-shrink-0" />
          {isExpanded && <span className="text-sm font-medium">Ajuda</span>}
        </button>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors text-[#4A5D70] hover:bg-black/5 mb-1 cursor-pointer text-left w-full"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isExpanded && <span className="text-sm font-medium">Sair</span>}
        </button>

        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${isExpanded ? "justify-between" : "justify-center"}`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1a8ccc] flex items-center justify-center text-white text-sm font-medium">C</div>
            {isExpanded && <span className="text-sm font-medium text-[#112F4E]">Cidadão</span>}
          </div>
          {isExpanded && (
            <button className="p-1 hover:bg-black/5 rounded transition-colors">
              <MoreVertical className="w-4 h-4 text-[#94A3B8]" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

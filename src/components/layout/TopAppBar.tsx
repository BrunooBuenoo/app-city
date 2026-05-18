"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopAppBar() {
  const pathname = usePathname();
  
  let title = "SAC Marília";
  if (pathname === "/usuario/dashboard") title = "Meu Painel";
  if (pathname === "/usuario/minhas-reclamacoes") title = "Minhas Reclamações";
  if (pathname === "/reclamacao/nova") title = "Novo Relatório";
  if (pathname === "/completar-perfil") title = "Concluir Perfil";
  if (pathname === "/mapa") title = "Mapa";

  const isInnerPage = ["/reclamacao/nova", "/completar-perfil"].includes(pathname);

  return (
    <header className="fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] z-40 bg-white/80 backdrop-blur-xl border-b border-[#E2E8F0] flex items-center justify-between h-16 px-4 md:px-8">
      <div className="flex items-center gap-3">
        {isInnerPage ? (
          <Link href="/usuario/dashboard" className="md:hidden">
            <button className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-[#FAF7F2] transition-colors active:scale-95 duration-100">
              <span className="material-symbols-outlined text-[#1a8ccc]">arrow_back</span>
            </button>
          </Link>
        ) : (
          <span className="material-symbols-outlined text-[#1a8ccc] text-[24px] md:hidden">
            menu
          </span>
        )}
        <h1 className="text-lg font-semibold text-[#112F4E]">
          {title}
        </h1>
      </div>
      
      <div className="flex items-center gap-3">
        <button className="p-2.5 text-[#4A5D70] hover:text-[#1a8ccc] hover:bg-[#E8F2F8] rounded-xl transition-all relative">
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#F59E0B] rounded-full ring-2 ring-white"></span>
        </button>
        <div className="w-10 h-10 rounded-xl bg-[#E8F2F8] flex items-center justify-center overflow-hidden border border-[#E2E8F0]">
          <span className="material-symbols-outlined text-[#1a8ccc] text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            account_circle
          </span>
        </div>
      </div>
    </header>
  );
}

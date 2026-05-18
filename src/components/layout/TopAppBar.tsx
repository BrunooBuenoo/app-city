"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopAppBar() {
  const pathname = usePathname();
  
  let title = "App Marília";
  if (pathname === "/usuario/dashboard") title = "Meu Painel";
  if (pathname === "/usuario/minhas-reclamacoes") title = "Minhas Reclamações";
  if (pathname === "/reclamacao/nova") title = "Novo Relatório";
  if (pathname === "/completar-perfil") title = "Concluir Perfil";
  if (pathname === "/mapa") title = "Mapa";

  const isInnerPage = ["/reclamacao/nova", "/completar-perfil"].includes(pathname);

  return (
    <header className="fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant shadow-sm flex items-center justify-between h-16 px-4 md:px-gutter">
      <div className="flex items-center gap-3">
        {isInnerPage ? (
          <Link href="/usuario/dashboard" className="md:hidden">
            <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-low transition-colors active:scale-95 duration-100">
              <span className="material-symbols-outlined text-primary">arrow_back</span>
            </button>
          </Link>
        ) : (
          <span className="material-symbols-outlined text-primary text-[24px] md:hidden">
            menu
          </span>
        )}
        <h1 className="font-headline-sm text-headline-sm font-bold text-primary">
          {title}
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden border border-outline-variant">
          <img
            alt="Perfil"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqMZs1urs4ryGlMztVjXzOJREPLK3_gxKe8NkyUnF5RaEjEyV73DYipo0Xm7IRuP3e0jUm_SjfjMFeFFWhvYt2VjP7DIp9QK6SCahVwyaehLcKZxu-6CCDUeqZdGw-wZa6D7JVEbCwJvmFotK49SQhpZ52FCk2u4toFFwIdtmh2TVTPB02IYw-l7tmQdRCSo09YlkySFhy8vWffhCHzSizZsJsaVs-UNh79GaKZzGFBoYwdkLDtoPEvBZ6uVXihM7D3py3e-BkZatu"
          />
        </div>
      </div>
    </header>
  );
}

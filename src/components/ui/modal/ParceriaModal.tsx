"use client";

import React from "react";
import { X, Store, MessageSquare, Mail, ShieldCheck, ArrowRight, Sparkles, LogIn } from "lucide-react";
import Link from "next/link";

interface ParceriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick?: () => void;
}

export default function ParceriaModal({ isOpen, onClose, onLoginClick }: ParceriaModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Backdrop Glassmorphism */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-slate-200/50 dark:border-zinc-800/60 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-300 text-left">
        
        {/* Banner Decorativo Superior */}
        <div className="h-32 bg-gradient-to-br from-[#1a8ccc] to-[#1572a6] relative flex items-center px-8 text-white">
          <div className="absolute inset-0 bg-grid-white/[0.05] pointer-events-none" />
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -left-8 -top-8 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-all backdrop-blur-md border-none cursor-pointer z-20"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
              <Store className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-black tracking-widest uppercase text-sky-200/90 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#F59E0B] animate-pulse" /> Seja Parceiro SP
              </span>
              <h3 className="text-xl font-extrabold tracking-tight mt-0.5">Como anunciar no mapa?</h3>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-6">
          <p className="text-sm text-slate-650 dark:text-zinc-350 leading-relaxed font-light">
            O <strong className="font-semibold text-slate-800 dark:text-white">Navegando SP</strong> é a vitrine comercial definitiva para o Estado de São Paulo. Os pins no mapa são exclusivos para estabelecimentos credenciados, garantindo segurança e veracidade aos visitantes.
          </p>

          {/* Steps */}
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-black shrink-0 mt-0.5 border border-emerald-500/20">
                1
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200">Entre em Contato Conosco</h4>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-normal font-light">
                  Nossa equipe de suporte comercial está disponível via WhatsApp ou e-mail para validar seus dados comerciais.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-black shrink-0 mt-0.5 border border-amber-500/20">
                2
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200">Abertura de Conta Corporativa</h4>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-normal font-light">
                  Criamos seu perfil de parceiro e liberamos o acesso ao painel de filiais corporativas da plataforma.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-black shrink-0 mt-0.5 border border-indigo-500/20">
                3
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200">Publique Pins, Cupons & Cardápios</h4>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-normal font-light">
                  Insira seus pins de geolocalização, crie cupons ativos, anexe menus e liste especialidades com facilidade no painel.
                </p>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-zinc-800" />

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* WhatsApp Contact */}
            <a
              href="https://wa.me/5511999999999?text=Ol%C3%A1!%20Gostaria%20de%20cadastrar%20minha%20empresa%20no%20mapa%20do%20Navegando%20SP."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-[0.98] hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4.5 h-4.5 fill-white text-emerald-500 shrink-0" />
              SOLICITAR CREDENCIAMENTO VIA WHATSAPP
            </a>

            {/* Email Contact */}
            <a
              href="mailto:parcerias@navegandosp.com.br?subject=Interesse%20em%20Credenciamento%20Navegando%20SP"
              className="w-full h-12 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700/80 text-slate-700 dark:text-zinc-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Mail className="w-4.5 h-4.5 text-slate-500 dark:text-zinc-400 shrink-0" />
              Falar por E-mail (parcerias@navegandosp.com.br)
            </a>

            {/* Login de Parceiro existente */}
            <div className="pt-2 text-center">
              <span className="text-[11px] text-slate-400">Já é uma empresa parceira credenciada? </span>
              <button
                onClick={() => {
                  onClose();
                  if (onLoginClick) onLoginClick();
                }}
                className="text-[11px] font-bold text-[#1a8ccc] hover:underline bg-transparent border-none cursor-pointer inline-flex items-center gap-0.5"
              >
                Faça login no painel <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-zinc-900/60 border-t border-slate-100 dark:border-zinc-800 text-[10px] text-slate-400 text-center flex justify-between items-center">
          <span className="flex items-center gap-1 text-[#1a8ccc] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> Pins Verificados
          </span>
          <span>Navegando SP © {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
  );
}

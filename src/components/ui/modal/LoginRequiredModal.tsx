"use client";

import React from "react";
import Link from "next/link";
import { LogIn, X, Shield } from "lucide-react";

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginRequiredModal({ isOpen, onClose }: LoginRequiredModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-zinc-900 border border-transparent dark:border-zinc-800 rounded-3xl shadow-2xl shadow-black/10 dark:shadow-black/50 max-w-sm w-full p-8 text-center animate-in fade-in zoom-in duration-200 transition-colors duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#FAF7F2] dark:hover:bg-zinc-850 text-[#94A3B8] dark:text-zinc-500 hover:text-[#112F4E] dark:hover:text-zinc-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#E8F2F8] dark:bg-zinc-800/80 text-[#1a8ccc] dark:text-[#38bdf8] flex items-center justify-center mx-auto mb-5 shadow-sm shrink-0 transition-colors">
          <Shield className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-semibold text-[#112F4E] dark:text-white mb-2">
          Login Necessário
        </h3>
        <p className="text-sm text-[#4A5D70] dark:text-zinc-400 font-light leading-relaxed mb-6">
          Para resgatar cupons de desconto exclusivos e participar do Fidelidade SP, você precisa estar conectado com sua conta Google.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/login"
            className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-[#1a8ccc] dark:bg-[#0ea5e9] text-white font-medium text-sm rounded-xl hover:bg-[#1572a6] dark:hover:bg-[#0284c7] active:scale-[0.98] transition-all shadow-sm"
          >
            <LogIn className="w-4 h-4" />
            Entrar com Google
          </Link>
          <button
            onClick={onClose}
            className="w-full py-3 text-sm text-[#4A5D70] dark:text-zinc-400 font-medium hover:text-[#112F4E] dark:hover:text-white transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

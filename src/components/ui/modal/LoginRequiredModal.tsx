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
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center animate-in fade-in zoom-in duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#FAF7F2] transition-colors"
        >
          <X className="w-4 h-4 text-[#94A3B8]" />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#E8F2F8] flex items-center justify-center mx-auto mb-5">
          <Shield className="w-7 h-7 text-[#1a8ccc]" />
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold text-[#112F4E] mb-2">
          Login Necessário
        </h3>
        <p className="text-sm text-[#4A5D70] font-light leading-relaxed mb-6">
          Para criar uma reclamação, você precisa estar conectado com sua conta Google.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/login"
            className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-[#1a8ccc] text-white font-medium text-sm rounded-xl hover:bg-[#1572a6] active:scale-[0.98] transition-all"
          >
            <LogIn className="w-4 h-4" />
            Entrar com Google
          </Link>
          <button
            onClick={onClose}
            className="w-full py-3 text-sm text-[#4A5D70] font-medium hover:text-[#112F4E] transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

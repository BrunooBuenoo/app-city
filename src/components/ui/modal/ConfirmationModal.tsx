"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, MapPin, ClipboardList, X } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConfirmationModal({ isOpen, onClose }: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#FAF7F2] transition-colors"
        >
          <X className="w-4 h-4 text-[#94A3B8]" />
        </button>

        {/* Success Icon with animation */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          {/* Pulse ring */}
          <div className="absolute inset-0 rounded-full bg-[#10B981]/20 animate-ping" style={{ animationDuration: "2s" }} />
          {/* Icon circle */}
          <div className="relative w-20 h-20 rounded-full bg-[#10B981] flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-9 h-9 text-white" />
          </div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold text-[#112F4E] mb-2">
          Parceria Solicitada!
        </h3>
        <p className="text-sm text-[#4A5D70] font-light leading-relaxed mb-8">
          A solicitação de credenciamento do estabelecimento foi registrada com sucesso e será analisada pela moderação do Navegando SP.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#1a8ccc] text-white font-medium text-sm rounded-xl hover:bg-[#1572a6] active:scale-[0.98] transition-all"
          >
            <MapPin className="w-4 h-4" />
            Ver no Mapa
          </Link>
          <Link
            href="/usuario/dashboard"
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#FAF7F2] text-[#112F4E] font-medium text-sm rounded-xl hover:bg-[#F5F2ED] active:scale-[0.98] transition-all border border-[#E2E8F0]"
          >
            <ClipboardList className="w-4 h-4" />
            Meus Cupons
          </Link>
        </div>
      </div>
    </div>
  );
}

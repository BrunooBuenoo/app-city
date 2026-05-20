"use client";

import React from "react";
import { X } from "lucide-react";
import type { Concordante } from "@/services/firebase/reclamacoes";
import { getUserRank } from "@/utils/gamification";

interface ConcordantesModalProps {
  isOpen: boolean;
  onClose: () => void;
  concordantes: Concordante[];
  loading?: boolean;
}

export default function ConcordantesModal({
  isOpen,
  onClose,
  concordantes,
  loading = false,
}: ConcordantesModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm animate-[fadeIn_200ms_ease]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 z-[61] flex items-end md:items-center md:justify-center md:inset-0">
        <div
          className="bg-white w-full md:w-[420px] md:max-h-[70vh] rounded-t-3xl md:rounded-2xl shadow-[0_-8px_40px_rgba(0,0,0,0.12)] md:shadow-2xl overflow-hidden animate-[slideUp_300ms_ease]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#10B981]/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px] text-[#10B981]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  favorite
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#112F4E]">Concordaram</h3>
                <p className="text-[11px] text-[#94A3B8]">
                  {concordantes.length} {concordantes.length === 1 ? "pessoa" : "pessoas"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-[#FAF7F2] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 text-[#94A3B8]" />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[50vh] overflow-y-auto overscroll-contain">
            {loading ? (
              /* Skeleton Loading */
              <div className="p-4 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-[#E2E8F0]" />
                    <div className="flex-1">
                      <div className="h-3.5 bg-[#E2E8F0] rounded w-32 mb-1.5" />
                      <div className="h-2.5 bg-[#F1F5F9] rounded w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : concordantes.length === 0 ? (
              <div className="p-8 text-center">
                <span className="material-symbols-outlined text-[40px] text-[#E2E8F0] block mb-2">
                  sentiment_neutral
                </span>
                <p className="text-sm text-[#94A3B8]">Ninguém concordou ainda.</p>
              </div>
            ) : (
              <div className="py-1">
                {concordantes.map((c, index) => {
                  // Quick rank display (xp is approximated here as just 1 per concordo)
                  const rank = getUserRank(0); // Default — full XP calc is done on leaderboard page

                  return (
                    <div
                      key={c.uid}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-[#FAF7F2] transition-colors"
                      style={{ animationDelay: `${index * 40}ms` }}
                    >
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0 bg-[#E8F2F8]">
                        {c.foto ? (
                          <img
                            src={c.foto}
                            alt={c.nome}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#1a8ccc] to-[#1572a6] flex items-center justify-center text-white text-sm font-bold">
                            {c.nome.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#112F4E] truncate">
                          {c.nome}
                        </p>
                        <p className="text-[11px] text-[#94A3B8] flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px] text-[#10B981]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            check_circle
                          </span>
                          Concordou com esta reclamação
                        </p>
                      </div>

                      {/* Concordo badge */}
                      <div className="shrink-0">
                        <span className="material-symbols-outlined text-[18px] text-[#10B981]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          thumb_up
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom safe area for mobile */}
          <div className="h-2 md:hidden" />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}

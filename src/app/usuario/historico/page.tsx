"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { onReclamacoesChange, type Reclamacao } from "@/services/firebase";
import { Bell, Clock, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";

const statusLabels: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  aberto: { label: "Aberto", color: "#1a8ccc", icon: <Bell className="w-4 h-4" /> },
  em_analise: { label: "Em Análise", color: "#8B5CF6", icon: <Clock className="w-4 h-4" /> },
  em_andamento: { label: "Em Andamento", color: "#F59E0B", icon: <AlertCircle className="w-4 h-4" /> },
  resolvido: { label: "Resolvido", color: "#10B981", icon: <CheckCircle className="w-4 h-4" /> },
  critico: { label: "Crítico", color: "#EF4444", icon: <AlertCircle className="w-4 h-4" /> },
};

export default function Historico() {
  const { user } = useAuth();
  const [reclamacoes, setReclamacoes] = useState<Reclamacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onReclamacoesChange(
      (items) => {
        // Filtra apenas reclamações do usuário logado
        const mine = user ? items.filter((r) => r.autorId === user.uid) : [];
        setReclamacoes(mine);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [user]);

  const formatDate = (ts: any) => {
    if (!ts) return "—";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-3 border-[#1a8ccc] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#112F4E] tracking-tight">Histórico de Alertas</h1>
        <p className="text-sm text-[#94A3B8] mt-1">
          Acompanhe todas as atualizações de status das suas reclamações.
        </p>
      </div>

      {/* Timeline */}
      {reclamacoes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 shadow-sm text-center">
          <span className="material-symbols-outlined text-[48px] text-[#E2E8F0] mb-3 block">notifications_none</span>
          <h3 className="text-base font-semibold text-[#112F4E] mb-1">Nenhuma notificação ainda</h3>
          <p className="text-sm text-[#94A3B8] font-light">
            Quando você registrar uma reclamação, as atualizações aparecerão aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reclamacoes.map((rec) => {
            const st = statusLabels[rec.status] ?? statusLabels.aberto;
            return (
              <Link
                key={rec.id}
                href={`/reclamacao/${rec.id}`}
                className="block bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
              >
                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: st.color + "15", color: st.color }}
                  >
                    {st.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <h3 className="text-sm font-bold text-[#112F4E] truncate">{rec.titulo}</h3>
                      <ArrowRight className="w-4 h-4 text-[#E2E8F0] group-hover:text-[#1a8ccc] shrink-0 transition-colors" />
                    </div>
                    <p className="text-xs text-[#4A5D70] font-light line-clamp-1 mb-2">{rec.descricao}</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold"
                        style={{ backgroundColor: st.color + "15", color: st.color }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: st.color }} />
                        {st.label}
                      </span>
                      <span className="text-[10px] text-[#94A3B8]">{rec.categoria}</span>
                      <span className="text-[10px] text-[#94A3B8]">•</span>
                      <span className="text-[10px] text-[#94A3B8]">{formatDate(rec.atualizadoEm)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

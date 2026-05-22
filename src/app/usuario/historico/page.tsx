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
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--color-text)" }}>Histórico de Alertas</h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
          Acompanhe todas as atualizações de status das suas reclamações.
        </p>
      </div>

      {/* Timeline */}
      {reclamacoes.length === 0 ? (
        <div className="rounded-2xl border p-12 text-center" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}>
          <span className="material-symbols-outlined text-[48px] mb-3 block" style={{ color: "var(--color-border)" }}>notifications_none</span>
          <h3 className="text-base font-semibold mb-1" style={{ color: "var(--color-text)" }}>Nenhuma notificação ainda</h3>
          <p className="text-sm font-light" style={{ color: "var(--color-text-muted)" }}>
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
                className="block rounded-2xl border p-5 hover:-translate-y-0.5 transition-all group"
                style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}
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
                      <h3 className="text-sm font-bold truncate" style={{ color: "var(--color-text)" }}>{rec.titulo}</h3>
                      <ArrowRight className="w-4 h-4 shrink-0 transition-colors" style={{ color: "var(--color-border)" }} />
                    </div>
                    <p className="text-xs font-light line-clamp-1 mb-2" style={{ color: "var(--color-text-secondary)" }}>{rec.descricao}</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold"
                        style={{ backgroundColor: st.color + "15", color: st.color }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: st.color }} />
                        {st.label}
                      </span>
                      <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>{rec.categoria}</span>
                      <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>•</span>
                      <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>{formatDate(rec.atualizadoEm)}</span>
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

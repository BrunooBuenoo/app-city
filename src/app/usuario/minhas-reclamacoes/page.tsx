"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { onReclamacoesChange, type Reclamacao } from "@/services/firebase";
import {
  Wrench, Lightbulb, Trash2, Droplets, Heart, HelpCircle, Shield, Plus,
  MapPin, Calendar, ThumbsUp, ChevronRight, Loader2,
  School, Bus, TreePine, PawPrint, Activity
} from "lucide-react";
import { CATEGORIES, getCategoryByLabel } from "@/utils/categories";

const categoryIconMap: Record<string, any> = {
  saude: Activity,
  transporte: Bus,
  infraestrutura: Wrench,
  seguranca: Shield,
  educacao: School,
  limpeza: Trash2,
  meio_ambiente: TreePine,
  iluminacao: Lightbulb,
  saneamento: Droplets,
  bem_estar_animal: PawPrint,
};

const getCategoryIcon = (categoryLabel: string) => {
  const cleanLabel = (categoryLabel || "").toLowerCase().trim();
  const cat = CATEGORIES.find(
    (c) => c.label.toLowerCase() === cleanLabel || c.id.toLowerCase() === cleanLabel
  );
  if (cat && categoryIconMap[cat.id]) {
    return categoryIconMap[cat.id];
  }
  return HelpCircle;
};

const statusMeta: Record<string, { label: string; bg: string; text: string }> = {
  aberto: { label: "Aberto", bg: "bg-[#E8F2F8]", text: "text-[#1a8ccc]" },
  em_analise: { label: "Em Análise", bg: "bg-[#F3E8FF]", text: "text-[#8B5CF6]" },
  em_andamento: { label: "Em Progresso", bg: "bg-[#FEF3C7]", text: "text-[#B45309]" },
  resolvido: { label: "Resolvido", bg: "bg-[#D1FAE5]", text: "text-[#065F46]" },
  critico: { label: "Crítico", bg: "bg-[#FEE2E2]", text: "text-[#991B1B]" },
};

export default function MinhasReclamacoes() {
  const router = useRouter();
  const { user, isLoggedIn, loading } = useAuth();

  const [reclamacoes, setReclamacoes] = useState<Reclamacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onReclamacoesChange(
      (items) => {
        // Filtrar reclamações do usuário
        const filtered = items.filter((r) => r.autorId === user.uid);
        setReclamacoes(filtered);
        setIsLoading(false);
      },
      (error) => {
        console.error("Erro no listener de minhas reclamações:", error);
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, [user]);

  // Cálculos dinâmicos
  const totalCount = reclamacoes.length;
  const resolvidoCount = reclamacoes.filter((r) => r.status === "resolvido").length;
  const emAndamentoCount = reclamacoes.filter((r) => r.status === "em_andamento" || r.status === "em_analise").length;
  const totalConcordos = reclamacoes.reduce((acc, r) => acc + (r.concordos || 0), 0);

  const summaryCards = [
    { label: "Total", value: totalCount, color: "#1a8ccc" },
    { label: "Resolvidas", value: resolvidoCount, color: "#10B981" },
    { label: "Em Progresso", value: emAndamentoCount, color: "#F59E0B" },
    { label: "Apoios", value: totalConcordos, color: "#EF4444", hasHeart: true },
  ];

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "—";
    const date = timestamp.toDate();
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  };

  if (loading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--color-primary)" }} />
        <p className="text-sm font-light" style={{ color: "var(--color-text-secondary)" }}>Carregando suas reclamações...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-[1280px] mx-auto w-full space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight" style={{ color: "var(--color-text)" }}>Minhas Reclamações</h2>
        <p className="text-sm md:text-base mt-1 font-light" style={{ color: "var(--color-text-secondary)" }}>Acompanhe e fiscalize o andamento de cada uma das suas solicitações.</p>
      </div>

      {/* Summary Cards */}
      <section>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {summaryCards.map((card) => (
            <div key={card.label} className="min-w-[140px] flex-1 p-4 rounded-2xl border transition-shadow" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}>
              <span className="text-[10px] font-bold uppercase tracking-wider block mb-2" style={{ color: "var(--color-text-muted)" }}>{card.label}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-extrabold" style={{ color: card.color }}>{card.value}</span>
                {card.hasHeart && (
                  <Heart className="w-4 h-4 text-[#EF4444] fill-[#EF4444]" />
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Complaints List */}
      <section className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--color-text-muted)" }}>Registros Recentes ({reclamacoes.length})</h3>

        {reclamacoes.length === 0 ? (
          <div className="p-8 rounded-2xl border border-dashed text-center space-y-3" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}>
            <HelpCircle className="w-12 h-12 mx-auto opacity-70" style={{ color: "var(--color-text-muted)" }} />
            <p className="text-sm font-light" style={{ color: "var(--color-text-secondary)" }}>Você ainda não registrou nenhuma reclamação.</p>
            <Link href="/usuario/reclamacao/nova" className="inline-block px-4 py-2 bg-[#1a8ccc] text-white font-semibold text-xs rounded-xl hover:bg-[#1572a6] transition-colors shadow-sm">
              Criar Primeira Reclamação
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reclamacoes.map((c) => {
              const Icon = getCategoryIcon(c.categoria);
              const meta = statusMeta[c.status] || { label: c.status, bg: "bg-[#F3F4F6]", text: "text-[#6B7280]" };
              const cat = getCategoryByLabel(c.categoria);
              return (
                <div key={c.id} className="p-5 rounded-2xl border flex flex-col justify-between gap-4 hover:-translate-y-0.5 transition-all" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}>
                  <div>
                    {/* Top Row */}
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div 
                          className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#E2E8F0]/80 flex items-center justify-center shrink-0"
                          style={cat ? { backgroundColor: cat.bgLight, borderColor: "transparent" } : undefined}
                        >
                          <Icon 
                            className="w-4.5 h-4.5" 
                            style={cat ? { color: cat.color } : { color: "var(--color-text-secondary)" }}
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold truncate" title={c.titulo} style={{ color: "var(--color-text)" }}>{c.titulo}</h4>
                          <p 
                            className="text-[10px] uppercase tracking-wider font-semibold"
                            style={cat ? { color: cat.color } : { color: "var(--color-text-muted)" }}
                          >
                            {cat ? cat.label : c.categoria}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 ${meta.bg} ${meta.text} text-[10px] font-bold rounded-full shrink-0`}>
                        {meta.label}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-start gap-2" style={{ color: "var(--color-text-secondary)" }}>
                        <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                        <span className="text-xs font-light leading-snug truncate" title={c.endereco}>{c.endereco}</span>
                      </div>
                      <div className="flex items-center gap-2" style={{ color: "var(--color-text-secondary)" }}>
                        <Calendar className="w-4 h-4 shrink-0" style={{ color: "var(--color-text-muted)" }} />
                        <span className="text-xs font-light">{formatDate(c.criadoEm)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-3 border-t" style={{ borderColor: "var(--color-border-light)" }}>
                    <div className="flex items-center gap-1.5 text-[#10B981]">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-xs font-bold">{c.concordos} Apoios</span>
                    </div>
                    <Link href={`/reclamacao/${c.id}`} className="text-[#1a8ccc] text-xs font-semibold flex items-center gap-0.5 hover:underline cursor-pointer">
                      Ver detalhes
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* FAB */}
      <Link href="/usuario/reclamacao/nova">
        <button className="fixed bottom-24 md:bottom-8 right-6 w-14 h-14 bg-[#1a8ccc] hover:bg-[#1572a6] text-white rounded-2xl shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-50 cursor-pointer">
          <Plus className="w-7 h-7" />
        </button>
      </Link>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Compass,
  Gift,
  CheckCircle,
  Clock,
  MapPin,
  Tag,
  Copy,
  Sparkles,
  Building,
  Loader2,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/contexts/AuthContext";
import { listarResgatesDoUsuario, type Resgate } from "@/services/firebase";

export default function UsuarioDashboard() {
  const { user, profile, loading } = useAuth();
  const { showToast } = useToast();

  const [resgates, setResgates] = useState<Resgate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"todos" | "ativos" | "utilizados">("todos");

  useEffect(() => {
    if (!user) return;

    async function carregarResgates() {
      try {
        const dados = await listarResgatesDoUsuario(user!.uid);
        setResgates(dados);
      } catch (error) {
        console.error("Erro ao buscar resgates do usuário:", error);
        showToast("warning", "Erro", "Erro ao carregar seus cupons salvos.");
      } finally {
        setIsLoading(false);
      }
    }

    carregarResgates();
  }, [user, showToast]);

  // Cálculos de métricas comerciais
  const metricas = useMemo(() => {
    const total = resgates.length;
    const ativos = resgates.filter((r) => r.status === "gerado").length;
    const utilizados = resgates.filter((r) => r.status === "resgatado").length;
    
    // Locais visitados distintos
    const locaisUnicos = new Set(resgates.map((r) => r.estabelecimentoId || r.estabelecimentoNome));
    const locaisVisitados = locaisUnicos.size;

    return { total, ativos, utilizados, locaisVisitados };
  }, [resgates]);

  // Filtragem de cupons na lista
  const cuponsFiltrados = useMemo(() => {
    return resgates.filter((r) => {
      if (activeFilter === "ativos") return r.status === "gerado";
      if (activeFilter === "utilizados") return r.status === "resgatado";
      return true;
    });
  }, [resgates, activeFilter]);

  const copiarCodigo = (codigo: string) => {
    navigator.clipboard.writeText(codigo);
    showToast("success", "Copiado!", "Código do cupom copiado para a área de transferência!");
  };

  const formatarData = (timestamp: any) => {
    if (!timestamp) return "—";
    const date = timestamp.toDate();
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#1a8ccc]" />
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          Carregando seus cupons de vantagens...
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Cabeçalho Premium */}
      <header
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 md:px-8 py-6 border-b gap-4"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: "var(--color-text)" }}>
            <Sparkles className="w-6 h-6 text-[#F59E0B] animate-pulse" />
            Meus Cupons & Vantagens
          </h1>
          <p className="text-[13px] mt-1" style={{ color: "var(--color-text-muted)" }}>
            Olá, <span className="font-semibold text-[var(--color-text)]">{profile?.nome || user?.displayName || "Membro"}</span>! Visualize seus códigos e economize em São Paulo.
          </p>
        </div>
        <Link href="/">
          <button className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-gradient-to-r from-[#1a8ccc] to-[#1572a6] text-white rounded-xl shadow-md shadow-[#1a8ccc]/10 hover:shadow-lg hover:shadow-[#1a8ccc]/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-95">
            <Compass className="w-4 h-4 animate-spin-slow" />
            Explorar Mapa de Parcerias
          </button>
        </Link>
      </header>

      <div className="px-6 md:px-8 pb-12 space-y-6 pt-6">
        
        {/* Painel de Boas-vindas Glassmorphic */}
        <div
          className="relative p-6 rounded-2xl border overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#1a8ccc]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#F59E0B]/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-2 text-center md:text-left z-10">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F59E0B]/10 text-[#F59E0B]">
              Navegando SP — Patrocínios & Vantagens
            </span>
            <h2 className="text-lg font-bold" style={{ color: "var(--color-text)" }}>
              Economia Inteligente de Verdade
            </h2>
            <p className="text-xs max-w-lg leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
              Navegue pelo mapa comercial, encontre seus estabelecimentos favoritos no Estado de São Paulo (restaurantes, oficinas, salões de beleza, escolas, lojas de varejo) e resgate descontos em instantes!
            </p>
          </div>
          <div className="shrink-0 flex items-center justify-center bg-gradient-to-br from-[#1a8ccc]/10 to-[#1572a6]/10 p-4 rounded-2xl border" style={{ borderColor: "var(--color-border)" }}>
            <Gift className="w-12 h-12 text-[#1a8ccc]" />
          </div>
        </div>

        {/* Métricas de Uso */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total de Cupons", value: metricas.total, sub: "Salvos no clube", icon: Tag, color: "#1a8ccc" },
            { label: "Disponíveis para Uso", value: metricas.ativos, sub: "Prontos para apresentar", icon: Clock, color: "#F59E0B" },
            { label: "Utilizados", value: metricas.utilizados, sub: "Economias geradas", icon: CheckCircle, color: "#10B981" },
            { label: "Estabelecimentos", value: metricas.locaisVisitados, sub: "Locais visitados", icon: Building, color: "#8B5CF6" },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl border relative overflow-hidden group transition-all duration-200"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-[12px] font-medium" style={{ color: "var(--color-text-muted)" }}>
                  {stat.label}
                </span>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
                >
                  <stat.icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-extrabold leading-none mb-1 group-hover:scale-105 transition-transform origin-left" style={{ color: "var(--color-text)" }}>
                {String(stat.value).padStart(2, "0")}
              </p>
              <span className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>
                {stat.sub}
              </span>
            </div>
          ))}
        </div>

        {/* Filtros e Lista */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
            {/* Filtros de Abas */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: "todos", label: "Todos os Cupons" },
                { id: "ativos", label: "Disponíveis para Uso" },
                { id: "utilizados", label: "Histórico de Utilizados" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap border ${
                    activeFilter === tab.id
                      ? "text-white"
                      : ""
                  }`}
                  style={
                    activeFilter === tab.id
                      ? { backgroundColor: "#1a8ccc", borderColor: "#1a8ccc" }
                      : {
                          backgroundColor: "var(--color-surface)",
                          color: "var(--color-text-secondary)",
                          borderColor: "var(--color-border)",
                        }
                  }
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              Mostrando <strong className="font-semibold" style={{ color: "var(--color-text)" }}>{cuponsFiltrados.length}</strong> de{" "}
              <strong className="font-semibold" style={{ color: "var(--color-text)" }}>{resgates.length}</strong> cupons
            </span>
          </div>

          {/* Lista de Cupons Estilo Cards de Ticket Físico */}
          {cuponsFiltrados.length === 0 ? (
            <div
              className="p-12 text-center rounded-2xl border flex flex-col items-center justify-center gap-4"
              style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
            >
              <Gift className="w-12 h-12 text-[var(--color-text-muted)] animate-bounce" />
              <div className="space-y-1">
                <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                  Nenhum cupom encontrado para este filtro.
                </p>
                <p className="text-xs max-w-sm" style={{ color: "var(--color-text-muted)" }}>
                  {activeFilter === "todos"
                    ? "Você ainda não resgatou nenhum cupom. Navegue pelo mapa e resgate sua primeira vantagem comercial de graça!"
                    : activeFilter === "ativos"
                    ? "Você não possui nenhum cupom ativo pendente de uso."
                    : "Você não possui histórico de cupons utilizados no caixa."}
                </p>
              </div>
              <Link href="/">
                <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer">
                  Buscar Estabelecimentos
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cuponsFiltrados.map((ticket) => {
                const isAtivo = ticket.status === "gerado";

                return (
                  <div
                    key={ticket.id}
                    className="relative flex flex-col sm:flex-row border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                    style={{
                      backgroundColor: "var(--color-surface)",
                      borderColor: "var(--color-border)",
                    }}
                  >
                    {/* Borda Picotada Estilizada Lateral */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-[var(--color-bg)] rounded-r-full border-y border-r pointer-events-none" style={{ borderColor: "var(--color-border)" }} />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-[var(--color-bg)] rounded-l-full border-y border-l pointer-events-none" style={{ borderColor: "var(--color-border)" }} />

                    {/* Lado Esquerdo do Ticket (Info do Cupom) */}
                    <div className="flex-1 p-6 flex flex-col justify-between gap-4 border-r border-dashed sm:border-b-0 border-b pb-6 sm:pb-6" style={{ borderColor: "var(--color-border)" }}>
                      <div className="space-y-1 px-2">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-[#1a8ccc] shrink-0" />
                          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>
                            {ticket.estabelecimentoNome}
                          </span>
                        </div>
                        <h3 className="text-base font-extrabold tracking-tight pt-1 leading-snug" style={{ color: "var(--color-text)" }}>
                          {ticket.cupomTitulo}
                        </h3>
                        <p className="text-xs leading-normal" style={{ color: "var(--color-text-muted)" }}>
                          Resgatado em {formatarData(ticket.criadoEm)}
                        </p>
                      </div>

                      {/* Status badge */}
                      <div className="flex items-center gap-2 px-2">
                        {isAtivo ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#F59E0B]/10 text-[#F59E0B]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-ping" />
                            Disponível para uso
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#10B981]/10 text-[#10B981]">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Utilizado em {ticket.resgatadoEm ? formatarData(ticket.resgatadoEm) : ""}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Lado Direito do Ticket (Código do Resgate & Ação) */}
                    <div className="sm:w-56 p-6 flex flex-col items-center justify-center text-center gap-3 bg-[var(--color-bg-alt)]/30 shrink-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: "var(--color-text-muted)" }}>
                        CÓDIGO DO BENEFÍCIO
                      </span>
                      
                      <div className="w-full flex items-center justify-center gap-1.5 bg-[var(--color-surface)] border border-dashed rounded-xl px-4 py-2.5" style={{ borderColor: "var(--color-border)" }}>
                        <span className="text-sm font-extrabold tracking-widest font-mono text-[#1a8ccc]">
                          {ticket.codigoUnicoGerado}
                        </span>
                        {isAtivo && (
                          <button
                            onClick={() => copiarCodigo(ticket.codigoUnicoGerado)}
                            className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500 cursor-pointer"
                            title="Copiar Código"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {isAtivo ? (
                        <p className="text-[10px] max-w-[160px]" style={{ color: "var(--color-text-muted)" }}>
                          Apresente este código no caixa para validar o desconto.
                        </p>
                      ) : (
                        <p className="text-[10px] text-[#10B981] font-semibold">
                          Cupom validado e usufruído com sucesso!
                        </p>
                      )}

                      {isAtivo && ticket.estabelecimentoId && (
                        <Link
                          href={`/`}
                          className="mt-1 text-[11px] font-semibold text-[#1a8ccc] hover:underline flex items-center gap-1"
                        >
                          Ver no Mapa
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}





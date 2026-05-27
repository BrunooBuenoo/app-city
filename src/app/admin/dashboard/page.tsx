"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Clock, CheckCircle, XCircle, MoreHorizontal,
  Loader2, Star, ShieldCheck, Store, MapPin, Phone, Building2, Users, TrendingUp, ArrowRight,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { 
  listarEstabelecimentos, 
  aprovarEstabelecimento, 
  rejeitarOuSuspenderEstabelecimento, 
  type Estabelecimento 
} from "@/services/firebase";
import { getCategoryByLabel } from "@/utils/categories";

export default function AdminDashboard() {
  const router = useRouter();
  const { showToast } = useToast();
  const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("pendente_aprovacao"); // "todos" | "pendente_aprovacao" | "ativo" | "suspenso"

  const carregarDados = async () => {
    try {
      const list = await listarEstabelecimentos();
      setEstabelecimentos(list);
    } catch (error) {
      console.error("Erro ao carregar estabelecimentos:", error);
      showToast("warning", "Erro", "Erro ao carregar dados do banco.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleAprovar = async (empresaId: string, estabId: string) => {
    try {
      setIsLoading(true);
      await aprovarEstabelecimento(empresaId, estabId);
      showToast("success", "Parceiro Aprovado", "O parceiro comercial já está ativo e visível no mapa.");
      await carregarDados();
    } catch (error) {
      console.error(error);
      showToast("warning", "Erro", "Falha ao aprovar o estabelecimento.");
      setIsLoading(false);
    }
  };

  const handleRejeitar = async (empresaId: string, estabId: string) => {
    try {
      setIsLoading(true);
      await rejeitarOuSuspenderEstabelecimento(empresaId, estabId, "suspenso");
      showToast("info", "Status Atualizado", "Estabelecimento suspenso/rejeitado com sucesso.");
      await carregarDados();
    } catch (error) {
      console.error(error);
      showToast("warning", "Erro", "Falha ao atualizar o parceiro.");
      setIsLoading(false);
    }
  };

  // Filtragem local
  const filteredEstabs = estabelecimentos.filter((e) => {
    if (activeFilter === "todos") return true;
    return e.status === activeFilter;
  });

  // Métricas
  const totalCount = estabelecimentos.length;
  const pendentesCount = estabelecimentos.filter(e => e.status === "pendente_aprovacao").length;
  const ativosCount = estabelecimentos.filter(e => e.status === "ativo").length;
  const suspensosCount = estabelecimentos.filter(e => e.status === "suspenso").length;

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "—";
    const date = timestamp.toDate();
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  };

  if (isLoading && estabelecimentos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-[#1a8ccc] animate-spin" />
        <p className="text-sm text-slate-500">Carregando painel de moderação...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950/20">
      {/* Header */}
      <header className="flex items-center justify-between px-6 md:px-8 py-6 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1a8ccc]/10 text-[#1a8ccc]">
              Administrador da Plataforma
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#1a8ccc]" />
            Painel de Controle Geral
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gerencie representantes, aprove credenciamentos e monitore toda a plataforma Navegando SP.
          </p>
        </div>
      </header>

      <div className="px-6 md:px-8 py-8 space-y-6">
        
        {/* Stats Cards — Plataforma Geral */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total de Credenciados", value: totalCount, color: "text-slate-700 dark:text-zinc-200", icon: Store },
            { label: "Pendentes de Aprovação", value: pendentesCount, color: "text-amber-500", icon: Clock },
            { label: "Parceiros Ativos no Mapa", value: ativosCount, color: "text-emerald-500", icon: CheckCircle },
            { label: "Parceiros Suspensos", value: suspensosCount, color: "text-rose-500", icon: XCircle },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 shadow-sm group hover:shadow-md transition-all"
            >
              <p className="text-xs text-slate-400 dark:text-zinc-500 font-medium">{stat.label}</p>
              <p className={`text-3xl font-black leading-none mt-3 group-hover:scale-105 transition-transform origin-left ${stat.color}`}>{String(stat.value).padStart(2, "0")}</p>
            </div>
          ))}
        </div>

        {/* Stats Cards — Rede de Cidades e Representantes (mockado) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Cidades Ativas", value: "01", sub: "São Paulo Capital", icon: MapPin, color: "#1a8ccc" },
            { label: "Representantes", value: "01", sub: "Gestores ativos", icon: Building2, color: "#F59E0B" },
            { label: "Usuários na Plataforma", value: "---", sub: "Dados em tempo real", icon: Users, color: "#8B5CF6" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold leading-none" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-xs font-semibold text-slate-700 dark:text-zinc-200 mt-0.5">{stat.label}</p>
                <p className="text-[10px] text-slate-400">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 border-b border-slate-250 pb-2">
          {[
            { id: "pendente_aprovacao", label: `Pendentes (${pendentesCount})` },
            { id: "ativo", label: `Ativos (${ativosCount})` },
            { id: "suspenso", label: `Suspensos (${suspensosCount})` },
            { id: "todos", label: `Todos (${totalCount})` },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === f.id
                  ? "bg-[#1a8ccc] text-white shadow-sm"
                  : "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Establishments List */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/60 dark:border-zinc-800/80 shadow-sm overflow-hidden">
          <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80">
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-150">Ações & Solicitantes</h3>
            <span className="text-xs text-slate-400">Total filtrado: {filteredEstabs.length}</span>
          </div>

          {filteredEstabs.length === 0 ? (
            <div className="p-16 text-center text-slate-400">
              <Store className="w-12 h-12 text-slate-250 mx-auto mb-3 block" />
              Nenhum estabelecimento comercial encontrado para esta listagem.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-zinc-800/50">
              {filteredEstabs.map((row) => {
                const cat = getCategoryByLabel(row.categoria) ?? { label: "Outros", color: "#64748B" };
                return (
                  <div
                    key={row.id}
                    className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/40 dark:hover:bg-zinc-850/10 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {row.logoUrl ? (
                        <img
                          src={row.logoUrl}
                          className="w-14 h-14 rounded-2xl object-cover bg-white border shrink-0"
                          alt="logo"
                        />
                      ) : (
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                        >
                          <Store className="w-6 h-6" />
                        </div>
                      )}
                      <div className="text-left space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-base font-bold text-slate-800 dark:text-white leading-tight">{row.nome}</h4>
                          <span
                            className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider"
                            style={{ backgroundColor: `${cat.color}18`, color: cat.color }}
                          >
                            {cat.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-light max-w-xl">
                          {row.descricao || "Nenhuma descrição informada."}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-[11px] text-slate-400">
                          {row.telefone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5 shrink-0 text-slate-350" />
                              {row.telefone}
                            </span>
                          )}
                          {row.endereco && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-350" />
                              {row.endereco}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 md:self-center shrink-0">
                      {row.status === "pendente_aprovacao" && (
                        <>
                          <button
                            onClick={() => handleRejeitar(row.empresaId, row.id)}
                            className="px-4 py-2 text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <XCircle className="w-4 h-4" />
                            Recusar
                          </button>
                          <button
                            onClick={() => handleAprovar(row.empresaId, row.id)}
                            className="px-4 py-2 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm shadow-emerald-500/10"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Aprovar Parceiro
                          </button>
                        </>
                      )}
                      {row.status === "ativo" && (
                        <button
                          onClick={() => handleRejeitar(row.empresaId, row.id)}
                          className="px-4 py-2 text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <XCircle className="w-4 h-4" />
                          Suspender
                        </button>
                      )}
                      {row.status === "suspenso" && (
                        <button
                          onClick={() => handleAprovar(row.empresaId, row.id)}
                          className="px-4 py-2 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Reativar Parceiro
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

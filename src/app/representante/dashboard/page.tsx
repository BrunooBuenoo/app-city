"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Building2, Store, Tag, CheckCircle, Clock, XCircle,
  Loader2, MapPin, Phone, Users, TrendingUp, BarChart2,
  Plus, Eye, ShieldCheck, Sparkles, ArrowRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/Toast";
import Link from "next/link";

// Dados mockados de parceiros vinculados ao representante
const PARCEIROS_MOCK = [
  {
    id: "1",
    nome: "Restaurante Sabor Paulista",
    categoria: "Alimentação",
    categoriaColor: "#F59E0B",
    endereco: "Av. Paulista, 1200 - Bela Vista, São Paulo",
    telefone: "(11) 3456-7890",
    status: "ativo",
    cuponsAtivos: 3,
    visitasMes: 142,
  },
  {
    id: "2",
    nome: "Barbearia Corte Fino",
    categoria: "Beleza & Estética",
    categoriaColor: "#8B5CF6",
    endereco: "Rua Augusta, 580 - Consolação, São Paulo",
    telefone: "(11) 2345-6789",
    status: "ativo",
    cuponsAtivos: 1,
    visitasMes: 89,
  },
  {
    id: "3",
    nome: "Academia FitLife",
    categoria: "Saúde & Bem-estar",
    categoriaColor: "#10B981",
    endereco: "Av. Brigadeiro Faria Lima, 1500 - Pinheiros, SP",
    telefone: "(11) 9876-5432",
    status: "pendente_aprovacao",
    cuponsAtivos: 0,
    visitasMes: 0,
  },
  {
    id: "4",
    nome: "Livraria Cultura Central",
    categoria: "Educação & Cultura",
    categoriaColor: "#1a8ccc",
    endereco: "Rua da Consolação, 2200 - Cerqueira César, SP",
    telefone: "(11) 3333-4444",
    status: "ativo",
    cuponsAtivos: 2,
    visitasMes: 67,
  },
  {
    id: "5",
    nome: "Auto Center Primavera",
    categoria: "Automotivo",
    categoriaColor: "#EF4444",
    endereco: "Av. dos Bandeirantes, 800 - Moema, São Paulo",
    telefone: "(11) 5555-6666",
    status: "suspenso",
    cuponsAtivos: 0,
    visitasMes: 12,
  },
];

export default function RepresentanteDashboard() {
  const router = useRouter();
  const { isLoggedIn, loading, profile } = useAuth();
  const { showToast } = useToast();
  const [parceiros, setParceiros] = useState(PARCEIROS_MOCK);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("todos");

  // TODO: Reativar autenticação quando o login estiver implementado
  // useEffect(() => {
  //   if (!loading) {
  //     if (!isLoggedIn) {
  //       router.push("/login");
  //       return;
  //     }
  //     // Simula carregamento
  //     setTimeout(() => setIsLoading(false), 600);
  //   }
  // }, [loading, isLoggedIn]);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => setIsLoading(false), 600);
    }
  }, [loading]);

  const handleAprovar = (id: string) => {
    setParceiros((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "ativo" } : p))
    );
    showToast("success", "Parceiro Ativado", "O parceiro agora está visível no mapa.");
  };

  const handleSuspender = (id: string) => {
    setParceiros((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "suspenso" } : p))
    );
    showToast("info", "Parceiro Suspenso", "O parceiro foi removido temporariamente do mapa.");
  };

  const filtrados = parceiros.filter((p) => {
    if (activeFilter === "todos") return true;
    return p.status === activeFilter;
  });

  const totalAtivos = parceiros.filter((p) => p.status === "ativo").length;
  const totalPendentes = parceiros.filter((p) => p.status === "pendente_aprovacao").length;
  const totalSuspensos = parceiros.filter((p) => p.status === "suspenso").length;
  const totalCupons = parceiros.reduce((acc, p) => acc + p.cuponsAtivos, 0);
  const totalVisitas = parceiros.reduce((acc, p) => acc + p.visitasMes, 0);

  if (loading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-[#F59E0B] animate-spin" />
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          Carregando painel do representante...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>

      {/* Header Premium com Gradiente */}
      <header
        className="px-6 md:px-8 py-6 border-b"
        style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F59E0B]/10 text-[#F59E0B]">
                Representante de Cidade
              </span>
            </div>
            <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: "var(--color-text)" }}>
              <Building2 className="w-5 h-5 text-[#F59E0B]" />
              Gestão de Parceiros — São Paulo Capital
            </h1>
            <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
              Olá, <span className="font-semibold" style={{ color: "var(--color-text)" }}>{profile?.nome || "Representante"}</span>! Gerencie os parceiros comerciais vinculados à sua cidade.
            </p>
          </div>

          <Link href="/">
            <button className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-gradient-to-r from-[#F59E0B] to-[#d97706] text-white rounded-xl shadow-md shadow-[#F59E0B]/15 hover:shadow-lg hover:shadow-[#F59E0B]/25 transition-all cursor-pointer hover:scale-[1.02] active:scale-95">
              <MapPin className="w-4 h-4" />
              Ver Mapa da Cidade
            </button>
          </Link>
        </div>
      </header>

      <div className="px-6 md:px-8 py-8 space-y-6">

        {/* Painel de Boas-vindas Glassmorphic */}
        <div
          className="relative p-6 rounded-2xl border overflow-hidden"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F59E0B]/8 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#1a8ccc]/8 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#F59E0B]">
                  Navegando SP · São Paulo Capital
                </span>
              </div>
              <h2 className="text-lg font-bold" style={{ color: "var(--color-text)" }}>
                Você é o representante oficial desta cidade
              </h2>
              <p className="text-xs leading-relaxed max-w-lg" style={{ color: "var(--color-text-muted)" }}>
                Seu papel é conectar estabelecimentos locais à plataforma, aprovar credenciamentos, gerenciar cupons e garantir a qualidade das parcerias comerciais visíveis no mapa.
              </p>
            </div>
            <div
              className="shrink-0 flex items-center justify-center p-4 rounded-2xl border"
              style={{ backgroundColor: "var(--color-bg-alt)", borderColor: "var(--color-border)" }}
            >
              <Building2 className="w-10 h-10 text-[#F59E0B]" />
            </div>
          </div>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: "Parceiros Ativos", value: totalAtivos, icon: CheckCircle, color: "#10B981", sub: "no mapa" },
            { label: "Pendentes", value: totalPendentes, icon: Clock, color: "#F59E0B", sub: "aguardando aprovação" },
            { label: "Suspensos", value: totalSuspensos, icon: XCircle, color: "#EF4444", sub: "fora do mapa" },
            { label: "Cupons Ativos", value: totalCupons, icon: Tag, color: "#8B5CF6", sub: "em circulação" },
            { label: "Visitas/Mês", value: totalVisitas, icon: TrendingUp, color: "#1a8ccc", sub: "ao total de parceiros" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-5 rounded-2xl border relative overflow-hidden group transition-all duration-200 hover:shadow-md"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-[11px] font-medium leading-tight" style={{ color: "var(--color-text-muted)" }}>
                  {stat.label}
                </span>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
                >
                  <stat.icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-extrabold leading-none mb-1 group-hover:scale-105 transition-transform origin-left" style={{ color: "var(--color-text)" }}>
                {String(stat.value).padStart(2, "0")}
              </p>
              <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                {stat.sub}
              </span>
            </div>
          ))}
        </div>

        {/* Lista de Parceiros */}
        <div
          className="rounded-3xl border overflow-hidden"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          {/* Cabeçalho com filtros */}
          <div className="px-6 py-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" style={{ borderColor: "var(--color-border)" }}>
            <h3 className="text-sm font-bold" style={{ color: "var(--color-text)" }}>
              Parceiros da Cidade
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { id: "todos", label: `Todos (${parceiros.length})` },
                { id: "ativo", label: `Ativos (${totalAtivos})` },
                { id: "pendente_aprovacao", label: `Pendentes (${totalPendentes})` },
                { id: "suspenso", label: `Suspensos (${totalSuspensos})` },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                    activeFilter === f.id
                      ? "bg-[#F59E0B] text-white shadow-sm"
                      : "border text-slate-600 dark:text-zinc-300"
                  }`}
                  style={
                    activeFilter !== f.id
                      ? {
                          backgroundColor: "var(--color-bg-alt)",
                          borderColor: "var(--color-border)",
                        }
                      : {}
                  }
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Lista */}
          {filtrados.length === 0 ? (
            <div className="p-16 text-center" style={{ color: "var(--color-text-muted)" }}>
              <Store className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Nenhum parceiro encontrado para este filtro.</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>
              {filtrados.map((parceiro) => (
                <div
                  key={parceiro.id}
                  className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors"
                  style={{ borderColor: "var(--color-border)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor = "var(--color-bg-alt)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent";
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar com inicial */}
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-white font-bold text-lg"
                      style={{ backgroundColor: parceiro.categoriaColor }}
                    >
                      {parceiro.nome.charAt(0)}
                    </div>

                    <div className="text-left space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-bold leading-tight" style={{ color: "var(--color-text)" }}>
                          {parceiro.nome}
                        </h4>
                        <span
                          className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider"
                          style={{ backgroundColor: `${parceiro.categoriaColor}18`, color: parceiro.categoriaColor }}
                        >
                          {parceiro.categoria}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px]" style={{ color: "var(--color-text-muted)" }}>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          {parceiro.endereco}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 shrink-0" />
                          {parceiro.telefone}
                        </span>
                        {parceiro.status === "ativo" && (
                          <>
                            <span className="flex items-center gap-1 text-[#8B5CF6]">
                              <Tag className="w-3.5 h-3.5 shrink-0" />
                              {parceiro.cuponsAtivos} cupons ativos
                            </span>
                            <span className="flex items-center gap-1 text-[#1a8ccc]">
                              <Eye className="w-3.5 h-3.5 shrink-0" />
                              {parceiro.visitasMes} visitas este mês
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Badge de status */}
                    <span
                      className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                        parceiro.status === "ativo"
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20"
                          : parceiro.status === "suspenso"
                          ? "bg-rose-50 text-rose-600 dark:bg-rose-950/20"
                          : "bg-amber-50 text-amber-600 dark:bg-amber-950/20"
                      }`}
                    >
                      {parceiro.status === "ativo" && <CheckCircle className="w-3 h-3" />}
                      {parceiro.status === "suspenso" && <XCircle className="w-3 h-3" />}
                      {parceiro.status === "pendente_aprovacao" && <Clock className="w-3 h-3" />}
                      {parceiro.status === "ativo"
                        ? "Ativo"
                        : parceiro.status === "suspenso"
                        ? "Suspenso"
                        : "Pendente"}
                    </span>

                    {parceiro.status === "pendente_aprovacao" && (
                      <button
                        onClick={() => handleAprovar(parceiro.id)}
                        className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Aprovar
                      </button>
                    )}

                    {parceiro.status === "ativo" && (
                      <button
                        onClick={() => handleSuspender(parceiro.id)}
                        className="px-4 py-1.5 text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Suspender
                      </button>
                    )}

                    {parceiro.status === "suspenso" && (
                      <button
                        onClick={() => handleAprovar(parceiro.id)}
                        className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Reativar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Rodapé */}
          <div
            className="px-6 py-3 border-t flex items-center justify-between"
            style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg-alt)" }}
          >
            <span className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>
              Exibindo <strong>{filtrados.length}</strong> de <strong>{parceiros.length}</strong> parceiros
            </span>
            <button className="flex items-center gap-1.5 text-[11px] font-semibold text-[#1a8ccc] hover:underline cursor-pointer">
              Solicitar novo credenciamento
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Atalhos rápidos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: ShieldCheck,
              color: "#10B981",
              title: "Qualidade da Rede",
              desc: "Monitore a reputação dos parceiros e volume de cupons resgatados.",
              cta: "Ver Relatório",
            },
            {
              icon: Users,
              color: "#8B5CF6",
              title: "Usuários da Cidade",
              desc: "Veja quantos usuários navegaram na sua cidade este mês.",
              cta: "Ver Usuários",
            },
            {
              icon: BarChart2,
              color: "#1a8ccc",
              title: "Performance Geral",
              desc: "Crescimento de parceiros e visitas mês a mês em São Paulo.",
              cta: "Ver Métricas",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="p-5 rounded-2xl border relative overflow-hidden group cursor-pointer transition-all hover:shadow-md"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${card.color}15`, color: card.color }}
              >
                <card.icon className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold mb-1" style={{ color: "var(--color-text)" }}>
                {card.title}
              </h4>
              <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--color-text-muted)" }}>
                {card.desc}
              </p>
              <span className="text-xs font-semibold flex items-center gap-1" style={{ color: card.color }}>
                {card.cta}
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

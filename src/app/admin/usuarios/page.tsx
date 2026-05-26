"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Users, Search, Shield, UserCircle, Mail, Calendar, Loader2, Award, Settings, Trophy, Award as Insignia, TrendingUp, Save, Edit, RefreshCw, X } from "lucide-react";
import { db } from "@/services/firebase/config";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { obterRecompensasDb, salvarRecompensasDb, atualizarPontosUsuarioDb, type RecompensasConfig } from "@/services/firebase";
import { calcularNivel, NIVEIS_PRESTIGIO } from "@/utils/gamification";
import InsigniaBadge from "@/components/ui/InsigniaBadge";

interface UserProfile {
  id: string;
  nome: string;
  email: string;
  foto: string;
  telefone: string;
  role: string;
  pontos: number;
  nivel: string;
  perfilCompleto: boolean;
  criadoEm: any;
}

export default function UsuariosAdmin() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  // Estados Principais
  const [activeTab, setActiveTab] = useState<"usuarios" | "regras" | "ranking">("usuarios");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Estados de Edição de Pontos
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [formPoints, setFormPoints] = useState(0);
  const [isSavingPoints, setIsSavingPoints] = useState(false);

  // Estados de Regras de Gamificação
  const [recompensas, setRecompensas] = useState<RecompensasConfig | null>(null);
  const [loadingRules, setLoadingRules] = useState(false);
  const [isSavingRules, setIsSavingRules] = useState(false);

  // Proteção de rota para administradores
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push("/login");
    }
  }, [user, authLoading, isAdmin, router]);

  // Carrega lista de usuários em tempo real do Firestore
  useEffect(() => {
    if (!user || !isAdmin) return;

    const q = query(collection(db, "users"), orderBy("criadoEm", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            ...data,
            pontos: data.pontos !== undefined ? Number(data.pontos) : 0,
            nivel: data.nivel || "Ovo de Dino",
          } as UserProfile;
        });
        setUsers(items);
        setLoadingUsers(false);
      },
      (err) => {
        console.error("Erro ao carregar usuários:", err);
        showToast("warning", "Erro ao carregar a lista de usuários");
        setLoadingUsers(false);
      }
    );
    return () => unsubscribe();
  }, [user, isAdmin]);

  // Carrega regras de recompensas do Firestore
  const carregarRegras = async () => {
    setLoadingRules(true);
    try {
      const config = await obterRecompensasDb();
      setRecompensas(config);
    } catch (err) {
      console.error(err);
      showToast("warning", "Erro ao carregar as regras de pontuação");
    } finally {
      setLoadingRules(false);
    }
  };

  useEffect(() => {
    if (user && isAdmin) {
      carregarRegras();
    }
  }, [user, isAdmin]);

  // Filtro de Busca de Usuários
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        (u.nome || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q)
      );
    });
  }, [users, searchQuery]);

  // Ranking ordenado por XP
  const leaderboardUsers = useMemo(() => {
    return [...users].sort((a, b) => b.pontos - a.pontos);
  }, [users]);

  // Estatísticas Rápidas
  const totalAdmins = useMemo(() => users.filter((u) => u.role === "admin").length, [users]);
  const totalUsuarios = useMemo(() => users.filter((u) => u.role !== "admin").length, [users]);

  // Formatador de data
  const formatDate = (ts: any) => {
    if (!ts) return "—";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  };

  // Abre modal de edição de XP
  const handleOpenEditXP = (u: UserProfile) => {
    setEditingUser(u);
    setFormPoints(u.pontos);
  };

  // Grava alteração de XP de usuário
  const handleSaveXP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    
    setIsSavingPoints(true);
    try {
      await atualizarPontosUsuarioDb(editingUser.id, formPoints);
      showToast("success", `Pontuação de '${editingUser.nome}' atualizada para ${formPoints} XP!`);
      setEditingUser(null);
    } catch (err) {
      console.error(err);
      showToast("warning", "Erro ao atualizar a pontuação do usuário");
    } finally {
      setIsSavingPoints(false);
    }
  };

  // Grava regras de pontuação
  const handleSaveRules = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recompensas) return;

    setIsSavingRules(true);
    try {
      await salvarRecompensasDb(recompensas);
      showToast("success", "Regras de pontuação de gamificação salvas com sucesso!");
    } catch (err) {
      console.error(err);
      showToast("warning", "Erro ao salvar as configurações");
    } finally {
      setIsSavingRules(false);
    }
  };

  const handleRuleChange = (field: keyof RecompensasConfig, value: string) => {
    if (!recompensas) return;
    const num = Math.max(0, parseInt(value) || 0);
    setRecompensas({
      ...recompensas,
      [field]: num,
    });
  };

  // Retorna detalhes de cor para cada nível
  const getNivelBadgeColor = (pontos: number) => {
    const nivel = calcularNivel(pontos);
    if (nivel.id === "observador") return "bg-slate-100 text-slate-700 border-slate-200";
    if (nivel.id === "iniciante") return "bg-sky-50 text-[#1a8ccc] border-sky-100";
    if (nivel.id === "colaborador") return "bg-purple-50 text-purple-700 border-purple-100";
    if (nivel.id === "bronze") return "bg-amber-50 text-amber-800 border-amber-100";
    if (nivel.id === "prata") return "bg-slate-100 text-slate-800 border-slate-200";
    if (nivel.id === "ouro") return "bg-yellow-50 text-yellow-800 border-yellow-100";
    return "bg-red-50 text-red-700 border-red-100 animate-pulse";
  };

  if (authLoading || (loadingUsers && user && isAdmin)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#1a8ccc]" />
        <p className="text-sm font-light" style={{ color: "var(--color-text-muted)" }}>Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 min-h-screen pb-16" style={{ backgroundColor: "var(--color-bg)" }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--color-text)" }}>Usuários e Gamificação</h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
            Monitore usuários, audite o ranking de liderança e ajuste as regras de gamificação em tempo real.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border p-5 flex items-center gap-4" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}>
          <div className="w-10 h-10 rounded-xl bg-[#E8F2F8] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-[#1a8ccc]" />
          </div>
          <div>
            <p className="text-2xl font-bold leading-none" style={{ color: "var(--color-text)" }}>{users.length}</p>
            <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>Total de Usuários</p>
          </div>
        </div>
        <div className="rounded-2xl border p-5 flex items-center gap-4" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}>
          <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-[#8B5CF6]" />
          </div>
          <div>
            <p className="text-2xl font-bold leading-none" style={{ color: "var(--color-text)" }}>{totalAdmins}</p>
            <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>Administradores</p>
          </div>
        </div>
        <div className="rounded-2xl border p-5 flex items-center gap-4" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}>
          <div className="w-10 h-10 rounded-xl bg-[#D1FAE5] flex items-center justify-center shrink-0">
            <Award className="w-5 h-5 text-[#10B981]" />
          </div>
          <div>
            <p className="text-2xl font-bold leading-none" style={{ color: "var(--color-text)" }}>{totalUsuarios}</p>
            <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>Cidadãos Ativos</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b" style={{ borderColor: "var(--color-border)" }}>
        {[
          { id: "usuarios", label: "Lista de Usuários", icon: Users },
          { id: "regras", label: "Regras de XP", icon: Settings },
          { id: "ranking", label: "Ranking de Líderes", icon: Trophy },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? "border-[#1a8ccc] text-[#1a8ccc]"
                  : "border-transparent text-gray-500 hover:text-black dark:hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content 1: Lista de Usuários */}
      {activeTab === "usuarios" && (
        <div className="space-y-6">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome ou email..."
              className="w-full pl-10 pr-4 py-3 border rounded-xl text-sm placeholder:opacity-60 outline-none transition-all focus:ring-2 focus:ring-[#1a8ccc]/15 focus:border-[#1a8ccc]"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
                color: "var(--color-text)",
              }}
            />
          </div>

          {/* Table */}
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg-alt)" }}>
                    <th className="text-left px-5 py-3 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Cidadão</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider hidden sm:table-cell">Email</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Papel</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Pontuação (XP)</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider hidden md:table-cell">Nível Dino</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider hidden lg:table-cell">Cadastro</th>
                    <th className="px-5 py-3 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-sm text-[#94A3B8]">
                        Nenhum cidadão encontrado.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const levelInfo = calcularNivel(u.pontos);
                      return (
                        <tr key={u.id} className="border-b border-[#F5F2ED] dark:border-zinc-800 hover:bg-[#FAF7F2]/50 dark:hover:bg-zinc-800/40 transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-[#E8F2F8] flex items-center justify-center overflow-hidden border border-[#E2E8F0] shrink-0">
                                {u.foto ? (
                                  <img src={u.foto} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-[#1a8ccc] text-xs font-bold uppercase">
                                    {u.nome ? u.nome.charAt(0) : "?"}
                                  </span>
                                )}
                              </div>
                              <span className="text-sm font-semibold truncate max-w-[140px]" style={{ color: "var(--color-text)" }}>
                                {u.nome || "Sem nome"}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 hidden sm:table-cell">
                            <span className="text-xs truncate max-w-[180px] block" style={{ color: "var(--color-text-secondary)" }}>{u.email}</span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                u.role === "admin"
                                  ? "bg-[#EDE9FE] text-[#8B5CF6]"
                                  : "bg-[#E8F2F8] text-[#1a8ccc]"
                              }`}
                            >
                              {u.role === "admin" ? (
                                <><Shield className="w-3 h-3" /> Admin</>
                              ) : (
                                <><UserCircle className="w-3 h-3" /> Cidadão</>
                              )}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="text-sm font-bold text-[#1a8ccc]">{u.pontos} XP</span>
                          </td>
                          <td className="px-5 py-3.5 hidden md:table-cell">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold ${getNivelBadgeColor(u.pontos)}`}>
                              <InsigniaBadge nivelId={levelInfo.id} size="sm" />
                              {levelInfo.nome}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 hidden lg:table-cell">
                            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{formatDate(u.criadoEm)}</span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <button
                              onClick={() => handleOpenEditXP(u)}
                              title="Editar XP do Usuário"
                              className="p-2 rounded-xl bg-[var(--color-bg)] hover:bg-[#E8F2F8] hover:text-[#1a8ccc] transition-colors border cursor-pointer text-gray-500 shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold"
                              style={{ borderColor: "var(--color-border)" }}
                            >
                              <Edit className="w-3.5 h-3.5" />
                              Ajustar XP
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Configuração de Regras de XP */}
      {activeTab === "regras" && (
        <div className="max-w-3xl rounded-2xl border p-6 space-y-6" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: "var(--color-border)" }}>
            <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] flex items-center justify-center shrink-0">
              <Settings className="w-5 h-5 text-[#8B5CF6]" />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: "var(--color-text)" }}>Configurar Regras de Recompensa</h2>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Defina quantos pontos de XP cada cidadão ganha por suas ações na plataforma.</p>
            </div>
          </div>

          {loadingRules ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#1a8ccc]" />
              <p className="text-xs text-gray-400">Carregando configurações...</p>
            </div>
          ) : recompensas ? (
            <form onSubmit={handleSaveRules} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Criar reclamação */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)" }}>
                    Publicar Relato
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      required
                      min="0"
                      value={recompensas.CRIAR_RECLAMACAO}
                      onChange={(e) => handleRuleChange("CRIAR_RECLAMACAO", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border bg-transparent text-sm focus:ring-2 focus:ring-[#1a8ccc]/15 focus:border-[#1a8ccc] transition-all outline-none font-bold text-[#1a8ccc]"
                      style={{ borderColor: "var(--color-border)" }}
                    />
                    <span className="inline-flex items-center justify-center px-4 rounded-xl border bg-[var(--color-bg)] text-xs font-semibold" style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>XP</span>
                  </div>
                  <p className="text-[10px] mt-1.5" style={{ color: "var(--color-text-muted)" }}>Pontos obtidos ao cadastrar uma ocorrência no mapa.</p>
                </div>

                {/* Concordar / Apoiar */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)" }}>
                    Apoiar Ocorrência (Concordar)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      required
                      min="0"
                      value={recompensas.CONCORDAR}
                      onChange={(e) => handleRuleChange("CONCORDAR", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border bg-transparent text-sm focus:ring-2 focus:ring-[#1a8ccc]/15 focus:border-[#1a8ccc] transition-all outline-none font-bold text-[#1a8ccc]"
                      style={{ borderColor: "var(--color-border)" }}
                    />
                    <span className="inline-flex items-center justify-center px-4 rounded-xl border bg-[var(--color-bg)] text-xs font-semibold" style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>XP</span>
                  </div>
                  <p className="text-[10px] mt-1.5" style={{ color: "var(--color-text-muted)" }}>Pontos obtidos ao apoiar o relato de outro cidadão.</p>
                </div>

                {/* Reclamação resolvida (Criador) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)" }}>
                    Resolução de Ocorrência (Criador)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      required
                      min="0"
                      value={recompensas.CRIADOR_RESOLVIDO}
                      onChange={(e) => handleRuleChange("CRIADOR_RESOLVIDO", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border bg-transparent text-sm focus:ring-2 focus:ring-[#1a8ccc]/15 focus:border-[#1a8ccc] transition-all outline-none font-bold text-[#10B981]"
                      style={{ borderColor: "var(--color-border)" }}
                    />
                    <span className="inline-flex items-center justify-center px-4 rounded-xl border bg-[var(--color-bg)] text-xs font-semibold" style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>XP</span>
                  </div>
                  <p className="text-[10px] mt-1.5" style={{ color: "var(--color-text-muted)" }}>Super bônus concedido quando uma ocorrência que ele mesmo criou é resolvida.</p>
                </div>

                {/* Reclamação resolvida (Apoiador) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)" }}>
                    Resolução de Ocorrência (Apoiador)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      required
                      min="0"
                      value={recompensas.VOTANTE_RESOLVIDO}
                      onChange={(e) => handleRuleChange("VOTANTE_RESOLVIDO", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border bg-transparent text-sm focus:ring-2 focus:ring-[#1a8ccc]/15 focus:border-[#1a8ccc] transition-all outline-none font-bold text-[#10B981]"
                      style={{ borderColor: "var(--color-border)" }}
                    />
                    <span className="inline-flex items-center justify-center px-4 rounded-xl border bg-[var(--color-bg)] text-xs font-semibold" style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>XP</span>
                  </div>
                  <p className="text-[10px] mt-1.5" style={{ color: "var(--color-text-muted)" }}>Bônus concedido a todos os cidadãos que apoiaram um relato após sua resolução.</p>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t" style={{ borderColor: "var(--color-border)" }}>
                <button
                  type="submit"
                  disabled={isSavingRules}
                  className="flex items-center justify-center gap-2 px-5 py-3 bg-[#1a8ccc] hover:bg-[#1572a6] disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all shadow-sm cursor-pointer"
                >
                  {isSavingRules ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Salvando Regras...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Salvar Configurações de Regras
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <p className="text-sm italic py-4" style={{ color: "var(--color-text-muted)" }}>Nenhuma regra disponível.</p>
          )}
        </div>
      )}

      {/* Tab Content 3: Ranking de Liderança (Leaderboard) */}
      {activeTab === "ranking" && (
        <div className="space-y-6">
          {/* Pódio (Top 3) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end pt-8 max-w-4xl mx-auto">
            {/* 2º Lugar */}
            {leaderboardUsers[1] && (
              <div className="order-2 md:order-1 flex flex-col items-center">
                <div className="relative mb-3">
                  <div className="w-20 h-20 rounded-full border-4 border-[#94A3B8] shadow-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                    {leaderboardUsers[1].foto ? (
                      <img src={leaderboardUsers[1].foto} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[#94A3B8] text-2xl font-bold uppercase">{leaderboardUsers[1].nome.charAt(0)}</span>
                    )}
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#94A3B8] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">2</div>
                </div>
                <div className="text-center space-y-1 bg-white dark:bg-zinc-900 border p-4 rounded-t-2xl w-full text-sm font-semibold max-w-[200px]" style={{ borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}>
                  <p className="truncate" style={{ color: "var(--color-text)" }}>{leaderboardUsers[1].nome}</p>
                  <p className="text-[#1a8ccc] font-bold">{leaderboardUsers[1].pontos} XP</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 block mt-1 w-fit mx-auto border">{calcularNivel(leaderboardUsers[1].pontos).nome}</span>
                </div>
              </div>
            )}

            {/* 1º Lugar */}
            {leaderboardUsers[0] && (
              <div className="order-1 md:order-2 flex flex-col items-center">
                <div className="relative mb-3">
                  {/* Coroa */}
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl animate-bounce">👑</span>
                  <div className="w-24 h-24 rounded-full border-4 border-[#FACC15] shadow-xl overflow-hidden bg-yellow-50 flex items-center justify-center">
                    {leaderboardUsers[0].foto ? (
                      <img src={leaderboardUsers[0].foto} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[#D97706] text-3xl font-bold uppercase">{leaderboardUsers[0].nome.charAt(0)}</span>
                    )}
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#FACC15] text-amber-900 text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center border-2 border-white">1</div>
                </div>
                <div className="text-center space-y-1 bg-white dark:bg-zinc-900 border p-5 rounded-t-2xl w-full text-base font-bold max-w-[220px]" style={{ borderColor: "var(--color-border)", boxShadow: "0 -4px 30px rgba(0,0,0,0.06)" }}>
                  <p className="truncate" style={{ color: "var(--color-text)" }}>{leaderboardUsers[0].nome}</p>
                  <p className="text-[#1a8ccc] font-bold text-lg">{leaderboardUsers[0].pontos} XP</p>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-yellow-50 text-yellow-800 block mt-1 w-fit mx-auto border border-yellow-200">{calcularNivel(leaderboardUsers[0].pontos).nome}</span>
                </div>
              </div>
            )}

            {/* 3º Lugar */}
            {leaderboardUsers[2] && (
              <div className="order-3 flex flex-col items-center">
                <div className="relative mb-3">
                  <div className="w-20 h-20 rounded-full border-4 border-[#B45309] shadow-lg overflow-hidden bg-amber-50 flex items-center justify-center">
                    {leaderboardUsers[2].foto ? (
                      <img src={leaderboardUsers[2].foto} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[#B45309] text-2xl font-bold uppercase">{leaderboardUsers[2].nome.charAt(0)}</span>
                    )}
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#B45309] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">3</div>
                </div>
                <div className="text-center space-y-1 bg-white dark:bg-zinc-900 border p-4 rounded-t-2xl w-full text-sm font-semibold max-w-[200px]" style={{ borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}>
                  <p className="truncate" style={{ color: "var(--color-text)" }}>{leaderboardUsers[2].nome}</p>
                  <p className="text-[#1a8ccc] font-bold">{leaderboardUsers[2].pontos} XP</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 block mt-1 w-fit mx-auto border border-amber-200">{calcularNivel(leaderboardUsers[2].pontos).nome}</span>
                </div>
              </div>
            )}
          </div>

          {/* Resto da Lista */}
          <div className="max-w-4xl mx-auto rounded-2xl border overflow-hidden" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}>
            <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>
              {leaderboardUsers.map((u, index) => {
                const pos = index + 1;
                const levelInfo = calcularNivel(u.pontos);
                return (
                  <div key={u.id} className="flex items-center justify-between p-4 hover:bg-[var(--color-bg-alt)] transition-colors">
                    <div className="flex items-center gap-4 min-w-0">
                      {/* Posição */}
                      <span className="w-7 text-center text-sm font-extrabold" style={{ color: pos <= 3 ? "var(--color-text)" : "var(--color-text-muted)" }}>
                        #{pos}
                      </span>
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full overflow-hidden border bg-[#E8F2F8] flex items-center justify-center shrink-0" style={{ borderColor: "var(--color-border)" }}>
                        {u.foto ? (
                          <img src={u.foto} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[#1a8ccc] text-xs font-bold uppercase">{u.nome.charAt(0)}</span>
                        )}
                      </div>
                      {/* Nome e Patente */}
                      <div className="min-w-0">
                        <p className="text-sm font-bold truncate" style={{ color: "var(--color-text)" }}>{u.nome}</p>
                        <p className="text-[10px] font-semibold" style={{ color: "var(--color-text-muted)" }}>{levelInfo.nome}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`inline-flex items-center justify-center p-1 rounded-full ${getNivelBadgeColor(u.pontos)}`}>
                        <InsigniaBadge nivelId={levelInfo.id} size="sm" />
                      </span>
                      <span className="text-sm font-black text-[#1a8ccc]">{u.pontos} XP</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Ajustar XP do Cidadão (Elegante Glassmorphism) */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-md animate-in fade-in-0 duration-200">
          <div
            className="w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
          >
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: "var(--color-border)" }}>
              <h2 className="text-base font-bold flex items-center gap-2" style={{ color: "var(--color-text)" }}>
                <Award className="w-4.5 h-4.5 text-[#1a8ccc]" />
                Ajustar XP do Cidadão
              </h2>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-lg hover:bg-[var(--color-bg-alt)] transition-colors cursor-pointer text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveXP} className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-[var(--color-bg)] rounded-xl border" style={{ borderColor: "var(--color-border)" }}>
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border bg-[#E8F2F8] flex items-center justify-center">
                  {editingUser.foto ? (
                    <img src={editingUser.foto} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[#1a8ccc] text-sm font-bold uppercase">{editingUser.nome.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold" style={{ color: "var(--color-text)" }}>{editingUser.nome}</h4>
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{editingUser.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Pontos de XP Atuais
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    required
                    value={formPoints}
                    onChange={(e) => setFormPoints(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-4 py-3 rounded-xl border bg-transparent text-lg focus:ring-2 focus:ring-[#1a8ccc]/15 focus:border-[#1a8ccc] outline-none font-bold text-[#1a8ccc] text-center"
                    style={{ borderColor: "var(--color-border)" }}
                  />
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setFormPoints(formPoints + 50)}
                      className="px-3 py-1 rounded bg-[var(--color-bg-alt)] hover:bg-[#E8F2F8] hover:text-[#1a8ccc] text-xs font-bold border transition-colors cursor-pointer"
                    >
                      +50
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormPoints(Math.max(0, formPoints - 50))}
                      className="px-3 py-1 rounded bg-[var(--color-bg-alt)] hover:bg-[#FEE2E2] hover:text-red-600 text-xs font-bold border transition-colors cursor-pointer"
                    >
                      -50
                    </button>
                  </div>
                </div>
              </div>

              {/* Informação sobre novo Nível Dino */}
              {(() => {
                const nextLevel = calcularNivel(formPoints);
                return (
                  <div className="p-3 bg-slate-50 dark:bg-zinc-800/50 rounded-xl text-xs space-y-1.5 border" style={{ borderColor: "var(--color-border)" }}>
                    <p className="font-semibold" style={{ color: "var(--color-text)" }}>Patente Calculada:</p>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider ${getNivelBadgeColor(formPoints)}`}>
                        <InsigniaBadge nivelId={nextLevel.id} size="sm" />
                        {nextLevel.nome}
                      </span>
                    </div>
                    {nextLevel.pontosRestantes > 0 ? (
                      <p style={{ color: "var(--color-text-muted)" }}>
                        Faltam {nextLevel.pontosRestantes} XP para alcançar <strong>{nextLevel.proximoNivelNome}</strong>.
                      </p>
                    ) : (
                      <p className="text-emerald-600 font-semibold">Nível máximo atingido!</p>
                    )}
                  </div>
                );
              })()}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: "var(--color-border)" }}>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2.5 rounded-xl text-sm border hover:bg-[var(--color-bg-alt)] transition-colors font-medium cursor-pointer"
                  style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSavingPoints}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1a8ccc] hover:bg-[#1572a6] disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all shadow-sm cursor-pointer"
                >
                  {isSavingPoints ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Gravando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Salvar XP
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

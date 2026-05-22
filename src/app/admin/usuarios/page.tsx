"use client";

import React, { useState, useEffect } from "react";
import { Users, Search, Shield, UserCircle, Mail, Calendar } from "lucide-react";
import { db } from "@/services/firebase/config";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

interface UserProfile {
  id: string;
  nome: string;
  email: string;
  foto: string;
  telefone: string;
  role: string;
  perfilCompleto: boolean;
  criadoEm: any;
}

export default function UsuariosAdmin() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("criadoEm", "desc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as UserProfile));
      setUsers(items);
      setLoading(false);
    }, (err) => {
      console.error("Erro ao carregar usuários:", err);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredUsers = users.filter((u) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (u.nome || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q)
    );
  });

  const totalAdmins = users.filter((u) => u.role === "admin").length;
  const totalUsuarios = users.filter((u) => u.role === "usuario").length;

  const formatDate = (ts: any) => {
    if (!ts) return "—";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-3 border-[#1a8ccc] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--color-text)" }}>Usuários</h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>Gerencie e visualize todos os usuários cadastrados na plataforma.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border p-5 flex items-center gap-4" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}>
          <div className="w-10 h-10 rounded-xl bg-[#E8F2F8] flex items-center justify-center">
            <Users className="w-5 h-5 text-[#1a8ccc]" />
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>{users.length}</p>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Total de Usuários</p>
          </div>
        </div>
        <div className="rounded-2xl border p-5 flex items-center gap-4" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}>
          <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] flex items-center justify-center">
            <Shield className="w-5 h-5 text-[#8B5CF6]" />
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>{totalAdmins}</p>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Administradores</p>
          </div>
        </div>
        <div className="rounded-2xl border p-5 flex items-center gap-4" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}>
          <div className="w-10 h-10 rounded-xl bg-[#D1FAE5] flex items-center justify-center">
            <UserCircle className="w-5 h-5 text-[#10B981]" />
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>{totalUsuarios}</p>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Cidadãos</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por nome ou email..."
          className="w-full pl-10 pr-4 py-3 border rounded-xl text-sm placeholder:opacity-60 outline-none transition-all"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
            color: "var(--color-text)",
          }}
        />
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg-alt)" }}>
                <th className="text-left px-5 py-3 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Usuário</th>
                <th className="text-left px-5 py-3 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider hidden sm:table-cell">Email</th>
                <th className="text-left px-5 py-3 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Papel</th>
                <th className="text-left px-5 py-3 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider hidden md:table-cell">Perfil</th>
                <th className="text-left px-5 py-3 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider hidden lg:table-cell">Cadastro</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-sm text-[#94A3B8]">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b border-[#F5F2ED] hover:bg-[#FAF7F2]/50 transition-colors">
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
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          u.perfilCompleto
                            ? "bg-[#D1FAE5] text-[#10B981]"
                            : "bg-[#FEF3C7] text-[#F59E0B]"
                        }`}
                      >
                        {u.perfilCompleto ? "Completo" : "Incompleto"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{formatDate(u.criadoEm)}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

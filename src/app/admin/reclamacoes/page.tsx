"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ClipboardList, Search, Filter, ChevronDown, MoreHorizontal,
  MapPin, Clock, ThumbsUp, Eye, CheckCircle, AlertCircle,
  Loader2, Inbox, X,
} from "lucide-react";
import { listarReclamacoes, type Reclamacao } from "@/services/firebase";
import { getCategoryByLabel } from "@/utils/categories";

const statusOptions = [
  { id: "todos", label: "Todos", color: "#112F4E" },
  { id: "aberto", label: "Aberto", color: "#1a8ccc" },
  { id: "em_andamento", label: "Em Andamento", color: "#F59E0B" },
  { id: "resolvido", label: "Resolvido", color: "#10B981" },
  { id: "critico", label: "Crítico", color: "#EF4444" },
];

const categorias = [
  "Todas", "Infraestrutura", "Iluminação", "Limpeza", "Saneamento", "Segurança", "Transporte", "Saúde",
];

const statusLabels: Record<string, { label: string; color: string }> = {
  aberto:       { label: "Aberto",       color: "#1a8ccc" },
  em_analise:   { label: "Em Análise",   color: "#8B5CF6" },
  em_andamento: { label: "Em Andamento", color: "#F59E0B" },
  resolvido:    { label: "Resolvido",    color: "#10B981" },
  critico:      { label: "Crítico",      color: "#EF4444" },
};

export default function AdminReclamacoes() {
  const [statusFilter, setStatusFilter] = useState("todos");
  const [categoriaFilter, setCategoriaFilter] = useState("Todas");
  const [busca, setBusca] = useState("");
  const [reclamacoes, setReclamacoes] = useState<Reclamacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await listarReclamacoes({
          status: statusFilter,
          categoria: categoriaFilter,
        });
        setReclamacoes(data);
      } catch (error) {
        console.error("Erro ao listar reclamações no painel de administração:", error);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [statusFilter, categoriaFilter]);

  const filtered = reclamacoes.filter((r) => {
    const matchBusca =
      busca === "" ||
      r.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      r.endereco.toLowerCase().includes(busca.toLowerCase());
    return matchBusca;
  });

  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--color-border-light)" }}>
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5" style={{ color: "var(--color-text)" }} />
          <h1 className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>Reclamações</h1>
          <span className="ml-2 px-2.5 py-0.5 text-xs font-bold rounded-full" style={{ backgroundColor: "var(--color-primary-container)", color: "var(--color-on-primary-container)" }}>
            {reclamacoes.length}
          </span>
        </div>
      </header>

      <div className="px-6 pb-6 space-y-4">
        {/* Search + Filter Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 pt-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Buscar por título ou bairro..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm placeholder:opacity-60 outline-none transition-all"
              style={{
                backgroundColor: "var(--color-bg-alt)",
                borderColor: "var(--color-border)",
                color: "var(--color-text)",
              }}
            />
            {busca && (
              <button
                onClick={() => setBusca("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-[#94A3B8] hover:text-[#112F4E]" />
              </button>
            )}
          </div>

          {/* Category filter */}
          <div className="relative">
            <select
              value={categoriaFilter}
              onChange={(e) => setCategoriaFilter(e.target.value)}
              className="appearance-none pl-4 pr-8 py-2.5 border rounded-xl text-sm cursor-pointer transition-colors outline-none"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
                color: "var(--color-text)",
              }}
            >
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none" />
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {statusOptions.map((s) => (
            <button
              key={s.id}
              onClick={() => setStatusFilter(s.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                statusFilter === s.id
                  ? "text-white shadow-sm"
                  : "border"
              }`}
              style={statusFilter !== s.id ? { backgroundColor: "var(--color-surface)", color: "var(--color-text-secondary)", borderColor: "var(--color-border)" } : statusFilter === s.id ? { backgroundColor: s.color } : undefined}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: statusFilter === s.id ? "white" : s.color,
                }}
              />
              {s.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            {isLoading ? (
              <div className="p-12 text-center">
                <Loader2 className="w-8 h-8 text-[#1a8ccc] mx-auto animate-spin mb-3" />
                <p className="text-sm text-[#94A3B8]">Carregando reclamações...</p>
              </div>
            ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg-alt)" }}>
                  {["Reclamação", "Categoria", "Endereço", "Concordos", "Status", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-xs font-medium uppercase tracking-wider"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((r) => {
                  const cat = getCategoryByLabel(r.categoria);
                  const st = statusLabels[r.status] ?? { label: r.status, color: "#94A3B8" };
                  return (
                  <tr
                    key={r.id}
                    className="transition-colors group"
                    style={{ borderColor: "var(--color-border-light)" }}
                  >
                    <td className="px-4 py-3.5">
                      <Link
                        href={`/admin/reclamacoes/${r.id}`}
                        className="flex items-center gap-3 group-hover:text-[#1a8ccc] transition-colors"
                      >
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: cat?.bgLight ?? "#E8F2F8" }}
                        >
                          <span
                            className="material-symbols-outlined text-[18px]"
                            style={{ color: cat?.color ?? "#1a8ccc" }}
                          >
                            {cat?.icon ?? "report"}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium transition-colors" style={{ color: "var(--color-text)" }}>
                            {r.titulo}
                          </p>
                          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{r.anonimo ? "Anônimo" : r.autorNome}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded-md"
                        style={{ backgroundColor: cat?.bgLight ?? "#FAF7F2", color: cat?.color ?? "#4A5D70" }}
                      >
                        {r.categoria}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm" style={{ color: "var(--color-text-secondary)" }}>{r.endereco}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5" style={{ color: "var(--color-text-muted)" }}>
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span className="text-sm font-medium">{r.concordos}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-semibold"
                        style={{ color: st.color }}
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: st.color }} />
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <Link
                        href={`/admin/reclamacoes/${r.id}`}
                        className="p-1.5 rounded-lg transition-colors inline-flex"
                        style={{ color: "var(--color-text-muted)" }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--color-bg-alt)"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
            )}
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y">
            {isLoading ? (
              <div className="p-12 text-center">
                <Loader2 className="w-8 h-8 text-[#1a8ccc] mx-auto animate-spin" />
              </div>
            ) : filtered.map((r) => {
              const cat = getCategoryByLabel(r.categoria);
              const st = statusLabels[r.status] ?? { label: r.status, color: "#94A3B8" };
              return (
              <Link
                key={r.id}
                href={`/admin/reclamacoes/${r.id}`}
                className="p-4 flex items-center gap-3 transition-colors"
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.backgroundColor = "var(--color-bg-alt)"}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: cat?.bgLight ?? "#E8F2F8" }}
                >
                  <span className="material-symbols-outlined text-[20px]" style={{ color: cat?.color ?? "#1a8ccc" }}>
                    {cat?.icon ?? "report"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: "var(--color-text)" }}>{r.titulo}</p>
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {r.endereco} · {r.concordos} concordos
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: st.color }} />
                  <span className="text-xs font-medium" style={{ color: st.color }}>
                    {st.label}
                  </span>
                </div>
              </Link>
              );
            })}
          </div>

          {/* Empty state */}
          {!isLoading && filtered.length === 0 && (
            <div className="p-12 text-center">
              <Inbox className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--color-border)" }} />
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                Nenhuma reclamação encontrada com estes filtros.
              </p>
            </div>
          )}
        </div>

        {/* Summary footer */}
        <div className="flex items-center justify-between text-xs pt-2" style={{ color: "var(--color-text-muted)" }}>
          <span>Mostrando {filtered.length} reclamações</span>
        </div>
      </div>
    </>
  );
}


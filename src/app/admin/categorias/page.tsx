"use client";

import React from "react";
import { CATEGORIES } from "@/utils/categories";
import { FolderOpen, Hash } from "lucide-react";

const subcategorias: Record<string, string[]> = {
  saude: ["UBS", "Hospital", "Farmácia Popular", "Saneamento", "Outros"],
  transporte: ["Semáforo", "Sinalização", "Ponto de Ônibus", "Pavimentação", "Outros"],
  infraestrutura: ["Iluminação Pública", "Buraco", "Calçada", "Esgoto", "Outros"],
  seguranca: ["Patrulhamento", "Iluminação", "Vandalismo", "Ponto de Tráfico", "Outros"],
  educacao: ["Escola", "Creche", "Transporte Escolar", "Outros"],
  limpeza: ["Coleta de Lixo", "Entulho", "Poda de Árvore", "Outros"],
  meio_ambiente: ["Queimada", "Desmatamento", "Poluição", "Outros"],
  iluminacao: ["Poste Queimado", "Falta de Iluminação", "Fiação Exposta", "Outros"],
  saneamento: ["Esgoto", "Água", "Enchente", "Outros"],
};

export default function Categorias() {
  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--color-text)" }}>Categorias</h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
          Visualize todas as categorias e subcategorias disponíveis para classificar reclamações.
        </p>
      </div>

      {/* Summary */}
      <div className="flex gap-4 flex-wrap">
        <div className="rounded-2xl border p-5 flex items-center gap-4" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}>
          <div className="w-10 h-10 rounded-xl bg-[#E8F2F8] flex items-center justify-center">
            <FolderOpen className="w-5 h-5 text-[#1a8ccc]" />
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>{CATEGORIES.length}</p>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Categorias ativas</p>
          </div>
        </div>
        <div className="rounded-2xl border p-5 flex items-center gap-4" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}>
          <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] flex items-center justify-center">
            <Hash className="w-5 h-5 text-[#8B5CF6]" />
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
              {Object.values(subcategorias).reduce((sum, arr) => sum + arr.length, 0)}
            </p>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Subcategorias</p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {CATEGORIES.map((cat) => {
          const subs = subcategorias[cat.id] ?? [];
          return (
            <div
              key={cat.id}
              className="rounded-2xl border p-5 transition-shadow space-y-4"
              style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: cat.bgLight }}
                >
                  <span
                    className="material-symbols-outlined text-[22px]"
                    style={{ color: cat.color }}
                  >
                    {cat.icon}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold" style={{ color: "var(--color-text)" }}>{cat.label}</h3>
                  <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--color-text-muted)" }}>
                    {subs.length} subcategorias
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {subs.map((sub) => (
                  <span
                    key={sub}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-medium border"
                    style={{
                      backgroundColor: cat.bgLight,
                      color: cat.color,
                      borderColor: cat.color + "30",
                    }}
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

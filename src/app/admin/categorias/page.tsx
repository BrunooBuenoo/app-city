"use client";

import React, { useState, useEffect } from "react";
import { useCategorias } from "@/hooks/useCategorias";
import { salvarCategoriaDb, excluirCategoriaDb, type CategoryDb } from "@/services/firebase";
import { useToast } from "@/components/ui/Toast";
import { FolderOpen, Hash, Plus, Pencil, Trash, X, Save, AlertTriangle, Loader2 } from "lucide-react";

// Lista de ícones populares sugeridos
const ICONES_SUGERIDOS = [
  { id: "medical_services", label: "Saúde" },
  { id: "directions_bus", label: "Ônibus" },
  { id: "construction", label: "Obra" },
  { id: "security", label: "Escudo" },
  { id: "school", label: "Escola" },
  { id: "delete", label: "Lixo" },
  { id: "eco", label: "Folha" },
  { id: "lightbulb", label: "Lâmpada" },
  { id: "water_drop", label: "Gota" },
  { id: "pets", label: "Pet" },
  { id: "sports_soccer", label: "Bola" },
  { id: "park", label: "Árvore" },
  { id: "event", label: "Calendário" },
  { id: "apartment", label: "Prédio" },
  { id: "warning", label: "Alerta" },
];

// Paleta de cores premium sugeridas
const CORES_SUGERIDAS = [
  "#EF4444", // Vermelho
  "#3B82F6", // Azul
  "#F59E0B", // Amarelo/Laranja
  "#1E3A8A", // Azul Escuro
  "#8B5CF6", // Roxo
  "#10B981", // Verde Água
  "#22C55E", // Verde
  "#FACC15", // Amarelo Claro
  "#06B6D4", // Ciano
  "#EC4899", // Rosa
  "#6366F1", // Indigo
  "#14B8A6", // Teal
  "#84CC16", // Lima
  "#F97316", // Laranja
  "#64748B", // Slate
];

export default function Categorias() {
  const { categorias, subcategoriasMap, isLoading: loadingCats, refresh } = useCategorias();
  const { showToast } = useToast();

  // Estados dos Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Estados dos Formulários
  const [editingCat, setEditingCat] = useState<CategoryDb | null>(null);
  const [formId, setFormId] = useState("");
  const [formLabel, setFormLabel] = useState("");
  const [formColor, setFormColor] = useState("#EF4444");
  const [formIcon, setFormIcon] = useState("folder");
  const [formSubcats, setFormSubcats] = useState<string[]>([]);
  const [newSubcatInput, setNewSubcatInput] = useState("");
  const [catToDelete, setCatToDelete] = useState<CategoryDb | null>(null);

  // Gera slug automaticamente baseado no Label
  useEffect(() => {
    if (!editingCat && formLabel) {
      const slug = formLabel
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove acentos
        .replace(/[^a-z0-9\s-]/g, "") // remove caracteres especiais
        .trim()
        .replace(/\s+/g, "_"); // substitui espaços por underscore
      setFormId(slug);
    }
  }, [formLabel, editingCat]);

  // Abre modal para adicionar
  const handleOpenAdd = () => {
    setEditingCat(null);
    setFormId("");
    setFormLabel("");
    setFormColor("#3B82F6");
    setFormIcon("folder");
    setFormSubcats(["Outros"]);
    setNewSubcatInput("");
    setIsModalOpen(true);
  };

  // Abre modal para editar
  const handleOpenEdit = (cat: CategoryDb) => {
    setEditingCat(cat);
    setFormId(cat.id);
    setFormLabel(cat.label);
    setFormColor(cat.color);
    setFormIcon(cat.icon);
    setFormSubcats([...cat.subcategorias]);
    setNewSubcatInput("");
    setIsModalOpen(true);
  };

  // Adiciona subcategoria na lista do form
  const handleAddSubcat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = newSubcatInput.trim();
    if (!clean) return;
    
    if (formSubcats.some(s => s.toLowerCase() === clean.toLowerCase())) {
      showToast("warning", "Esta subcategoria já foi adicionada");
      return;
    }

    setFormSubcats([...formSubcats, clean]);
    setNewSubcatInput("");
  };

  // Remove subcategoria da lista do form
  const handleRemoveSubcat = (indexToRemove: number) => {
    setFormSubcats(formSubcats.filter((_, i) => i !== indexToRemove));
  };

  // Salva Categoria no Firebase
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formId.trim() || !formLabel.trim()) {
      showToast("warning", "Preencha todos os campos obrigatórios");
      return;
    }

    if (formSubcats.length === 0) {
      showToast("warning", "Adicione pelo menos uma subcategoria");
      return;
    }

    setIsSaving(true);
    try {
      // Gera automaticamente a cor clara de fundo (13% de opacidade hex = 20)
      const bgLight = formColor + "18";

      await salvarCategoriaDb({
        id: formId.trim(),
        label: formLabel.trim(),
        color: formColor,
        bgLight,
        icon: formIcon,
        subcategorias: formSubcats,
        ordem: editingCat?.ordem,
      });

      showToast("success", `Categoria '${formLabel}' salva com sucesso!`);
      setIsModalOpen(false);
      refresh(); // Atualiza dados
    } catch (err) {
      console.error(err);
      showToast("warning", "Erro ao salvar categoria");
    } finally {
      setIsSaving(false);
    }
  };

  // Abre confirmação de exclusão
  const handleOpenDelete = (cat: CategoryDb) => {
    setCatToDelete(cat);
    setIsDeleteModalOpen(true);
  };

  // Exclui Categoria do Firebase
  const handleDelete = async () => {
    if (!catToDelete) return;
    setIsSaving(true);
    try {
      await excluirCategoriaDb(catToDelete.id);
      showToast("success", `Categoria '${catToDelete.label}' removida com sucesso!`);
      setIsDeleteModalOpen(false);
      setCatToDelete(null);
      refresh();
    } catch (err) {
      console.error(err);
      showToast("warning", "Erro ao remover categoria");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 min-h-screen pb-16" style={{ backgroundColor: "var(--color-bg)" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--color-text)" }}>Categorias</h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
            Gerencie as categorias e subcategorias usadas pelos cidadãos para classificar ocorrências no mapa.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1a8ccc] hover:bg-[#1572a6] active:scale-[0.98] text-white font-medium rounded-xl text-sm transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Nova Categoria
        </button>
      </div>

      {/* Loading state */}
      {loadingCats && categorias.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#1a8ccc]" />
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Carregando categorias...</p>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="flex gap-4 flex-wrap">
            <div
              className="rounded-2xl border p-5 flex items-center gap-4 min-w-[200px]"
              style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}
            >
              <div className="w-10 h-10 rounded-xl bg-[#E8F2F8] flex items-center justify-center shrink-0">
                <FolderOpen className="w-5 h-5 text-[#1a8ccc]" />
              </div>
              <div>
                <p className="text-2xl font-bold leading-none" style={{ color: "var(--color-text)" }}>{categorias.length}</p>
                <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>Categorias ativas</p>
              </div>
            </div>
            <div
              className="rounded-2xl border p-5 flex items-center gap-4 min-w-[200px]"
              style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}
            >
              <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] flex items-center justify-center shrink-0">
                <Hash className="w-5 h-5 text-[#8B5CF6]" />
              </div>
              <div>
                <p className="text-2xl font-bold leading-none" style={{ color: "var(--color-text)" }}>
                  {Object.values(subcategoriasMap).reduce((sum, arr) => sum + arr.length, 0)}
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>Subcategorias cadastradas</p>
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {categorias.map((cat) => {
              const subs = cat.subcategorias || [];
              return (
                <div
                  key={cat.id}
                  className="rounded-2xl border p-5 transition-all space-y-4 group relative"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    borderColor: "var(--color-border)",
                    boxShadow: "var(--shadow-card)",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.06)"}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = "var(--shadow-card)"}
                >
                  {/* Hover Action Buttons */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      title="Editar Categoria"
                      className="p-1.5 rounded-lg bg-[var(--color-bg)] hover:bg-[#E8F2F8] hover:text-[#1a8ccc] transition-colors cursor-pointer text-gray-500 border"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenDelete(cat)}
                      title="Excluir Categoria"
                      className="p-1.5 rounded-lg bg-[var(--color-bg)] hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer text-gray-500 border"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Header info */}
                  <div className="flex items-center gap-3 pr-14">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: cat.bgLight || cat.color + "12" }}
                    >
                      <span
                        className="material-symbols-outlined text-[22px]"
                        style={{ color: cat.color }}
                      >
                        {cat.icon}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold truncate" style={{ color: "var(--color-text)" }}>{cat.label}</h3>
                      <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--color-text-muted)" }}>
                        {subs.length} subcategorias
                      </p>
                    </div>
                  </div>

                  {/* Subcategories list */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {subs.map((sub) => (
                      <span
                        key={sub}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-colors hover:brightness-95"
                        style={{
                          backgroundColor: cat.bgLight || cat.color + "12",
                          color: cat.color,
                          borderColor: cat.color + "25",
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
        </>
      )}

      {/* MODAL: Adicionar / Editar Categoria (Elegante Glassmorphism) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-md animate-in fade-in-0 duration-200">
          <div
            className="w-full max-w-2xl rounded-2xl border shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
            style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: "var(--color-border)" }}>
              <h2 className="text-lg font-bold" style={{ color: "var(--color-text)" }}>
                {editingCat ? `Editar Categoria: ${editingCat.label}` : "Nova Categoria"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[var(--color-bg-alt)] transition-colors cursor-pointer text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nome */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)" }}>
                    Nome da Categoria *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Infraestrutura, Esportes"
                    value={formLabel}
                    onChange={(e) => setFormLabel(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border bg-transparent text-sm focus:ring-2 focus:ring-[#1a8ccc]/15 focus:border-[#1a8ccc] transition-all outline-none"
                    style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
                  />
                </div>

                {/* ID/Slug (Automático) */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)" }}>
                    Identificador (Slug ID)
                  </label>
                  <input
                    type="text"
                    disabled
                    placeholder="Gerado automaticamente..."
                    value={formId}
                    className="w-full px-4 py-2.5 rounded-xl border bg-[var(--color-bg)] text-sm cursor-not-allowed opacity-60 outline-none"
                    style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}
                  />
                  <p className="text-[10px] mt-1" style={{ color: "var(--color-text-muted)" }}>
                    Usado internamente pelo sistema de rotas e banco.
                  </p>
                </div>
              </div>

              {/* Ícone Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)" }}>
                  Ícone (Material Symbols) *
                </label>
                <div className="flex gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border"
                    style={{ backgroundColor: formColor + "12", borderColor: formColor + "30" }}
                  >
                    <span className="material-symbols-outlined text-[24px]" style={{ color: formColor }}>
                      {formIcon}
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    value={formIcon}
                    onChange={(e) => setFormIcon(e.target.value)}
                    placeholder="Digite o nome do ícone..."
                    className="flex-1 px-4 py-2.5 rounded-xl border bg-transparent text-sm focus:ring-2 focus:ring-[#1a8ccc]/15 focus:border-[#1a8ccc] transition-all outline-none"
                    style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
                  />
                </div>

                {/* Ícones Sugeridos */}
                <div className="mt-3 space-y-1.5">
                  <p className="text-[11px] font-medium" style={{ color: "var(--color-text-secondary)" }}>Sugestões rápidas:</p>
                  <div className="flex flex-wrap gap-1">
                    {ICONES_SUGERIDOS.map((ico) => (
                      <button
                        key={ico.id}
                        type="button"
                        onClick={() => setFormIcon(ico.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs border flex items-center gap-1.5 transition-all cursor-pointer ${
                          formIcon === ico.id
                            ? "bg-zinc-900 text-white border-zinc-950 dark:bg-white dark:text-zinc-900 dark:border-white"
                            : "bg-[var(--color-bg)] hover:bg-[var(--color-bg-alt)]"
                        }`}
                        style={{ borderColor: "var(--color-border)", color: formIcon === ico.id ? undefined : "var(--color-text-secondary)" }}
                      >
                        <span className="material-symbols-outlined text-[14px]">{ico.id}</span>
                        {ico.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cor Principal */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)" }}>
                  Cor Principal da Categoria *
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formColor}
                    onChange={(e) => setFormColor(e.target.value)}
                    className="w-11 h-11 rounded-xl p-0.5 border cursor-pointer shrink-0"
                    style={{ borderColor: "var(--color-border)" }}
                  />
                  <input
                    type="text"
                    required
                    value={formColor}
                    onChange={(e) => setFormColor(e.target.value)}
                    placeholder="#HEX"
                    className="w-32 px-4 py-2.5 rounded-xl border bg-transparent text-sm focus:ring-2 focus:ring-[#1a8ccc]/15 focus:border-[#1a8ccc] transition-all outline-none"
                    style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
                  />
                  <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    A cor de fundo clara será gerada automaticamente.
                  </div>
                </div>

                {/* Cores Sugeridas */}
                <div className="mt-3">
                  <div className="flex flex-wrap gap-2">
                    {CORES_SUGERIDAS.map((cor) => (
                      <button
                        key={cor}
                        type="button"
                        onClick={() => setFormColor(cor)}
                        className="w-7 h-7 rounded-full border border-white/50 shadow-sm cursor-pointer transition-all hover:scale-110 active:scale-95"
                        style={{ backgroundColor: cor, boxShadow: formColor === cor ? "0 0 0 2px #fff, 0 0 0 4px " + cor : undefined }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Subcategorias Manager */}
              <div className="space-y-3 pt-4 border-t" style={{ borderColor: "var(--color-border)" }}>
                <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                  Subcategorias da Categoria *
                </label>
                
                {/* Input Adição */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Adicionar subcategoria..."
                    value={newSubcatInput}
                    onChange={(e) => setNewSubcatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSubcat();
                      }
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl border bg-transparent text-sm focus:ring-2 focus:ring-[#1a8ccc]/15 focus:border-[#1a8ccc] transition-all outline-none"
                    style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSubcat()}
                    className="px-4 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 font-medium rounded-xl text-sm transition-colors cursor-pointer shrink-0"
                  >
                    Adicionar
                  </button>
                </div>

                {/* Tags de subcategorias */}
                <div className="flex flex-wrap gap-2 p-4 rounded-xl border border-dashed" style={{ backgroundColor: "var(--color-bg)", borderColor: "var(--color-border)" }}>
                  {formSubcats.length === 0 ? (
                    <p className="text-xs italic py-1" style={{ color: "var(--color-text-muted)" }}>
                      Nenhuma subcategoria adicionada. Adicione pelo menos uma acima.
                    </p>
                  ) : (
                    formSubcats.map((sub, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border"
                        style={{
                          backgroundColor: formColor + "12",
                          color: formColor,
                          borderColor: formColor + "25",
                        }}
                      >
                        {sub}
                        <button
                          type="button"
                          onClick={() => handleRemoveSubcat(idx)}
                          className="hover:bg-black/10 dark:hover:bg-white/10 rounded p-0.5 transition-colors cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>
            </form>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t flex items-center justify-end gap-3" style={{ borderColor: "var(--color-border)" }}>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-sm border hover:bg-[var(--color-bg-alt)] transition-all cursor-pointer font-medium"
                style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center justify-center gap-2 px-5 py-2 bg-[#1a8ccc] hover:bg-[#1572a6] disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all shadow-sm cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Salvar Categoria
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Confirmação de Exclusão (Alerta Premium) */}
      {isDeleteModalOpen && catToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-md animate-in fade-in-0 duration-200">
          <div
            className="w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
          >
            <div className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold" style={{ color: "var(--color-text)" }}>Excluir Categoria?</h3>
                <p className="text-sm" style={{ color: "var(--color-text-secondary)", lineHeight: "relaxed" }}>
                  Tem certeza que deseja excluir permanentemente a categoria <strong className="font-semibold text-black dark:text-white">"{catToDelete.label}"</strong>?
                </p>
                <p className="text-xs p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-900/50 rounded-xl" style={{ color: "#D97706" }}>
                  <strong>Atenção:</strong> Isso removerá a categoria como opção para novos relatos no mapa. Relatos antigos no banco que usam esta categoria não serão apagados, mas a categoria não estará mais ativa.
                </p>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t flex items-center justify-end gap-3" style={{ borderColor: "var(--color-border)" }}>
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setCatToDelete(null);
                }}
                className="px-4 py-2 rounded-xl text-sm border hover:bg-[var(--color-bg-alt)] transition-all cursor-pointer font-medium"
                style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSaving}
                className="flex items-center justify-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all shadow-sm cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  <>
                    <Trash className="w-4 h-4" />
                    Sim, Excluir
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

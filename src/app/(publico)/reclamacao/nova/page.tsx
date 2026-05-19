"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ConfirmationModal from "@/components/ui/modal/ConfirmationModal";
import { CATEGORIES } from "@/utils/categories";
import { useAuth } from "@/contexts/AuthContext";
import { criarReclamacao, uploadFotoReclamacao } from "@/services/firebase";

export default function NovaReclamacao() {
  const router = useRouter();
  const { user, isLoggedIn, loading } = useAuth();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcat, setSelectedSubcat] = useState<number>(0);
  const [anonimo, setAnonimo] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [fotos, setFotos] = useState<File[]>([]);
  const [isSending, setIsSending] = useState(false);

  // Redireciona se não logado
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/login");
    }
  }, [loading, isLoggedIn, router]);

  const handleSubmit = async () => {
    if (!selectedCategory || !titulo.trim() || !user) return;
    setIsSending(true);

    try {
      // 1. Criar reclamação no Firestore
      const cat = CATEGORIES.find((c) => c.id === selectedCategory);
      const currentSubcats = subcategorias[selectedCategory] ?? [];

      const recId = await criarReclamacao({
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        categoria: cat?.label ?? selectedCategory,
        subcategoria: currentSubcats[selectedSubcat] ?? "",
        status: "aberto",
        endereco: "Marília, SP",
        latitude: -22.2139 + (Math.random() - 0.5) * 0.02,
        longitude: -49.9458 + (Math.random() - 0.5) * 0.02,
        fotos: [],
        anonimo,
        autorId: user.uid,
        autorNome: user.displayName || "Anônimo",
        autorFoto: user.photoURL || "",
      });

      // 2. Upload de fotos (se houver)
      if (fotos.length > 0) {
        const urls = await Promise.all(
          fotos.map((f) => uploadFotoReclamacao(f, recId))
        );
        // TODO: atualizar doc com URLs (updateDoc)
      }

      setShowConfirmation(true);
    } catch (err) {
      console.error("Erro ao criar reclamação:", err);
      alert("Erro ao enviar reclamação. Tente novamente.");
    }

    setIsSending(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFotos(Array.from(e.target.files).slice(0, 3));
    }
  };

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

  const currentSubcats = selectedCategory ? subcategorias[selectedCategory] ?? [] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-3 border-[#1a8ccc] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto w-full">
      <main className="md:bg-white md:p-8 md:rounded-2xl md:shadow-sm md:border md:border-[#E2E8F0]">
        {/* Category Selection */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-[#112F4E]">
            Selecione a Categoria
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setSelectedSubcat(0); }}
                  className={`flex flex-col items-center justify-center p-5 rounded-xl border-2 transition-all active:scale-95 ${
                    isSelected
                      ? "shadow-md"
                      : "border-[#E2E8F0] bg-white hover:border-[#94A3B8]"
                  }`}
                  style={
                    isSelected
                      ? { borderColor: cat.color, backgroundColor: cat.bgLight }
                      : undefined
                  }
                >
                  <span
                    className="material-symbols-outlined mb-2 text-2xl"
                    style={{ color: isSelected ? cat.color : "#94A3B8" }}
                  >
                    {cat.icon}
                  </span>
                  <span
                    className="text-xs font-medium"
                    style={{ color: isSelected ? cat.color : "#4A5D70" }}
                  >
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Subcategories */}
        {currentSubcats.length > 0 && (
          <section className="mb-8 overflow-hidden">
            <h2 className="text-xs font-semibold mb-3 text-[#94A3B8] uppercase tracking-wider">
              TIPO DE PROBLEMA
            </h2>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {currentSubcats.map((sub, i) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubcat(i)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors ${
                    selectedSubcat === i
                      ? "bg-[#1a8ccc] text-white"
                      : "bg-[#FAF7F2] text-[#4A5D70] hover:bg-[#F5F2ED] border border-[#E2E8F0]"
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Location Card */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-[#112F4E]">
            Localização
          </h2>
          <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-md border border-[#E2E8F0] bg-[#FAF7F2]">
            <div className="absolute inset-0 bg-[#E2E8F0] flex items-center justify-center">
              <span
                className="material-symbols-outlined text-[#1a8ccc] text-5xl drop-shadow-lg"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                location_on
              </span>
            </div>
          </div>
          <div className="mt-4 p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#94A3B8]">near_me</span>
              <span className="text-sm text-[#112F4E]">Marília, SP</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="py-2.5 rounded-lg border-2 border-[#1a8ccc] text-[#1a8ccc] text-sm font-medium flex items-center justify-center gap-2 active:bg-[#E8F2F8]">
                <span className="material-symbols-outlined text-lg">check</span>
                No Local
              </button>
              <button className="py-2.5 rounded-lg border border-[#E2E8F0] text-[#4A5D70] text-sm font-medium flex items-center justify-center gap-2 active:bg-[#FAF7F2]">
                <span className="material-symbols-outlined text-lg">edit_location</span>
                Outro Local
              </button>
            </div>
          </div>
        </section>

        {/* Form Fields */}
        <section className="mb-8 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-[#4A5D70]">
              Título do Relatório
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-white focus:border-[#1a8ccc] focus:ring-2 focus:ring-[#1a8ccc]/15 transition-all outline-none text-sm"
              placeholder="Ex: Poste queimado na calçada"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-[#4A5D70]">
              Descrição Detalhada
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-white focus:border-[#1a8ccc] focus:ring-2 focus:ring-[#1a8ccc]/15 transition-all outline-none text-sm resize-none"
              placeholder="Descreva o ocorrido com o máximo de detalhes possível..."
              rows={4}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>
        </section>

        {/* Evidence Upload */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-[#112F4E]">
            Anexar Evidências
          </h2>
          <label className="border-2 border-dashed border-[#E2E8F0] rounded-xl p-8 flex flex-col items-center justify-center bg-[#FAF7F2] active:bg-[#F5F2ED] transition-colors cursor-pointer">
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <span className="material-symbols-outlined text-[#1a8ccc] text-4xl mb-3">
              add_a_photo
            </span>
            <p className="text-sm font-medium text-[#112F4E] text-center">
              {fotos.length > 0 ? `${fotos.length} arquivo(s) selecionado(s)` : "Toque para tirar foto ou fazer upload"}
            </p>
            <p className="text-xs text-[#94A3B8] mt-1">PNG, JPG ou MOV até 10MB</p>
          </label>
          {fotos.length > 0 && (
            <div className="flex gap-2 mt-3">
              {fotos.map((f, i) => (
                <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#E2E8F0]">
                  <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Privacy Toggle */}
        <section className="mb-8 flex items-center justify-between p-4 bg-[#FAF7F2] rounded-xl">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#4A5D70]">visibility_off</span>
            <div>
              <p className="text-sm font-medium text-[#112F4E]">Publicar anonimamente</p>
              <p className="text-xs text-[#94A3B8]">Seu nome não será exibido publicamente</p>
            </div>
          </div>
          <button
            onClick={() => setAnonimo(!anonimo)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
              anonimo ? "bg-[#1a8ccc]" : "bg-[#E2E8F0]"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out mt-0.5 ${
                anonimo ? "translate-x-5 ml-0.5" : "translate-x-0.5"
              }`}
            />
          </button>
        </section>

        {/* Action Button */}
        <div className="mt-8 mb-12">
          <button
            onClick={handleSubmit}
            disabled={!selectedCategory || !titulo.trim() || isSending}
            className="w-full py-4 rounded-xl bg-[#1a8ccc] text-white font-semibold text-base shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-3 hover:bg-[#1572a6] disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSending ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                Publicar Reclamação
                <span className="material-symbols-outlined">send</span>
              </>
            )}
          </button>
        </div>
      </main>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
      />
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ConfirmationModal from "@/components/ui/modal/ConfirmationModal";
import { CATEGORIES } from "@/utils/categories";
import { useAuth } from "@/contexts/AuthContext";
import { criarReclamacao, uploadFotoReclamacao } from "@/services/firebase";
import { db } from "@/services/firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import { Map, MapMarker, MarkerContent, MapControls, MapClickHandler } from "@/components/ui/map";

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

  // Coordenadas e endereço reais
  const [lat, setLat] = useState(-22.2139);
  const [lng, setLng] = useState(-49.9458);
  const [endereco, setEndereco] = useState("Marília, SP");

  // Redireciona se não logado
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/login");
    }
  }, [loading, isLoggedIn, router]);

  // Busca o endereço reverso baseado nas coordenadas
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
          {
            headers: {
              "Accept-Language": "pt-BR",
            },
          }
        );
        const data = await res.json();
        if (data && data.display_name) {
          const addr = data.address;
          const road = addr.road || addr.pedestrian || "";
          const suburb = addr.suburb || addr.neighbourhood || "";
          const houseNumber = addr.house_number ? `, ${addr.house_number}` : "";
          if (road) {
            setEndereco(`${road}${houseNumber} - ${suburb}, Marília - SP`);
          } else {
            setEndereco(data.display_name);
          }
        }
      } catch (err) {
        console.error("Erro ao buscar endereço:", err);
      }
    };

    const timer = setTimeout(() => {
      fetchAddress();
    }, 850);
    return () => clearTimeout(timer);
  }, [lat, lng]);

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
        endereco: endereco.trim() || "Marília, SP",
        latitude: lat,
        longitude: lng,
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
        // Atualiza o documento com as URLs das fotos enviadas
        await updateDoc(doc(db, "reclamacoes", recId), { fotos: urls });
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
    <div className="max-w-6xl mx-auto px-4 py-8 w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#112F4E] tracking-tight">
          Nova Reclamação
        </h1>
        <p className="text-sm text-[#94A3B8] mt-1">
          Informe os detalhes do problema para que a prefeitura possa analisar e tomar providências.
        </p>
      </div>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column - Form Details */}
        <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#E2E8F0] space-y-6">
          {/* Category Selection */}
          <section>
            <h2 className="text-lg font-semibold mb-4 text-[#112F4E]">
              Selecione a Categoria
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSelectedSubcat(0);
                    }}
                    className={`flex flex-col items-center justify-center p-5 rounded-xl border-2 transition-all active:scale-95 cursor-pointer ${
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
            <section className="overflow-hidden">
              <h2 className="text-xs font-semibold mb-3 text-[#94A3B8] uppercase tracking-wider">
                Tipo de problema específico
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

          {/* Form Fields */}
          <section className="space-y-4 pt-2 border-t border-[#F5F2ED]">
            <h2 className="text-lg font-semibold text-[#112F4E]">
              Detalhes do Relato
            </h2>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-[#4A5D70]">
                Título da reclamação
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-white focus:border-[#1a8ccc] focus:ring-2 focus:ring-[#1a8ccc]/15 transition-all outline-none text-sm"
                placeholder="Ex: Poste de energia apagado"
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-[#4A5D70]">
                Descrição detalhada
              </label>
              <textarea
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-white focus:border-[#1a8ccc] focus:ring-2 focus:ring-[#1a8ccc]/15 transition-all outline-none text-sm resize-none"
                placeholder="Descreva o que está ocorrendo e dê detalhes que facilitem a localização do problema..."
                rows={4}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>
          </section>

          {/* Evidence Upload */}
          <section className="pt-2 border-t border-[#F5F2ED]">
            <h2 className="text-lg font-semibold mb-3 text-[#112F4E]">
              Anexar Evidências (Fotos)
            </h2>
            <label className="border-2 border-dashed border-[#E2E8F0] rounded-xl p-8 flex flex-col items-center justify-center bg-[#FAF7F2] hover:bg-[#FAF7F2]/60 active:bg-[#F5F2ED] transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <span className="material-symbols-outlined text-[#1a8ccc] text-4xl mb-2">
                add_a_photo
              </span>
              <p className="text-sm font-medium text-[#112F4E] text-center">
                {fotos.length > 0
                  ? `${fotos.length} arquivo(s) selecionado(s)`
                  : "Clique para tirar foto ou fazer upload"}
              </p>
              <p className="text-xs text-[#94A3B8] mt-1">PNG, JPG ou JPEG até 10MB (máximo 3 fotos)</p>
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
        </div>

        {/* Right Column - Location, Privacy & Actions */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
          {/* Location Selector (Interactive Map) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E2E8F0] space-y-4">
            <h2 className="text-lg font-semibold text-[#112F4E]">
              Localização da Ocorrência
            </h2>
            <p className="text-xs text-[#94A3B8]">
              Navegue pelo mapa ou clique para posicionar o pin no local exato do problema.
            </p>

            {/* Interactive Map */}
            <div className="relative w-full h-72 rounded-xl overflow-hidden shadow-inner border border-[#E2E8F0] bg-[#FAF7F2]">
              <Map center={[lng, lat]} zoom={15}>
                <MapControls position="top-right" showZoom showLocate onLocate={(coords) => {
                  setLat(coords.latitude);
                  setLng(coords.longitude);
                }} />
                
                <MapMarker latitude={lat} longitude={lng} draggable onDragEnd={(coords) => {
                  setLat(coords.lat);
                  setLng(coords.lng);
                }}>
                  <MarkerContent>
                    <div className="relative">
                      <div className="absolute -inset-2 rounded-full bg-[#1a8ccc]/30 animate-ping" />
                      <div className="w-6 h-6 rounded-full border-4 border-white shadow-lg bg-[#1a8ccc] relative z-10" />
                    </div>
                  </MarkerContent>
                </MapMarker>

                <MapClickHandler onClick={(coords) => {
                  setLat(coords.lat);
                  setLng(coords.lng);
                }} />
              </Map>
            </div>

            {/* Editable Address Textarea */}
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
                Endereço Identificado
              </label>
              <div className="flex gap-2 items-start p-3 bg-[#FAF7F2] rounded-xl border border-[#E2E8F0]">
                <span className="material-symbols-outlined text-[#94A3B8] mt-0.5">near_me</span>
                <textarea
                  className="w-full text-sm text-[#112F4E] bg-transparent outline-none resize-none font-light leading-relaxed h-12"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  placeholder="Selecione um ponto no mapa ou digite o endereço..."
                />
              </div>
            </div>
          </div>

          {/* Privacy & Actions */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E2E8F0] space-y-6">
            {/* Privacy Toggle */}
            <section className="flex items-center justify-between p-4 bg-[#FAF7F2] rounded-xl">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#4A5D70]">visibility_off</span>
                <div>
                  <p className="text-sm font-medium text-[#112F4E]">Publicar anonimamente</p>
                  <p className="text-xs text-[#94A3B8]">Seu nome não será exibido publicamente</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAnonimo(!anonimo)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out border-2 border-transparent outline-none ${
                  anonimo ? "bg-[#1a8ccc]" : "bg-[#E2E8F0]"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    anonimo ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </section>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!selectedCategory || !titulo.trim() || isSending}
              className="w-full py-4 rounded-xl bg-[#1a8ccc] text-white font-semibold text-base shadow-md hover:bg-[#1572a6] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
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

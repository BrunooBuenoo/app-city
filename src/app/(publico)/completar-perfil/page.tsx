"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { updateUserProfile } from "@/services/firebase";

export default function CompletarPerfil() {
  const router = useRouter();
  const { user, profile, isLoggedIn, loading, refreshProfile } = useAuth();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [faixaEtaria, setFaixaEtaria] = useState("18-24");
  const [genero, setGenero] = useState("feminino");
  const [isSaving, setIsSaving] = useState(false);

  // Redireciona se não logado
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/login");
    }
  }, [loading, isLoggedIn, router]);

  // Preenche com dados do Google
  useEffect(() => {
    if (user) {
      setNome(user.displayName || "");
      setEmail(user.email || "");
    }
    if (profile) {
      if (profile.telefone) setTelefone(profile.telefone);
      if (profile.faixaEtaria) setFaixaEtaria(profile.faixaEtaria);
      if (profile.genero) setGenero(profile.genero);
    }
  }, [user, profile]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await updateUserProfile(user.uid, {
        nome,
        email,
        telefone,
        faixaEtaria,
        genero,
        perfilCompleto: true,
      });
      await refreshProfile();
      router.push("/usuario/dashboard");
    } catch (err) {
      console.error("Erro ao salvar perfil:", err);
      alert("Erro ao salvar. Tente novamente.");
    }
    setIsSaving(false);
  };

  const faixas = ["13-17", "18-24", "25-34", "35-44", "45-59", "60+"];
  const generos = [
    { value: "masculino", label: "Masculino" },
    { value: "feminino", label: "Feminino" },
    { value: "outro", label: "Outro" },
  ];

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
        {/* Header Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-[#112F4E] mb-2">
            Complete seu perfil
          </h2>
          <p className="text-[#4A5D70] font-light leading-relaxed">
            Estamos quase lá! Personalize sua conta para começar a monitorar sua cidade.
          </p>
        </section>

        {/* Avatar */}
        <section className="mb-10">
          <h3 className="text-xs font-semibold text-[#94A3B8] mb-4 tracking-widest uppercase">
            SEU AVATAR
          </h3>
          <div className="flex gap-4 items-center">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover ring-4 ring-[#1a8ccc] ring-offset-2"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#E8F2F8] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#1a8ccc] text-3xl">person</span>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-[#112F4E]">{user?.displayName || "Usuário"}</p>
              <p className="text-xs text-[#94A3B8]">{user?.email}</p>
            </div>
          </div>
        </section>

        {/* Form Fields */}
        <section className="space-y-6 mb-10">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#4A5D70]" htmlFor="full_name">
              Nome Completo
            </label>
            <input
              className="w-full h-14 px-4 bg-white border border-[#E2E8F0] rounded-xl focus:border-[#1a8ccc] focus:ring-4 focus:ring-[#1a8ccc]/10 transition-all outline-none text-sm"
              id="full_name"
              placeholder="Ex: Maria Silva"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#4A5D70]" htmlFor="email">
              E-mail
            </label>
            <input
              className="w-full h-14 px-4 bg-[#FAF7F2] border border-[#E2E8F0] rounded-xl text-sm text-[#94A3B8] cursor-not-allowed"
              id="email"
              type="email"
              value={email}
              disabled
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#4A5D70]" htmlFor="phone">
              Celular
            </label>
            <input
              className="w-full h-14 px-4 bg-white border border-[#E2E8F0] rounded-xl focus:border-[#1a8ccc] focus:ring-4 focus:ring-[#1a8ccc]/10 transition-all outline-none text-sm"
              id="phone"
              placeholder="(14) 99999-9999"
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </div>
        </section>

        {/* Age Range Selection */}
        <section className="mb-10">
          <h3 className="text-sm font-medium text-[#4A5D70] ml-1 mb-4">
            Faixa Etária
          </h3>
          <div className="flex flex-wrap gap-2">
            {faixas.map((f) => (
              <button
                key={f}
                onClick={() => setFaixaEtaria(f)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all active:scale-95 ${
                  faixaEtaria === f
                    ? "bg-[#E8F2F8] text-[#1a8ccc] border border-[#1a8ccc] shadow-sm"
                    : "border border-[#E2E8F0] bg-white text-[#4A5D70] hover:border-[#1a8ccc] hover:text-[#1a8ccc]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </section>

        {/* Gender Selection */}
        <section className="mb-12">
          <h3 className="text-sm font-medium text-[#4A5D70] ml-1 mb-4">
            Gênero
          </h3>
          <div className="space-y-3">
            {generos.map((g) => (
              <label
                key={g.value}
                onClick={() => setGenero(g.value)}
                className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors ${
                  genero === g.value
                    ? "border border-[#1a8ccc] bg-[#E8F2F8]"
                    : "border border-[#E2E8F0] bg-white hover:bg-[#FAF7F2]"
                }`}
              >
                <span className={`text-sm ${genero === g.value ? "text-[#112F4E] font-medium" : "text-[#4A5D70]"}`}>
                  {g.label}
                </span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  genero === g.value ? "border-[#1a8ccc]" : "border-[#E2E8F0]"
                }`}>
                  {genero === g.value && <div className="w-2.5 h-2.5 rounded-full bg-[#1a8ccc]" />}
                </div>
              </label>
            ))}
          </div>
        </section>

        {/* Primary Action */}
        <section className="space-y-6">
          <button
            onClick={handleSave}
            disabled={isSaving || !nome.trim()}
            className="w-full h-16 bg-[#1a8ccc] hover:bg-[#1572a6] text-white font-semibold rounded-2xl shadow-lg active:scale-[0.98] transition-all duration-200 uppercase tracking-wide flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Salvando...
              </>
            ) : (
              "CONCLUIR CADASTRO"
            )}
          </button>
          <p className="text-center text-xs text-[#94A3B8] px-4">
            Ao continuar, você concorda com nossos{" "}
            <a className="text-[#1a8ccc] font-medium underline underline-offset-2" href="#">
              Termos de Uso
            </a>
            .
          </p>
        </section>
      </main>
    </div>
  );
}

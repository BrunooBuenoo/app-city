"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProfile, updateUserProfile } from "@/services/firebase";
import {
  User, Mail, Phone, Calendar, Shield, Camera, Save, Loader2, CheckCircle,
} from "lucide-react";

export default function Perfil() {
  const { user, profile, loading: authLoading } = useAuth();
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [faixaEtaria, setFaixaEtaria] = useState("");
  const [genero, setGenero] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setNome(profile.nome || "");
      setTelefone(profile.telefone || "");
      setFaixaEtaria(profile.faixaEtaria || "");
      setGenero(profile.genero || "");
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile(user.uid, {
        nome,
        telefone,
        faixaEtaria,
        genero,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Erro ao salvar perfil:", err);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-[#1a8ccc] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#112F4E] tracking-tight">Meu Perfil</h1>
        <p className="text-sm text-[#94A3B8] mt-1">Gerencie suas informações pessoais.</p>
      </div>

      {/* Avatar Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-[#E8F2F8] flex items-center justify-center overflow-hidden border-2 border-[#E2E8F0]">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-[#1a8ccc]" />
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-[#112F4E] truncate">{user?.displayName || "Cidadão"}</h2>
            <p className="text-sm text-[#94A3B8] truncate">{user?.email}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                profile?.role === "admin" ? "bg-[#EDE9FE] text-[#8B5CF6]" : "bg-[#E8F2F8] text-[#1a8ccc]"
              }`}>
                <Shield className="w-3 h-3" />
                {profile?.role === "admin" ? "Administrador" : "Cidadão"}
              </span>
              {profile?.perfilCompleto && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#D1FAE5] text-[#10B981]">
                  <CheckCircle className="w-3 h-3" />
                  Perfil Completo
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm space-y-5">
        <h3 className="text-sm font-semibold text-[#112F4E]">Informações Pessoais</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#4A5D70] mb-1.5">Nome Completo</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-white focus:border-[#1a8ccc] focus:ring-2 focus:ring-[#1a8ccc]/15 transition-all outline-none text-sm"
              placeholder="Seu nome completo"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#4A5D70] mb-1.5">Email</label>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#FAF7F2] text-sm text-[#94A3B8]">
              <Mail className="w-4 h-4 shrink-0" />
              <span className="truncate">{user?.email || "—"}</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#4A5D70] mb-1.5">Telefone</label>
            <input
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-white focus:border-[#1a8ccc] focus:ring-2 focus:ring-[#1a8ccc]/15 transition-all outline-none text-sm"
              placeholder="(14) 99999-9999"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#4A5D70] mb-1.5">Faixa Etária</label>
            <select
              value={faixaEtaria}
              onChange={(e) => setFaixaEtaria(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-white focus:border-[#1a8ccc] focus:ring-2 focus:ring-[#1a8ccc]/15 transition-all outline-none text-sm"
            >
              <option value="">Selecione</option>
              <option value="18-24">18-24 anos</option>
              <option value="25-34">25-34 anos</option>
              <option value="35-44">35-44 anos</option>
              <option value="45-54">45-54 anos</option>
              <option value="55-64">55-64 anos</option>
              <option value="65+">65+ anos</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#4A5D70] mb-1.5">Gênero</label>
            <select
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-white focus:border-[#1a8ccc] focus:ring-2 focus:ring-[#1a8ccc]/15 transition-all outline-none text-sm"
            >
              <option value="">Selecione</option>
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
              <option value="outro">Outro</option>
              <option value="nao_informar">Prefiro não informar</option>
            </select>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-[#1a8ccc] hover:bg-[#1572a6] text-white font-semibold text-sm rounded-xl shadow-sm transition-all active:scale-[0.98] disabled:opacity-60 flex items-center gap-2 cursor-pointer"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Salvando..." : "Salvar Alterações"}
          </button>
          {saved && (
            <span className="text-xs font-semibold text-[#10B981] flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              Salvo com sucesso!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

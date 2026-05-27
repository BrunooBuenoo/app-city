"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProfile, updateUserProfile } from "@/services/firebase";
import { calcularNivel } from "@/utils/gamification";
import InsigniaBadge from "@/components/ui/InsigniaBadge";
import {
  User, Mail, Phone, Calendar, Shield, Camera, Save, Loader2, CheckCircle, HelpCircle,
  PlusCircle, Heart, MessageSquare, Award, Trophy
} from "lucide-react";

export default function Perfil() {
  const { user, profile, loading: authLoading } = useAuth();
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [faixaEtaria, setFaixaEtaria] = useState("");
  const [genero, setGenero] = useState("");
  const [foto, setFoto] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [editandoAvatar, setEditandoAvatar] = useState(false);
  const [modalTab, setModalTab] = useState<"regras" | "patentes">("regras");

  const avataresDisponiveis = Array.from({ length: 14 }, (_, i) => `/avatares/${i + 2}.png`);

  useEffect(() => {
    if (profile) {
      setNome(profile.nome || "");
      setTelefone(profile.telefone || "");
      setFaixaEtaria(profile.faixaEtaria || "");
      setGenero(profile.genero || "");
      setFoto(profile.foto || user?.photoURL || "");
    }
  }, [profile, user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile(user.uid, {
        nome,
        telefone,
        faixaEtaria,
        genero,
        foto,
      });

      // Tenta sincronizar com o Auth do Firebase
      try {
        const { updateProfile } = await import("firebase/auth");
        const { auth } = await import("@/services/firebase/config");
        if (auth.currentUser) {
          await updateProfile(auth.currentUser, { photoURL: foto });
        }
      } catch (authErr) {
        console.error("Erro ao sincronizar avatar no Auth:", authErr);
      }

      setSaved(true);
      setEditandoAvatar(false);
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
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--color-primary)" }} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--color-text)" }}>Meu Perfil</h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>Gerencie suas informações pessoais.</p>
      </div>

      {/* Avatar Card */}
      <div className="rounded-2xl border p-6 space-y-6 relative overflow-hidden" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}>
        <div className="flex flex-col md:flex-row md:items-center gap-5 justify-between">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden border-2 transition-all duration-300" style={{ backgroundColor: "var(--color-primary-container)", borderColor: "var(--color-border)" }}>
                {foto ? (
                  <img src={foto} alt="Avatar" className="w-full h-full object-cover animate-fade-in" />
                ) : (
                  <User className="w-8 h-8 text-[#1a8ccc]" />
                )}
              </div>
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold truncate" style={{ color: "var(--color-text)" }}>{nome || user?.displayName || "Navegador"}</h2>
              <p className="text-sm truncate" style={{ color: "var(--color-text-muted)" }}>{user?.email}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  profile?.funcao === "admin" ? "bg-[#EDE9FE] text-[#8B5CF6]" : "bg-[#E8F2F8] text-[#1a8ccc]"
                }`}>
                  <Shield className="w-3 h-3" />
                  {profile?.funcao === "admin"
                    ? "Administrador"
                    : profile?.funcao === "empresa"
                    ? "Empresa Parceira"
                    : profile?.funcao === "parceiro"
                    ? "Parceiro Lojista"
                    : "Membro do Clube"}
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

          {/* Nível com Insígnia no Canto Superior Direito no Desktop / Fluxo Responsivo */}
          <div className="md:absolute md:top-6 md:right-6">
            {(() => {
              const pontos = profile?.pontos || 0;
              const levelInfo = calcularNivel(pontos);
              return (
                <button 
                  type="button"
                  onClick={() => setIsRulesOpen(true)}
                  className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-extrabold border shadow-md transition-all cursor-pointer select-none active:scale-95"
                  style={{ backgroundColor: "var(--color-bg-alt)", borderColor: "var(--color-border)" }}
                >
                  <InsigniaBadge nivelId={levelInfo.id} size="lg" />
                  <div className="text-left leading-tight pr-1.5">
                    <p className="text-[10px] font-normal uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Nível de Patrocinador</p>
                    <p className="text-sm font-extrabold" style={{ color: "var(--color-text)" }}>{levelInfo.nome}</p>
                    <p className="text-[#1a8ccc] font-bold text-xs mt-0.5">{pontos} Pontos</p>
                  </div>
                  <HelpCircle className="w-4.5 h-4.5 text-[#94A3B8]/80 shrink-0 self-center" />
                </button>
              );
            })()}
          </div>
        </div>

        <div className="pt-2 border-t" style={{ borderColor: "var(--color-border-light)" }}>
          {!editandoAvatar ? (
            <div className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full overflow-hidden border flex shrink-0" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}>
                  {foto ? (
                    <img src={foto} alt="Avatar Escolhido" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-[#94A3B8] m-auto" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold" style={{ color: "var(--color-text)" }}>Seu Avatar Oficial</p>
                  <p className="text-[10px] font-light" style={{ color: "var(--color-text-muted)" }}>Este avatar é exibido em suas interações e resgates na plataforma.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditandoAvatar(true)}
                className="px-3.5 py-2 border text-[#1a8ccc] font-bold text-xs rounded-xl transition-all cursor-pointer select-none"
                style={{ borderColor: "var(--color-border)" }}
              >
                Trocar de avatar
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold" style={{ color: "var(--color-text-secondary)" }}>Escolha seu novo avatar oficial:</p>
                <button
                  type="button"
                  onClick={() => {
                    setFoto(profile?.foto || user?.photoURL || "");
                    setEditandoAvatar(false);
                  }}
                  className="text-[11px] font-bold text-[#EF4444] hover:underline cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar">
                {avataresDisponiveis.map((av) => {
                  const isSelected = foto === av;
                  return (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setFoto(av)}
                      className={`relative w-12 h-12 rounded-full overflow-hidden border-2 shrink-0 transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                        isSelected 
                          ? "border-[#1a8ccc] ring-4 ring-[#1a8ccc]/15 scale-105" 
                          : "border-transparent hover:border-[#94A3B8]/40"
                      }`}
                    >
                      <img src={av} alt="Avatar opção" className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-[#1a8ccc]/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-white text-[16px] font-bold bg-[#1a8ccc] rounded-full p-0.5 shadow-sm">check</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border p-6 space-y-5" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}>
        <h3 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>Informações Pessoais</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>Nome Completo</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border transition-all outline-none text-sm"
              style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
              placeholder="Seu nome completo"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>Email</label>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border text-sm" style={{ backgroundColor: "var(--color-bg-alt)", borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}>
              <Mail className="w-4 h-4 shrink-0" />
              <span className="truncate">{user?.email || "—"}</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>Telefone</label>
            <input
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border transition-all outline-none text-sm"
              style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
              placeholder="(14) 99999-9999"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>Faixa Etária</label>
            <select
              value={faixaEtaria}
              onChange={(e) => setFaixaEtaria(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border transition-all outline-none text-sm"
              style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
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

      {/* Modal de Explicação da Pontuação */}
      {isRulesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-[#E2E8F0] shadow-xl overflow-hidden animate-scale-up">
            
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#F5F2ED] flex justify-between items-center bg-[#FAF7F2]/50">
              <div className="flex items-center gap-2">
                <Trophy className="w-4.5 h-4.5 text-[#F59E0B]" />
                <h3 className="font-bold text-[#112F4E] text-sm">Como funciona a Fidelidade?</h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsRulesOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#FAF7F2] text-[#94A3B8] hover:text-[#112F4E] transition-colors cursor-pointer"
              >
                <HelpCircle className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <p className="text-xs text-[#94A3B8] leading-relaxed font-light">
                O seu <strong>Nível de Fidelidade</strong> é acumulado conforme você utiliza a plataforma e prestigia os parceiros comerciais em São Paulo. Suas interações geram pontos e fazem você evoluir de categoria!
              </p>

              {/* Tabs do Modal */}
              <div className="flex border-b border-[#F5F2ED] pt-1">
                <button
                  type="button"
                  onClick={() => setModalTab("regras")}
                  className={`flex-1 pb-2.5 text-xs font-bold text-center border-b-2 transition-all cursor-pointer ${
                    modalTab === "regras" 
                      ? "border-[#1a8ccc] text-[#1a8ccc]" 
                      : "border-transparent text-[#94A3B8] hover:text-[#112F4E]"
                  }`}
                >
                  Como ganhar pontos?
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab("patentes")}
                  className={`flex-1 pb-2.5 text-xs font-bold text-center border-b-2 transition-all cursor-pointer ${
                    modalTab === "patentes" 
                      ? "border-[#1a8ccc] text-[#1a8ccc]" 
                      : "border-transparent text-[#94A3B8] hover:text-[#112F4E]"
                  }`}
                >
                  Evolução & Níveis
                </button>
              </div>

              {/* Tabela de Regras */}
              {modalTab === "regras" && (
                <div className="space-y-3 pt-1">
                  {[
                    { acao: "Cadastrar Novo Cupom Comercial", pontos: "+10 pts", desc: "Se você for uma empresa parceira cadastrando novos benefícios.", icon: PlusCircle, color: "text-[#1a8ccc]", bg: "bg-[#E8F2F8]" },
                    { acao: "Apoiar Comércio Local (Resgatar)", pontos: "+5 pts", desc: "Salvar um cupom de desconto de qualquer parceiro do estado.", icon: Heart, color: "text-[#EF4444]", bg: "bg-[#FEE2E2]" },
                    { acao: "Validar Cupom no Caixa do Parceiro", pontos: "+20 pts", desc: "Economizar consumindo no estabelecimento físico e validando seu ticket.", icon: CheckCircle, color: "text-[#10B981]", bg: "bg-[#D1FAE5]" },
                  ].map((regra, i) => {
                    const IconComp = regra.icon;
                    return (
                      <div key={i} className="flex gap-3 items-start border-b border-[#FAF7F2] pb-2.5 last:border-b-0 last:pb-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${regra.bg} ${regra.color}`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-xs font-bold text-[#112F4E] truncate">{regra.acao}</h4>
                            <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${regra.bg} ${regra.color} shrink-0`}>
                              {regra.pontos}
                            </span>
                          </div>
                          <p className="text-[10px] text-[#94A3B8] font-light mt-0.5 leading-relaxed">
                            {regra.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Lista de Patentes Disponíveis */}
              {modalTab === "patentes" && (
                <div className="space-y-3 pt-1">
                  {[
                    { nome: "Navegador Iniciante", id: "observador", pontos: "0 a 49 pts", desc: "Iniciando a jornada pelo comércio do Estado de SP.", color: "text-slate-500", bg: "bg-slate-50/70 border-slate-200/50" },
                    { nome: "Navegador Bronze", id: "iniciante", pontos: "50 a 149 pts", desc: "Apoiando pequenos comércios e acumulando economias.", color: "text-emerald-700", bg: "bg-emerald-50/70 border-emerald-200/50" },
                    { nome: "Navegador Prata", id: "colaborador", pontos: "150 a 349 pts", desc: "Reconhecido pelas dezenas de descontos aproveitados.", color: "text-sky-700", bg: "bg-sky-50/70 border-sky-200/50" },
                    { nome: "Navegador Ouro", id: "bronze", pontos: "350 a 699 pts", desc: "Líder em economia comercial e fã de parcerias premium.", color: "text-amber-800", bg: "bg-amber-50/70 border-amber-200/50" },
                    { nome: "Parceiro Platina", id: "prata", pontos: "700 a 1199 pts", desc: "Influenciador de vantagens locais e patrocinador de destaque.", color: "text-zinc-800", bg: "bg-zinc-50/70 border-zinc-200/50" },
                    { nome: "Embaixador SP", id: "ouro", pontos: "1200 a 1999 pts", desc: "Consagrado com parcerias vips exclusivas nas capitais paulistas.", color: "text-yellow-800", bg: "bg-yellow-50/70 border-yellow-200/50" },
                    { nome: "Titan da Fidelidade", id: "lendario", pontos: "2000+ pts", desc: "O nível máximo de vantagens no Navegando SP!", color: "text-purple-800", bg: "bg-purple-50/70 border-purple-200/50" },
                  ].map((patente, i) => (
                    <div key={i} className={`flex gap-3 items-center p-2.5 rounded-xl border ${patente.bg} shadow-[0_1px_2px_rgba(0,0,0,0.01)]`}>
                      <div className="shrink-0 flex items-center justify-center">
                        <InsigniaBadge nivelId={patente.id} size="md" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className={`text-xs font-black ${patente.color}`}>{patente.nome}</h4>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg bg-white border border-[#E2E8F0] ${patente.color} shrink-0`}>
                            {patente.pontos}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#4A5D70] font-light mt-0.5 leading-normal">
                          {patente.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3.5 bg-[#FAF7F2]/30 border-t border-[#F5F2ED] flex justify-end">
              <button 
                type="button"
                onClick={() => setIsRulesOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#1a8ccc] hover:bg-[#1572a6] text-white font-semibold text-xs transition-colors cursor-pointer shadow-sm"
              >
                Entendi, fechar
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

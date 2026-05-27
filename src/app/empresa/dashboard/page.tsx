"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Store, Plus, Loader2, CheckCircle, Clock, XCircle, MapPin, Phone,
  Briefcase, ArrowRight, Tag
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  criarEstabelecimento, 
  listarEstabelecimentos, 
  criarCupom,
  type Estabelecimento 
} from "@/services/firebase";
import { CATEGORIES } from "@/utils/categories";

export default function EmpresaDashboard() {
  const router = useRouter();
  const { profile, isLoggedIn, loading } = useAuth();
  const { showToast } = useToast();
  
  const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCadastro, setShowCadastro] = useState(false);

  // Form Estabelecimento
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("alimentacao");
  const [logoUrl, setLogoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [latitude, setLatitude] = useState("-22.2139");
  const [longitude, setLongitude] = useState("-49.9458");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cardapioUrl, setCardapioUrl] = useState("");
  const [servicos, setServicos] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Form Cupom
  const [showCupomForm, setShowCupomForm] = useState<string | null>(null);
  const [cupomTitulo, setCupomTitulo] = useState("");
  const [cupomDescricao, setCupomDescricao] = useState("");
  const [cupomCodigoBase, setCupomCodigoBase] = useState("");
  const [cupomValidade, setCupomValidade] = useState("");
  const [isSavingCupom, setIsSavingCupom] = useState(false);

  const carregarEstabelecimentos = async () => {
    if (!profile?.empresaId) return;
    try {
      const list = await listarEstabelecimentos({ empresaId: profile.empresaId });
      setEstabelecimentos(list);
    } catch (err) {
      console.error(err);
      showToast("warning", "Erro", "Erro ao carregar seus estabelecimentos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn) {
        router.push("/login");
        return;
      }
      if (profile?.funcao !== "empresa" && profile?.funcao !== "admin") {
        router.push("/login");
        return;
      }
      carregarEstabelecimentos();
    }
  }, [loading, isLoggedIn, profile]);

  const handleSalvarEstabelecimento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.empresaId) return;
    if (!nome.trim() || !descricao.trim() || !endereco.trim() || !telefone.trim()) {
      showToast("warning", "Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setIsSaving(true);
    try {
      await criarEstabelecimento(profile.empresaId, {
        nome,
        descricao,
        categoria: categoria as any,
        logoUrl: logoUrl.trim() || "/logo.png",
        bannerUrl: bannerUrl.trim() || "",
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        endereco,
        telefone,
        cardapioUrl: cardapioUrl.trim(),
        servicos: servicos.trim(),
      });

      showToast("success", "Sucesso!", "Estabelecimento cadastrado! Pendente de aprovação do administrador.");
      setShowCadastro(false);
      // Limpa formulário
      setNome("");
      setDescricao("");
      setLogoUrl("");
      setBannerUrl("");
      setEndereco("");
      setTelefone("");
      setCardapioUrl("");
      setServicos("");
      setLatitude("-22.2139");
      setLongitude("-49.9458");
      
      await carregarEstabelecimentos();
    } catch (err) {
      console.error(err);
      showToast("warning", "Erro", "Erro ao salvar estabelecimento.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCriarCupom = async (e: React.FormEvent, estabId: string) => {
    e.preventDefault();
    if (!profile?.empresaId) return;
    if (!cupomTitulo.trim() || !cupomDescricao.trim() || !cupomCodigoBase.trim()) {
      showToast("warning", "Erro", "Preencha todos os campos do cupom.");
      return;
    }

    setIsSavingCupom(true);
    try {
      await criarCupom(profile.empresaId, estabId, {
        titulo: cupomTitulo,
        descricao: cupomDescricao,
        codigoBase: cupomCodigoBase.toUpperCase(),
        limitePorUsuario: 1,
        validade: cupomValidade ? new Date(cupomValidade) as any : null,
        ativo: true,
      });

      showToast("success", "Sucesso!", "Cupom de desconto criado com sucesso!");
      setShowCupomForm(null);
      setCupomTitulo("");
      setCupomDescricao("");
      setCupomCodigoBase("");
      setCupomValidade("");
    } catch (err) {
      console.error(err);
      showToast("warning", "Erro", "Erro ao criar cupom.");
    } finally {
      setIsSavingCupom(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-[#1a8ccc] animate-spin" />
        <p className="text-sm text-slate-500">Acessando painel corporativo...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950/20 px-6 md:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/60 dark:border-zinc-800/80 shadow-sm text-left">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-[#1a8ccc]" />
            Painel da Empresa Parceira
          </h1>
          <p className="text-xs text-slate-500">
            Cadastre filiais, estabelecimentos credenciados e crie cupons de desconto ativos.
          </p>
        </div>
        <button
          onClick={() => setShowCadastro(!showCadastro)}
          className="px-5 py-2.5 bg-[#1a8ccc] hover:bg-[#1572a6] text-white text-xs font-bold rounded-xl active:scale-[0.98] transition-all flex items-center gap-1.5 shadow-md shadow-[#1a8ccc]/10 cursor-pointer"
        >
          {showCadastro ? "Voltar à Lista" : (
            <>
              <Plus className="w-4 h-4" />
              Novo Estabelecimento
            </>
          )}
        </button>
      </div>

      {showCadastro ? (
        /* Form de Cadastro */
        <div className="max-w-2xl bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-slate-200/60 dark:border-zinc-800/80 shadow-sm text-left">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Cadastrar Novo Estabelecimento</h2>
          
          <form onSubmit={handleSalvarEstabelecimento} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-650 dark:text-zinc-300">Nome Comercial/Fantasia *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Pizzaria Bella Italia"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full h-11 px-4 bg-[#FAF7F2] dark:bg-zinc-800 border border-slate-250 dark:border-zinc-750 rounded-xl text-xs text-slate-800 dark:text-zinc-100 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-650 dark:text-zinc-300">Categoria de Parceria *</label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full h-11 px-4 bg-[#FAF7F2] dark:bg-zinc-800 border border-slate-250 dark:border-zinc-750 rounded-xl text-xs text-slate-800 dark:text-zinc-100 outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-650 dark:text-zinc-300">Descrição Comercial do Local *</label>
              <textarea
                required
                rows={3}
                placeholder="Descreva o que o local oferece, especialidades e diferenciais..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full p-4 bg-[#FAF7F2] dark:bg-zinc-800 border border-slate-250 dark:border-zinc-750 rounded-xl text-xs text-slate-800 dark:text-zinc-100 outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-650 dark:text-zinc-300">Endereço Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Av. Sampaio Vidal, 450 - Centro"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  className="w-full h-11 px-4 bg-[#FAF7F2] dark:bg-zinc-800 border border-slate-250 dark:border-zinc-750 rounded-xl text-xs text-slate-800 dark:text-zinc-100 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-650 dark:text-zinc-300">Telefone Comercial *</label>
                <input
                  type="tel"
                  required
                  placeholder="Ex: (14) 3456-7890"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="w-full h-11 px-4 bg-[#FAF7F2] dark:bg-zinc-800 border border-slate-250 dark:border-zinc-750 rounded-xl text-xs text-slate-800 dark:text-zinc-100 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-650 dark:text-zinc-300">Latitude (Geolocalização) *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: -22.2139"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full h-11 px-4 bg-[#FAF7F2] dark:bg-zinc-800 border border-slate-250 dark:border-zinc-750 rounded-xl text-xs text-slate-800 dark:text-zinc-100 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-650 dark:text-zinc-300">Longitude (Geolocalização) *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: -49.9458"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full h-11 px-4 bg-[#FAF7F2] dark:bg-zinc-800 border border-slate-250 dark:border-zinc-750 rounded-xl text-xs text-slate-800 dark:text-zinc-100 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-650 dark:text-zinc-300">Logomarca (URL da imagem)</label>
                <input
                  type="url"
                  placeholder="Link direto da imagem do logo"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="w-full h-11 px-4 bg-[#FAF7F2] dark:bg-zinc-800 border border-slate-250 dark:border-zinc-750 rounded-xl text-xs text-slate-800 dark:text-zinc-100 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-650 dark:text-zinc-300">Banner Principal (URL da imagem)</label>
                <input
                  type="url"
                  placeholder="Link do banner de divulgação"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  className="w-full h-11 px-4 bg-[#FAF7F2] dark:bg-zinc-800 border border-slate-250 dark:border-zinc-750 rounded-xl text-xs text-slate-800 dark:text-zinc-100 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-650 dark:text-zinc-300">Menu / Cardápio (URL opcional)</label>
                <input
                  type="url"
                  placeholder="Link do cardápio digital ou PDF"
                  value={cardapioUrl}
                  onChange={(e) => setCardapioUrl(e.target.value)}
                  className="w-full h-11 px-4 bg-[#FAF7F2] dark:bg-zinc-800 border border-slate-250 dark:border-zinc-750 rounded-xl text-xs text-slate-800 dark:text-zinc-100 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-650 dark:text-zinc-300">Serviços Oferecidos / Especialidades (opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Corte, barba, massagem capilar"
                  value={servicos}
                  onChange={(e) => setServicos(e.target.value)}
                  className="w-full h-11 px-4 bg-[#FAF7F2] dark:bg-zinc-800 border border-slate-250 dark:border-zinc-750 rounded-xl text-xs text-slate-800 dark:text-zinc-100 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Cadastrando...
                </>
              ) : (
                <>
                  <Store className="w-4 h-4" />
                  CADASTRAR E SOLICITAR APURAÇÃO
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        /* Lista de Estabelecimentos */
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/60 dark:border-zinc-800/80 shadow-sm overflow-hidden text-left">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800/80 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200">Parcerias Cadastradas</h3>
            <span className="text-xs text-slate-400">Total: {estabelecimentos.length}</span>
          </div>

          {estabelecimentos.length === 0 ? (
            <div className="p-16 text-center text-slate-400">
              <Store className="w-12 h-12 text-slate-200 mx-auto mb-3 block" />
              Você não possui nenhum estabelecimento cadastrado sob este CNPJ ainda.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-zinc-800/50">
              {estabelecimentos.map((row) => (
                <div key={row.id} className="p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {row.logoUrl ? (
                        <img src={row.logoUrl} className="w-12 h-12 rounded-xl object-cover border bg-white shrink-0" alt="logo" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                          <Store className="w-6 h-6 text-slate-400" />
                        </div>
                      )}
                      <div>
                        <h4 className="text-base font-bold text-slate-800 dark:text-white leading-tight">{row.nome}</h4>
                        <p className="text-xs text-slate-500 flex flex-wrap gap-3 mt-1.5 font-light">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-350" />
                            {row.endereco}
                          </span>
                          {row.cardapioUrl && (
                            <span className="flex items-center gap-1 text-blue-500">
                              <span className="material-symbols-outlined text-[14px]">restaurant_menu</span>
                              <a href={row.cardapioUrl} target="_blank" rel="noopener noreferrer" className="hover:underline font-semibold">Ver Cardápio</a>
                            </span>
                          )}
                          {row.servicos && (
                            <span className="flex items-center gap-1 text-purple-500">
                              <span className="material-symbols-outlined text-[14px]">design_services</span>
                              <span className="font-semibold">Serviços: {row.servicos}</span>
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Status Tag */}
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                        row.status === "ativo" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20" :
                        row.status === "suspenso" ? "bg-rose-50 text-rose-600 dark:bg-rose-950/20" :
                        "bg-amber-50 text-amber-600 dark:bg-amber-950/20"
                      }`}>
                        {row.status === "ativo" && <CheckCircle className="w-3 h-3" />}
                        {row.status === "suspenso" && <XCircle className="w-3 h-3" />}
                        {row.status === "pendente_aprovacao" && <Clock className="w-3 h-3" />}
                        {row.status === "ativo" ? "Ativo no Mapa" : row.status === "suspenso" ? "Suspenso" : "Aguardando Aprovação"}
                      </span>

                      {row.status === "ativo" && (
                        <button
                          onClick={() => setShowCupomForm(showCupomForm === row.id ? null : row.id)}
                          className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl active:scale-[0.98] transition-all flex items-center gap-1 shrink-0 cursor-pointer shadow-sm shadow-emerald-500/10"
                        >
                          <Tag className="w-3.5 h-3.5" />
                          {showCupomForm === row.id ? "Fechar" : "Criar Cupom"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Form de Novo Cupom */}
                  {showCupomForm === row.id && (
                    <div className="mt-4 p-5 bg-[#FAF7F2] dark:bg-zinc-800/40 rounded-2xl border border-dashed border-[#10B981]/30 max-w-lg">
                      <h5 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
                        <Tag className="w-4 h-4 text-[#10B981]" />
                        Adicionar Novo Cupom para {row.nome}
                      </h5>

                      <form onSubmit={(e) => handleCriarCupom(e, row.id)} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500">Título do Cupom *</label>
                            <input
                              type="text"
                              required
                              placeholder="Ex: 20% OFF em Pizzas"
                              value={cupomTitulo}
                              onChange={(e) => setCupomTitulo(e.target.value)}
                              className="w-full h-10 px-3 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs text-slate-800 dark:text-zinc-100 outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500">Código Base do Cupom *</label>
                            <input
                              type="text"
                              required
                              placeholder="Ex: PIZZA20"
                              value={cupomCodigoBase}
                              onChange={(e) => setCupomCodigoBase(e.target.value)}
                              className="w-full h-10 px-3 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs text-slate-800 dark:text-zinc-100 outline-none uppercase"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500">Regras / Descrição do Desconto *</label>
                          <input
                            type="text"
                            required
                            placeholder="Ex: Válido de terça a quinta em pizzas gigantes."
                            value={cupomDescricao}
                            onChange={(e) => setCupomDescricao(e.target.value)}
                            className="w-full h-10 px-3 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs text-slate-800 dark:text-zinc-100 outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500">Data de Validade (Opcional)</label>
                          <input
                            type="date"
                            value={cupomValidade}
                            onChange={(e) => setCupomValidade(e.target.value)}
                            className="w-full h-10 px-3 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs text-slate-800 dark:text-zinc-100 outline-none"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSavingCupom}
                          className="w-full h-10 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
                        >
                          {isSavingCupom ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Salvando...
                            </>
                          ) : (
                            "SALVAR CUPOM"
                          )}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

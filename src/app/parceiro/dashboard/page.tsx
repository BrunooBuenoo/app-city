"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Tag, Loader2, CheckCircle, Clock, XCircle, Search, 
  Store, ClipboardCheck, ArrowRight, User
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  validarResgate, 
  listarEstabelecimentos,
  listarResgatesDoEstabelecimento,
  type Estabelecimento,
  type Resgate 
} from "@/services/firebase";

export default function ParceiroDashboard() {
  const router = useRouter();
  const { profile, isLoggedIn, loading } = useAuth();
  const { showToast } = useToast();

  const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[]>([]);
  const [selecionado, setSelecionado] = useState<Estabelecimento | null>(null);
  const [resgates, setResgates] = useState<Resgate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Módulo de Caixa / Validação
  const [codigoInput, setCodigoInput] = useState("");
  const [validando, setValidando] = useState(false);
  const [resgateSucesso, setResgateSucesso] = useState<Resgate | null>(null);

  const carregarEstabelecimentos = async () => {
    if (!profile?.empresaId) return;
    try {
      const list = await listarEstabelecimentos({ empresaId: profile.empresaId, status: "ativo" });
      setEstabelecimentos(list);
      if (list.length > 0) {
        setSelecionado(list[0]);
      }
    } catch (err) {
      console.error(err);
      showToast("warning", "Erro", "Erro ao carregar estabelecimentos.");
    } finally {
      setIsLoading(false);
    }
  };

  const carregarResgates = async (estab: Estabelecimento) => {
    try {
      const list = await listarResgatesDoEstabelecimento(estab.empresaId, estab.id);
      setResgates(list);
    } catch (err) {
      console.error(err);
    }
  };

  // TODO: Reativar autenticação quando o login estiver implementado
  // useEffect(() => {
  //   if (!loading) {
  //     if (!isLoggedIn) {
  //       router.push("/login");
  //       return;
  //     }
  //     if (profile?.funcao !== "parceiro" && profile?.funcao !== "admin") {
  //       router.push("/login");
  //       return;
  //     }
  //     carregarEstabelecimentos();
  //   }
  // }, [loading, isLoggedIn, profile]);

  useEffect(() => {
    if (!loading) {
      carregarEstabelecimentos();
    }
  }, [loading]);

  useEffect(() => {
    if (selecionado) {
      carregarResgates(selecionado);
    }
  }, [selecionado]);

  const handleValidarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigoInput.trim()) {
      showToast("warning", "Erro", "Insira um código de cupom válido.");
      return;
    }

    setValidando(true);
    setResgateSucesso(null);
    try {
      const resultado = await validarResgate(codigoInput);
      setResgateSucesso(resultado);
      showToast("success", "Sucesso!", "Cupom validado com sucesso! Aplique o desconto ao cliente.");
      setCodigoInput("");
      if (selecionado) {
        await carregarResgates(selecionado);
      }
    } catch (err: any) {
      console.error(err);
      showToast("warning", "Erro", err.message || "Erro ao validar código.");
    } finally {
      setValidando(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-[#1a8ccc] animate-spin" />
        <p className="text-sm text-slate-500">Carregando painel de atendimento...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950/20 px-6 md:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/60 dark:border-zinc-800/80 shadow-sm text-left">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-[#10B981]" />
            Módulo de Caixa & Atendimento
          </h1>
          <p className="text-xs text-slate-500">
            Valide cupons de descontos de clientes e visualize resgates efetuados no balcão.
          </p>
        </div>

        {estabelecimentos.length > 1 && (
          <select
            value={selecionado?.id || ""}
            onChange={(e) => {
              const matched = estabelecimentos.find(est => est.id === e.target.value);
              if (matched) setSelecionado(matched);
            }}
            className="h-10 px-4 bg-[#FAF7F2] dark:bg-zinc-800 border rounded-xl text-xs font-bold text-slate-800 dark:text-zinc-100 outline-none cursor-pointer"
          >
            {estabelecimentos.map(est => (
              <option key={est.id} value={est.id}>{est.nome}</option>
            ))}
          </select>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Coluna Esquerda: Validador de Caixa (Módulo Proeminente) */}
        <div className="lg:col-span-1 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/60 dark:border-zinc-800/80 shadow-sm h-fit text-left space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Validar Cupom no Caixa</h3>
            <p className="text-[11px] text-slate-450 mt-1">
              Digite o código único apresentado pelo cliente no momento do pagamento.
            </p>
          </div>

          <form onSubmit={handleValidarCodigo} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                placeholder="Ex: SP20-A3B5"
                value={codigoInput}
                onChange={(e) => setCodigoInput(e.target.value)}
                className="w-full h-12 pl-10 pr-4 bg-[#FAF7F2] dark:bg-zinc-800 border rounded-xl text-sm text-slate-850 dark:text-zinc-100 placeholder:text-slate-400 outline-none font-bold uppercase tracking-wider"
              />
            </div>

            <button
              type="submit"
              disabled={validando}
              className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {validando ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <ClipboardCheck className="w-4 h-4" />
                  VALIDAR E APLICAR DESCONTO
                </>
              )}
            </button>
          </form>

          {/* Resultado de Sucesso */}
          {resgateSucesso && (
            <div className="p-5 bg-emerald-50/50 dark:bg-emerald-950/10 border-2 border-emerald-500/40 rounded-2xl space-y-3 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <span className="text-xs font-black uppercase tracking-wider">CUPOM VALIDADO!</span>
              </div>
              
              <div className="space-y-1.5 pt-1 border-t border-emerald-500/10 text-xs">
                <p className="text-slate-400 font-medium">Benefício:</p>
                <p className="font-bold text-slate-800 dark:text-white text-sm">{resgateSucesso.cupomTitulo}</p>
                
                <p className="text-slate-400 font-medium pt-2">Código Utilizado:</p>
                <p className="font-black text-slate-800 dark:text-white uppercase text-base tracking-wider">{resgateSucesso.codigoUnicoGerado}</p>

                <p className="text-[10px] text-slate-400 font-medium pt-2">Status da Transação:</p>
                <p className="text-[10px] font-bold text-emerald-500">Desconto ativo e registrado com sucesso!</p>
              </div>
            </div>
          )}
        </div>

        {/* Coluna Direita: Histórico de Resgates Efetivados */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/60 dark:border-zinc-800/80 shadow-sm overflow-hidden text-left flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800/80 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200">Histórico de Resgates no Balcão</h3>
            <span className="text-xs text-slate-400">Estabelecimento: {selecionado?.nome || "Carregando..."}</span>
          </div>

          {resgates.length === 0 ? (
            <div className="p-16 text-center text-slate-450 flex-1 flex flex-col items-center justify-center">
              <Tag className="w-12 h-12 text-slate-200 mb-3 block" />
              Nenhum resgate efetuado neste estabelecimento até o momento.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-zinc-800/50 overflow-y-auto max-h-[450px]">
              {resgates.map((row) => (
                <div key={row.id} className="p-5 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white">{row.cupomTitulo}</h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 font-light">
                      <span className="font-bold text-slate-650 dark:text-zinc-300 uppercase tracking-wide">{row.codigoUnicoGerado}</span>
                      · 
                      <span>Gerado em: {row.criadoEm ? new Date(row.criadoEm.toMillis()).toLocaleDateString("pt-BR") : "—"}</span>
                    </p>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1 ${
                    row.status === "resgatado" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20" : "bg-amber-50 text-amber-600 dark:bg-amber-950/20"
                  }`}>
                    {row.status === "resgatado" ? "Utilizado" : "Disponível"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

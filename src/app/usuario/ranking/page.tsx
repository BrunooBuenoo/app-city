"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { obterRankingUsuarios, type UserProfile } from "@/services/firebase/auth";
import { calcularNivel } from "@/utils/gamification";
import InsigniaBadge from "@/components/ui/InsigniaBadge";
import { Loader2, Award, Trophy, User, ArrowLeft, Heart, MessageSquare, PlusCircle, CheckCircle } from "lucide-react";

export default function RankingPage() {
  const [ranking, setRanking] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRanking() {
      try {
        const list = await obterRankingUsuarios(20);
        setRanking(list);
      } catch (err) {
        console.error("Erro ao carregar o ranking global:", err);
      } finally {
        setLoading(false);
      }
    }
    loadRanking();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-[#1a8ccc] animate-spin" />
        <p className="text-sm text-[#4A5D70] font-light">Calculando o ranking de cidadãos...</p>
      </div>
    );
  }

  // Separar o pódio (Top 3)
  const top1 = ranking[0] || null;
  const top2 = ranking[1] || null;
  const top3 = ranking[2] || null;
  
  // O restante dos usuários do ranking
  const outros = ranking.slice(3);

  const regrasPontuacao = [
    { acao: "Cadastrar Nova Ocorrência", pontos: "+10", desc: "Ajude a mapear os problemas reais da nossa cidade.", icon: PlusCircle, color: "text-[#1a8ccc]", bgColor: "bg-[#E8F2F8]" },
    { acao: "Apoiar um Problema (Concordar)", pontos: "+5", desc: "Fortaleça relatos de outros moradores com seu apoio.", icon: Heart, color: "text-[#EF4444]", bgColor: "bg-[#FEE2E2]" },
    { acao: "Ocorrência Apoiada Resolvida", pontos: "+30", desc: "Bônus supremo por apoiar causas solucionadas!", icon: Award, color: "text-[#F59E0B]", bgColor: "bg-[#FEF3C7]" },
    { acao: "Sua Ocorrência Resolvida por Nós", pontos: "+50", desc: "Nossa equipe deve marcar sua reclamação como resolvida para contabilizar.", icon: CheckCircle, color: "text-[#10B981]", bgColor: "bg-[#D1FAE5]" },
  ];

  return (
    <div className="px-4 md:px-6 pb-12 space-y-6">
      {/* Header */}
      <header className="flex items-center gap-3 pt-4 border-b border-[#F5F2ED] pb-4">
        <Link href="/usuario/dashboard" className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#FAF7F2] transition-colors shrink-0">
          <ArrowLeft className="w-4.5 h-4.5 text-[#112F4E]" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-[#112F4E] flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#F59E0B]" />
            Ranking de Cidadania
          </h1>
          <p className="text-xs text-[#94A3B8] font-light">Os moradores mais engajados e ativos de Marília</p>
        </div>
      </header>

      {/* Grid: Pódio + Regras */}
      <div className="flex flex-col xl:grid xl:grid-cols-12 gap-6 items-start">
        
        {/* Pódio & Leaderboard (col-span-8) */}
        <div className="order-2 xl:order-none xl:col-span-8 space-y-6 w-full">
          
          {/* Pódio Visual (Glassmorphism 3D-like columns) */}
          {ranking.length > 0 ? (
            <div className="bg-gradient-to-b from-white to-[#FAF7F2]/30 rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
              <h3 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-6 text-center">
                🏆 Placar de Líderes do Prestígio
              </h3>
              
              <div className="flex flex-col sm:flex-row items-end justify-center gap-4 sm:gap-2 pt-6 pb-2">
                
                {/* TOP 2 (Prata) - Esquerda */}
                {top2 && (
                  <div className="w-full sm:w-36 flex flex-col items-center order-2 sm:order-1 transition-all hover:scale-[1.02] duration-300">
                    <div className="relative mb-2">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-[#94A3B8] bg-white shadow-md relative z-10 flex items-center justify-center">
                        {top2.foto ? (
                          <img src={top2.foto} alt={top2.nome} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-8 h-8 text-[#94A3B8]" />
                        )}
                      </div>
                      <div className="absolute -top-3 -right-1 w-6 h-6 rounded-full bg-[#94A3B8] border-2 border-white shadow flex items-center justify-center text-[10px] font-bold text-white z-20">
                        2º
                      </div>
                    </div>
                    <div className="text-center px-2 min-w-0 w-full mb-1">
                      <p className="text-xs font-bold text-[#112F4E] truncate">{top2.nome}</p>
                      <p className="text-[10px] text-[#94A3B8] font-medium truncate">{calcularNivel(top2.pontos || 0).nome}</p>
                    </div>
                    {/* Pedestal Prata */}
                    <div className="w-full h-24 bg-gradient-to-t from-[#94A3B8]/20 to-[#E2E8F0]/40 rounded-t-xl border-t border-x border-[#E2E8F0] shadow-inner flex flex-col justify-end items-center pb-3 gap-1">
                      <InsigniaBadge nivelId={calcularNivel(top2.pontos || 0).id} size="sm" />
                      <span className="text-xs font-bold text-[#4A5D70]">{top2.pontos || 0} pts</span>
                    </div>
                  </div>
                )}

                {/* TOP 1 (Ouro) - Centro */}
                {top1 && (
                  <div className="w-full sm:w-40 flex flex-col items-center order-1 sm:order-2 transition-all hover:scale-[1.03] duration-300 relative -top-3">
                    <div className="relative mb-2">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-[#F59E0B] bg-white shadow-lg relative z-10 flex items-center justify-center">
                        {top1.foto ? (
                          <img src={top1.foto} alt={top1.nome} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-10 h-10 text-[#F59E0B]" />
                        )}
                      </div>
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-2xl z-20 select-none animate-bounce">
                        👑
                      </div>
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#F59E0B] border-2 border-white shadow text-[9px] font-extrabold text-white z-20 whitespace-nowrap">
                        1º LUGAR
                      </div>
                    </div>
                    <div className="text-center px-2 min-w-0 w-full mb-1 mt-1">
                      <p className="text-sm font-bold text-[#112F4E] truncate">{top1.nome}</p>
                      <p className="text-[10px] text-[#F59E0B] font-semibold truncate">{calcularNivel(top1.pontos || 0).nome}</p>
                    </div>
                    {/* Pedestal Ouro */}
                    <div className="w-full h-32 bg-gradient-to-t from-[#F59E0B]/20 to-[#FEF3C7]/40 rounded-t-xl border-t-2 border-x border-[#FEF3C7] shadow flex flex-col justify-end items-center pb-4 gap-1">
                      <InsigniaBadge nivelId={calcularNivel(top1.pontos || 0).id} size="md" />
                      <span className="text-sm font-extrabold text-[#B45309]">{top1.pontos || 0} pts</span>
                    </div>
                  </div>
                )}

                {/* TOP 3 (Bronze) - Direita */}
                {top3 && (
                  <div className="w-full sm:w-36 flex flex-col items-center order-3 transition-all hover:scale-[1.02] duration-300">
                    <div className="relative mb-2">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-[#D97706]/70 bg-white shadow-md relative z-10 flex items-center justify-center">
                        {top3.foto ? (
                          <img src={top3.foto} alt={top3.nome} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-8 h-8 text-[#D97706]" />
                        )}
                      </div>
                      <div className="absolute -top-3 -right-1 w-6 h-6 rounded-full bg-[#D97706]/85 border-2 border-white shadow flex items-center justify-center text-[10px] font-bold text-white z-20">
                        3º
                      </div>
                    </div>
                    <div className="text-center px-2 min-w-0 w-full mb-1">
                      <p className="text-xs font-bold text-[#112F4E] truncate">{top3.nome}</p>
                      <p className="text-[10px] text-[#94A3B8] font-medium truncate">{calcularNivel(top3.pontos || 0).nome}</p>
                    </div>
                    {/* Pedestal Bronze */}
                    <div className="w-full h-20 bg-gradient-to-t from-[#D97706]/15 to-[#FEF3C7]/20 rounded-t-xl border-t border-x border-[#E2E8F0] shadow-inner flex flex-col justify-end items-center pb-3 gap-1">
                      <InsigniaBadge nivelId={calcularNivel(top3.pontos || 0).id} size="sm" />
                      <span className="text-xs font-bold text-[#B45309]">{top3.pontos || 0} pts</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 text-center text-[#94A3B8] font-light shadow-sm">
              Nenhum cidadão cadastrado ainda no ranking.
            </div>
          )}

          {/* Lista com os Demais Colocados */}
          {outros.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 bg-[#FAF7F2]/50 border-b border-[#E2E8F0] flex justify-between items-center">
                <span className="text-xs font-bold text-[#112F4E] uppercase tracking-wider">Restante dos Defensores</span>
                <span className="text-[10px] font-medium text-[#94A3B8]">{outros.length} outros membros</span>
              </div>
              <div className="divide-y divide-[#F5F2ED]">
                {outros.map((item, index) => {
                  const level = calcularNivel(item.pontos || 0);
                  const posicao = index + 4; // Top 4 em diante
                  return (
                    <div key={item.uid} className="flex items-center justify-between p-4 hover:bg-[#FAF7F2]/30 transition-colors">
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Posição */}
                        <span className="w-5 text-center text-xs font-bold text-[#94A3B8] shrink-0">
                          {posicao}º
                        </span>
                        
                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-[#E2E8F0] flex items-center justify-center bg-white">
                          {item.foto ? (
                            <img src={item.foto} alt={item.nome} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-4 h-4 text-[#94A3B8]" />
                          )}
                        </div>

                        {/* Nome e Nível */}
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#112F4E] truncate">{item.nome}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <InsigniaBadge nivelId={level.id} size="sm" />
                            <span className="text-[10px] text-[#94A3B8] font-medium truncate leading-none">{level.nome}</span>
                          </div>
                        </div>
                      </div>

                      {/* Pontos */}
                      <div className="text-right shrink-0">
                        <span className="text-xs font-extrabold text-[#112F4E] bg-[#FAF7F2] border border-[#E2E8F0] px-2.5 py-1 rounded-lg">
                          {item.pontos || 0} pts
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Guia de Pontuação (col-span-4) */}
        <div className="order-1 xl:order-none xl:col-span-4 space-y-6 w-full">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#112F4E]">Como Ganhar Pontos?</h3>
              <p className="text-[11px] text-[#94A3B8] font-light mt-0.5">
                Suas interações ajudam o app a crescer e a cidade a melhorar! Veja como acumular pontos e subir de ranking:
              </p>
            </div>

            <div className="space-y-3.5">
              {regrasPontuacao.map((regra, i) => {
                const IconComp = regra.icon;
                return (
                  <div key={i} className="flex gap-3 items-start">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${regra.bgColor} ${regra.color}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-bold text-[#112F4E] truncate">{regra.acao}</h4>
                        <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${regra.bgColor} ${regra.color} shrink-0`}>
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
            
            <div className="border-t border-[#F5F2ED] pt-4 text-center">
              <span className="text-[10px] text-[#94A3B8] font-light">
                *Pontuações negativas ocorrem caso você remova um apoio a uma reclamação.
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

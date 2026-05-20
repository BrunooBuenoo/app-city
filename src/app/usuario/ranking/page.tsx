"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Trophy, Flame, Medal, Crown, Star, TrendingUp,
  ChevronRight, Loader2, ThumbsUp, FileText,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { onReclamacoesChange, type Reclamacao } from "@/services/firebase";
import {
  buildLeaderboard,
  calculateUserXP,
  getNextRankProgress,
  RANKS,
  type LeaderboardEntry,
} from "@/utils/gamification";

const podiumColors = [
  { bg: "from-yellow-400 to-amber-500", text: "text-amber-600", medal: "🥇", size: "w-20 h-20" },
  { bg: "from-gray-300 to-gray-400", text: "text-gray-500", medal: "🥈", size: "w-16 h-16" },
  { bg: "from-orange-300 to-orange-400", text: "text-orange-500", medal: "🥉", size: "w-16 h-16" },
];

export default function RankingPage() {
  const { user } = useAuth();
  const [reclamacoes, setReclamacoes] = useState<Reclamacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onReclamacoesChange(
      (items) => {
        setReclamacoes(items);
        setIsLoading(false);
      },
      () => setIsLoading(false)
    );
    return () => unsubscribe();
  }, []);

  const leaderboard = useMemo(() => buildLeaderboard(reclamacoes), [reclamacoes]);

  const userPosition = useMemo(() => {
    if (!user) return -1;
    return leaderboard.findIndex((e) => e.uid === user.uid) + 1;
  }, [leaderboard, user]);

  const userXP = useMemo(
    () => (user ? calculateUserXP(user.uid, reclamacoes) : 0),
    [user, reclamacoes]
  );
  const rankInfo = useMemo(() => getNextRankProgress(userXP), [userXP]);

  const top3 = leaderboard.slice(0, 3);
  const restList = leaderboard.slice(3, 20);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-[#1a8ccc] animate-spin" />
        <p className="text-sm text-[#4A5D70] font-light">Carregando ranking...</p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-[#F5F2ED]">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#F59E0B]" />
          <h1 className="text-lg font-semibold text-[#112F4E]">Ranking de Cidadãos</h1>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
          <span className="material-symbols-outlined text-[14px]">group</span>
          {leaderboard.length} participantes
        </div>
      </header>

      <div className="px-4 md:px-6 pb-8 space-y-6">
        {/* My Position Card */}
        {user && userPosition > 0 && (
          <div className="mt-4 p-5 rounded-2xl border border-[#E2E8F0] bg-gradient-to-r from-[#E8F2F8] to-white shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-3 border-white shadow-md bg-[#E8F2F8]">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#1a8ccc] to-[#1572a6] flex items-center justify-center text-white text-xl font-bold">
                        {(user.displayName || "C").charAt(0)}
                      </div>
                    )}
                  </div>
                  <span className="absolute -bottom-1 -right-1 text-lg">{rankInfo.current.icon}</span>
                </div>
                <div>
                  <p className="text-xs text-[#94A3B8] font-medium">Sua posição</p>
                  <p className="text-2xl font-bold text-[#112F4E]">#{userPosition}</p>
                  <p className="text-xs font-semibold" style={{ color: rankInfo.current.color }}>
                    {rankInfo.current.name}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1.5 text-[#F59E0B] mb-1">
                  <Flame className="w-5 h-5" />
                  <span className="text-xl font-bold">{userXP}</span>
                  <span className="text-xs text-[#94A3B8]">XP</span>
                </div>
                {rankInfo.next && (
                  <div>
                    <div className="w-32 h-2 bg-[#E2E8F0] rounded-full overflow-hidden mb-1">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${rankInfo.progress}%`, background: rankInfo.current.gradient }}
                      />
                    </div>
                    <p className="text-[9px] text-[#94A3B8]">
                      {rankInfo.xpToNext} XP para {rankInfo.next.name} {rankInfo.next.icon}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Ranks/Patents Info */}
        <div className="p-5 rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
          <h3 className="text-sm font-semibold text-[#112F4E] mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-[#F59E0B]" />
            Patentes
          </h3>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {RANKS.map((rank) => {
              const isCurrent = rankInfo.current.level === rank.level;
              return (
                <div
                  key={rank.level}
                  className={`flex flex-col items-center p-3 rounded-xl min-w-[90px] border transition-all ${
                    isCurrent
                      ? "border-[#1a8ccc] bg-[#E8F2F8] shadow-sm scale-105"
                      : "border-[#E2E8F0] bg-[#FAF7F2]"
                  }`}
                >
                  <span className="text-2xl mb-1">{rank.icon}</span>
                  <p className="text-[10px] font-bold text-[#112F4E] text-center">{rank.name}</p>
                  <p className="text-[9px] text-[#94A3B8] mt-0.5">{rank.minXP}+ XP</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Podium */}
        {top3.length >= 3 && (
          <div className="flex items-end justify-center gap-4 pt-4">
            {/* 2nd place */}
            <PodiumCard entry={top3[1]} position={2} config={podiumColors[1]} isCurrentUser={top3[1].uid === user?.uid} />
            {/* 1st place */}
            <PodiumCard entry={top3[0]} position={1} config={podiumColors[0]} isCurrentUser={top3[0].uid === user?.uid} />
            {/* 3rd place */}
            <PodiumCard entry={top3[2]} position={3} config={podiumColors[2]} isCurrentUser={top3[2].uid === user?.uid} />
          </div>
        )}

        {/* Leaderboard List */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-[#F1F5F9] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#112F4E] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#94A3B8]" />
              Classificação Geral
            </h3>
          </div>

          {leaderboard.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#94A3B8]">
              Nenhum cidadão ativo ainda. Seja o primeiro a participar!
            </div>
          ) : (
            <div className="divide-y divide-[#F5F2ED]">
              {/* Top 3 in list too */}
              {top3.map((entry, i) => (
                <LeaderboardRow
                  key={entry.uid}
                  entry={entry}
                  position={i + 1}
                  isCurrentUser={entry.uid === user?.uid}
                  isTop3
                />
              ))}
              {restList.map((entry, i) => (
                <LeaderboardRow
                  key={entry.uid}
                  entry={entry}
                  position={i + 4}
                  isCurrentUser={entry.uid === user?.uid}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function PodiumCard({
  entry,
  position,
  config,
  isCurrentUser,
}: {
  entry: LeaderboardEntry;
  position: number;
  config: typeof podiumColors[0];
  isCurrentUser: boolean;
}) {
  return (
    <div className={`flex flex-col items-center ${position === 1 ? "mb-4" : ""}`}>
      <div className="relative mb-2">
        <div className={`${config.size} rounded-full overflow-hidden border-4 border-white shadow-lg bg-[#E8F2F8]`}>
          {entry.foto ? (
            <img src={entry.foto} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${config.bg} flex items-center justify-center text-white text-2xl font-bold`}>
              {entry.nome.charAt(0)}
            </div>
          )}
        </div>
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-2xl drop-shadow-md">
          {config.medal}
        </span>
      </div>
      <p className={`text-xs font-bold text-[#112F4E] mt-2 text-center truncate max-w-[100px] ${isCurrentUser ? "text-[#1a8ccc]" : ""}`}>
        {entry.nome}
      </p>
      <p className="text-[10px] font-semibold" style={{ color: entry.rank.color }}>
        {entry.rank.icon} {entry.rank.name}
      </p>
      <div className="flex items-center gap-1 text-[#F59E0B] mt-0.5">
        <Flame className="w-3 h-3" />
        <span className="text-xs font-bold">{entry.xp} XP</span>
      </div>
    </div>
  );
}

function LeaderboardRow({
  entry,
  position,
  isCurrentUser,
  isTop3 = false,
}: {
  entry: LeaderboardEntry;
  position: number;
  isCurrentUser: boolean;
  isTop3?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-5 py-3.5 transition-colors ${
        isCurrentUser
          ? "bg-[#E8F2F8]/50"
          : "hover:bg-[#FAF7F2]"
      }`}
    >
      {/* Position */}
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
        isTop3
          ? "bg-[#FEF3C7] text-[#D97706]"
          : "bg-[#F1F5F9] text-[#94A3B8]"
      }`}>
        {position}
      </div>

      {/* Avatar */}
      <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm bg-[#E8F2F8]">
        {entry.foto ? (
          <img src={entry.foto} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1a8ccc] to-[#1572a6] flex items-center justify-center text-white text-sm font-bold">
            {entry.nome.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold truncate ${isCurrentUser ? "text-[#1a8ccc]" : "text-[#112F4E]"}`}>
          {entry.nome}
          {isCurrentUser && <span className="text-[10px] ml-1.5 text-[#94A3B8] font-normal">(você)</span>}
        </p>
        <p className="text-[10px] font-semibold flex items-center gap-1" style={{ color: entry.rank.color }}>
          {entry.rank.icon} {entry.rank.name}
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-1 text-[#94A3B8]" title="Reclamações criadas">
          <FileText className="w-3 h-3" />
          <span className="text-[10px] font-semibold">{entry.reclamacoesCount}</span>
        </div>
        <div className="flex items-center gap-1 text-[#10B981]" title="Concordos dados">
          <ThumbsUp className="w-3 h-3" />
          <span className="text-[10px] font-semibold">{entry.concordosCount}</span>
        </div>
        <div className="flex items-center gap-1 text-[#F59E0B]">
          <Flame className="w-3 h-3" />
          <span className="text-xs font-bold">{entry.xp}</span>
        </div>
      </div>
    </div>
  );
}

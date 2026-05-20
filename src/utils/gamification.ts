// ─── Gamificação — Sistema de Patentes (estilo Uber) ───
// XP é calculado a partir dos dados existentes no Firestore.
// Não requer campos extras no documento do usuário.

import type { Reclamacao } from "@/services/firebase/reclamacoes";

// ─── Patentes ───

export interface Rank {
  level: number;
  name: string;
  icon: string;            // emoji
  minXP: number;
  color: string;           // tailwind-compatible hex
  bgColor: string;
  gradient: string;        // CSS gradient
}

export const RANKS: Rank[] = [
  {
    level: 1,
    name: "Observador",
    icon: "👁️",
    minXP: 0,
    color: "#94A3B8",
    bgColor: "#F1F5F9",
    gradient: "linear-gradient(135deg, #CBD5E1, #94A3B8)",
  },
  {
    level: 2,
    name: "Colaborador",
    icon: "🤝",
    minXP: 50,
    color: "#1a8ccc",
    bgColor: "#E8F2F8",
    gradient: "linear-gradient(135deg, #38BDF8, #1a8ccc)",
  },
  {
    level: 3,
    name: "Guardião",
    icon: "🛡️",
    minXP: 150,
    color: "#8B5CF6",
    bgColor: "#EDE9FE",
    gradient: "linear-gradient(135deg, #A78BFA, #7C3AED)",
  },
  {
    level: 4,
    name: "Protetor",
    icon: "⚔️",
    minXP: 400,
    color: "#F59E0B",
    bgColor: "#FEF3C7",
    gradient: "linear-gradient(135deg, #FCD34D, #D97706)",
  },
  {
    level: 5,
    name: "Herói da Cidade",
    icon: "🏆",
    minXP: 1000,
    color: "#EF4444",
    bgColor: "#FEE2E2",
    gradient: "linear-gradient(135deg, #F87171, #DC2626)",
  },
];

// ─── XP Rules ───

const XP_CRIAR_RECLAMACAO = 5;
const XP_CONCORDAR = 1;           // por cada concordância dada pelo usuário
const XP_CONCORDO_RESOLVIDO = 10; // bônus quando reclamação que concordou é resolvida
const XP_RECLAMACAO_RESOLVIDA = 20; // bônus quando SUA reclamação é resolvida

// ─── XP Calculation ───

/**
 * Calcula o XP total de um usuário baseado nas reclamações do Firestore.
 * Não precisa de campo extra — tudo é derivado dos dados existentes.
 */
export function calculateUserXP(
  userId: string,
  allReclamacoes: Reclamacao[]
): number {
  let xp = 0;

  for (const rec of allReclamacoes) {
    // XP por criar reclamação
    if (rec.autorId === userId) {
      xp += XP_CRIAR_RECLAMACAO;

      // Bônus se resolvida
      if (rec.status === "resolvido") {
        xp += XP_RECLAMACAO_RESOLVIDA;
      }
    }

    // XP por concordar
    const voto = rec.votantes?.[userId];
    const tipoVoto = typeof voto === "string" ? voto : (voto as any)?.tipo;
    if (tipoVoto === "concordo") {
      xp += XP_CONCORDAR;

      // Bônus se a reclamação que concordou foi resolvida
      if (rec.status === "resolvido") {
        xp += XP_CONCORDO_RESOLVIDO;
      }
    }
  }

  return xp;
}

// ─── Rank Getters ───

/** Retorna o rank (patente) do usuário baseado no XP */
export function getUserRank(xp: number): Rank {
  let rank = RANKS[0];
  for (const r of RANKS) {
    if (xp >= r.minXP) rank = r;
  }
  return rank;
}

/** Progresso percentual para o próximo rank (0-100) */
export function getNextRankProgress(xp: number): {
  current: Rank;
  next: Rank | null;
  progress: number; // 0–100
  xpToNext: number;
} {
  const current = getUserRank(xp);
  const nextIndex = RANKS.findIndex((r) => r.level === current.level) + 1;
  const next = nextIndex < RANKS.length ? RANKS[nextIndex] : null;

  if (!next) {
    return { current, next: null, progress: 100, xpToNext: 0 };
  }

  const rangeTotal = next.minXP - current.minXP;
  const rangeCurrent = xp - current.minXP;
  const progress = Math.min(100, Math.round((rangeCurrent / rangeTotal) * 100));
  const xpToNext = next.minXP - xp;

  return { current, next, progress, xpToNext };
}

// ─── Leaderboard Helpers ───

export interface LeaderboardEntry {
  uid: string;
  nome: string;
  foto: string;
  xp: number;
  rank: Rank;
  reclamacoesCount: number;
  concordosCount: number;
}

/**
 * Gera o leaderboard a partir de todas as reclamações.
 * Agrupa por usuário e calcula XP/rank de cada um.
 */
export function buildLeaderboard(
  allReclamacoes: Reclamacao[]
): LeaderboardEntry[] {
  // Coletar todos os usuários únicos
  const usersMap = new Map<
    string,
    { nome: string; foto: string; reclamacoesCount: number; concordosCount: number }
  >();

  for (const rec of allReclamacoes) {
    // Autor
    if (rec.autorId) {
      if (!usersMap.has(rec.autorId)) {
        usersMap.set(rec.autorId, {
          nome: rec.autorNome || "Anônimo",
          foto: rec.autorFoto || "",
          reclamacoesCount: 0,
          concordosCount: 0,
        });
      }
      const authorEntry = usersMap.get(rec.autorId)!;
      authorEntry.reclamacoesCount++;
      // Atualizar nome/foto caso mais recente
      if (rec.autorNome) authorEntry.nome = rec.autorNome;
      if (rec.autorFoto) authorEntry.foto = rec.autorFoto;
    }

    // Votantes
    for (const [uid, voto] of Object.entries(rec.votantes || {})) {
      const tipoVoto = typeof voto === "string" ? voto : (voto as any)?.tipo;
      if (tipoVoto !== "concordo") continue;

      if (!usersMap.has(uid)) {
        const votoData = typeof voto === "object" ? voto as any : {};
        usersMap.set(uid, {
          nome: votoData.nome || "Cidadão",
          foto: votoData.foto || "",
          reclamacoesCount: 0,
          concordosCount: 0,
        });
      }
      usersMap.get(uid)!.concordosCount++;
    }
  }

  // Calcular XP e rank para cada usuário
  const entries: LeaderboardEntry[] = [];
  for (const [uid, data] of usersMap.entries()) {
    const xp = calculateUserXP(uid, allReclamacoes);
    entries.push({
      uid,
      nome: data.nome,
      foto: data.foto,
      xp,
      rank: getUserRank(xp),
      reclamacoesCount: data.reclamacoesCount,
      concordosCount: data.concordosCount,
    });
  }

  // Ordenar por XP descendente
  entries.sort((a, b) => b.xp - a.xp);

  return entries;
}

// ─── Sistema de Níveis Dino (usado pelo ranking e dashboard remotos) ───

export interface NivelInfo {
  nome: string;
  id: string;
  minPontos: number;
  maxPontos: number;
}

export const NIVEIS_PRESTIGIO: NivelInfo[] = [
  { nome: "Ovo de Dino", id: "observador", minPontos: 0, maxPontos: 49 },
  { nome: "Dino Bebê", id: "iniciante", minPontos: 50, maxPontos: 149 },
  { nome: "Dino Explorador", id: "colaborador", minPontos: 150, maxPontos: 349 },
  { nome: "Dino de Bronze", id: "bronze", minPontos: 350, maxPontos: 699 },
  { nome: "Dino de Prata", id: "prata", minPontos: 700, maxPontos: 1199 },
  { nome: "Dino de Ouro", id: "ouro", minPontos: 1200, maxPontos: 1999 },
  { nome: "Titanossauro Lendário", id: "lendario", minPontos: 2000, maxPontos: 999999 },
];

export function calcularNivel(pontos: number) {
  const pontosAtuais = pontos || 0;
  let nivelAtual = NIVEIS_PRESTIGIO[0];
  let proximoNivel = NIVEIS_PRESTIGIO[1];

  for (let i = 0; i < NIVEIS_PRESTIGIO.length; i++) {
    if (pontosAtuais >= NIVEIS_PRESTIGIO[i].minPontos && pontosAtuais <= NIVEIS_PRESTIGIO[i].maxPontos) {
      nivelAtual = NIVEIS_PRESTIGIO[i];
      proximoNivel = NIVEIS_PRESTIGIO[i + 1] || NIVEIS_PRESTIGIO[i];
      break;
    }
  }

  const faixaPontos = nivelAtual.maxPontos - nivelAtual.minPontos + 1;
  const pontosNesteNivel = pontosAtuais - nivelAtual.minPontos;
  const progresso = Math.min(100, Math.max(0, Math.round((pontosNesteNivel / faixaPontos) * 100)));

  return {
    nome: nivelAtual.nome,
    id: nivelAtual.id,
    progresso,
    pontosRestantes: Math.max(0, proximoNivel.minPontos - pontosAtuais),
    proximoNivelNome: proximoNivel.nome,
    proximoNivelPontos: proximoNivel.minPontos,
  };
}

export const RECOMPENSAS = {
  CRIAR_RECLAMACAO: 10,
  CONCORDAR: 5,
  CRIADOR_RESOLVIDO: 50,
  VOTANTE_RESOLVIDO: 30,
};

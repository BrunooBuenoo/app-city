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

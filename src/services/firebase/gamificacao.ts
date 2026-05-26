import { db } from "./config";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { calcularNivel } from "@/utils/gamification";

export interface RecompensasConfig {
  CRIAR_RECLAMACAO: number;
  CONCORDAR: number;
  CRIADOR_RESOLVIDO: number;
  VOTANTE_RESOLVIDO: number;
}

// Configurações padrão de recompensas (fallbacks do sistema)
export const RECOMPENSAS_PADRAO: RecompensasConfig = {
  CRIAR_RECLAMACAO: 10,
  CONCORDAR: 5,
  CRIADOR_RESOLVIDO: 50,
  VOTANTE_RESOLVIDO: 30,
};

// Cache em memória simples no cliente para evitar requisições redundantes de getDoc
let cacheRecompensas: RecompensasConfig | null = null;

/**
 * Obtém as configurações ativas de recompensas (regras de XP) do Firestore.
 * Se o documento estiver vazio, realiza a carga inicial automática das regras padrão.
 */
export async function obterRecompensasDb(): Promise<RecompensasConfig> {
  // Retorna do cache se preenchido para desempenho instantâneo
  if (cacheRecompensas) {
    return cacheRecompensas;
  }

  try {
    const configRef = doc(db, "configuracoes", "gamificacao");
    const docSnap = await getDoc(configRef);

    if (!docSnap.exists()) {
      console.log("Configurações de gamificação não encontradas no Firestore. Inicializando padrão...");
      await setDoc(configRef, {
        ...RECOMPENSAS_PADRAO,
        atualizadoEm: serverTimestamp(),
      });
      cacheRecompensas = RECOMPENSAS_PADRAO;
      return RECOMPENSAS_PADRAO;
    }

    const data = docSnap.data();
    const config: RecompensasConfig = {
      CRIAR_RECLAMACAO: data.CRIAR_RECLAMACAO !== undefined ? Number(data.CRIAR_RECLAMACAO) : RECOMPENSAS_PADRAO.CRIAR_RECLAMACAO,
      CONCORDAR: data.CONCORDAR !== undefined ? Number(data.CONCORDAR) : RECOMPENSAS_PADRAO.CONCORDAR,
      CRIADOR_RESOLVIDO: data.CRIADOR_RESOLVIDO !== undefined ? Number(data.CRIADOR_RESOLVIDO) : RECOMPENSAS_PADRAO.CRIADOR_RESOLVIDO,
      VOTANTE_RESOLVIDO: data.VOTANTE_RESOLVIDO !== undefined ? Number(data.VOTANTE_RESOLVIDO) : RECOMPENSAS_PADRAO.VOTANTE_RESOLVIDO,
    };

    cacheRecompensas = config;
    return config;
  } catch (err) {
    console.error("Erro ao obter regras de gamificação do Firestore, usando fallback local:", err);
    return RECOMPENSAS_PADRAO;
  }
}

/**
 * Atualiza as regras de recompensas de XP no Firestore e limpa o cache local.
 */
export async function salvarRecompensasDb(novasRecompensas: RecompensasConfig): Promise<void> {
  try {
    const configRef = doc(db, "configuracoes", "gamificacao");
    
    const payload = {
      CRIAR_RECLAMACAO: Number(novasRecompensas.CRIAR_RECLAMACAO),
      CONCORDAR: Number(novasRecompensas.CONCORDAR),
      CRIADOR_RESOLVIDO: Number(novasRecompensas.CRIADOR_RESOLVIDO),
      VOTANTE_RESOLVIDO: Number(novasRecompensas.VOTANTE_RESOLVIDO),
      atualizadoEm: serverTimestamp(),
    };

    await setDoc(configRef, payload);
    cacheRecompensas = payload; // Atualiza cache local
    console.log("Regras de gamificação salvas no Firestore com sucesso!");
  } catch (err) {
    console.error("Erro ao salvar regras de gamificação no Firestore:", err);
    throw err;
  }
}

/**
 * Atualiza manualmente a pontuação de XP de um usuário específico, recalculando o nível dele na hora.
 * Usado pelo administrador para dar ou tirar pontos.
 */
export async function atualizarPontosUsuarioDb(uid: string, novosPontos: number): Promise<void> {
  if (!uid) return;
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      throw new Error("Usuário não encontrado");
    }

    const pontosFinais = Math.max(0, novosPontos);
    const nivelInfo = calcularNivel(pontosFinais);

    await setDoc(userRef, {
      pontos: pontosFinais,
      nivel: nivelInfo.nome,
      atualizadoEm: serverTimestamp(),
    }, { merge: true });

    console.log(`Pontuação do usuário '${uid}' alterada manualmente para ${pontosFinais} XP.`);
  } catch (err) {
    console.error("Erro ao atualizar pontos de usuário no Firestore:", err);
    throw err;
  }
}

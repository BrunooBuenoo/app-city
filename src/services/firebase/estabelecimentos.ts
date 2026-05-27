import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  collectionGroup,
  type DocumentData,
  type QueryConstraint,
  setDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./config";

const GLOBAL_ESTABLISHMENTS_COLLECTION = "establishments";

// ----- Types -----

export interface Estabelecimento {
  id: string;
  empresaId: string;
  nome: string;
  descricao: string;
  categoria: "alimentacao" | "automotivo" | "saude_beleza" | "comercio_varejo" | "educacao_servicos";
  logoUrl: string;
  bannerUrl: string;
  latitude: number;
  longitude: number;
  endereco: string;
  telefone: string;
  status: "pendente_aprovacao" | "ativo" | "suspenso";
  criadoEm: Timestamp | null;
  aprovadoEm?: Timestamp | null;
  cardapioUrl?: string;
  servicos?: string;
}

export interface Cupom {
  id: string;
  titulo: string;
  descricao: string;
  codigoBase: string;
  validade: Timestamp | null;
  limitePorUsuario: number;
  ativo: boolean;
  criadoEm: Timestamp | null;
}

export interface Resgate {
  id: string;
  cupomId: string;
  usuarioId: string;
  codigoUnicoGerado: string;
  status: "gerado" | "resgatado" | "expirado";
  resgatadoEm?: Timestamp | null;
  criadoEm: Timestamp | null;
  // Metadata fields for easy dashboard rendering
  cupomTitulo?: string;
  estabelecimentoNome?: string;
  estabelecimentoId?: string;
  empresaId?: string;
}

// ----- Helpers -----

function docToEstabelecimento(id: string, data: DocumentData): Estabelecimento {
  return {
    id,
    empresaId: data.empresaId ?? "",
    nome: data.nome ?? "",
    descricao: data.descricao ?? "",
    categoria: data.categoria ?? "comercio_varejo",
    logoUrl: data.logoUrl ?? "",
    bannerUrl: data.bannerUrl ?? "",
    latitude: data.latitude ?? 0,
    longitude: data.longitude ?? 0,
    endereco: data.endereco ?? "",
    telefone: data.telefone ?? "",
    status: data.status ?? "pendente_aprovacao",
    criadoEm: data.criadoEm ?? null,
    aprovadoEm: data.aprovadoEm ?? null,
    cardapioUrl: data.cardapioUrl ?? "",
    servicos: data.servicos ?? "",
  };
}

function buildEstabelecimentoConstraints(filtros?: {
  status?: string;
  categoria?: string;
  empresaId?: string;
}): QueryConstraint[] {
  const constraints: QueryConstraint[] = [];

  if (filtros?.status) {
    constraints.push(where("status", "==", filtros.status));
  }
  if (filtros?.categoria) {
    constraints.push(where("categoria", "==", filtros.categoria));
  }
  if (filtros?.empresaId) {
    constraints.push(where("empresaId", "==", filtros.empresaId));
  }

  return constraints;
}

function mergeEstabelecimentos(...listas: Estabelecimento[][]): Estabelecimento[] {
  const merged = new Map<string, Estabelecimento>();

  for (const lista of listas) {
    for (const estabelecimento of lista) {
      merged.set(estabelecimento.id, estabelecimento);
    }
  }

  return Array.from(merged.values());
}

async function syncGlobalEstabelecimento(
  estabId: string,
  data: Partial<Estabelecimento> & { empresaId: string }
): Promise<void> {
  await setDoc(
    doc(db, GLOBAL_ESTABLISHMENTS_COLLECTION, estabId),
    {
      ...data,
      id: estabId,
      atualizadoEm: serverTimestamp(),
    },
    { merge: true }
  );
}

// ----- Estabelecimentos Operations -----

export async function criarEstabelecimento(
  empresaId: string,
  data: Omit<Estabelecimento, "id" | "empresaId" | "status" | "criadoEm" | "aprovadoEm">
): Promise<string> {
  const colRef = collection(db, "empresas", empresaId, "estabelecimentos");
  const docRef = await addDoc(colRef, {
    ...data,
    empresaId,
    status: "pendente_aprovacao",
    criadoEm: serverTimestamp(),
  });

  // Atualiza com o ID inserido
  await updateDoc(docRef, { id: docRef.id });
  await syncGlobalEstabelecimento(docRef.id, {
    ...data,
    empresaId,
    status: "pendente_aprovacao",
    criadoEm: Timestamp.now(),
  });
  return docRef.id;
}

export async function aprovarEstabelecimento(empresaId: string, estabId: string): Promise<void> {
  const docRef = doc(db, "empresas", empresaId, "estabelecimentos", estabId);
  await updateDoc(docRef, {
    status: "ativo",
    aprovadoEm: serverTimestamp(),
  });
  await syncGlobalEstabelecimento(estabId, {
    empresaId,
    status: "ativo",
    aprovadoEm: Timestamp.now(),
  });
}

export async function rejeitarOuSuspenderEstabelecimento(empresaId: string, estabId: string, status: "suspenso" | "pendente_aprovacao"): Promise<void> {
  const docRef = doc(db, "empresas", empresaId, "estabelecimentos", estabId);
  await updateDoc(docRef, {
    status,
  });
  await syncGlobalEstabelecimento(estabId, {
    empresaId,
    status,
  });
}

export async function listarEstabelecimentos(filtros?: {
  status?: string;
  categoria?: string;
  empresaId?: string;
}): Promise<Estabelecimento[]> {
  if (filtros?.empresaId) {
    const constraints = buildEstabelecimentoConstraints(filtros);
    const [globalSnap, empresaSnap] = await Promise.all([
      getDocs(query(collection(db, GLOBAL_ESTABLISHMENTS_COLLECTION), ...constraints)),
      getDocs(query(collection(db, "empresas", filtros.empresaId, "estabelecimentos"), ...constraints.filter((constraint) => constraint.type !== "where" || (constraint as any)?._field?.segments?.[0] !== "empresaId"))),
    ]);

    return mergeEstabelecimentos(
      empresaSnap.docs.map((d) => docToEstabelecimento(d.id, d.data())),
      globalSnap.docs.map((d) => docToEstabelecimento(d.id, d.data()))
    );
  } else {
    const constraints = buildEstabelecimentoConstraints(filtros);
    const [globalSnap, legacySnap] = await Promise.all([
      getDocs(query(collection(db, GLOBAL_ESTABLISHMENTS_COLLECTION), ...constraints)),
      getDocs(query(collectionGroup(db, "estabelecimentos"), ...constraints)),
    ]);

    return mergeEstabelecimentos(
      legacySnap.docs.map((d) => docToEstabelecimento(d.id, d.data())),
      globalSnap.docs.map((d) => docToEstabelecimento(d.id, d.data()))
    );
  }
}

// Real-time listener para o mapa (somente ativos)
export function onEstabelecimentosChange(
  callback: (estabelecimentos: Estabelecimento[]) => void,
  onError?: (error: any) => void
) {
  let globalItems: Estabelecimento[] = [];
  let legacyItems: Estabelecimento[] = [];

  const emit = () => {
    callback(mergeEstabelecimentos(legacyItems, globalItems));
  };

  const unsubscribeGlobal = onSnapshot(
    query(collection(db, GLOBAL_ESTABLISHMENTS_COLLECTION), where("status", "==", "ativo")),
    (snap) => {
      globalItems = snap.docs.map((d) => docToEstabelecimento(d.id, d.data()));
      emit();
    },
    (error) => {
      console.error("Firestore onEstabelecimentosChange global error:", error);
      if (onError) onError(error);
    }
  );

  const unsubscribeLegacy = onSnapshot(
    query(collectionGroup(db, "estabelecimentos"), where("status", "==", "ativo")),
    (snap) => {
      legacyItems = snap.docs.map((d) => docToEstabelecimento(d.id, d.data()));
      emit();
    },
    (error) => {
      console.error("Firestore onEstabelecimentosChange legacy error:", error);
      if (onError) onError(error);
    }
  );

  return () => {
    unsubscribeGlobal();
    unsubscribeLegacy();
  };
}

// ----- Cupons Operations -----

export async function criarCupom(
  empresaId: string,
  estabId: string,
  data: Omit<Cupom, "id" | "criadoEm">
): Promise<string> {
  const colRef = collection(db, "empresas", empresaId, "estabelecimentos", estabId, "cupons");
  const docRef = await addDoc(colRef, {
    ...data,
    criadoEm: serverTimestamp(),
  });
  await updateDoc(docRef, { id: docRef.id });
  return docRef.id;
}

export async function alternarStatusCupom(
  empresaId: string,
  estabId: string,
  cupomId: string,
  ativo: boolean
): Promise<void> {
  const docRef = doc(db, "empresas", empresaId, "estabelecimentos", estabId, "cupons", cupomId);
  await updateDoc(docRef, { ativo });
}

export async function listarCupons(empresaId: string, estabId: string, apenasAtivos = false): Promise<Cupom[]> {
  const colRef = collection(db, "empresas", empresaId, "estabelecimentos", estabId, "cupons");
  const constraints: QueryConstraint[] = [orderBy("criadoEm", "desc")];
  if (apenasAtivos) {
    constraints.push(where("ativo", "==", true));
  }
  const q = query(colRef, ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      titulo: data.titulo ?? "",
      descricao: data.descricao ?? "",
      codigoBase: data.codigoBase ?? "",
      validade: data.validade ?? null,
      limitePorUsuario: data.limitePorUsuario ?? 1,
      ativo: data.ativo ?? true,
      criadoEm: data.criadoEm ?? null,
    };
  });
}

// ----- Resgates Operations -----

export async function resgatarCupom(
  empresaId: string,
  estabId: string,
  estabNome: string,
  cupomId: string,
  cupomTitulo: string,
  usuarioId: string,
  codigoBase: string
): Promise<string> {
  // Código único gerado no formato: CODBASE-XXXX (4 caracteres alfanuméricos aleatórios)
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  const codigoUnicoGerado = `${codigoBase}-${randomStr}`;

  const colRef = collection(db, "empresas", empresaId, "estabelecimentos", estabId, "resgates");
  const docRef = await addDoc(colRef, {
    cupomId,
    cupomTitulo,
    estabelecimentoNome: estabNome,
    estabelecimentoId: estabId,
    empresaId,
    usuarioId,
    codigoUnicoGerado,
    status: "gerado",
    criadoEm: serverTimestamp(),
  });

  await updateDoc(docRef, { id: docRef.id });
  return codigoUnicoGerado;
}

export async function validarResgate(codigoUnico: string): Promise<Resgate> {
  const q = query(collectionGroup(db, "resgates"), where("codigoUnicoGerado", "==", codigoUnico.trim().toUpperCase()));
  const snap = await getDocs(q);

  if (snap.empty) {
    throw new Error("Código de cupom inválido ou não encontrado.");
  }

  const resgateDoc = snap.docs[0];
  const data = resgateDoc.data();

  if (data.status !== "gerado") {
    throw new Error(`Este cupom já foi ${data.status === "resgatado" ? "utilizado/resgatado" : "expirado"}.`);
  }

  await updateDoc(resgateDoc.ref, {
    status: "resgatado",
    resgatadoEm: serverTimestamp(),
  });

  return {
    id: resgateDoc.id,
    cupomId: data.cupomId ?? "",
    usuarioId: data.usuarioId ?? "",
    codigoUnicoGerado: data.codigoUnicoGerado ?? "",
    status: "resgatado",
    resgatadoEm: Timestamp.now(),
    criadoEm: data.criadoEm ?? null,
    cupomTitulo: data.cupomTitulo ?? "",
    estabelecimentoNome: data.estabelecimentoNome ?? "",
  };
}

export async function listarResgatesDoUsuario(usuarioId: string): Promise<Resgate[]> {
  const q = query(
    collectionGroup(db, "resgates"),
    where("usuarioId", "==", usuarioId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      cupomId: data.cupomId ?? "",
      usuarioId: data.usuarioId ?? "",
      codigoUnicoGerado: data.codigoUnicoGerado ?? "",
      status: data.status ?? "gerado",
      resgatadoEm: data.resgatadoEm ?? null,
      criadoEm: data.criadoEm ?? null,
      cupomTitulo: data.cupomTitulo ?? "",
      estabelecimentoNome: data.estabelecimentoNome ?? "",
      estabelecimentoId: data.estabelecimentoId ?? "",
      empresaId: data.empresaId ?? "",
    };
  }).sort((a, b) => {
    const timeA = a.criadoEm?.toMillis() ?? 0;
    const timeB = b.criadoEm?.toMillis() ?? 0;
    return timeB - timeA;
  });
}

export async function listarResgatesDoEstabelecimento(empresaId: string, estabId: string): Promise<Resgate[]> {
  const colRef = collection(db, "empresas", empresaId, "estabelecimentos", estabId, "resgates");
  const q = query(colRef, orderBy("criadoEm", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      cupomId: data.cupomId ?? "",
      usuarioId: data.usuarioId ?? "",
      codigoUnicoGerado: data.codigoUnicoGerado ?? "",
      status: data.status ?? "gerado",
      resgatadoEm: data.resgatadoEm ?? null,
      criadoEm: data.criadoEm ?? null,
      cupomTitulo: data.cupomTitulo ?? "",
      estabelecimentoNome: data.estabelecimentoNome ?? "",
    };
  });
}

// ----- Upload Operations -----

export async function uploadLogoEstabelecimento(
  file: File,
  empresaId: string
): Promise<string> {
  const fileRef = ref(storage, `estabelecimentos/${empresaId}/${Date.now()}_${file.name}`);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
}

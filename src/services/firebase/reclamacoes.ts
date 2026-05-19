import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  type DocumentData,
  type QueryConstraint,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./config";

// ----- Types -----

export interface Reclamacao {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;       // id da categoria (ex: "infraestrutura")
  subcategoria: string;
  status: "aberto" | "em_analise" | "em_andamento" | "resolvido" | "critico";
  endereco: string;
  latitude: number;
  longitude: number;
  fotos: string[];           // URLs do Storage
  anonimo: boolean;
  autorId: string;
  autorNome: string;
  autorFoto: string;
  concordos: number;
  discordos: number;
  votantes: Record<string, "concordo" | "discordo">; // uid -> voto
  criadoEm: Timestamp | null;
  atualizadoEm: Timestamp | null;
}

export interface TimelineEvent {
  status: string;
  descricao: string;
  user: string;     // "Sistema" | "Admin" | nome
  criadoEm: Timestamp | null;
}

// ----- Helpers -----

const COLLECTION = "reclamacoes";

function docToReclamacao(id: string, data: DocumentData): Reclamacao {
  return {
    id,
    titulo: data.titulo ?? "",
    descricao: data.descricao ?? "",
    categoria: data.categoria ?? "",
    subcategoria: data.subcategoria ?? "",
    status: data.status ?? "aberto",
    endereco: data.endereco ?? "",
    latitude: data.latitude ?? 0,
    longitude: data.longitude ?? 0,
    fotos: data.fotos ?? [],
    anonimo: data.anonimo ?? false,
    autorId: data.autorId ?? "",
    autorNome: data.autorNome ?? "",
    autorFoto: data.autorFoto ?? "",
    concordos: data.concordos ?? 0,
    discordos: data.discordos ?? 0,
    votantes: data.votantes ?? {},
    criadoEm: data.criadoEm ?? null,
    atualizadoEm: data.atualizadoEm ?? null,
  };
}

// ----- CRUD -----

export async function criarReclamacao(
  data: Omit<Reclamacao, "id" | "concordos" | "discordos" | "votantes" | "criadoEm" | "atualizadoEm">
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    concordos: 0,
    discordos: 0,
    votantes: {},
    criadoEm: serverTimestamp(),
    atualizadoEm: serverTimestamp(),
  });

  // Cria o primeiro evento na timeline
  await addDoc(collection(db, COLLECTION, docRef.id, "timeline"), {
    status: "Criada",
    descricao: `Reclamação registrada por ${data.anonimo ? "Anônimo" : data.autorNome}.`,
    user: "Sistema",
    criadoEm: serverTimestamp(),
  });

  return docRef.id;
}

export async function getReclamacao(id: string): Promise<Reclamacao | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return docToReclamacao(snap.id, snap.data());
}

export async function listarReclamacoes(
  filtros?: {
    status?: string;
    categoria?: string;
    autorId?: string;
    limite?: number;
  }
): Promise<Reclamacao[]> {
  const constraints: QueryConstraint[] = [];

  if (filtros?.status && filtros.status !== "todos") {
    constraints.push(where("status", "==", filtros.status));
  }
  if (filtros?.categoria && filtros.categoria !== "Todas") {
    constraints.push(where("categoria", "==", filtros.categoria));
  }
  if (filtros?.autorId) {
    constraints.push(where("autorId", "==", filtros.autorId));
  }

  constraints.push(orderBy("criadoEm", "desc"));

  if (filtros?.limite) {
    constraints.push(limit(filtros.limite));
  }

  const q = query(collection(db, COLLECTION), ...constraints);
  const snap = await getDocs(q);

  return snap.docs.map((d) => docToReclamacao(d.id, d.data()));
}

// Listener em tempo real para o mapa
export function onReclamacoesChange(
  callback: (reclamacoes: Reclamacao[]) => void,
  onError?: (error: any) => void
) {
  const q = query(collection(db, COLLECTION), orderBy("criadoEm", "desc"));
  return onSnapshot(
    q,
    (snap) => {
      const items = snap.docs.map((d) => docToReclamacao(d.id, d.data()));
      callback(items);
    },
    (error) => {
      console.error("Firestore onReclamacoesChange error:", error);
      if (onError) onError(error);
    }
  );
}

// ----- Status & Timeline -----

export async function atualizarStatus(
  reclamacaoId: string,
  novoStatus: Reclamacao["status"],
  descricao: string,
  userName: string
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, reclamacaoId), {
    status: novoStatus,
    atualizadoEm: serverTimestamp(),
  });

  await addDoc(collection(db, COLLECTION, reclamacaoId, "timeline"), {
    status: novoStatus,
    descricao,
    user: userName,
    criadoEm: serverTimestamp(),
  });
}

export async function getTimeline(reclamacaoId: string): Promise<TimelineEvent[]> {
  const q = query(
    collection(db, COLLECTION, reclamacaoId, "timeline"),
    orderBy("criadoEm", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as TimelineEvent);
}

// ----- Votação -----

export async function votar(
  reclamacaoId: string,
  userId: string,
  tipo: "concordo" | "discordo"
): Promise<void> {
  const recRef = doc(db, COLLECTION, reclamacaoId);
  const snap = await getDoc(recRef);
  if (!snap.exists()) return;

  const data = snap.data();
  const votantes: Record<string, string> = data.votantes ?? {};
  let concordos: number = data.concordos ?? 0;
  let discordos: number = data.discordos ?? 0;

  const votoAnterior = votantes[userId];

  if (votoAnterior === tipo) {
    // Desfaz o voto
    delete votantes[userId];
    if (tipo === "concordo") concordos--;
    else discordos--;
  } else {
    // Desfaz voto anterior se existir
    if (votoAnterior === "concordo") concordos--;
    if (votoAnterior === "discordo") discordos--;
    // Aplica novo voto
    votantes[userId] = tipo;
    if (tipo === "concordo") concordos++;
    else discordos++;
  }

  await updateDoc(recRef, { votantes, concordos, discordos });
}

// ----- Upload de Fotos -----

export async function uploadFotoReclamacao(
  file: File,
  reclamacaoId: string
): Promise<string> {
  const fileRef = ref(storage, `reclamacoes/${reclamacaoId}/${Date.now()}_${file.name}`);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
}

// ----- Comentários -----

export async function adicionarComentario(
  reclamacaoId: string,
  autorId: string,
  autorNome: string,
  autorFoto: string,
  texto: string
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION, reclamacaoId, "comentarios"), {
    autorId,
    autorNome,
    autorFoto,
    texto,
    criadoEm: serverTimestamp(),
  });
  return docRef.id;
}

export async function listarComentarios(reclamacaoId: string): Promise<any[]> {
  const q = query(
    collection(db, COLLECTION, reclamacaoId, "comentarios"),
    orderBy("criadoEm", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export function onComentariosChange(
  reclamacaoId: string,
  callback: (comentarios: any[]) => void
) {
  const q = query(
    collection(db, COLLECTION, reclamacaoId, "comentarios"),
    orderBy("criadoEm", "asc")
  );
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(items);
  });
}


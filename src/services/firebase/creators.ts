import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
  type Timestamp,
} from "firebase/firestore";
import { db } from "./config";

export type CreatorStatus = "rascunho" | "pendente_aprovacao" | "ativo" | "suspenso";

export interface CreatorExternalLink {
  titulo: string;
  url: string;
}

export interface CreatorProfile {
  id: string;
  userId: string;
  slug: string;
  nomePublico: string;
  bioCurta: string;
  bioCompleta?: string;
  avatarUrl?: string;
  capaUrl?: string;
  cidade?: string;
  estado?: string;
  categorias?: string[];
  tema?: {
    corPrimaria?: string;
    corSecundaria?: string;
    corDestaque?: string;
    logoUrlOpcional?: string;
  };
  redesSociais?: Record<string, string>;
  linksExternos?: CreatorExternalLink[];
  roteiroCuradoria?: string;
  favoritos?: string[];
  status: CreatorStatus;
  verificado?: boolean;
  destaque?: boolean;
  metricas?: Record<string, number>;
  criadoEm?: Timestamp | null;
  atualizadoEm?: Timestamp | null;
}

const COLLECTION = "creators";

export const SLUGS_RESERVADOS = [
  "admin",
  "api",
  "cadastro",
  "criador",
  "empresa",
  "login",
  "mapa",
  "parceiro",
  "representante",
  "sobre",
  "termos",
  "usuario",
];

function normalizarSlug(slug: string) {
  return slug
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function docToCreatorProfile(id: string, data: any): CreatorProfile {
  return {
    id,
    userId: data.userId ?? "",
    slug: data.slug ?? "",
    nomePublico: data.nomePublico ?? "",
    bioCurta: data.bioCurta ?? "",
    bioCompleta: data.bioCompleta ?? "",
    avatarUrl: data.avatarUrl ?? "",
    capaUrl: data.capaUrl ?? "",
    cidade: data.cidade ?? "",
    estado: data.estado ?? "",
    categorias: data.categorias ?? [],
    tema: data.tema ?? {},
    redesSociais: data.redesSociais ?? {},
    linksExternos: data.linksExternos ?? [],
    roteiroCuradoria: data.roteiroCuradoria ?? "",
    favoritos: data.favoritos ?? [],
    status: data.status ?? "rascunho",
    verificado: data.verificado ?? false,
    destaque: data.destaque ?? false,
    metricas: data.metricas ?? {},
    criadoEm: data.criadoEm ?? null,
    atualizadoEm: data.atualizadoEm ?? null,
  };
}

export async function validarSlugCriador(slug: string, creatorIdToIgnore?: string): Promise<string> {
  const slugNormalizado = normalizarSlug(slug);

  if (!slugNormalizado) {
    throw new Error("Slug invalido.");
  }

  if (SLUGS_RESERVADOS.includes(slugNormalizado)) {
    throw new Error("Este slug e reservado pela plataforma.");
  }

  const q = query(collection(db, COLLECTION), where("slug", "==", slugNormalizado), limit(1));
  const snap = await getDocs(q);

  if (!snap.empty && snap.docs[0].id !== creatorIdToIgnore) {
    throw new Error("Este slug ja esta em uso.");
  }

  return slugNormalizado;
}

export async function criarPerfilCriador(
  userId: string,
  data: Omit<CreatorProfile, "id" | "userId" | "slug" | "status" | "criadoEm" | "atualizadoEm"> & {
    slug: string;
    status?: CreatorStatus;
  }
): Promise<string> {
  const creatorRef = doc(collection(db, COLLECTION));
  const slug = await validarSlugCriador(data.slug);

  await setDoc(creatorRef, {
    userId,
    slug,
    nomePublico: data.nomePublico,
    bioCurta: data.bioCurta,
    bioCompleta: data.bioCompleta ?? "",
    avatarUrl: data.avatarUrl ?? "",
    capaUrl: data.capaUrl ?? "",
    cidade: data.cidade ?? "",
    estado: data.estado ?? "",
    categorias: data.categorias ?? [],
    tema: data.tema ?? {},
    redesSociais: data.redesSociais ?? {},
    linksExternos: data.linksExternos ?? [],
    roteiroCuradoria: data.roteiroCuradoria ?? "",
    favoritos: data.favoritos ?? [],
    status: data.status ?? "pendente_aprovacao",
    verificado: data.verificado ?? false,
    destaque: data.destaque ?? false,
    metricas: data.metricas ?? {},
    criadoEm: serverTimestamp(),
    atualizadoEm: serverTimestamp(),
  });

  return creatorRef.id;
}

export async function atualizarPerfilCriador(
  creatorId: string,
  data: Partial<Omit<CreatorProfile, "id" | "userId" | "criadoEm" | "atualizadoEm">>
): Promise<void> {
  const payload: Record<string, unknown> = {
    ...data,
    atualizadoEm: serverTimestamp(),
  };

  if (typeof data.slug === "string") {
    payload.slug = await validarSlugCriador(data.slug, creatorId);
  }

  await setDoc(doc(db, COLLECTION, creatorId), payload, { merge: true });
}

export async function obterCriadorPorSlug(slug: string): Promise<CreatorProfile | null> {
  const slugNormalizado = normalizarSlug(slug);
  const q = query(collection(db, COLLECTION), where("slug", "==", slugNormalizado), limit(1));
  const snap = await getDocs(q);

  if (snap.empty) return null;

  const creatorDoc = snap.docs[0];
  return docToCreatorProfile(creatorDoc.id, creatorDoc.data());
}

export async function obterCriadorPorId(id: string): Promise<CreatorProfile | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return docToCreatorProfile(snap.id, snap.data());
}

export async function obterCriadorPorUserId(userId: string): Promise<CreatorProfile | null> {
  const q = query(collection(db, COLLECTION), where("userId", "==", userId), limit(1));
  const snap = await getDocs(q);

  if (snap.empty) return null;

  const creatorDoc = snap.docs[0];
  return docToCreatorProfile(creatorDoc.id, creatorDoc.data());
}

export async function listarCriadores(status?: CreatorStatus): Promise<CreatorProfile[]> {
  const constraints = [] as any[];

  if (status) {
    constraints.push(where("status", "==", status));
  }

  constraints.push(orderBy("nomePublico", "asc"));

  const q = query(collection(db, COLLECTION), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((creatorDoc) => docToCreatorProfile(creatorDoc.id, creatorDoc.data()));
}

export async function aprovarCriador(creatorId: string): Promise<void> {
  await setDoc(doc(db, COLLECTION, creatorId), {
    status: "ativo",
    atualizadoEm: serverTimestamp(),
  }, { merge: true });
}

export async function suspenderCriador(creatorId: string): Promise<void> {
  await setDoc(doc(db, COLLECTION, creatorId), {
    status: "suspenso",
    atualizadoEm: serverTimestamp(),
  }, { merge: true });
}

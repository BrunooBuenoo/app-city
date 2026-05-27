import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  where,
  type Timestamp,
} from "firebase/firestore";
import { db } from "./config";
import { listarCriadores, type CreatorProfile } from "./creators";
import { listarEstabelecimentos, type Estabelecimento } from "./estabelecimentos";

export type CreatorEstablishmentStatus = "pendente" | "ativo" | "rejeitado" | "removido";

export interface CreatorEstablishmentLink {
  id: string;
  creatorId: string;
  establishmentId: string;
  status: CreatorEstablishmentStatus;
  ordem?: number;
  destaque?: boolean;
  observacaoCuradoria?: string;
  origem?: "solicitado_pelo_criador" | "convidado_pela_plataforma" | "parceria_comercial";
  criadoEm?: Timestamp | null;
  atualizadoEm?: Timestamp | null;
}

const COLLECTION = "creator_establishments";

function docToLink(id: string, data: any): CreatorEstablishmentLink {
  return {
    id,
    creatorId: data.creatorId ?? "",
    establishmentId: data.establishmentId ?? "",
    status: data.status ?? "pendente",
    ordem: data.ordem ?? 0,
    destaque: data.destaque ?? false,
    observacaoCuradoria: data.observacaoCuradoria ?? "",
    origem: data.origem ?? "solicitado_pelo_criador",
    criadoEm: data.criadoEm ?? null,
    atualizadoEm: data.atualizadoEm ?? null,
  };
}

export async function solicitarVinculoCriadorEstabelecimento(
  creatorId: string,
  establishmentId: string,
  data?: Partial<Omit<CreatorEstablishmentLink, "id" | "creatorId" | "establishmentId" | "status" | "criadoEm" | "atualizadoEm">>
): Promise<string> {
  const existing = query(
    collection(db, COLLECTION),
    where("creatorId", "==", creatorId),
    where("establishmentId", "==", establishmentId),
    limit(1)
  );
  const existingSnap = await getDocs(existing);

  if (!existingSnap.empty) {
    const linkRef = existingSnap.docs[0].ref;
    await setDoc(linkRef, {
      status: "pendente",
      ordem: data?.ordem ?? 0,
      destaque: data?.destaque ?? false,
      observacaoCuradoria: data?.observacaoCuradoria ?? "",
      origem: data?.origem ?? "solicitado_pelo_criador",
      atualizadoEm: serverTimestamp(),
    }, { merge: true });
    return linkRef.id;
  }

  const linkRef = doc(collection(db, COLLECTION));
  await setDoc(linkRef, {
    creatorId,
    establishmentId,
    status: "pendente",
    ordem: data?.ordem ?? 0,
    destaque: data?.destaque ?? false,
    observacaoCuradoria: data?.observacaoCuradoria ?? "",
    origem: data?.origem ?? "solicitado_pelo_criador",
    criadoEm: serverTimestamp(),
    atualizadoEm: serverTimestamp(),
  });

  return linkRef.id;
}

export async function aprovarVinculoCriadorEstabelecimento(linkId: string): Promise<void> {
  await setDoc(doc(db, COLLECTION, linkId), {
    status: "ativo",
    atualizadoEm: serverTimestamp(),
  }, { merge: true });
}

export async function rejeitarVinculoCriadorEstabelecimento(linkId: string): Promise<void> {
  await setDoc(doc(db, COLLECTION, linkId), {
    status: "rejeitado",
    atualizadoEm: serverTimestamp(),
  }, { merge: true });
}

export async function removerVinculoCriadorEstabelecimento(linkId: string): Promise<void> {
  await setDoc(doc(db, COLLECTION, linkId), {
    status: "removido",
    atualizadoEm: serverTimestamp(),
  }, { merge: true });
}

export async function atualizarCuradoriaCriadorEstabelecimento(
  linkId: string,
  data: Partial<Pick<CreatorEstablishmentLink, "ordem" | "destaque" | "observacaoCuradoria">>
): Promise<void> {
  await setDoc(doc(db, COLLECTION, linkId), {
    ...data,
    atualizadoEm: serverTimestamp(),
  }, { merge: true });
}

export async function listarEstabelecimentosDoCriador(creatorId: string): Promise<CreatorEstablishmentLink[]> {
  const q = query(collection(db, COLLECTION), where("creatorId", "==", creatorId));
  const snap = await getDocs(q);
  return snap.docs
    .map((linkDoc) => docToLink(linkDoc.id, linkDoc.data()))
    .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
}

export async function listarVinculosCriadorEstabelecimento(
  status?: CreatorEstablishmentStatus
): Promise<CreatorEstablishmentLink[]> {
  const constraints = [] as any[];

  if (status) {
    constraints.push(where("status", "==", status));
  }

  const q = query(collection(db, COLLECTION), ...constraints);
  const snap = await getDocs(q);
  return snap.docs
    .map((linkDoc) => docToLink(linkDoc.id, linkDoc.data()))
    .sort((a, b) => {
      const timeA = a.criadoEm?.toMillis?.() ?? 0;
      const timeB = b.criadoEm?.toMillis?.() ?? 0;
      return timeB - timeA;
    });
}

export async function listarCriadoresDoEstabelecimento(establishmentId: string): Promise<CreatorEstablishmentLink[]> {
  const q = query(collection(db, COLLECTION), where("establishmentId", "==", establishmentId));
  const snap = await getDocs(q);
  return snap.docs.map((linkDoc) => docToLink(linkDoc.id, linkDoc.data()));
}

export async function listarCriadoresAtivosDoEstabelecimento(establishmentId: string): Promise<CreatorLinkWithCreator[]> {
  const [links, creators] = await Promise.all([
    listarCriadoresDoEstabelecimento(establishmentId),
    listarCriadores("ativo"),
  ]);

  const creatorsPorId = new Map(creators.map((creator) => [creator.id, creator]));

  return links
    .filter((link) => link.status === "ativo")
    .map((link) => ({
      ...link,
      creator: creatorsPorId.get(link.creatorId),
    }))
    .filter((link): link is CreatorLinkWithCreator & { creator: CreatorProfile } => Boolean(link.creator))
    .sort((a, b) => {
      if ((a.destaque ?? false) !== (b.destaque ?? false)) {
        return a.destaque ? -1 : 1;
      }

      return (a.ordem ?? 0) - (b.ordem ?? 0);
    });
}

export async function listarEstabelecimentosAtivosDoCriador(creatorId: string): Promise<CreatorLinkWithEstablishment[]> {
  const [links, estabelecimentos] = await Promise.all([
    listarEstabelecimentosDoCriador(creatorId),
    listarEstabelecimentos({ status: "ativo" }),
  ]);

  const estabelecimentosPorId = new Map(estabelecimentos.map((estabelecimento) => [estabelecimento.id, estabelecimento]));

  return links
    .filter((link) => link.status === "ativo")
    .map((link) => ({
      ...link,
      establishment: estabelecimentosPorId.get(link.establishmentId),
    }))
    .filter((link): link is CreatorLinkWithEstablishment & { establishment: Estabelecimento } => Boolean(link.establishment))
    .sort((a, b) => {
      if ((a.destaque ?? false) !== (b.destaque ?? false)) {
        return a.destaque ? -1 : 1;
      }

      return (a.ordem ?? 0) - (b.ordem ?? 0);
    });
}

export async function listarVinculosDetalhadosCriadorEstabelecimento(
  status?: CreatorEstablishmentStatus
): Promise<(CreatorEstablishmentLink & { creator?: CreatorProfile; establishment?: Estabelecimento })[]> {
  const [links, creators, estabelecimentos] = await Promise.all([
    listarVinculosCriadorEstabelecimento(status),
    listarCriadores(),
    listarEstabelecimentos(),
  ]);

  const creatorsPorId = new Map(creators.map((creator) => [creator.id, creator]));
  const estabelecimentosPorId = new Map(estabelecimentos.map((estabelecimento) => [estabelecimento.id, estabelecimento]));

  return links.map((link) => ({
    ...link,
    creator: creatorsPorId.get(link.creatorId),
    establishment: estabelecimentosPorId.get(link.establishmentId),
  }));
}

export type CreatorLinkWithCreator = CreatorEstablishmentLink & {
  creator?: CreatorProfile;
};

export type CreatorLinkWithEstablishment = CreatorEstablishmentLink & {
  establishment?: Estabelecimento;
};

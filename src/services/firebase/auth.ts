import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { auth, db, googleProvider } from "./config";
import { calcularNivel } from "@/utils/gamification";

// ----- Auth Operations -----

export async function signInWithGoogle(forceAdmin?: boolean): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Verifica se o perfil já existe no Firestore
  const profileRef = doc(db, "users", user.uid);
  const profileSnap = await getDoc(profileRef);

  /**
   * NOTA DE SEGURANÇA: A detecção de admin por email (contains "admin") é um mecanismo
   * temporário para desenvolvimento. Em produção, isso DEVE ser substituído por:
   * - Firebase Custom Claims (via Admin SDK no backend)
   * - Ou uma lista de emails admin no Firestore protegida por regras de segurança
   *
   * O checkbox "Entrar como Administrador" na tela de login apenas seta `forceAdmin=true`,
   * mas a verdadeira proteção está nas Firestore Rules que verificam `role == "admin"`.
   */
  const shouldBeAdmin = forceAdmin || user.email?.toLowerCase().includes("admin");

  if (!profileSnap.exists()) {
    // Cria o perfil base (preenchido via Google)
    await setDoc(profileRef, {
      uid: user.uid,
      nome: user.displayName || "",
      email: user.email || "",
      foto: user.photoURL || "",
      telefone: "",
      faixaEtaria: "",
      genero: "",
      perfilCompleto: shouldBeAdmin ? true : false,
      role: shouldBeAdmin ? "admin" : "usuario", // "usuario" | "admin"
      pontos: 0,
      nivel: "Cidadão Observador",
      interacoesCount: 0,
      criadoEm: serverTimestamp(),
      atualizadoEm: serverTimestamp(),
    });
  } else if (shouldBeAdmin) {
    // Atualiza papel para admin
    await setDoc(profileRef, {
      role: "admin",
      perfilCompleto: true,
      atualizadoEm: serverTimestamp(),
    }, { merge: true });
  }

  return user;
}

export async function signOutUser(): Promise<void> {
  await firebaseSignOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// ----- Profile Operations -----

export interface UserProfile {
  uid: string;
  nome: string;
  email: string;
  foto: string;
  telefone: string;
  faixaEtaria: string;
  genero: string;
  perfilCompleto: boolean;
  role: "usuario" | "admin";
  pontos?: number;
  nivel?: string;
  interacoesCount?: number;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

export async function updateUserProfile(
  uid: string,
  data: Partial<UserProfile>
): Promise<void> {
  await setDoc(
    doc(db, "users", uid),
    { ...data, atualizadoEm: serverTimestamp() },
    { merge: true }
  );
}

export async function adicionarPontosUsuario(uid: string, quantidade: number): Promise<void> {
  if (!uid) return;
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return;

    const data = snap.data();
    const pontosAtuais = Math.max(0, (data.pontos ?? 0) + quantidade);
    const interacoes = (data.interacoesCount ?? 0) + (quantidade > 0 ? 1 : 0);
    const nivelInfo = calcularNivel(pontosAtuais);

    await setDoc(userRef, {
      pontos: pontosAtuais,
      nivel: nivelInfo.nome,
      interacoesCount: interacoes,
      atualizadoEm: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.error("Erro ao adicionar pontos ao usuário:", err);
  }
}

export async function obterRankingUsuarios(limiteRanking: number = 20): Promise<UserProfile[]> {
  try {
    const q = query(
      collection(db, "users"),
      orderBy("pontos", "desc"),
      limit(limiteRanking)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as UserProfile);
  } catch (err) {
    console.error("Erro ao obter ranking:", err);
    return [];
  }
}

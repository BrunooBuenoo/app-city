import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "./config";

// ----- Auth Operations -----

export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Verifica se o perfil já existe no Firestore
  const profileRef = doc(db, "users", user.uid);
  const profileSnap = await getDoc(profileRef);

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
      perfilCompleto: false,
      role: "usuario", // "usuario" | "admin"
      criadoEm: serverTimestamp(),
      atualizadoEm: serverTimestamp(),
    });
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

export { auth, db, storage, googleProvider } from "./config";
export {
  signInWithGoogle,
  signOutUser,
  onAuthChange,
  getUserProfile,
  updateUserProfile,
  type UserProfile,
} from "./auth";
export {
  criarReclamacao,
  getReclamacao,
  listarReclamacoes,
  onReclamacoesChange,
  atualizarStatus,
  getTimeline,
  votar,
  uploadFotoReclamacao,
  type Reclamacao,
  type TimelineEvent,
} from "./reclamacoes";

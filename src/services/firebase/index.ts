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
  getConcordantes,
  uploadFotoReclamacao,
  adicionarComentario,
  listarComentarios,
  onComentariosChange,
  type Reclamacao,
  type TimelineEvent,
  type Concordante,
  type VotoData,
} from "./reclamacoes";

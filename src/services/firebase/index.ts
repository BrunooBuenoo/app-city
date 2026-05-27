export { auth, db, storage, googleProvider } from "./config";
export {
  signInWithGoogle,
  handleRedirectResult,
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
export {
  obterCategoriasDb,
  salvarCategoriaDb,
  excluirCategoriaDb,
  inicializarCategoriasPadrao,
  type CategoryDb,
} from "./categorias";
export {
  obterRecompensasDb,
  salvarRecompensasDb,
  atualizarPontosUsuarioDb,
  type RecompensasConfig,
} from "./gamificacao";

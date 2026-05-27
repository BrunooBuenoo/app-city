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
  criarEstabelecimento,
  aprovarEstabelecimento,
  rejeitarOuSuspenderEstabelecimento,
  listarEstabelecimentos,
  onEstabelecimentosChange,
  criarCupom,
  alternarStatusCupom,
  listarCupons,
  resgatarCupom,
  validarResgate,
  listarResgatesDoUsuario,
  listarResgatesDoEstabelecimento,
  uploadLogoEstabelecimento,
  type Estabelecimento,
  type Cupom,
  type Resgate,
} from "./estabelecimentos";
export {
  obterCategoriasDb,
  salvarCategoriaDb,
  excluirCategoriaDb,
  inicializarCategoriasPadrao,
  type CategoryDb,
} from "./categorias";


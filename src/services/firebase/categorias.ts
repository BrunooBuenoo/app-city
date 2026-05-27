import { db } from "./config";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  writeBatch,
  query,
  orderBy,
} from "firebase/firestore";
import { Category } from "@/utils/categories";

export interface CategoryDb extends Category {
  subcategorias: string[];
  ordem: number;
}

// Lista padrão de subcategorias ricas comerciais
const SUBCATEGORIAS_PADRAO: Record<string, string[]> = {
  alimentacao: [
    "Restaurante",
    "Cafeteria",
    "Bar/Pub",
    "Pizzaria",
    "Doceria/Confeitaria",
    "Fast Food",
    "Outros",
  ],
  automotivo: [
    "Oficina Mecânica",
    "Lava-Rápido",
    "Autoelétrica",
    "Borracharia",
    "Funilaria e Pintura",
    "Outros",
  ],
  saude_beleza: [
    "Clínica Médica",
    "Consultório Odontológico",
    "Salão de Beleza",
    "Barbearia",
    "Academia/Estúdio",
    "Clínica de Estética",
    "Outros",
  ],
  comercio_varejo: [
    "Loja de Roupas",
    "Calçados",
    "Supermercado/Mercearia",
    "Farmácia",
    "Papelaria",
    "Eletrônicos e Celulares",
    "Outros",
  ],
  educacao_servicos: [
    "Escola/Colégio",
    "Cursos e Treinamentos",
    "Assistência Técnica",
    "Escritório de Advocacia",
    "Contabilidade",
    "Agência de Viagens",
    "Outros",
  ],
};

// Categorias padrão comerciais
const CATEGORIAS_PADRAO: Omit<CategoryDb, "subcategorias">[] = [
  { id: "alimentacao",       label: "Alimentação",        color: "#F59E0B", bgLight: "#FEF3C7", icon: "restaurant", ordem: 1 },
  { id: "automotivo",        label: "Automotivo",         color: "#38BDF8", bgLight: "#E0F2FE", icon: "directions_car", ordem: 2 },
  { id: "saude_beleza",      label: "Saúde & Beleza",     color: "#10B981", bgLight: "#D1FAE5", icon: "spa", ordem: 3 },
  { id: "comercio_varejo",   label: "Comércio & Varejo",  color: "#6366F1", bgLight: "#EEF2FF", icon: "storefront", ordem: 4 },
  { id: "educacao_servicos", label: "Educação & Serviços", color: "#8B5CF6", bgLight: "#F5F3FF", icon: "school", ordem: 5 },
];

/**
 * Realiza a carga inicial das categorias padrão na coleção 'categorias' do Firestore.
 */
export async function inicializarCategoriasPadrao(): Promise<CategoryDb[]> {
  try {
    const batch = writeBatch(db);
    const categoriasCompletas: CategoryDb[] = CATEGORIAS_PADRAO.map((cat) => ({
      ...cat,
      subcategorias: SUBCATEGORIAS_PADRAO[cat.id] || ["Outros"],
    }));

    categoriasCompletas.forEach((cat) => {
      const docRef = doc(db, "categorias", cat.id);
      batch.set(docRef, cat);
    });

    await batch.commit();
    console.log("Carga inicial de categorias comerciais realizada com sucesso!");
    return categoriasCompletas;
  } catch (error) {
    console.error("Erro ao realizar seeding das categorias:", error);
    throw error;
  }
}

/**
 * Obtém todas as categorias da coleção 'categorias' no Firestore.
 * Caso a coleção esteja vazia, realiza a carga inicial padrão automaticamente.
 */
export async function obterCategoriasDb(): Promise<CategoryDb[]> {
  try {
    const categoriasRef = collection(db, "categorias");
    const q = query(categoriasRef, orderBy("ordem", "asc"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("Nenhuma categoria encontrada no Firestore. Iniciando seeding padrão...");
      return await inicializarCategoriasPadrao();
    }

    const categorias: CategoryDb[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      categorias.push({
        id: data.id || docSnap.id,
        label: data.label || "",
        color: data.color || "#64748B",
        bgLight: data.bgLight || "#F1F5F9",
        icon: data.icon || "folder",
        subcategorias: data.subcategorias || ["Outros"],
        ordem: data.ordem !== undefined ? data.ordem : 99,
      } as CategoryDb);
    });

    return categorias;
  } catch (error) {
    console.error("Erro ao carregar categorias do Firestore:", error);
    throw error;
  }
}

/**
 * Adiciona ou atualiza uma categoria no Firestore.
 */
export async function salvarCategoriaDb(categoria: Omit<CategoryDb, "ordem"> & { ordem?: number }): Promise<void> {
  try {
    const docRef = doc(db, "categorias", categoria.id);
    
    // Se a ordem não foi especificada, calcula baseando-se no timestamp ou adiciona ao final
    let ordemFinal = categoria.ordem;
    if (ordemFinal === undefined) {
      const atual = await obterCategoriasDb();
      const maxOrdem = atual.reduce((max, cat) => (cat.ordem > max ? cat.ordem : max), 0);
      ordemFinal = maxOrdem + 1;
    }

    const payload: CategoryDb = {
      id: categoria.id,
      label: categoria.label,
      color: categoria.color,
      bgLight: categoria.bgLight,
      icon: categoria.icon,
      subcategorias: categoria.subcategorias.filter(sub => sub.trim() !== ""),
      ordem: ordemFinal,
    };

    await setDoc(docRef, payload);
    console.log(`Categoria '${categoria.label}' salva com sucesso!`);
  } catch (error) {
    console.error("Erro ao salvar categoria no Firestore:", error);
    throw error;
  }
}

/**
 * Remove uma categoria do Firestore pelo seu ID.
 */
export async function excluirCategoriaDb(id: string): Promise<void> {
  try {
    const docRef = doc(db, "categorias", id);
    await deleteDoc(docRef);
    console.log(`Categoria de ID '${id}' excluída com sucesso!`);
  } catch (error) {
    console.error("Erro ao excluir categoria do Firestore:", error);
    throw error;
  }
}


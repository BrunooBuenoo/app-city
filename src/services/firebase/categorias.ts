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

// Lista padrão de subcategorias ricas (extraídas do formulário de nova reclamação)
const SUBCATEGORIAS_PADRAO: Record<string, string[]> = {
  saude: [
    "Demora no atendimento",
    "Falta de médicos",
    "Falta de remédios",
    "Unidade de saúde precária",
    "Equipamentos quebrados",
    "Atendimento desumano",
    "Outros",
  ],
  transporte: [
    "Ônibus atrasado",
    "Ponto de ônibus quebrado",
    "Transporte lotado",
    "Falta de acessibilidade",
    "Sinalização ruim",
    "Trânsito excessivo",
    "Outros",
  ],
  infraestrutura: [
    "Buraco na rua",
    "Calçada quebrada",
    "Praça abandonada",
    "Asfalto deteriorado",
    "Ponte danificada",
    "Falta de manutenção pública",
    "Outros",
  ],
  seguranca: [
    "Área perigosa",
    "Falta de policiamento",
    "Vandalismo",
    "Furto/roubo frequente",
    "Terreno abandonado",
    "Ponto de tráfico",
    "Outros",
  ],
  educacao: [
    "Escola danificada",
    "Falta de professores",
    "Merenda ruim",
    "Sala sem estrutura",
    "Falta de materiais",
    "Transporte escolar ruim",
    "Outros",
  ],
  limpeza: [
    "Coleta de Lixo",
    "Entulho irregular",
    "Coleta atrasada",
    "Terreno sujo",
    "Rua sem limpeza",
    "Bueiro entupido",
    "Outros",
  ],
  meio_ambiente: [
    "Queimada",
    "Árvore caída",
    "Desmatamento",
    "Poluição",
    "Maus-tratos animais",
    "Descarte irregular",
    "Outros",
  ],
  iluminacao: [
    "Poste apagado",
    "Poste piscando",
    "Fiação exposta",
    "Poste danificado",
    "Rua escura",
    "Curto elétrico",
    "Outros",
  ],
  saneamento: [
    "Esgoto aberto",
    "Vazamento de água",
    "Mau cheiro",
    "Enchente",
    "Água contaminada",
    "Cano rompido",
    "Outros",
  ],
  bem_estar_animal: [
    "Animal abandonado",
    "Maus-tratos",
    "Animal ferido",
    "Animal perdido",
    "Falta de resgate",
    "Carcaça na rua",
    "Outros",
  ],
};

// Categorias padrão originais
const CATEGORIAS_PADRAO: Omit<CategoryDb, "subcategorias">[] = [
  { id: "saude",            label: "Saúde",              color: "#EF4444", bgLight: "#FEE2E2", icon: "medical_services", ordem: 1 },
  { id: "transporte",       label: "Transporte",         color: "#3B82F6", bgLight: "#EFF6FF", icon: "directions_bus",    ordem: 2 },
  { id: "infraestrutura",   label: "Infraestrutura",     color: "#F59E0B", bgLight: "#FEF3C7", icon: "construction",      ordem: 3 },
  { id: "seguranca",        label: "Segurança",          color: "#1E3A8A", bgLight: "#E0E7FF", icon: "security",          ordem: 4 },
  { id: "educacao",         label: "Educação",           color: "#8B5CF6", bgLight: "#F5F3FF", icon: "school",            ordem: 5 },
  { id: "limpeza",          label: "Limpeza Urbana",     color: "#10B981", bgLight: "#D1FAE5", icon: "delete",            ordem: 6 },
  { id: "meio_ambiente",    label: "Meio Ambiente",      color: "#22C55E", bgLight: "#E8F5E9", icon: "eco",               ordem: 7 },
  { id: "iluminacao",       label: "Iluminação Pública", color: "#FACC15", bgLight: "#FEF9C3", icon: "lightbulb",         ordem: 8 },
  { id: "saneamento",       label: "Saneamento",         color: "#06B6D4", bgLight: "#E0F7FA", icon: "water_drop",         ordem: 9 },
  { id: "bem_estar_animal", label: "Bem-estar Animal",   color: "#EC4899", bgLight: "#FCE7F3", icon: "pets",              ordem: 10 },
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
    console.log("Carga inicial de categorias realizada com sucesso!");
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

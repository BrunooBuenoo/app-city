import { useState, useEffect, useCallback } from "react";
import { obterCategoriasDb, type CategoryDb } from "@/services/firebase";
import { CATEGORIES } from "@/utils/categories";

// Lista padrão estática com subcategorias para inicialização do Fallback se o localStorage estiver vazio
const CATEGORIES_FALLBACK: CategoryDb[] = CATEGORIES.map((cat, index) => {
  // Mapeia as subcategorias estáticas clássicas
  const subcats: Record<string, string[]> = {
    saude: ["Demora no atendimento", "Falta de médicos", "Falta de remédios", "Unidade de saúde precária", "Equipamentos quebrados", "Atendimento desumano", "Outros"],
    transporte: ["Ônibus atrasado", "Ponto de ônibus quebrado", "Transporte lotado", "Falta de acessibilidade", "Sinalização ruim", "Trânsito excessivo", "Outros"],
    infraestrutura: ["Buraco na rua", "Calçada quebrada", "Praça abandonada", "Asfalto deteriorado", "Ponte danificada", "Falta de manutenção pública", "Outros"],
    seguranca: ["Área perigosa", "Falta de policiamento", "Vandalismo", "Furto/roubo frequente", "Terreno abandonado", "Ponto de tráfico", "Outros"],
    educacao: ["Escola danificada", "Falta de professores", "Merenda ruim", "Sala sem estrutura", "Falta de materiais", "Transporte escolar ruim", "Outros"],
    limpeza: ["Coleta de Lixo", "Entulho irregular", "Coleta atrasada", "Terreno sujo", "Rua sem limpeza", "Bueiro entupido", "Outros"],
    meio_ambiente: ["Queimada", "Árvore caída", "Desmatamento", "Poluição", "Maus-tratos animais", "Descarte irregular", "Outros"],
    iluminacao: ["Poste apagado", "Poste piscando", "Fiação exposta", "Poste danificado", "Rua escura", "Curto elétrico", "Outros"],
    saneamento: ["Esgoto aberto", "Vazamento de água", "Mau cheiro", "Enchente", "Água contaminada", "Cano rompido", "Outros"],
    bem_estar_animal: ["Animal abandonado", "Maus-tratos", "Animal ferido", "Animal perdido", "Falta de resgate", "Carcaça na rua", "Outros"],
  };

  return {
    ...cat,
    subcategorias: subcats[cat.id] || ["Outros"],
    ordem: index + 1,
  };
});

const STORAGE_KEY = "navegandosp_categorias_cache";

export function useCategorias() {
  const [categorias, setCategorias] = useState<CategoryDb[]>(() => {
    // 1. Tenta inicializar com dados salvos no localStorage (SWR - Stale)
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          return JSON.parse(cached);
        }
      } catch (e) {
        console.error("Erro ao carregar categorias do localStorage:", e);
      }
    }
    // 2. Se não houver cache, usa as categorias estáticas locais (resiliência)
    return CATEGORIES_FALLBACK;
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Função para buscar dados frescos do Firestore
  const carregarCategoriasFrescas = useCallback(async (silencioso = false) => {
    if (!silencioso) setIsLoading(true);
    try {
      const frescas = await obterCategoriasDb();
      setCategorias(frescas);
      setError(null);
      
      // Atualiza o cache do localStorage para os próximos acessos
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(frescas));
      }
    } catch (err) {
      console.error("Falha ao atualizar categorias do banco. Usando dados locais/em cache:", err);
      setError(err instanceof Error ? err : new Error("Erro desconhecido"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Busca automática na montagem do componente
  useEffect(() => {
    carregarCategoriasFrescas(true);
  }, [carregarCategoriasFrescas]);

  // Auxiliar: busca categoria por ID de forma síncrona
  const obterCategoriaPorId = useCallback((id: string) => {
    return categorias.find((cat) => cat.id === id);
  }, [categorias]);

  // Auxiliar: busca categoria por nome/label de forma síncrona
  const obterCategoriaPorLabel = useCallback((label: string) => {
    if (!label) return undefined;
    const normalizedLabel = label.toLowerCase().trim();
    return categorias.find(
      (cat) =>
        cat.label.toLowerCase() === normalizedLabel ||
        cat.id.toLowerCase() === normalizedLabel ||
        (normalizedLabel === "limpeza" && cat.id === "limpeza") ||
        (normalizedLabel === "iluminação" && cat.id === "iluminacao")
    );
  }, [categorias]);

  // Auxiliar: mapeia id para subcategorias de forma síncrona (compatível com Record<string, string[]>)
  const mapearSubcategorias = useCallback((): Record<string, string[]> => {
    const mapa: Record<string, string[]> = {};
    categorias.forEach((cat) => {
      mapa[cat.id] = cat.subcategorias;
    });
    return mapa;
  }, [categorias]);

  return {
    categorias,
    subcategoriasMap: mapearSubcategorias(),
    isLoading,
    error,
    refresh: () => carregarCategoriasFrescas(false),
    obterCategoriaPorId,
    obterCategoriaPorLabel,
  };
}

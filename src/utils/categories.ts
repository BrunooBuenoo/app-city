// Mapa centralizado de categorias com cores, ícones e labels
// Usado nos pins do mapa, formulário de reclamação e cards

export interface Category {
  id: string;
  label: string;
  color: string;       // cor principal (pin + badge)
  bgLight: string;     // fundo claro (cards, badges)
  icon: string;        // Material Symbols Outlined icon name
}

export const CATEGORIES: Category[] = [
  { id: "saude",            label: "Saúde",              color: "#EF4444", bgLight: "#FEE2E2", icon: "medical_services" },
  { id: "transporte",       label: "Transporte",         color: "#3B82F6", bgLight: "#EFF6FF", icon: "directions_bus" },
  { id: "infraestrutura",   label: "Infraestrutura",     color: "#F59E0B", bgLight: "#FEF3C7", icon: "construction" },
  { id: "seguranca",        label: "Segurança",          color: "#1E3A8A", bgLight: "#E0E7FF", icon: "security" },
  { id: "educacao",         label: "Educação",           color: "#8B5CF6", bgLight: "#F5F3FF", icon: "school" },
  { id: "limpeza",          label: "Limpeza Urbana",     color: "#10B981", bgLight: "#D1FAE5", icon: "delete" },
  { id: "meio_ambiente",    label: "Meio Ambiente",      color: "#22C55E", bgLight: "#E8F5E9", icon: "eco" },
  { id: "iluminacao",       label: "Iluminação Pública", color: "#FACC15", bgLight: "#FEF9C3", icon: "lightbulb" },
  { id: "saneamento",       label: "Saneamento",         color: "#06B6D4", bgLight: "#E0F7FA", icon: "water_drop" },
  { id: "bem_estar_animal", label: "Bem-estar Animal",   color: "#EC4899", bgLight: "#FCE7F3", icon: "pets" },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((cat) => [cat.id, cat])
);

export function getCategoryByLabel(label: string): Category | undefined {
  if (!label) return undefined;
  
  // Normalização para comparar de forma mais flexível
  const normalizedLabel = label.toLowerCase().trim();
  
  return CATEGORIES.find(
    (cat) => 
      cat.label.toLowerCase() === normalizedLabel || 
      cat.id.toLowerCase() === normalizedLabel ||
      // Casos específicos de mapeamento
      (normalizedLabel === "limpeza" && cat.id === "limpeza") ||
      (normalizedLabel === "iluminação" && cat.id === "iluminacao")
  );
}

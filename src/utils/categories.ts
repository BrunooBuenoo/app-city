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
  { id: "saude",          label: "Saúde",          color: "#EF4444", bgLight: "#FEE2E2", icon: "medical_services" },
  { id: "transporte",     label: "Transporte",     color: "#F59E0B", bgLight: "#FEF3C7", icon: "directions_bus" },
  { id: "infraestrutura", label: "Infraestrutura", color: "#1a8ccc", bgLight: "#E8F2F8", icon: "construction" },
  { id: "seguranca",      label: "Segurança",      color: "#8B5CF6", bgLight: "#EDE9FE", icon: "security" },
  { id: "educacao",       label: "Educação",       color: "#3B82F6", bgLight: "#DBEAFE", icon: "school" },
  { id: "limpeza",        label: "Limpeza",        color: "#10B981", bgLight: "#D1FAE5", icon: "delete" },
  { id: "meio_ambiente",  label: "Meio Ambiente",  color: "#059669", bgLight: "#A7F3D0", icon: "eco" },
  { id: "iluminacao",     label: "Iluminação",     color: "#D97706", bgLight: "#FDE68A", icon: "lightbulb" },
  { id: "saneamento",     label: "Saneamento",     color: "#0891B2", bgLight: "#CFFAFE", icon: "water_drop" },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((cat) => [cat.id, cat])
);

export function getCategoryByLabel(label: string): Category | undefined {
  return CATEGORIES.find(
    (cat) => cat.label.toLowerCase() === label.toLowerCase()
  );
}

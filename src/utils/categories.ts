// Mapa centralizado de categorias com cores, ícones e labels
// Usado nos pins do mapa, formulários e cards

export interface Category {
  id: string;
  label: string;
  color: string;       // cor principal (pin + badge)
  bgLight: string;     // fundo claro (cards, badges)
  icon: string;        // Material Symbols Outlined icon name
}

export const CATEGORIES: Category[] = [
  { id: "alimentacao",       label: "Alimentação",        color: "#F59E0B", bgLight: "#FEF3C7", icon: "restaurant" },
  { id: "automotivo",        label: "Automotivo",         color: "#38BDF8", bgLight: "#E0F2FE", icon: "directions_car" },
  { id: "saude_beleza",      label: "Saúde & Beleza",     color: "#10B981", bgLight: "#D1FAE5", icon: "spa" },
  { id: "comercio_varejo",   label: "Comércio & Varejo",  color: "#6366F1", bgLight: "#EEF2FF", icon: "storefront" },
  { id: "educacao_servicos", label: "Educação & Serviços", color: "#8B5CF6", bgLight: "#F5F3FF", icon: "school" },
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
      (normalizedLabel.includes("aliment") && cat.id === "alimentacao") ||
      (normalizedLabel.includes("auto") && cat.id === "automotivo") ||
      ((normalizedLabel.includes("saude") || normalizedLabel.includes("beleza")) && cat.id === "saude_beleza") ||
      ((normalizedLabel.includes("comercio") || normalizedLabel.includes("varejo")) && cat.id === "comercio_varejo") ||
      ((normalizedLabel.includes("educa") || normalizedLabel.includes("servi")) && cat.id === "educacao_servicos")
  );
}


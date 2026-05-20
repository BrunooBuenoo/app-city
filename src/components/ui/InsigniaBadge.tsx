import React from "react";

export type NivelId = "observador" | "iniciante" | "colaborador" | "bronze" | "prata" | "ouro" | "lendario";

interface InsigniaBadgeProps {
  nivelId: NivelId | string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
}

export default function InsigniaBadge({ nivelId, size = "md", showText = false, className = "" }: InsigniaBadgeProps) {
  const nid = (nivelId || "observador").toLowerCase().trim() as NivelId;

  // Configuração visual para cada nível
  const configMap: Record<NivelId, {
    label: string;
    badgeStyle: string;
  }> = {
    observador: {
      label: "Ovo de Dino",
      badgeStyle: "bg-slate-100 text-slate-600 border-slate-200",
    },
    iniciante: {
      label: "Dino Bebê",
      badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
    colaborador: {
      label: "Dino Explorador",
      badgeStyle: "bg-sky-50 text-sky-700 border-sky-100",
    },
    bronze: {
      label: "Dino de Bronze",
      badgeStyle: "bg-amber-50 text-amber-800 border-amber-200",
    },
    prata: {
      label: "Dino de Prata",
      badgeStyle: "bg-zinc-100 text-zinc-800 border-zinc-200",
    },
    ouro: {
      label: "Dino de Ouro",
      badgeStyle: "bg-yellow-50 text-yellow-800 border-yellow-200",
    },
    lendario: {
      label: "Titanossauro Lendário",
      badgeStyle: "bg-purple-50 text-purple-800 border-purple-200",
    },
  };

  const current = configMap[nid] || configMap.observador;

  // Dimensões da imagem 3D com base no size
  const dims = {
    sm: { box: "w-7 h-7", textStyle: "text-[9px] px-1.5 py-0.5 rounded-md" },
    md: { box: "w-10 h-10", textStyle: "text-[10px] px-2 py-0.5 rounded-lg" },
    lg: { box: "w-16 h-16", textStyle: "text-xs px-2.5 py-1 rounded-xl" },
    xl: { box: "w-24 h-24", textStyle: "text-sm px-3 py-1.5 rounded-2xl" },
  }[size];

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      {/* Insígnia 3D IA realística com efeito flutuante sutil */}
      <div className={`relative flex items-center justify-center shrink-0 ${dims.box} select-none transform transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer`}>
        <img 
          src={`/insignias/${nid}.png`} 
          alt={current.label} 
          className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)] rounded-full"
        />
      </div>

      {/* Nome do Nível ao lado, se solicitado */}
      {showText && (
        <span className={`font-extrabold border shrink-0 text-center leading-none uppercase tracking-wider ${current.badgeStyle} ${dims.textStyle}`}>
          {current.label}
        </span>
      )}
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";

const themes = [
  { id: "light", label: "Claro", Icon: Sun },
  { id: "dark", label: "Escuro", Icon: Moon },
  { id: "system", label: "Dispositivo", Icon: Monitor },
] as const;

interface ThemeToggleProps {
  /** When true, shows only icon (for collapsed sidebars) */
  compact?: boolean;
}

export default function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className={`flex items-center gap-1 ${compact ? "justify-center" : "px-1"} py-1 rounded-xl`}>
        <div className="w-7 h-7 rounded-lg animate-pulse" style={{ backgroundColor: "var(--color-border)" }} />
      </div>
    );
  }

  if (compact) {
    // Cycle through themes on click
    const currentIndex = themes.findIndex((t) => t.id === theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const CurrentIcon = themes.find((t) => t.id === theme)?.Icon || Monitor;

    return (
      <button
        onClick={() => setTheme(themes[nextIndex].id)}
        className="flex items-center justify-center w-9 h-9 rounded-xl transition-colors cursor-pointer"
        style={{
          backgroundColor: "var(--color-bg-alt)",
          color: "var(--color-text-secondary)",
        }}
        title={`Tema: ${themes.find((t) => t.id === theme)?.label || "Sistema"}`}
      >
        <CurrentIcon className="w-4.5 h-4.5" />
      </button>
    );
  }

  return (
    <div
      className="flex items-center gap-0.5 p-1 rounded-xl"
      style={{ backgroundColor: "var(--color-bg-alt)" }}
    >
      {themes.map(({ id, label, Icon }) => {
        const isActive = theme === id;
        return (
          <button
            key={id}
            onClick={() => setTheme(id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer select-none ${
              isActive
                ? "shadow-sm"
                : ""
            }`}
            style={{
              backgroundColor: isActive ? "var(--color-surface)" : "transparent",
              color: isActive ? "var(--color-primary)" : "var(--color-text-muted)",
            }}
            title={label}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

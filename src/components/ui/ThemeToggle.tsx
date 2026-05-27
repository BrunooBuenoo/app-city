"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { flushSync } from "react-dom";

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

  const handleThemeChange = (newTheme: string, event: React.MouseEvent<HTMLButtonElement>) => {
    const supportsTransitions =
      typeof document !== "undefined" &&
      // @ts-ignore
      document.startViewTransition !== undefined &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!supportsTransitions) {
      setTheme(newTheme);
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    document.documentElement.classList.add("theme-transitioning");

    // @ts-ignore
    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setTheme(newTheme);
      });
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 800,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });

    transition.finished.then(() => {
      document.documentElement.classList.remove("theme-transitioning");
    });
  };

  if (compact) {
    // Cycle through themes on click
    const currentIndex = themes.findIndex((t) => t.id === theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const CurrentIcon = themes.find((t) => t.id === theme)?.Icon || Monitor;

    return (
      <button
        onClick={(e) => handleThemeChange(themes[nextIndex].id, e)}
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
            onClick={(e) => handleThemeChange(id, e)}
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

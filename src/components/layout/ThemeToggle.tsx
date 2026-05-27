"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { cn } from "@/lib/utils";

export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

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
          duration: 1200,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });

    transition.finished.then(() => {
      document.documentElement.classList.remove("theme-transitioning");
    });
  };

  return (
    <div className={cn("flex items-center gap-1 p-1 bg-[#FAF7F2] dark:bg-zinc-800 rounded-xl border border-[#E2E8F0] dark:border-zinc-700", className)}>
      <button
        onClick={(e) => handleThemeChange("light", e)}
        className={cn(
          "p-1.5 rounded-lg transition-all flex items-center justify-center cursor-pointer",
          theme === "light" 
            ? "bg-white dark:bg-zinc-700 shadow-sm text-amber-500 dark:text-amber-400" 
            : "text-[#94A3B8] hover:text-[#4A5D70] dark:text-zinc-500 dark:hover:text-zinc-300"
        )}
        title="Tema Claro"
      >
        <Sun className="w-4 h-4" />
      </button>
      
      <button
        onClick={(e) => handleThemeChange("dark", e)}
        className={cn(
          "p-1.5 rounded-lg transition-all flex items-center justify-center cursor-pointer",
          theme === "dark" 
            ? "bg-white dark:bg-zinc-700 shadow-sm text-indigo-500 dark:text-indigo-400" 
            : "text-[#94A3B8] hover:text-[#4A5D70] dark:text-zinc-500 dark:hover:text-zinc-300"
        )}
        title="Tema Escuro"
      >
        <Moon className="w-4 h-4" />
      </button>
      
      <button
        onClick={(e) => handleThemeChange("system", e)}
        className={cn(
          "p-1.5 rounded-lg transition-all flex items-center justify-center cursor-pointer",
          theme === "system" 
            ? "bg-white dark:bg-zinc-700 shadow-sm text-[#1a8ccc] dark:text-[#38bdf8]" 
            : "text-[#94A3B8] hover:text-[#4A5D70] dark:text-zinc-500 dark:hover:text-zinc-300"
        )}
        title="Usar tema do dispositivo"
      >
        <Monitor className="w-4 h-4" />
      </button>
    </div>
  );
}

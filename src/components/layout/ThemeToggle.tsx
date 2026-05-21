"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={cn("flex items-center gap-1 p-1 bg-[#FAF7F2] dark:bg-zinc-800 rounded-xl border border-[#E2E8F0] dark:border-zinc-700", className)}>
      <button
        onClick={() => setTheme("light")}
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
        onClick={() => setTheme("dark")}
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
        onClick={() => setTheme("system")}
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

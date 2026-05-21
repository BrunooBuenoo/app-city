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
    <div className={cn("flex items-center gap-1 p-1 bg-[#FAF7F2] rounded-xl border border-[#E2E8F0]", className)}>
      <button
        onClick={() => setTheme("light")}
        className={cn(
          "p-1.5 rounded-lg transition-all flex items-center justify-center cursor-pointer",
          theme === "light" 
            ? "bg-white shadow-sm text-amber-500" 
            : "text-[#94A3B8] hover:text-[#4A5D70]"
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
            ? "bg-white shadow-sm text-indigo-500" 
            : "text-[#94A3B8] hover:text-[#4A5D70]"
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
            ? "bg-white shadow-sm text-[#1a8ccc]" 
            : "text-[#94A3B8] hover:text-[#4A5D70]"
        )}
        title="Usar tema do dispositivo"
      >
        <Monitor className="w-4 h-4" />
      </button>
    </div>
  );
}

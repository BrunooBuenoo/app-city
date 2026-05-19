"use client";

import React, { useState, useEffect, useCallback, createContext, useContext } from "react";
import { CheckCircle, AlertCircle, Info, X, Bell } from "lucide-react";

type ToastType = "success" | "info" | "warning";

interface ToastData {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  showToast: (type: ToastType, title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}

let toastId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, type, title, message }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const iconMap = {
  success: CheckCircle,
  info: Info,
  warning: AlertCircle,
};

const colorMap = {
  success: { bg: "bg-[#10B981]", ring: "ring-[#10B981]/20" },
  info: { bg: "bg-[#1a8ccc]", ring: "ring-[#1a8ccc]/20" },
  warning: { bg: "bg-[#F59E0B]", ring: "ring-[#F59E0B]/20" },
};

function ToastItem({ toast, onDismiss }: { toast: ToastData; onDismiss: (id: number) => void }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onDismiss(toast.id), 300);
    }, 5000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const Icon = iconMap[toast.type];
  const colors = colorMap[toast.type];

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 max-w-sm bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-[#E2E8F0] p-4 transition-all duration-300 ${
        isVisible
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0"
      }`}
    >
      <div className={`w-9 h-9 rounded-xl ${colors.bg} flex items-center justify-center shrink-0`}>
        <Icon className="w-4.5 h-4.5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#112F4E]">{toast.title}</p>
        {toast.message && (
          <p className="text-xs text-[#4A5D70] mt-0.5 font-light">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onDismiss(toast.id), 300);
        }}
        className="p-1 hover:bg-[#FAF7F2] rounded-lg transition-colors shrink-0"
      >
        <X className="w-3.5 h-3.5 text-[#94A3B8]" />
      </button>
    </div>
  );
}

"use client";

import React, { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminTopAppBar from "@/components/layout/AdminTopAppBar";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoggedIn, loading, profile } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!isLoggedIn) {
      router.replace("/login");
      return;
    }

    if (profile?.funcao !== "admin") {
      router.replace("/usuario/dashboard");
    }
  }, [isLoggedIn, loading, profile, router]);

  if (loading || !isLoggedIn || profile?.funcao !== "admin") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3" style={{ backgroundColor: "var(--color-bg)" }}>
        <Loader2 className="h-8 w-8 animate-spin text-[#1a8ccc]" />
        <p className="text-sm text-slate-500">Validando acesso administrativo...</p>
      </div>
    );
  }

  return (
    <NotificationProvider>
      <div className="flex flex-col h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
        {/* Mobile top bar */}
        <div className="md:hidden">
          <AdminTopAppBar />
        </div>

        <div className="flex flex-1 overflow-hidden">
          <AdminSidebar isExpanded={false} onToggle={() => {}} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <main
              className="flex-1 overflow-y-auto pt-16 md:pt-0"
              style={{ backgroundColor: "var(--color-bg)" }}
            >
              {children}
            </main>
          </div>
        </div>
      </div>
    </NotificationProvider>
  );
}

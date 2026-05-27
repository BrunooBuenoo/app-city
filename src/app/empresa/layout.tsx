"use client";

import React from "react";
import EmpresaSidebar from "@/components/layout/EmpresaSidebar";
import AdminTopAppBar from "@/components/layout/AdminTopAppBar";
import { NotificationProvider } from "@/contexts/NotificationContext";

export default function EmpresaLayout({ children }: { children: React.ReactNode }) {
  return (
    <NotificationProvider>
      <div className="flex flex-col h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
        {/* Mobile top bar */}
        <div className="md:hidden">
          <AdminTopAppBar />
        </div>

        <div className="flex flex-1 overflow-hidden">
          <EmpresaSidebar isExpanded={false} onToggle={() => {}} />
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

"use client";

import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopAppBar from "@/components/layout/TopAppBar";
import BottomNav from "@/components/layout/BottomNav";

export default function UsuarioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
      {/* Mobile top bar */}
      <div className="md:hidden">
        <TopAppBar />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isExpanded={false} onToggle={() => {}} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main
            className="flex-1 overflow-y-auto pt-16 md:pt-0 pb-20 md:pb-0"
            style={{ backgroundColor: "var(--color-bg)" }}
          >
            {children}
          </main>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}

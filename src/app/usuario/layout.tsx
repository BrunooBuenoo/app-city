"use client";

import React, { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopAppBar from "@/components/layout/TopAppBar";
import BottomNav from "@/components/layout/BottomNav";

export default function UsuarioLayout({ children }: { children: React.ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  return (
    <div className="flex flex-col h-screen bg-[#FAF7F2]">
      {/* Mobile top bar */}
      <div className="md:hidden">
        <TopAppBar />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isExpanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded(!sidebarExpanded)}
        />
        <div className="flex-1 flex flex-col overflow-hidden md:p-2 md:pl-0">
          <main className="flex-1 bg-white md:rounded-2xl overflow-y-auto md:shadow-sm pt-16 md:pt-0 pb-20 md:pb-0">
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

"use client";

import React, { useState } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  return (
    <div className="flex flex-col h-screen bg-[#FAF7F2]">
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar
          isExpanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded(!sidebarExpanded)}
        />
        <div className="flex-1 flex flex-col overflow-hidden p-2 pl-0">
          <main className="flex-1 bg-white rounded-2xl overflow-y-auto shadow-sm">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

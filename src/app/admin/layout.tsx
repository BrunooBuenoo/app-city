"use client";

import React, { useState } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminTopAppBar from "@/components/layout/AdminTopAppBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  return (
    <div className="flex flex-col h-screen bg-[#FAF7F2]">
      {/* Mobile top bar */}
      <div className="md:hidden">
        <AdminTopAppBar />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar
          isExpanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded(!sidebarExpanded)}
        />
        <div className="flex-1 flex flex-col overflow-hidden md:p-2 md:pl-0">
          <main className="flex-1 bg-white md:rounded-2xl overflow-y-auto md:shadow-sm pt-16 md:pt-0 pb-4 md:pb-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminTopAppBar from "@/components/layout/AdminTopAppBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#FAF7F2] text-[#112F4E] min-h-screen">
      <AdminSidebar />
      <AdminTopAppBar />
      <main className="ml-64 pt-16 min-h-screen transition-all duration-300 pb-12">
        {children}
      </main>
    </div>
  );
}

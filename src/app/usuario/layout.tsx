import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import TopAppBar from "@/components/layout/TopAppBar";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#FAF7F2] text-[#112F4E] min-h-screen">
      <Sidebar />
      <TopAppBar />
      <main className="md:ml-64 pt-16 pb-20 md:pb-8 min-h-screen">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}

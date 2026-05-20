"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function RedirectNovaReclamacao() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/usuario/reclamacao/nova");
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-3 bg-[#FAF7F2]">
      <Loader2 className="w-8 h-8 text-[#1a8ccc] animate-spin" />
      <p className="text-sm text-[#4A5D70] font-light">Redirecionando...</p>
    </div>
  );
}

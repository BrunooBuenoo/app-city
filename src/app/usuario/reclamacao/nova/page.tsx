"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function NovaReclamacaoRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/usuario/dashboard");
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-[#1a8ccc]" />
      <p className="text-sm font-light text-zinc-500">Redirecionando...</p>
    </div>
  );
}

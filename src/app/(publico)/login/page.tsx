"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, MapPin, Users, ArrowRight } from "lucide-react";
import { signInWithGoogle, getUserProfile } from "@/services/firebase";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const router = useRouter();
  const { isLoggedIn, profile, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [error, setError] = useState("");

  // Se já logado, redireciona
  useEffect(() => {
    if (!loading && isLoggedIn && profile) {
      if (profile.role === "admin") {
        router.push("/admin/dashboard");
      } else if (profile.perfilCompleto) {
        router.push("/usuario/dashboard");
      } else {
        router.push("/completar-perfil");
      }
    }
  }, [loading, isLoggedIn, profile, router]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      const user = await signInWithGoogle(isAdminLogin);
      const userProfile = await getUserProfile(user.uid);
      if (userProfile?.role === "admin") {
        router.push("/admin/dashboard");
      } else if (userProfile?.perfilCompleto) {
        router.push("/usuario/dashboard");
      } else {
        router.push("/completar-perfil");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Não foi possível fazer login. Tente novamente.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--color-bg)" }}>
      {/* Top decorative bar */}
      <div className="w-full h-1.5 bg-gradient-to-r from-[#1a8ccc] via-[#10B981] to-[#F59E0B]" />

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Panel — Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#112F4E] to-[#1a3f6b] p-12 flex-col justify-between relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1a8ccc]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#10B981]/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#1a8ccc] flex items-center justify-center">
                <span className="text-white text-lg font-bold">S</span>
              </div>
              <span className="text-white/80 text-lg font-medium">SAC Marília</span>
            </div>
          </div>

          <div className="relative z-10 space-y-8">
            <h1 className="text-4xl xl:text-5xl font-medium text-white leading-tight">
              Sua voz transforma
              <br />
              <span className="text-[#1a8ccc] italic font-serif">Marília.</span>
            </h1>
            <p className="text-white/60 text-lg font-light max-w-md leading-relaxed">
              Reporte problemas, acompanhe soluções e ajude a construir uma cidade
              melhor para todos os cidadãos.
            </p>

            {/* Feature highlights */}
            <div className="space-y-4 pt-4">
              {[
                { Icon: MapPin, text: "Marque no mapa e reporte em minutos" },
                { Icon: Users, text: "Comunidade valida os relatos" },
                { Icon: Shield, text: "Acompanhe a resolução em tempo real" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <item.Icon className="w-4 h-4 text-[#1a8ccc]" />
                  </div>
                  <span className="text-white/70 text-sm font-light">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <p className="text-white/30 text-xs">
              © 2026 SAC Marília ao Contrário — Prefeitura de Marília
            </p>
          </div>
        </div>

        {/* Right Panel — Login Form */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md space-y-10">
            {/* Mobile logo */}
            <div className="lg:hidden text-center">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#1a8ccc] flex items-center justify-center">
                  <span className="text-white text-lg font-bold">S</span>
                </div>
                <span className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>SAC Marília</span>
              </div>
            </div>

            {/* Header */}
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-3" style={{ color: "var(--color-text)" }}>
                Bem-vindo de volta
              </h2>
              <p className="text-base font-light leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                Entre com sua conta Google para acessar a plataforma e acompanhar suas solicitações.
              </p>
            </div>

            {/* Google Sign-In Button */}
            <div className="space-y-4">
              <label className="flex items-center gap-2.5 px-4 py-3 border rounded-xl cursor-pointer transition-all select-none mb-1" style={{ backgroundColor: "var(--color-bg-alt)", borderColor: "var(--color-border)" }}>
                <input
                  type="checkbox"
                  checked={isAdminLogin}
                  onChange={(e) => setIsAdminLogin(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#1a8ccc] focus:ring-[#1a8ccc] accent-[#1a8ccc] cursor-pointer"
                />
                <span className="text-xs md:text-sm font-semibold" style={{ color: "var(--color-text-secondary)" }}>
                  Entrar como Administrador
                </span>
              </label>

              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 border-2 rounded-2xl font-medium text-base shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none"
                style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-[#1a8ccc] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                )}
                <span>{isLoading ? "Conectando..." : "Entrar com Google"}</span>
              </button>
              {/* Error message */}
              {error && (
                <p className="text-sm text-center text-[#EF4444] bg-[#FEE2E2] px-4 py-2.5 rounded-xl">{error}</p>
              )}

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px" style={{ backgroundColor: "var(--color-border)" }} />
                <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>OU</span>
                <div className="flex-1 h-px" style={{ backgroundColor: "var(--color-border)" }} />
              </div>

              {/* Explore without login */}
              <Link
                href="/"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 border rounded-2xl font-medium text-sm transition-all"
                style={{ backgroundColor: "var(--color-bg-alt)", borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}
              >
                <MapPin className="w-4 h-4" />
                Explorar o mapa sem conta
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Terms */}
            <p className="text-center text-xs leading-relaxed px-4" style={{ color: "var(--color-text-muted)" }}>
              Ao continuar, você concorda com nossos{" "}
              <a href="#" className="text-[#1a8ccc] font-medium underline underline-offset-2">
                Termos de Uso
              </a>{" "}
              e{" "}
              <a href="#" className="text-[#1a8ccc] font-medium underline underline-offset-2">
                Política de Privacidade
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Menu, X, LogIn, Info, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { signOutUser } from "@/services/firebase";

export default function MapNavbar() {
  const { user, isLoggedIn, loading } = useAuth();
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOutUser();
    setMobileMenuOpen(false);
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-30">
      <div className="p-3 md:p-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-elevated border border-white/50 px-3 md:px-4 py-2.5 flex items-center gap-2 md:gap-3">
          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#1a8ccc] flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <span className="hidden md:block text-sm font-semibold text-[#112F4E]">
              SAC Marília
            </span>
          </Link>

          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Buscar endereço ou reclamação..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className={`w-full pl-9 pr-4 py-2.5 bg-[#FAF7F2] border rounded-xl text-sm text-[#112F4E] placeholder:text-[#94A3B8] outline-none transition-all ${
                searchFocused
                  ? "border-[#1a8ccc] ring-2 ring-[#1a8ccc]/15"
                  : "border-[#E2E8F0]"
              }`}
            />
          </div>

          {/* Filter button (mobile only) */}
          <button className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#FAF7F2] transition-colors shrink-0">
            <span className="material-symbols-outlined text-[#4A5D70] text-[20px]">tune</span>
          </button>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/sobre"
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-[#4A5D70] hover:text-[#112F4E] hover:bg-[#FAF7F2] rounded-xl transition-all whitespace-nowrap"
            >
              <Info className="w-4 h-4" />
              Conhecer SAC
            </Link>

            {!loading && isLoggedIn ? (
              <Link
                href="/usuario/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-[#FAF7F2] transition-all"
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover border-2 border-[#1a8ccc]"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#1a8ccc] flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
                <span className="text-sm font-medium text-[#112F4E] max-w-[100px] truncate">
                  {user?.displayName?.split(" ")[0] ?? "Perfil"}
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-5 py-2.5 bg-[#1a8ccc] text-white text-sm font-medium rounded-xl hover:bg-[#1572a6] active:scale-[0.98] transition-all whitespace-nowrap"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#FAF7F2] transition-colors shrink-0"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-[#112F4E]" />
            ) : (
              <Menu className="w-5 h-5 text-[#112F4E]" />
            )}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-elevated border border-white/50 p-3 flex flex-col gap-1">
            <Link
              href="/sobre"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-[#4A5D70] hover:bg-[#FAF7F2] rounded-xl transition-colors"
            >
              <Info className="w-4 h-4" />
              Conhecer o SAC
            </Link>

            {!loading && isLoggedIn ? (
              <>
                <Link
                  href="/usuario/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-[#4A5D70] hover:bg-[#FAF7F2] rounded-xl transition-colors"
                >
                  <User className="w-4 h-4" />
                  Meu Painel
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-[#EF4444] hover:bg-[#FEE2E2] rounded-xl transition-colors w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-white bg-[#1a8ccc] hover:bg-[#1572a6] rounded-xl transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Fazer Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

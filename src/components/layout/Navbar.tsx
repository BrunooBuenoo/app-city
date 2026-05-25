"use client"

import { useState, useEffect } from "react"
import { Menu, X, ChevronRight, MapPin, Trophy, LogIn, Info } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ThemeToggle from "./ThemeToggle"

const navLinks = [
  { label: "Mapa", href: "/", icon: "map" },
  { label: "Conheça o SAC", href: "/sobre", icon: "info" },
  { label: "Ranking", href: "/usuario/ranking", icon: "emoji_events" },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className="w-full relative z-50">
      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border-b border-[#E2E8F0] dark:border-zinc-800"
            : "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1a8ccc] to-[#1572a6] flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-sm font-bold text-[#112F4E] dark:text-zinc-100 leading-none block">
                  SAC Marília
                </span>
                <span className="text-sm font-bold text-[#112F4E] dark:text-zinc-100 tracking-wide">
                  ao Contrário
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#4A5D70] dark:text-zinc-300 hover:text-[#112F4E] dark:hover:text-zinc-100 hover:bg-[#FAF7F2] dark:hover:bg-zinc-900 rounded-xl transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-2.5">
              <ThemeToggle className="mr-1" />
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium text-[#4A5D70] dark:text-zinc-300 hover:text-[#112F4E] dark:hover:text-zinc-100 hover:bg-[#FAF7F2] dark:hover:bg-zinc-900 rounded-xl transition-all"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
              <Link
                href="/"
                className="flex items-center gap-1.5 px-5 py-2.5 bg-[#1a8ccc] dark:bg-[#0ea5e9] text-white text-sm font-semibold rounded-xl hover:bg-[#1572a6] dark:hover:bg-[#0284c7] shadow-sm hover:shadow-md active:scale-[0.98] transition-all"
              >
                Reportar Problema
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#FAF7F2] dark:hover:bg-zinc-900 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[#112F4E] dark:text-zinc-200" />
              ) : (
                <Menu className="w-5 h-5 text-[#112F4E] dark:text-zinc-200" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 w-[280px] bg-white dark:bg-zinc-950 shadow-2xl z-50 md:hidden flex flex-col border-l dark:border-zinc-800 animate-[slideIn_200ms_ease]">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#F1F5F9] dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1a8ccc] to-[#1572a6] flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-bold text-[#112F4E] dark:text-zinc-100">SAC Marília</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#FAF7F2] dark:hover:bg-zinc-900"
              >
                <X className="w-4 h-4 text-[#94A3B8]" />
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 p-4 space-y-1">
              <div className="flex justify-between items-center px-4 py-3 mb-2 rounded-xl bg-[#FAF7F2] dark:bg-zinc-900">
                <span className="text-sm font-medium text-[#4A5D70] dark:text-zinc-300">Tema do App</span>
                <ThemeToggle />
              </div>
              
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3.5 text-sm font-medium text-[#4A5D70] dark:text-zinc-300 hover:text-[#112F4E] dark:hover:text-zinc-100 hover:bg-[#FAF7F2] dark:hover:bg-zinc-900 rounded-xl transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px] text-[#94A3B8] dark:text-zinc-500">{link.icon}</span>
                    {link.label}
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#E2E8F0] dark:text-zinc-800" />
                </Link>
              ))}
            </div>

            {/* Mobile CTAs */}
            <div className="p-4 space-y-2 border-t border-[#F1F5F9] dark:border-zinc-800">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 border border-[#E2E8F0] dark:border-zinc-800 text-[#112F4E] dark:text-zinc-200 text-sm font-medium rounded-xl hover:bg-[#FAF7F2] dark:hover:bg-zinc-900 transition-all"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#1a8ccc] dark:bg-[#0ea5e9] text-white text-sm font-semibold rounded-xl hover:bg-[#1572a6] dark:hover:bg-[#0284c7] transition-all"
              >
                Reportar Problema
              </Link>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </header>
  )
}

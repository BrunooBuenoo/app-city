"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, Menu, X, LogIn, Info, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { signOutUser } from "@/services/firebase";
import { CATEGORIES } from "@/utils/categories";
import ThemeToggle from "./ThemeToggle";

interface MapNavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  onFiltersToggle?: (open: boolean) => void;
  onMobileMenuToggle?: (open: boolean) => void;
  onAddressSelect?: (suggestion: AddressSuggestion) => void;
}

export interface AddressSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  geojson?: any;
  boundingbox?: string[];
  osm_type?: string;
  osm_id?: number;
}

export default function MapNavbar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  onFiltersToggle,
  onMobileMenuToggle,
  onAddressSelect,
}: MapNavbarProps) {
  const { user, profile, isLoggedIn, loading } = useAuth();
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Sincronizar estados com o componente pai por meio de callbacks reativos
  useEffect(() => {
    if (onFiltersToggle) {
      onFiltersToggle(showFilters);
    }
  }, [showFilters, onFiltersToggle]);

  useEffect(() => {
    if (onMobileMenuToggle) {
      onMobileMenuToggle(mobileMenuOpen);
    }
  }, [mobileMenuOpen, onMobileMenuToggle]);

  // Address autocomplete
  const [inputValue, setInputValue] = useState(searchQuery);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const handleSignOut = async () => {
    await signOutUser();
    setMobileMenuOpen(false);
  };

  // Fetch address suggestions from Nominatim
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (inputValue.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(inputValue + " Marília SP")}&limit=5&addressdetails=1`,
          { headers: { "Accept-Language": "pt-BR" } }
        );
        const data: AddressSuggestion[] = await res.json();
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
      } catch (err) {
        console.error("Erro ao buscar sugestões:", err);
      }
    }, 400);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [inputValue]);

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectSuggestion = async (s: AddressSuggestion) => {
    setInputValue(s.display_name);
    setSearchQuery(s.display_name);
    setShowSuggestions(false);
    
    if (onAddressSelect) {
      onAddressSelect(s); // Otimista (voa para o local sem geometria ainda)
      
      // Busca a geometria detalhada do polígono para desenhar a rua
      if (s.osm_type && s.osm_id) {
        try {
          const typeChar = s.osm_type.charAt(0).toUpperCase();
          const res = await fetch(
            `https://nominatim.openstreetmap.org/lookup?format=json&osm_ids=${typeChar}${s.osm_id}&polygon_geojson=1`,
            { headers: { "Accept-Language": "pt-BR" } }
          );
          const data = await res.json();
          if (data && data.length > 0 && data[0].geojson) {
            onAddressSelect({ ...s, geojson: data[0].geojson });
          }
        } catch (err) {
          console.error("Erro ao buscar geojson do endereço:", err);
        }
      }
    }
  };

  return (
    <nav className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl z-30 p-3 md:p-4">
      <div>
        <div className="bg-white/95 dark:bg-zinc-900/90 backdrop-blur-xl rounded-2xl shadow-elevated border border-white/50 dark:border-zinc-800/50 px-3 md:px-4 py-2.5 flex items-center gap-2 md:gap-3">
          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center gap-2">
            <span className="text-xs font-bold text-[#112F4E] dark:text-zinc-100 leading-tight whitespace-nowrap hidden sm:block">
              Sac do Marília<br />ao Contrário
            </span>
            <span className="text-[10px] font-bold text-[#112F4E] dark:text-zinc-100 leading-tight whitespace-nowrap sm:hidden">
              SAC
            </span>
          </Link>

          {/* Search with autocomplete */}
          <div className="flex-1 relative" ref={suggestionsRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Buscar endereço..."
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (e.target.value === '') {
                  setSearchQuery('');
                  if (onAddressSelect) onAddressSelect(null as any);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setSearchQuery(inputValue);
                  setShowSuggestions(false);
                }
              }}
              onFocus={() => {
                setSearchFocused(true);
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              onBlur={() => setSearchFocused(false)}
              className={`w-full pl-9 ${inputValue ? 'pr-10' : 'pr-4'} py-2.5 bg-[#FAF7F2] dark:bg-zinc-800 border rounded-xl text-[16px] md:text-sm text-[#112F4E] dark:text-zinc-200 placeholder:text-[#94A3B8] outline-none transition-all ${
                searchFocused
                  ? "border-[#1a8ccc] ring-2 ring-[#1a8ccc]/15 dark:border-[#38bdf8] dark:ring-[#38bdf8]/15"
                  : "border-[#E2E8F0] dark:border-zinc-700"
              }`}
            />
            {inputValue && (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()} // Prevent blur before clearing
                onClick={() => {
                  setInputValue('');
                  setSearchQuery('');
                  if (onAddressSelect) onAddressSelect(null as any);
                  setSuggestions([]);
                  setShowSuggestions(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-[#94A3B8] hover:text-[#4A5D70] dark:hover:text-zinc-300 transition-colors"
                aria-label="Limpar busca"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Autocomplete suggestions dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-zinc-900 rounded-xl shadow-elevated border border-[#E2E8F0] dark:border-zinc-800 overflow-hidden z-50 max-h-[220px] overflow-y-auto">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelectSuggestion(s)}
                    className="w-full text-left px-4 py-3 text-xs text-[#4A5D70] dark:text-zinc-300 hover:bg-[#FAF7F2] dark:hover:bg-zinc-800 transition-colors border-b border-[#F5F2ED] dark:border-zinc-800/50 last:border-b-0 flex items-start gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#94A3B8] mt-0.5 shrink-0">location_on</span>
                    <span className="line-clamp-2 leading-relaxed">{s.display_name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter button */}
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#FAF7F2] dark:hover:bg-zinc-800 transition-colors shrink-0 cursor-pointer ${
              selectedCategory || selectedStatus ? "bg-[#E8F2F8] text-[#1a8ccc] dark:bg-[#1a8ccc]/20 dark:text-[#38bdf8]" : "text-[#4A5D70] dark:text-zinc-300"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle className="mr-2" />
            
            <Link
              href="/sobre"
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-[#4A5D70] dark:text-zinc-300 hover:text-[#112F4E] dark:hover:text-zinc-100 hover:bg-[#FAF7F2] dark:hover:bg-zinc-800 rounded-xl transition-all whitespace-nowrap"
            >
              <Info className="w-4 h-4" />
              Conhecer SAC
            </Link>

            {!loading && isLoggedIn ? (
              <Link
                href="/usuario/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-[#FAF7F2] dark:hover:bg-zinc-800 transition-all"
              >
                {profile?.foto || user?.photoURL ? (
                  <img
                    src={profile?.foto || user.photoURL}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover border-2 border-[#1a8ccc] dark:border-[#38bdf8]"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#1a8ccc] dark:bg-[#38bdf8] flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
                <span className="text-sm font-medium text-[#112F4E] dark:text-zinc-200 max-w-[100px] truncate">
                  {user?.displayName?.split(" ")[0] ?? "Perfil"}
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-5 py-2.5 bg-[#1a8ccc] dark:bg-[#0ea5e9] text-white text-sm font-medium rounded-xl hover:bg-[#1572a6] dark:hover:bg-[#0284c7] active:scale-[0.98] transition-all whitespace-nowrap"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#FAF7F2] dark:hover:bg-zinc-800 transition-colors shrink-0"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-[#112F4E] dark:text-zinc-200" />
            ) : (
              <Menu className="w-5 h-5 text-[#112F4E] dark:text-zinc-200" />
            )}
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="mt-2 bg-white/95 dark:bg-zinc-900/90 backdrop-blur-xl rounded-2xl shadow-elevated border border-white/50 dark:border-zinc-800/50 p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#112F4E] dark:text-zinc-300 uppercase tracking-wider mb-2">Filtrar por Categoria</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2.5 bg-[#FAF7F2] dark:bg-zinc-800 border border-[#E2E8F0] dark:border-zinc-700 rounded-xl text-xs text-[#112F4E] dark:text-zinc-200 outline-none"
              >
                <option value="">Todas as Categorias</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.label}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#112F4E] dark:text-zinc-300 uppercase tracking-wider mb-2">Filtrar por Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-2.5 bg-[#FAF7F2] dark:bg-zinc-800 border border-[#E2E8F0] dark:border-zinc-700 rounded-xl text-xs text-[#112F4E] dark:text-zinc-200 outline-none"
              >
                <option value="">Todos os Status (Abertos)</option>
                <option value="aberto">Aberto</option>
                <option value="em_analise">Em Análise</option>
                <option value="em_andamento">Em Progresso</option>
                <option value="critico">Crítico</option>
              </select>
            </div>
          </div>
        )}

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="mt-2 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-2xl shadow-elevated border border-white/50 dark:border-zinc-800/50 p-3 flex flex-col gap-1">
            <div className="flex justify-between items-center px-4 py-3 mb-1">
              <span className="text-sm font-medium text-[#4A5D70] dark:text-zinc-300">Tema do Mapa</span>
              <ThemeToggle />
            </div>
            
            <Link
              href="/sobre"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-[#4A5D70] dark:text-zinc-300 hover:bg-[#FAF7F2] dark:hover:bg-zinc-800 rounded-xl transition-colors"
            >
              <Info className="w-4 h-4" />
              Conhecer o SAC
            </Link>

            {!loading && isLoggedIn ? (
              <>
                <Link
                  href="/usuario/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-[#4A5D70] dark:text-zinc-300 hover:bg-[#FAF7F2] dark:hover:bg-zinc-800 rounded-xl transition-colors"
                >
                  <User className="w-4 h-4" />
                  Meu Painel
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-[#EF4444] dark:text-red-400 hover:bg-[#FEE2E2] dark:hover:bg-red-950/30 rounded-xl transition-colors w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-[#1a8ccc] dark:text-[#38bdf8] hover:bg-[#E8F2F8] dark:hover:bg-[#38bdf8]/10 rounded-xl transition-colors"
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

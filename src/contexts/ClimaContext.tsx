"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { fetchCurrentWeather, type WeatherData } from "@/services/clima/openweather";

interface ClimaContextType {
  isActive: boolean;
  toggleActive: () => void;
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  forcedCondition: WeatherData["condition"] | undefined;
  setForcedCondition: (cond: WeatherData["condition"] | undefined) => void;
  refreshWeather: () => Promise<void>;
}

const ClimaContext = createContext<ClimaContextType | null>(null);

export function useClimaContext() {
  const context = useContext(ClimaContext);
  if (!context) {
    throw new Error("useClimaContext deve ser usado dentro de um ClimaProvider");
  }
  return context;
}

export function ClimaProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [forcedCondition, setForcedCondition] = useState<WeatherData["condition"] | undefined>(undefined);
  
  // Cache exclusivo do Clima Real
  const [realWeather, setRealWeather] = useState<WeatherData | null>(null);
  const [realLastFetched, setRealLastFetched] = useState<number | null>(null);

  const fetchWeather = useCallback(async (forcedCond?: WeatherData["condition"], force = false) => {
    const CACHE_DURATION_CLIENT = 5 * 60 * 1000; // 5 minutos de cache local no navegador
    
    // Se for clima simulado (forcedCond está definido)
    if (forcedCond) {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCurrentWeather(forcedCond);
        setWeather(data);
      } catch (err) {
        console.error("[ClimaProvider] Erro ao carregar clima simulado:", err);
        setError("Não foi possível carregar o clima simulado.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Se for clima real (forcedCond não definido)
    const cacheValido = 
      !force && 
      realWeather && 
      realLastFetched && 
      (Date.now() - realLastFetched < CACHE_DURATION_CLIENT);

    if (cacheValido) {
      // Recupera o clima real do cache sem fazer nova requisição HTTP!
      setWeather(realWeather);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchCurrentWeather(undefined);
      setWeather(data);
      setRealWeather(data);
      setRealLastFetched(Date.now());
    } catch (err) {
      console.error("[ClimaProvider] Erro ao carregar clima real:", err);
      setError("Não foi possível carregar os dados climáticos reais.");
    } finally {
      setLoading(false);
    }
  }, [realWeather, realLastFetched]);

  const toggleActive = useCallback(() => {
    setIsActive((prev) => !prev);
  }, []);

  const refreshWeather = useCallback(async () => {
    await fetchWeather(forcedCondition, true); // Força a atualização passando o flag true
  }, [forcedCondition, fetchWeather]);

  // Recarrega clima ao ativar ou ao mudar o clima forçado de testes
  useEffect(() => {
    if (isActive) {
      fetchWeather(forcedCondition);
    }
  }, [isActive, forcedCondition, fetchWeather]);

  // Atualização periódica (a cada 5 minutos) se a camada estiver ativa
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      fetchWeather(forcedCondition);
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [isActive, forcedCondition, fetchWeather]);

  return (
    <ClimaContext.Provider
      value={{
        isActive,
        toggleActive,
        weather,
        loading,
        error,
        forcedCondition,
        setForcedCondition,
        refreshWeather,
      }}
    >
      {children}
    </ClimaContext.Provider>
  );
}

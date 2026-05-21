"use client";

import { useClimaContext } from "@/contexts/ClimaContext";

export function useClima() {
  return useClimaContext();
}
export type { WeatherData } from "@/services/clima/openweather";

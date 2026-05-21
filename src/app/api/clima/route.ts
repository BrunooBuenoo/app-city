import { NextResponse } from "next/server";

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const MARILIA_LAT = -22.2139;
const MARILIA_LON = -49.9458;

// Cache em memória simples no servidor para garantir blindagem absoluta de cota
let cachedWeather: any = null;
let lastFetchTime = 0;
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutos (900.000 ms) -> Exatamente 4 requisições/hora (96 por dia)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const forcedCondition = searchParams.get("forcedCondition");

  // Se for solicitado um clima simulado específico para testes do desenvolvedor, ignoramos o cache
  if (forcedCondition) {
    return NextResponse.json(generateMockWeather(forcedCondition));
  }

  // Se a chave não estiver configurada no servidor, envia clima simulado padrão
  if (!OPENWEATHER_API_KEY) {
    console.warn("[API Clima] Chave OPENWEATHER_API_KEY não configurada no servidor. Retornando clima simulado.");
    return NextResponse.json(generateMockWeather());
  }

  const now = Date.now();
  const timeSinceLastFetch = now - lastFetchTime;

  // Se houver cache válido, retorna imediatamente sem fazer chamada para a API externa!
  if (cachedWeather && timeSinceLastFetch < CACHE_DURATION) {
    return NextResponse.json({ ...cachedWeather, isCached: true });
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${MARILIA_LAT}&lon=${MARILIA_LON}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=pt_br`;
    
    // Chamada à API externa com timeout e headers limpos
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 900 } // Cache do Next.js de 15 minutos
    });

    if (!res.ok) {
      throw new Error(`Falha no OpenWeather: ${res.statusText}`);
    }

    const data = await res.json();
    
    // Mapeamento e estruturação dos dados
    const weatherData = {
      temp: Math.round(data.main.temp),
      condition: mapWeatherCondition(data.weather[0].id),
      description: data.weather[0].description,
      feelsLike: Math.round(data.main.feels_like),
      windSpeed: Math.round(data.wind.speed * 3.6),
      city: data.name || "Marília",
      isMocked: false,
      lastUpdated: new Date().toLocaleTimeString("pt-BR")
    };

    // Atualiza o cache do servidor
    cachedWeather = weatherData;
    lastFetchTime = now;

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error("[API Clima] Erro ao buscar clima real no servidor. Usando fallback simulado:", error);
    
    // Se der erro de rede ou cota e já tivermos um cache anterior, retorna ele mesmo expirado
    if (cachedWeather) {
      return NextResponse.json({ ...cachedWeather, isFallback: true });
    }
    
    return NextResponse.json(generateMockWeather());
  }
}

// Auxiliares internos do Servidor
function mapWeatherCondition(id: number): "sol" | "chuva" | "nublado" | "tempestade" | "neblina" {
  if (id >= 200 && id < 300) return "tempestade";
  if (id >= 300 && id < 600) return "chuva";
  if (id >= 700 && id < 800) return "neblina";
  if (id === 800) return "sol";
  return "nublado";
}

function generateMockWeather(forcedCondition?: string) {
  const date = new Date();
  const hour = date.getHours();

  let temp = 22;
  if (hour >= 6 && hour < 12) temp = 20 + Math.random() * 5;
  else if (hour >= 12 && hour < 18) temp = 26 + Math.random() * 6;
  else temp = 17 + Math.random() * 4;

  const conditions = ["sol", "nublado", "chuva", "tempestade", "neblina"];
  const condition = forcedCondition || conditions[Math.floor(Math.random() * conditions.length)];

  const descriptions: Record<string, string> = {
    sol: "Céu Limpo e Ensolarado",
    nublado: "Céu Nublado",
    chuva: "Chuva Leve",
    tempestade: "Tempestade com Raios",
    neblina: "Névoa Matinal",
  };

  let windSpeed = 8 + Math.random() * 12;
  let feelsLike = temp;

  if (condition === "sol") {
    feelsLike = temp + 1.5;
    windSpeed = 5 + Math.random() * 8;
  } else if (condition === "chuva") {
    feelsLike = temp - 1;
    windSpeed = 12 + Math.random() * 10;
  } else if (condition === "tempestade") {
    feelsLike = temp - 2.5;
    windSpeed = 22 + Math.random() * 15;
  } else if (condition === "neblina") {
    feelsLike = temp - 0.5;
    windSpeed = 2 + Math.random() * 4;
  }

  return {
    temp: Math.round(temp),
    condition,
    description: descriptions[condition] || "Parcialmente Nublado",
    feelsLike: Math.round(feelsLike),
    windSpeed: Math.round(windSpeed),
    city: "Marília (Simulado)",
    isMocked: true,
    lastUpdated: new Date().toLocaleTimeString("pt-BR")
  };
}

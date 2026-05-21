export interface WeatherData {
  temp: number;
  condition: "sol" | "chuva" | "nublado" | "tempestade" | "neblina";
  description: string;
  feelsLike: number;
  windSpeed: number;
  city: string;
  isMocked: boolean;
  isCached?: boolean;
  lastUpdated?: string;
}

/**
 * Obtém os dados climáticos atuais consumindo o Route Handler local (Server-side API)
 * Isso blinda a API Key do OpenWeatherMap de ficar exposta no navegador do cliente,
 * além de unificar a cota de chamadas de todos os usuários a no máximo 96 requisições por dia!
 */
export async function fetchCurrentWeather(forcedCondition?: WeatherData["condition"]): Promise<WeatherData> {
  try {
    let url = "/api/clima";
    if (forcedCondition) {
      url += `?forcedCondition=${forcedCondition}`;
    }

    const res = await fetch(url);
    
    if (!res.ok) {
      throw new Error(`Falha ao carregar clima da API local: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("[Clima Service] Erro ao buscar clima na rota interna. Usando contingência local:", error);
    return getMockWeather(forcedCondition);
  }
}

/**
 * Gera dados realistas de simulação local no navegador em caso de queda extrema de rede
 */
export function getMockWeather(forcedCondition?: WeatherData["condition"]): WeatherData {
  const date = new Date();
  const hour = date.getHours();

  let temp = 22;
  if (hour >= 6 && hour < 12) temp = 20 + Math.random() * 5;
  else if (hour >= 12 && hour < 18) temp = 26 + Math.random() * 6;
  else temp = 17 + Math.random() * 4;

  const conditions: WeatherData["condition"][] = ["sol", "nublado", "chuva", "tempestade", "neblina"];
  const condition = forcedCondition || conditions[Math.floor(Math.random() * conditions.length)];

  const descriptions: Record<WeatherData["condition"], string> = {
    sol: "Céu Limpo e Ensolarado (Local)",
    nublado: "Céu Nublado (Local)",
    chuva: "Chuva Leve (Local)",
    tempestade: "Tempestade com Raios (Local)",
    neblina: "Névoa Matinal (Local)",
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
    description: descriptions[condition],
    feelsLike: Math.round(feelsLike),
    windSpeed: Math.round(windSpeed),
    city: "Marília",
    isMocked: true,
  };
}

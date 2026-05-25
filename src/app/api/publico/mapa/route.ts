import { NextResponse } from "next/server";
import { listarReclamacoes } from "@/services/firebase";

export async function GET() {
  try {
    // Busca todas as reclamações usando o serviço existente do Firebase
    const reclamacoes = await listarReclamacoes();
    
    // Anonimizar e retornar apenas os campos essenciais para os pins do mapa da landing page.
    // Desta forma, UIDs de usuários, nomes de autores anônimos e descrições privadas
    // NUNCA são expostos ao tráfego de rede do cliente, garantindo segurança robusta.
    const safeData = reclamacoes.map((rec) => ({
      id: rec.id,
      titulo: rec.titulo,
      categoria: rec.categoria,
      latitude: rec.latitude,
      longitude: rec.longitude,
    }));
    
    // Cache de resposta (revalidação a cada 30 segundos) para performance excelente
    return NextResponse.json(safeData, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=15",
      },
    });
  } catch (error) {
    console.error("Erro na API de mapa público:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar dados de mapa" },
      { status: 500 }
    );
  }
}

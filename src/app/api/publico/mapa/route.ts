import { NextResponse } from "next/server";
import { listarEstabelecimentos } from "@/services/firebase";

export async function GET() {
  try {
    // Busca todos os estabelecimentos ativos usando o serviço do Firebase
    const estabelecimentos = await listarEstabelecimentos({ status: "ativo" });
    
    // Retornar apenas os campos essenciais para os pins do mapa público
    const safeData = estabelecimentos.map((estab) => ({
      id: estab.id,
      nome: estab.nome,
      categoria: estab.categoria,
      latitude: estab.latitude,
      longitude: estab.longitude,
      logoUrl: estab.logoUrl,
      endereco: estab.endereco,
    }));
    
    // Cache de resposta (revalidação a cada 30 segundos) para performance excelente
    return NextResponse.json(safeData, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=15",
      },
    });
  } catch (error) {
    console.error("Erro na API de mapa público comercial:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar dados de mapa comercial" },
      { status: 500 }
    );
  }
}


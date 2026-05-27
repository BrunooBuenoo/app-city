import { NextResponse } from "next/server";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/services/firebase";
import { listarEstabelecimentos, type Estabelecimento } from "@/services/firebase";

async function listarEstabelecimentosPublicosFallback(): Promise<Estabelecimento[]> {
  const snap = await getDocs(query(collection(db, "establishments"), where("status", "==", "ativo")));

  return snap.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      empresaId: data.empresaId ?? "",
      nome: data.nome ?? "",
      descricao: data.descricao ?? "",
      categoria: data.categoria ?? "comercio_varejo",
      logoUrl: data.logoUrl ?? "",
      bannerUrl: data.bannerUrl ?? "",
      latitude: data.latitude ?? 0,
      longitude: data.longitude ?? 0,
      endereco: data.endereco ?? "",
      telefone: data.telefone ?? "",
      status: data.status ?? "pendente_aprovacao",
      criadoEm: data.criadoEm ?? null,
      aprovadoEm: data.aprovadoEm ?? null,
      cardapioUrl: data.cardapioUrl ?? "",
      servicos: data.servicos ?? "",
    } satisfies Estabelecimento;
  });
}

export async function GET() {
  try {
    let estabelecimentos: Estabelecimento[] = [];

    try {
      estabelecimentos = await listarEstabelecimentos({ status: "ativo" });
    } catch (error) {
      console.warn("Falha ao carregar mapa publico com leitura mesclada; usando fallback global.", error);
      estabelecimentos = await listarEstabelecimentosPublicosFallback();
    }
    
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
      [],
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=15, stale-while-revalidate=15",
          "X-Vizoor-Mapa-Fallback": "empty",
        },
      }
    );
  }
}


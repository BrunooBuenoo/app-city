// ─── Clustering — Detecção de reclamações próximas ───

import type { Reclamacao } from "@/services/firebase/reclamacoes";

/**
 * Calcula a distância entre dois pontos geográficos usando Haversine (em metros).
 */
function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // raio da Terra em metros
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Identifica quais reclamações estão em "cluster" (mais de uma no mesmo raio).
 * Retorna um Set com os IDs das reclamações que possuem vizinhas no raio.
 *
 * @param reclamacoes - Lista de reclamações
 * @param thresholdMeters - Raio de proximidade (padrão: 200m)
 * @returns Set de IDs de reclamações em cluster
 */
export function findClusteredComplaints(
  reclamacoes: Reclamacao[],
  thresholdMeters = 200
): Set<string> {
  const clustered = new Set<string>();

  // Somente reclamações abertas/ativas (não resolvidas)
  const active = reclamacoes.filter(
    (r) => r.latitude && r.longitude && r.status !== "resolvido"
  );

  for (let i = 0; i < active.length; i++) {
    for (let j = i + 1; j < active.length; j++) {
      const dist = haversineDistance(
        active[i].latitude,
        active[i].longitude,
        active[j].latitude,
        active[j].longitude
      );

      if (dist <= thresholdMeters) {
        clustered.add(active[i].id);
        clustered.add(active[j].id);
      }
    }
  }

  return clustered;
}

/**
 * Conta quantas reclamações vizinhas cada reclamação clusterizada tem.
 */
export function getClusterCounts(
  reclamacoes: Reclamacao[],
  thresholdMeters = 200
): Map<string, number> {
  const counts = new Map<string, number>();
  const active = reclamacoes.filter(
    (r) => r.latitude && r.longitude && r.status !== "resolvido"
  );

  for (let i = 0; i < active.length; i++) {
    let neighborCount = 0;
    for (let j = 0; j < active.length; j++) {
      if (i === j) continue;
      const dist = haversineDistance(
        active[i].latitude,
        active[i].longitude,
        active[j].latitude,
        active[j].longitude
      );
      if (dist <= thresholdMeters) {
        neighborCount++;
      }
    }
    if (neighborCount > 0) {
      counts.set(active[i].id, neighborCount + 1); // inclui a própria
    }
  }

  return counts;
}

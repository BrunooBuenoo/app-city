"use client";

import { Compass, MapPin, Store } from "lucide-react";
import { Map, MapControls, MapMarker, MarkerContent } from "@/components/ui/map";
import type { CreatorLinkWithEstablishment } from "@/services/firebase";

interface CreatorCuratedMapProps {
  items: CreatorLinkWithEstablishment[];
}

function getCenter(items: CreatorLinkWithEstablishment[]): [number, number] {
  if (items.length === 0) {
    return [-46.6333, -23.5505];
  }

  const validItems = items.filter((item) => item.establishment);
  if (validItems.length === 0) {
    return [-46.6333, -23.5505];
  }

  const totalLongitude = validItems.reduce((sum, item) => sum + (item.establishment?.longitude ?? 0), 0);
  const totalLatitude = validItems.reduce((sum, item) => sum + (item.establishment?.latitude ?? 0), 0);

  return [
    totalLongitude / validItems.length,
    totalLatitude / validItems.length,
  ];
}

export default function CreatorCuratedMap({ items }: CreatorCuratedMapProps) {
  const center = getCenter(items);

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200/70 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
      <div className="border-b border-slate-100 px-6 py-4 dark:border-zinc-800/80">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Mapa da curadoria</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-zinc-300">
          Visualize os lugares vinculados a este criador dentro do ecossistema Vizoor.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex min-h-[360px] flex-col items-center justify-center gap-3 px-6 py-10 text-center text-slate-500 dark:text-zinc-400">
          <Compass className="h-10 w-10 text-[#1a8ccc]" />
          <p className="max-w-md text-sm leading-6">
            O mapa personalizado aparecera aqui assim que este criador tiver estabelecimentos ativos aprovados na curadoria.
          </p>
        </div>
      ) : (
        <div className="relative h-[420px] w-full">
          <Map center={center} zoom={12} pitch={20} bearing={-10}>
            <MapControls position="bottom-right" showZoom />
            {items.map(({ id, destaque, establishment }) => {
              if (!establishment) return null;

              return (
                <MapMarker
                  key={id}
                  longitude={establishment.longitude}
                  latitude={establishment.latitude}
                >
                  <MarkerContent>
                    <div className="group relative flex flex-col items-center">
                      <div
                        className={`absolute h-3 w-8 translate-y-5 rounded-full bg-black/20 blur-md transition-transform group-hover:scale-110 ${
                          destaque ? "opacity-80" : "opacity-60"
                        }`}
                      />
                      <div
                        className={`relative flex h-12 w-12 items-center justify-center rounded-[18px] border-2 border-white shadow-lg transition-transform group-hover:-translate-y-1 group-hover:scale-105 ${
                          destaque ? "bg-[#1a8ccc]" : "bg-slate-800"
                        }`}
                        title={establishment.nome}
                      >
                        {establishment.logoUrl ? (
                          <img
                            src={establishment.logoUrl}
                            alt={establishment.nome}
                            className="h-9 w-9 rounded-[12px] object-cover"
                          />
                        ) : (
                          <Store className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <div className="mt-2 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-700 shadow-sm dark:bg-zinc-900/95 dark:text-zinc-200">
                        {destaque ? "Destaque" : "Lugar"}
                      </div>
                    </div>
                  </MarkerContent>
                </MapMarker>
              );
            })}
          </Map>
        </div>
      )}

      {items.length > 0 && (
        <div className="border-t border-slate-100 px-6 py-4 dark:border-zinc-800/80">
          <div className="flex flex-wrap gap-2.5">
            {items.slice(0, 6).map(({ id, establishment }) => {
              if (!establishment) return null;

              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-300"
                >
                  <MapPin className="h-3.5 w-3.5 text-[#1a8ccc]" />
                  {establishment.nome}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

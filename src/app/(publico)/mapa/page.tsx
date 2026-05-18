import React from "react";
import Link from "next/link";

export default function MapaPrincipal() {
  return (
    <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden">
      {/* Main Map Canvas */}
      <main className="relative w-full h-full">
        {/* Map Background */}
        <div className="absolute inset-0 z-0">
          <img
            alt="Mapa da cidade de Marília"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkwtJ2MKf2IFZQRHidwATZPPCl3bFbP0Fhbb0dD7EW3h9HXiRU_cQxVrtlyGyh_Gfb02fybXYWMkqAzSEGaK9S8ZC3EYR-hsimGRNpHTsGHFmgCNC7i_U1vZozgoiBC8RwVbpMMpLv1ka3Ev8WDgzb8yLFVWGyF0c_qu-bokolpnZNB_TvTzyDu2aGz3oKpsWrYo2ob_n6YStaAkfDCRUx1ZHh-p8GKW18Jy3L1PtVB-o0ZQGPhtO9h6vGnJYVYjrfUKlfPwIcz3tT"
          />
          {/* Heatmap Overlay Simulation */}
          <div className="absolute inset-0 bg-gradient-to-tr from-secondary/5 via-transparent to-primary/5 pointer-events-none"></div>

          {/* Pulsing Pins */}
          <div className="pulsing-pin absolute top-[40%] left-[30%] z-10">
            <span
              className="material-symbols-outlined text-[#FF4D4D]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              location_on
            </span>
          </div>
          <div className="pulsing-pin absolute top-[65%] left-[60%] z-10">
            <span
              className="material-symbols-outlined text-[#FF4D4D]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              location_on
            </span>
          </div>
          <div className="pulsing-pin absolute top-[25%] left-[75%] z-10">
            <span
              className="material-symbols-outlined text-[#FF4D4D]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              location_on
            </span>
          </div>
        </div>

        {/* Floating UI Components */}
        <div className="absolute inset-x-0 bottom-32 z-20 flex flex-col gap-4">
          {/* FAB - Action Alignment */}
          <div className="flex justify-end px-4 mb-4">
            <Link
              href="/reclamacao/nova"
              className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform duration-150"
            >
              <span className="material-symbols-outlined text-[32px]">add</span>
            </Link>
          </div>

          {/* Horizontal Scroll Cards */}
          <div className="w-full overflow-x-auto no-scrollbar px-4 flex gap-4 pb-2">
            {/* Card 1 */}
            <div className="min-w-[280px] bg-white/90 glass-panel p-4 rounded-xl shadow-[0_4px_20px_rgba(26,28,30,0.04)] border border-outline-variant/30 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">
                    Iluminação
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">
                    Poste Apagado
                  </h3>
                </div>
                <span className="bg-primary-container/20 text-primary px-2 py-1 rounded-full font-label-sm text-label-sm">
                  200m
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                Lâmpada queimada na Av. República, dificulta a visibilidade à
                noite.
              </p>
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-1 text-outline">
                  <span className="material-symbols-outlined text-sm">
                    thumb_up
                  </span>
                  <span className="font-label-md text-label-md">
                    12 Concordos
                  </span>
                </div>
                <span className="flex items-center gap-1 font-label-md text-label-md text-tertiary">
                  <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                  Em Andamento
                </span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="min-w-[280px] bg-white/90 glass-panel p-4 rounded-xl shadow-[0_4px_20px_rgba(26,28,30,0.04)] border border-outline-variant/30 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">
                    Infraestrutura
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">
                    Buraco na Via
                  </h3>
                </div>
                <span className="bg-primary-container/20 text-primary px-2 py-1 rounded-full font-label-sm text-label-sm">
                  450m
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                Cratera aberta na R. São Luiz após as últimas chuvas intensas.
              </p>
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-1 text-outline">
                  <span className="material-symbols-outlined text-sm">
                    thumb_up
                  </span>
                  <span className="font-label-md text-label-md">
                    28 Concordos
                  </span>
                </div>
                <span className="flex items-center gap-1 font-label-md text-label-md text-error">
                  <span className="w-2 h-2 rounded-full bg-error"></span>
                  Urgente
                </span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="min-w-[280px] bg-white/90 glass-panel p-4 rounded-xl shadow-[0_4px_20px_rgba(26,28,30,0.04)] border border-outline-variant/30 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">
                    Limpeza
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">
                    Acúmulo de Lixo
                  </h3>
                </div>
                <span className="bg-primary-container/20 text-primary px-2 py-1 rounded-full font-label-sm text-label-sm">
                  1.2km
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                Entulho acumulado no canteiro central da Av. Castro Alves.
              </p>
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-1 text-outline">
                  <span className="material-symbols-outlined text-sm">
                    thumb_up
                  </span>
                  <span className="font-label-md text-label-md">
                    5 Concordos
                  </span>
                </div>
                <span className="flex items-center gap-1 font-label-md text-label-md text-outline">
                  <span className="w-2 h-2 rounded-full bg-outline"></span>
                  Pendente
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

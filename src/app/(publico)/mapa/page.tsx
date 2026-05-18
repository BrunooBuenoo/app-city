import React from "react";
import Link from "next/link";

export default function MapaPrincipal() {
  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen overflow-hidden selection:bg-primary-container selection:text-on-primary-container">
      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between px-4 py-2 w-full max-w-container-max mx-auto h-16">
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-surface-container-high/50 transition-colors duration-200 text-primary">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h1 className="font-headline-sm text-headline-sm font-bold text-primary">
              Sac do Marilia ao Contrário
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-surface-container-high/50 transition-colors duration-200 text-on-surface-variant">
              <span className="material-symbols-outlined">search</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Map Canvas */}
      <main className="relative w-full h-screen">
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

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 bg-surface/90 dark:bg-surface-dim/90 backdrop-blur-lg shadow-[0_-4px_20px_rgba(26,28,30,0.04)] rounded-t-xl">
        <Link
          className="flex flex-col items-center justify-center bg-primary-container/20 text-primary rounded-xl px-3 py-1 transition-transform duration-150 scale-95 active:scale-90"
          href="/mapa"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            map
          </span>
          <span className="font-label-sm text-label-sm mt-1">Mapa</span>
        </Link>
        <Link
          className="flex flex-col items-center justify-center text-outline-variant px-3 py-1 transition-transform duration-150 scale-95 active:scale-90 hover:bg-surface-container"
          href="/usuario/minhas-reclamacoes"
        >
          <span className="material-symbols-outlined">description</span>
          <span className="font-label-sm text-label-sm mt-1">Reclamações</span>
        </Link>
        <Link
          className="flex flex-col items-center justify-center text-outline-variant px-3 py-1 transition-transform duration-150 scale-95 active:scale-90 hover:bg-surface-container"
          href="#"
        >
          <span className="material-symbols-outlined">notifications</span>
          <span className="font-label-sm text-label-sm mt-1">Alertas</span>
        </Link>
        <Link
          className="flex flex-col items-center justify-center text-outline-variant px-3 py-1 transition-transform duration-150 scale-95 active:scale-90 hover:bg-surface-container"
          href="/usuario/perfil"
        >
          <span className="material-symbols-outlined">person</span>
          <span className="font-label-sm text-label-sm mt-1">Perfil</span>
        </Link>
      </nav>

      {/* Map Search / Filter Pill */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40">
        <div className="bg-white/95 glass-panel px-4 py-2 rounded-full shadow-md flex items-center gap-3 border border-outline-variant/20">
          <span className="material-symbols-outlined text-primary text-sm">
            filter_list
          </span>
          <span className="font-label-md text-label-md text-on-surface whitespace-nowrap">
            Todos os Problemas
          </span>
          <span className="material-symbols-outlined text-outline-variant text-sm">
            expand_more
          </span>
        </div>
      </div>
    </div>
  );
}

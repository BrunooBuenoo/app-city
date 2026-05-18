import React from "react";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="p-gutter max-w-container-max mx-auto space-y-gutter">
      {/* Analytics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-gutter">
            {/* Total Card */}
            <div className="bg-surface-container-lowest p-gutter rounded-xl border border-outline-variant shadow-[0_4px_20px_rgba(26,28,30,0.04)]">
              <p className="font-label-md text-label-md text-on-surface-variant mb-1">
                Total de Reclamações
              </p>
              <div className="flex items-end justify-between">
                <h3 className="font-headline-md text-headline-md text-on-surface">
                  1,284
                </h3>
                <div className="w-16 h-8 text-primary opacity-50">
                  <svg
                    className="w-full h-full fill-none stroke-current stroke-2"
                    viewBox="0 0 100 40"
                  >
                    <path d="M0 35 Q 20 5, 40 25 T 80 15 T 100 30"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Abertas Card */}
            <div className="bg-surface-container-lowest p-gutter rounded-xl border border-outline-variant shadow-[0_4px_20px_rgba(26,28,30,0.04)]">
              <p className="font-label-md text-label-md text-on-surface-variant mb-1">
                Abertas
              </p>
              <div className="flex items-end justify-between">
                <h3 className="font-headline-md text-headline-md text-on-surface">
                  432
                </h3>
                <div className="w-16 h-8 text-primary-container opacity-50">
                  <svg
                    className="w-full h-full fill-none stroke-current stroke-2"
                    viewBox="0 0 100 40"
                  >
                    <path d="M0 20 Q 25 35, 50 10 T 100 25"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Críticas Card */}
            <div className="bg-surface-container-lowest p-gutter rounded-xl border border-outline-variant shadow-[0_4px_20px_rgba(26,28,30,0.04)]">
              <p className="font-label-md text-label-md text-on-surface-variant mb-1">
                Críticas
              </p>
              <div className="flex items-end justify-between">
                <h3 className="font-headline-md text-headline-md text-secondary">
                  87
                </h3>
                <div className="w-16 h-8 text-secondary opacity-50">
                  <svg
                    className="w-full h-full fill-none stroke-current stroke-2"
                    viewBox="0 0 100 40"
                  >
                    <path d="M0 10 L 20 30 L 40 5 L 60 35 L 80 15 L 100 25"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Resolvidas Card */}
            <div className="bg-surface-container-lowest p-gutter rounded-xl border border-outline-variant shadow-[0_4px_20px_rgba(26,28,30,0.04)]">
              <p className="font-label-md text-label-md text-on-surface-variant mb-1">
                Resolvidas
              </p>
              <div className="flex items-end justify-between">
                <h3 className="font-headline-md text-headline-md text-tertiary">
                  742
                </h3>
                <div className="w-16 h-8 text-tertiary opacity-50">
                  <svg
                    className="w-full h-full fill-none stroke-current stroke-2"
                    viewBox="0 0 100 40"
                  >
                    <path d="M0 35 L 25 25 L 50 30 L 100 5"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Reabertas Card */}
            <div className="bg-surface-container-lowest p-gutter rounded-xl border border-outline-variant shadow-[0_4px_20px_rgba(26,28,30,0.04)]">
              <p className="font-label-md text-label-md text-on-surface-variant mb-1">
                Reabertas
              </p>
              <div className="flex items-end justify-between">
                <h3 className="font-headline-md text-headline-md text-on-surface">
                  23
                </h3>
                <div className="w-16 h-8 text-outline opacity-50">
                  <svg
                    className="w-full h-full fill-none stroke-current stroke-2"
                    viewBox="0 0 100 40"
                  >
                    <path d="M0 20 L 50 20 L 100 20"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Administrative Map Section */}
          <section className="relative h-[500px] w-full bg-surface-container-high rounded-2xl overflow-hidden border border-outline-variant shadow-sm">
            {/* Map Base */}
            <div className="absolute inset-0 grayscale opacity-60">
              <img
                alt="City Map Base"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeTThu0vAiC4G_6CGCUb9xU6o7ENl4Y6-Mrl6gFAspsKB8Ws-5uJhJebQZzgq6LVN-WCUUILC__ThDKanwUtCPEx9iYIaXOVKTjMr5j5YyAXWN-zukchrUbgLems0dx7lcuAhpwDfdRahksRRmMFhfh5BnuLM7ffHUl22ExCb7Y_RGSma4K0_jcxTtTTcAmnS8pE_0jFu50Ck99Zqf4oqHMNKySy94EIG3G7PKzbVqPe11JmHMofKivDpp-SFT3f4csoddxITZU2GU"
              />
            </div>
            {/* Heatmap Overlay Simulation */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-[20%] left-[30%] w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
              <div className="absolute top-[50%] left-[60%] w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute top-[10%] left-[70%] w-48 h-48 bg-secondary/15 rounded-full blur-3xl"></div>
            </div>
            {/* Pins & Clusters */}
            <div className="absolute inset-0">
              {/* Pulsing Pin 1 */}
              <div className="absolute top-1/3 left-1/4">
                <div className="w-4 h-4 bg-secondary rounded-full pulsing-red border-2 border-white"></div>
              </div>
              {/* Cluster 1 */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-10 h-10 glass bg-white/70 rounded-full border border-primary/20 flex items-center justify-center font-bold text-primary shadow-lg cursor-pointer hover:scale-110 transition-transform">
                  124
                </div>
              </div>
              {/* Cluster 2 */}
              <div className="absolute top-2/3 left-[70%]">
                <div className="w-8 h-8 glass bg-white/70 rounded-full border border-primary/20 flex items-center justify-center font-bold text-primary shadow-lg cursor-pointer hover:scale-110 transition-transform">
                  42
                </div>
              </div>
            </div>
            {/* Floating Legend */}
            <div className="absolute bottom-gutter right-gutter glass bg-white/90 p-3 rounded-xl border border-outline-variant shadow-lg max-w-[180px]">
              <h4 className="font-label-lg text-label-lg mb-2">
                Heatmap Intensity
              </h4>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-2 bg-gradient-to-r from-primary/30 to-secondary rounded-full"></div>
              </div>
              <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
                <span>Low</span>
                <span>Critical</span>
              </div>
            </div>
            {/* Map Controls */}
            <div className="absolute top-gutter right-gutter flex flex-col gap-2">
              <button className="w-10 h-10 glass bg-white/90 rounded-lg flex items-center justify-center border border-outline-variant hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-body-md">
                  add
                </span>
              </button>
              <button className="w-10 h-10 glass bg-white/90 rounded-lg flex items-center justify-center border border-outline-variant hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-body-md">
                  remove
                </span>
              </button>
              <button className="w-10 h-10 glass bg-white/90 rounded-lg flex items-center justify-center border border-outline-variant hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-body-md">
                  layers
                </span>
              </button>
            </div>
          </section>

          {/* Administrative Table Section */}
          <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-[0_4px_20px_rgba(26,28,30,0.04)] overflow-hidden">
            <div className="p-gutter border-b border-outline-variant flex justify-between items-center">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Relatórios Recentes
              </h3>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-outline-variant rounded-lg font-label-md text-label-md hover:bg-surface-container-high transition-all">
                  Filtrar
                </button>
                <button className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary-container transition-all">
                  Ver Todos
                </button>
              </div>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low">
                    <th className="px-gutter py-4 font-label-lg text-label-lg text-on-surface-variant border-b border-outline-variant">
                      Categoria
                    </th>
                    <th className="px-gutter py-4 font-label-lg text-label-lg text-on-surface-variant border-b border-outline-variant">
                      Subcategoria
                    </th>
                    <th className="px-gutter py-4 font-label-lg text-label-lg text-on-surface-variant border-b border-outline-variant">
                      Bairro
                    </th>
                    <th className="px-gutter py-4 font-label-lg text-label-lg text-on-surface-variant border-b border-outline-variant">
                      Status
                    </th>
                    <th className="px-gutter py-4 font-label-lg text-label-lg text-on-surface-variant border-b border-outline-variant text-center">
                      Concordos
                    </th>
                    <th className="px-gutter py-4 font-label-lg text-label-lg text-on-surface-variant border-b border-outline-variant text-right">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  <tr className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-gutter py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-[18px]">
                            engineering
                          </span>
                        </div>
                        <span className="font-body-sm text-body-sm font-medium">
                          Infraestrutura
                        </span>
                      </div>
                    </td>
                    <td className="px-gutter py-4 font-body-sm text-body-sm text-on-surface-variant">
                      Buraco na Via
                    </td>
                    <td className="px-gutter py-4 font-body-sm text-body-sm text-on-surface-variant">
                      Cascata
                    </td>
                    <td className="px-gutter py-4">
                      <span className="px-2 py-1 rounded bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm uppercase tracking-wider">
                        CRÍTICO
                      </span>
                    </td>
                    <td className="px-gutter py-4 text-center font-body-sm text-body-sm font-bold text-on-surface">
                      124
                    </td>
                    <td className="px-gutter py-4 text-right font-body-sm text-body-sm text-on-surface-variant">
                      12 Out, 14:30
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-gutter py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-tertiary/10 flex items-center justify-center text-tertiary">
                          <span className="material-symbols-outlined text-[18px]">
                            light_mode
                          </span>
                        </div>
                        <span className="font-body-sm text-body-sm font-medium">
                          Iluminação
                        </span>
                      </div>
                    </td>
                    <td className="px-gutter py-4 font-body-sm text-body-sm text-on-surface-variant">
                      Lâmpada Queimada
                    </td>
                    <td className="px-gutter py-4 font-body-sm text-body-sm text-on-surface-variant">
                      Fragata
                    </td>
                    <td className="px-gutter py-4">
                      <span className="px-2 py-1 rounded bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm uppercase tracking-wider">
                        ABERTO
                      </span>
                    </td>
                    <td className="px-gutter py-4 text-center font-body-sm text-body-sm font-bold text-on-surface">
                      45
                    </td>
                    <td className="px-gutter py-4 text-right font-body-sm text-body-sm text-on-surface-variant">
                      12 Out, 13:15
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-gutter py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
                          <span className="material-symbols-outlined text-[18px]">
                            delete
                          </span>
                        </div>
                        <span className="font-body-sm text-body-sm font-medium">
                          Limpeza Urbana
                        </span>
                      </div>
                    </td>
                    <td className="px-gutter py-4 font-body-sm text-body-sm text-on-surface-variant">
                      Acúmulo de Lixo
                    </td>
                    <td className="px-gutter py-4 font-body-sm text-body-sm text-on-surface-variant">
                      Maria Izabel
                    </td>
                    <td className="px-gutter py-4">
                      <span className="px-2 py-1 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                        RESOLVIDO
                      </span>
                    </td>
                    <td className="px-gutter py-4 text-center font-body-sm text-body-sm font-bold text-on-surface">
                      12
                    </td>
                    <td className="px-gutter py-4 text-right font-body-sm text-body-sm text-on-surface-variant">
                      11 Out, 18:40
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-gutter py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-secondary/10 flex items-center justify-center text-secondary">
                          <span className="material-symbols-outlined text-[18px]">
                            water_drop
                          </span>
                        </div>
                        <span className="font-body-sm text-body-sm font-medium">
                          Saneamento
                        </span>
                      </div>
                    </td>
                    <td className="px-gutter py-4 font-body-sm text-body-sm text-on-surface-variant">
                      Vazamento de Esgoto
                    </td>
                    <td className="px-gutter py-4 font-body-sm text-body-sm text-on-surface-variant">
                      Palmital
                    </td>
                    <td className="px-gutter py-4">
                      <span className="px-2 py-1 rounded bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm uppercase tracking-wider">
                        CRÍTICO
                      </span>
                    </td>
                    <td className="px-gutter py-4 text-center font-body-sm text-body-sm font-bold text-on-surface">
                      210
                    </td>
                    <td className="px-gutter py-4 text-right font-body-sm text-body-sm text-on-surface-variant">
                      11 Out, 09:20
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-gutter flex items-center justify-between">
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Mostrando 4 de 1.284 resultados
              </p>
              <div className="flex gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined text-body-md">
                    chevron_left
                  </span>
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-primary bg-primary/5 text-primary font-label-sm text-label-sm">
                  1
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container-high transition-colors font-label-sm text-label-sm">
                  2
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container-high transition-colors font-label-sm text-label-sm">
                  3
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined text-body-md">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </section>
    </div>
  );
}

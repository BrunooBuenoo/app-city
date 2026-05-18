import React from "react";
import Link from "next/link";

export default function UsuarioDashboard() {
  return (
    <div className="p-4 md:p-8">
      <div className="max-w-container-max mx-auto">
        {/* Dashboard Header */}
          <div className="mb-8">
            <h2 className="text-headline-md font-headline-md text-on-surface">
              Meu Painel
            </h2>
            <p className="text-body-md text-on-surface-variant">
              Bem-vindo de volta. Veja o que está acontecendo na cidade hoje.
            </p>
          </div>

          {/* Metric Cards Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-6">
            {/* Card 1 */}
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-[0_4px_20px_rgba(26,28,30,0.04)] group hover:border-primary/30 transition-colors flex flex-col mb-4">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <span className="material-symbols-outlined">description</span>
                </div>
                <div className="text-primary text-label-sm font-label-sm bg-primary/5 px-2 py-1 rounded">
                  +12%
                </div>
              </div>
              <p className="text-on-surface-variant text-label-md font-label-md">
                Minhas Reclamações
              </p>
              <h3 className="text-headline-sm font-headline-sm text-on-surface mb-4">
                12
              </h3>
              <div className="h-10 w-full flex items-end gap-1">
                <div className="bg-primary/20 w-full h-1/4 rounded-t-sm"></div>
                <div className="bg-primary/20 w-full h-1/2 rounded-t-sm"></div>
                <div className="bg-primary/20 w-full h-1/3 rounded-t-sm"></div>
                <div className="bg-primary/40 w-full h-2/3 rounded-t-sm"></div>
                <div className="bg-primary w-full h-full rounded-t-sm"></div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-[0_4px_20px_rgba(26,28,30,0.04)] group hover:border-green-500/30 transition-colors flex flex-col mb-4">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-green-100 rounded-lg text-green-700">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
                <div className="text-green-700 text-label-sm font-label-sm bg-green-50 px-2 py-1 rounded">
                  Alta
                </div>
              </div>
              <p className="text-on-surface-variant text-label-md font-label-md">
                Minhas Resolvidas
              </p>
              <h3 className="text-headline-sm font-headline-sm text-on-surface mb-4">
                8
              </h3>
              <div className="h-10 w-full flex items-end gap-1">
                <div className="bg-green-500/20 w-full h-1/4 rounded-t-sm"></div>
                <div className="bg-green-500/20 w-full h-1/3 rounded-t-sm"></div>
                <div className="bg-green-500/40 w-full h-1/2 rounded-t-sm"></div>
                <div className="bg-green-500/60 w-full h-3/4 rounded-t-sm"></div>
                <div className="bg-green-500 w-full h-full rounded-t-sm"></div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-[0_4px_20px_rgba(26,28,30,0.04)] group hover:border-secondary-container/30 transition-colors flex flex-col mb-4">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-secondary-container/10 rounded-lg text-secondary-container">
                  <span className="material-symbols-outlined">pending</span>
                </div>
                <div className="text-secondary-container text-label-sm font-label-sm bg-secondary-container/5 px-2 py-1 rounded">
                  -5%
                </div>
              </div>
              <p className="text-on-surface-variant text-label-md font-label-md">
                Em Andamento
              </p>
              <h3 className="text-headline-sm font-headline-sm text-on-surface mb-4">
                3
              </h3>
              <div className="h-10 w-full flex items-end gap-1">
                <div className="bg-secondary-container/20 w-full h-1/2 rounded-t-sm"></div>
                <div className="bg-secondary-container/40 w-full h-3/4 rounded-t-sm"></div>
                <div className="bg-secondary-container/20 w-full h-2/3 rounded-t-sm"></div>
                <div className="bg-secondary-container/60 w-full h-1/2 rounded-t-sm"></div>
                <div className="bg-secondary-container w-full h-1/3 rounded-t-sm"></div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-[0_4px_20px_rgba(26,28,30,0.04)] group hover:border-tertiary/30 transition-colors flex flex-col mb-4">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-tertiary-fixed rounded-lg text-tertiary">
                  <span className="material-symbols-outlined">favorite</span>
                </div>
                <div className="text-tertiary text-label-sm font-label-sm bg-tertiary-fixed/50 px-2 py-1 rounded">
                  +42
                </div>
              </div>
              <p className="text-on-surface-variant text-label-md font-label-md">
                Concordos Recebidos
              </p>
              <h3 className="text-headline-sm font-headline-sm text-on-surface mb-4">
                45
              </h3>
              <div className="h-10 w-full flex items-end gap-1">
                <div className="bg-tertiary/20 w-full h-1/4 rounded-t-sm"></div>
                <div className="bg-tertiary/20 w-full h-1/2 rounded-t-sm"></div>
                <div className="bg-tertiary/40 w-full h-3/4 rounded-t-sm"></div>
                <div className="bg-tertiary/60 w-full h-5/6 rounded-t-sm"></div>
                <div className="bg-tertiary w-full h-full rounded-t-sm"></div>
              </div>
            </div>
          </div>

          {/* Recent Activity Table Section */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-[0_4px_20px_rgba(26,28,30,0.04)] overflow-hidden flex-1 flex flex-col mb-4">
            <div className="p-6 border-b border-outline-variant flex justify-between items-center">
              <h3 className="text-headline-sm font-headline-sm text-on-surface">
                Meus Relatórios Recentes
              </h3>
              <button className="text-primary text-label-lg font-label-lg hover:underline transition-all">
                Ver todos
              </button>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    <th className="px-6 py-4 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-4 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider text-center">
                      Concordos
                    </th>
                    <th className="px-6 py-4 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">
                      Localização
                    </th>
                    <th className="px-6 py-4 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider text-right">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {/* Row 1 */}
                  <tr className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                          <span className="material-symbols-outlined text-lg">
                            lightbulb
                          </span>
                        </div>
                        <span className="text-body-md font-medium text-on-surface">
                          Iluminação Pública
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 rounded-full text-label-sm font-label-sm bg-secondary-container/10 text-secondary-container">
                        Em Andamento
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex items-center justify-center gap-1 text-on-surface-variant">
                        <span
                          className="material-symbols-outlined text-sm text-tertiary"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          favorite
                        </span>
                        <span className="text-body-sm">124</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-on-surface-variant">
                        <span className="material-symbols-outlined text-sm">
                          map
                        </span>
                        <span className="text-body-sm">
                          Av. Sampaio Vidal, Centro
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span className="text-body-sm text-on-surface-variant">
                        Hoje, 14:30
                      </span>
                    </td>
                  </tr>
                  {/* Row 2 */}
                  <tr className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
                          <span className="material-symbols-outlined text-lg">
                            construction
                          </span>
                        </div>
                        <span className="text-body-md font-medium text-on-surface">
                          Buraco na Via
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 rounded-full text-label-sm font-label-sm bg-green-100 text-green-700">
                        Resolvido
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex items-center justify-center gap-1 text-on-surface-variant">
                        <span
                          className="material-symbols-outlined text-sm text-tertiary"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          favorite
                        </span>
                        <span className="text-body-sm">89</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-on-surface-variant">
                        <span className="material-symbols-outlined text-sm">
                          map
                        </span>
                        <span className="text-body-sm">
                          Rua das Azaleias, 452
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span className="text-body-sm text-on-surface-variant">
                        Ontem, 09:15
                      </span>
                    </td>
                  </tr>
                  {/* Row 3 */}
                  <tr className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                          <span className="material-symbols-outlined text-lg">
                            delete
                          </span>
                        </div>
                        <span className="text-body-md font-medium text-on-surface">
                          Coleta de Lixo
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 rounded-full text-label-sm font-label-sm bg-primary/10 text-primary">
                        Aguardando
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex items-center justify-center gap-1 text-on-surface-variant">
                        <span
                          className="material-symbols-outlined text-sm text-tertiary"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          favorite
                        </span>
                        <span className="text-body-sm">45</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-on-surface-variant">
                        <span className="material-symbols-outlined text-sm">
                          map
                        </span>
                        <span className="text-body-sm">
                          Bairro Jd. Marília
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span className="text-body-sm text-on-surface-variant">
                        12 Mai, 16:40
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
          </div>
        </div>
      </div>
    </div>
  );
}

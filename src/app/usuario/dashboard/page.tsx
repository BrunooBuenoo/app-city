import React from "react";
import Link from "next/link";

export default function UsuarioDashboard() {
  return (
    <div className="bg-surface selection:bg-primary/10 min-h-screen">
      {/* SideNavBar Anchor */}
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-outline-variant bg-surface-container-lowest shadow-[0_4px_20px_rgba(26,28,30,0.04)] flex flex-col py-8 px-4 gap-unit z-50">
        <div className="mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center text-white">
              <span className="material-symbols-outlined">location_city</span>
            </div>
            <div>
              <h1 className="text-label-lg font-headline-md font-bold tracking-tight text-primary">
                Sac do Marilia ao Contrário
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                Gestão Urbana
              </p>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          <Link
            href="/usuario/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 text-primary font-bold bg-primary-fixed/30 rounded-lg transition-all duration-150 scale-98"
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-body-md font-body-md">Início</span>
          </Link>
          <Link
            href="/usuario/minhas-reclamacoes"
            className="flex items-center gap-3 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-all duration-200"
          >
            <span className="material-symbols-outlined">report_problem</span>
            <span className="text-body-md font-body-md">
              Minhas Reclamações
            </span>
          </Link>
          <Link
            href="/usuario/historico"
            className="flex items-center gap-3 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-all duration-200"
          >
            <span className="material-symbols-outlined">history</span>
            <span className="text-body-md font-body-md">Histórico</span>
          </Link>
          <Link
            href="/usuario/perfil"
            className="flex items-center gap-3 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-all duration-200"
          >
            <span className="material-symbols-outlined">person</span>
            <span className="text-body-md font-body-md">Perfil</span>
          </Link>
        </nav>
        <div className="mt-auto">
          <Link href="/reclamacao/nova">
            <button className="w-full bg-primary-container text-white py-3 rounded-xl font-label-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined text-sm">add</span>
              Novo Chamado
            </button>
          </Link>
        </div>
      </aside>

      {/* TopAppBar Anchor */}
      <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 bg-surface/80 backdrop-blur-md border-b border-outline-variant z-40">
        <div className="flex justify-between items-center px-8 w-full h-full">
          <div className="flex items-center flex-1 max-w-xl">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                search
              </span>
              <input
                className="w-full bg-surface-container-low border-none rounded-full py-2 pl-10 text-body-sm focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="Pesquisar chamados, protocolos..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <div className="h-8 w-px bg-outline-variant mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-label-md font-label-md text-on-surface font-semibold">
                  Gabriel Bueno
                </p>
                <p className="text-[10px] text-on-surface-variant">
                  Cidadão Mariliense
                </p>
              </div>
              <img
                alt="Avatar"
                className="h-10 w-10 rounded-full border-2 border-primary/20 object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUiQz7Tjoo97vkOGIzdUNGRnwZ-0DhbPUVHrNIvo4tohhvRHGJhRWQkUdAdMvJC9SE00HDQGOWra7YuvRuK2FYcwsKpwXfnPYp7ZDJNBS888hBorpoAQqspZ6me2s6pOqosi1acVv27jUNRjay7KkU3dupyzwcARpcLiq5rlGXxATVeLVR2Dh5XJbm7kXeiSN9k9OauTFCSBsX-tz3fpArt_JtcYb24oR3i1io9PXOuYg_iwlHzm3j5Lf3fdOo-OHWKWyMid9m-RNh"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="ml-64 pt-24 pb-12 px-8 min-h-screen">
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
      </main>
    </div>
  );
}

import React from "react";
import Link from "next/link";

export default function MinhasReclamacoes() {
  return (
    <div className="bg-surface-bright text-on-surface font-body-md min-h-screen flex flex-col">
      {/* TopAppBar */}
      <header className="bg-surface/80 backdrop-blur-md fixed top-0 w-full z-50 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 w-full max-w-container-max mx-auto">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[24px]">
              menu
            </span>
            <h1 className="font-headline-sm text-headline-sm font-bold text-primary">
              Minhas Reclamações
            </h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden border border-outline-variant">
            <img
              alt="Perfil"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqMZs1urs4ryGlMztVjXzOJREPLK3_gxKe8NkyUnF5RaEjEyV73DYipo0Xm7IRuP3e0jUm_SjfjMFeFFWhvYt2VjP7DIp9QK6SCahVwyaehLcKZxu-6CCDUeqZdGw-wZa6D7JVEbCwJvmFotK49SQhpZ52FCk2u4toFFwIdtmh2TVTPB02IYw-l7tmQdRCSo09YlkySFhy8vWffhCHzSizZsJsaVs-UNh79GaKZzGFBoYwdkLDtoPEvBZ6uVXihM7D3py3e-BkZatu"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 mt-16 mb-24 px-4 overflow-x-hidden">
        {/* Summary Cards (Horizontal Scrollable) */}
        <section className="mt-6">
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
            <div className="min-w-[140px] flex-shrink-0 bg-surface-container-lowest p-4 rounded-xl shadow-[0_4px_20px_rgba(26,28,30,0.04)] border border-outline-variant">
              <span className="font-label-md text-label-md text-on-surface-variant block mb-1">
                Total
              </span>
              <span className="font-headline-md text-headline-md font-bold text-primary">
                12
              </span>
            </div>
            <div className="min-w-[140px] flex-shrink-0 bg-surface-container-lowest p-4 rounded-xl shadow-[0_4px_20px_rgba(26,28,30,0.04)] border border-outline-variant">
              <span className="font-label-md text-label-md text-on-surface-variant block mb-1">
                Resolvidas
              </span>
              <span className="font-headline-md text-headline-md font-bold text-secondary">
                8
              </span>
            </div>
            <div className="min-w-[140px] flex-shrink-0 bg-surface-container-lowest p-4 rounded-xl shadow-[0_4px_20px_rgba(26,28,30,0.04)] border border-outline-variant">
              <span className="font-label-md text-label-md text-on-surface-variant block mb-1">
                Em Andamento
              </span>
              <span className="font-headline-md text-headline-md font-bold text-primary-container">
                3
              </span>
            </div>
            <div className="min-w-[140px] flex-shrink-0 bg-surface-container-lowest p-4 rounded-xl shadow-[0_4px_20px_rgba(26,28,30,0.04)] border border-outline-variant">
              <span className="font-label-md text-label-md text-on-surface-variant block mb-1">
                Concordos
              </span>
              <div className="flex items-center gap-1">
                <span className="font-headline-md text-headline-md font-bold text-on-surface">
                  45
                </span>
                <span
                  className="material-symbols-outlined text-secondary text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  favorite
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Complaints List */}
        <section className="mt-8 space-y-4">
          <h2 className="font-label-lg text-label-lg text-outline uppercase tracking-wider">
            Recentes
          </h2>
          {/* Card 1 */}
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-[0_4px_20px_rgba(26,28,30,0.04)] border border-outline-variant flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary-container/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary">
                    water_damage
                  </span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-[16px] font-bold text-on-surface">
                    Vazamento de Esgoto
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Infraestrutura
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-primary-container/10 text-primary-container text-label-sm font-semibold rounded-full">
                Em Andamento
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-outline">
                <span className="material-symbols-outlined text-[18px]">
                  location_on
                </span>
                <span className="font-body-sm text-body-sm">
                  Rua das Flores, 123 - Centro
                </span>
              </div>
              <div className="flex items-center gap-2 text-outline">
                <span className="material-symbols-outlined text-[18px]">
                  calendar_today
                </span>
                <span className="font-body-sm text-body-sm">
                  12 de Outubro, 2023
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-surface-variant">
              <div className="flex items-center gap-1 text-secondary">
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  favorite
                </span>
                <span className="font-label-md text-label-md font-bold">
                  24 Concordos
                </span>
              </div>
              <button className="text-primary font-label-md text-label-md flex items-center gap-1">
                Ver detalhes{" "}
                <span className="material-symbols-outlined text-[16px]">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
          {/* Card 2 */}
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-[0_4px_20px_rgba(26,28,30,0.04)] border border-outline-variant flex flex-col gap-3 opacity-90">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-tertiary-container/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-tertiary">
                    lightbulb
                  </span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-[16px] font-bold text-on-surface">
                    Iluminação Pública
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Serviços
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-label-sm font-semibold rounded-full">
                Resolvido
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-outline">
                <span className="material-symbols-outlined text-[18px]">
                  location_on
                </span>
                <span className="font-body-sm text-body-sm">
                  Av. Sampaio Vidal, 450
                </span>
              </div>
              <div className="flex items-center gap-2 text-outline">
                <span className="material-symbols-outlined text-[18px]">
                  calendar_today
                </span>
                <span className="font-body-sm text-body-sm">
                  08 de Outubro, 2023
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-surface-variant">
              <div className="flex items-center gap-1 text-secondary">
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  favorite
                </span>
                <span className="font-label-md text-label-md font-bold">
                  12 Concordos
                </span>
              </div>
              <button className="text-primary font-label-md text-label-md flex items-center gap-1">
                Ver detalhes{" "}
                <span className="material-symbols-outlined text-[16px]">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
          {/* Card 3 */}
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-[0_4px_20px_rgba(26,28,30,0.04)] border border-outline-variant flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">
                    delete
                  </span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-[16px] font-bold text-on-surface">
                    Acúmulo de Lixo
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Saneamento
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-primary-container/10 text-primary-container text-label-sm font-semibold rounded-full">
                Em Andamento
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-outline">
                <span className="material-symbols-outlined text-[18px]">
                  location_on
                </span>
                <span className="font-body-sm text-body-sm">
                  Praça Saturnino de Brito
                </span>
              </div>
              <div className="flex items-center gap-2 text-outline">
                <span className="material-symbols-outlined text-[18px]">
                  calendar_today
                </span>
                <span className="font-body-sm text-body-sm">
                  05 de Outubro, 2023
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-surface-variant">
              <div className="flex items-center gap-1 text-secondary">
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  favorite
                </span>
                <span className="font-label-md text-label-md font-bold">
                  9 Concordos
                </span>
              </div>
              <button className="text-primary font-label-md text-label-md flex items-center gap-1">
                Ver detalhes{" "}
                <span className="material-symbols-outlined text-[16px]">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Action Button */}
      <Link href="/reclamacao/nova">
        <button className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center transition-transform active:scale-90 z-50">
          <span className="material-symbols-outlined text-[28px]">add</span>
        </button>
      </Link>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-surface-container-lowest/80 dark:bg-surface-container-lowest/80 backdrop-blur-md shadow-[0_-4px_20px_rgba(26,28,30,0.04)] rounded-t-xl flex justify-around items-center px-4 pb-6 pt-2">
        <Link
          href="/mapa"
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-surface-variant px-4 py-1 hover:text-primary transition-colors active:scale-90 duration-200"
        >
          <span className="material-symbols-outlined text-[24px]">home</span>
          <span className="font-label-md text-label-md">Início</span>
        </Link>
        <Link
          href="/usuario/minhas-reclamacoes"
          className="flex flex-col items-center justify-center bg-secondary-container dark:bg-secondary-fixed-dim text-on-secondary-container dark:text-on-secondary-fixed rounded-full px-4 py-1 hover:text-primary transition-colors active:scale-90 duration-200"
        >
          <span className="material-symbols-outlined text-[24px]">
            assignment
          </span>
          <span className="font-label-md text-label-md">Reclamações</span>
        </Link>
        <Link
          href="#"
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-surface-variant px-4 py-1 hover:text-primary transition-colors active:scale-90 duration-200"
        >
          <span className="material-symbols-outlined text-[24px]">
            notifications
          </span>
          <span className="font-label-md text-label-md">Alertas</span>
        </Link>
        <Link
          href="/usuario/perfil"
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-surface-variant px-4 py-1 hover:text-primary transition-colors active:scale-90 duration-200"
        >
          <span className="material-symbols-outlined text-[24px]">person</span>
          <span className="font-label-md text-label-md">Perfil</span>
        </Link>
      </nav>
    </div>
  );
}

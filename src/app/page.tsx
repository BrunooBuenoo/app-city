import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-surface-bright flex flex-col font-body-md text-on-surface">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-surface-bright/80 backdrop-blur-md border-b border-outline-variant px-4 py-3 md:px-8 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-on-primary text-[24px]">
              location_city
            </span>
          </div>
          <div>
            <h1 className="font-headline-sm text-headline-sm font-bold text-primary leading-tight">
              SAC Marília
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dashboard"
            className="hidden md:flex items-center gap-2 px-4 py-2 text-on-surface-variant font-label-md hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
            Acesso Restrito
          </Link>
          <Link
            href="/usuario/dashboard"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-xl font-label-lg shadow-sm hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">login</span>
            <span className="hidden sm:inline">Acessar</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <div className="inline-block w-fit mx-auto lg:mx-0 px-3 py-1 rounded-full bg-secondary-container/30 text-secondary-container font-label-sm mb-2 border border-secondary-container/20">
              Transformando a nossa cidade
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-on-surface tracking-tight leading-[1.1]">
              Cuidando de <span className="text-primary">Marília</span>, Juntos.
            </h2>
            <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto lg:mx-0">
              Sua voz faz a diferença. Reporte problemas de infraestrutura, acompanhe solicitações e ajude a construir uma cidade melhor para todos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-4">
              <Link
                href="/reclamacao/nova"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-on-primary rounded-xl font-headline-sm shadow-md hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-2xl">add_a_photo</span>
                Reportar Problema
              </Link>
              <Link
                href="/mapa"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-surface-container border-2 border-outline-variant text-on-surface rounded-xl font-headline-sm shadow-sm hover:border-primary hover:text-primary transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-2xl">map</span>
                Ver Mapa
              </Link>
            </div>
          </div>
          
          {/* Hero Illustration (Mocked with decorative elements) */}
          <div className="relative h-[400px] w-full rounded-3xl overflow-hidden shadow-2xl border border-outline-variant bg-surface-container-highest">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeTThu0vAiC4G_6CGCUb9xU6o7ENl4Y6-Mrl6gFAspsKB8Ws-5uJhJebQZzgq6LVN-WCUUILC__ThDKanwUtCPEx9iYIaXOVKTjMr5j5YyAXWN-zukchrUbgLems0dx7lcuAhpwDfdRahksRRmMFhfh5BnuLM7ffHUl22ExCb7Y_RGSma4K0_jcxTtTTcAmnS8pE_0jFu50Ck99Zqf4oqHMNKySy94EIG3G7PKzbVqPe11JmHMofKivDpp-SFT3f4csoddxITZU2GU"
              alt="Mapa de Marília"
              className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay"
            />
            {/* Floating Mock Cards */}
            <div className="absolute top-8 right-8 glass-panel bg-white/90 p-4 rounded-xl shadow-lg border border-white/20 animate-bounce-slow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
                <div>
                  <p className="font-label-md text-on-surface">Buraco tapado</p>
                  <p className="font-body-sm text-on-surface-variant">Há 5 minutos</p>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-12 left-8 glass-panel bg-white/90 p-4 rounded-xl shadow-lg border border-white/20">
               <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">lightbulb</span>
                </div>
                <div>
                  <p className="font-label-md text-on-surface">Nova solicitação</p>
                  <p className="font-body-sm text-on-surface-variant">Iluminação Pública</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full bg-surface-container-lowest py-20 px-4 md:px-8 border-t border-outline-variant">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-on-surface mb-4">Como funciona?</h3>
              <p className="text-on-surface-variant max-w-2xl mx-auto text-lg">
                Um processo simples, transparente e eficiente para melhorar o ambiente urbano da nossa cidade.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-surface-bright p-8 rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow group flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-on-primary transition-all duration-300">
                  <span className="material-symbols-outlined text-3xl">add_location_alt</span>
                </div>
                <h4 className="text-xl font-bold text-on-surface mb-3">1. Reporte o Problema</h4>
                <p className="text-on-surface-variant leading-relaxed">
                  Tire uma foto, descreva o que aconteceu e marque no mapa. Em menos de 2 minutos sua solicitação é enviada.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-surface-bright p-8 rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow group flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-6 group-hover:scale-110 group-hover:bg-secondary group-hover:text-on-secondary transition-all duration-300">
                  <span className="material-symbols-outlined text-3xl">track_changes</span>
                </div>
                <h4 className="text-xl font-bold text-on-surface mb-3">2. Acompanhe o Status</h4>
                <p className="text-on-surface-variant leading-relaxed">
                  Receba notificações sobre o andamento e interaja com a comunidade dando "Concordo" em outros relatos.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-surface-bright p-8 rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow group flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-tertiary/10 rounded-2xl flex items-center justify-center text-tertiary mb-6 group-hover:scale-110 group-hover:bg-tertiary group-hover:text-on-tertiary transition-all duration-300">
                  <span className="material-symbols-outlined text-3xl">task_alt</span>
                </div>
                <h4 className="text-xl font-bold text-on-surface mb-3">3. Problema Resolvido</h4>
                <p className="text-on-surface-variant leading-relaxed">
                  As equipes da prefeitura atuam com base nos dados gerados e o problema é solucionado com eficiência.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container border-t border-outline-variant py-8 px-4 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 bg-surface-container-high rounded-full flex items-center justify-center">
             <span className="material-symbols-outlined text-on-surface-variant">location_city</span>
          </div>
          <p className="text-on-surface-variant font-label-sm">
            © 2026 SAC Marília. Plataforma de Gestão Urbana.
          </p>
          <div className="flex gap-4">
             <Link href="/admin/dashboard" className="text-on-surface-variant hover:text-primary font-label-sm transition-colors">Portal Administrativo</Link>
             <span className="text-outline-variant">•</span>
             <Link href="/usuario/dashboard" className="text-on-surface-variant hover:text-primary font-label-sm transition-colors">Portal do Cidadão</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

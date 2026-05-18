import React from "react";
import Link from "next/link";

export default function NovaReclamacao() {
  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen flex flex-col">
      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 bg-surface-bright dark:bg-surface-dim border-b border-outline-variant dark:border-outline shadow-sm dark:shadow-none flex items-center justify-between px-margin-mobile h-16">
        <div className="flex items-center gap-4">
          <Link href="/usuario/dashboard">
            <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-low transition-colors active:scale-95 duration-100">
              <span className="material-symbols-outlined text-primary">
                arrow_back
              </span>
            </button>
          </Link>
          <div className="flex flex-col">
            <h1 className="font-headline-sm text-headline-sm font-bold text-primary">
              Novo Relatório
            </h1>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Passo 1 de 3
            </span>
          </div>
        </div>
        <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-low transition-colors active:scale-95 duration-100">
          <span className="material-symbols-outlined text-primary">
            more_vert
          </span>
        </button>
      </header>

      <main className="pt-20 pb-32 px-margin-mobile flex-1">
        {/* Category Selection (2-column Grid) */}
        <section className="mb-gutter">
          <h2 className="font-headline-sm text-headline-sm mb-4 text-on-surface">
            Selecione a Categoria
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center justify-center p-6 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_4px_20px_rgba(26,28,30,0.04)] hover:border-primary transition-all active:scale-95">
              <span className="material-symbols-outlined text-primary mb-2 text-3xl">
                medical_services
              </span>
              <span className="font-label-lg text-label-lg text-on-surface-variant">
                Saúde
              </span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_4px_20px_rgba(26,28,30,0.04)] hover:border-primary transition-all active:scale-95">
              <span className="material-symbols-outlined text-primary mb-2 text-3xl">
                school
              </span>
              <span className="font-label-lg text-label-lg text-on-surface-variant">
                Educação
              </span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_4px_20px_rgba(26,28,30,0.04)] hover:border-primary transition-all active:scale-95">
              <span className="material-symbols-outlined text-primary mb-2 text-3xl">
                security
              </span>
              <span className="font-label-lg text-label-lg text-on-surface-variant">
                Segurança
              </span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 bg-primary-container text-on-primary-container border-2 border-primary rounded-xl shadow-[0_4px_20px_rgba(26,28,30,0.08)] transition-all active:scale-95">
              <span className="material-symbols-outlined mb-2 text-3xl">
                construction
              </span>
              <span className="font-label-lg text-label-lg">
                Infraestrutura
              </span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_4px_20px_rgba(26,28,30,0.04)] hover:border-primary transition-all active:scale-95">
              <span className="material-symbols-outlined text-primary mb-2 text-3xl">
                directions_bus
              </span>
              <span className="font-label-lg text-label-lg text-on-surface-variant">
                Mobilidade
              </span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_4px_20px_rgba(26,28,30,0.04)] hover:border-primary transition-all active:scale-95">
              <span className="material-symbols-outlined text-primary mb-2 text-3xl">
                eco
              </span>
              <span className="font-label-lg text-label-lg text-on-surface-variant">
                Meio Ambiente
              </span>
            </button>
          </div>
        </section>

        {/* Specific Problem Tags */}
        <section className="mb-gutter overflow-hidden">
          <h2 className="font-label-lg text-label-lg mb-3 text-on-surface-variant uppercase tracking-wider">
            TIPO DE PROBLEMA
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            <span className="flex-shrink-0 px-4 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md">
              Iluminação Pública
            </span>
            <span className="flex-shrink-0 px-4 py-2 rounded-full bg-surface-container-high text-on-surface-variant font-label-md text-label-md">
              Patrulhamento Insuficiente
            </span>
            <span className="flex-shrink-0 px-4 py-2 rounded-full bg-surface-container-high text-on-surface-variant font-label-md text-label-md">
              Ponto de Tráfico
            </span>
            <span className="flex-shrink-0 px-4 py-2 rounded-full bg-surface-container-high text-on-surface-variant font-label-md text-label-md">
              Vandalismo
            </span>
            <span className="flex-shrink-0 px-4 py-2 rounded-full bg-surface-container-high text-on-surface-variant font-label-md text-label-md">
              Outros
            </span>
          </div>
        </section>

        {/* Location Card */}
        <section className="mb-gutter">
          <h2 className="font-headline-sm text-headline-sm mb-4 text-on-surface">
            Localização
          </h2>
          <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-md border border-outline-variant bg-surface-container">
            <img
              alt="Mapa da Avenida Paulista"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHP97WXNciPj_Mr3qDSABTAv9jWn3avzOpclYVFwGK8LUqrU9V8CG7ZBHDw7bkbkEZskoUaGPwcismR7Qmi40MaYQ37HTWO6PbyykB-nI5lyBBQi5seD1drVnYkibFWtDuz3fqZmLXJul2XEl0upb7bbOyhI0zmLooOfvbaRLYkm3jIJiaoObF7o_Xi7HxEFdeMOz-4mfuro64iAwdf9Gj2m7MUugZixxE97dcNqDH1Z_d-WT8gxIIsEWXsA_5Jx8zhPiWRgJQhFPK"
            />
            <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
              <span
                className="material-symbols-outlined text-secondary text-5xl drop-shadow-lg"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                location_on
              </span>
            </div>
          </div>
          <div className="mt-4 p-4 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-outline">
                near_me
              </span>
              <span className="font-body-md text-body-md text-on-surface">
                Av. Paulista, 1578
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="py-2.5 rounded-lg border-2 border-primary text-primary font-label-lg text-label-lg flex items-center justify-center gap-2 active:bg-primary-fixed">
                <span className="material-symbols-outlined text-lg">check</span>{" "}
                No Local
              </button>
              <button className="py-2.5 rounded-lg border border-outline-variant text-on-surface-variant font-label-lg text-label-lg flex items-center justify-center gap-2 active:bg-surface-container">
                <span className="material-symbols-outlined text-lg">
                  edit_location
                </span>{" "}
                Outro Local
              </button>
            </div>
          </div>
        </section>

        {/* Form Fields */}
        <section className="mb-gutter space-y-6">
          <div>
            <label className="block font-label-lg text-label-lg mb-2 text-on-surface-variant">
              Título do Relatório
            </label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-body-md font-body-md"
              placeholder="Ex: Poste queimado na calçada"
              type="text"
            />
          </div>
          <div>
            <label className="block font-label-lg text-label-lg mb-2 text-on-surface-variant">
              Descrição Detalhada
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-body-md font-body-md resize-none"
              placeholder="Descreva o ocorrido com o máximo de detalhes possível..."
              rows={4}
            ></textarea>
          </div>
        </section>

        {/* Evidence Upload */}
        <section className="mb-gutter">
          <h2 className="font-headline-sm text-headline-sm mb-4 text-on-surface">
            Anexar Evidências
          </h2>
          <div className="border-2 border-dashed border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center bg-surface-container-lowest active:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-primary text-4xl mb-3">
              add_a_photo
            </span>
            <p className="font-label-lg text-label-lg text-on-surface text-center">
              Toque para tirar foto ou fazer upload
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              PNG, JPG ou MOV até 10MB
            </p>
          </div>
        </section>

        {/* Privacy Toggle */}
        <section className="mb-gutter flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-on-surface-variant">
              visibility_off
            </span>
            <div>
              <p className="font-label-lg text-label-lg text-on-surface">
                Publicar anonimamente
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Seu nome não será exibido publicamente
              </p>
            </div>
          </div>
          <div className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-outline-variant">
            <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
          </div>
        </section>

        {/* Action Button */}
        <div className="mt-8 mb-12">
          <button className="w-full py-4 rounded-xl bg-primary text-on-primary font-headline-sm text-headline-sm shadow-md active:scale-95 transition-transform flex items-center justify-center gap-3">
            Publicar Reclamação{" "}
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 bg-surface-container-lowest/80 dark:bg-surface-container-lowest/80 backdrop-blur-md shadow-[0_-4px_20px_rgba(26,28,30,0.04)] rounded-t-xl">
        <Link
          href="/usuario/dashboard"
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-surface-variant px-4 py-1 hover:text-primary transition-colors active:scale-90 duration-200"
        >
          <span className="material-symbols-outlined">home</span>
          <span className="font-label-md text-label-md">Início</span>
        </Link>
        <Link
          href="/usuario/minhas-reclamacoes"
          className="flex flex-col items-center justify-center bg-secondary-container dark:bg-secondary-fixed-dim text-on-secondary-container dark:text-on-secondary-fixed rounded-full px-4 py-1 hover:text-primary transition-colors active:scale-90 duration-200"
        >
          <span className="material-symbols-outlined">assignment</span>
          <span className="font-label-md text-label-md">Reclamações</span>
        </Link>
        <Link
          href="#"
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-surface-variant px-4 py-1 hover:text-primary transition-colors active:scale-90 duration-200"
        >
          <span className="material-symbols-outlined">notifications</span>
          <span className="font-label-md text-label-md">Alertas</span>
        </Link>
        <Link
          href="/usuario/perfil"
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-surface-variant px-4 py-1 hover:text-primary transition-colors active:scale-90 duration-200"
        >
          <span className="material-symbols-outlined">person</span>
          <span className="font-label-md text-label-md">Perfil</span>
        </Link>
      </nav>
    </div>
  );
}

import React from "react";
import Link from "next/link";

export default function CompletarPerfil() {
  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto w-full">
      <main className="md:bg-surface-container-lowest md:p-8 md:rounded-2xl md:shadow-sm md:border md:border-outline-variant">
        {/* Header Section */}
        <section className="mb-10">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-2">
            Complete seu perfil
          </h2>
          <p className="font-body-md text-on-surface-variant leading-relaxed">
            Estamos quase lá! Personalize sua conta para começar a monitorar sua cidade.
          </p>
        </section>

        {/* Avatar Selection */}
        <section className="mb-10">
          <h3 className="font-label-lg text-label-lg text-on-surface-variant mb-4 tracking-widest">
            ESCOLHA SEU AVATAR
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth no-scrollbar">
            <button className="relative flex-shrink-0 w-20 h-20 rounded-full border-2 border-dashed border-outline-variant flex items-center justify-center bg-surface-container-low hover:bg-surface-container-high transition-colors active:scale-95">
              <span className="material-symbols-outlined text-outline text-3xl">
                photo_camera
              </span>
            </button>
            <div className="flex-shrink-0 w-20 h-20 rounded-full overflow-hidden ring-4 ring-primary ring-offset-2 active:scale-95 transition-all">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida/ADBb0ujBsNHyRIngoG87HUmKB3MsQFMv3Mq1gWaeIcwjwRbQbsnmeJ-59eUayAlDEsFWUz3NQ399YD5FVPk72OG5nWvzgZDulgbsj5r9FzfMrJXsmwka7-gXgxb5Z7YKT-S1vmn0CwvmHKcgEkBiUEXN5BENa74Ynh-P9ASGHmLrddd3sz6G53fhZMATuaprO-ErrSvolzX0kwZ8jCaWYVa2kwWfXB0fYA5JLaOHgE2Fj5AqRPa7IcXvzeCTUKqv"
              />
            </div>
            <div className="flex-shrink-0 w-20 h-20 rounded-full overflow-hidden border border-outline-variant active:scale-95 transition-all">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida/ADBb0ugSdL-0dDuETpArMU703soHpgmfgME4CbA8IcTVVhoglVL8i9BaXEwGCmBn9BKPMgmrA7Y3W3VIF4-blObe3Qu3dxugsi7Mghw4zRRnnnpyViOdqx7YH0Z8ez4PuXoiENBJtv8-VC_UhF0qnVGdm1DUWypTy3PTRaJr_TC3L-HDCQytA_huimmT-DQxfbT4A70Aua_A-jUjs-3eKon4brwwgBRssOXj-3a8qwRNv7l5H1UeUX2uMsOX6nXf"
              />
            </div>
            <div className="flex-shrink-0 w-20 h-20 rounded-full overflow-hidden border border-outline-variant active:scale-95 transition-all">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida/ADBb0ugZU6uUvrqpCTTzsksixlGeqy_GJozG4sWCvBxI9sbML-xZGxGr_AHFd2Qwv30HL7eUEkzjStsY5fZcHNW-5oR-qSnlstGxTTT3BIMBqh_NMijjbe1vYQdXnupOJY741p5dzMSVHJ-P1ZDVZgGYj7LGs5kDwvWWoKc1M_DGqbt2UsdL9WXghq4HR5S0of_zusPzRNO_XrEyVsvZbRy7JF9oxJ4w08V_zUK6pfrt89zuLH9PZU2-oNa6Rq0Y"
              />
            </div>
            <div className="flex-shrink-0 w-20 h-20 rounded-full overflow-hidden border border-outline-variant active:scale-95 transition-all">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida/ADBb0ujUaRY98jo2ldlU9KqLuW4uAdylWKqb3sFxcdJng-vOB-TvLN9yIDy0GGICYhB2RvzG4iEXjlKkyPcODAOxUKWr6kKbjXmqfAdASE1RtJUzv5g6WDLaerFP1ECKbFxFfc-UbrJDBKynfnOLBBfDChwToPL_MDpWd1AZZePSgUwE1SZDeIfayIzQn32wRKRqr5GqesVNp4wVQJH3BNw3fI1oOHpDZ5uLYQgMvQRSVPnq67msznk0J5OnHbG_"
              />
            </div>
          </div>
        </section>

        {/* Form Fields */}
        <section className="space-y-6 mb-10">
          <div className="space-y-2">
            <label
              className="font-label-lg text-label-lg text-on-surface ml-1"
              htmlFor="full_name"
            >
              Nome Completo
            </label>
            <input
              className="w-full h-14 px-4 bg-surface-container-lowest border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-body-md"
              id="full_name"
              placeholder="Ex: Maria Silva"
              type="text"
            />
          </div>
          <div className="space-y-2">
            <label
              className="font-label-lg text-label-lg text-on-surface ml-1"
              htmlFor="email"
            >
              E-mail
            </label>
            <input
              className="w-full h-14 px-4 bg-surface-container-lowest border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-body-md"
              id="email"
              placeholder="nome@exemplo.com"
              type="email"
            />
          </div>
          <div className="space-y-2">
            <label
              className="font-label-lg text-label-lg text-on-surface ml-1"
              htmlFor="phone"
            >
              Celular
            </label>
            <input
              className="w-full h-14 px-4 bg-surface-container-lowest border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-body-md"
              id="phone"
              placeholder="(11) 99999-9999"
              type="tel"
            />
          </div>
        </section>

        {/* Age Range Selection */}
        <section className="mb-10">
          <h3 className="font-label-lg text-label-lg text-on-surface ml-1 mb-4">
            Faixa Etária
          </h3>
          <div className="flex flex-wrap gap-2">
            <button className="px-5 py-2.5 rounded-full border border-outline-variant bg-surface-container-lowest font-label-md text-on-surface-variant hover:border-primary hover:text-primary transition-all active:scale-95">
              13-17
            </button>
            <button className="px-5 py-2.5 rounded-full bg-primary-container text-on-primary-container font-label-md transition-all shadow-sm active:scale-95">
              18-24
            </button>
            <button className="px-5 py-2.5 rounded-full border border-outline-variant bg-surface-container-lowest font-label-md text-on-surface-variant hover:border-primary hover:text-primary transition-all active:scale-95">
              25-34
            </button>
            <button className="px-5 py-2.5 rounded-full border border-outline-variant bg-surface-container-lowest font-label-md text-on-surface-variant hover:border-primary hover:text-primary transition-all active:scale-95">
              35-44
            </button>
            <button className="px-5 py-2.5 rounded-full border border-outline-variant bg-surface-container-lowest font-label-md text-on-surface-variant hover:border-primary hover:text-primary transition-all active:scale-95">
              45-59
            </button>
            <button className="px-5 py-2.5 rounded-full border border-outline-variant bg-surface-container-lowest font-label-md text-on-surface-variant hover:border-primary hover:text-primary transition-all active:scale-95">
              60+
            </button>
          </div>
        </section>

        {/* Gender Selection */}
        <section className="mb-12">
          <h3 className="font-label-lg text-label-lg text-on-surface ml-1 mb-4">
            Gênero
          </h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-4 rounded-xl border border-outline-variant bg-surface-container-lowest active:bg-surface-container transition-colors group cursor-pointer">
              <span className="font-body-md text-on-surface">Masculino</span>
              <div className="w-5 h-5 rounded-full border-2 border-outline-variant group-active:border-primary flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-primary opacity-0 group-hover:opacity-50 transition-opacity"></div>
              </div>
            </label>
            <label className="flex items-center justify-between p-4 rounded-xl border border-primary bg-primary/5 transition-colors group cursor-pointer">
              <span className="font-body-md text-on-surface font-medium">
                Feminino
              </span>
              <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
              </div>
            </label>
            <label className="flex items-center justify-between p-4 rounded-xl border border-outline-variant bg-surface-container-lowest active:bg-surface-container transition-colors group cursor-pointer">
              <span className="font-body-md text-on-surface">Outro</span>
              <div className="w-5 h-5 rounded-full border-2 border-outline-variant group-active:border-primary flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-primary opacity-0 transition-opacity"></div>
              </div>
            </label>
          </div>
        </section>

        {/* Primary Action */}
        <section className="space-y-6">
          <Link href="/usuario/dashboard">
            <button className="w-full h-16 bg-primary-container text-on-primary-container font-headline-sm rounded-2xl shadow-lg active:scale-[0.98] transition-all duration-200 uppercase tracking-wide">
              CONCLUIR CADASTRO
            </button>
          </Link>
          <p className="text-center font-body-sm text-on-surface-variant px-4">
            Ao continuar, você concorda com nossos{" "}
            <a
              className="text-primary font-medium underline underline-offset-2"
              href="#"
            >
              Termos de Uso
            </a>
            .
          </p>
        </section>
      </main>
    </div>
  );
}

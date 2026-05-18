import Link from "next/link";
import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Map, MapMarker, MarkerContent } from "@/components/ui/map";
import { Camera, MapPin, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col font-sans text-[#112F4E]">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <section className="w-full max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-8 text-center lg:text-left z-10">
            <div className="inline-flex items-center w-fit mx-auto lg:mx-0 px-5 py-2.5 rounded-full bg-[#E8F2F8] text-[#1a8ccc] text-sm font-bold tracking-wide uppercase">
              Transformando a nossa cidade
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-[5rem] font-medium text-[#112F4E] tracking-tight leading-[1.05]">
              Cuidando de <br className="hidden lg:block" />
              <span className="text-[#1a8ccc] italic font-serif">Marília</span>, Juntos.
            </h2>
            
            <p className="text-lg md:text-xl text-[#4A5D70] max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Sua voz faz a diferença. Reporte problemas de infraestrutura, acompanhe solicitações e ajude a construir uma cidade melhor para todos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-4">
              <Link
                href="/reclamacao/nova"
                className="flex items-center justify-center gap-2 px-8 py-5 bg-[#1a8ccc] text-white rounded-full text-lg font-medium shadow-[0_8px_30px_rgb(26,140,204,0.3)] hover:bg-[#1572a6] hover:-translate-y-1 transition-all"
              >
                Reportar Problema
              </Link>
              <Link
                href="/mapa"
                className="flex items-center justify-center gap-2 px-8 py-5 bg-white border-2 border-[#E2E8F0] text-[#112F4E] rounded-full text-lg font-medium shadow-sm hover:border-[#112F4E] hover:-translate-y-1 transition-all"
              >
                Ver Mapa
              </Link>
            </div>
          </div>
          
          {/* Hero Map Container Wrapper */}
          <div className="relative h-[500px] w-full lg:w-[110%] lg:-ml-[5%]">
            {/* Inner Map Container com bordas arredondadas e overflow hidden */}
            <div className="absolute inset-0 rounded-[3rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)] border-8 border-white bg-white">
              <div className="absolute inset-0">
                <Map center={[-49.9458, -22.2139]} zoom={13}>
                  <MapMarker longitude={-49.95} latitude={-22.22}>
                    <MarkerContent>
                      <div className="w-6 h-6 bg-[#1a8ccc] rounded-full border-4 border-white shadow-lg animate-pulse" />
                    </MarkerContent>
                  </MapMarker>
                  <MapMarker longitude={-49.93} latitude={-22.20}>
                    <MarkerContent>
                      <div className="w-6 h-6 bg-[#F59E0B] rounded-full border-4 border-white shadow-lg animate-pulse" />
                    </MarkerContent>
                  </MapMarker>
                </Map>
              </div>
            </div>

            {/* Imagem do Victor com Dinossauro flutuando e saindo para fora */}
            <div className="absolute -bottom-36 -right-20 md:-bottom-56 md:-right-40 z-30 pointer-events-none">
              <img 
                src="/image/victor.png" 
                alt="Victor no Dinossauro" 
                className="w-[350px] md:w-[550px] h-auto object-contain"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full bg-white py-24 px-6 md:px-12 rounded-t-[4rem] mt-8 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] relative z-20">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-20">
              <h3 className="text-4xl md:text-5xl font-medium text-[#112F4E] mb-6">Como funciona?</h3>
              <p className="text-[#4A5D70] max-w-2xl mx-auto text-xl font-light">
                Um processo desenhado para ser transparente, humano e eficiente.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Feature 1 */}
              <div className="bg-[#FAF7F2] p-10 rounded-[3rem] flex flex-col items-center text-center transition-transform hover:-translate-y-2 duration-300">
                <div className="w-24 h-24 bg-[#E8F2F8] rounded-full flex items-center justify-center text-[#1a8ccc] mb-8">
                  <Camera className="w-10 h-10" />
                </div>
                <h4 className="text-2xl font-bold text-[#112F4E] mb-4">1. Reporte o Problema</h4>
                <p className="text-[#4A5D70] text-lg leading-relaxed font-light">
                  Tire uma foto, descreva o que aconteceu e marque no mapa. Em menos de 2 minutos sua solicitação é enviada para as equipes.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-[#FDF2F2] p-10 rounded-[3rem] flex flex-col items-center text-center transition-transform hover:-translate-y-2 duration-300">
                <div className="w-24 h-24 bg-[#FCE8E8] rounded-full flex items-center justify-center text-[#EF4444] mb-8">
                  <MapPin className="w-10 h-10" />
                </div>
                <h4 className="text-2xl font-bold text-[#112F4E] mb-4">2. Acompanhe o Status</h4>
                <p className="text-[#4A5D70] text-lg leading-relaxed font-light">
                  Receba notificações sobre o andamento e interaja com a comunidade dando "Concordo" em relatos próximos a você.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-[#F0FDF4] p-10 rounded-[3rem] flex flex-col items-center text-center transition-transform hover:-translate-y-2 duration-300">
                <div className="w-24 h-24 bg-[#DCFCE7] rounded-full flex items-center justify-center text-[#10B981] mb-8">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-2xl font-bold text-[#112F4E] mb-4">3. Problema Resolvido</h4>
                <p className="text-[#4A5D70] text-lg leading-relaxed font-light">
                  As equipes da prefeitura atuam com base nos dados gerados e o problema é solucionado com máxima eficiência e transparência.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#112F4E] pt-20 pb-10 px-6 md:px-12 mt-auto">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-2 italic">SAC Marília</h2>
            <p className="text-[#94A3B8] font-light text-lg">Plataforma de Gestão Urbana</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6">
             <Link href="/admin/dashboard" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition-colors text-center">
                Portal Administrativo
             </Link>
             <Link href="/usuario/dashboard" className="px-8 py-4 bg-[#1a8ccc] hover:bg-[#1572a6] text-white rounded-full font-medium transition-colors text-center">
                Portal do Cidadão
             </Link>
          </div>
        </div>
        
        <div className="max-w-[1400px] mx-auto mt-16 pt-8 border-t border-white/10 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#94A3B8]">
          <p>© 2026 SAC Marília. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <Link href="/termos" className="hover:text-white transition-colors">Termos de Uso</Link>
            <Link href="/privacidade" className="hover:text-white transition-colors">Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

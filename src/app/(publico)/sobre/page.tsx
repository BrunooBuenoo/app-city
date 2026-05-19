import Link from "next/link";
import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Map, MapMarker, MarkerContent } from "@/components/ui/map";
import { Camera, MapPin, CheckCircle2 } from "lucide-react";
import Image from "next/image"

export default function Sobre() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col text-[#112F4E]">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <section className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center overflow-visible">
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
                href="/"
                className="flex items-center justify-center gap-2 px-8 py-5 bg-[#1a8ccc] text-white rounded-full text-lg font-medium hover:bg-[#1572a6] hover:-translate-y-1 transition-all"
              >
                Reportar Problema
              </Link>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 px-8 py-5 bg-white border-2 border-[#E2E8F0] text-[#112F4E] rounded-full text-lg font-medium shadow-sm hover:border-[#112F4E] hover:-translate-y-1 transition-all"
              >
                Ver Mapa
              </Link>
            </div>
          </div>
          
          {/* Hero Map Container */}
          <div className="relative h-[500px] w-full lg:w-[110%] lg:-ml-[5%] rounded-[3rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)] border-8 border-white bg-white">
            <div className="absolute inset-0">
              <Map center={[-49.9458, -22.2139]} zoom={13}>
                <MapMarker longitude={-49.95} latitude={-22.22}>
                  <MarkerContent>
                    <div className="w-6 h-6 bg-[#1a8ccc] rounded-full shadow-lg animate-pulse" />
                  </MarkerContent>
                </MapMarker>
                <MapMarker longitude={-49.93} latitude={-22.20}>
                  <MarkerContent>
                    <div className="w-6 h-6 bg-[#F59E0B] rounded-full shadow-lg animate-pulse" />
                  </MarkerContent>
                </MapMarker>
              </Map>
            </div>
          </div>

          {/* Victor no Dinossauro — responsivo para todas as telas */}
          <div className="absolute bottom-0 right-0 z-30 pointer-events-none translate-y-[30%] sm:translate-y-[25%] md:translate-y-[20%] lg:translate-y-[15%] translate-x-[5%] sm:translate-x-[3%] md:translate-x-0">
            <img 
              src="/image/victor.png" 
              alt="Victor no Dinossauro" 
              className="w-[180px] sm:w-[240px] md:w-[350px] lg:w-[450px] xl:w-[550px] h-auto object-contain"
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full bg-white py-24 px-6 md:px-12 rounded-t-[4rem] mt-8 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] relative z-20 overflow-hidden">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid lg:grid-cols-12 gap-12">
              {/* Left Side - Title and CTA */}
              <div className="lg:col-span-4 flex flex-col justify-center pt-8">
                <p className="text-[#1a8ccc] text-sm font-bold tracking-wide uppercase mb-4">
                  COMO FUNCIONA
                </p>
                <h2 className="text-4xl md:text-5xl font-medium text-[#112F4E] leading-tight mb-6">
                  Um processo simples
                  <br />
                  e transparente
                </h2>
                <p className="text-[#4A5D70] text-lg font-light leading-relaxed mb-8 max-w-md">
                  Entenda como a sua solicitação chega até as equipes da prefeitura e é solucionada de forma eficiente para melhorar a nossa cidade.
                </p>
                <Link href="/" className="bg-[#1a8ccc] hover:bg-[#1572a6] text-white font-medium px-8 py-4 rounded-full w-fit transition-all hover:-translate-y-1">
                  Reportar Agora
                </Link>
              </div>

              {/* Right Side - Timeline with curved path */}
              <div className="lg:col-span-8 relative min-h-[500px] hidden lg:block">
                {/* Curved SVG Path */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 700 500"
                  fill="none"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path
                    d="M 0 400 Q 150 420 250 350 Q 350 280 400 300 Q 500 340 550 250 Q 620 150 700 180"
                    stroke="#1a8ccc"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    className="opacity-40"
                  />
                  <path
                    d="M 680 185 L 700 180"
                    stroke="#1a8ccc"
                    strokeWidth="3"
                    strokeDasharray="8 8"
                    fill="none"
                    className="opacity-40"
                  />
                </svg>

                {/* Step 1 */}
                <div className="absolute left-[10%] bottom-[10%] flex flex-col items-start transition-transform hover:-translate-y-2 duration-300">
                  <span className="absolute -left-12 -top-20 text-[180px] font-bold text-[#F1F5F9] select-none pointer-events-none leading-none">1</span>
                  <div className="relative z-10 w-5 h-5 rounded-full bg-[#1a8ccc] mb-4 shadow-md" />
                  <div className="relative z-10 max-w-[250px] bg-white/60 backdrop-blur-md p-4 rounded-2xl shadow-sm">
                    <h3 className="text-xl font-bold text-[#112F4E] mb-2">Reporte o Problema</h3>
                    <p className="text-[#4A5D70] text-sm leading-relaxed font-light">Tire uma foto, descreva o que aconteceu e marque no mapa. Em menos de 2 minutos sua solicitação é enviada.</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="absolute left-[40%] top-[35%] flex flex-col items-start transition-transform hover:-translate-y-2 duration-300">
                  <span className="absolute -left-12 -top-20 text-[180px] font-bold text-[#F1F5F9] select-none pointer-events-none leading-none">2</span>
                  <div className="relative z-10 w-5 h-5 rounded-full bg-[#F59E0B] mb-4 shadow-md" />
                  <div className="relative z-10 max-w-[250px] bg-white/60 backdrop-blur-md p-4 rounded-2xl shadow-sm">
                    <h3 className="text-xl font-bold text-[#112F4E] mb-2">Acompanhe o Status</h3>
                    <p className="text-[#4A5D70] text-sm leading-relaxed font-light">Receba notificações sobre o andamento e interaja com a comunidade dando "Concordo" em relatos próximos.</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="absolute right-[5%] top-[5%] flex flex-col items-start transition-transform hover:-translate-y-2 duration-300">
                  <span className="absolute -left-12 -top-20 text-[180px] font-bold text-[#F1F5F9] select-none pointer-events-none leading-none">3</span>
                  <div className="relative z-10 w-5 h-5 rounded-full bg-[#10B981] mb-4 shadow-md" />
                  <div className="relative z-10 max-w-[250px] bg-white/60 backdrop-blur-md p-4 rounded-2xl shadow-sm">
                    <h3 className="text-xl font-bold text-[#112F4E] mb-2">Problema Resolvido</h3>
                    <p className="text-[#4A5D70] text-sm leading-relaxed font-light">As equipes da prefeitura atuam com base nos dados gerados e o problema é solucionado com eficiência.</p>
                  </div>
                </div>
              </div>
              
              {/* Mobile Timeline */}
              <div className="lg:hidden flex flex-col gap-12 mt-12 relative px-4">
                 <div className="absolute left-10 top-8 bottom-8 w-1 bg-[#E8F2F8] rounded-full" />
                 <div className="flex gap-6 relative z-10">
                    <div className="w-14 h-14 rounded-full bg-[#E8F2F8] flex items-center justify-center font-bold text-[#1a8ccc] shrink-0 text-xl shadow-sm">1</div>
                    <div>
                      <h3 className="text-xl font-bold text-[#112F4E] mb-2 mt-3">Reporte o Problema</h3>
                      <p className="text-[#4A5D70] text-base leading-relaxed font-light">Tire uma foto, descreva o que aconteceu e marque no mapa. Em menos de 2 minutos sua solicitação é enviada.</p>
                    </div>
                 </div>
                 <div className="flex gap-6 relative z-10">
                    <div className="w-14 h-14 rounded-full bg-[#FEF3C7] flex items-center justify-center font-bold text-[#F59E0B] shrink-0 text-xl shadow-sm">2</div>
                    <div>
                      <h3 className="text-xl font-bold text-[#112F4E] mb-2 mt-3">Acompanhe o Status</h3>
                      <p className="text-[#4A5D70] text-base leading-relaxed font-light">Receba notificações sobre o andamento e interaja com a comunidade dando "Concordo" em relatos próximos.</p>
                    </div>
                 </div>
                 <div className="flex gap-6 relative z-10">
                    <div className="w-14 h-14 rounded-full bg-[#D1FAE5] flex items-center justify-center font-bold text-[#10B981] shrink-0 text-xl shadow-sm">3</div>
                    <div>
                      <h3 className="text-xl font-bold text-[#112F4E] mb-2 mt-3">Problema Resolvido</h3>
                      <p className="text-[#4A5D70] text-base leading-relaxed font-light">As equipes da prefeitura atuam com base nos dados gerados e o problema é solucionado com eficiência.</p>
                    </div>
                 </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}


import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[#112F4E] pt-20 pb-10 px-6 md:px-12 mt-auto">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <Link href="/">
            <Image 
              src="/image/logo.png" 
              alt="SAC Marília" 
              width={150} 
              height={40}
              className="h-auto w-auto"
            />
          </Link>
          <p className="text-[#94A3B8] font-light text-lg mt-2">
            Plataforma de Gestão Urbana <br /> <span className="font-bold">do Marília ao Contrário</span>
          </p>
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
  );
}
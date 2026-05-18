import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-surface-bright p-gutter flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant">
        <h1 className="font-headline-lg text-primary text-center mb-6">App Marília</h1>
        <p className="font-body-md text-on-surface-variant text-center mb-8">
          Bem-vindo! Selecione uma das telas abaixo para visualizar os layouts gerados:
        </p>
        
        <div className="flex flex-col gap-4">
          <Link href="/mapa" className="w-full">
            <button className="w-full bg-primary text-on-primary font-label-lg py-3 rounded-xl hover:bg-primary-container transition-colors shadow-sm">
              Mapa Principal (Mobile)
            </button>
          </Link>
          
          <Link href="/usuario/dashboard" className="w-full">
            <button className="w-full bg-primary text-on-primary font-label-lg py-3 rounded-xl hover:bg-primary-container transition-colors shadow-sm">
              Dashboard Usuário (Desktop)
            </button>
          </Link>

          <Link href="/admin/dashboard" className="w-full">
            <button className="w-full bg-primary text-on-primary font-label-lg py-3 rounded-xl hover:bg-primary-container transition-colors shadow-sm">
              Dashboard Admin (Desktop)
            </button>
          </Link>

          <Link href="/usuario/minhas-reclamacoes" className="w-full">
            <button className="w-full bg-primary text-on-primary font-label-lg py-3 rounded-xl hover:bg-primary-container transition-colors shadow-sm">
              Minhas Reclamações (Mobile)
            </button>
          </Link>

          <Link href="/reclamacao/nova" className="w-full">
            <button className="w-full bg-primary text-on-primary font-label-lg py-3 rounded-xl hover:bg-primary-container transition-colors shadow-sm">
              Nova Reclamação (Mobile)
            </button>
          </Link>

          <Link href="/completar-perfil" className="w-full">
            <button className="w-full bg-primary text-on-primary font-label-lg py-3 rounded-xl hover:bg-primary-container transition-colors shadow-sm">
              Completar Perfil (Mobile)
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

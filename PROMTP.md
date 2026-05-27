Aja como um Desenvolvedor Sênior Fullstack especialista em Next.js (App Router), TypeScript, Tailwind CSS v4 e Firebase. 

Acabei de duplicar uma aplicação Next.js totalmente funcional (um SAC urbano com login do Google por popup síncrono, mapa interativo, seletor de tema claro/escuro com transição líquida circular premium e banco de dados Firebase Firestore). 

Quero refatorar este projeto duplicado para transformá-lo em uma **Plataforma de Clube de Benefícios e Mapa de Parcerias Multicategorias (Restaurantes, Oficinas, Clínicas, Lojas, etc.)**.

Quero manter EXATAMENTE toda a estrutura lógica premium que já funciona (o design system com tokens de cores no globals.css, o seletor de tema líquido circular de 1200ms com flushSync, e o login por popup síncrono do Google), mas quero substituir toda a regra de negócio de "reclamações urbanas" por um sistema de convênios comerciais.

Por favor, execute essa refatoração de forma cirúrgica, adaptando o código atual passo a passo:

### 🎯 1. Lógica do Banco de Dados (Firestore em Português)
Substitua toda a estrutura de coleções de reclamações e gamificação para a nossa nova modelagem 100% em português:
- Coleção `usuarios`: Perfis com chaves: `uid`, `nome`, `email`, `funcao` ("admin" | "empresa" | "parceiro" | "usuario"), `empresaId`, `criadoEm`.
- Coleção `empresas`: Cadastro corporativo com chaves: `id`, `razaoSocial`, `cnpj`, `contatoTelefone`, `ativo`, `criadoEm`.
- Subcoleção `/empresas/{empresaId}/estabelecimentos`: Os parceiros credenciados (oficinas, restaurantes, clínicas) cadastrados pelas empresas: `{ id, nome, descricao, categoria, logoUrl, bannerUrl, latitude, longitude, endereco, telefone, status: "pendente_aprovacao" | "ativo" | "suspenso", criadoEm, aprovadoEm }`.
- Subcoleção `/empresas/{empresaId}/estabelecimentos/{estabId}/cupons`: Cupons do estabelecimento: `{ id, titulo, descricao, codigoBase, validade, limitePorUsuario, ativo, criadoEm }`.
- Subcoleção `/empresas/{empresaId}/estabelecimentos/{estabId}/resgates`: Histórico de cupons resgatados: `{ id, cupomId, usuarioId, codigoUnicoGerado, status: "gerado" | "resgatado" | "expirado", resgatadoEm, criadoEm }`.

Refatore a pasta de serviços do Firebase (`src/services/firebase`) adaptando os arquivos de `auth.ts`, `index.ts` e transformando `reclamacoes.ts` em `estabelecimentos.ts` para refletir essas novas coleções e operações (Criar estabelecimento pendente, aprovar estabelecimento, criar cupom, gerar código de resgate).

### 👥 2. Autenticação & Níveis de Acesso
Refatore o `AuthContext.tsx` e a tela de login para suportar os 4 níveis de acesso (`admin`, `empresa`, `parceiro`, `usuario`), direcionando cada perfil de forma síncrona pós-login do Google para a sua respectiva rota no Next.js:
- Admin Geral -> `/admin/dashboard`
- Empresa Parceira -> `/empresa/dashboard`
- Estabelecimento Parceiro -> `/parceiro/dashboard`
- Usuário Final -> `/usuario/dashboard` (ou `/completar-perfil` se faltarem dados)

### 🗺️ 3. O Mapa de Benefícios
Refatore o componente do Mapa interativo (que antes exibia pins de reclamações) para renderizar pins coloridos baseados na Categoria Comercial do estabelecimento cadastrado (status "ativo"):
- Alimentação (Restaurantes, Cafés): Laranja (#F59E0B)
- Automotivo (Oficinas Mecânicas, Lava-Rápido): Azul Claro (#38BDF8)
- Saúde & Beleza (Clínicas, Academias): Esmeralda (#10B981)
- Comércio & Varejo (Lojas locais): Índigo (#6366F1)
- Educação & Serviços: Roxo (#8B5CF6)
Ao clicar no pin do estabelecimento, abra um card de vidro premium (glassmorphism) exibindo o nome do local, descrição, telefone, endereço e um botão proeminente para visualizar e gerar os cupons de desconto ativos.

### 📝 4. Formulários & Dashboards
- Transforme a página de "Nova Reclamação" em um formulário premium de "Cadastrar Novo Estabelecimento" (utilizado pela Empresa para credenciar seus parceiros locais, inserindo informações no mapa).
- Transforme a tela do Admin para exibir a lista de estabelecimentos com status "pendente_aprovacao". Ao confirmar o pagamento por fora, o Admin clica em "Aprovar" e o status muda para "ativo", renderizando instantaneamente o pin do lojista no mapa público.
- Desenvolva a área do Estabelecimento Lojista para que ele gerencie seus cupons de desconto e acompanhe os códigos de resgate que os usuários apresentam no balcão.

Por favor, analise a estrutura de pastas do meu projeto duplicado e me diga por qual arquivo ou pasta devemos iniciar as adaptações cirúrgicas de código. Forneça respostas em português do Brasil com códigos limpos, completos e tipados.

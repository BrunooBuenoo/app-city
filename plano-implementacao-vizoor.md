# Plano de Implementacao Vizoor

## Objetivo

Transformar a base atual em uma plataforma de descoberta local baseada em criadores, usando paginas dedicadas por slug no formato:

- vizoor.com.br/navegandosp
- vizoor.com.br/rolecampinas

O objetivo desta fase e alinhar modelo de dados, rotas, permissoes e paineis com a regra de negocio definida em [regra.md](./regra.md).

---

## Diagnostico da Base Atual

A estrutura existente ja resolve partes importantes do produto:

- autenticacao com Firebase
- perfis de usuario por papel
- mapa publico com estabelecimentos
- painel admin
- painel empresa
- modulo operacional de parceiro para validacao de cupons
- categorias dinamicas via Firestore

Porem, o dominio principal ainda esta orientado a este modelo:

- empresa possui estabelecimentos
- estabelecimentos vivem em subcolecoes de empresas
- parceiro atua como operador comercial
- nao existe entidade de criador
- nao existe vinculo N:N entre criador e estabelecimento
- nao existe pagina publica dedicada por slug

Resumo:

A base atual serve como fundacao tecnica, mas o modelo central ainda nao representa a Vizoor descrita em [regra.md](./regra.md).

---

## Decisao Arquitetural da Fase 1

A primeira versao da Vizoor deve usar rotas por slug em vez de subdominios.

### Formato adotado

- pagina global: /
- pagina publica do criador: /[creatorSlug]
- area privada do criador: /criador/dashboard

### Motivo da decisao

- menor complexidade operacional
- nao depende de DNS, middleware multi-tenant ou host-based routing
- funciona bem no Next App Router atual
- reduz risco de rollout inicial

---

## Estrutura de Dominio Proposta

### Entidades principais

#### 1. usuarios

Mantem autenticacao e perfil base.

Campos principais:

- uid
- nome
- email
- foto
- telefone
- perfilCompleto
- funcao
- cidadeBase
- criadoEm
- atualizadoEm

Funcoes esperadas nesta fase:

- admin
- usuario
- empresa
- parceiro
- criador

Observacao:

O papel parceiro pode continuar existindo como papel operacional de caixa ou atendimento.
O papel criador passa a ser separado do parceiro.

#### 2. creators

Colecao global com dados publicos e operacionais do criador.

Campos sugeridos:

- id
- userId
- slug
- nomePublico
- bioCurta
- bioCompleta
- avatarUrl
- capaUrl
- cidade
- estado
- categorias
- tema
- redesSociais
- status
- verificado
- destaque
- metricas
- criadoEm
- atualizadoEm

Exemplo de tema:

- corPrimaria
- corSecundaria
- corDestaque
- logoUrlOpcional

Status sugeridos:

- rascunho
- pendente_aprovacao
- ativo
- suspenso

#### 3. establishments

Colecao global unica de estabelecimentos.

Campos sugeridos:

- id
- empresaId
- nome
- descricao
- categoria
- subcategoria
- logoUrl
- bannerUrl
- latitude
- longitude
- endereco
- telefone
- whatsapp
- site
- instagram
- cidade
- estado
- status
- destaque
- aprovadoEm
- criadoEm
- atualizadoEm

Status sugeridos:

- pendente_aprovacao
- ativo
- suspenso

Observacao:

empresaId continua existindo como referencia do dono comercial, mas deixa de ser o eixo publico principal.

#### 4. creator_establishments

Colecao de relacionamento entre criador e estabelecimento.

Campos sugeridos:

- id
- creatorId
- establishmentId
- status
- ordem
- destaque
- observacaoCuradoria
- origem
- criadoEm
- atualizadoEm

Status sugeridos:

- pendente
- ativo
- rejeitado
- removido

Origem sugerida:

- solicitado_pelo_criador
- convidado_pela_plataforma
- parceria_comercial

Essa colecao e a base da regra mais importante:

- o estabelecimento nao pertence ao criador
- o criador apenas se vincula ao estabelecimento

#### 5. creator_contents

Nao precisa entrar na primeira entrega, mas deve existir no desenho.

Campos sugeridos:

- id
- creatorId
- establishmentId opcional
- tipo
- titulo
- descricao
- midias
- status
- criadoEm

Tipos sugeridos:

- video
- foto
- roteiro
- lista
- review

---

## Rotas Propostas

### Publicas

- / -> mapa global da Vizoor
- /[creatorSlug] -> pagina dedicada do criador
- /estabelecimento/[id] -> pagina publica do estabelecimento
- /sobre
- /login
- /cadastro

### Privadas

- /admin/dashboard
- /admin/criadores
- /admin/estabelecimentos
- /admin/vinculos
- /empresa/dashboard
- /parceiro/dashboard
- /criador/dashboard
- /criador/perfil
- /criador/estabelecimentos
- /criador/conteudos

### Slugs reservados

Nao permitir criacao de criadores com estes slugs:

- admin
- api
- cadastro
- criador
- empresa
- login
- mapa
- parceiro
- representante
- sobre
- termos
- usuario

---

## Impacto Direto na Estrutura Atual

### O que pode ser reaproveitado

- [src/app/layout.tsx](./src/app/layout.tsx)
- [src/contexts/AuthContext.tsx](./src/contexts/AuthContext.tsx)
- [src/services/firebase/auth.ts](./src/services/firebase/auth.ts)
- [src/services/firebase/categorias.ts](./src/services/firebase/categorias.ts)
- [src/components/layout/MapNavbar.tsx](./src/components/layout/MapNavbar.tsx)
- [src/app/page.tsx](./src/app/page.tsx)

### O que precisa evoluir

- [src/services/firebase/estabelecimentos.ts](./src/services/firebase/estabelecimentos.ts)
- [firestore.rules](./firestore.rules)
- [src/services/firebase/index.ts](./src/services/firebase/index.ts)

### O que hoje esta desalinhado com a regra Vizoor

- estabelecimentos aninhados em empresas
- ausencia de criadores como entidade propria
- painel de representante ainda mockado
- textos e conceitos herdados de outro produto ou fase anterior

---

## Servicos Firebase a Criar

### creators.ts

Responsavel por:

- criarPerfilCriador
- atualizarPerfilCriador
- obterCriadorPorSlug
- obterCriadorPorId
- listarCriadores
- aprovarCriador
- suspenderCriador
- validarSlugCriador

### creator-establishments.ts

Responsavel por:

- solicitarVinculoCriadorEstabelecimento
- aprovarVinculoCriadorEstabelecimento
- rejeitarVinculoCriadorEstabelecimento
- removerVinculoCriadorEstabelecimento
- listarEstabelecimentosDoCriador
- listarCriadoresDoEstabelecimento

### establishments.ts

Deve ser refatorado para operar sobre colecao global.

Metas:

- manter leitura global simples para mapa
- permitir filtro por status, categoria e cidade
- manter empresaId apenas como ownership comercial

---

## Regras de Permissao

### Admin

Pode:

- aprovar criadores
- suspender criadores
- aprovar estabelecimentos
- aprovar vinculos
- moderar conteudo
- configurar categorias e destaques

### Criador

Pode:

- editar seu perfil publico
- escolher seu slug
- solicitar vinculo com estabelecimentos
- ordenar e destacar os estabelecimentos da propria pagina
- publicar conteudo proprio
- acessar metricas do proprio perfil

Nao pode:

- se tornar dono do estabelecimento
- editar dados comerciais estruturais do estabelecimento

### Empresa

Pode:

- cadastrar ou manter dados comerciais do estabelecimento
- criar campanhas e cupons
- acompanhar metricas comerciais

Nao pode:

- editar o perfil do criador

### Parceiro

Pode:

- validar resgates e atuar no atendimento local, se esse modulo continuar no escopo

### Usuario comum

Pode:

- navegar no mapa global
- abrir pagina do criador
- visualizar estabelecimentos
- seguir criadores
- salvar lugares

---

## Estrategia de Migracao

A migracao deve evitar big bang.

### Etapa 1

Criar as novas colecoes sem apagar o modelo atual:

- creators
- creator_establishments
- establishments_global ou establishments, dependendo da estrategia adotada

### Etapa 2

Migrar os estabelecimentos atuais para uma colecao global.

Fonte atual:

- empresas/{empresaId}/estabelecimentos/{estabId}

Destino:

- establishments/{estabId}

Cada registro migrado deve manter:

- empresaId
- status
- dados geograficos e comerciais

### Etapa 3

Atualizar leituras publicas do mapa para a nova colecao global.

### Etapa 4

Introduzir a rota publica do criador.

### Etapa 5

Liberar painel de criador e fluxo de solicitacao de vinculo.

### Etapa 6

Descontinuar o modelo antigo somente apos estabilizacao.

Observacao:

Na etapa 1, o ideal e usar um nome temporario como establishments_global apenas se for necessario conviver com os dois modelos em paralelo por um periodo mais longo.
Se a migracao for curta, o melhor e migrar logo para establishments como colecao final.

---

## Fases de Implementacao

### Fase 1: Base de dominio

Entregas:

- adicionar funcao criador no perfil do usuario
- criar colecao creators
- criar colecao creator_establishments
- preparar slugs reservados
- ajustar firestore.rules
- exportar novos servicos em [src/services/firebase/index.ts](./src/services/firebase/index.ts)

Criterio de pronto:

- admin consegue ver criadores cadastrados
- slug e validado
- perfil de criador existe no banco

### Fase 2: Estabelecimento global

Entregas:

- refatorar servico de estabelecimentos
- mover leitura publica para colecao global
- adaptar mapa principal para novo modelo

Criterio de pronto:

- mapa global funciona sem depender da subcolecao de empresa

### Fase 3: Pagina publica do criador

Entregas:

- criar rota [creatorSlug]
- buscar criador por slug
- listar estabelecimentos vinculados
- renderizar hero, identidade visual e mapa curado

Criterio de pronto:

- acessar /navegandosp mostra uma pagina publica valida do criador

### Fase 4: Painel do criador

Entregas:

- dashboard do criador
- edicao de perfil
- busca de estabelecimentos
- solicitacao de vinculo
- ordenacao de destaques

Criterio de pronto:

- criador gerencia sua pagina sem editar dados estruturais do estabelecimento

### Fase 5: Conteudo e social

Entregas:

- seguir criadores
- salvar lugares
- reviews e conteudos do criador
- roteiros e listas

---

## Ordem Recomendada de Arquivos a Tocar

1. [src/services/firebase/auth.ts](./src/services/firebase/auth.ts)
2. [src/contexts/AuthContext.tsx](./src/contexts/AuthContext.tsx)
3. [firestore.rules](./firestore.rules)
4. [src/services/firebase/creators.ts](./src/services/firebase/creators.ts)
5. [src/services/firebase/creator-establishments.ts](./src/services/firebase/creator-establishments.ts)
6. [src/services/firebase/estabelecimentos.ts](./src/services/firebase/estabelecimentos.ts)
7. [src/services/firebase/index.ts](./src/services/firebase/index.ts)
8. [src/app/[creatorSlug]/page.tsx](./src/app/[creatorSlug]/page.tsx)
9. [src/app/criador/dashboard/page.tsx](./src/app/criador/dashboard/page.tsx)

---

## Riscos Tecnicos

- Firestore nao faz join real, entao a modelagem do relacionamento precisa ser desenhada para leitura rapida.
- Rotas dinamicas por slug exigem bloqueio consistente de slugs reservados.
- O modelo atual de estabelecimentos por empresa pode gerar duplicidade se a migracao nao for controlada.
- Parte do texto e das telas atuais ainda carrega naming de fases anteriores, o que pode criar ambiguidade durante a implementacao.

---

## Recomendacao Pratica

Nao comecar pelas telas finais.

A ordem correta e:

1. dominio e permissoes
2. servicos e colecoes
3. rota publica do criador
4. painel do criador
5. recursos sociais e conteudo

Isso reduz retrabalho e evita construir interface sobre um modelo de dados errado.

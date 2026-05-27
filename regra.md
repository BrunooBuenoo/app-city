# VIZOOR — REGRA DE NEGÓCIO (VERSÃO INICIAL)

# VISÃO GERAL

A Vizoor é uma plataforma de descoberta geográfica baseada em criadores de conteúdo locais.

A plataforma conecta:

- Usuários comuns
- Criadores de conteúdo
- Estabelecimentos
- A própria empresa Vizoor

O objetivo é transformar criadores regionais em curadores oficiais de lugares dentro de um mapa social interativo.

---

# CONCEITO PRINCIPAL

A Vizoor NÃO é apenas:
- um guia turístico
- um Google Maps
- um catálogo de restaurantes

A Vizoor é:

> Uma plataforma social de descoberta local baseada em criadores de conteúdo.

---

# ESTRUTURA DA PLATAFORMA

## Plataforma Principal

Domínio principal:

https://vizoor.com.br

A plataforma principal possui:
- mapa global
- todos os estabelecimentos
- todos os criadores
- categorias
- busca
- perfis de lugares
- conteúdos
- avaliações
- recomendações

---

# PÁGINAS DEDICADAS DOS CRIADORES

Cada criador aprovado possui uma página pública própria dentro da Vizoor.

Exemplos:

- vizoor.com.br/navegandosp
- vizoor.com.br/rolecampinas
- vizoor.com.br/saopaulosecreto

O criador NÃO terá domínio próprio.

Todo o ecossistema permanece centralizado dentro da Vizoor.

---

# FUNCIONAMENTO DAS PÁGINAS DOS CRIADORES

Quando um usuário acessa:

vizoor.com.br/navegandosp

ele visualizará:

- mapa personalizado do criador
- estabelecimentos parceiros do criador
- vídeos e conteúdos do criador
- avaliações
- lugares favoritos
- roteiros
- categorias
- identidade visual do criador

Essa página funciona como o ambiente oficial daquele criador dentro do ecossistema Vizoor.

---

# RELAÇÃO ENTRE CRIADOR E MAPA GLOBAL

Todos os estabelecimentos vinculados aos criadores:
- também aparecem automaticamente no mapa global da Vizoor

Isso significa que:
- o criador gera conteúdo e audiência
- a Vizoor cresce junto
- o mapa principal é constantemente alimentado

---

# VÍNCULO SOCIAL DOS ESTABELECIMENTOS

No mapa global da Vizoor, ao clicar em um estabelecimento, o usuário verá:

- informações do local
- fotos
- vídeos
- avaliações
- criadores vinculados

Exemplo:

Indicado por:
- Navegando SP

[ Ver perfil do criador ]

Ao clicar:
- o usuário será redirecionado para:
vizoor.com.br/navegandosp

---

# ESTRUTURA DOS USUÁRIOS

## 1. Usuário Comum

Pode:
- navegar no mapa
- pesquisar lugares
- seguir criadores
- salvar locais
- visualizar conteúdos
- criar roteiros

Não pode:
- cadastrar estabelecimentos premium
- criar vínculos comerciais

---

## 2. Criador de Conteúdo

Pode:
- possuir página dedicada própria dentro da Vizoor
- vincular estabelecimentos ao perfil
- publicar conteúdos
- adicionar vídeos/fotos
- criar roteiros
- acompanhar métricas
- divulgar parceiros

Não é proprietário do estabelecimento.

O criador apenas:
- recomenda
- associa
- divulga

---

## 3. Estabelecimento

Pode:
- aparecer no mapa
- possuir perfil público
- receber conteúdos de criadores
- contratar destaque
- acessar métricas
- participar de campanhas

---

## 4. Administrador Vizoor

Possui controle total:
- criadores
- estabelecimentos
- aprovações
- categorias
- moderação
- monetização
- analytics
- destaque de pins

---

# REGRA MAIS IMPORTANTE

## O ESTABELECIMENTO NÃO PERTENCE AO CRIADOR

O estabelecimento pertence à plataforma Vizoor.

O criador apenas:
- vincula
- recomenda
- divulga

Isso evita:
- duplicidade
- spam
- desorganização

---

# ESTRUTURA TÉCNICA DE RELACIONAMENTO

## establishments

Tabela global única de estabelecimentos.

---

## creators

Tabela global única de criadores.

Cada criador possui:
- slug único
- perfil público
- identidade visual própria
- página dedicada dentro da Vizoor

---

## creator_establishments

Tabela de relacionamento:

| creator_id | establishment_id |

Isso permite que:
- um mesmo estabelecimento apareça em múltiplos criadores
- sem duplicação de cadastro

---

# ESTRUTURA DE URL DOS CRIADORES

Cada criador será identificado por um slug único.

Exemplo:

- Criador: Navegando SP
- Slug: navegandosp
- URL pública: vizoor.com.br/navegandosp

Regras do slug:
- deve ser único
- deve ser curto e memorável
- deve representar a marca do criador
- não pode conflitar com rotas reservadas da plataforma

Exemplos de rotas reservadas:
- /login
- /sobre
- /mapa
- /admin
- /usuario
- /empresa
- /parceiro
- /representante
- /api

---

# REGRA DE ESTRUTURA PÚBLICA

Na Vizoor existirão dois níveis principais de navegação pública:

## 1. Mapa global da plataforma

Responsável por reunir:
- todos os estabelecimentos da Vizoor
- todos os criadores
- descoberta ampla por categoria, busca e localização

## 2. Página dedicada do criador

Responsável por reunir:
- estabelecimentos vinculados àquele criador
- conteúdos e recomendações do criador
- identidade visual própria
- seleção curada de lugares

O mapa global mostra o ecossistema completo.

A página do criador mostra a curadoria daquele criador.

---

# DIFERENCIAL DA PLATAFORMA

Na Vizoor:
- o conteúdo do criador não desaparece como nos stories/reels
- as recomendações viram permanentes
- os lugares ficam organizados geograficamente
- a descoberta continua gerando tráfego

---

# OBJETIVO DO ECOSSISTEMA

Criar:
- uma rede social geográfica
- baseada em criadores locais
- conectando pessoas aos melhores lugares

---

# MODELO DE CRESCIMENTO

## FASE 1
Foco:
- São Paulo
- Gastronomia
- Restaurantes
- Cafeterias
- Bares

---

## FASE 2
Expandir para:
- hotéis
- turismo
- eventos
- experiências
- lifestyle
- pets
- esportes
- viagens

---

# MONETIZAÇÃO FUTURA

## Criador Premium
- analytics
- destaque
- selo verificado
- campanhas

---

## Estabelecimentos
- pins patrocinados
- destaque regional
- impulsionamento
- campanhas locais

---

# VISÃO DE LONGO PRAZO

Transformar a Vizoor em:
- o principal ecossistema de criadores locais do Brasil
- unindo conteúdo, mapa, descoberta e negócios locais

---

# POSICIONAMENTO

A Vizoor não vende apenas divulgação.

A Vizoor conecta:
- criadores
- lugares
- experiências
- pessoas

Tudo através de um mapa social inteligente.

---

# DIRETRIZ TÉCNICA INICIAL

Para a primeira versão do produto:

- a Vizoor utilizará páginas de criadores por URL
- não haverá dependência inicial de subdomínios
- a arquitetura será centralizada em rotas como `vizoor.com.br/slug-do-criador`

Essa decisão reduz a complexidade técnica inicial e acelera a implantação do ecossistema de criadores sem alterar o conceito central da plataforma.
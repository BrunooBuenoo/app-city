# VIZOOR — REGRA DE NEGÓCIO (VERSÃO GERAL)

# VISÃO GERAL

A Vizoor é uma plataforma social de descoberta local baseada em experiências reais e criadores de conteúdo regionais.

A plataforma conecta:
- usuários comuns
- criadores de conteúdo
- estabelecimentos
- experiências locais
- economia física

A proposta da Vizoor é utilizar tecnologia para incentivar as pessoas a explorarem o mundo real através de recomendações autênticas, experiências presenciais e descoberta geográfica social.

---

# CONCEITO PRINCIPAL

A Vizoor NÃO é:
- um aplicativo de delivery
- um guia turístico tradicional
- apenas um mapa
- apenas uma rede social

A Vizoor é:

> Uma plataforma social de descoberta local baseada em criadores regionais e experiências reais.

---

# PROPÓSITO DA MARCA

Vivemos em um mundo cada vez mais digital:
- delivery
- streaming
- redes sociais
- consumo remoto
- experiências através de telas

A Vizoor nasce para fazer o caminho contrário.

A plataforma existe para:
- reconectar pessoas ao mundo físico
- incentivar descobertas reais
- fortalecer a economia local
- valorizar experiências presenciais
- transformar criadores locais em curadores de cidades

---

# POSICIONAMENTO

O mundo real ainda está lá fora.

Descubra restaurantes, hotéis, atrações, cafeterias e experiências incríveis através de pessoas que realmente vivem cada cidade.

Explore o mapa, encontre novos lugares e viva experiências reais por todo o Brasil.

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
- experiências locais

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
- estabelecimentos parceiros
- vídeos e conteúdos
- avaliações
- lugares favoritos
- roteiros
- categorias
- identidade visual do criador

Essa página funciona como o ambiente oficial daquele criador dentro da Vizoor.

---

# MAPA GLOBAL DA VIZOOR

A Vizoor possui um mapa global responsável por reunir:
- todos os estabelecimentos aprovados
- experiências locais
- criadores da plataforma
- descoberta geográfica

O mapa global representa o ecossistema completo da Vizoor.

---

# MODELO DE PRESENÇA DOS ESTABELECIMENTOS

Na Vizoor, um estabelecimento pode existir de duas formas:

## 1. Presença direta na Vizoor

O estabelecimento:
- cria perfil diretamente na plataforma
- aparece apenas no mapa global
- não possui vínculo com criadores

Nesse caso:
- o local pertence apenas ao ecossistema principal da Vizoor

---

## 2. Presença vinculada a criadores

Quando um criador possui parceria com o estabelecimento:
- o local continua no mapa global
- passa também a aparecer na página do criador

Exemplo:
- vizoor.com.br/navegandosp

---

# CRIADORES DE CONTEÚDO

Os criadores são responsáveis por:
- explorar cidades
- descobrir experiências
- produzir conteúdo regional
- recomendar lugares
- fortalecer descoberta local

Eles atuam como:
- curadores regionais
- exploradores urbanos
- parceiros de descoberta

---

# CRIAÇÃO DE ESTABELECIMENTOS PELOS CRIADORES

Os criadores possuem autonomia para cadastrar e gerenciar estabelecimentos diretamente dentro de suas páginas na Vizoor.

Eles poderão:
- adicionar estabelecimentos
- editar informações
- enviar fotos
- adicionar conteúdos
- recomendar experiências
- gerenciar parceiros

---

# FUNCIONAMENTO DO CADASTRO PELO CRIADOR

O criador poderá cadastrar:
- restaurantes
- hotéis
- cafeterias
- bares
- atrações
- experiências
- lojas
- locais turísticos

Informando:
- nome
- categoria
- endereço
- descrição
- fotos
- redes sociais
- localização

---

# APROVAÇÃO DA VIZOOR

Quando o criador cadastrar um estabelecimento:

o local:
- aparecerá imediatamente na página do criador
- ficará disponível dentro do ambiente daquele criador

Porém:
- ainda NÃO aparecerá no mapa global da Vizoor

---

# MODERAÇÃO CENTRALIZADA

Para aparecer oficialmente no mapa global da Vizoor:

o estabelecimento deverá ser aprovado pela administração da plataforma.

O administrador poderá:
- aprovar
- rejeitar
- editar
- moderar
- solicitar ajustes

---

# RESULTADO APÓS APROVAÇÃO

Após aprovação:
- o estabelecimento entra oficialmente no mapa global da Vizoor
- continua aparecendo na página do criador
- torna-se parte oficial do ecossistema

---

# PARCERIAS EXTERNAS

As parcerias podem surgir:
- dentro da Vizoor
- fora da plataforma

Exemplo:
- Instagram
- WhatsApp
- networking
- visitas presenciais

O criador poderá formalizar essas parcerias dentro da Vizoor posteriormente.

---

# RELAÇÃO ENTRE CRIADOR E ESTABELECIMENTO

O criador:
- não é dono do estabelecimento
- não cria uma plataforma separada
- não cria um novo mapa isolado

Ele apenas:
- recomenda
- associa
- divulga
- gerencia conteúdos vinculados

---

# VÍNCULO SOCIAL DOS ESTABELECIMENTOS

Ao abrir um estabelecimento no mapa global da Vizoor, o usuário poderá visualizar:

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
- o usuário será direcionado para:
vizoor.com.br/navegandosp

---

# REGRA MAIS IMPORTANTE

## O ESTABELECIMENTO PERTENCE À VIZOOR

O estabelecimento pertence ao ecossistema principal da plataforma.

Os criadores apenas:
- vinculam
- recomendam
- divulgam
- gerenciam conteúdos relacionados

Isso evita:
- duplicidade
- spam
- desorganização
- múltiplos cadastros do mesmo local

---

# ESTRUTURA TÉCNICA DE RELACIONAMENTO

## establishments
Tabela global de estabelecimentos.

---

## creators
Tabela global de criadores.

Cada criador possui:
- slug único
- página pública
- identidade visual própria
- conteúdos próprios

---

## creator_establishments

Tabela de relacionamento:

| creator_id | establishment_id |

Isso permite:
- múltiplos criadores no mesmo estabelecimento
- sem duplicação de cadastro

---

# ESTRUTURA DE URL DOS CRIADORES

Cada criador possuirá:
- slug único
- URL pública própria

Exemplo:
- vizoor.com.br/navegandosp

Regras:
- slug único
- memorável
- sem conflito com rotas reservadas

Rotas reservadas:
- /login
- /sobre
- /mapa
- /admin
- /usuario
- /empresa
- /api

---

# ESTRUTURA PÚBLICA DA PLATAFORMA

A Vizoor possui dois níveis principais:

## 1. Mapa Global
Responsável pela descoberta ampla da plataforma.

## 2. Página do Criador
Responsável pela curadoria específica daquele criador.

---

# DIFERENCIAL DA VIZOOR

Na Vizoor:
- o conteúdo não desaparece como stories
- recomendações tornam-se permanentes
- lugares continuam gerando descoberta
- experiências ficam organizadas geograficamente

A plataforma transforma conteúdo em descoberta contínua.

---

# ECONOMIA LOCAL

A Vizoor busca:
- incentivar circulação em negócios físicos
- fortalecer economias regionais
- gerar movimento presencial
- conectar pessoas a experiências locais

A tecnologia funciona como:
- ponto de partida da experiência
- e não destino final

---

# OBJETIVO DO ECOSSISTEMA

Criar:
- uma rede social geográfica
- baseada em criadores locais
- focada em experiências reais
- conectando pessoas aos melhores lugares do Brasil

---

# MODELO DE CRESCIMENTO

## FASE 1
Foco:
- gastronomia
- cafeterias
- bares
- experiências urbanas

---

## FASE 2
Expansão:
- hotéis
- turismo
- eventos
- lifestyle
- experiências
- lazer
- viagens
- cultura
- entretenimento

---

# MONETIZAÇÃO FUTURA

## Criadores
- selo verificado
- analytics
- destaque
- campanhas

---

## Estabelecimentos
- pins patrocinados
- destaque regional
- campanhas
- impulsionamento

---

# VISÃO DE LONGO PRAZO

Transformar a Vizoor em:
- o principal ecossistema de descoberta local do Brasil
- a maior rede de criadores regionais do país
- a principal plataforma social de experiências presenciais

---

# ESSÊNCIA DA MARCA

A Vizoor não vende apenas divulgação.

A Vizoor conecta:
- pessoas
- cidades
- criadores
- experiências
- lugares reais

Tudo através de um mapa social inteligente focado no mundo físico.
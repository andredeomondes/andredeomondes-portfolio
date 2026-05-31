# GUIA.md — AndréDeomondes.dev

Este documento é o guia principal de implementação do portfólio pessoal de **André Deomondes**.

Ele deve ser seguido estritamente durante o desenvolvimento do projeto em **React / Next.js / TypeScript / Tailwind CSS / GSAP / Supabase**, com deploy na **Vercel**.

O objetivo não é criar apenas um portfólio bonito. O objetivo é criar uma experiência digital premium que comunique maturidade, engenharia de software, produto e atenção aos detalhes.

---

# 1. Objetivo do Projeto

Criar o portfólio pessoal de André Deomondes com foco em:

- Software Engineering
- Product Building
- Projetos reais
- Experiência de usuário
- Performance
- Arquitetura
- Clareza visual
- Narrativa profissional

O site deve transmitir:

> André constrói produtos digitais com foco em experiência, performance e arquitetura.

O site NÃO deve parecer:

- template genérico de portfólio
- currículo visual
- dashboard SaaS genérico
- site gamer
- landing page cheia de efeitos
- página com excesso de cards
- site de agência
- página poluída com muitas tecnologias

O site deve parecer:

- produto digital premium
- portfólio de Software Engineer
- experiência moderna e minimalista
- interface inspirada em Linear, Raycast, Apple e Stripe

---

# 2. Stack Obrigatória

O projeto deve ser implementado com:

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- GSAP (GreenSock Animation Platform)
  - GSAP Core (gratuito)
  - ScrollTrigger (gratuito)
  - SplitText manual (via useRef + manipulação de DOM, sem depósito pago)
- Lucide React
- Supabase
  - PostgreSQL (banco de dados)
  - Supabase Auth (autenticação do admin)
  - Supabase Storage (imagens dos projetos)
  - Supabase JS Client
- Deploy na Vercel

Evitar bibliotecas visuais pesadas sem necessidade.

Não usar Bootstrap.

Não usar templates prontos.

Não usar UI kits que deixem o site com aparência genérica.

---

# 3. Arquitetura de Dados — Supabase

O banco de dados fica no Supabase PostgreSQL. As queries do site usam o Supabase JS Client com RLS (Row Level Security): leitura pública liberada, escrita restrita ao admin autenticado.

---

## 3.1 Tabela `projects`

Cada linha representa um projeto do portfólio. Ao criar/editar um projeto no admin, esta tabela é alterada e a rota `/projects/[slug]` é gerada automaticamente.

```sql
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  full_description TEXT,
  tech_stack TEXT[],
  images TEXT[],
  highlights TEXT[],
  status TEXT DEFAULT 'published',
  featured BOOLEAN DEFAULT false,
  "order" INTEGER DEFAULT 0,
  category TEXT DEFAULT 'secondary',
  github_url TEXT,
  live_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

Campos principais:
- `slug`: usado na URL (`/projects/clube-de-programacao`)
- `featured`: projeto em destaque na Home (seção "Construindo") e no topo de /projects
- `category`: `"main"` para o projeto protagonista, `"secondary"` para os demais
- `images`: array de URLs do Supabase Storage
- `status`: `"draft"` ou `"published"`

---

## 3.2 Tabela `project_sections`

Armazena as seções do case study de cada projeto (Visão Geral, Problema, Solução, Resultado, etc.).

```sql
CREATE TABLE project_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT,
  content JSONB,
  "order" INTEGER DEFAULT 0
);
```

---

## 3.3 Tabela `about_sections`

Cada seção da página About é armazenada aqui e editável via admin.

```sql
CREATE TABLE about_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

`section_key` pode ser: `sidebar`, `introduction`, `experience`, `education`, `technologies`.

---

## 3.4 Tabela `site_settings`

Configurações globais do site editáveis pelo admin.

```sql
CREATE TABLE site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

Exemplos de `key`: `hero_label`, `hero_cta`, `home_featured_project`, `contact_whatsapp`, `social_links`.

---

# 4. Painel Administrativo (/admin)

## 4.1 Autenticação

- Supabase Auth com email/senha
- Sessão persistente via cookies
- Middleware Next.js protege todas as rotas `/admin/*` (redireciona para `/admin/login` se não autenticado)

## 4.2 Estrutura de Rotas

```
/admin
├── /login
├── / (dashboard — visão geral)
├── /projects
│   ├── / (listagem com busca/filtro)
│   ├── /new (criar projeto)
│   └── /[id]/edit (editar projeto)
├── /about
│   └── /[section]/edit (editar introdução, experiência, formação, tecnologias, sidebar)
└── /settings (redes sociais, CTAs, labels)
```

## 4.3 CRUD de Projetos — Fluxo Completo

1. Admin acessa `/admin/projects/new`
2. Formulário com:
   - Título, slug (auto-gerado a partir do título, editável)
   - Descrição curta, descrição completa
   - Tech stack (tags)
   - Imagens (upload → Supabase Storage → URL salva no banco)
   - Highlights
   - Status (rascunho / publicado)
   - Destaque (featured true/false)
   - Categoria (main / secondary)
   - GitHub URL, live URL
3. Ao salvar:
   - Linha criada em `projects`
   - Slug vira a rota `/projects/[slug]`
   - Página do case study gerada dinamicamente via Next.js (`app/projects/[slug]/page.tsx`)
   - Projeto aparece automaticamente na listagem de `/projects`
4. Admin pode editar ou excluir a qualquer momento
5. Se `featured = true`, o projeto aparece na seção "Construindo" da Home e como destaque em `/projects`

## 4.4 Edição do About

- Cada seção do About é um registro em `about_sections`
- Admin edita via formulários em `/admin/about/[section]/edit`
- Sidebar (foto, nome, cargo, links) editável via `about_sections` com `section_key = 'sidebar'`
- Experiência, formação e tecnologias são JSON editáveis

---

# 5. Fluxo de Conteúdo (Data Flow)

## Site → Supabase

Todas as páginas buscam dados do Supabase no server component:

```
/                   → busca project featured + site_settings
/about              → busca about_sections
/projects           → busca projects WHERE status = 'published' ORDER BY "order"
/projects/[slug]    → busca projects WHERE slug = params.slug + project_sections
```

## Admin → Supabase

Todas as operações CRUD usam o Supabase JS Client do lado do cliente, com RLS verificando a role do usuário autenticado.

## Build / Deploy

- Next.js com `output: 'standalone'` ou padrão Vercel
- Vercel Postgres não é usado — tudo via Supabase PostgreSQL remoto
- Variáveis de ambiente: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

---

# 6. Referências Visuais

As imagens dentro de `/docs/reference` são a fonte principal de referência visual.

Use as imagens como guia de composição, espaçamento, hierarquia, tom visual e comportamento geral.

## Home

Referências:

- `docs/reference/home/01-hero.png`
- `docs/reference/home/02-filosofia.png`
- `docs/reference/home/03-construindo.png`
- `docs/reference/home/04-ecossistema.png`
- `docs/reference/home/05-contato.png`

A Home deve seguir a ordem:

1. Hero
2. Filosofia
3. Construindo
4. Ecossistema Técnico
5. Contato

Cada seção da Home deve ocupar aproximadamente `100vh`.

A Home deve ser narrativa, não documental.

---

## About

Referência:

- `docs/reference/about/01-png`

A página About deve ter uma estrutura mais documental, parecida com um currículo premium, mas sem parecer LinkedIn.

A página About deve conter:

- sidebar fixa com foto
- nome
- cargo
- localização
- idiomas
- links sociais
- introdução
- experiência
- formação
- tecnologias
- contato

---

## Projects

Referências:

- `docs/reference/projects/geral.png`
- `docs/reference/projects/projeto-case.png`

A página Projects deve funcionar como um catálogo premium de estudos de caso.

Não deve ser apenas um grid comum.

Cada projeto deve ter imagem, descrição, stack e link para o case individual.

Cada projeto deve navegar para:

- `/projects/clube-de-programacao`
- `/projects/amr-mobile`
- `/projects/loyloucha-imports`
- `/projects/sistema-adocao-pets`
- `/projects/spring-scheduler`
- `/projects/portfolio-website`

---

## Identidade

Referências:

- `docs/reference/logo.png`
- `docs/reference/navbar.png`

A logo deve ser usada como símbolo principal.

A navbar deve ser minimalista, flutuante e discreta.

---

# 7. Direção Visual

A direção visual geral deve seguir esta proporção:

- 70% Linear
- 20% Apple
- 10% Stripe

## Significado prático

### Linear

Usar como referência para:

- minimalismo
- tipografia forte
- muito espaço vazio
- hierarquia clara
- poucos elementos por tela
- aparência de software profissional

### Apple

Usar como referência para:

- respiro visual
- elegância
- suavidade
- animações discretas
- sensação premium

### Stripe

Usar como referência para:

- storytelling
- organização de conteúdo
- apresentação de produto
- transições suaves

---

# 8. Estilo Visual

## Background

Usar fundo escuro profundo.

Cor principal:

```css
#050816
```

Pode usar variações próximas:

```css
#030014
#070A12
#080B16
```

Evitar fundo preto puro `#000000` em grandes áreas, a menos que combinado com gradientes muito sutis.

---

## Cores principais

```css
Primary Purple: #8B5CF6
Secondary Purple: #A855F7
Blue Accent: #60A5FA
Text Primary: #F8FAFC
Text Secondary: #94A3B8
Border: rgba(255,255,255,0.08)
Surface: rgba(255,255,255,0.04)
```

---

## Uso do roxo

O roxo deve ser usado com moderação.

Usar em:

- palavras importantes
- detalhes de navegação
- botões principais
- pontos da constelação
- linhas de destaque
- estados ativos

Não usar roxo em excesso.

Evitar aparência neon/gamer.

---

## Glassmorphism

Usar glassmorphism apenas nos elementos importantes.

Permitido em:

- navbar
- mockups de produto
- cards principais
- botões
- alguns blocos da página About
- cards de projeto

Evitar glass em todos os elementos.

Configuração recomendada:

```css
background: rgba(255, 255, 255, 0.04);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.08);
```

---

# 9. Tipografia

A tipografia é um dos elementos mais importantes do site.

Priorizar:

- títulos grandes
- peso visual forte
- poucos textos por tela
- parágrafos curtos
- hierarquia clara

Fontes recomendadas:

- Geist
- Inter
- Satoshi
- General Sans

Preferência visual:

- títulos com aparência premium
- corpo com alta legibilidade

Evitar fontes decorativas.

Evitar excesso de pesos.

---

# 10. Regras Globais de UX

## Regra 1

Cada seção deve responder uma pergunta clara.

Home:

- Hero: Quem é André?
- Filosofia: Como André pensa?
- Construindo: O que André está construindo?
- Ecossistema: Como André constrói?
- Contato: Como falar com André?

---

## Regra 2

A Home não deve parecer currículo.

A Home é narrativa.

O currículo e detalhes ficam no About.

---

## Regra 3

Projects não deve parecer grid genérico.

Projects deve parecer uma coleção de estudos de caso.

---

## Regra 4

Evitar excesso de conteúdo.

Se um texto não melhora a compreensão, remover.

---

## Regra 5

Nada deve competir com o conteúdo principal de cada seção.

---

# 11. Arquitetura do Site

Rotas principais:

```txt
/
```

Home narrativa.

```txt
/about
```

Página sobre André.

```txt
/projects
```

Catálogo premium de projetos.

```txt
/projects/[slug]
```

Página individual de case study.

---

# 12. Home

A Home deve ter exatamente 5 seções principais.

---

## 9.1 Hero

Referência:

`docs/reference/home/01-hero.png`

Objetivo:

Apresentar André como Software Engineer focado em produtos digitais.

Conteúdo principal:

```txt
André
Deomondes
```

Texto:

```txt
Construindo produtos com foco em
experiência, performance e arquitetura.
```

CTA:

```txt
Ver Clube de Programação
```

Visual do lado direito:

Constelação técnica minimalista com:

- TypeScript
- Java
- Spring Boot
- React
- AWS
- Docker
- PostgreSQL
- Redis

Centro da constelação:

```txt
Building
Digital
Products
```

Regras:

- Sem planeta
- Sem galáxia exagerada
- Sem cards com descrições longas
- Sem glow excessivo
- Sem dashboard
- Sem foto gigante
- A constelação deve ser elegante, técnica e minimalista

---

## 9.2 Filosofia

Referência:

`docs/reference/home/02-filosofia.png`

Objetivo:

Mostrar como André pensa.

Texto principal:

```txt
Software é sobre pessoas,
não apenas tecnologia.
```

A palavra `pessoas` deve ter destaque em roxo.

Texto secundário:

```txt
Construir software não é apenas escrever código.

É entender problemas,
projetar soluções
e criar experiências que geram impacto.
```

Regras:

- Sem cards
- Sem ícones
- Sem estatísticas
- Sem timeline
- Sem tecnologias
- Tipografia deve ser protagonista
- Muito espaço vazio

---

## 9.3 Construindo

Referência:

`docs/reference/home/03-construindo.png`

Objetivo:

Mostrar o projeto atual principal.

Título da seção:

```txt
Construindo
```

Subtítulo:

```txt
Atualmente Construindo
```

Projeto principal:

```txt
Clube de Programação
```

Descrição:

```txt
Uma plataforma para aprender programação através da prática.
```

Texto complementar:

```txt
Desafios interativos, progressão de aprendizado,
rankings e acompanhamento de evolução para estudantes de tecnologia.
```

CTA:

```txt
Ver Projeto
```

Visual:

- mockup em notebook
- interface do Clube de Programação
- aparência de produto real
- não parecer apenas dashboard administrativo

Outros produtos dentro da mesma seção:

- Sistema de Adoção de Pets
- Spring Scheduler
- Portfolio Website

Esses projetos devem ser secundários.

O Clube de Programação deve continuar sendo o protagonista.

---

## 9.4 Ecossistema Técnico

Referência:

`docs/reference/home/04-ecossistema.png`

Objetivo:

Mostrar como as ferramentas técnicas se conectam.

Título:

```txt
Meu Ecossistema Técnico
```

Texto:

```txt
Tecnologias são ferramentas.
O que importa é como elas se conectam
para resolver problemas reais.
```

Tecnologias:

- TypeScript
- Java
- Spring Boot
- React
- AWS
- Docker
- PostgreSQL
- Redis

Regras:

- Deve usar a linguagem visual da constelação
- Deve parecer sistema, não lista de skills
- Evitar explicações longas sobre cada tecnologia
- Evitar skill bars
- Evitar porcentagens

---

## 9.5 Contato

Referência:

`docs/reference/home/05-contato.png`

Objetivo:

Encerrar a narrativa com uma chamada clara.

Título:

```txt
Vamos construir
algo incrível.
```

Subtítulo:

```txt
Estou sempre aberto para conversar
sobre produtos, tecnologia e novas ideias.
```

CTA principal:

```txt
Conversar no WhatsApp
```

Links secundários:

- GitHub
- LinkedIn
- Email
- WhatsApp

Regras:

- Sem cards grandes
- Sem planeta
- Sem footer complexo
- Sem excesso de texto
- A tela deve parecer encerramento, não formulário

---

# 13. Navbar

Referência:

`docs/reference/navbar.png`

A navbar deve ser flutuante, discreta e minimalista.

Estrutura:

```txt
[Logo] André Deomondes     Projects     About     Menu
```

Ou versão compacta:

```txt
[Logo] André Deomondes     Projects     About     ☰
```

Regras:

- Não usar link Home
- A Home já é a rota `/`
- Não usar Contact na navbar principal
- Contact deve estar no final da Home
- A navbar deve sumir ao rolar para baixo
- A navbar deve reaparecer ao rolar para cima

Comportamento:

Scroll para baixo:

```txt
opacity: 1 → 0
translateY: 0 → -100%
```

Scroll para cima:

```txt
opacity: 0 → 1
translateY: -100% → 0
```

Menu aberto:

- overlay fullscreen
- links grandes
- visual editorial
- sem dropdown pequeno
- sem sidebar

Menu deve conter:

- GitHub
- LinkedIn
- Email
- WhatsApp
- Download CV

---

# 14. About

Referência:

`docs/reference/about/01-png`

Objetivo:

Apresentar André de forma mais documental e profissional.

O About deve parecer uma página de referência, não uma landing page.

Layout:

- Sidebar fixa à esquerda
- Conteúdo principal à direita
- Fundo escuro
- Tipografia limpa
- Poucos efeitos

---

## 11.1 Sidebar

Conteúdo:

```txt
Foto de André

André Deomondes

Software Engineer

Salvador, BA

Idiomas:
Português — Nativo
English — Intermediate

Navegação interna:
Introdução
Experiência
Formação
Tecnologias
Contato

Links:
GitHub
LinkedIn
Email
```

Usar ícones Lucide.

Não usar emojis.

---

## 11.2 Introdução

Título:

```txt
Construindo soluções
digitais que geram
impacto real.
```

Texto:

```txt
Sou engenheiro de software focado na construção de
sistemas, automações e produtos digitais.

Atualmente desenvolvo soluções para empresas e
iniciativas próprias, transformando problemas complexos
em software simples, escalável e útil.
```

Informações laterais:

- Localização: Salvador, BA
- Idiomas: Português — Nativo / English — Intermediate
- Foco:
  - Desenvolvimento de Software
  - Automação de Processos
  - Produtos Digitais

- Interesses:
  - Arquitetura de Software
  - Performance
  - Experiência do Usuário
  - Inteligência Artificial

---

## 11.3 Experiência

Empresas/projetos:

### AMR Mobile

```txt
2025 — Atualmente

Desenvolvimento de sistemas internos, automações
e aplicações mobile para operação e gestão.
```

Tags:

- Sistemas Internos
- Automação
- Aplicações Mobile

### Loyloucha Imports

```txt
2025

Desenvolvimento de soluções para gestão interna,
automatização de processos e melhoria operacional.
```

Tags:

- Gestão Interna
- Automação
- Processos

### SENAI

```txt
2025

Desenvolvimento de projetos acadêmicos e aplicação de
tecnologias em soluções práticas e inovadoras.
```

Tags:

- Projetos Acadêmicos
- Pesquisa Aplicada
- Desenvolvimento

---

## 11.4 Formação

### Engenharia da Computação

```txt
SENAI CIMATEC
```

### Técnico em Desenvolvimento de Sistemas

```txt
SENAI Dendezeiros
```

---

## 11.5 Tecnologias

Organizar por domínio.

### Backend

- Java
- Spring Boot
- NestJS
- Fastify
- Node.js

### Frontend

- TypeScript
- React
- Next.js
- Tailwind CSS

### Database & Cache

- PostgreSQL
- Redis
- Prisma

### DevOps & Tools

- Docker
- AWS
- Git
- GitHub

Não usar barras de progresso.

Não usar porcentagens.

Não usar níveis como “80%”.

---

# 15. Projects

Referência:

`docs/reference/projects/geral.png`

Objetivo:

Mostrar projetos como estudos de caso.

A página Projects deve funcionar como catálogo premium.

---

## 12.1 Hero

Título:

```txt
Projects.
```

Subtítulo:

```txt
Produtos, sistemas e experiências
que construí nos últimos anos.
```

---

## 12.2 Projeto Destaque

Projeto principal:

```txt
Clube de Programação
```

Descrição:

```txt
Plataforma completa para ensino de programação com
trilhas, exercícios práticos, comunidade e gamificação.
```

Destaques:

- Mais de 500 alunos ativos
- Gamificação e sistema de níveis
- Trilhas estruturadas do básico ao avançado
- Ambiente colaborativo com fóruns e reviews
- Painel administrativo completo

Tecnologias:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- Redis

CTA:

```txt
Ver case completo
```

Deve navegar para:

```txt
/projects/clube-de-programacao
```

---

## 12.3 Projetos Selecionados

Cada projeto deve ter:

- imagem/screenshot
- nome
- descrição curta
- tecnologias
- link “Ver case”
- rota própria

Projetos:

### AMR Mobile

Rota:

```txt
/projects/amr-mobile
```

Descrição:

```txt
Sistemas internos e automações para operação
e gestão de processos da empresa.
```

Tecnologias:

- React Native
- NestJS
- Fastify
- PostgreSQL
- AWS
- Docker
- TypeScript

### Loyloucha Imports

Rota:

```txt
/projects/loyloucha-imports
```

Descrição:

```txt
Sistema de gestão interna para controle de estoque,
pedidos, clientes e fluxo de importação.
```

Tecnologias:

- Next.js
- NestJS
- Prisma
- PostgreSQL
- Tailwind CSS

### Sistema de Adoção de Pets

Rota:

```txt
/projects/sistema-adocao-pets
```

Descrição:

```txt
Plataforma para ONGs publicarem pets para adoção
e conectarem adotantes.
```

Tecnologias:

- React
- Node.js
- MongoDB
- Express
- Tailwind CSS

### Spring Scheduler

Rota:

```txt
/projects/spring-scheduler
```

Descrição:

```txt
Serviço de agendamento de tarefas recorrentes
com fila, logs e notificações.
```

Tecnologias:

- Java
- Spring Boot
- PostgreSQL
- Redis

### Portfolio Website

Rota:

```txt
/projects/portfolio-website
```

Descrição:

```txt
Portfólio pessoal construído para apresentar
meu trabalho, projetos e jornada.
```

Tecnologias:

- Next.js
- TypeScript
- Tailwind CSS
- GSAP
- Supabase
- Vercel

---

## 12.4 CTA Final

Texto:

```txt
Tem um projeto em mente?
```

Subtítulo:

```txt
Estou sempre aberto a novas oportunidades
e colaborações interessantes.
```

Botões:

```txt
Entrar em contato
Ver mais no GitHub
```

---

# 16. Project Case Study

Referência:

`docs/reference/projects/projeto-case.png`

Cada página individual de projeto deve funcionar como estudo de caso.

Exemplo:

```txt
/projects/clube-de-programacao
```

---

## 13.1 Estrutura

A página deve conter:

1. Hero
2. Visão Geral
3. Problema
4. Solução
5. Resultado
6. Tecnologias
7. Arquitetura
8. Screenshots
9. Aprendizados
10. Próximos Passos
11. Navegação entre projetos

---

## 13.2 Hero

Título:

```txt
Clube de Programação
```

Descrição:

```txt
Plataforma completa para ensino de programação com
trilhas, exercícios práticos, comunidade e gamificação
que torna o aprendizado mais engajador e consistente.
```

Metadados:

- 2024 — Atual
- +500 alunos ativos
- Em produção

Tags:

- Educação
- SaaS
- Gamificação
- Comunidade

CTA:

```txt
Ver no GitHub
```

---

## 13.3 Visão Geral

Cards:

### Problema

```txt
O ensino tradicional de programação é muitas vezes
passivo, pouco prático e desmotivador. Faltam plataformas
que combinem prática real, acompanhamento de progresso
e comunidade ativa.
```

### Solução

```txt
Criei uma plataforma gamificada com trilhas estruturadas,
exercícios práticos, feedback automático e sistema de níveis,
transformando o aprendizado em uma jornada contínua.
```

### Resultado

```txt
Mais de 500 alunos ativos, alta taxa de conclusão das trilhas,
comunidade engajada e evolução consistente dos usuários.
```

---

## 13.4 Tecnologias

- Next.js
- TypeScript
- Tailwind CSS
- React
- Prisma
- PostgreSQL
- Node.js
- Fastify
- Redis
- Docker
- AWS S3 / EC2
- Git
- GitHub

---

## 13.5 Arquitetura

Mostrar diagrama com:

```txt
Frontend Next.js
↓
API Gateway / REST
↓
Backend Fastify
↓
PostgreSQL
↓
Redis Cache / Sessions
↓
AWS S3 Storage
```

---

## 13.6 Screenshots

Exibir 4 imagens:

- Dashboard
- Trilhas de aprendizado
- Exercícios práticos
- Ranking

---

## 13.7 Aprendizados

Exemplos:

```txt
Gamificação aumenta engajamento.
```

```txt
Feedback rápido é essencial para aprendizado.
```

```txt
Comunidade gera retenção.
```

---

## 13.8 Próximos Passos

```txt
App mobile para iOS e Android
```

```txt
Mais trilhas avançadas e especializações
```

```txt
Sistema de certificados e conquistas
```

```txt
Mentorias e eventos ao vivo
```

---

# 17. Animações

As animações devem ser elegantes e discretas.

Não usar animações chamativas.

Não usar efeitos exagerados.

---

## 14.1 Padrão Geral

Entrada de elementos:

```txt
opacity: 0 → 1
y: 24px → 0
duration: 0.6s
ease: easeOut
```

---

## 14.2 Hero

Nome:

```txt
fade-up
delay: 0.1s
```

Texto:

```txt
fade-up
delay: 0.2s
```

CTA:

```txt
fade-up
delay: 0.3s
```

Constelação:

```txt
fade-in
scale: 0.96 → 1
delay: 0.4s
```

Nós da constelação:

```txt
stagger: 0.08s
```

Linhas:

```txt
draw animation
duration: 1.2s
```

---

## 14.3 Filosofia

A frase deve surgir com base no scroll.

Palavras podem aparecer progressivamente.

Recomendação:

```txt
Software é sobre pessoas,
não apenas tecnologia.
```

A palavra `pessoas` deve receber o destaque roxo no final da animação.

---

## 14.4 Construindo

Mockup do notebook:

```txt
parallax leve
y: -20px → 20px
```

Texto:

```txt
fade-up
```

Outros produtos:

```txt
stagger cards
```

---

## 14.5 Ecossistema

Constelação:

```txt
linhas desenhando
nós aparecendo em sequência
leve rotação opcional
```

Não exagerar.

---

## 14.6 Contato

Título:

```txt
fade-up
```

CTA:

```txt
scale: 0.98 → 1
opacity: 0 → 1
```

Links:

```txt
stagger
```

---

# 18. Regras de Conteúdo

## Tom de voz

O texto deve ser:

- direto
- profissional
- humano
- sem exageros
- sem promessas vazias
- sem linguagem corporativa genérica

Evitar frases como:

```txt
Sou apaixonado por tecnologia
```

```txt
Trabalho com soluções inovadoras
```

```txt
Sempre buscando novos desafios
```

Preferir frases concretas:

```txt
Construo sistemas, automações e produtos digitais.
```

```txt
Transformo problemas complexos em software simples, escalável e útil.
```

```txt
Tecnologias são ferramentas. O importante é como elas se conectam para resolver problemas reais.
```

---

# 19. Regras Visuais Proibidas

Não usar:

- emojis
- gradientes coloridos exagerados
- neon forte
- cards demais
- grids genéricos
- skill bars
- porcentagens de conhecimento
- timeline clichê
- sombras exageradas
- glassmorphism em todos os elementos
- imagens aleatórias de banco
- seções muito longas sem propósito
- textos longos na Home

Usar ícones, não emojis.

Preferir Lucide React para ícones.

---

# 20. Performance

O projeto deve ser otimizado para Vercel.

Regras:

- otimizar imagens
- usar `next/image`
- evitar JavaScript desnecessário
- usar lazy loading em imagens abaixo da dobra
- manter animações performáticas
- evitar animações que causem layout shift
- priorizar responsividade

---

# 21. Responsividade

Desktop deve ser prioridade visual.

Mas o site precisa funcionar muito bem em mobile.

Mobile:

- navbar compacta
- menu fullscreen
- seções com altura flexível
- constelações simplificadas
- projetos em cards empilhados
- sidebar do About vira bloco superior
- imagens otimizadas

---

# 22. Qualidade Esperada

Cada página deve passar de 9/10 nos seguintes critérios:

- clareza
- hierarquia visual
- consistência
- maturidade
- performance
- responsividade
- experiência de navegação
- identidade visual

Se alguma seção parecer genérica, remover elementos.

Se alguma seção parecer muito cheia, reduzir.

Se alguma seção parecer gamer, reduzir glow.

Se alguma seção parecer currículo, tornar mais editorial.

Se alguma seção parecer SaaS genérico, dar mais foco ao produto e ao contexto.

---

# 23. Resultado Esperado

O resultado final deve parecer:

> O site de um Software Engineer que entende produto, arquitetura e experiência.

Não deve parecer apenas:

> Um portfólio bonito de desenvolvedor.

A experiência deve ser memorável, clara e profissional.

O visitante deve entender rapidamente:

1. Quem é André
2. Como André pensa
3. O que André constrói
4. Como André constrói
5. Como falar com André

Este guia deve ser seguido como fonte principal de verdade para o desenvolvimento.

# 24. Motion System — Animações e Transições (GSAP)

Todas as animações usam **GSAP** com **ScrollTrigger** para animações baseadas em scroll.
SplitText manual via `useRef` + DOM para animações de texto caractere por caractere.

Referência geral: Linear, Apple, Raycast, Stripe.

Não usar animações exageradas. Não usar: bounce, elastic, rotação exagerada, cursor customizado, partículas pesadas, transições gamer, zoom agressivo, parallax forte.

Usar sempre animações suaves, com foco em clareza, leitura e continuidade narrativa.

---

# 24.1 Configuração Global de Motion (GSAP)

Biblioteca obrigatória: **GSAP** + **ScrollTrigger** (gratuitos).

## Easing principal

```js
"power3.out"  // equivalente a cubic-bezier(0.22, 1, 0.36, 1)
```

Usar `power3.out` em praticamente todas as animações. Para saída mais suave: `power2.out`.

## Padrão de entrada (fade-up)

```js
gsap.fromTo(element,
  { opacity: 0, y: 24 },
  { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
)
```

## Padrão com ScrollTrigger

```js
gsap.fromTo(element,
  { opacity: 0, y: 24 },
  {
    opacity: 1, y: 0,
    duration: 0.6, ease: "power3.out",
    scrollTrigger: {
      trigger: element,
      start: "top 85%",
      toggleActions: "play none none reverse"
    }
  }
)
```

## Stagger (múltiplos elementos)

```js
gsap.fromTo(elements,
  { opacity: 0, y: 24 },
  { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out" }
)
```

## Timeline (sequência)

```js
const tl = gsap.timeline()
tl.fromTo(el1, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5 })
  .fromTo(el2, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
  .fromTo(el3, ...)
```

## Text Split (alternativa gratuita ao SplitText)

```js
// Quebrar texto em spans manualmente
function splitText(element) {
  const text = element.textContent
  element.textContent = ''
  text.split('').forEach(char => {
    const span = document.createElement('span')
    span.textContent = char
    span.style.display = 'inline-block'
    element.appendChild(span)
  })
  return element.children  // HTMLCollection de spans
}

// Animar letras individualmente
const chars = splitText(element)
gsap.fromTo(chars,
  { opacity: 0, y: 8 },
  { opacity: 1, y: 0, duration: 0.3, stagger: 0.03, ease: "power2.out" }
)
```

## Parallax com ScrollTrigger

```js
gsap.to(element, {
  y: -20,
  ease: "none",
  scrollTrigger: {
    trigger: element,
    start: "top bottom",
    end: "bottom top",
    scrub: true
  }
})
```

## Reduced Motion

```js
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
if (!prefersReduced) {
  gsap.fromTo(element, ...)
}
```

24.2 Page Transitions

Todas as páginas devem ter transição sutil com GSAP + Next.js App Router.

Usar um `Template` ou `Layout` com `useEffect` para disparar a animação de entrada.

```js
// app/template.tsx — transição de página global
'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Template({ children }: { children: React.ReactNode }) {
  const el = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.fromTo(el.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.35, ease: "power3.out" }
    )
  }, [])

  return <div ref={el}>{children}</div>
}
```

Não usar slide lateral ou zoom entre páginas. A transição deve ser quase imperceptível.

24.3 Navbar

A navbar deve ser fixa, flutuante e discreta. Comportamento: aparece ao carregar, some ao rolar para baixo, reaparece ao rolar para cima. Mantém blur/glass sutil.

**Entrada inicial:**
```js
gsap.fromTo(navbar,
  { opacity: 0, y: -24 },
  { opacity: 1, y: 0, duration: 0.5, delay: 0.2, ease: "power3.out" }
)
```

**Scroll para baixo:**
```js
gsap.to(navbar, { opacity: 0, y: -32, duration: 0.25, pointerEvents: "none" })
```

**Scroll para cima:**
```js
gsap.to(navbar, { opacity: 1, y: 0, duration: 0.25, pointerEvents: "auto" })
```

**Implementação com ScrollTrigger:**
```js
ScrollTrigger.create({
  trigger: document.body,
  start: "top -80px",
  onEnter: () => gsap.to(navbar, { opacity: 0, y: -32, duration: 0.25 }),
  onLeaveBack: () => gsap.to(navbar, { opacity: 1, y: 0, duration: 0.25 })
})
```

**Hover nos links:** opacity 0.72 → 1, color text-secondary → text-primary, duration 0.2s (CSS transition é suficiente).

**Indicador ativo:**
```js
gsap.fromTo(indicator,
  { scaleX: 0, opacity: 0 },
  { scaleX: 1, opacity: 1, duration: 0.25, ease: "power3.out" }
)
```
24.4 Menu Fullscreen

Overlay fullscreen com aparência editorial (não sidebar).

**Abertura do overlay:**
```js
gsap.fromTo(overlay,
  { opacity: 0 },
  { opacity: 1, duration: 0.3, ease: "power2.out" }
)
```

**Conteúdo interno com stagger:**
```js
const tl = gsap.timeline({ delay: 0.1 })
tl.fromTo(menuItems,
  { opacity: 0, y: 24 },
  { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out" }
)
```

**Links principais:** Projects, About
**Links secundários:** GitHub, LinkedIn, Email, WhatsApp, Download CV

**Hover dos links grandes:** x: 0 → 8, opacity: 0.75 → 1, duration: 0.2s (CSS transition).

**Fechamento:**
```js
gsap.to(overlay, { opacity: 0, duration: 0.2 })
```
25. Home — Animações por seção

A Home possui 5 seções:

01 Hero
02 Filosofia
03 Construindo
04 Ecossistema Técnico
05 Contato

Cada seção deve ocupar aproximadamente 100vh.

25.1 Home / Hero

Referência: `docs/reference/home/01-hero.png`

Elementos: label, nome, descrição, CTA, constelação técnica (centro + tecnologias orbitando).

Toda a entrada usa timeline do GSAP.

```js
const tl = gsap.timeline()

// Container fade
tl.fromTo(heroContainer, { opacity: 0 }, { opacity: 1, duration: 0.4 })

// Label
tl.fromTo(label, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, "+=0.1")

// Nome
tl.fromTo(name, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" })

// Descrição
tl.fromTo(description, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })

// CTA
tl.fromTo(cta, { opacity: 0, y: 20, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" })
```

**CTA Hover/Tap:** CSS transition (scale, boxShadow).

**Constelação — centro:**
```js
tl.fromTo(constellationCenter,
  { opacity: 0, scale: 0.96 },
  { opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" }
)
```

**Nós da constelação (stagger):**
```js
tl.fromTo(constellationNodes,
  { opacity: 0, scale: 0.85 },
  { opacity: 1, scale: 1, duration: 0.45, stagger: 0.08, ease: "power2.out" },
  "+=0.15"
)
```

**Linhas (SVG path draw):**
```js
gsap.fromTo(svgLines,
  { attr: { strokeDashoffset: length }, strokeDasharray: length, opacity: 0 },
  { attr: { strokeDashoffset: 0 }, opacity: 0.35,
    duration: 1.2, delay: 0.75, ease: "power3.out" }
)
```

**Movimento contínuo (flutuação):**
```js
gsap.to(constellationNodes, {
  y: "+=4", duration: 8, repeat: -1, yoyo: true, ease: "sine.inOut",
  stagger: { each: 0.3, from: "random" }
})
```

Não girar a constelação inteira.

**Hover nos nós:** CSS transition (scale, opacity). Linhas conectadas: opacity 0.25 → 0.6.
25.2 Transição Hero → Filosofia

Quando o usuário rola do Hero para a Filosofia, a constelação perde destaque via ScrollTrigger:

```js
// Constelação fade out
gsap.to(constellationContainer, {
  scrollTrigger: {
    trigger: filosofiaSection,
    start: "top bottom",
    end: "top center",
    scrub: true
  },
  opacity: 0, scale: 0.96
})

// Centro fade out + sobe
gsap.to(constellationCenter, {
  scrollTrigger: {
    trigger: filosofiaSection,
    start: "top bottom",
    end: "top center",
    scrub: true
  },
  opacity: 0, y: -24
})
```

A transição sugere: tecnologia → produto → pessoas.

25.3 Home / Filosofia

Referência: `docs/reference/home/02-filosofia.png`

Texto revelado com scroll via ScrollTrigger. Split manual para exibir palavras individualmente.

```js
// Parte 1: "Software é sobre"
gsap.fromTo(filosofiaPart1,
  { opacity: 0, y: 32 },
  {
    opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
    scrollTrigger: {
      trigger: filosofiaSection,
      start: "top 75%",
      end: "top 60%",
      toggleActions: "play none none reverse"
    }
  }
)

// Palavra "pessoas" com destaque roxo
gsap.fromTo(pessoasWord,
  { opacity: 0, scale: 0.95, color: "#F8FAFC" },
  {
    opacity: 1, scale: 1, color: "#8B5CF6", duration: 0.5,
    scrollTrigger: {
      trigger: filosofiaSection,
      start: "top 65%",
      end: "top 50%",
      toggleActions: "play none none reverse"
    }
  }
)

// "não apenas tecnologia."
gsap.fromTo(filosofiaPart2,
  { opacity: 0, y: 24 },
  {
    opacity: 1, y: 0, duration: 0.5,
    scrollTrigger: {
      trigger: filosofiaSection,
      start: "top 55%",
      end: "top 40%",
      toggleActions: "play none none reverse"
    }
  }
)

// Texto secundário
gsap.fromTo(filosofiaSecondary,
  { opacity: 0, y: 20 },
  {
    opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: "power3.out",
    scrollTrigger: { trigger: filosofiaSection, start: "top 45%", toggleActions: "play none none reverse" }
  }
)
```

**Elementos de fundo:** 3-4 pontos discretos com flutuação suave:
```js
gsap.to(bgDots, { opacity: 0.25, duration: 6, repeat: -1, yoyo: true, stagger: 0.5 })
```

Não usar linhas grandes, não usar planetas.

25.4 Home / Construindo

Referência: `docs/reference/home/03-construindo.png`

Elementos: label, "Atualmente Construindo", título "Clube de Programação", descrição, CTA, notebook mockup, cards secundários.

```js
const tl = gsap.timeline({
  scrollTrigger: { trigger: construindoSec, start: "top 80%", toggleActions: "play none none reverse" }
})

tl.fromTo(label, { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" })
  .fromTo(title, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" })
  .fromTo(description, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
  .fromTo(cta, { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" })

// Notebook mockup
gsap.fromTo(notebook,
  { opacity: 0, y: 40, scale: 0.96 },
  {
    opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.25, ease: "power3.out",
    scrollTrigger: { trigger: construindoSec, start: "top 75%", toggleActions: "play none none reverse" }
  }
)

// Parallax leve no notebook
gsap.to(notebook, {
  y: -20, ease: "none",
  scrollTrigger: { trigger: construindoSec, start: "top bottom", end: "bottom top", scrub: true }
})
```

**Hover notebook:** CSS transition (scale, rotateX/Y suave). Não exagerar 3D.

**Cards secundários (stagger):**
```js
gsap.fromTo(secondaryCards,
  { opacity: 0, y: 24 },
  {
    opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out",
    scrollTrigger: { trigger: construindoSec, start: "top 60%", toggleActions: "play none none reverse" }
  }
)
```

**Hover dos cards:** CSS transition (y, borderColor, image scale).

25.5 Home / Ecossistema Técnico

Referência: `docs/reference/home/04-ecossistema.png`

Mostra como as tecnologias se conectam. Volta com a linguagem visual da constelação.

```js
// Texto
gsap.fromTo(ecosystemText,
  { opacity: 0, y: 32 },
  {
    opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
    scrollTrigger: { trigger: ecosystemSec, start: "top 80%", toggleActions: "play none none reverse" }
  }
)

// Centro da constelação
gsap.fromTo(ecoCenter,
  { opacity: 0, scale: 0.9 },
  {
    opacity: 1, scale: 1, duration: 0.6, delay: 0.2, ease: "power3.out",
    scrollTrigger: { trigger: ecosystemSec, start: "top 75%", toggleActions: "play none none reverse" }
  }
)

// Nós com stagger
gsap.fromTo(ecoNodes,
  { opacity: 0, scale: 0.8 },
  {
    opacity: 1, scale: 1, duration: 0.45, stagger: 0.08, ease: "power2.out",
    scrollTrigger: { trigger: ecosystemSec, start: "top 70%", toggleActions: "play none none reverse" }
  }
)

// Linhas SVG draw
gsap.fromTo(ecoSvgLines,
  { attr: { strokeDashoffset: length }, strokeDasharray: length, opacity: 0 },
  {
    attr: { strokeDashoffset: 0 }, opacity: 0.35, duration: 1.4, delay: 0.4, ease: "power3.out",
    scrollTrigger: { trigger: ecosystemSec, start: "top 70%", toggleActions: "play none none reverse" }
  }
)
```

**Hover:** CSS transition (node scale, label opacity, line opacity).

**Movimento contínuo:** gsap.to com yoyo, stagger random. Não girar todos ao mesmo tempo.

25.6 Home / Contato

Referência: `docs/reference/home/05-contato.png`

```js
const tl = gsap.timeline({
  scrollTrigger: { trigger: contatoSec, start: "top 80%", toggleActions: "play none none reverse" }
})

// Título "Vamos construir"
tl.fromTo(contatoTitle, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" })
  // Palavra "algo incrível" em roxo
  .fromTo(contatoDestaque, { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" })
  // Subtítulo
  .fromTo(contatoSub, { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" })
  // CTA
  .fromTo(contatoCta, { opacity: 0, scale: 0.96 },
    { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" })
  // Links em stagger
  .fromTo(contatoLinks, { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out" })
```

**CTA Hover/Tap:** CSS transition (scale, boxShadow).

**Links Hover:** CSS transition (y, opacity, icon scale).
26. About — Animações (GSAP)

A página About é documental, com menos motion que a Home. Animações discretas. Referência: `docs/reference/about/01-png`.

26.1 Sidebar About

Sticky: `position: sticky; top: 96px;`

```js
gsap.fromTo(sidebar,
  { opacity: 0, x: -24 },
  { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" }
)
```

**Foto:** opacity, scale com delay 0.1s. **Nome e cargo:** opacity, y com delay 0.2s.

**Links internos:**
```js
gsap.fromTo(sidebarLinks,
  { opacity: 0, x: -12 },
  { opacity: 1, x: 0, duration: 0.4, stagger: 0.05, delay: 0.3, ease: "power2.out" }
)
```

**Hover nos links:** CSS transition (x, color). **Link ativo:** color roxo + indicador via Intersection Observer.

26.2 About / Introdução

```js
const tl = gsap.timeline({ delay: 0.3 })
tl.fromTo(aboutTitle, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" })
  .fromTo(aboutParagraphs, { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" })
  .fromTo(aboutInfoBlock, { opacity: 0, x: 24 },
    { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }, "-=0.2")
```

26.3 About / Experiência

Cada item entra ao aparecer na viewport.

```js
gsap.fromTo(experienceItems,
  { opacity: 0, y: 24 },
  {
    opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out",
    scrollTrigger: { trigger: experienceSec, start: "top 85%", toggleActions: "play none none reverse" }
  }
)
```

**Linha vertical:** `gsap.fromTo(timelineLine, { height: "0%" }, { height: "100%", duration: 1.2 })` via ScrollTrigger.

**Pontos da timeline:** `gsap.fromTo(dots, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.1 })`.

**Tags:** stagger 0.04, **Hover:** CSS transition.

26.4 About / Formação

```js
gsap.fromTo(educationCards,
  { opacity: 0, y: 24 },
  {
    opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out",
    scrollTrigger: { trigger: educationSec, start: "top 85%", toggleActions: "play none none reverse" }
  }
)
```

**Hover:** CSS transition.

26.5 About / Tecnologias

```js
gsap.fromTo(techCategories,
  { opacity: 0, y: 24 },
  {
    opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out",
    scrollTrigger: { trigger: techSec, start: "top 85%", toggleActions: "play none none reverse" }
  }
)

gsap.fromTo(techChips,
  { opacity: 0, scale: 0.95 },
  {
    opacity: 1, scale: 1, duration: 0.3, stagger: 0.03, ease: "power2.out",
    scrollTrigger: { trigger: techSec, start: "top 80%", toggleActions: "play none none reverse" }
  }
)
```

**Hover chips:** CSS transition (background, borderColor, y). Não usar animações chamativas.

27. Projects — Animações (GSAP)

Referência: `docs/reference/projects/geral.png`. Catálogo premium de cases.

27.1 Projects / Hero

```js
const tl = gsap.timeline()
tl.fromTo(projectsTitle, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" })
  .fromTo(projectsSub, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" })
  .fromTo(projectsGithub, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" })
```

27.2 Projects / Clube de Programação Destaque

```js
gsap.fromTo(featuredContainer,
  { opacity: 0, y: 40 },
  {
    opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
    scrollTrigger: { trigger: featuredContainer, start: "top 85%", toggleActions: "play none none reverse" }
  }
)

gsap.fromTo(featuredImage,
  { opacity: 0, scale: 0.96 },
  { opacity: 1, scale: 1, duration: 0.8, delay: 0.2, ease: "power3.out" }
)

gsap.fromTo(featuredTags,
  { opacity: 0 },
  { opacity: 1, duration: 0.3, stagger: 0.04, ease: "power2.out" }
)
```

**Hover screenshot/CTA:** CSS transition.

27.3 Projects / Cards de Projetos

```js
gsap.fromTo(projectCards,
  { opacity: 0, y: 32 },
  {
    opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out",
    scrollTrigger: { trigger: projectGrid, start: "top 85%", toggleActions: "play none none reverse" }
  }
)
```

**Hover:** CSS transition (card y, borderColor; image scale; link x).

27.4 Projects / CTA Final

```js
gsap.fromTo(projectsCtaTitle,
  { opacity: 0, y: 24 },
  {
    opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
    scrollTrigger: { trigger: projectsCtaSec, start: "top 85%", toggleActions: "play none none reverse" }
  }
)

gsap.fromTo(projectsCtaBtns,
  { opacity: 0, scale: 0.98 },
  { opacity: 1, scale: 1, duration: 0.4, stagger: 0.08, ease: "power2.out" }
)
```

**Hover:** CSS transition.
28. Project Case Study — Animações (GSAP)

Referência: `docs/reference/projects/projeto-case.png`. Cada case deve ser claro, técnico e narrativo.

28.1 Case / Voltar

```js
gsap.fromTo(backLink,
  { opacity: 0, x: -12 },
  { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
)
```

**Hover:** CSS transition (x).

28.2 Case / Hero

```js
const tl = gsap.timeline()
tl.fromTo(caseTitle, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" })
  .fromTo(caseDesc, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" })
  .fromTo(caseMeta, { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.3, stagger: 0.06, ease: "power2.out" })

// Mockup principal
gsap.fromTo(caseMockup,
  { opacity: 0, scale: 0.96, y: 40 },
  { opacity: 1, scale: 1, y: 0, duration: 0.8, delay: 0.25, ease: "power3.out" }
)

// Parallax leve no mockup
gsap.to(caseMockup, {
  y: -20, ease: "none",
  scrollTrigger: { trigger: caseMockup, start: "top bottom", end: "bottom top", scrub: true }
})
```

28.3 Case / Visão Geral

```js
gsap.fromTo(caseCards,
  { opacity: 0, y: 24 },
  {
    opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out",
    scrollTrigger: { trigger: caseOverview, start: "top 85%", toggleActions: "play none none reverse" }
  }
)
```

**Hover:** CSS transition.

28.4 Case / Tecnologias

```js
gsap.fromTo(caseTechChips,
  { opacity: 0, y: 24 },
  {
    opacity: 1, y: 0, duration: 0.4, ease: "power2.out",
    scrollTrigger: { trigger: caseTechSec, start: "top 85%", toggleActions: "play none none reverse" }
  }
)

gsap.fromTo(caseTechChips,
  { scale: 0.96, opacity: 0 },
  { scale: 1, opacity: 1, duration: 0.3, stagger: 0.03, ease: "power2.out" }
)
```

**Hover:** CSS transition.

28.5 Case / Arquitetura

```js
gsap.fromTo(archNodes,
  { opacity: 0, scale: 0.9 },
  {
    opacity: 1, scale: 1, duration: 0.4, stagger: 0.08, ease: "power2.out",
    scrollTrigger: { trigger: archSec, start: "top 85%", toggleActions: "play none none reverse" }
  }
)

gsap.fromTo(archLines,
  { attr: { strokeDashoffset: length }, strokeDasharray: length, opacity: 0 },
  { attr: { strokeDashoffset: 0 }, opacity: 0.45, duration: 1.2, ease: "power3.out" }
)
```

**Hover nós:** CSS transition.

28.6 Case / Screenshots

```js
gsap.fromTo(screenshots,
  { opacity: 0, y: 32, scale: 0.98 },
  {
    opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: "power3.out",
    scrollTrigger: { trigger: screenshotsGrid, start: "top 85%", toggleActions: "play none none reverse" }
  }
)
```

**Hover:** CSS transition. Não abrir modal inicialmente.

28.7 Case / Aprendizados

```js
gsap.fromTo(learnings,
  { opacity: 0, x: -16 },
  {
    opacity: 1, x: 0, duration: 0.4, stagger: 0.08, ease: "power2.out",
    scrollTrigger: { trigger: learningsSec, start: "top 85%", toggleActions: "play none none reverse" }
  }
)
```

**Hover:** CSS transition.

28.8 Case / Próximos Passos

```js
gsap.fromTo(nextSteps,
  { opacity: 0, y: 16 },
  {
    opacity: 1, y: 0, duration: 0.3, stagger: 0.06, ease: "power2.out",
    scrollTrigger: { trigger: nextStepsSec, start: "top 85%", toggleActions: "play none none reverse" }
  }
)
```

28.9 Case / Navegação entre projetos

```js
gsap.fromTo(caseNavLinks,
  { opacity: 0, y: 24 },
  {
    opacity: 1, y: 0, duration: 0.5, ease: "power3.out",
    scrollTrigger: { trigger: caseNavSec, start: "top 85%", toggleActions: "play none none reverse" }
  }
)
```

**Hover:** CSS transition (x para cada lado).
29. Interaction States

Todos os elementos interativos devem ter estados claros. Preferir CSS transitions para hover/active/focus, reservando GSAP para animações de entrada e scroll.

```css
/* Botões */
.btn {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.btn:hover { transform: scale(1.02); }
.btn:active { transform: scale(0.98); }
.btn:focus { outline: 2px solid rgba(139,92,246,0.55); outline-offset: 4px; }

/* Links */
.link {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.link:hover { opacity: 1; transform: translateX(3px); }

/* Cards */
.card {
  transition: transform 0.25s ease, border-color 0.25s ease;
}
.card:hover { transform: translateY(-4px); border-color: rgba(139,92,246,0.25); }

/* Imagens */
.img-hover {
  transition: transform 0.35s ease;
}
.img-hover:hover { transform: scale(1.03); }
```

30. Scroll Behavior

Usar scroll suave nativo. Não usar scroll hijacking. A Home deve parecer fluida.

```css
html { scroll-behavior: smooth; }
```

31. Responsive Motion (GSAP)

Em mobile, reduzir animações.

```js
const isMobile = window.innerWidth < 768

if (isMobile) {
  // Remover parallax pesado
  // Reduzir stagger para 0.04
  // Simplificar constelações (menos nós)
  // Apenas fade-up simples
  gsap.fromTo(element, { opacity: 0 }, { opacity: 1, duration: 0.4 })
} else {
  gsap.fromTo(element, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 })
}
```

Respeitar `prefers-reduced-motion`:

```js
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

if (prefersReduced) {
  gsap.set(element, { opacity: 1, y: 0, scale: 1 })  // estado final direto
} else {
  gsap.fromTo(element, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 })
}
```

32. Loading

Sem loading screen longa. Se necessário, apenas a logo com GSAP:

```js
const tl = gsap.timeline()
tl.fromTo(logo, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" })
  .to(logo, { opacity: 0, duration: 0.2, delay: 0.3 })
```

Sem splash screen demorada, sem vídeo de abertura.

33. Motion Rules finais

Todas as animações devem seguir estas regras:

- Motion deve ajudar a leitura.
- Motion não deve chamar mais atenção que o conteúdo.
- Motion deve parecer caro, não chamativo.
- Motion deve manter performance (preferir `will-change` e `force3D: true` no GSAP).
- Motion deve funcionar sem quebrar responsividade.
- Motion deve respeitar `prefers-reduced-motion`.
- Motion deve reforçar narrativa.
- Motion deve ser consistente entre páginas.
- Motion deve evitar exageros.
- Se a animação parecer decorativa demais, remover.

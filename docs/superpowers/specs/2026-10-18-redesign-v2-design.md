# Redesign v2 · andredeomondes.dev

Data: 2026-10-18 · Substitui a direção visual de `2026-10-17-redesign-8bit-design.md`.
Branch: `redesign/v2` (a partir de `redesign/8bit-foundation`, que fica como base técnica: correções de TS, testes e remoção de código morto).

## Por que existe

O Andre rejeitou a v1: ela repintou a estrutura antiga, o blog e a série ficaram fora do padrão e faltou o nível de micro e macro animação da Visuvate, da Raycast e da Vercel. O pedido: **mudar tudo o que ficar melhor**, sem se prender ao gosto dele nem ao site atual, com nível de vencedor do Awwwards. Contato funcional e **sem formulário**, fácil no celular e no desktop. Ele delegou as decisões ("planeje e faça").

Fixo: o conteúdo (projetos, posts, exercícios, currículo, perfil), o Next.js 16, os dados do Supabase e o admin.
Livre: layout, componentes, tipografia, cor, movimento e cópia das seções.

## O que as referências ensinam (estudadas em 1440px, quadro a quadro)

- **Visuvate:** navbar cheia que vira pílula no scroll; hero centrado com uma peça de produto viva (editor) que cresce e se fixa enquanto rola; título de seção fixado com fundo de feixes de luz; túnel 3D de trabalhos voando em perspectiva; bento com widgets vivos (relógio, tabela, gráfico); contadores; FAQ; CTA com marca 3D gigante; Lenis para scroll.
- **Raycast:** preto profundo, luz colorida volumétrica atrás da UI; o produto (o launcher) é o herói; teclas 3D; títulos curtos em duas linhas (frase forte + frase cinza).
- **Vercel:** grid de linhas finas que divide a página em células, com marcas de cruz nas interseções; títulos à esquerda; listas de recursos à direita; precisão tipográfica.

## Conceito: "o console do Andre"

O elemento mais característico do mundo dele é um sistema rodando, operado pelo teclado. O herói é um **command palette de verdade** (estilo Raycast), flutuando sobre uma luz amarela volumétrica. Ele é funcional: digitar filtra projetos, posts e ações, e ⌘K/Ctrl+K abre o mesmo palette em qualquer página. O site inteiro se navega por ele. É o ponto memorável; o resto fica quieto e preciso.

## Tokens

### Cor: "luz de sódio sobre grafite"
O amarelo não é preenchimento chapado: é **luz** (glows, feixes, reflexos), ligando a assinatura ao JavaScript sem parecer o clichê "preto + um acento ácido".

| Token | Hex | Papel |
|---|---|---|
| `graphite` | `#060708` | fundo |
| `panel` | `#0F1012` | superfícies, janelas |
| `line` | `rgba(255,255,255,.07)` | grid, bordas |
| `fog` | `#9C9CA3` | texto secundário |
| `paper` | `#F4F4F1` | texto principal |
| `sodium` | `#FFD43B` | núcleo da luz, foco, estados ativos |
| `amber` | `#FF9F1C` | borda quente da luz (só em gradientes de glow) |

Verde `#3DDC84` só para "online / ok".

### Tipografia
- **Geist** (variável): títulos e interface. Títulos em 600–700, tracking −0.035em a −0.05em, `text-wrap: balance`. Precisão de engenharia (referência Vercel).
- **JetBrains Mono**: código, atalhos de teclado, dados vivos e números (`tabular-nums`).
- Sem itálico de destaque e sem cor numa palavra só dentro de títulos. A personalidade vem do **movimento do tipo**: o título do hero "compila" (decodifica caractere a caractere) uma única vez no load.
- Fonte pixel: removida.

### Layout
- **Trilhos de blueprint** (Vercel): duas linhas verticais finas nas bordas do container, por toda a página, com marcas `+` onde cada seção começa. Seções são células delimitadas por essas linhas.
- Títulos alinhados à esquerda, em duas linhas: frase forte em `paper` e complemento em `fog` (padrão Raycast). Só o hero é centrado.
- Raio: janelas 16px, cards 14px, botões 999px (pílula), com raio concêntrico nos aninhados.

```
HOME
┌──────────────── nav (cheia → pílula de vidro no scroll) ────────────────┐
│                     ░░ luz de sódio volumétrica ░░                      │
│                Engenharia de backend e IA aplicada                       │
│                que roda em produção.            (decode no load)         │
│      ┌──────────────── command palette (funcional) ───────────────┐     │
│      │ ⌕ Buscar projetos, posts, ações…                     ⌘K    │     │
│      │ Projetos  ▸ Drop Aki TCG · AMR Mobile · CajiAgent           │     │
│      │ Série     ▸ Event loop · Promises …                         │     │
│      │ Ações     ▸ Chamar no WhatsApp · Copiar e-mail · CV         │     │
│      └────────────────────────────────────────────────────────────┘     │
│  (scroll: palette fixa, cresce e o grupo "Projetos" vira a seção abaixo) │
├──────────────────────────────────────────────────────────────────────────┤
│ Trabalho  ── galeria horizontal fixada (GSAP), 1 case por tela,          │
│              screenshot com parallax interno, contador 01/03             │
├──────────────────────────────────────────────────────────────────────────┤
│ Capacidades ── bento vivo: terminal de deploy, gráfico de latência,      │
│               teclas 3D da stack (afundam no hover/scroll), relógio      │
│               de Salvador                                                │
├──────────────────────────────────────────────────────────────────────────┤
│ JS Core ── trilha do curso (23 unidades) com progresso; hover mostra a   │
│            capa do carrossel; CTA para a série                           │
├──────────────────────────────────────────────────────────────────────────┤
│ Finale ── "Vamos construir algo que roda." com varredura de luz e o      │
│           launcher de contato aberto inline                              │
└──────────────────────────────────────────────────────────────────────────┘
```

## Movimento

**Stack (decisão minha):** Lenis (scroll suave sincronizado ao GSAP ticker), GSAP + ScrollTrigger (macro: pin, scrub, horizontal), Motion (`motion/react`, micro: springs, layout, presença), cmdk (palette).

**Macro (scroll):**
1. Hero: a luz respira devagar; ao rolar, a palette fica fixada, escala de 0.92 → 1 e a luz se abre; depois a seção de trabalho entra por baixo.
2. Trabalho: galeria horizontal fixada, com scrub; cada screenshot tem parallax interno e o contador avança.
3. Capacidades: as células do bento entram em cascata uma vez; as teclas 3D afundam em sequência quando a seção cruza o centro.
4. JS Core: a barra de progresso enche conforme rola; os números contam.
5. Finale: um feixe de luz varre o título uma vez ao entrar.
6. Troca de página: view transition curta (≤300ms), com a navbar fixa.

**Micro (ação da pessoa):** botões magnéticos com mola; spotlight que segue o cursor nos cards e janelas; texto que embaralha no hover dos links da nav; palette com abertura em mola e item ativo deslizando (layout animation); toasts de confirmação ("E-mail copiado"); press `scale(.96)`; contadores `tabular-nums`; cursor de digitação no palette.

**Regras:** só `transform`, `opacity`, `filter` e `clip-path`. Com `prefers-reduced-motion`, nada se move: sem Lenis, sem pin, sem scrub, sem decode, e o conteúdo aparece no estado final. Loops pausam fora da tela e com a aba oculta. Tudo legível sem JS (o palette vira lista de links no SSR). GSAP e Lenis carregam sob demanda.

## Contato sem formulário

- **Botão fixo "Falar comigo"**: pílula no canto inferior direito no desktop e centralizada embaixo no celular. No desktop abre um painel ancorado; no celular, uma bottom sheet arrastável (Motion drag).
- **Conteúdo:** status "Disponível" com a hora local de Salvador ao vivo; chips de assunto (Projeto freelance, Vaga, Consultoria, Só dizer oi) que montam a mensagem; ações:
  - **WhatsApp:** abre `wa.me/<profile.whatsapp>?text=<mensagem do chip>`.
  - **E-mail:** copia `profile.email` com toast e oferece o link `mailto:` com assunto preenchido.
  - **LinkedIn** e **GitHub**.
- O palette (⌘K) tem as mesmas ações. Sem backend. O formulário de briefing sai do site público (a rota `/api/contact` fica, sem uso na UI).

## Páginas

| Rota | Desenho |
|---|---|
| `/` | Conforme o wireframe acima. |
| `/projects` | Lista editorial grande: cada case é uma linha cheia com título enorme; no hover, a screenshot segue o cursor (preview flutuante). No celular, cards empilhados. |
| `/projects/[slug]` | Hero com título, fatos em grid de células (trilhos) e a screenshot principal numa janela com luz; seções fixadas lado a lado (texto fixo à esquerda, conteúdo rolando à direita); arquitetura como diagrama de nós conectados por linhas animadas (traço desenhando no scroll); galeria com lightbox; próximo case em tela cheia. |
| `/series/javascript-core` | Página de curso: progresso, módulos agrupados (Fundamentos 1–4, Funções e dados 5–11, Objetos e erros 12–14, Linguagem avançada 15–17, Assíncrono 18–23); cada unidade é uma linha com estado e hover com a capa. |
| `/posts` | Índice com busca instantânea e filtro por módulo; cards com a capa do carrossel e spotlight. |
| `/posts/[slug]` | Leitura estilo docs: índice lateral fixo com a seção ativa, barra de progresso de leitura, carrossel numa janela, código em painel de editor e exercícios no workbench restilizado. |
| `/about` | Retrato normal e grande, bio, linha do tempo com marcador que desce junto com o scroll, stack em teclas 3D. |
| `/resume` | Dois cards de download (PT/EN) com preview e os princípios ATS. |
| `/admin/*` | Só herda os tokens. |

## Conteúdo

Nada inventado: os textos vêm de `projects.ts`, `posts.ts` e `site-content`. Os dados vivos do bento (terminal, latência) são **ilustrativos e genéricos**, marcados com aria-hidden e sem nome de cliente. As barras de atributo da v1 saem.

## Restrições técnicas

- `tsc`, `eslint` e `next build` limpos; nunca `ignoreBuildErrors`.
- Orçamento: LCP < 2,5s no mobile em 4G, CLS ≈ 0 e JS inicial da home ≤ ~220 KB (GSAP e Lenis fora do bundle inicial).
- Testes Playwright para cada comportamento (palette, launcher, galeria, movimento reduzido, sem JS, overflow mobile). Os e2e rodam isolados (porta 3100, `.next-e2e`) e usam o Edge do sistema.
- Não mexer em `src/content/posts.ts` nem em `public/posts/*`: o Andre está editando esses arquivos em paralelo.

## Ordem de construção

1. Fundação: tokens, fontes, CSS novo do zero, Lenis + GSAP sob demanda, primitivas (spotlight, magnetic, scramble, decode, reveal).
2. Shell: navbar (cheia → pílula), trilhos de blueprint, footer, command palette global.
3. Launcher de contato.
4. Home.
5. Projetos e case.
6. Série, posts e post.
7. Sobre e currículo.
8. Limpeza, testes de borda, performance e revisão final da branch.

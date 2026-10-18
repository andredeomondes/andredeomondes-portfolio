# Redesign 8-bit · andredeomondes.dev

Data: 2026-10-17
Status: rascunho para aprovação
Mockup de referência: [`2026-10-17-redesign-8bit-home-mockup.html`](2026-10-17-redesign-8bit-home-mockup.html). É um HTML estático que referencia as imagens como `/files/<nome>.webp`. Os originais estão em `frontend/public/brand/andre-editorial-v2.webp` e `frontend/public/projects/`. Serve como referência de comportamento e animação, não de código de produção.

## 1. Intenção

Levar o site a um acabamento de nível Awwwards sem perder o papel dele: provar a recrutadores, lideranças técnicas e clientes que Andre entrega sistemas reais em produção.

A referência de sensação é a [Visuvate](https://visuvate.com/): estética limpa, tecnológica e animada, com uma peça central de produto "viva" no hero e contraste tipográfico em cada título. A diferença é a assinatura retrô. A nostalgia de game aparece como tempero (fonte pixel, blocos, glitch, cursor), nunca como tema. O site **não** é um jogo.

O Andre rejeitou explicitamente a primeira direção, que era "o site como jogo" (tela de título arcade, seleção de fase, HUD de score como metáfora central). E aprovou a v4 do mockup como direção.

## 2. Objetivos

- Primeira impressão de site premium e tecnológico, com algo em movimento já no primeiro viewport.
- Identidade própria: JetBrains Mono como base e fonte pixel nos destaques. É reconhecível sem ser caricata.
- Manter o conteúdo atual (projetos, série JS Core, sobre, currículo, contato) e a regra do `PRODUCT.md`: nada de métricas, resultados ou responsabilidades inventadas.
- Desempenho e acessibilidade continuam fazendo parte do acabamento.

## 3. Não-objetivos

- Reescrever conteúdo, dados ou o backend/Supabase.
- Redesenhar o painel `/admin`. Ele só precisa continuar funcionando e legível com os novos tokens globais.
- Criar novas páginas ou funcionalidades.
- Modo claro. O site novo é todo escuro (veja a seção 11).

## 4. Anti-objetivos (fracasso mesmo se funcionar)

- Parecer fantasia de game: scanlines fortes, "insert coin", HUD de pontos como navegação, sprites decorativos.
- Fonte pixel em parágrafo ou em texto longo.
- Animação que atrasa a leitura ou esconde conteúdo. O loader de rota em tela cheia atual sai.
- Amarelo virando superfície grande ou cor de texto corrido.
- Cara de template: glow genérico, gradientes roxos, cards de vidro em tudo.

## 5. Sistema visual

Substitui o `frontend/DESIGN.md` atual ("Monochrome Glass + Signal Orange"). O builder reescreve o `DESIGN.md` com este conteúdo e atualiza a seção *Brand Commitments* do `PRODUCT.md` (troca "integralmente monocromática" por "monocromática com acento amarelo JS").

### Cores

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#070707` | fundo |
| `--panel` | `#0e0e0e` | superfícies elevadas (IDE, cards) |
| `--fg` | `#f3f3ef` | texto principal |
| `--mute` | `#8b8b86` | texto secundário, metadados |
| `--line` | `rgba(255,255,255,.08)` | bordas e grids |
| `--js` | `#f7df1e` | acento único |

O amarelo é usado só em palavras de destaque em pixel, cursor, status ativo, item de nav ativo, foco, barras de progresso e no brilho sutil do IDE. Ocupa no máximo uns 5–10% de qualquer tela. Verde (`#22c55e`) aparece só como indicador de status OK ou disponível. O laranja `#d95824` sai por completo.

### Tipografia

- **JetBrains Mono** (300–800) para tudo: títulos em 800 com tracking de `-0.045em`, corpo em 400.
- **Silkscreen** só em destaques: 1 ou 2 palavras por título, rótulos curtos e marquee. Nunca em frase inteira nem abaixo de 11px.
- O padrão de título é misturar as duas na mesma linha, com a palavra-chave em pixel e, se fizer sentido, em amarelo. Ex.: "Sistemas que **rodam** em **produção**". É o equivalente ao itálico serifado da Visuvate.
- Saem: Space Grotesk, Geist Sans e Geist Mono. As fontes carregam via `next/font/google`.

### Material e forma

- Raio de 14px em painéis e cards, 10px em botões. Bordas de 1px com `--line`.
- Vidro (blur de 14px) só na navbar em pílula e em overlays. Fora isso, superfícies opacas.
- Grid de 48px como textura sutil, mascarado em gradiente radial, só no hero.
- Detalhes pixel: logo em grid 3×3 com o centro amarelo, marcadores `■`, cursor em bloco, barras de progresso em blocos.

### Imagens

- O retrato aparece **normal**, colorido e sem filtro. O Andre pediu isso explicitamente. Hover só com zoom leve (scale 1.03).
- Screenshots de projeto abrem em preto e branco com uma camada de "pixels" pretos espalhados. No hover, os pixels somem em blocos (atraso aleatório por célula) e a imagem recupera a cor. Isso contraria o `DESIGN.md` antigo, mas a v4 aprovada faz assim.

## 6. Movimento

**Stack (escolha minha):** GSAP + ScrollTrigger para sequências ligadas ao scroll e timelines; Motion (`motion/react`) para micro-interações em componentes React. Os dois já estão em `package.json`. Lenis ou outro smooth scroll fica a critério do builder, desde que não quebre a âncora nem o scroll nativo no mobile.

**Regras:**
- Animar só `transform`, `opacity`, `clip-path` e `mask`. Nada de animar layout.
- Com `prefers-reduced-motion: reduce`, todo loop para, todo conteúdo aparece no estado final e não há tilt nem parallax.
- Loops pausam fora da viewport (IntersectionObserver) e com a aba oculta.
- Nada bloqueia a leitura: o texto principal fica visível em até ~1s.

**Momentos de assinatura (do mockup v4):**
1. **Entrada do título do hero:** palavras sobem de máscara em cascata (≈80ms entre palavras), seguidas de lead e botões em fade.
2. **IDE vivo:** código digitado linha a linha, requests aparecendo no painel lateral e barras de latência pulsando. Começa inclinado (`rotateX(18deg)`, scale 0.94) e endireita conforme o scroll (até ~420px).
3. **Marquee de stack** em Silkscreen, loop horizontal contínuo.
4. **Manifesto:** a frase acende palavra por palavra ao rolar. Palavras-chave em pixel e amarelo.
5. **Revelação em pixels** das screenshots (seção 5).
6. **Barras de atributo** do Sobre enchendo bloco a bloco ao entrar na tela.
7. **Fechamento "Vamos construir algo que roda.":** loop forte e contínuo, pedido do Andre:
   - letras de "roda" pulam em onda estilo 8-bit;
   - a cada ~3,2s, "roda" embaralha em glifos (`#$%█▓░…`) com glitch (deslocamento e sombra dupla) e se recompõe da esquerda pra direita;
   - selo de status cicla "compilando… → rodando testes… → deploy em produção… → ● rodando" (o último em amarelo);
   - barra de progresso pixelada enche em degraus e reinicia;
   - ao fundo, faixas de "RODA ▶" em Silkscreen deslizam em sentidos opostos, rotacionadas e a 7% de opacidade.
8. **Transição de rota:** substitui o `RouteLoader` em tela cheia por um wipe curto de blocos (≤300ms) ou um fade com máscara pixelada. Nunca exibe o nome do site digitando.

## 7. Componentes globais

- **Navbar:** pílula de vidro fixa no topo, centralizada (até 1080px). Contém logo pixel + "andredeomondes.dev", links (Início, Projetos, JS Core, Sobre) com o ativo marcado e o CTA "● Disponível · Contato". No mobile, o `.dev` e o "Disponível" somem e entra um botão de menu que abre um overlay de tela cheia com os links em JetBrains Mono grande.
- **Footer:** é o próprio bloco "roda" (seção 6, item 7), seguido do formulário de contato atual (`ProjectIntakeForm`, restilizado) e da linha de copyright.
- **Botões:** primário com fundo `--fg` e texto `--bg`; secundário com borda `--line`. Foco visível com outline amarelo de 2px.

## 8. Páginas

O mockup cobre só a home. As demais páginas seguem a mesma linguagem; o layout de cada uma fica a cargo do builder dentro destas regras.

| Rota | O que muda |
|---|---|
| `/` | Ordem: hero com IDE → marquee de stack → manifesto → projetos em produção (bento 1 grande + 2) → **publicações JS Core** (seção atual `home-writing`, restilizada; ela não aparece no mockup mas fica) → Sobre resumido (retrato + barras) → fechamento "roda" + contato. A seção "Atuação" (Backend / IA aplicada / Produto / Cloud) vira as barras do Sobre. |
| `/projects` | Lista dos 3 cases em cards grandes com revelação em pixels e numeração 01–03 em pixel. |
| `/projects/[slug]` | Estudo de caso com hero (título + kicker + fatos em grid), screenshots com o lightbox atual restilizado, diagrama de arquitetura (`architecture_lanes`) como painel estilo IDE e contribuições em lista com marcador `■`. Precisa de mockup antes de implementar (seção 12). |
| `/posts`, `/posts/[slug]` | Cards de publicação com capa e tags. O `carousel-viewer` e o `exercise-workbench` ganham os novos tokens; o workbench é o lugar natural para o tratamento de IDE. |
| `/series/javascript-core` | Índice das unidades como lista numerada (01–22) com estado publicado ou em breve. É uma lista, não um mapa de fases. |
| `/about` | Retrato normal, bio, barras de atributo e experiência em linha do tempo. |
| `/resume` | Restyle com os tokens, sem mudar a estrutura. Os PDFs ficam iguais. |
| `/admin/*` | Só herda os tokens; nenhum redesign. |

## 9. Conteúdo

- Toda informação vem de `src/content/projects.ts`, `src/content/posts.ts` e `src/lib/site-content.ts` / Supabase. Nada inventado.
- O código do IDE no hero é ilustrativo e não representa nenhum cliente. Deve ser genérico (pedido idempotente, fila, transação) e não pode citar empresa, tabela ou endpoint real de projeto. Requests e latências do painel lateral também são ilustrativos, e o hero não deve sugerir que são métricas reais.
- **Barras de atributo do Sobre:** os valores do mockup (90/75/70/65) são placeholders. **O Andre precisa definir os números**, ou trocar as barras por algo não numérico (ex.: anos de uso). Até lá, o builder implementa com os valores vindo de `site-content` e mantém os placeholders.
- Textos novos do mockup (título do hero, manifesto, "Vamos construir algo que roda.") são propostas e podem ir para `site-content` para edição no admin. Fica a critério do builder.

## 10. Restrições técnicas

- Next.js 16 / React 19 / Tailwind 4, como hoje. Componentes de cliente só onde há interação ou animação.
- O build não pode usar `ignoreBuildErrors` (removido no commit `e94e5e4`). `tsc` e `eslint` limpos.
- Orçamento: LCP < 2,5s em 4G no mobile, nada de CLS, JS da home ≤ o atual (~220 KB transferidos). GSAP carrega só nas rotas que usam.
- Conteúdo legível sem JavaScript: as animações partem do estado final no SSR, ou o estado inicial escondido só se aplica com JS ativo.
- Componentes de UI hoje sem uso (`animated-grid-pattern`, `magic-card`, `radial-orbital-timeline`, `hero-background`, etc.) podem ser removidos durante o redesign.
- O teste e2e existente (`tests/e2e/responsive-navigation.spec.ts`) precisa continuar passando, adaptado à nova navbar.

## 11. Decisões minhas (para o Andre revisar)

- **Site todo escuro**, sem os capítulos claros "paper" do design atual, para seguir a v4.
- **Screenshots em P&B que ganham cor no hover**, contrariando o `DESIGN.md` antigo.
- **GSAP + Motion** como stack de animação e smooth scroll opcional.
- **Silkscreen** como fonte pixel. O Andre aceitou a recomendação.
- **Seção "Atuação" vira barras no Sobre**, e a seção de publicações JS Core continua na home mesmo sem estar no mockup.
- **Footer = bloco "roda" + formulário de contato.**

## 12. Fica a cargo do builder

- Layout detalhado das páginas internas, dentro das regras acima. A **página de projeto** pede um mockup rápido para o Andre aprovar antes de ser implementada.
- Easing e durações exatas, desde que respeitem a seção 6.
- Estrutura de componentes e CSS (Tailwind ou módulos), reaproveitando o que existir.
- Implementação da transição de rota.
- Ordem de entrega. Sugestão: tokens e fontes → navbar e footer → home → páginas internas → limpeza.

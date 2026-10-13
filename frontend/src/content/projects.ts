import type { Project } from "@/types/supabase";

export type ProjectFact = { label: string; value: string };

export type ProjectScreenshot = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

export type ArchitectureLane = {
  label: string;
  nodes: Array<{ title: string; detail: string }>;
};

export type TechnologyGroup = { label: string; items: string[] };

export type ProjectCaseStudy = Project & {
  case_study: {
    kicker: string;
    role_summary: string;
    facts: ProjectFact[];
    screenshots: ProjectScreenshot[];
    contribution_intro: string;
    contributions: string[];
    product_scope: string[];
    architecture_lanes: ArchitectureLane[];
    technology_groups: TechnologyGroup[];
    integrations: string[];
    quality: string[];
    operations: string[];
  };
};

const base = {
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
  long_description: null,
  github_url: null,
  featured: true,
  published: true,
};

export const fallbackProjects: ProjectCaseStudy[] = [
  {
    ...base,
    id: "fallback-drop-aki-tcg",
    slug: "drop-aki-tcg",
    title: "Drop Aki TCG",
    description: "E-commerce de cards colecionáveis construído de ponta a ponta, da experiência de compra à operação administrativa.",
    tags: ["E-commerce", "Full stack", "Wix Headless", "Astro"],
    tech_stack: ["Astro 5", "React", "TypeScript", "Node.js", "FastAPI", "LangChain", "PostgreSQL", "Redis", "Wix Headless", "Vitest", "Playwright"],
    architecture: ["Loja e catálogo", "Conta e pedidos", "Pagamentos e frete", "Operação administrativa"],
    meta: [],
    overview_problema: "Transformar um catálogo amplo de cards e acessórios em uma experiência de compra clara, sem perder as rotinas necessárias para operar pedidos, estoque, clientes e atendimento.",
    overview_solucao: "Uma experiência própria em Astro 5 e React conectada ao Wix Headless, com serviços Node.js e TypeScript, PostgreSQL e Redis, além de uma camada de IA construída com FastAPI e LangChain.",
    overview_resultado: "Uma operação de e-commerce entregue e mantida em produção, com jornada pública de compra, área do cliente, painel administrativo e integrações comerciais funcionando como um único produto.",
    aprendizados: ["Estruturar uma experiência própria sobre serviços headless", "Conectar a jornada de compra à operação do negócio", "Tratar SEO, desempenho e testes como parte do produto"],
    next_steps: [],
    featured_order: 1,
    live_url: "https://dropakitcg.com.br",
    image_url: "/projects/drop-aki-storefront.webp",
    case_study: {
      kicker: "E-commerce / TCG",
      role_summary: "Projeto individual realizado há 3 meses como freelance e consultoria, com responsabilidade full stack e manutenção contínua.",
      facts: [
        { label: "Papel", value: "Desenvolvedor full stack" },
        { label: "Modelo", value: "Freelance + consultoria" },
        { label: "Duração", value: "3 meses · atual" },
        { label: "Status", value: "Em produção e manutenção" },
      ],
      screenshots: [
        { src: "/projects/drop-aki-storefront.webp", alt: "Página inicial da loja Drop Aki TCG", caption: "Loja pública com navegação por coleções e acesso direto ao catálogo.", width: 800, height: 432 },
        { src: "/projects/drop-aki-launch.webp", alt: "Contagem regressiva de lançamento da Drop Aki TCG", caption: "Experiência de lançamento alinhada à identidade visual em pixel art.", width: 800, height: 432 },
        { src: "/projects/drop-aki-admin.webp", alt: "Painel administrativo da Drop Aki TCG", caption: "Painel operacional para pedidos, produtos, estoque, clientes e relatórios.", width: 800, height: 432 },
      ],
      contribution_intro: "Fui responsável pelo produto inteiro e continuo prestando manutenção à empresa.",
      contributions: [
        "Arquitetura e desenvolvimento full stack da experiência de e-commerce.",
        "Catálogo, busca, conta de usuário, histórico de compras, carrinho e checkout.",
        "Integrações com PagBank e Melhor Envio.",
        "Serviços de IA com FastAPI e LangChain, apoiados por PostgreSQL e Redis.",
        "Painel administrativo para apoiar a operação da loja.",
        "Integração com Google Search Console, SEO, descoberta por IA e otimização de desempenho.",
      ],
      product_scope: [
        "Catálogo organizado por jogos, coleções e categorias.",
        "Conta de usuário com consulta de compras.",
        "Fluxo de carrinho, pagamento e entrega.",
        "Rotinas administrativas para a operação comercial.",
      ],
      architecture_lanes: [
        {
          label: "Experiência de compra",
          nodes: [
            { title: "Navegador", detail: "Loja e conta" },
            { title: "Astro 5 + React", detail: "Interface e ilhas interativas" },
            { title: "Node.js + TypeScript", detail: "Serviços e rotas do produto" },
            { title: "Wix Headless", detail: "Catálogo, membros e pedidos" },
          ],
        },
        {
          label: "Operação comercial",
          nodes: [
            { title: "Node.js", detail: "Regras e integrações" },
            { title: "PostgreSQL", detail: "Dados relacionais" },
            { title: "Redis", detail: "Camada de dados rápidos" },
            { title: "PagBank + Melhor Envio", detail: "Pagamento e frete" },
          ],
        },
        {
          label: "Serviços de IA",
          nodes: [
            { title: "Aplicação", detail: "Chamadas do produto" },
            { title: "FastAPI", detail: "API dos serviços de IA" },
            { title: "LangChain", detail: "Orquestração da IA" },
            { title: "PostgreSQL + Redis", detail: "Camada de dados" },
          ],
        },
      ],
      technology_groups: [
        { label: "Frontend", items: ["Astro 5", "React", "TypeScript", "Tailwind CSS"] },
        { label: "Backend e plataforma", items: ["Node.js", "Wix Headless"] },
        { label: "Dados", items: ["PostgreSQL", "Redis"] },
        { label: "IA", items: ["Python", "FastAPI", "LangChain"] },
        { label: "Qualidade", items: ["Vitest", "Playwright"] },
      ],
      integrations: ["PagBank", "Melhor Envio", "Wix Headless", "Google Search Console"],
      quality: [
        "Testes unitários e de integração.",
        "Fluxos E2E automatizados com Playwright.",
        "SEO técnico e conteúdo preparado para mecanismos de busca e descoberta por IA.",
        "Otimização de páginas acompanhada com Google PageSpeed.",
      ],
      operations: [
        "Hospedagem gerenciada no ecossistema Wix Headless.",
        "Build e publicação da camada web construída com Astro 5.",
        "Manutenção contínua do produto em produção.",
      ],
    },
  },
  {
    ...base,
    id: "fallback-amr-mobile",
    slug: "amr-mobile",
    title: "AMR Mobile",
    description: "Plataforma B2B para estoque e comercialização de iPhones no atacado, com automação de dados e suporte de IA.",
    tags: ["B2B", "Full stack", "Automação", "IA aplicada"],
    tech_stack: ["Angular", "NestJS", "Python", "FastAPI", "LangChain", "PostgreSQL", "Redis", "Playwright"],
    architecture: ["Experiência comercial", "Estoque e contas", "Coleta de preços", "Assistente de IA"],
    meta: [],
    overview_problema: "Centralizar estoques e oportunidades de atacado, mantendo as informações comerciais utilizáveis para lojistas e para a equipe responsável pela operação.",
    overview_solucao: "Uma aplicação Angular conectada a uma API NestJS, PostgreSQL e Redis, com serviços Python em FastAPI e LangChain para IA, tratamento de dados e web scraping de preços.",
    overview_resultado: "Uma plataforma B2B entregue com vitrine comercial, cadastro de usuários, consulta de estoque e painel administrativo para atualizar e operar as informações do negócio.",
    aprendizados: ["Separar a jornada do lojista das rotinas administrativas", "Usar Python em tarefas especializadas de dados e automação", "Transformar fontes externas em informação operacional"],
    next_steps: [],
    featured_order: 2,
    live_url: "https://amrmobile.com.br",
    image_url: "/projects/amr-landing.webp",
    case_study: {
      kicker: "Plataforma B2B / Atacado",
      role_summary: "Projeto individual desenvolvido há 2 anos como freelance e consultoria, da interface às automações de dados, com atuação atual.",
      facts: [
        { label: "Papel", value: "Desenvolvedor full stack" },
        { label: "Modelo", value: "Freelance + consultoria" },
        { label: "Equipe", value: "Projeto individual" },
        { label: "Duração", value: "2 anos · atual" },
      ],
      screenshots: [
        { src: "/projects/amr-landing.webp", alt: "Página inicial comercial da AMR Mobile", caption: "Apresentação comercial para lojistas interessados em aparelhos no atacado.", width: 1440, height: 720 },
        { src: "/projects/amr-inventory.webp", alt: "Tabela de estoque da AMR Mobile", caption: "Estoque consultável com modelo, cor, armazenamento, quantidade e preço.", width: 1131, height: 913 },
        { src: "/projects/amr-admin-ai.webp", alt: "Painel administrativo e assistente de IA da AMR Mobile", caption: "Administração de estoque com sincronização de fonte, exportação e ajustes assistidos por IA.", width: 1188, height: 932 },
      ],
      contribution_intro: "Construí o produto sozinho, cobrindo frontend, backend, dados, IA e qualidade.",
      contributions: [
        "Aplicação web comercial e experiência autenticada para clientes.",
        "API, cadastro de usuários e painel administrativo.",
        "Serviços Python com FastAPI e LangChain para IA, processamento de dados e web scraping de preços.",
        "Persistência com PostgreSQL e Redis.",
        "Ferramentas administrativas para sincronizar e ajustar informações de estoque.",
        "Google Search Console, SEO, descoberta por IA e otimização de desempenho.",
      ],
      product_scope: [
        "Landing page e jornada comercial voltadas ao atacado.",
        "Estoque consultável por clientes cadastrados.",
        "Painel administrativo com sincronização de fonte de estoque.",
        "Assistente de IA para apoiar alterações nas informações exibidas.",
      ],
      architecture_lanes: [
        {
          label: "Aplicação",
          nodes: [
            { title: "Lojista", detail: "Conta e consulta" },
            { title: "Angular", detail: "Interface web" },
            { title: "NestJS", detail: "API e regras do produto" },
            { title: "PostgreSQL + Redis", detail: "Camada de dados" },
          ],
        },
        {
          label: "Dados e IA",
          nodes: [
            { title: "Fontes externas", detail: "Preços e disponibilidade" },
            { title: "Python + FastAPI", detail: "Scraping e serviços de IA" },
            { title: "LangChain", detail: "Orquestração da IA" },
            { title: "Painel admin", detail: "Revisão e operação" },
          ],
        },
      ],
      technology_groups: [
        { label: "Frontend", items: ["Angular"] },
        { label: "Backend", items: ["NestJS"] },
        { label: "Dados", items: ["PostgreSQL", "Redis", "Web scraping"] },
        { label: "IA", items: ["Python", "FastAPI", "LangChain"] },
        { label: "Qualidade", items: ["Testes unitários", "Testes de integração", "Playwright"] },
      ],
      integrations: ["Fontes externas de estoque", "Google Search Console"],
      quality: [
        "Testes unitários e de integração.",
        "Fluxos E2E automatizados com Playwright.",
        "SEO técnico e conteúdo preparado para mecanismos de busca e descoberta por IA.",
        "Otimização de páginas acompanhada com Google PageSpeed.",
      ],
      operations: [
        "Deploy da aplicação Angular, da API NestJS e dos serviços Python.",
        "Separação das camadas web, backend e automação de dados no processo de entrega.",
        "Provedor de hospedagem não divulgado neste estudo de caso.",
      ],
    },
  },
  {
    ...base,
    id: "fallback-caji-agent",
    slug: "caji-agent",
    title: "CajiAgent",
    description: "SaaS de atendimento com IA que conecta conversas, estoque, áudio e ações operacionais.",
    tags: ["Applied AI", "SaaS", "Mensageria", "Full stack"],
    tech_stack: ["React", "Vite", "Node.js", "Fastify", "Python", "FastAPI", "LangChain", "PostgreSQL", "Redis", "Gemini", "Groq", "Whisper", "AWS", "Playwright"],
    architecture: ["WhatsApp e Instagram", "IA conectada ao estoque", "Áudio com Whisper", "Agenda e pagamentos"],
    meta: [],
    overview_problema: "Permitir que um agente de atendimento execute ações reais do negócio sem perder o contexto entre canais, estoque, agenda, pagamentos e suporte humano.",
    overview_solucao: "Um SaaS com mensageria, Fastify e serviços FastAPI/LangChain, apoiado por PostgreSQL e Redis para conectar IA, estoque, áudio e integrações operacionais.",
    overview_resultado: "Um produto em equipe que reúne atendimento contínuo, canais de mensagem e rotinas do negócio numa experiência administrável e observável.",
    aprendizados: ["Conectar respostas de IA a dados reais de estoque", "Tratar áudio como parte da experiência conversacional", "Delimitar responsabilidades em um produto construído em equipe"],
    next_steps: [],
    featured_order: 3,
    live_url: "https://cajiagent.com",
    image_url: "/projects/caji-landing.webp",
    case_study: {
      kicker: "SaaS / Atendimento com IA",
      role_summary: "Atuação full stack durante 1 ano em uma equipe de quatro pessoas, com liderança definida e responsabilidades técnicas específicas.",
      facts: [
        { label: "Papel", value: "Desenvolvedor full stack" },
        { label: "Equipe", value: "4 pessoas" },
        { label: "Duração", value: "1 ano" },
        { label: "Infraestrutura", value: "AWS" },
      ],
      screenshots: [
        { src: "/projects/caji-landing.webp", alt: "Página inicial do CajiAgent", caption: "Apresentação do agente de IA voltado a atendimento e vendas contínuas.", width: 800, height: 505 },
        { src: "/projects/caji-login.webp", alt: "Tela de login do CajiAgent", caption: "Acesso autenticado ao ambiente do produto.", width: 800, height: 512 },
        { src: "/projects/caji-onboarding.webp", alt: "Onboarding do assistente no CajiAgent", caption: "Etapa de configuração da IA dentro da experiência do SaaS.", width: 800, height: 484 },
      ],
      contribution_intro: "O produto foi construído por uma equipe. Minha contribuição ficou concentrada nas integrações de canais e na conexão entre IA, áudio e estoque.",
      contributions: [
        "Integração com a API do WhatsApp.",
        "Integração com o Instagram.",
        "Sistema de estoque conectado à IA para consulta e resposta durante o atendimento.",
        "Serviços de IA com FastAPI e LangChain, integrados a PostgreSQL e Redis.",
        "Processamento de áudio com Groq e Whisper.",
        "Desenvolvimento full stack nas áreas sob minha responsabilidade.",
      ],
      product_scope: [
        "Bot de atendimento disponível 24 horas.",
        "Mensageria, usuários e painel administrativo com observabilidade.",
        "Estoque integrado ao contexto do agente.",
        "Agendamento, pagamento prévio e integrações de comunicação.",
      ],
      architecture_lanes: [
        {
          label: "Atendimento",
          nodes: [
            { title: "WhatsApp + Instagram", detail: "Canais de conversa" },
            { title: "Node.js + Fastify", detail: "API e orquestração" },
            { title: "FastAPI + LangChain", detail: "Serviços e orquestração de IA" },
            { title: "Gemini", detail: "Modelo integrado ao agente" },
          ],
        },
        {
          label: "Dados e ações",
          nodes: [
            { title: "PostgreSQL + Redis", detail: "Camada de dados" },
            { title: "Estoque", detail: "Contexto operacional" },
            { title: "Integrações", detail: "Stripe, agenda e e-mail" },
            { title: "AWS", detail: "Infraestrutura do produto" },
          ],
        },
        {
          label: "Áudio e atendimento",
          nodes: [
            { title: "Mensagem de áudio", detail: "Entrada do canal" },
            { title: "Groq + Whisper", detail: "Transcrição do áudio" },
            { title: "Agente", detail: "Interpretação e resposta" },
            { title: "Painel admin", detail: "Gestão e observabilidade" },
          ],
        },
      ],
      technology_groups: [
        { label: "Frontend", items: ["React", "Vite"] },
        { label: "Backend", items: ["Node.js", "Fastify", "Python"] },
        { label: "Dados", items: ["PostgreSQL", "Redis"] },
        { label: "IA e áudio", items: ["FastAPI", "LangChain", "Gemini", "Groq", "Whisper"] },
        { label: "Infra e qualidade", items: ["AWS", "Testes unitários", "Testes de integração", "Playwright"] },
      ],
      integrations: ["WhatsApp", "Instagram", "Stripe", "Google Calendar", "E-mail"],
      quality: [
        "Testes unitários em todas as áreas desenvolvidas.",
        "Testes de integração entre os serviços.",
        "Fluxos E2E automatizados com Playwright.",
        "Painel administrativo com observabilidade do produto.",
      ],
      operations: [
        "Infraestrutura e hospedagem do produto em AWS.",
        "Deploy das camadas React/Vite, Node.js/Fastify e Python.",
        "Observabilidade disponível no painel administrativo.",
      ],
    },
  },
];

export function getFallbackProject(slug: string) {
  return fallbackProjects.find((project) => project.slug === slug) ?? null;
}

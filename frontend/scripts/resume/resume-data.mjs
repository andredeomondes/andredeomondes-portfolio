// Source of truth for the downloadable resumes (PT-BR and EN).
// Regenerate the PDFs with: node scripts/resume/build-resume.mjs
// Keep claims factual: no invented metrics. Roles are ordered by start date, current roles first.

const contact = {
  name: "Andre Deomondes",
  phone: "+55 71 98838-4932",
  email: "andredeomondes.dev@gmail.com",
  website: "andredeomondes.dev",
  linkedin: "linkedin.com/in/andredeomondes",
  github: "github.com/andredeomondes",
};

export const resumes = {
  "pt-br": {
    file: "andre-deomondes-curriculo-pt-br.pdf",
    lang: "pt-BR",
    title: "Andre Deomondes - Currículo - Backend & Applied AI Engineer",
    contact: { ...contact, location: "Salvador, BA, Brasil" },
    headline: "Backend & Applied AI Engineer",
    labels: {
      summary: "Resumo profissional",
      experience: "Experiência profissional",
      skills: "Competências técnicas",
      publication: "Publicação técnica",
      education: "Formação acadêmica",
      languages: "Idiomas",
      tech: "Tecnologias",
    },
    summary:
      "Engenheiro de Backend e Desenvolvedor Full Stack com experiência na construção e manutenção de produtos web em produção, APIs REST, automações e serviços de IA aplicada. Trabalho com Node.js, TypeScript, Python, FastAPI, PostgreSQL, Redis, AWS e testes automatizados, conectando regras de negócio, arquitetura, dados, observabilidade e deploy. Atuo em projetos individuais de consultoria e em equipes multidisciplinares, do desenvolvimento à operação.",
    experience: [
      {
        role: "Backend Software Engineer",
        company: "AEX",
        period: "Jun 2026 - Atual",
        context: "Remoto",
        bullets: [
          "Desenvolvo APIs REST e fluxos de automação para o ecossistema MavisOS.",
          "Estruturo soluções com bancos relacionais, estratégias de cache e contratos claros entre serviços.",
          "Contribuo para decisões de arquitetura, confiabilidade e evolução segura do backend.",
        ],
        tech: "Node.js, TypeScript, NestJS, Python, PostgreSQL, Redis, AWS, Docker, CI/CD",
      },
      {
        role: "Software Engineer",
        company: "Drop Aki TCG",
        period: "2026 - Atual",
        context: "Freelance e consultoria, projeto individual, remoto | dropakitcg.com.br",
        bullets: [
          "Construí o e-commerce full stack e sigo responsável pela manutenção do produto em produção.",
          "Implementei contas de usuários, histórico de compras, painel administrativo, pedidos, estoque e integrações com PagBank e Melhor Envio.",
          "Estruturei serviços de dados e IA, hospedagem, deploy, SEO técnico e testes unitários, de integração e E2E.",
        ],
        tech: "Astro 5, React, TypeScript, Node.js, FastAPI, LangChain, PostgreSQL, Redis, Wix Headless, AWS, Playwright",
      },
      {
        role: "Software Engineer",
        company: "AMR Mobile",
        period: "2024 - Atual",
        context: "Freelance e consultoria, projeto individual, remoto | amrmobile.com.br",
        bullets: [
          "Desenvolvo de ponta a ponta uma plataforma B2B para estoque e comercialização de iPhones no atacado, com contas de usuários e painel administrativo.",
          "Criei automações em Python, FastAPI e LangChain, incluindo web scraping para coleta e atualização de preços.",
          "Cuido de dados, deploy, SEO técnico, Google Search Console, desempenho e testes unitários, de integração e E2E com Playwright.",
        ],
        tech: "Angular, NestJS, Python, FastAPI, LangChain, PostgreSQL, Redis, AWS, Playwright",
      },
      {
        role: "Desenvolvedor Full Stack",
        company: "Caji Solutions",
        period: "2025 - 2026",
        context: "Equipe de quatro pessoas, remoto, 1 ano | cajiagent.com",
        bullets: [
          "Atuei na construção do CajiAgent, SaaS de atendimento, vendas e automação com IA.",
          "Fui responsável pelas integrações com WhatsApp e Instagram e pelo estoque conectado ao agente para consulta e resposta em tempo real.",
          "Desenvolvi serviços de IA e áudio com FastAPI, LangChain, Gemini, Groq e Whisper, cobertos por testes unitários, de integração e E2E.",
        ],
        tech: "React, Vite, Node.js, Fastify, Python, FastAPI, PostgreSQL, Redis, AWS, Playwright",
      },
    ],
    skills: [
      ["Linguagens", "TypeScript, JavaScript, Python, Java, SQL"],
      ["Backend e APIs", "Node.js, NestJS, Fastify, FastAPI, Spring Boot, APIs REST, webhooks, integrações"],
      ["IA aplicada e automação", "LangChain, Gemini, Groq, Whisper, agentes de IA, web scraping"],
      ["Dados", "PostgreSQL, Redis, MongoDB, modelagem relacional, estratégias de cache"],
      ["Frontend", "React, Angular, Astro, Next.js, Vite, Tailwind CSS"],
      ["Cloud e DevOps", "AWS, Docker, CI/CD, VPS, Git, GitHub"],
      ["Qualidade", "Testes unitários, de integração e E2E, Playwright, Vitest, Jest"],
    ],
    publication: {
      title: "JavaScript Core",
      text: "Série autoral completa com 27 unidades sobre fundamentos de JavaScript aplicados a backend, cada uma com resumo visual, exemplos, exercícios, testes e resoluções.",
      link: "andredeomondes.dev/series/javascript-core",
    },
    education: [
      ["Bacharelado em Engenharia da Computação", "Universidade CIMATEC", "2024 - 2029 (em andamento)"],
      ["Técnico em Desenvolvimento de Sistemas", "SENAI Bahia", "2025 - 2027 (em andamento)"],
    ],
    languages: "Português: nativo | Inglês: intermediário, leitura de documentação técnica",
  },
  en: {
    file: "andre-deomondes-resume-en.pdf",
    lang: "en",
    title: "Andre Deomondes - Resume - Backend & Applied AI Engineer",
    contact: { ...contact, location: "Salvador, BA, Brazil" },
    headline: "Backend & Applied AI Engineer",
    labels: {
      summary: "Professional summary",
      experience: "Professional experience",
      skills: "Technical skills",
      publication: "Technical publication",
      education: "Education",
      languages: "Languages",
      tech: "Technologies",
    },
    summary:
      "Backend Engineer and Full Stack Developer experienced in building and maintaining production web products, REST APIs, automation workflows and applied AI services. I work with Node.js, TypeScript, Python, FastAPI, PostgreSQL, Redis, AWS and automated testing, connecting business rules, architecture, data, observability and deployment, both in independent consulting projects and in multidisciplinary teams, from implementation through operations.",
    experience: [
      {
        role: "Backend Software Engineer",
        company: "AEX",
        period: "Jun 2026 - Present",
        context: "Remote",
        bullets: [
          "Develop REST APIs and automation workflows for the MavisOS ecosystem.",
          "Design solutions with relational databases, caching strategies and clear service contracts.",
          "Contribute to architecture, reliability and safe backend evolution decisions.",
        ],
        tech: "Node.js, TypeScript, NestJS, Python, PostgreSQL, Redis, AWS, Docker, CI/CD",
      },
      {
        role: "Software Engineer",
        company: "Drop Aki TCG",
        period: "2026 - Present",
        context: "Freelance and consulting, independent project, remote | dropakitcg.com.br",
        bullets: [
          "Built the full-stack e-commerce platform and remain responsible for maintaining it in production.",
          "Implemented user accounts, purchase history, an admin dashboard, orders, inventory, PagBank payments and Melhor Envio shipping.",
          "Set up data and AI services, hosting, deployment, technical SEO and unit, integration and E2E testing.",
        ],
        tech: "Astro 5, React, TypeScript, Node.js, FastAPI, LangChain, PostgreSQL, Redis, Wix Headless, AWS, Playwright",
      },
      {
        role: "Software Engineer",
        company: "AMR Mobile",
        period: "2024 - Present",
        context: "Freelance and consulting, independent project, remote | amrmobile.com.br",
        bullets: [
          "Build and operate an end-to-end B2B platform for wholesale iPhone inventory and sales, including user accounts and an admin dashboard.",
          "Created Python, FastAPI and LangChain automation services, including web scraping for price collection and updates.",
          "Own data, deployment, technical SEO, Google Search Console, performance and unit, integration and Playwright E2E testing.",
        ],
        tech: "Angular, NestJS, Python, FastAPI, LangChain, PostgreSQL, Redis, AWS, Playwright",
      },
      {
        role: "Full Stack Developer",
        company: "Caji Solutions",
        period: "2025 - 2026",
        context: "Four-person team, remote, 1 year | cajiagent.com",
        bullets: [
          "Contributed to CajiAgent, an AI-powered SaaS for customer service, sales and automation.",
          "Owned the WhatsApp and Instagram integrations and the inventory layer connected to the agent for real-time product lookup and replies.",
          "Developed AI and audio services with FastAPI, LangChain, Gemini, Groq and Whisper, covered by unit, integration and E2E tests.",
        ],
        tech: "React, Vite, Node.js, Fastify, Python, FastAPI, PostgreSQL, Redis, AWS, Playwright",
      },
    ],
    skills: [
      ["Languages", "TypeScript, JavaScript, Python, Java, SQL"],
      ["Backend and APIs", "Node.js, NestJS, Fastify, FastAPI, Spring Boot, REST APIs, webhooks, integrations"],
      ["Applied AI and automation", "LangChain, Gemini, Groq, Whisper, AI agents, web scraping"],
      ["Data", "PostgreSQL, Redis, MongoDB, relational modeling, caching strategies"],
      ["Frontend", "React, Angular, Astro, Next.js, Vite, Tailwind CSS"],
      ["Cloud and DevOps", "AWS, Docker, CI/CD, VPS, Git, GitHub"],
      ["Quality", "Unit, integration and E2E testing, Playwright, Vitest, Jest"],
    ],
    publication: {
      title: "JavaScript Core",
      text: "Complete original series of 27 units on JavaScript fundamentals applied to backend work, each with a visual summary, examples, exercises, tests and solutions (in Portuguese).",
      link: "andredeomondes.dev/series/javascript-core",
    },
    education: [
      ["BSc in Computer Engineering", "Universidade CIMATEC", "2024 - 2029 (in progress)"],
      ["Technical Diploma in Systems Development", "SENAI Bahia", "2025 - 2027 (in progress)"],
    ],
    languages: "Portuguese: native | English: intermediate, technical documentation reading",
  },
};

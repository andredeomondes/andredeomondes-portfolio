"use client";

import { motion } from "motion/react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { FaGithub as Github } from "react-icons/fa";
import {
  SiDocker, SiMongodb, SiNestjs, SiNextdotjs, SiNodedotjs,
  SiPostgresql, SiPrisma, SiReact, SiRedis, SiSpringboot,
  SiTailwindcss, SiTypescript,
} from "react-icons/si";
import { DiJava } from "react-icons/di";
import { FaAws } from "react-icons/fa";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { NoiseTexture } from "@/shared/components/ui/noise-texture";
import { ProgressiveBlur } from "@/shared/components/ui/progressive-blur";
import { ShimmerAnchor, ShimmerLink } from "@/shared/components/ui/shimmer-button";

const techIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "Next.js": SiNextdotjs,
  "React": SiReact,
  "TypeScript": SiTypescript,
  "Tailwind CSS": SiTailwindcss,
  "Node.js": SiNodedotjs,
  "NestJS": SiNestjs,
  "Spring Boot": SiSpringboot,
  "Java": DiJava,
  "PostgreSQL": SiPostgresql,
  "MongoDB": SiMongodb,
  "Redis": SiRedis,
  "Docker": SiDocker,
  "Prisma": SiPrisma,
  "AWS": FaAws,
  "AWS S3 / EC2": FaAws,
  "React Native": SiReact,
};

const techColorMap: Record<string, string> = {
  "Next.js": "#ffffff",
  "React": "#61DAFB",
  "TypeScript": "#3178C6",
  "Tailwind CSS": "#06B6D4",
  "Node.js": "#339933",
  "NestJS": "#E0234E",
  "Spring Boot": "#6DB33F",
  "Java": "#EA8220",
  "PostgreSQL": "#4169E1",
  "MongoDB": "#47A248",
  "Redis": "#DC382D",
  "Docker": "#2496ED",
  "Prisma": "#2D3748",
  "AWS": "#FF9900",
  "AWS S3 / EC2": "#FF9900",
  "React Native": "#61DAFB",
};

const projects = {
  "clube-de-programacao": {
    title: "Clube de Programação",
    description: "Plataforma completa para ensino de programação com trilhas, exercícios práticos, comunidade e gamificação.",
    meta: ["2024 — Atual", "+500 alunos ativos", "Em produção"],
    tags: ["Educação", "SaaS", "Gamificação", "Comunidade"],
    overview: {
      problema: "O ensino tradicional de programação é passivo, pouco prático e desmotivador. Faltam plataformas que combinem prática real e comunidade ativa.",
      solucao: "Plataforma gamificada com trilhas estruturadas, exercícios práticos, feedback automático e sistema de níveis.",
      resultado: "Mais de 500 alunos ativos, alta taxa de conclusão das trilhas e comunidade engajada.",
    },
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "React", "Prisma", "PostgreSQL", "Node.js", "Redis", "Docker", "AWS S3 / EC2"],
    architecture: ["Frontend Next.js", "API Gateway / REST", "Backend Fastify", "PostgreSQL", "Redis Cache", "AWS S3"],
    aprendizados: ["Gamificação aumenta engajamento.", "Feedback rápido é essencial.", "Comunidade gera retenção."],
    nextSteps: ["App mobile iOS/Android", "Mais trilhas avançadas", "Sistema de certificados", "Mentorias ao vivo"],
    github: "https://github.com/andredeomondes/clube-de-programacao",
  },
  "amr-mobile": {
    title: "AMR Mobile",
    description: "Sistemas internos e automações para operação e gestão de processos corporativos em tempo real.",
    meta: ["2025 — Atual", "Em produção"],
    tags: ["Sistemas Internos", "Automação", "Mobile"],
    overview: {
      problema: "Processos manuais e falta de integração entre sistemas dificultavam a operação diária.",
      solucao: "Sistemas internos e apps mobile para automatizar processos e centralizar a gestão.",
      resultado: "Redução significativa de tempo em processos manuais e maior acurácia operacional.",
    },
    techStack: ["React Native", "NestJS", "PostgreSQL", "AWS", "Docker", "TypeScript"],
    architecture: ["Mobile React Native", "API Backend NestJS", "PostgreSQL", "AWS EC2 / S3"],
    aprendizados: ["Mobile-first transforma processos internos.", "APIs bem desenhadas aceleram o desenvolvimento."],
    nextSteps: ["Novas funcionalidades de gestão", "Integração com mais sistemas"],
    github: "https://github.com/andredeomondes/amr-mobile",
  },
  "loyloucha-imports": {
    title: "Loyloucha Imports",
    description: "Sistema de gestão interna para controle de estoque, pedidos, clientes e fluxo completo de importação.",
    meta: ["2025", "Em produção"],
    tags: ["Gestão", "Importação", "ERP"],
    overview: {
      problema: "Processos de importação e gestão de estoque eram descentralizados e totalmente manuais.",
      solucao: "Sistema completo de gestão integrando estoque, pedidos, clientes e fluxo de importação.",
      resultado: "Operação centralizada em uma única plataforma com redução drástica de erros.",
    },
    techStack: ["Next.js", "NestJS", "Prisma", "PostgreSQL", "Tailwind CSS", "TypeScript"],
    architecture: ["Frontend Next.js", "Backend NestJS", "Prisma ORM", "PostgreSQL"],
    aprendizados: ["ERP sob medida é mais eficiente que soluções genéricas.", "UX em sistemas internos importa."],
    nextSteps: ["Módulo financeiro", "Relatórios avançados"],
    github: "https://github.com/andredeomondes/loyloucha-imports",
  },
  "spring-scheduler": {
    title: "Spring Scheduler",
    description: "Serviço robusto de agendamento de tarefas recorrentes com fila, logs estruturados e notificações.",
    meta: ["2025", "Open Source"],
    tags: ["Java", "Spring Boot", "Ferramenta"],
    overview: {
      problema: "Necessidade de um serviço flexível para agendar e executar tarefas recorrentes com monitoramento completo.",
      solucao: "Scheduler em Spring Boot com suporte a filas Redis, logs detalhados e notificações configuráveis.",
      resultado: "Ferramenta robusta para agendamento de tarefas com visibilidade total do estado.",
    },
    techStack: ["Java", "Spring Boot", "PostgreSQL", "Redis"],
    architecture: ["Spring Boot App", "Redis Queue", "PostgreSQL"],
    aprendizados: ["Redis é excelente para filas de tarefas.", "Logs estruturados facilitam debugging."],
    nextSteps: ["Suporte a workflows", "Interface web completa"],
    github: "https://github.com/andredeomondes/spring-scheduler",
  },
  "portfolio-website": {
    title: "Portfolio Website",
    description: "Portfólio pessoal construído para comunicar maturidade técnica, projetos e jornada profissional.",
    meta: ["2025", "Open Source"],
    tags: ["Next.js", "Portfólio", "Motion"],
    overview: {
      problema: "Precisava de um portfólio premium que comunicasse profissionalismo e atenção aos detalhes.",
      solucao: "Site construído com Next.js, Tailwind CSS, Motion e Magic UI — direção visual inspirada em Linear e Stripe.",
      resultado: "Portfólio premium que comunica profissionalismo e diferencia no mercado.",
    },
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "React"],
    architecture: ["Frontend Next.js (App Router)", "Motion / Magic UI", "Supabase (Auth, DB)", "Deploy Vercel"],
    aprendizados: ["Direção visual consistente eleva a percepção de qualidade.", "Animações sutis melhoram a experiência."],
    nextSteps: ["Modo escuro refinado", "Internacionalização"],
    github: "https://github.com/andredeomondes/andredeomondes.dev",
  },
};

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-8 flex items-center gap-3">
      <span className="h-px w-8 rounded-full bg-violet-500" />
      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-600 dark:text-violet-400">
        {children}
      </span>
    </div>
  );
}

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[1.5rem] border border-black/8 bg-white/58 p-6 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05] ${className}`}>
      {children}
    </div>
  );
}

export default function ProjectCasePage() {
  const params = useParams();
  const slug = params.slug as string;
  const project = projects[slug as keyof typeof projects];

  if (!project) notFound();

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#f6f2ea] text-[#0b1020] dark:bg-[#080912] dark:text-white">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(180,143,255,0.1),transparent_32%),linear-gradient(145deg,#f6f2ea_0%,#ede7dd_52%,#e8e2f5_100%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(120,80,255,0.08),transparent_32%),linear-gradient(145deg,#080912_0%,#0a0d1f_52%,#10091e_100%)]" />
      <NoiseTexture noiseOpacity={0.1} frequency={0.6} octaves={3} slope={0.7} className="opacity-30 mix-blend-soft-light" />
      <ProgressiveBlur position="top" className="opacity-50" blurLevels={[0.5, 1, 2, 4, 8, 12, 18, 24]} />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-28 sm:px-8 lg:px-12">
        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm text-[#0b1020]/54 transition-colors hover:text-violet-600 dark:text-white/46 dark:hover:text-violet-400">
            <ArrowLeft className="size-4" />
            Projetos
          </Link>
        </motion.div>

        {/* Hero */}
        <div className="mt-12 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="flex flex-wrap gap-2"
          >
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-700 dark:text-violet-300">
                {tag}
              </span>
            ))}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-4xl font-semibold leading-[1.08] tracking-[-0.06em] sm:text-5xl lg:text-6xl"
          >
            {project.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="mt-6 max-w-2xl text-base leading-8 text-[#0b1020]/58 dark:text-white/58"
          >
            {project.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.24 }}
            className="mt-6 flex flex-wrap gap-5"
          >
            {project.meta.map((m) => (
              <span key={m} className="flex items-center gap-2 text-sm text-[#0b1020]/46 dark:text-white/42">
                <span className="size-1.5 rounded-full bg-violet-500" />
                {m}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            {project.github && (
              <ShimmerAnchor
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                shimmerColor="#a78bfa"
                background="rgba(109,40,217,0.85)"
                className="h-10 gap-2 px-5 text-sm font-medium shadow-[0_0_24px_rgba(139,92,246,0.4)]"
              >
                <Github className="size-4" />
                Ver no GitHub
                <ExternalLink className="size-3.5" />
              </ShimmerAnchor>
            )}
            <ShimmerLink
              href="/projects"
              shimmerColor="#a78bfa"
              background="rgba(30,27,75,0.65)"
              className="h-10 px-5 text-sm font-medium"
            >
              Todos os projetos
            </ShimmerLink>
          </motion.div>
        </div>

        {/* Hero visual placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 32 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16"
        >
          <div className="relative overflow-hidden rounded-[1.75rem] border border-black/8 bg-white/40 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]" style={{ aspectRatio: "16/7" }}>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.12),transparent_70%)]" />
            <div className="flex h-full flex-col items-center justify-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-500/10">
                <span className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                  {project.title.charAt(0)}
                </span>
              </div>
              <p className="text-sm text-[#0b1020]/46 dark:text-white/36">{project.meta[0]}</p>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
          </div>
        </motion.div>

        <div className="mt-24 grid gap-24 lg:grid-cols-[1fr_22rem]">
          <div className="space-y-24">

            {/* Overview */}
            <FadeUp>
              <SectionLabel>Visão Geral</SectionLabel>
              <div className="grid gap-4 sm:grid-cols-3">
                {(["problema", "solucao", "resultado"] as const).map((key, i) => (
                  <FadeUp key={key} delay={i * 0.08}>
                    <GlassCard>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
                        {key === "problema" ? "Problema" : key === "solucao" ? "Solução" : "Resultado"}
                      </span>
                      <p className="mt-3 text-sm leading-7 text-[#0b1020]/64 dark:text-white/58">
                        {project.overview[key]}
                      </p>
                    </GlassCard>
                  </FadeUp>
                ))}
              </div>
            </FadeUp>

            {/* Architecture */}
            <FadeUp>
              <SectionLabel>Arquitetura</SectionLabel>
              <GlassCard className="p-8">
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-0">
                  {project.architecture.map((node, i) => (
                    <FadeUp key={node} delay={i * 0.06} className="flex items-center gap-0">
                      <div className="rounded-xl border border-black/8 bg-white/72 px-4 py-2.5 text-sm font-medium dark:border-white/10 dark:bg-white/[0.08]">
                        {node}
                      </div>
                      {i < project.architecture.length - 1 && (
                        <span className="mx-2 hidden text-[#0b1020]/28 dark:text-white/28 sm:block">→</span>
                      )}
                    </FadeUp>
                  ))}
                </div>
              </GlassCard>
            </FadeUp>

            {/* Learnings */}
            <FadeUp>
              <SectionLabel>Aprendizados</SectionLabel>
              <div className="space-y-3">
                {project.aprendizados.map((item, i) => (
                  <FadeUp key={item} delay={i * 0.07}>
                    <div className="flex items-start gap-4 rounded-[1.2rem] border border-black/8 bg-white/48 p-5 backdrop-blur-sm dark:border-white/8 dark:bg-white/[0.04]">
                      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-sm text-violet-600 dark:bg-violet-500/20 dark:text-violet-400">
                        ✦
                      </span>
                      <p className="text-sm leading-7 text-[#0b1020]/72 dark:text-white/68">{item}</p>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </FadeUp>

            {/* Next steps */}
            <FadeUp>
              <SectionLabel>Próximos Passos</SectionLabel>
              <div className="grid gap-3 sm:grid-cols-2">
                {project.nextSteps.map((step, i) => (
                  <FadeUp key={step} delay={i * 0.06}>
                    <div className="flex items-center gap-3 rounded-[1.2rem] border border-black/8 bg-white/48 p-4 backdrop-blur-sm dark:border-white/8 dark:bg-white/[0.04]">
                      <span className="text-violet-600 dark:text-violet-400">→</span>
                      <p className="text-sm text-[#0b1020]/72 dark:text-white/68">{step}</p>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </FadeUp>

          </div>

          {/* Sidebar — Tech Stack */}
          <div>
            <div className="sticky top-28">
              <FadeUp>
                <SectionLabel>Stack</SectionLabel>
                <GlassCard>
                  <div className="flex flex-wrap gap-3">
                    {project.techStack.map((tech) => {
                      const Icon = techIconMap[tech];
                      const color = techColorMap[tech] ?? "#94a3b8";
                      return (
                        <div
                          key={tech}
                          className="flex items-center gap-2 rounded-full border border-black/8 bg-white/72 px-3 py-1.5 text-xs font-medium text-[#0b1020]/72 dark:border-white/10 dark:bg-white/[0.06] dark:text-white/72"
                        >
                          {Icon ? (
                        <span className="size-3.5 shrink-0" style={{ color }}>
                          <Icon className="size-full" />
                        </span>
                      ) : null}
                          {tech}
                        </div>
                      );
                    })}
                  </div>
                </GlassCard>
              </FadeUp>

              {project.github && (
                <FadeUp delay={0.1} className="mt-6">
                  <GlassCard>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#0b1020]/46 dark:text-white/40">
                      Repositório
                    </p>
                    <ShimmerAnchor
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      shimmerColor="#a78bfa"
                      background="rgba(109,40,217,0.85)"
                      className="mt-4 h-10 w-full justify-center gap-2 text-sm font-medium shadow-[0_0_20px_rgba(139,92,246,0.35)]"
                    >
                      <Github className="size-4" />
                      GitHub
                      <ExternalLink className="size-3.5" />
                    </ShimmerAnchor>
                  </GlassCard>
                </FadeUp>
              )}
            </div>
          </div>
        </div>

        {/* Bottom nav */}
        <div className="mt-24 flex items-center justify-between border-t border-black/8 pt-8 dark:border-white/8">
          <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm text-[#0b1020]/52 transition-colors hover:text-violet-600 dark:text-white/42 dark:hover:text-violet-400">
            <ArrowLeft className="size-4" />
            Todos os Projetos
          </Link>
          <Link href="/#contato" className="inline-flex items-center gap-1.5 text-sm text-[#0b1020]/52 transition-colors hover:text-violet-600 dark:text-white/42 dark:hover:text-violet-400">
            Trabalhar juntos →
          </Link>
        </div>
      </div>
    </div>
  );
}

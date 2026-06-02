"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Badge } from "@/shared/components/ui/badge";
import { MagicCard } from "@/shared/components/ui/magic-card";
import { BorderBeam } from "@/shared/components/ui/border-beam";
import { AnimatedGridPattern } from "@/shared/components/ui/animated-grid-pattern";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";

const projects = {
  "clube-de-programacao": {
    title: "Clube de Programação",
    description:
      "Plataforma completa para ensino de programação com trilhas, exercícios práticos, comunidade e gamificação que torna o aprendizado mais engajador e consistente.",
    meta: ["2024 — Atual", "+500 alunos ativos", "Em produção"],
    tags: ["Educação", "SaaS", "Gamificação", "Comunidade"],
    overview: {
      problema:
        "O ensino tradicional de programação é muitas vezes passivo, pouco prático e desmotivador. Faltam plataformas que combinem prática real, acompanhamento de progresso e comunidade ativa.",
      solucao:
        "Criei uma plataforma gamificada com trilhas estruturadas, exercícios práticos, feedback automático e sistema de níveis, transformando o aprendizado em uma jornada contínua.",
      resultado:
        "Mais de 500 alunos ativos, alta taxa de conclusão das trilhas, comunidade engajada e evolução consistente dos usuários.",
    },
    techStack: [
      "Next.js", "TypeScript", "Tailwind CSS", "React", "Prisma",
      "PostgreSQL", "Node.js", "Fastify", "Redis", "Docker",
      "AWS S3 / EC2", "Git", "GitHub",
    ],
    architecture: [
      { name: "Frontend Next.js" },
      { name: "API Gateway / REST" },
      { name: "Backend Fastify" },
      { name: "PostgreSQL" },
      { name: "Redis Cache / Sessions" },
      { name: "AWS S3 Storage" },
    ],
    screenshots: [
      "Dashboard",
      "Trilhas de aprendizado",
      "Exercícios práticos",
      "Ranking",
    ],
    aprendizados: [
      "Gamificação aumenta engajamento.",
      "Feedback rápido é essencial para aprendizado.",
      "Comunidade gera retenção.",
    ],
    nextSteps: [
      "App mobile para iOS e Android",
      "Mais trilhas avançadas e especializações",
      "Sistema de certificados e conquistas",
      "Mentorias e eventos ao vivo",
    ],
    github: "https://github.com/andredeomondes/clube-de-programacao",
  },
  "amr-mobile": {
    title: "AMR Mobile",
    description:
      "Sistemas internos e automações para operação e gestão de processos da empresa.",
    meta: ["2025 — Atualmente", "Em produção"],
    tags: ["Sistemas Internos", "Automação", "Mobile"],
    overview: {
      problema:
        "Processos manuais e falta de integração entre sistemas dificultavam a operação diária da empresa.",
      solucao:
        "Desenvolvi sistemas internos e aplicações mobile para automatizar processos e centralizar a gestão.",
      resultado:
        "Redução significativa de tempo em processos manuais e maior acurácia operacional.",
    },
    techStack: ["React Native", "NestJS", "Fastify", "PostgreSQL", "AWS", "Docker", "TypeScript"],
    architecture: [
      { name: "Mobile React Native" },
      { name: "API Backend NestJS" },
      { name: "PostgreSQL" },
      { name: "AWS EC2 / S3" },
    ],
    screenshots: ["App Mobile", "Dashboard Interno", "Relatórios"],
    aprendizados: [
      "Mobile-first transforma processos internos.",
      "APIs bem desenhadas aceleram o desenvolvimento.",
    ],
    nextSteps: [
      "Novas funcionalidades de gestão",
      "Integração com mais sistemas",
    ],
    github: "https://github.com/andredeomondes/amr-mobile",
  },
  "loyloucha-imports": {
    title: "Loyloucha Imports",
    description:
      "Sistema de gestão interna para controle de estoque, pedidos, clientes e fluxo de importação.",
    meta: ["2025", "Em produção"],
    tags: ["Gestão", "Importação", "ERP"],
    overview: {
      problema:
        "Processos de importação e gestão de estoque eram descentralizados e manuais.",
      solucao:
        "Construí um sistema completo de gestão integrando estoque, pedidos, clientes e fluxo de importação.",
      resultado:
        "Operação centralizada em uma única plataforma com redução de erros.",
    },
    techStack: ["Next.js", "NestJS", "Prisma", "PostgreSQL", "Tailwind CSS"],
    architecture: [
      { name: "Frontend Next.js" },
      { name: "Backend NestJS" },
      { name: "Prisma ORM" },
      { name: "PostgreSQL" },
    ],
    screenshots: ["Dashboard", "Gestão de Estoque", "Fluxo de Pedidos"],
    aprendizados: [
      "ERP sob medida é mais eficiente que soluções genéricas.",
      "UX em sistemas internos é tão importante quanto em sistemas externos.",
    ],
    nextSteps: [
      "Módulo financeiro",
      "Relatórios avançados",
    ],
    github: "https://github.com/andredeomondes/loyloucha-imports",
  },
  "sistema-adocao-pets": {
    title: "Sistema de Adoção de Pets",
    description:
      "Plataforma para ONGs publicarem pets para adoção e conectarem adotantes.",
    meta: ["2025", "Em desenvolvimento"],
    tags: ["Social", "Plataforma", "React"],
    overview: {
      problema:
        "ONGs têm dificuldade em divulgar animais para adoção de forma eficiente e organizada.",
      solucao:
        "Criei uma plataforma onde ONGs podem publicar perfis detalhados dos animais e conectar com potenciais adotantes.",
      resultado:
        "Plataforma funcional com cadastro de animais e busca por adotantes.",
    },
    techStack: ["React", "Node.js", "MongoDB", "Express", "Tailwind CSS"],
    architecture: [
      { name: "Frontend React" },
      { name: "Backend Node.js / Express" },
      { name: "MongoDB" },
    ],
    screenshots: ["Home", "Perfil do Pet", "Busca"],
    aprendizados: [
      "UX clara aumenta conversão de adoções.",
      "Filtros de busca são essenciais.",
    ],
    nextSteps: [
      "Sistema de chat entre ONG e adotante",
    ],
    github: "https://github.com/andredeomondes/sistema-adocao-pets",
  },
  "spring-scheduler": {
    title: "Spring Scheduler",
    description:
      "Serviço de agendamento de tarefas recorrentes com fila, logs e notificações.",
    meta: ["2025", "Open Source"],
    tags: ["Java", "Spring Boot", "Ferramenta"],
    overview: {
      problema:
        "Necessidade de um serviço flexível para agendar e executar tarefas recorrentes com monitoramento.",
      solucao:
        "Desenvolvi um scheduler em Spring Boot com suporte a filas, logs detalhados e notificações.",
      resultado:
        "Ferramenta robusta para agendamento de tarefas com visibilidade total.",
    },
    techStack: ["Java", "Spring Boot", "PostgreSQL", "Redis"],
    architecture: [
      { name: "Spring Boot App" },
      { name: "Redis Queue" },
      { name: "PostgreSQL" },
    ],
    screenshots: ["Dashboard de Jobs", "Logs", "Configuração"],
    aprendizados: [
      "Redis é excelente para filas de tarefas.",
      "Logs estruturados facilitam debugging.",
    ],
    nextSteps: [
      "Suporte a workflows",
      "Interface web completa",
    ],
    github: "https://github.com/andredeomondes/spring-scheduler",
  },
  "portfolio-website": {
    title: "Portfolio Website",
    description:
      "Portfólio pessoal construído para apresentar meu trabalho, projetos e jornada.",
    meta: ["2025", "Open Source"],
    tags: ["Next.js", "Portfólio", "Motion"],
    overview: {
      problema:
        "Precisava de um portfólio que comunicasse maturidade técnica e experiência em produto.",
      solucao:
        "Construí este site com Next.js, Tailwind CSS, Motion, ReactBits e Magic UI, seguindo uma direção visual inspirada em Linear, Apple e Stripe.",
      resultado:
        "Um portfólio premium que comunica profissionalismo e atenção aos detalhes.",
    },
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Motion", "ReactBits", "Magic UI", "Supabase", "Vercel"],
    architecture: [
      { name: "Frontend Next.js (App Router)" },
      { name: "Motion / ReactBits / Magic UI" },
      { name: "Supabase (Auth, DB, Storage)" },
      { name: "Deploy Vercel" },
    ],
    screenshots: ["Home", "About", "Projects"],
    aprendizados: [
      "Direção visual consistente eleva a percepção de qualidade.",
      "Animações sutis melhoram a experiência sem distrair.",
    ],
    nextSteps: [
      "Modo escuro refinado",
      "Internacionalização",
    ],
    github: "https://github.com/andredeomondes/andredeomondes.dev",
  },
};

function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function ProjectCasePage() {
  const params = useParams();
  const slug = params.slug as string;
  const project = projects[slug as keyof typeof projects];

  if (!project) {
    notFound();
  }

  return (
    <div className="relative px-6 py-32">
      <AnimatedGridPattern
        className="absolute inset-0 -z-10"
        width={40}
        height={40}
        numSquares={30}
        maxOpacity={0.03}
        duration={3}
      />

      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-1 text-sm text-[#94A3B8] transition-colors hover:text-[#8B5CF6]"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para Projects
          </Link>
        </motion.div>

        <section className="mt-12">
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl font-semibold leading-[1.1] tracking-tight text-[#F8FAFC] sm:text-5xl lg:text-6xl"
          >
            {project.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-2xl text-base leading-relaxed text-[#94A3B8]"
          >
            {project.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mt-6 flex flex-wrap gap-6 text-sm text-[#64748B]"
          >
            {project.meta.map((m) => (
              <span key={m} className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-[#8B5CF6]" />
                {m}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="mt-4 flex flex-wrap gap-2"
          >
            {project.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="border-white/[0.06] bg-white/[0.03] text-xs text-[#94A3B8]"
              >
                {tag}
              </Badge>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10"
          >
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#8B5CF6]/10 to-transparent">
              <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
                <span className="text-lg font-medium text-[#8B5CF6]">
                  {project.title}
                </span>
                <span className="text-sm text-[#64748B]">
                  {project.meta[0]}
                </span>
              </div>
              <BorderBeam duration={6} size={300} />
            </div>
          </motion.div>
        </section>

        <section className="mt-24">
          <FadeUp>
            <h2 className="mb-2 text-sm font-medium text-[#8B5CF6]">
              Visão Geral
            </h2>
          </FadeUp>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {(["problema", "solucao", "resultado"] as const).map((key, i) => (
              <FadeUp key={key} delay={i * 0.1}>
                <MagicCard className="p-6">
                  <h3 className="mb-3 text-xs font-medium uppercase tracking-widest text-[#8B5CF6]">
                    {key === "problema"
                      ? "Problema"
                      : key === "solucao"
                        ? "Solução"
                        : "Resultado"}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#94A3B8]">
                    {project.overview[key]}
                  </p>
                </MagicCard>
              </FadeUp>
            ))}
          </div>
        </section>

        <section className="mt-24">
          <FadeUp>
            <h2 className="mb-2 text-sm font-medium text-[#8B5CF6]">
              Tecnologias
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="border-white/[0.06] bg-white/[0.03] text-sm text-[#94A3B8]"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </FadeUp>
        </section>

        <section className="mt-24">
          <FadeUp>
            <h2 className="mb-2 text-sm font-medium text-[#8B5CF6]">
              Arquitetura
            </h2>
          </FadeUp>

          <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
            {project.architecture.map((node, i) => (
              <FadeUp key={node.name} delay={i * 0.08}>
                <div className="flex flex-col items-center gap-3">
                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-5 py-3 text-sm font-medium text-[#F8FAFC] backdrop-blur-xl">
                    {node.name}
                  </div>
                  {i < project.architecture.length - 1 && (
                    <svg
                      className="hidden h-6 w-6 text-white/[0.15] sm:block"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M5 12h14M13 5l7 7-7 7"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  {i < project.architecture.length - 1 && (
                    <svg
                      className="h-6 w-6 rotate-90 text-white/[0.15] sm:hidden"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M5 12h14M13 5l7 7-7 7"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        <section className="mt-24">
          <FadeUp>
            <h2 className="mb-2 text-sm font-medium text-[#8B5CF6]">
              Screenshots
            </h2>
          </FadeUp>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {project.screenshots.map((screenshot, i) => (
              <FadeUp key={screenshot} delay={i * 0.08}>
                <div className="flex aspect-video items-center justify-center rounded-xl border border-white/[0.08] bg-gradient-to-br from-white/[0.02] to-transparent p-6 text-center text-sm text-[#64748B]">
                  {screenshot}
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        <section className="mt-24">
          <FadeUp>
            <h2 className="mb-2 text-sm font-medium text-[#8B5CF6]">
              Aprendizados
            </h2>
          </FadeUp>

          <div className="mt-6 space-y-3">
            {project.aprendizados.map((item, i) => (
              <FadeUp key={item} delay={i * 0.08}>
                <div className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#8B5CF6]" />
                  <p className="text-sm text-[#94A3B8]">{item}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        <section className="mt-24">
          <FadeUp>
            <h2 className="mb-2 text-sm font-medium text-[#8B5CF6]">
              Próximos Passos
            </h2>
          </FadeUp>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {project.nextSteps.map((step, i) => (
              <FadeUp key={step} delay={i * 0.06}>
                <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <span className="text-sm text-[#8B5CF6]">→</span>
                  <p className="text-sm text-[#94A3B8]">{step}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        <section className="mt-24">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 text-center">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-10 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-5 text-sm font-medium text-[#F8FAFC] backdrop-blur-xl transition-all hover:bg-[#8B5CF6]/20 hover:border-[#8B5CF6]/30"
              >
                <FaGithub className="h-4 w-4" />
                Ver no GitHub
                <ExternalLink className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            )}
          </div>
        </section>

        <nav className="mt-24 flex items-center justify-between border-t border-white/[0.08] pt-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1 text-sm text-[#94A3B8] transition-colors hover:text-[#8B5CF6]"
          >
            <ArrowLeft className="h-4 w-4" />
            Todos os Projetos
          </Link>
          <a
            href="https://github.com/andredeomondes"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-[#94A3B8] transition-colors hover:text-[#8B5CF6]"
          >
            GitHub
            <ArrowRight className="h-4 w-4" />
          </a>
        </nav>
      </div>
    </div>
  );
}

"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowRight, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Badge } from "@/shared/components/ui/badge";
import { MagicCard } from "@/shared/components/ui/magic-card";
import { BorderBeam } from "@/shared/components/ui/border-beam";
import { AnimatedGridPattern } from "@/shared/components/ui/animated-grid-pattern";
import Link from "next/link";
import {
  SiTypescript, SiSpringboot, SiNestjs, SiReact,
  SiDocker, SiPostgresql, SiTailwindcss, SiNextdotjs,
  SiPrisma, SiRedis, SiMongodb, SiExpress, SiNodedotjs,
  SiFastify, SiSupabase,
} from "react-icons/si";
import { DiJava } from "react-icons/di";
import { FaAws } from "react-icons/fa";

const techIcons: Record<string, { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; color: string }> = {
  TypeScript: { icon: SiTypescript, color: "#3178C6" },
  Java: { icon: DiJava, color: "#B07219" },
  "Spring Boot": { icon: SiSpringboot, color: "#6DB33F" },
  NestJS: { icon: SiNestjs, color: "#E0234E" },
  React: { icon: SiReact, color: "#61DAFB" },
  "Next.js": { icon: SiNextdotjs, color: "#FFFFFF" },
  Docker: { icon: SiDocker, color: "#2496ED" },
  PostgreSQL: { icon: SiPostgresql, color: "#4169E1" },
  "Tailwind CSS": { icon: SiTailwindcss, color: "#06B6D4" },
  Redis: { icon: SiRedis, color: "#DC382D" },
  AWS: { icon: FaAws, color: "#FF9900" },
  Prisma: { icon: SiPrisma, color: "#5B9BD5" },
  MongoDB: { icon: SiMongodb, color: "#47A248" },
  Express: { icon: SiExpress, color: "#FFFFFF" },
  "Node.js": { icon: SiNodedotjs, color: "#339933" },
  Fastify: { icon: SiFastify, color: "#000000" },
  Supabase: { icon: SiSupabase, color: "#3ECF8E" },
  "React Native": { icon: SiReact, color: "#61DAFB" },
};

const projectColors: Record<string, { from: string; to: string }> = {
  "AMR Mobile": { from: "#8B5CF6", to: "#60A5FA" },
  "Loyloucha Imports": { from: "#A855F7", to: "#EC4899" },
  "Sistema de Adoção de Pets": { from: "#10B981", to: "#34D399" },
  "Spring Scheduler": { from: "#F59E0B", to: "#EF4444" },
  "Portfolio Website": { from: "#8B5CF6", to: "#A855F7" },
};

const projects = [
  {
    title: "AMR Mobile",
    description:
      "Sistemas internos e automações para operação e gestão de processos da empresa.",
    tags: ["React Native", "NestJS", "Fastify", "PostgreSQL", "AWS", "Docker", "TypeScript"],
    href: "/projects/amr-mobile",
  },
  {
    title: "Loyloucha Imports",
    description:
      "Sistema de gestão interna para controle de estoque, pedidos, clientes e fluxo de importação.",
    tags: ["Next.js", "NestJS", "Prisma", "PostgreSQL", "Tailwind CSS"],
    href: "/projects/loyloucha-imports",
  },
  {
    title: "Sistema de Adoção de Pets",
    description:
      "Plataforma para ONGs publicarem pets para adoção e conectarem adotantes.",
    tags: ["React", "Node.js", "MongoDB", "Express", "Tailwind CSS"],
    href: "/projects/sistema-adocao-pets",
  },
  {
    title: "Spring Scheduler",
    description:
      "Serviço de agendamento de tarefas recorrentes com fila, logs e notificações.",
    tags: ["Java", "Spring Boot", "PostgreSQL", "Redis"],
    href: "/projects/spring-scheduler",
  },
  {
    title: "Portfolio Website",
    description:
      "Portfólio pessoal construído para apresentar meu trabalho, projetos e jornada.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Motion", "Supabase"],
    href: "/projects/portfolio-website",
  },
];

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

export default function ProjectsPage() {
  const featuredRef = useRef<HTMLDivElement>(null);
  const isFeaturedInView = useInView(featuredRef, { once: true, amount: 0.3 });

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

      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-5xl font-semibold tracking-tight text-[#F8FAFC] sm:text-6xl lg:text-7xl">
            Projects.
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 max-w-xl text-base leading-relaxed text-[#94A3B8]"
        >
          Produtos, sistemas e experiências que construí nos últimos anos.
        </motion.p>

        <motion.a
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          href="https://github.com/andredeomondes"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm text-[#64748B] transition-colors hover:text-[#8B5CF6]"
        >
          <FaGithub className="h-4 w-4" />
            Ver todos no GitHub
          <ExternalLink className="h-3 w-3" />
        </motion.a>

        <section ref={featuredRef} className="mt-16">
          <FadeUp>
            <h2 className="mb-2 text-sm font-medium text-[#8B5CF6]">
              Destaque
            </h2>
          </FadeUp>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isFeaturedInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6"
          >
            <MagicCard className="relative overflow-hidden p-8">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-[#F8FAFC]">
                    Clube de Programação
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-[#94A3B8]">
                    Plataforma completa para ensino de programação com trilhas,
                    exercícios práticos, comunidade e gamificação.
                  </p>

                  <ul className="mt-6 space-y-2 text-sm text-[#64748B]">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#8B5CF6]" />
                      Mais de 500 alunos ativos
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#8B5CF6]" />
                      Gamificação e sistema de níveis
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#8B5CF6]" />
                      Trilhas estruturadas do básico ao avançado
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#8B5CF6]" />
                      Ambiente colaborativo com fóruns e reviews
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#8B5CF6]" />
                      Painel administrativo completo
                    </li>
                  </ul>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {["Next.js", "React", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL", "Redis"].map(
                      (tech) => {
                        const icon = techIcons[tech];
                        return (
                          <Badge
                            key={tech}
                            variant="secondary"
                            className="inline-flex items-center gap-1.5 border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-xs text-[#94A3B8]"
                          >
                            {icon && <icon.icon className="h-3 w-3" style={{ color: icon.color }} />}
                            {tech}
                          </Badge>
                        );
                      }
                    )}
                  </div>

                  <Link
                    href="/projects/clube-de-programacao"
                    className="group mt-8 inline-flex h-10 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-5 text-sm font-medium text-[#F8FAFC] backdrop-blur-xl transition-all hover:bg-[#8B5CF6]/20 hover:border-[#8B5CF6]/30"
                  >
                    Ver case completo
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>

                <div className="flex-1">
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/[0.08] bg-gradient-to-br from-[#8B5CF6]/10 to-transparent">
                    <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
                      <span className="text-sm font-medium text-[#8B5CF6]">
                        Clube de Programação
                      </span>
                      <span className="text-xs text-[#64748B]">
                        Dashboard · Trilhas · Exercícios · Ranking
                      </span>
                    </div>
                    <BorderBeam duration={8} size={300} />
                  </div>
                </div>
              </div>
            </MagicCard>
          </motion.div>
        </section>

        <section className="mt-24">
          <FadeUp>
            <h2 className="mb-2 text-sm font-medium text-[#8B5CF6]">
              Projetos Selecionados
            </h2>
          </FadeUp>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {projects.map((project, i) => {
              const colors = projectColors[project.title] ?? { from: "#8B5CF6", to: "#60A5FA" };
              return (
                <FadeUp key={project.title} delay={0.1 + i * 0.08}>
                  <Link href={project.href}>
                    <MagicCard
                      mode="orb"
                      glowFrom={colors.from}
                      glowTo={colors.to}
                      glowSize={320}
                      glowBlur={80}
                      glowOpacity={0.35}
                      className="group relative overflow-hidden rounded-2xl p-6"
                    >
                      <div
                        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
                        style={{ background: `linear-gradient(90deg, ${colors.from}, ${colors.to})` }}
                      />
                      <div className="relative z-40">
                        <div className="flex items-start justify-between">
                          <h3 className="text-base font-medium text-[#F8FAFC] transition-colors group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[var(--from)] group-hover:to-[var(--to)]"
                            style={{ "--from": colors.from, "--to": colors.to } as React.CSSProperties}
                          >
                            {project.title}
                          </h3>
                          <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#94A3B8] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">
                          {project.description}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {project.tags.map((tag) => {
                            const icon = techIcons[tag];
                            return (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-1 text-[11px] font-medium text-[#64748B]"
                              >
                                {icon ? (
                                  <icon.icon className="h-3 w-3" style={{ color: icon.color }} />
                                ) : (
                                  <span className="h-1.5 w-1.5 rounded-full bg-[#64748B]" />
                                )}
                                {tag}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </MagicCard>
                  </Link>
                </FadeUp>
              );
            })}
          </div>
        </section>

        <section className="mt-24 text-center">
          <FadeUp>
            <h2 className="text-2xl font-semibold text-[#F8FAFC] sm:text-3xl">
              Tem um projeto em mente?
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="mt-3 text-sm text-[#94A3B8]">
              Estou sempre aberto a novas oportunidades e colaborações
              interessantes.
            </p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/about#contato"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-5 text-sm font-medium text-[#F8FAFC] backdrop-blur-xl transition-all hover:bg-[#8B5CF6]/20 hover:border-[#8B5CF6]/30"
              >
                Entrar em contato
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://github.com/andredeomondes"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-5 text-sm font-medium text-[#94A3B8] backdrop-blur-xl transition-all hover:bg-white/[0.08]"
              >
                <FaGithub className="h-4 w-4" />
                Ver mais no GitHub
              </a>
            </div>
          </FadeUp>
        </section>
      </div>
    </div>
  );
}

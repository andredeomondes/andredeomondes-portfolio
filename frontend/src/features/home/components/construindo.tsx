"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { ArrowRight, ExternalLink } from "lucide-react";
import { MagicCard } from "@/shared/components/ui/magic-card";
import { BorderBeam } from "@/shared/components/ui/border-beam";
import { ShineBorder } from "@/shared/components/ui/shine-border";
import { TextAnimate } from "@/shared/components/ui/text-animate";
import Link from "next/link";
import {
  SiTypescript, SiSpringboot, SiReact,
  SiDocker, SiPostgresql, SiTailwindcss, SiNextdotjs,
  SiMongodb, SiExpress, SiNodedotjs, SiRedis, SiSupabase,
} from "react-icons/si";
import { DiJava } from "react-icons/di";

const techIcons: Record<string, { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; color: string }> = {
  TypeScript: { icon: SiTypescript, color: "#3178C6" },
  Java: { icon: DiJava, color: "#B07219" },
  "Spring Boot": { icon: SiSpringboot, color: "#6DB33F" },
  React: { icon: SiReact, color: "#61DAFB" },
  "Next.js": { icon: SiNextdotjs, color: "#FFFFFF" },
  Docker: { icon: SiDocker, color: "#2496ED" },
  PostgreSQL: { icon: SiPostgresql, color: "#4169E1" },
  "Tailwind CSS": { icon: SiTailwindcss, color: "#06B6D4" },
  Redis: { icon: SiRedis, color: "#DC382D" },
  MongoDB: { icon: SiMongodb, color: "#47A248" },
  Express: { icon: SiExpress, color: "#FFFFFF" },
  "Node.js": { icon: SiNodedotjs, color: "#339933" },
  Supabase: { icon: SiSupabase, color: "#3ECF8E" },
};

const secondaryProjects = [
  {
    title: "Sistema de Adoção de Pets",
    description: "Plataforma para ONGs publicarem pets para adoção.",
    href: "/projects/sistema-adocao-pets",
    tags: ["React", "Node.js", "MongoDB", "Express"],
    colors: { from: "#10B981", to: "#34D399" },
  },
  {
    title: "Spring Scheduler",
    description: "Serviço de agendamento de tarefas recorrentes com fila e notificações.",
    href: "/projects/spring-scheduler",
    tags: ["Java", "Spring Boot", "PostgreSQL", "Redis"],
    colors: { from: "#F59E0B", to: "#EF4444" },
  },
  {
    title: "Portfolio Website",
    description: "Este portfólio — construído com Next.js, Tailwind, Motion e Supabase.",
    href: "/projects/portfolio-website",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
    colors: { from: "#8B5CF6", to: "#A855F7" },
  },
];

export function ConstruindoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [80, 0, 0, -80]);
  const mockupY = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [60, 0, 0, -60]);
  const mockupScale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.92, 1, 1, 0.92]);

  const fadeUpVariant = (delay: number) =>
    ({
      hidden: { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] } },
      exit: { opacity: 0, y: -30, transition: { duration: 0.3, ease: "easeIn" } },
    }) as const;

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24"
    >
      <motion.div
        style={{ y: contentY }}
        className="mx-auto flex w-full max-w-6xl flex-col gap-16 lg:flex-row lg:items-center lg:gap-24"
      >
        <div className="flex-1">
          <motion.p
            variants={fadeUpVariant(0.1)}
            initial="hidden"
            animate={isInView ? "visible" : "exit"}
            className="mb-3 text-sm font-medium text-[#8B5CF6]"
          >
            Construindo
          </motion.p>

          <motion.p
            variants={fadeUpVariant(0.15)}
            initial="hidden"
            animate={isInView ? "visible" : "exit"}
            className="mb-2 text-xs font-medium uppercase tracking-widest text-[#94A3B8]"
          >
            Atualmente Construindo
          </motion.p>

          <motion.h2
            variants={fadeUpVariant(0.2)}
            initial="hidden"
            animate={isInView ? "visible" : "exit"}
            className="text-4xl font-semibold leading-[1.1] tracking-tight text-[#F8FAFC] sm:text-5xl"
          >
            Clube de
            <br />
            Programação
          </motion.h2>

          <TextAnimate
            animation="slideUp"
            by="line"
            duration={0.4}
            delay={0.35}
            className="mt-6 max-w-md text-lg leading-relaxed text-[#94A3B8]"
          >
            Uma plataforma para aprender programação através da prática.
          </TextAnimate>

          <TextAnimate
            animation="fadeIn"
            by="word"
            duration={0.3}
            delay={0.5}
            className="mt-4 text-sm leading-relaxed text-[#64748B]"
          >
            Desafios interativos, progressão de aprendizado,
            rankings e acompanhamento de evolução para estudantes de tecnologia.
          </TextAnimate>

          <motion.div
            variants={fadeUpVariant(0.55)}
            initial="hidden"
            animate={isInView ? "visible" : "exit"}
            className="mt-8"
          >
            <Link
              href="/projects/clube-de-programacao"
              className="group relative inline-flex h-11 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-6 text-sm font-medium text-[#F8FAFC] backdrop-blur-xl transition-all hover:bg-[#8B5CF6]/20 hover:border-[#8B5CF6]/30"
            >
              Ver Projeto
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              <BorderBeam duration={3} size={60} />
            </Link>
          </motion.div>
        </div>

        <motion.div
          style={{ y: mockupY, scale: mockupScale }}
          className="relative flex-1"
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#8B5CF6]/10 to-transparent">
            <ShineBorder shineColor={["#8B5CF6", "#60A5FA", "#A855F7"]} borderWidth={1} duration={6} />
            <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
              <div className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm font-medium text-[#8B5CF6]">
                Clube de Programação
              </div>
              <p className="text-xs text-[#64748B]">
                Dashboard · Trilhas · Exercícios · Ranking
              </p>
            </div>
            <BorderBeam duration={6} size={200} />
          </div>
        </motion.div>
      </motion.div>

      <div className="mx-auto mt-24 grid w-full max-w-6xl gap-4 sm:grid-cols-3">
        {secondaryProjects.map((project, i) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{
              duration: 0.5,
              delay: 0.6 + i * 0.1,
              ease: [0.22, 1, 0.36, 1] as const,
            }}
          >
            <Link href={project.href}>
              <MagicCard
                mode="orb"
                glowFrom={project.colors.from}
                glowTo={project.colors.to}
                glowSize={280}
                glowBlur={70}
                glowOpacity={0.3}
                className="group relative overflow-hidden rounded-2xl p-5"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
                  style={{ background: `linear-gradient(90deg, ${project.colors.from}, ${project.colors.to})` }}
                />
                <div className="relative z-40">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-[#F8FAFC] transition-colors group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[--from] group-hover:to-[--to]"
                      style={{ "--from": project.colors.from, "--to": project.colors.to } as React.CSSProperties}
                    >
                      {project.title}
                    </h3>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-[#94A3B8] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-[#64748B]">
                    {project.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {project.tags.map((tag) => {
                      const icon = techIcons[tag];
                      return (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded-md border border-white/[0.06] bg-white/[0.03] px-1.5 py-0.5 text-[10px] font-medium text-[#64748B]"
                        >
                          {icon && <icon.icon className="h-2.5 w-2.5" style={{ color: icon.color }} />}
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </MagicCard>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

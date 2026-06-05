"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight, ExternalLink, Star } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { NoiseTexture } from "@/shared/components/ui/noise-texture";
import { GradualBlur } from "@/shared/components/ui/gradual-blur";
import { ShimmerLink, ShimmerAnchor } from "@/shared/components/ui/shimmer-button";
import { AnimatedGridPattern } from "@/shared/components/ui/animated-grid-pattern";

const featuredProject = {
  title: "Clube de Programação",
  description: "Plataforma para estudar com mais clareza, acompanhar progresso e voltar todo dia.",
  href: "/projects/clube-de-programacao",
  image: "/clubeprogramacao.png",
  tags: ["Next.js", "React", "TypeScript", "PostgreSQL"],
  github: "https://github.com/andredeomondes",
};

const projects = [
  {
    title: "AMR Mobile",
    description: "Operação interna mais leve, sem atrito no uso diário.",
    href: "/projects/amr-mobile",
    image: "/clubeprogramacao.png",
    tags: ["TypeScript", "React Native", "NestJS", "PostgreSQL"],
    github: "https://github.com/andredeomondes",
  },
  {
    title: "Loyloucha Imports",
    description: "Gestão, pedidos e rotina organizados num só lugar.",
    href: "/projects/loyloucha-imports",
    image: "/andre.jpg",
    tags: ["Next.js", "NestJS", "Prisma", "PostgreSQL"],
    github: "https://github.com/andredeomondes",
  },
  {
    title: "Spring Scheduler",
    description: "Jobs, filas e notificações funcionando do jeito certo.",
    href: "/projects/spring-scheduler",
    image: "/clubeprogramacao.png",
    tags: ["Java", "Spring Boot", "Redis", "PostgreSQL"],
    github: "https://github.com/andredeomondes",
  },
];

function Tag({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-black/8 bg-black/[0.04] px-2.5 py-1 text-[11px] font-medium text-[#0b1020]/58 dark:border-white/10 dark:bg-white/[0.05] dark:text-white/52">
      {label}
    </span>
  );
}

function ProjectCard({
  title,
  description,
  href,
  image,
  tags,
  github,
}: {
  title: string;
  description: string;
  href: string;
  image: string;
  tags: string[];
  github: string;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/8 bg-white/72 text-[#0b1020] backdrop-blur-xl transition-all duration-300 hover:border-violet-500/25 hover:shadow-[0_20px_60px_rgba(139,92,246,0.15),0_0_0_1px_rgba(139,92,246,0.08)] dark:border-white/8 dark:bg-white/[0.05] dark:text-white dark:hover:border-violet-400/30 dark:hover:shadow-[0_20px_60px_rgba(139,92,246,0.22)]"
    >
      {/* Image */}
      <div className="overflow-hidden border-b border-black/8 dark:border-white/8">
        <Image
          src={image}
          alt={title}
          width={1200}
          height={900}
          className="h-44 w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold tracking-[-0.03em]">{title}</h3>
        <p className="mt-1.5 text-sm leading-6 text-[#0b1020]/56 dark:text-white/50">{description}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((t) => <Tag key={t} label={t} />)}
        </div>

        <div className="mt-auto flex items-center gap-3 pt-4">
          <ShimmerLink
            href={href}
            shimmerColor="#a78bfa"
            background="rgba(109,40,217,0.82)"
            className="h-8 gap-1.5 px-3.5 text-xs font-medium shadow-[0_0_16px_rgba(139,92,246,0.3)] transition-shadow group-hover:shadow-[0_0_28px_rgba(139,92,246,0.55)]"
          >
            Ver projeto <ArrowRight className="size-3" />
          </ShimmerLink>
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-8 items-center justify-center rounded-full border border-black/8 bg-black/[0.03] text-[#0b1020]/46 transition-all hover:border-black/16 hover:text-[#0b1020] dark:border-white/10 dark:bg-white/[0.04] dark:text-white/40 dark:hover:border-white/20 dark:hover:text-white"
          >
            <FaGithub className="size-3.5" />
          </a>
        </div>
      </div>

      {/* Hover glow inner */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.06),transparent_60%)]" />
    </motion.article>
  );
}

export default function ProjectsPage() {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#f6f2ea] text-[#0b1020] dark:bg-[#080912] dark:text-white">
      {/* Backgrounds */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(180,143,255,0.1),transparent_30%),linear-gradient(145deg,#f6f2ea_0%,#ede7dd_52%,#e8e2f5_100%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(120,80,255,0.08),transparent_30%),linear-gradient(145deg,#080912_0%,#0a0d1f_52%,#10091e_100%)]" />
      <AnimatedGridPattern
        width={52}
        height={52}
        numSquares={28}
        maxOpacity={0.04}
        duration={3}
        className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)] dark:opacity-60"
      />
      <NoiseTexture noiseOpacity={0.1} frequency={0.6} octaves={3} slope={0.7} className="opacity-30 mix-blend-soft-light" />
      <GradualBlur position="top" height="10rem" strength={2} divCount={7} curve="bezier" />
      <GradualBlur position="bottom" height="10rem" strength={2} divCount={7} curve="bezier" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-28 sm:px-8 lg:px-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">Projetos</h1>
            <span className="h-1 w-10 rounded-full bg-violet-500" />
          </div>
          <p className="mt-4 max-w-lg text-sm leading-7 text-[#0b1020]/56 dark:text-white/48">
            Projetos que nasceram para resolver problemas reais — boa base técnica e interface cuidada.
          </p>
        </motion.div>

        {/* Featured */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="relative mt-12 overflow-hidden rounded-2xl border border-black/8 bg-white/62 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/20 hover:shadow-[0_24px_70px_rgba(139,92,246,0.12)] dark:border-white/8 dark:bg-white/[0.05] dark:hover:border-violet-400/25 dark:hover:shadow-[0_24px_70px_rgba(139,92,246,0.2)]"
        >
          <NoiseTexture noiseOpacity={0.06} frequency={0.5} octaves={3} slope={0.8} className="opacity-30 mix-blend-soft-light" />
          {/* Featured badge */}
          <div className="absolute left-5 top-5 z-10 inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-700 dark:text-amber-400">
            <Star className="size-3 fill-amber-500 text-amber-500" />
            Em destaque
          </div>

          <div className="relative z-10 grid gap-0 lg:grid-cols-[1fr_40%]">
            {/* Text side */}
            <div className="flex flex-col justify-center p-7 lg:p-10">
              <h2 className="mt-6 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl lg:mt-0">
                {featuredProject.title}
              </h2>
              <p className="mt-3 max-w-md text-sm leading-7 text-[#0b1020]/56 dark:text-white/50">
                {featuredProject.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {featuredProject.tags.map((t) => <Tag key={t} label={t} />)}
              </div>
              <div className="mt-6 flex items-center gap-3">
                <ShimmerLink
                  href={featuredProject.href}
                  shimmerColor="#a78bfa"
                  background="rgba(109,40,217,0.88)"
                  className="h-10 gap-2 px-5 text-sm font-medium shadow-[0_0_24px_rgba(139,92,246,0.45)]"
                >
                  Ver projeto <ArrowRight className="size-4" />
                </ShimmerLink>
                <ShimmerAnchor
                  href={featuredProject.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  shimmerColor="#ffffff"
                  background="rgba(0,0,0,0.55)"
                  className="h-10 gap-2 px-4 text-sm"
                >
                  <FaGithub className="size-4" />
                  GitHub
                  <ExternalLink className="size-3.5" />
                </ShimmerAnchor>
              </div>
            </div>

            {/* Image side */}
            <div className="group overflow-hidden border-t border-black/8 lg:border-l lg:border-t-0 dark:border-white/8">
              <Image
                src={featuredProject.image}
                alt={featuredProject.title}
                width={1200}
                height={900}
                className="h-56 w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03] lg:h-full"
              />
            </div>
          </div>
        </motion.section>

        {/* Grid */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProjectCard {...project} />
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}

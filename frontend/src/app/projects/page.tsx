"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { NoiseTexture } from "@/shared/components/ui/noise-texture";
import { ProgressiveBlur } from "@/shared/components/ui/progressive-blur";
import { ShimmerLink } from "@/shared/components/ui/shimmer-button";

const featuredProject = {
  title: "Clube de Programacao",
  description:
    "Plataforma para estudar com mais clareza, acompanhar progresso e voltar todo dia.",
  href: "/projects/clube-de-programacao",
  image: "/clubeprogramacao.png",
  tags: ["Next.js", "React", "TypeScript", "PostgreSQL"],
};

const projects = [
  {
    title: "AMR Mobile",
    description: "Operação interna mais leve, sem atrito no uso diário.",
    href: "/projects/amr-mobile",
    image: "/clubeprogramacao.png",
    tags: ["TypeScript", "Next.js", "React", "Node.js", "+2"],
  },
  {
    title: "Loyloucha Imports",
    description: "Gestão, pedidos e rotina organizados num só lugar.",
    href: "/projects/loyloucha-imports",
    image: "/andre.jpg",
    tags: ["TypeScript", "Next.js", "React", "Node.js", "+2"],
  },
  {
    title: "Spring Scheduler",
    description: "Jobs, filas e notificações funcionando do jeito certo.",
    href: "/projects/spring-scheduler",
    image: "/clubeprogramacao.png",
    tags: ["Java", "Spring", "Postgres", "Redis", "+1"],
  },
];

function ProjectCard({
  title,
  description,
  href,
  image,
  tags,
}: {
  title: string;
  description: string;
  href: string;
  image: string;
  tags: string[];
}) {
  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-black/8 bg-white/72 text-[#0b1020] shadow-[0_18px_50px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-shadow hover:shadow-[0_24px_60px_rgba(0,0,0,0.14)] dark:border-white/8 dark:bg-white/[0.06] dark:text-white dark:shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
      <div className="overflow-hidden border-b border-black/8 dark:border-white/8">
        <Image
          src={image}
          alt={title}
          width={1200}
          height={900}
          className="h-52 w-full object-cover object-top"
        />
      </div>
      <div className="p-6">
        <h3 className="text-balance text-2xl font-semibold tracking-[-0.04em]">
          {title}
        </h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-black/8 bg-black/[0.04] px-3 py-1.5 text-xs text-[#0b1020]/58 dark:border-white/8 dark:bg-white/[0.04] dark:text-white/58"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-5 flex items-center gap-3">
          <Image
            src="/andre.jpg"
            alt="Andre Deomondes"
            width={40}
            height={40}
            className="size-10 rounded-full border border-black/10 object-cover dark:border-white/10"
          />
          <p className="text-sm leading-7 text-[#0b1020]/54 dark:text-white/54">{description}</p>
        </div>
        <div className="mt-6 flex items-center gap-4 text-sm">
          <ShimmerLink
            href={href}
            shimmerColor="#a78bfa"
            background="rgba(109,40,217,0.82)"
            className="h-9 gap-1.5 px-4 text-xs font-medium shadow-[0_0_18px_rgba(139,92,246,0.35)]"
          >
            Ver projeto
            <ArrowRight className="size-3.5" />
          </ShimmerLink>
          <a
            href="https://github.com/andredeomondes"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0b1020]/42 transition-colors hover:text-[#0b1020]/72 dark:text-white/46 dark:hover:text-white/72"
          >
            <FaGithub className="size-4" />
          </a>
        </div>
      </div>
    </article>
  );
}

export default function ProjectsPage() {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#f6f2ea] px-6 py-28 text-[#0b1020] dark:bg-[#080912] dark:text-white sm:px-8 lg:px-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(180,143,255,0.1),transparent_30%),linear-gradient(145deg,#f6f2ea_0%,#ede7dd_52%,#e8e2f5_100%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(120,80,255,0.08),transparent_30%),linear-gradient(145deg,#080912_0%,#0a0d1f_52%,#10091e_100%)]" />
      <NoiseTexture
        noiseOpacity={0.1}
        frequency={0.6}
        octaves={3}
        slope={0.7}
        className="opacity-30 mix-blend-soft-light"
      />
      <ProgressiveBlur
        position="both"
        className="opacity-50"
        blurLevels={[0.5, 1, 2, 4, 8, 12, 20, 28]}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-8"
        >
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">
              Meus Projetos
            </h1>
            <span className="h-1 w-12 rounded-full bg-violet-500" />
          </div>
          <p className="max-w-xl text-sm leading-7 text-[#0b1020]/56 dark:text-white/56">
            Projetos que nasceram para resolver problema de verdade, com boa base técnica e interface cuidada.
          </p>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-12 overflow-hidden rounded-[2rem] border border-black/8 bg-white/58 p-8 backdrop-blur-xl dark:border-white/8 dark:bg-white/[0.05]"
        >
          <NoiseTexture
            noiseOpacity={0.08}
            frequency={0.55}
            octaves={3}
            slope={0.8}
            className="opacity-35 mix-blend-soft-light"
          />
          <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_28rem] lg:items-end">
            <div>
              <p className="text-sm text-[#0b1020]/58 dark:text-white/58">Em destaque</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">
                {featuredProject.title}
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[#0b1020]/56 dark:text-white/56">
                {featuredProject.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {featuredProject.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-black/8 bg-black/[0.04] px-3 py-1.5 text-xs text-[#0b1020]/58 dark:border-white/8 dark:bg-white/[0.04] dark:text-white/58"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-4">
                <ShimmerLink
                  href={featuredProject.href}
                  shimmerColor="#a78bfa"
                  background="rgba(109,40,217,0.85)"
                  className="h-11 gap-2 px-5 text-sm font-medium shadow-[0_0_28px_rgba(139,92,246,0.45)]"
                >
                  Ver projeto
                  <ArrowRight className="size-4" />
                </ShimmerLink>
                <a
                  href="https://github.com/andredeomondes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[#0b1020]/56 transition-colors hover:text-[#0b1020] dark:text-white/56 dark:hover:text-white"
                >
                  GitHub
                  <ExternalLink className="size-3.5" />
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.6rem] border border-black/8 dark:border-white/10">
              <Image
                src={featuredProject.image}
                alt={featuredProject.title}
                width={1200}
                height={900}
                className="h-64 w-full object-cover object-top"
              />
            </div>
          </div>
        </motion.section>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                delay: index * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <ProjectCard {...project} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

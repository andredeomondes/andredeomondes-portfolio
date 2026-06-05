import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { FaGithub as Github } from "react-icons/fa";
import {
  SiDocker, SiMongodb, SiNestjs, SiNextdotjs, SiNodedotjs,
  SiPostgresql, SiPrisma, SiReact, SiRedis, SiSpringboot,
  SiTailwindcss, SiTypescript,
} from "react-icons/si";
import { DiJava } from "react-icons/di";
import { FaAws } from "react-icons/fa";
import { getPublicProjectBySlug } from "@/lib/frontend-api";
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

export default async function ProjectCasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug).catch(() => null);

  if (!project || !project.published) notFound();

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#f6f2ea] text-[#0b1020] dark:bg-[#080912] dark:text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(180,143,255,0.1),transparent_32%),linear-gradient(145deg,#f6f2ea_0%,#ede7dd_52%,#e8e2f5_100%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(120,80,255,0.08),transparent_32%),linear-gradient(145deg,#080912_0%,#0a0d1f_52%,#10091e_100%)]" />
      <NoiseTexture noiseOpacity={0.1} frequency={0.6} octaves={3} slope={0.7} className="opacity-30 mix-blend-soft-light" />
      <ProgressiveBlur position="top" className="opacity-50" blurLevels={[0.5, 1, 2, 4, 8, 12, 18, 24]} />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-28 sm:px-8 lg:px-12">
        <div>
          <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm text-[#0b1020]/54 transition-colors hover:text-violet-600 dark:text-white/46 dark:hover:text-violet-400">
            <ArrowLeft className="size-4" />
            Projetos
          </Link>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-700 dark:text-violet-300">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-[-0.06em] sm:text-5xl lg:text-6xl">
              {project.title}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-[#0b1020]/58 dark:text-white/58">
              {project.long_description || project.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-5">
              {project.meta.map((item) => (
                <span key={item} className="flex items-center gap-2 text-sm text-[#0b1020]/46 dark:text-white/42">
                  <span className="size-1.5 rounded-full bg-violet-500" />
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {project.github_url && (
                <ShimmerAnchor
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  shimmerColor="#a78bfa"
                  background="rgba(109,40,217,0.85)"
                  className="h-10 gap-2 px-5 text-sm font-medium shadow-[0_0_24px_rgba(139,92,246,0.4)]"
                >
                  <Github className="size-4" />
                  Ver no GitHub
                </ShimmerAnchor>
              )}
              {project.live_url && (
                <ShimmerAnchor
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  shimmerColor="#ffffff"
                  background="rgba(15,23,42,0.78)"
                  className="h-10 gap-2 px-5 text-sm font-medium"
                >
                  Acessar projeto
                  <ExternalLink className="size-4" />
                </ShimmerAnchor>
              )}
            </div>
          </div>

          <GlassCard className="overflow-hidden p-0">
            <Image
              src={project.image_url || "/clubeprogramacao.png"}
              alt={project.title}
              width={1200}
              height={900}
              className="h-full w-full object-cover"
            />
          </GlassCard>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <GlassCard>
            <SectionLabel>Contexto</SectionLabel>
            <div className="space-y-6 text-sm leading-7 text-[#0b1020]/66 dark:text-white/60">
              <div>
                <h2 className="font-medium text-[#0b1020] dark:text-white">Problema</h2>
                <p className="mt-2">{project.overview_problema || "Em definicao."}</p>
              </div>
              <div>
                <h2 className="font-medium text-[#0b1020] dark:text-white">Solucao</h2>
                <p className="mt-2">{project.overview_solucao || "Em definicao."}</p>
              </div>
              <div>
                <h2 className="font-medium text-[#0b1020] dark:text-white">Resultado</h2>
                <p className="mt-2">{project.overview_resultado || "Em definicao."}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <SectionLabel>Stack</SectionLabel>
            <div className="grid gap-3 sm:grid-cols-2">
              {project.tech_stack.map((tech) => {
                const Icon = techIconMap[tech] ?? SiNextdotjs;
                const color = techColorMap[tech] ?? "#a78bfa";
                return (
                  <div key={tech} className="flex items-center gap-3 rounded-2xl border border-black/8 bg-white/58 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
                    <span style={{ color }}>
                      <Icon className="size-5" />
                    </span>
                    <span className="text-sm">{tech}</span>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          <GlassCard>
            <SectionLabel>Arquitetura</SectionLabel>
            <ul className="space-y-3 text-sm leading-7 text-[#0b1020]/66 dark:text-white/60">
              {project.architecture.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-3 size-1.5 shrink-0 rounded-full bg-violet-500" />
                  {item}
                </li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard>
            <SectionLabel>Aprendizados</SectionLabel>
            <ul className="space-y-3 text-sm leading-7 text-[#0b1020]/66 dark:text-white/60">
              {project.aprendizados.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-3 size-1.5 shrink-0 rounded-full bg-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>

        <GlassCard className="mt-6">
          <SectionLabel>Proximos Passos</SectionLabel>
          <div className="flex flex-wrap gap-3">
            {project.next_steps.map((item) => (
              <span
                key={item}
                className="rounded-full border border-black/8 bg-white/72 px-4 py-2 text-sm text-[#0b1020]/72 dark:border-white/10 dark:bg-white/[0.06] dark:text-white/68"
              >
                {item}
              </span>
            ))}
          </div>
          <div className="mt-8">
            <ShimmerLink
              href="/projects"
              shimmerColor="#a78bfa"
              background="rgba(109,40,217,0.84)"
              className="h-11 px-5 text-sm font-medium shadow-[0_0_24px_rgba(139,92,246,0.38)]"
            >
              Ver outros projetos
            </ShimmerLink>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

import Image from "next/image";
import { ArrowRight, ExternalLink, Star } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { getPublicFeaturedProjects, getPublicProjects } from "@/lib/frontend-api";
import { NoiseTexture } from "@/shared/components/ui/noise-texture";
import { GradualBlur } from "@/shared/components/ui/gradual-blur";
import { ShimmerAnchor, ShimmerLink } from "@/shared/components/ui/shimmer-button";
import { AnimatedGridPattern } from "@/shared/components/ui/animated-grid-pattern";
import type { Project } from "@/types/supabase";

function Tag({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-black/8 bg-black/[0.04] px-2.5 py-1 text-[11px] font-medium text-[#0b1020]/58 dark:border-white/10 dark:bg-white/[0.05] dark:text-white/52">
      {label}
    </span>
  );
}

function projectImage(project: Project) {
  return project.image_url || "/clubeprogramacao.png";
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/8 bg-white/72 text-[#0b1020] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/25 hover:shadow-[0_20px_60px_rgba(139,92,246,0.15),0_0_0_1px_rgba(139,92,246,0.08)] dark:border-white/8 dark:bg-white/[0.05] dark:text-white dark:hover:border-violet-400/30 dark:hover:shadow-[0_20px_60px_rgba(139,92,246,0.22)]">
      <div className="overflow-hidden border-b border-black/8 dark:border-white/8">
        <Image
          src={projectImage(project)}
          alt={project.title}
          width={1200}
          height={900}
          className="h-44 w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold tracking-[-0.03em]">{project.title}</h3>
        <p className="mt-1.5 text-sm leading-6 text-[#0b1020]/56 dark:text-white/50">{project.description}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.tags.slice(0, 4).map((tag) => <Tag key={tag} label={tag} />)}
        </div>

        <div className="mt-auto flex items-center gap-3 pt-4">
          <ShimmerLink
            href={`/projects/${project.slug}`}
            shimmerColor="#a78bfa"
            background="rgba(109,40,217,0.82)"
            className="h-8 gap-1.5 px-3.5 text-xs font-medium shadow-[0_0_16px_rgba(139,92,246,0.3)] transition-shadow group-hover:shadow-[0_0_28px_rgba(139,92,246,0.55)]"
          >
            Ver projeto <ArrowRight className="size-3" />
          </ShimmerLink>
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-8 items-center justify-center rounded-full border border-black/8 bg-black/[0.03] text-[#0b1020]/46 transition-all hover:border-black/16 hover:text-[#0b1020] dark:border-white/10 dark:bg-white/[0.04] dark:text-white/40 dark:hover:border-white/20 dark:hover:text-white"
            >
              <FaGithub className="size-3.5" />
            </a>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.06),transparent_60%)]" />
    </article>
  );
}

export default async function ProjectsPage() {
  const [featuredProjects, projects] = await Promise.all([
    getPublicFeaturedProjects().catch(() => []),
    getPublicProjects().catch(() => []),
  ]);

  const featuredProject = featuredProjects[0] ?? projects[0] ?? null;
  const gridProjects = projects.filter((project) => project.id !== featuredProject?.id);

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#f6f2ea] text-[#0b1020] dark:bg-[#080912] dark:text-white">
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
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">Projetos</h1>
            <span className="h-1 w-10 rounded-full bg-violet-500" />
          </div>
          <p className="mt-4 max-w-lg text-sm leading-7 text-[#0b1020]/56 dark:text-white/48">
            Projetos que nasceram para resolver problemas reais, todos gerenciados diretamente pelo painel administrativo.
          </p>
        </div>

        {featuredProject && (
          <section className="relative mt-12 overflow-hidden rounded-2xl border border-black/8 bg-white/62 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/20 hover:shadow-[0_24px_70px_rgba(139,92,246,0.12)] dark:border-white/8 dark:bg-white/[0.05] dark:hover:border-violet-400/25 dark:hover:shadow-[0_24px_70px_rgba(139,92,246,0.2)]">
            <NoiseTexture noiseOpacity={0.06} frequency={0.5} octaves={3} slope={0.8} className="opacity-30 mix-blend-soft-light" />
            <div className="absolute left-5 top-5 z-10 inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-700 dark:text-amber-400">
              <Star className="size-3 fill-amber-500 text-amber-500" />
              Em destaque
            </div>

            <div className="relative z-10 grid gap-0 lg:grid-cols-[1fr_40%]">
              <div className="flex flex-col justify-center p-7 lg:p-10">
                <h2 className="mt-6 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl lg:mt-0">
                  {featuredProject.title}
                </h2>
                <p className="mt-3 max-w-md text-sm leading-7 text-[#0b1020]/56 dark:text-white/50">
                  {featuredProject.long_description || featuredProject.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {featuredProject.tags.slice(0, 5).map((tag) => <Tag key={tag} label={tag} />)}
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <ShimmerLink
                    href={`/projects/${featuredProject.slug}`}
                    shimmerColor="#a78bfa"
                    background="rgba(109,40,217,0.88)"
                    className="h-10 gap-2 px-5 text-sm font-medium shadow-[0_0_24px_rgba(139,92,246,0.45)]"
                  >
                    Ver projeto <ArrowRight className="size-4" />
                  </ShimmerLink>
                  {featuredProject.github_url && (
                    <ShimmerAnchor
                      href={featuredProject.github_url}
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
                  )}
                </div>
              </div>

              <div className="group overflow-hidden border-t border-black/8 lg:border-l lg:border-t-0 dark:border-white/8">
                <Image
                  src={projectImage(featuredProject)}
                  alt={featuredProject.title}
                  width={1200}
                  height={900}
                  className="h-56 w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03] lg:h-full"
                />
              </div>
            </div>
          </section>
        )}

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {gridProjects.map((project) => (
            <div key={project.id}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

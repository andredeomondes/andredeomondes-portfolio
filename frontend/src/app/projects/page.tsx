import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { fallbackProjects } from "@/content/projects";
import { TechnologyIcon } from "@/shared/components/editorial/technology-icon";

export const metadata: Metadata = {
  title: "Projetos",
  description: "Produtos e sistemas construídos por Andre Deomondes.",
};

export default async function ProjectsPage() {
  const projects = fallbackProjects;

  return (
    <div className="min-h-screen pt-16">
      <header className="border-b border-line">
        <div className="site-shell py-20 sm:py-28">
          <p className="label">Projetos / casos</p>
          <h1 className="editorial-title mt-6">Código é meio.<br />O sistema é a resposta.</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-dim">Produtos apresentados pelo problema, pelas decisões técnicas e pelo que foi possível entregar — não por uma lista solta de tecnologias.</p>
        </div>
      </header>

      <section className="site-shell py-16 sm:py-24">
        {projects.length > 0 ? (
          <div className="grid gap-px border border-line bg-line lg:grid-cols-2">
            {projects.map((project, index) => (
              <Link key={project.id} href={`/projects/${project.slug}`} data-motion="card" className="group bg-ink p-5 sm:p-8">
                <div data-motion="image" className="relative aspect-[16/10] overflow-hidden border border-line bg-panel">
                  <Image src={project.image_url || "/clubeprogramacao.webp"} alt={project.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-top grayscale transition duration-500 group-hover:scale-[1.02] group-hover:grayscale-0" priority={index === 0} />
                  <span className="absolute left-4 top-4 inline-flex items-center gap-2 bg-signal px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink">
                    <TechnologyIcon name={`${project.title} ${project.tags.join(" ")}`} className="text-xs" />
                    Case 0{index + 1}
                  </span>
                </div>
                <div className="mt-6 flex items-start justify-between gap-5">
                  <div>
                    <h2 className="text-3xl font-semibold tracking-[-0.05em] text-paper">{project.title}</h2>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-dim">{project.description}</p>
                    <div className="mt-5 flex flex-wrap gap-2">{project.tags.slice(0, 4).map((tag) => <span key={tag} className="border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-dim">{tag}</span>)}</div>
                  </div>
                  <ArrowUpRight className="mt-1 size-5 shrink-0 text-signal transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="border border-line bg-panel p-10 text-dim">Os projetos serão carregados da base quando a conexão estiver disponível.</div>
        )}
      </section>
    </div>
  );
}

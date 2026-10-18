import type { Metadata } from "next";
import { fallbackProjects } from "@/content/projects";
import { PixelRevealCard } from "@/shared/components/editorial/pixel-reveal-card";

export const metadata: Metadata = {
  title: "Projetos de backend, IA e produtos digitais",
  description: "Estudos de caso de sistemas full stack, e-commerce, automação e agentes de IA construídos por Andre Deomondes.",
  alternates: { canonical: "/projects" },
  openGraph: { url: "/projects", title: "Projetos de backend, IA e produtos digitais", images: ["/brand/projects-atmosphere.webp"] },
};

export default function ProjectsPage() {
  const projects = fallbackProjects.filter((project) => project.published);

  return (
    <div className="page-shell">
      <header className="site-shell page-intro">
        <p className="page-intro__eyebrow"><b aria-hidden="true">●</b> PROJETOS · CASOS REAIS</p>
        <h1>Projetos em <span className="font-pixel">produção</span></h1>
        <p>Produtos apresentados pelo problema, pelas decisões técnicas e pelo que foi possível entregar, não por uma lista solta de tecnologias.</p>
      </header>

      <section className="site-shell projects-grid" aria-label="Estudos de caso">
        {projects.map((project, index) => (
          <PixelRevealCard
            key={project.id}
            href={`/projects/${project.slug}`}
            image={project.image_url || "/clubeprogramacao.webp"}
            title={project.title}
            summary={project.description}
            index={index + 1}
            priority={index === 0}
          />
        ))}
      </section>
    </div>
  );
}

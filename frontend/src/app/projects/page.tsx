import type { Metadata } from "next";
import { fallbackProjects } from "@/content/projects";
import { PageIntro } from "@/shared/components/editorial/page-intro";
import { HoverPreviewList } from "@/shared/components/editorial/hover-preview-list";
import { SystemArt } from "@/shared/components/fx/intro-art";

export const metadata: Metadata = {
  title: "Projetos de backend, IA e produtos digitais",
  description: "Estudos de caso de sistemas full stack, e-commerce, automação e agentes de IA construídos por Andre Deomondes.",
  alternates: { canonical: "/projects" },
  openGraph: { url: "/projects", title: "Projetos de backend, IA e produtos digitais", images: ["/brand/projects-atmosphere.webp"] },
};

export default function ProjectsPage() {
  const projects = fallbackProjects.filter((project) => project.published);

  return (
    <div className="page">
      <PageIntro
        title="Projetos."
        muted="Produtos em produção, contados pelo problema e pelas decisões."
        lead="Cada case separa o que eu fiz do escopo total do produto, com telas reais, arquitetura e o que ficou de aprendizado."
        art={<SystemArt />}
      />
      <section className="rail-cell page-section">
        <HoverPreviewList
          label="Estudos de caso"
          rows={projects.map((project, index) => ({
            href: `/projects/${project.slug}`,
            index: String(index + 1).padStart(2, "0"),
            title: project.title,
            meta: project.case_study.kicker,
            detail: project.description,
            image: project.image_url || "/clubeprogramacao.webp",
          }))}
        />
      </section>
    </div>
  );
}

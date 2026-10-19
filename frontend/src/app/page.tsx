import { fallbackProjects } from "@/content/projects";
import { publishedPublications, series } from "@/content/posts";
import { Hero } from "@/features/home/components/hero";
import { WorkGallery } from "@/features/home/components/work-gallery";
import { Capabilities } from "@/features/home/components/capabilities";
import { CourseStrip } from "@/features/home/components/course-strip";
import { Finale } from "@/features/home/components/finale";

export const revalidate = 300;

export default function Home() {
  const work = fallbackProjects
    .filter((project) => project.published)
    .map((project) => ({
      slug: project.slug,
      title: project.title,
      kicker: project.case_study.kicker,
      summary: project.description,
      role: project.case_study.role_summary,
      stack: project.tech_stack,
      image: project.image_url || "/clubeprogramacao.webp",
    }));

  const units = publishedPublications
    .slice(-6)
    .reverse()
    .map((post) => ({ slug: post.slug, unit: post.unit, title: post.title, statement: post.statement, cover: post.images[0] }));

  return (
    <>
      <Hero />
      <WorkGallery items={work} />
      <Capabilities />
      <CourseStrip units={units} published={series.publishedUnits} total={series.totalUnits} />
      <Finale />
    </>
  );
}

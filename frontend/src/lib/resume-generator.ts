import type { Project } from "@/types/supabase";
import type { ResumeSectionId, SiteContent } from "@/lib/site-content";

function section(title: string, lines: string[]) {
  return [`## ${title}`, ...lines.filter(Boolean), ""];
}

function unique(items: string[]) {
  return [...new Set(items.map((item) => item.trim()).filter(Boolean))];
}

export function buildResumeContent(site: SiteContent, projects: Project[]) {
  const { profile, about, resume } = site;
  const topProjects = projects.slice(0, 4);
  const stackFromAbout = about.techStack.flatMap((section) => section.items);
  const stackFromProjects = topProjects.flatMap((project) => project.tech_stack ?? []);
  const allTech = unique([...resume.focusTopics, ...stackFromAbout, ...stackFromProjects]);
  const hardSkills = unique([
    ...allTech,
    ...topProjects.flatMap((project) => project.architecture ?? []),
  ]);
  const softSkills = unique(resume.softSkills);
  const keywords = unique(resume.keywords);
  const experienceLines = about.experiences.flatMap((item) => [
    `### ${item.role} | ${item.company} | ${item.period}`,
    ...item.bullets.map((bullet) => `- ${bullet}`),
    "",
  ]);

  const projectLines = topProjects.flatMap((project) => [
    `### ${project.title}`,
    project.description,
    ...(project.overview_resultado ? [`- Resultado: ${project.overview_resultado}`] : []),
    ...(project.tech_stack?.length ? [`- Stack: ${project.tech_stack.join(", ")}`] : []),
    ...(project.live_url ? [`- Link: ${project.live_url}`] : []),
    "",
  ]);

  const educationLines = about.education.map(
    (item) => `- ${item.degree} | ${item.institution} | ${item.period}`
  );

  const skillLines = [
    "### Stack principal",
    ...allTech.map((item) => `- ${item}`),
    "",
    "### Hard skills",
    ...hardSkills.map((item) => `- ${item}`),
    "",
    "### Soft skills",
    ...softSkills.map((item) => `- ${item}`),
  ];

  const sectionMap: Record<ResumeSectionId, string[]> = {
    header: [
      `# ${profile.name.toUpperCase()}`,
      `> ${profile.resumeHeadline}`,
      `${profile.location} | ${profile.email} | ${profile.website}`,
      "",
    ],
    summary: section("RESUMO", [resume.summary || profile.longBio, `- Objetivo atual: ${resume.targetRole}`]),
    experience: section("EXPERIENCIA", experienceLines),
    projects: section("PROJETOS EM DESTAQUE", projectLines),
    skills: section("HABILIDADES", skillLines),
    keywords: section("KEYWORDS", keywords.map((item) => `- ${item}`)),
    education: section("FORMACAO", educationLines),
  };

  const contentLines = resume.sections
    .filter((item) => item.enabled)
    .flatMap((item) => sectionMap[item.id] ?? []);

  return contentLines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

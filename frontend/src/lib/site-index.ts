import { fallbackProjects } from "@/content/projects";
import { publishedPublications } from "@/content/posts";
import type { ProfileSettings } from "@/lib/site-content";

export type SiteIndex = {
  projects: Array<{ slug: string; title: string; summary: string; image: string | null }>;
  posts: Array<{ slug: string; title: string; unit: number; statement: string }>;
  contact: {
    name: string;
    email: string;
    whatsapp: string;
    linkedin: string;
    github: string;
    location: string;
    availability: string;
  };
};

// Serializable snapshot of navigable content for client UI (palette, launcher).
export function buildSiteIndex(profile: ProfileSettings): SiteIndex {
  return {
    projects: fallbackProjects
      .filter((project) => project.published)
      .map((project) => ({ slug: project.slug, title: project.title, summary: project.description, image: project.image_url })),
    posts: publishedPublications.map((post) => ({ slug: post.slug, title: post.title, unit: post.unit, statement: post.statement })),
    contact: {
      name: profile.name,
      email: profile.email,
      whatsapp: profile.whatsapp,
      linkedin: profile.social.linkedin,
      github: profile.social.github,
      location: profile.location,
      availability: profile.availability,
    },
  };
}

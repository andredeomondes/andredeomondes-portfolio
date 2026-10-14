import type { MetadataRoute } from "next";
import { publishedPublications } from "@/content/posts";
import { fallbackProjects } from "@/content/projects";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/posts"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/series/javascript-core"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/projects"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/resume"), changeFrequency: "monthly", priority: 0.6 },
  ];

  const postRoutes: MetadataRoute.Sitemap = publishedPublications.map((post) => ({
    url: absoluteUrl(`/posts/${post.slug}`),
    lastModified: new Date(`${post.publishedAt}T12:00:00-03:00`),
    changeFrequency: "monthly",
    priority: 0.8,
    images: post.images.map(absoluteUrl),
  }));

  const projectRoutes: MetadataRoute.Sitemap = fallbackProjects
    .filter((project) => project.published)
    .map((project) => ({
      url: absoluteUrl(`/projects/${project.slug}`),
      lastModified: new Date(project.updated_at),
      changeFrequency: "monthly",
      priority: 0.75,
      images: project.image_url ? [absoluteUrl(project.image_url)] : undefined,
    }));

  return [...staticRoutes, ...postRoutes, ...projectRoutes];
}

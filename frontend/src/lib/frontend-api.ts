import { headers } from "next/headers";
import type { Project } from "@/types/supabase";

async function getBaseUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (configuredUrl) return configuredUrl.replace(/\/$/, "");

  const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProductionUrl) return `https://${vercelProductionUrl}`;

  const headerStore = await headers();
  const host = headerStore.get("host");

  if (!host) {
    return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  }

  const forwardedProto = headerStore.get("x-forwarded-proto");
  const protocol = forwardedProto ?? (process.env.NODE_ENV === "development" ? "http" : "https");
  return `${protocol}://${host}`;
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = await getBaseUrl();
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${path}`);
  }

  return response.json() as Promise<T>;
}

export async function getPublicSettings() {
  return fetchJson<Record<string, unknown>>("/api/settings");
}

export async function getPublicFeaturedProjects() {
  return fetchJson<Project[]>("/api/featured");
}

export async function getPublicProjects() {
  return fetchJson<Project[]>("/api/projects");
}

export async function getPublicProjectBySlug(slug: string) {
  return fetchJson<Project>(`/api/projects/${slug}`);
}

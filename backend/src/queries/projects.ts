import { adminDb } from "../lib/supabase.js";
import type { Project, ProjectInsert, ProjectUpdate } from "../types/index.js";

const TABLE = "projects";

export async function getAllProjects(): Promise<Project[]> {
  const { data, error } = await adminDb
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data as Project[];
}

export async function getPublishedProjects(): Promise<Project[]> {
  const { data, error } = await adminDb
    .from(TABLE)
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data as Project[];
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const { data, error } = await adminDb
    .from(TABLE)
    .select("*")
    .eq("featured", true)
    .eq("published", true)
    .order("featured_order", { ascending: true })
    .limit(3);
  if (error) throw new Error(error.message);
  return data as Project[];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await adminDb
    .from(TABLE)
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data as Project;
}

export async function getProjectById(id: string): Promise<Project | null> {
  const { data, error } = await adminDb
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as Project;
}

export async function getPublishedProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await adminDb
    .from(TABLE)
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();
  if (error) return null;
  return data as Project;
}

export async function createProject(input: ProjectInsert): Promise<Project> {
  const { data, error } = await adminDb
    .from(TABLE)
    .insert(input)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Project;
}

export async function updateProject(id: string, input: ProjectUpdate): Promise<Project> {
  const { data, error } = await adminDb
    .from(TABLE)
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Project;
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await adminDb.from(TABLE).delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function setFeaturedProjects(ids: string[]): Promise<void> {
  // Clear all featured
  await adminDb.from(TABLE).update({ featured: false, featured_order: null }).neq("id", "");
  // Set new featured with order
  for (let i = 0; i < ids.length; i++) {
    await adminDb
      .from(TABLE)
      .update({ featured: true, featured_order: i + 1 })
      .eq("id", ids[i]);
  }
}

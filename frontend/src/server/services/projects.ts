import { createAdminClient, createClient } from "@/lib/supabase/server";
import type { Project, ProjectInsert, ProjectUpdate } from "@/types/supabase";

const TABLE = "projects";

export async function listProjects(includeAll: boolean) {
  const supabase = await createClient();
  let query = supabase.from(TABLE).select("*").order("created_at", { ascending: false });

  if (!includeAll) {
    query = query.eq("published", true);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as Project[];
}

export async function getProjectForRequest(identifier: string, isAdmin: boolean) {
  const supabase = await createClient();
  let query = supabase.from(TABLE).select("*");

  query = isAdmin ? query.eq("id", identifier) : query.eq("slug", identifier);

  const { data, error } = await query.single();
  if (error) return null;
  return data as Project;
}

export async function createProject(input: ProjectInsert) {
  const supabase = await createAdminClient();
  const { data, error } = await supabase.from(TABLE).insert(input).select().single();
  if (error) throw new Error(error.message);
  return data as Project;
}

export async function updateProject(id: string, input: ProjectUpdate) {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Project;
}

export async function deleteProject(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function getFeaturedProjects() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("featured", true)
    .eq("published", true)
    .order("featured_order", { ascending: true })
    .limit(3);
  if (error) throw new Error(error.message);
  return (data ?? []) as Project[];
}

export async function setFeaturedProjects(ids: string[]) {
  const supabase = await createAdminClient();
  const { error: clearError } = await supabase
    .from(TABLE)
    .update({ featured: false, featured_order: null })
    .neq("id", "");
  if (clearError) throw new Error(clearError.message);

  for (let i = 0; i < ids.length; i += 1) {
    const { error } = await supabase
      .from(TABLE)
      .update({ featured: true, featured_order: i + 1 })
      .eq("id", ids[i]);
    if (error) throw new Error(error.message);
  }
}

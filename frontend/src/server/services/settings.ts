import { createAdminClient, createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { revalidateTag, unstable_cache } from "next/cache";
import type { Json, SiteSetting } from "@/types/supabase";

const TABLE = "site_settings";

export async function getSettings(): Promise<Record<string, unknown>> {
  const supabase = await createClient();
  const { data, error } = await supabase.from(TABLE).select("*");
  if (error) throw new Error(error.message);
  const out: Record<string, unknown> = {};
  for (const row of (data ?? []) as SiteSetting[]) out[row.key] = row.value;
  return out;
}

async function readPublicSettings(): Promise<Record<string, unknown>> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return {};

  const supabase = createSupabaseClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase.from(TABLE).select("*");
  if (error) throw new Error(error.message);

  const settings: Record<string, unknown> = {};
  for (const row of (data ?? []) as SiteSetting[]) settings[row.key] = row.value;
  return settings;
}

export const getCachedPublicSettings = unstable_cache(
  readPublicSettings,
  ["public-site-settings"],
  { revalidate: 300, tags: ["site-settings"] },
);

export async function upsertSettings(settings: Record<string, unknown>) {
  const supabase = await createAdminClient();
  const rows = Object.entries(settings).map(([key, value]) => ({
    key,
    value: value as Json,
    updated_at: new Date().toISOString(),
  }));
  const { error } = await supabase.from(TABLE).upsert(rows, { onConflict: "key" });
  if (error) throw new Error(error.message);
  revalidateTag("site-settings", "max");
}

import { createAdminClient, createClient } from "@/lib/supabase/server";
import type { SiteSetting } from "@/types/supabase";

const TABLE = "site_settings";

export async function getSettings(): Promise<Record<string, unknown>> {
  const supabase = await createClient();
  const { data, error } = await supabase.from(TABLE).select("*");
  if (error) throw new Error(error.message);
  const out: Record<string, unknown> = {};
  for (const row of (data ?? []) as SiteSetting[]) out[row.key] = row.value;
  return out;
}

export async function upsertSettings(settings: Record<string, unknown>) {
  const supabase = await createAdminClient();
  const rows = Object.entries(settings).map(([key, value]) => ({
    key,
    value,
    updated_at: new Date().toISOString(),
  }));
  const { error } = await supabase.from(TABLE).upsert(rows, { onConflict: "key" });
  if (error) throw new Error(error.message);
}

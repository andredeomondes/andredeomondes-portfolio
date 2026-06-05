import { adminDb } from "../lib/supabase.js";
import type { SiteSetting } from "../types/index.js";

const TABLE = "site_settings";

export async function getSettings(): Promise<Record<string, unknown>> {
  const { data, error } = await adminDb.from(TABLE).select("*");
  if (error) throw new Error(error.message);
  const out: Record<string, unknown> = {};
  for (const row of (data ?? []) as SiteSetting[]) out[row.key] = row.value;
  return out;
}

export async function upsertSettings(settings: Record<string, unknown>): Promise<void> {
  const rows = Object.entries(settings).map(([key, value]) => ({
    key,
    value,
    updated_at: new Date().toISOString(),
  }));
  const { error } = await adminDb
    .from(TABLE)
    .upsert(rows, { onConflict: "key" });
  if (error) throw new Error(error.message);
}

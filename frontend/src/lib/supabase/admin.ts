import { createClient } from "@supabase/supabase-js";

// Admin client with service role — bypasses RLS, use only in server API routes
export function createAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

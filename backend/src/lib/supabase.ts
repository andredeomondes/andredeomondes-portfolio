import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Admin client — service role, bypasses RLS. Use only in API routes.
export const adminDb = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

// Public client — anon key, respects RLS. Use in client-side or public reads.
export const publicDb = createClient(supabaseUrl, anonKey);

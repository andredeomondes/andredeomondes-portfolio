import { isAllowedAdminEmail } from "@/lib/admin-user";
import { createClient } from "@/lib/supabase/server";

export async function isAdminRequest() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return isAllowedAdminEmail(user?.email);
}

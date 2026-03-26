import { supabase } from "@/lib/supabase";

export async function requireRole(allowedRoles: string[]) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { allowed: false, reason: "not_authenticated" };
  }

  const { data, error } = await supabase
    .from("authorized_users")
    .select("role")
    .eq("email", user.email)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    return { allowed: false, reason: "not_authorized" };
  }

  if (!allowedRoles.includes(data.role)) {
    return { allowed: false, reason: "insufficient_role" };
  }

  return { allowed: true, role: data.role };
}
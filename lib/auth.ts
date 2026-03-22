import { supabase } from "@/lib/supabase";

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

export async function getAuthorizedUserByEmail(email: string) {
  const { data, error } = await supabase
    .from("authorized_users")
    .select("*")
    .eq("email", email)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}
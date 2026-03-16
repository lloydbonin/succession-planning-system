import { supabase } from "@/lib/supabase";

export async function getEmployees() {
  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching employees:", error.message);
    return [];
  }

  return data;
}
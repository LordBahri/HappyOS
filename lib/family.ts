import type { SupabaseClient } from "@supabase/supabase-js";

export async function getFamilyId(
  supabase: SupabaseClient,
  userId: string
): Promise<string | null> {
  const { data } = await supabase
    .from("family_members")
    .select("family_id")
    .eq("user_id", userId)
    .single();
  return data?.family_id ?? null;
}

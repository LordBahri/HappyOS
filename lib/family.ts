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

type FamilyResult = { familyId: string } | { error: string };

export async function getOrCreateFamilyId(
  supabase: SupabaseClient,
  userId: string
): Promise<FamilyResult> {
  const existing = await getFamilyId(supabase, userId);
  if (existing) return { familyId: existing };

  const { data, error } = await supabase.rpc("create_family_for_user");

  if (error || !data) {
    return { error: error?.message ?? "Failed to create family" };
  }

  return { familyId: data as string };
}

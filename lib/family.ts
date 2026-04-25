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

export async function getOrCreateFamilyId(
  supabase: SupabaseClient,
  userId: string
): Promise<string> {
  const existing = await getFamilyId(supabase, userId);
  if (existing) return existing;

  const { data: family, error: familyError } = await supabase
    .from("families")
    .insert({ name: "My Family" })
    .select("id")
    .single();

  if (familyError || !family) throw new Error(`Failed to create family: ${familyError?.message}`);

  await supabase
    .from("family_members")
    .insert({ family_id: family.id, user_id: userId, role: "owner" });

  return family.id;
}

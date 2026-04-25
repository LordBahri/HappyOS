"use server";

import { createClient } from "@/lib/supabase/server";
import { getOrCreateFamilyId } from "@/lib/family";
import { revalidatePath } from "next/cache";

export async function addItem(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return "Not authenticated";

  const result = await getOrCreateFamilyId(supabase, user.id);
  if ("error" in result) return result.error;

  const { error } = await supabase.from("shopping_items").insert({
    family_id: result.familyId,
    created_by: user.id,
    name: formData.get("name") as string,
  });

  if (error) return error.message;
  revalidatePath("/shopping");
  return null;
}

export async function toggleItem(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const checked = formData.get("checked") === "true";

  await supabase
    .from("shopping_items")
    .update({ checked: !checked })
    .eq("id", id);

  revalidatePath("/shopping");
}

export async function deleteItem(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  await supabase.from("shopping_items").delete().eq("id", id);

  revalidatePath("/shopping");
}

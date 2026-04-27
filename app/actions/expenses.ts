"use server";

import { createClient } from "@/lib/supabase/server";
import { getOrCreateFamilyId } from "@/lib/family";
import { revalidatePath } from "next/cache";

export async function addExpense(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return "Not authenticated";

  const result = await getOrCreateFamilyId(supabase, user.id);
  if (result.error) return result.error;

  const { error } = await supabase.from("expenses").insert({
    family_id: result.familyId,
    created_by: user.id,
    title: formData.get("title") as string,
    amount: parseFloat(formData.get("amount") as string),
    category: formData.get("category") as string,
    date: formData.get("date") as string,
    member: (formData.get("member") as string) || null,
    payment_method: (formData.get("payment_method") as string) || null,
    tags: (formData.get("tags") as string) || null,
    notes: (formData.get("notes") as string) || null,
  });

  if (error) return error.message;
  revalidatePath("/expenses");
  return null;
}

export async function deleteExpense(id: string): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return "Not authenticated";

  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id)
    .eq("created_by", user.id);

  if (error) return error.message;
  revalidatePath("/expenses");
  return null;
}

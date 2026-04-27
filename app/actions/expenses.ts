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
  if ("error" in result) return result.error;

  const rawTags = (formData.get("tags") as string) ?? "";
  const tags = rawTags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const { error } = await supabase.from("expenses").insert({
    family_id: result.familyId,
    created_by: user.id,
    title: formData.get("title") as string,
    amount: parseFloat(formData.get("amount") as string),
    category: (formData.get("category") as string) || null,
    currency: (formData.get("currency") as string) || "USD",
    date: formData.get("date") as string,
    notes: (formData.get("notes") as string) || null,
    tags,
    is_recurring: formData.get("is_recurring") === "on",
    member: (formData.get("member") as string) || null,
    payment_method: (formData.get("payment_method") as string) || null,
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

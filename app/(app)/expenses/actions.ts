"use server";

import { createClient } from "@/lib/supabase/server";
import { getFamilyId } from "@/lib/family";
import { revalidatePath } from "next/cache";

export async function addExpense(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return "Not authenticated";

  const familyId = await getFamilyId(supabase, user.id);
  if (!familyId) return "No family found";

  const { error } = await supabase.from("expenses").insert({
    family_id: familyId,
    created_by: user.id,
    title: formData.get("title") as string,
    amount: parseFloat(formData.get("amount") as string),
    category: formData.get("category") as string,
    date: formData.get("date") as string,
  });

  if (error) return error.message;
  revalidatePath("/expenses");
  return null;
}

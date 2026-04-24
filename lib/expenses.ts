import type { SupabaseClient } from "@supabase/supabase-js";
import type { Expense } from "@/types";

export const CATEGORIES = [
  "Food",
  "Transport",
  "Utilities",
  "Entertainment",
  "Health",
  "Other",
] as const;

export async function getExpenses(
  supabase: SupabaseClient,
  familyId: string,
  month: string // "YYYY-MM"
): Promise<Expense[]> {
  const [year, m] = month.split("-").map(Number);
  const from = `${year}-${String(m).padStart(2, "0")}-01`;
  const lastDay = new Date(year, m, 0).getDate();
  const to = `${year}-${String(m).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

  const { data } = await supabase
    .from("expenses")
    .select("*")
    .eq("family_id", familyId)
    .gte("date", from)
    .lte("date", to)
    .order("date", { ascending: false });

  return (data as Expense[]) ?? [];
}

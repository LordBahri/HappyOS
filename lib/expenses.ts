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

export type Category = (typeof CATEGORIES)[number];

export const PAYMENT_METHODS = [
  "Cash",
  "Credit Card",
  "Debit Card",
  "Bank Transfer",
  "Other",
] as const;

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; hex: string }> = {
  Food:          { bg: "bg-orange-100",  text: "text-orange-700",  hex: "#f97316" },
  Transport:     { bg: "bg-blue-100",    text: "text-blue-700",    hex: "#3b82f6" },
  Utilities:     { bg: "bg-yellow-100",  text: "text-yellow-700",  hex: "#eab308" },
  Entertainment: { bg: "bg-violet-100",  text: "text-violet-700",  hex: "#8b5cf6" },
  Health:        { bg: "bg-emerald-100", text: "text-emerald-700", hex: "#10b981" },
  Other:         { bg: "bg-gray-100",    text: "text-gray-500",    hex: "#6b7280" },
};

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

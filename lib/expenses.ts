import type { SupabaseClient } from "@supabase/supabase-js";
import type { Expense, MonthSummary } from "@/types";

export const CATEGORIES = [
  "Food",
  "Transport",
  "Utilities",
  "Entertainment",
  "Health",
  "Other",
] as const;

export function currentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function previousMonth(month: string): string {
  const [year, m] = month.split("-").map(Number);
  const d = new Date(year, m - 2, 1); // m-2 handles year wrap correctly
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function percentChange(current: number, prev: number): number | null {
  if (prev === 0) return null;
  return ((current - prev) / prev) * 100;
}

function monthDateRange(month: string): { from: string; to: string } {
  const [year, m] = month.split("-").map(Number);
  const from = `${year}-${String(m).padStart(2, "0")}-01`;
  const lastDay = new Date(year, m, 0).getDate();
  const to = `${year}-${String(m).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  return { from, to };
}

// ── Queries ──────────────────────────────────────────────────────────────────

export async function getExpenses(
  supabase: SupabaseClient,
  familyId: string,
  month: string
): Promise<Expense[]> {
  const { from, to } = monthDateRange(month);
  const { data } = await supabase
    .from("expenses")
    .select("*")
    .eq("family_id", familyId)
    .gte("date", from)
    .lte("date", to)
    .order("date", { ascending: false });
  return (data as Expense[]) ?? [];
}

// ── Pure aggregations ─────────────────────────────────────────────────────────

export function getCategoryTotals(expenses: Expense[]): Record<string, number> {
  return expenses.reduce<Record<string, number>>((acc, e) => {
    const cat = e.category ?? "Other";
    acc[cat] = (acc[cat] ?? 0) + Number(e.amount);
    return acc;
  }, {});
}

export function getMonthSummary(expenses: Expense[]): MonthSummary {
  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const recurringTotal = expenses
    .filter((e) => e.is_recurring)
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const byCategory = getCategoryTotals(expenses);
  const byCurrency = expenses.reduce<Record<string, number>>((acc, e) => {
    const cur = e.currency ?? "USD";
    acc[cur] = (acc[cur] ?? 0) + Number(e.amount);
    return acc;
  }, {});
  return { total, count: expenses.length, recurringTotal, byCategory, byCurrency };
}

// ── Recurring expenses service ────────────────────────────────────────────────

export async function applyRecurringExpenses(
  supabase: SupabaseClient,
  familyId: string,
  userId: string,
  month: string
): Promise<number> {
  const { from } = monthDateRange(month);

  // Latest instance per title across all time
  const { data: all } = await supabase
    .from("expenses")
    .select("title, amount, category, currency, notes, tags")
    .eq("family_id", familyId)
    .eq("is_recurring", true)
    .order("date", { ascending: false });

  if (!all?.length) return 0;

  const templates = Object.values(
    (all as Expense[]).reduce<Record<string, Expense>>((acc, e) => {
      if (!acc[e.title]) acc[e.title] = e;
      return acc;
    }, {})
  );

  // Which recurring titles already exist this month
  const monthExpenses = await getExpenses(supabase, familyId, month);
  const existing = new Set(
    monthExpenses.filter((e) => e.is_recurring).map((e) => e.title)
  );

  const toInsert = templates
    .filter((t) => !existing.has(t.title))
    .map((t) => ({
      family_id: familyId,
      created_by: userId,
      title: t.title,
      amount: t.amount,
      category: t.category,
      currency: t.currency ?? "USD",
      notes: t.notes,
      tags: t.tags ?? [],
      is_recurring: true,
      date: from,
    }));

  if (!toInsert.length) return 0;

  await supabase.from("expenses").insert(toInsert);
  return toInsert.length;
}

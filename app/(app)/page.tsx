import { getSessionContext } from "@/lib/session";
import {
  getExpenses,
  getMonthSummary,
  currentMonth,
  previousMonth,
  percentChange,
} from "@/lib/expenses";
import type { ShoppingItem } from "@/types";
import StatCard from "@/components/dashboard/StatCard";
import CategoryBreakdown from "@/components/dashboard/CategoryBreakdown";
import RecentExpenses from "@/components/dashboard/RecentExpenses";
import ShoppingPreview from "@/components/dashboard/ShoppingPreview";

export default async function DashboardPage() {
  const ctx = await getSessionContext();
  if ("error" in ctx) return <p className="text-sm text-red-500">{ctx.error}</p>;

  const { supabase, familyId } = ctx;
  const month = currentMonth();
  const prevMonth = previousMonth(month);

  // Columns: enough for getMonthSummary + RecentExpenses; skip notes/tags/updated_at
  const EXPENSE_COLS = "id,title,amount,category,currency,is_recurring";

  const [expenses, prevExpenses, shoppingRes] = await Promise.all([
    getExpenses(supabase, familyId, month, EXPENSE_COLS),
    getExpenses(supabase, familyId, prevMonth, EXPENSE_COLS),
    supabase
      .from("shopping_items")
      .select("id,name")
      .eq("family_id", familyId)
      .eq("checked", false)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const summary = getMonthSummary(expenses);
  const prevSummary = getMonthSummary(prevExpenses);
  const totalTrend = percentChange(summary.total, prevSummary.total);
  const shopping = (shoppingRes.data as ShoppingItem[]) ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Month total"
          value={`$${summary.total.toFixed(2)}`}
          trend={totalTrend}
          sub={prevSummary.total > 0 ? `$${prevSummary.total.toFixed(2)} last mo` : undefined}
          icon={
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
              <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
            </svg>
          }
        />
        <StatCard
          label="Transactions"
          value={String(summary.count)}
          icon={
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
        <StatCard
          label="To buy"
          value={String(shopping.length)}
          icon={
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><path d="M3 6h18" />
            </svg>
          }
        />
        <StatCard
          label="Recurring"
          value={`$${summary.recurringTotal.toFixed(2)}`}
          icon={
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
              <path d="M23 4v6h-6M1 20v-6h6" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
            </svg>
          }
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <CategoryBreakdown
          byCategory={summary.byCategory}
          total={summary.total}
          prevByCategory={prevSummary.byCategory}
        />
        <RecentExpenses expenses={expenses.slice(0, 5)} />
      </div>

      <ShoppingPreview items={shopping} />
    </div>
  );
}

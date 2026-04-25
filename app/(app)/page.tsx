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
          sub={
            prevSummary.total > 0
              ? `$${prevSummary.total.toFixed(2)} last mo`
              : undefined
          }
        />
        <StatCard label="Transactions" value={String(summary.count)} />
        <StatCard label="To buy" value={String(shopping.length)} />
        <StatCard
          label="Recurring"
          value={`$${summary.recurringTotal.toFixed(2)}`}
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

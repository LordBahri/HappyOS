import { getSessionContext } from "@/lib/session";
import { getExpenses, currentMonth } from "@/lib/expenses";
import type { ShoppingItem } from "@/types";
import StatCard from "@/components/dashboard/StatCard";
import CategoryBreakdown from "@/components/dashboard/CategoryBreakdown";
import RecentExpenses from "@/components/dashboard/RecentExpenses";
import ShoppingPreview from "@/components/dashboard/ShoppingPreview";

export default async function DashboardPage() {
  const ctx = await getSessionContext();
  if ("error" in ctx) return <p className="text-sm text-red-500">{ctx.error}</p>;

  const { supabase, familyId } = ctx;

  const [expenses, shoppingRes] = await Promise.all([
    getExpenses(supabase, familyId, currentMonth()),
    supabase
      .from("shopping_items")
      .select("*")
      .eq("family_id", familyId)
      .eq("checked", false)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const byCategory = expenses.reduce<Record<string, number>>((acc, e) => {
    const cat = e.category ?? "Other";
    acc[cat] = (acc[cat] ?? 0) + Number(e.amount);
    return acc;
  }, {});

  const shopping = (shoppingRes.data as ShoppingItem[]) ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Month total" value={`$${total.toFixed(2)}`} />
        <StatCard label="Transactions" value={String(expenses.length)} />
        <StatCard label="To buy" value={String(shopping.length)} />
        <StatCard label="Categories" value={String(Object.keys(byCategory).length)} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <CategoryBreakdown byCategory={byCategory} total={total} />
        <RecentExpenses expenses={expenses.slice(0, 5)} />
      </div>

      <ShoppingPreview items={shopping} />
    </div>
  );
}

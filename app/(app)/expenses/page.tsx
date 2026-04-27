import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateFamilyId } from "@/lib/family";
import { getExpenses } from "@/lib/expenses";
import MonthFilter from "@/components/expenses/MonthFilter";
import StatsCards from "@/components/expenses/StatsCards";
import ExpenseForm from "@/components/expenses/ExpenseForm";
import DonutChart from "@/components/expenses/DonutChart";
import ExpenseList from "@/components/expenses/ExpenseList";

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const result = await getOrCreateFamilyId(supabase, user.id);
  if (result.error) {
    return (
      <div className="space-y-1">
        <p className="text-sm font-medium text-red-500">Failed to load family</p>
        <p className="text-xs text-gray-400">{result.error}</p>
      </div>
    );
  }

  const { month: rawMonth } = await searchParams;
  const month = rawMonth ?? currentMonth();
  const expenses = await getExpenses(supabase, result.familyId, month);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="mt-0.5 text-sm text-gray-500">Track and manage your household spending</p>
        </div>
        <MonthFilter value={month} />
      </div>

      {/* Stats */}
      <StatsCards expenses={expenses} month={month} />

      {/* Form + Chart */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-base font-semibold text-gray-900">Add Expense</h2>
          <ExpenseForm />
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-base font-semibold text-gray-900">Spending by Category</h2>
          <DonutChart expenses={expenses} />
        </div>
      </div>

      {/* Transactions */}
      <div>
        <h2 className="mb-3 text-base font-semibold text-gray-900">Transactions</h2>
        <ExpenseList expenses={expenses} />
      </div>
    </div>
  );
}

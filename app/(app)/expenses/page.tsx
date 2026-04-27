import { getSessionContext } from "@/lib/session";
import { getExpenses, currentMonth } from "@/lib/expenses";
import MonthFilter from "@/components/expenses/MonthFilter";
import StatsCards from "@/components/expenses/StatsCards";
import ExpenseForm from "@/components/expenses/ExpenseForm";
import DonutChart from "@/components/expenses/DonutChart";
import ExpenseList from "@/components/expenses/ExpenseList";

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const ctx = await getSessionContext();
  if ("error" in ctx) return <p className="text-sm text-red-500">{ctx.error}</p>;

  const { supabase, familyId } = ctx;
  const { month: rawMonth } = await searchParams;
  const month = rawMonth ?? currentMonth();
  const expenses = await getExpenses(supabase, familyId, month);

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

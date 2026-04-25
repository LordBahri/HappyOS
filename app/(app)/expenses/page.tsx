import { getSessionContext } from "@/lib/session";
import { getExpenses, currentMonth } from "@/lib/expenses";
import ExpenseForm from "@/components/expenses/ExpenseForm";
import ExpenseList from "@/components/expenses/ExpenseList";
import MonthFilter from "@/components/expenses/MonthFilter";

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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Expenses</h1>
        <MonthFilter value={month} />
      </div>
      <ExpenseForm />
      <ExpenseList expenses={expenses} />
    </div>
  );
}

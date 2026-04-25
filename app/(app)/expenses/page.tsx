import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateFamilyId } from "@/lib/family";
import { getExpenses } from "@/lib/expenses";
import ExpenseForm from "@/components/expenses/ExpenseForm";
import ExpenseList from "@/components/expenses/ExpenseList";
import MonthFilter from "@/components/expenses/MonthFilter";

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
        <p className="text-xs text-neutral-400">{result.error}</p>
      </div>
    );
  }

  const { month: rawMonth } = await searchParams;
  const month = rawMonth ?? currentMonth();

  const expenses = await getExpenses(supabase, result.familyId, month);

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

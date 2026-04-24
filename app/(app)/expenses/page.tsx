import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getFamilyId } from "@/lib/family";
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

  const familyId = await getFamilyId(supabase, user.id);
  if (!familyId) {
    return (
      <p className="text-sm text-neutral-500">
        No family found. Please sign out and sign up again to create one.
      </p>
    );
  }

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

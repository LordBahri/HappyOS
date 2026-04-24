import type { Expense } from "@/types";

export default function ExpenseList({ expenses }: { expenses: Expense[] }) {
  if (!expenses.length) {
    return <p className="text-sm text-neutral-400">No expenses this month.</p>;
  }

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm text-neutral-500">
        <span>{expenses.length} expenses</span>
        <span className="font-medium text-neutral-900">
          Total: ${total.toFixed(2)}
        </span>
      </div>
      <ul className="divide-y divide-neutral-100 rounded-md border border-neutral-200 bg-white">
        {expenses.map((e) => (
          <li key={e.id} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{e.title}</span>
              {e.category && (
                <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">
                  {e.category}
                </span>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">${Number(e.amount).toFixed(2)}</p>
              <p className="text-xs text-neutral-400">{e.date}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

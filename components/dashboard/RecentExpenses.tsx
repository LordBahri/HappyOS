import type { Expense } from "@/types";

export default function RecentExpenses({ expenses }: { expenses: Expense[] }) {
  return (
    <div className="space-y-3 rounded-md border border-neutral-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium">Recent expenses</h2>
        <a href="/expenses" className="text-xs text-neutral-400 hover:text-neutral-700">
          View all →
        </a>
      </div>
      {expenses.length === 0 ? (
        <p className="text-sm text-neutral-400">No expenses yet</p>
      ) : (
        <ul className="divide-y divide-neutral-100">
          {expenses.map((e) => (
            <li key={e.id} className="flex items-center justify-between py-2 text-sm">
              <div>
                <span>{e.title}</span>
                {e.category && (
                  <span className="ml-2 text-xs text-neutral-400">{e.category}</span>
                )}
              </div>
              <span className="font-medium">${Number(e.amount).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

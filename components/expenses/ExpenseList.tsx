import type { Expense } from "@/types";

const BADGE: Record<string, string> = {
  Food:          "bg-emerald-50 text-emerald-700",
  Transport:     "bg-blue-50 text-blue-700",
  Utilities:     "bg-amber-50 text-amber-700",
  Entertainment: "bg-purple-50 text-purple-700",
  Health:        "bg-rose-50 text-rose-700",
  Other:         "bg-slate-100 text-slate-600",
};

export default function ExpenseList({ expenses }: { expenses: Expense[] }) {
  if (!expenses.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
        <p className="text-sm text-slate-400">No expenses this month</p>
      </div>
    );
  }

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs text-slate-400">{expenses.length} expenses</span>
        <span className="text-sm font-semibold text-slate-800">
          Total: ${total.toFixed(2)}
        </span>
      </div>

      <div className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
        <ul className="divide-y divide-slate-50">
          {expenses.map((e) => (
            <li
              key={e.id}
              className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/60 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{e.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{e.date}</p>
              </div>

              <div className="flex items-center gap-2.5 flex-shrink-0">
                {e.is_recurring && (
                  <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600">
                    recurring
                  </span>
                )}
                {e.category && (
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${BADGE[e.category] ?? BADGE.Other}`}>
                    {e.category}
                  </span>
                )}
                <span className="text-sm font-semibold text-slate-900 tabular-nums w-20 text-right">
                  ${Number(e.amount).toFixed(2)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

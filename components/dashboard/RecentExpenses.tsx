import Link from "next/link";
import type { Expense } from "@/types";

const CATEGORY_DOT: Record<string, string> = {
  Food:          "bg-emerald-500",
  Transport:     "bg-blue-500",
  Utilities:     "bg-amber-500",
  Entertainment: "bg-purple-500",
  Health:        "bg-rose-500",
  Other:         "bg-slate-400",
};

export default function RecentExpenses({ expenses }: { expenses: Expense[] }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Recent expenses
        </h2>
        <Link
          href="/expenses"
          className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          View all →
        </Link>
      </div>
      {expenses.length === 0 ? (
        <p className="text-sm text-slate-400">No expenses yet</p>
      ) : (
        <ul className="space-y-0.5">
          {expenses.map((e) => (
            <li
              key={e.id}
              className="flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-slate-50 transition-colors"
            >
              <span
                className={`h-2 w-2 rounded-full flex-shrink-0 ${
                  CATEGORY_DOT[e.category ?? "Other"] ?? "bg-slate-400"
                }`}
              />
              <span className="flex-1 text-sm text-slate-700 truncate">{e.title}</span>
              <span className="text-sm font-semibold text-slate-900 tabular-nums">
                ${Number(e.amount).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

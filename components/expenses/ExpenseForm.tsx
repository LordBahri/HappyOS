"use client";

import { useActionState } from "react";
import { addExpense } from "@/app/actions/expenses";
import { CATEGORIES } from "@/lib/expenses";

const INPUT = "rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors";

export default function ExpenseForm() {
  const [error, action, pending] = useActionState(addExpense, null);
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-4">
        Add expense
      </h2>
      <form action={action} className="flex flex-wrap gap-2.5">
        <input
          name="title"
          placeholder="Description"
          required
          className={`${INPUT} flex-1 min-w-40`}
        />
        <input
          name="amount"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          required
          className={`${INPUT} w-28`}
        />
        <select
          name="category"
          required
          className={`${INPUT} cursor-pointer`}
        >
          <option value="">Category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          name="date"
          type="date"
          defaultValue={today}
          required
          className={`${INPUT}`}
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 transition-colors"
        >
          {pending ? "Adding…" : "Add"}
        </button>
      </form>
      {error && (
        <p className="mt-2.5 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

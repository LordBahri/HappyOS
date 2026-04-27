"use client";

import { useActionState } from "react";
import { addExpense } from "@/app/actions/expenses";
import { CATEGORIES, PAYMENT_METHODS } from "@/lib/expenses";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100";

const labelClass = "mb-1 block text-xs font-medium text-gray-600";

export default function ExpenseForm() {
  const [error, action, pending] = useActionState(addExpense, null);
  const today = new Date().toISOString().split("T")[0];

  return (
    <form action={action} className="space-y-4">
      {/* Row 1: Title */}
      <div>
        <label className={labelClass}>Title</label>
        <input
          name="title"
          placeholder="e.g. Grocery run"
          required
          className={inputClass}
        />
      </div>

      {/* Row 2: Amount + Date */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Amount</label>
          <input
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Date</label>
          <input
            name="date"
            type="date"
            defaultValue={today}
            required
            className={inputClass}
          />
        </div>
      </div>

      {/* Row 3: Category + Member + Payment */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Category</label>
          <select name="category" required className={inputClass}>
            <option value="">Select…</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Member</label>
          <input
            name="member"
            placeholder="e.g. John"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Payment Method</label>
          <select name="payment_method" className={inputClass}>
            <option value="">Select…</option>
            {PAYMENT_METHODS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 4: Tags + Notes */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Tags</label>
          <input
            name="tags"
            placeholder="e.g. weekly, work"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Notes</label>
          <textarea
            name="notes"
            rows={2}
            placeholder="Optional notes…"
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between">
        {error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : (
          <span />
        )}
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50"
        >
          {pending ? "Adding…" : "Add Expense"}
        </button>
      </div>
    </form>
  );
}

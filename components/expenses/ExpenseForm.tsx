"use client";

import { useActionState } from "react";
import { addExpense } from "@/app/actions/expenses";
import { CATEGORIES, PAYMENT_METHODS, CURRENCIES } from "@/lib/expenses";

const INPUT =
  "w-full rounded-xl border border-line bg-surface-raised px-4 py-2.5 text-sm outline-none transition focus:border-primary-400 focus:bg-surface focus:ring-2 focus:ring-interactive-ring";

const LABEL = "mb-1 block text-xs font-medium text-fg-muted";

export default function ExpenseForm() {
  const [error, action, pending] = useActionState(addExpense, null);
  const today = new Date().toISOString().split("T")[0];

  return (
    <form action={action} className="space-y-4">
      {/* Title */}
      <div>
        <label className={LABEL}>Title</label>
        <input
          name="title"
          placeholder="e.g. Grocery run"
          required
          className={INPUT}
        />
      </div>

      {/* Amount + Currency + Date */}
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-1">
          <label className={LABEL}>Amount</label>
          <input
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            required
            className={INPUT}
          />
        </div>
        <div>
          <label className={LABEL}>Currency</label>
          <select name="currency" className={INPUT}>
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={LABEL}>Date</label>
          <input
            name="date"
            type="date"
            defaultValue={today}
            required
            className={INPUT}
          />
        </div>
      </div>

      {/* Category + Member + Payment */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label className={LABEL}>Category</label>
          <select name="category" className={INPUT}>
            <option value="">Select…</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={LABEL}>Member</label>
          <input
            name="member"
            placeholder="e.g. John"
            className={INPUT}
          />
        </div>
        <div>
          <label className={LABEL}>Payment Method</label>
          <select name="payment_method" className={INPUT}>
            <option value="">Select…</option>
            {PAYMENT_METHODS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tags + Notes */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className={LABEL}>Tags</label>
          <input
            name="tags"
            placeholder="e.g. weekly, work"
            className={INPUT}
          />
        </div>
        <div>
          <label className={LABEL}>Notes</label>
          <textarea
            name="notes"
            rows={2}
            placeholder="Optional notes…"
            className={`${INPUT} resize-none`}
          />
        </div>
      </div>

      {/* Recurring + Submit */}
      <div className="flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-fg-muted select-none">
          <input
            name="is_recurring"
            type="checkbox"
            className="h-4 w-4 rounded border-line accent-interactive"
          />
          Recurring expense
        </label>
        <div className="flex items-center gap-3">
          {error && <p className="text-sm text-danger">{error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-interactive px-6 py-2.5 text-sm font-medium text-fg-inverse transition hover:bg-interactive-hover active:bg-interactive-active disabled:opacity-50"
          >
            {pending ? "Adding…" : "Add Expense"}
          </button>
        </div>
      </div>
    </form>
  );
}

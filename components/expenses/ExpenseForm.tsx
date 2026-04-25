"use client";

import { useActionState } from "react";
import { addExpense } from "@/app/actions/expenses";
import { CATEGORIES } from "@/lib/expenses";

export default function ExpenseForm() {
  const [error, action, pending] = useActionState(addExpense, null);
  const today = new Date().toISOString().split("T")[0];

  return (
    <form action={action} className="flex flex-wrap gap-2">
      <input
        name="title"
        placeholder="Title"
        required
        className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500"
      />
      <input
        name="amount"
        type="number"
        step="0.01"
        min="0.01"
        placeholder="Amount"
        required
        className="w-28 rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500"
      />
      <select
        name="category"
        required
        className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500"
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
        className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-700 disabled:opacity-50"
      >
        {pending ? "Adding…" : "Add"}
      </button>
      {error && <p className="w-full text-sm text-red-500">{error}</p>}
    </form>
  );
}

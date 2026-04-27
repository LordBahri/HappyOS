"use client";

import { useActionState } from "react";
import { addItem } from "@/app/actions/shopping";

export default function AddItemForm() {
  const [error, action, pending] = useActionState(addItem, null);

  return (
    <div>
      <form action={action} className="flex gap-2.5">
        <input
          name="name"
          placeholder="Add item…"
          required
          className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors"
        />
        <button
          type="submit"
          disabled={pending}
          className="flex-shrink-0 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 transition-colors"
        >
          {pending ? "Adding…" : "Add"}
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}

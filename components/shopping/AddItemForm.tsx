"use client";

import { useActionState } from "react";
import { addItem } from "@/app/actions/shopping";

export default function AddItemForm() {
  const [error, action, pending] = useActionState(addItem, null);

  return (
    <form action={action} className="flex gap-2">
      <input
        name="name"
        placeholder="Add item…"
        required
        className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500"
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

import Link from "next/link";
import type { ShoppingItem } from "@/types";

export default function ShoppingPreview({ items }: { items: ShoppingItem[] }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Shopping list
        </h2>
        <Link
          href="/shopping"
          className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          View all →
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-slate-400">Nothing to buy</p>
      ) : (
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-2.5 rounded-xl px-2 py-2 hover:bg-slate-50 transition-colors">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
              <span className="text-sm text-slate-700">{item.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

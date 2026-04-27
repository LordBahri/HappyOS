import type { ShoppingItem } from "@/types";
import { toggleItem, deleteItem } from "@/app/actions/shopping";

export default function ShoppingList({ items }: { items: ShoppingItem[] }) {
  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
        <p className="text-sm text-slate-400">Nothing on the list yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
      <ul className="divide-y divide-slate-50">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-3.5 px-5 py-3.5 hover:bg-slate-50/60 transition-colors"
          >
            {/* Toggle */}
            <form action={toggleItem}>
              <input type="hidden" name="id" value={item.id} />
              <input type="hidden" name="checked" value={String(item.checked)} />
              <button
                type="submit"
                className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border transition-colors ${
                  item.checked
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-slate-300 hover:border-indigo-400"
                }`}
              >
                {item.checked && (
                  <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 6l3 3 5-5" />
                  </svg>
                )}
              </button>
            </form>

            {/* Label */}
            <span
              className={`flex-1 text-sm transition-colors ${
                item.checked ? "text-slate-400 line-through" : "text-slate-700"
              }`}
            >
              {item.name}
            </span>

            {/* Delete */}
            <form action={deleteItem}>
              <input type="hidden" name="id" value={item.id} />
              <button
                type="submit"
                className="flex-shrink-0 rounded-lg p-1 text-slate-300 hover:bg-red-50 hover:text-red-400 transition-colors"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M4.47 4.47a.75.75 0 011.06 0L8 6.94l2.47-2.47a.75.75 0 111.06 1.06L9.06 8l2.47 2.47a.75.75 0 11-1.06 1.06L8 9.06l-2.47 2.47a.75.75 0 01-1.06-1.06L6.94 8 4.47 5.53a.75.75 0 010-1.06z" />
                </svg>
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}

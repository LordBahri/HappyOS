import type { ShoppingItem } from "@/types";
import { toggleItem, deleteItem } from "@/app/actions/shopping";

export default function ShoppingList({ items }: { items: ShoppingItem[] }) {
  if (!items.length) {
    return <p className="text-sm text-neutral-400">No items on the list.</p>;
  }

  return (
    <ul className="divide-y divide-neutral-100 rounded-md border border-neutral-200 bg-white">
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-3 px-4 py-3">
          <form action={toggleItem}>
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="checked" value={String(item.checked)} />
            <button
              type="submit"
              className="flex h-5 w-5 items-center justify-center rounded border border-neutral-300 text-neutral-900 hover:border-neutral-500"
            >
              {item.checked && "✓"}
            </button>
          </form>

          <span className={`flex-1 text-sm ${item.checked ? "text-neutral-400 line-through" : ""}`}>
            {item.name}
          </span>

          <form action={deleteItem}>
            <input type="hidden" name="id" value={item.id} />
            <button
              type="submit"
              className="text-neutral-300 hover:text-red-400"
            >
              ✕
            </button>
          </form>
        </li>
      ))}
    </ul>
  );
}

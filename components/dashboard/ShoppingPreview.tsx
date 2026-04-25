import type { ShoppingItem } from "@/types";

export default function ShoppingPreview({ items }: { items: ShoppingItem[] }) {
  return (
    <div className="space-y-3 rounded-md border border-neutral-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium">Shopping list</h2>
        <a href="/shopping" className="text-xs text-neutral-400 hover:text-neutral-700">
          View all →
        </a>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-neutral-400">Nothing to buy</p>
      ) : (
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.id} className="text-sm text-neutral-700">
              · {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

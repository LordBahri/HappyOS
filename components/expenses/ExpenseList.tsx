"use client";

import { useState, useTransition } from "react";
import type { Expense } from "@/types";
import { CATEGORY_COLORS } from "@/lib/expenses";
import { deleteExpense } from "@/app/actions/expenses";

function CategoryBadge({ category }: { category: string | null }) {
  if (!category) return null;
  const colors = CATEGORY_COLORS[category] ?? { bg: "bg-gray-100", text: "text-gray-500" };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}>
      {category}
    </span>
  );
}

function MemberCell({ member }: { member?: string | null }) {
  const initials = member ? member.slice(0, 2).toUpperCase() : "?";
  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
          member ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-400"
        }`}
      >
        {initials}
      </span>
      {member && <span className="text-sm text-gray-600">{member}</span>}
    </div>
  );
}

function ActionsMenu({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteExpense(id);
      setOpen(false);
    });
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        aria-label="Actions"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="5" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="19" r="1.5" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 w-36 rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
            <button
              onClick={handleDelete}
              disabled={pending}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-50"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
              {pending ? "Deleting…" : "Delete"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function ExpenseList({ expenses }: { expenses: Expense[] }) {
  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
        <div className="mb-3 rounded-2xl bg-gray-100 p-4">
          <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 21Z" />
          </svg>
        </div>
        <p className="font-medium text-gray-700">No expenses yet</p>
        <p className="mt-1 text-sm text-gray-400">Add your first expense using the form above.</p>
      </div>
    );
  }

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {expenses.length} transaction{expenses.length !== 1 ? "s" : ""}
        </p>
        <p className="text-sm font-semibold text-gray-900">Total: ${total.toFixed(2)}</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Description
              </th>
              <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:table-cell">
                Category
              </th>
              <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 md:table-cell">
                Member
              </th>
              <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 lg:table-cell">
                Method
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500">
                Amount
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500">
                Date
              </th>
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {expenses.map((e) => (
              <tr key={e.id} className="transition-colors hover:bg-gray-50/80">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{e.title}</p>
                    {e.is_recurring && (
                      <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600">
                        recurring
                      </span>
                    )}
                  </div>
                  {e.notes && (
                    <p className="mt-0.5 max-w-[200px] truncate text-xs text-gray-400">{e.notes}</p>
                  )}
                  {e.tags.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {e.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  <CategoryBadge category={e.category} />
                </td>
                <td className="hidden px-4 py-3 md:table-cell">
                  <MemberCell member={e.member} />
                </td>
                <td className="hidden px-4 py-3 lg:table-cell">
                  {e.payment_method ? (
                    <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                      {e.payment_method}
                    </span>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="font-semibold text-gray-900">
                    {e.currency !== "USD" && (
                      <span className="mr-0.5 text-xs text-gray-400">{e.currency}</span>
                    )}
                    ${Number(e.amount).toFixed(2)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-xs text-gray-400">{e.date}</span>
                </td>
                <td className="px-3 py-3">
                  <ActionsMenu id={e.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

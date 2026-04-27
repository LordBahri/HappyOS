"use client";

import { useState, useTransition } from "react";
import type { Expense } from "@/types";
import { CATEGORY_COLORS } from "@/lib/expenses";
import { deleteExpense } from "@/app/actions/expenses";

// ── Sub-components ────────────────────────────────────────────────────────────

function CategoryBadge({ category }: { category: string | null }) {
  if (!category) return <span className="text-neutral-300">—</span>;
  const c = CATEGORY_COLORS[category] ?? { bg: "bg-neutral-100", text: "text-fg-muted" };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${c.bg} ${c.text}`}>
      {category}
    </span>
  );
}

function MemberAvatar({ member }: { member?: string | null }) {
  if (!member) return <span className="text-neutral-300">—</span>;
  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
        {member.slice(0, 2).toUpperCase()}
      </span>
      <span className="text-sm text-fg">{member}</span>
    </div>
  );
}

function AmountCell({ amount, currency }: { amount: number; currency: string }) {
  return (
    <span className="font-semibold tabular-nums text-success">
      {currency !== "USD" && (
        <span className="mr-0.5 text-xs font-normal text-fg-subtle">{currency}</span>
      )}
      ${amount.toFixed(2)}
    </span>
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
        className="rounded-lg p-1.5 text-neutral-300 opacity-0 transition group-hover:opacity-100 hover:bg-neutral-100 hover:text-fg-muted focus:opacity-100"
        aria-label="Row actions"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="5"  r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="19" r="1.5" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 w-40 rounded-xl border border-line bg-surface py-1 shadow-lg ring-1 ring-black/5">
            <button
              onClick={handleDelete}
              disabled={pending}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-danger transition hover:bg-danger/5 disabled:opacity-50"
            >
              <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-surface py-16 text-center">
      <div className="mb-3 rounded-2xl bg-neutral-100 p-4">
        <svg className="h-7 w-7 text-fg-subtle" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 21Z" />
        </svg>
      </div>
      <p className="text-sm font-medium text-fg">No expenses yet</p>
      <p className="mt-1 text-xs text-fg-subtle">Add your first expense using the form above.</p>
    </div>
  );
}

// ── Table ─────────────────────────────────────────────────────────────────────

const TH = "px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-fg-subtle";

export default function ExpenseList({ expenses }: { expenses: Expense[] }) {
  if (expenses.length === 0) return <EmptyState />;

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-0.5">
        <p className="text-xs text-fg-subtle">
          {expenses.length} transaction{expenses.length !== 1 ? "s" : ""}
        </p>
        <p className="text-sm font-semibold tabular-nums text-fg">
          Total: <span className="text-success">${total.toFixed(2)}</span>
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-line bg-surface-raised/80">
            <tr>
              <th className={TH}>Description</th>
              <th className={`${TH} hidden sm:table-cell`}>Category</th>
              <th className={`${TH} hidden md:table-cell`}>Member</th>
              <th className={`${TH} hidden lg:table-cell`}>Method</th>
              <th className={`${TH} text-right`}>Amount</th>
              <th className={`${TH} text-right`}>Date</th>
              <th className="w-10 px-3 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {expenses.map((e) => (
              <tr key={e.id} className="group transition-colors hover:bg-surface-raised">
                {/* Description */}
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-fg">{e.title}</span>
                    {e.is_recurring && (
                      <span className="rounded-full bg-primary-50 px-2 py-px text-xs font-medium text-primary-600">
                        recurring
                      </span>
                    )}
                  </div>
                  {e.notes && (
                    <p className="mt-0.5 max-w-xs truncate text-xs text-fg-subtle">{e.notes}</p>
                  )}
                </td>

                {/* Category */}
                <td className="hidden px-4 py-2.5 sm:table-cell">
                  <CategoryBadge category={e.category} />
                </td>

                {/* Member */}
                <td className="hidden px-4 py-2.5 md:table-cell">
                  <MemberAvatar member={e.member} />
                </td>

                {/* Payment method */}
                <td className="hidden px-4 py-2.5 lg:table-cell">
                  {e.payment_method ? (
                    <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs text-fg-muted">
                      {e.payment_method}
                    </span>
                  ) : (
                    <span className="text-neutral-300">—</span>
                  )}
                </td>

                {/* Amount */}
                <td className="px-4 py-2.5 text-right">
                  <AmountCell amount={Number(e.amount)} currency={e.currency} />
                </td>

                {/* Date */}
                <td className="px-4 py-2.5 text-right">
                  <span className="tabular-nums text-xs text-fg-subtle">{e.date}</span>
                </td>

                {/* Actions */}
                <td className="px-3 py-2.5">
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

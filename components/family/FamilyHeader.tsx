"use client";

import { useState, useActionState, useEffect, useRef } from "react";
import { updateFamilyInfo } from "@/app/actions/members";
import type { Family } from "@/types";

const INPUT =
  "w-full rounded-xl border border-line bg-surface-raised px-4 py-2.5 text-sm outline-none transition focus:border-primary-400 focus:bg-surface focus:ring-2 focus:ring-interactive-ring";

export default function FamilyHeader({
  family,
  isAdmin,
  memberCount,
}: {
  family: Family;
  isAdmin: boolean;
  memberCount: number;
}) {
  const [editing, setEditing] = useState(false);
  const [error, formAction, pending] = useActionState(updateFamilyInfo, null);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending && !error) setEditing(false);
    wasPending.current = pending;
  }, [pending, error]);

  const joinedDate = new Date(family.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  if (!editing) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-100">
              <svg className="h-7 w-7 text-interactive" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12 11.204 3.045c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            </div>

            <div>
              <h1 className="text-2xl font-bold leading-tight text-fg">{family.name}</h1>
              <p className="mt-0.5 text-sm text-fg-muted">
                {family.address ?? (isAdmin ? "No address · click Edit to add one" : "")}
              </p>
              <div className="mt-2 flex items-center gap-3 text-xs text-fg-subtle">
                <span>{memberCount} member{memberCount !== 1 ? "s" : ""}</span>
                <span className="h-1 w-1 rounded-full bg-neutral-300" />
                <span>Since {joinedDate}</span>
              </div>
            </div>
          </div>

          {isAdmin && (
            <button
              onClick={() => setEditing(true)}
              className="flex shrink-0 items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-xs font-medium text-fg-muted transition hover:bg-surface-raised hover:text-fg"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              Edit
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-primary-100 bg-surface p-6 shadow-sm ring-1 ring-primary-100">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-interactive">
        Editing family info
      </p>
      <form action={formAction} className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-fg-muted">Family Name</label>
            <input
              name="name"
              defaultValue={family.name}
              required
              placeholder="e.g. The Smith Family"
              className={INPUT}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-fg-muted">Address</label>
            <input
              name="address"
              defaultValue={family.address ?? ""}
              placeholder="123 Main St, City"
              className={INPUT}
            />
          </div>
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded-xl border border-line px-4 py-2 text-sm text-fg-muted transition hover:bg-surface-raised"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-interactive px-4 py-2 text-sm font-medium text-fg-inverse transition hover:bg-interactive-hover disabled:opacity-50"
          >
            {pending ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState, useActionState } from "react";
import { inviteMember } from "@/app/actions/members";

export default function InviteModal() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(inviteMember, null);

  function handleClose() {
    setOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 active:bg-indigo-800"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
        </svg>
        Invite Member
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Panel */}
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl">
            {/* Header */}
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Invite a Member</h2>
                <p className="mt-0.5 text-sm text-gray-500">
                  They'll receive a link to join your family.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form action={action} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="jane@example.com"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {state?.error && (
                <p className="text-sm text-red-500">{state.error}</p>
              )}

              {state?.link && (
                <div className="rounded-xl bg-indigo-50 p-4">
                  <p className="mb-2 text-xs font-semibold text-indigo-700">
                    Invite link · expires in 7 days
                  </p>
                  <code className="block select-all break-all text-xs leading-relaxed text-indigo-900">
                    {state.link}
                  </code>
                </div>
              )}

              <button
                type="submit"
                disabled={pending}
                className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
              >
                {pending ? "Creating link…" : "Generate Invite Link"}
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
}

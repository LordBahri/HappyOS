"use client";

import { useActionState } from "react";
import { inviteMember } from "@/app/actions/members";

export default function InviteForm() {
  const [state, action, pending] = useActionState(inviteMember, null);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
      <h2 className="text-sm font-semibold text-gray-900">Invite a member</h2>
      <form action={action} className="flex gap-2">
        <input
          type="email"
          name="email"
          placeholder="Email address"
          required
          className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {pending ? "Creating…" : "Invite"}
        </button>
      </form>
      {state?.link && (
        <div className="rounded-md bg-gray-50 p-3">
          <p className="text-xs text-gray-500 mb-1">Share this link (expires in 7 days):</p>
          <code className="text-xs break-all text-gray-800 select-all">{state.link}</code>
        </div>
      )}
      {state?.error && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
    </div>
  );
}

"use client";

import { useActionState } from "react";
import { inviteMember } from "@/app/actions/members";

export default function InviteForm() {
  const [state, action, pending] = useActionState(inviteMember, null);

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        Invite a member
      </h2>
      <form action={action} className="flex gap-2.5">
        <input
          type="email"
          name="email"
          placeholder="Email address"
          required
          className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors"
        />
        <button
          type="submit"
          disabled={pending}
          className="flex-shrink-0 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 transition-colors"
        >
          {pending ? "Creating…" : "Invite"}
        </button>
      </form>
      {state?.link && (
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-medium text-slate-500 mb-1.5">
            Share this link · expires in 7 days
          </p>
          <code className="text-xs break-all text-slate-700 select-all leading-relaxed">
            {state.link}
          </code>
        </div>
      )}
      {state?.error && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
    </div>
  );
}

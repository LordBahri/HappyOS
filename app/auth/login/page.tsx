"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { login } from "../actions";

export default function LoginPage() {
  const [error, action, pending] = useActionState(login, null);
  const next = useSearchParams().get("next") ?? "/";

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold">Sign in</h1>

        <form action={action} className="space-y-4">
          <input type="hidden" name="next" value={next} />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-md bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-700 disabled:opacity-50"
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-center text-sm text-neutral-500">
          No account?{" "}
          <Link href="/auth/signup" className="underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

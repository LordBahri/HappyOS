"use client";

import { Suspense } from "react";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { login } from "../actions";

function LoginForm() {
  const [error, action, pending] = useActionState(login, null);
  const next = useSearchParams().get("next") ?? "/";

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className="w-full rounded-xl border border-line bg-surface-raised px-4 py-2.5 text-sm outline-none transition focus:border-primary-400 focus:bg-surface focus:ring-2 focus:ring-interactive-ring"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        className="w-full rounded-xl border border-line bg-surface-raised px-4 py-2.5 text-sm outline-none transition focus:border-primary-400 focus:bg-surface focus:ring-2 focus:ring-interactive-ring"
      />
      {error && <p className="text-sm text-danger">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-interactive px-4 py-2.5 text-sm font-medium text-fg-inverse transition hover:bg-interactive-hover disabled:opacity-50"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold text-fg">Sign in</h1>
        <Suspense>
          <LoginForm />
        </Suspense>
        <p className="text-center text-sm text-fg-muted">
          No account?{" "}
          <Link href="/auth/signup" className="text-interactive underline hover:text-interactive-hover">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

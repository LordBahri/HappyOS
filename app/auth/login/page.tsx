"use client";

import { Suspense } from "react";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { login } from "../actions";
import Logo from "@/components/ui/Logo";

function LoginForm() {
  const [error, action, pending] = useActionState(login, null);
  const next = useSearchParams().get("next") ?? "/";

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <div>
        <label className="mb-1.5 block text-xs font-medium text-fg-muted">Email</label>
        <input
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          className="w-full rounded-xl border border-line bg-surface-raised px-4 py-2.5 text-sm outline-none transition focus:border-primary-400 focus:bg-surface focus:ring-2 focus:ring-interactive-ring"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-fg-muted">Password</label>
        <input
          name="password"
          type="password"
          placeholder="••••••••"
          required
          className="w-full rounded-xl border border-line bg-surface-raised px-4 py-2.5 text-sm outline-none transition focus:border-primary-400 focus:bg-surface focus:ring-2 focus:ring-interactive-ring"
        />
      </div>
      {error && (
        <p className="rounded-xl bg-danger/5 px-4 py-2.5 text-sm text-danger">{error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-interactive px-4 py-2.5 text-sm font-semibold text-fg-inverse transition hover:bg-interactive-hover active:bg-interactive-active disabled:opacity-50"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-accent-800 p-12">
        <Logo size={36} light />
        <div>
          <p className="text-3xl font-bold text-fg-inverse leading-snug">
            Manage your family,<br />together.
          </p>
          <p className="mt-4 text-sm text-accent-300 leading-relaxed max-w-xs">
            Expenses, shopping, tasks — one place for everyone who matters.
          </p>
        </div>
        <p className="text-xs text-accent-500">© {new Date().getFullYear()} HappyOS</p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <div className="mb-10 lg:hidden">
          <Logo size={36} />
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-fg">Welcome back</h1>
            <p className="mt-1 text-sm text-fg-muted">Sign in to your account</p>
          </div>

          <Suspense>
            <LoginForm />
          </Suspense>

          <p className="mt-6 text-center text-sm text-fg-muted">
            No account?{" "}
            <Link href="/auth/signup" className="font-medium text-interactive hover:text-interactive-hover">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

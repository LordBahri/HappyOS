"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup } from "../actions";
import Logo from "@/components/ui/Logo";

export default function SignupPage() {
  const [error, action, pending] = useActionState(signup, null);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-accent-800 p-12">
        <Logo size={36} light />
        <div>
          <p className="text-3xl font-bold text-fg-inverse leading-snug">
            Everything your<br />family needs.
          </p>
          <p className="mt-4 text-sm text-accent-300 leading-relaxed max-w-xs">
            Track expenses, share shopping lists, and stay on top of tasks — all in one place.
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
            <h1 className="text-2xl font-bold text-fg">Create account</h1>
            <p className="mt-1 text-sm text-fg-muted">Get started for free</p>
          </div>

          <form action={action} className="space-y-4">
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
                placeholder="Min. 6 characters"
                minLength={6}
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
              {pending ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-fg-muted">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-interactive hover:text-interactive-hover">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

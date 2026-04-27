import Link from "next/link";
import Logo from "@/components/ui/Logo";

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm text-center space-y-6">
        <div className="flex justify-center">
          <Logo size={48} />
        </div>

        <div className="rounded-2xl border border-line bg-surface p-8 shadow-sm space-y-4">
          {/* Email icon */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100">
            <svg className="h-7 w-7 text-interactive" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
          </div>

          <div>
            <h1 className="text-xl font-bold text-fg">Check your email</h1>
            <p className="mt-2 text-sm text-fg-muted leading-relaxed">
              We sent you a confirmation link. Click it to activate your account.
            </p>
          </div>

          <Link
            href="/auth/login"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-interactive hover:text-interactive-hover"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

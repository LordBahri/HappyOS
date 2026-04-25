import Link from "next/link";

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4 text-center">
        <h1 className="text-2xl font-bold">Check your email</h1>
        <p className="text-sm text-neutral-500">
          We sent you a confirmation link. Click it to activate your account.
        </p>
        <Link href="/auth/login" className="text-sm underline text-neutral-500">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}

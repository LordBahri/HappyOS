"use client";

export default function ExpensesError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-red-500">Failed to load expenses</p>
      <p className="text-xs text-neutral-400">{error.message}</p>
      {error.digest && (
        <p className="text-xs text-neutral-400">Digest: {error.digest}</p>
      )}
    </div>
  );
}

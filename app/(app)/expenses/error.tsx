"use client";

export default function ExpensesError({ error }: { error: Error }) {
  return (
    <p className="text-sm text-red-500">
      Failed to load expenses: {error.message}
    </p>
  );
}

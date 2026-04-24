"use client";

import { useRouter } from "next/navigation";

export default function MonthFilter({ value }: { value: string }) {
  const router = useRouter();
  return (
    <input
      type="month"
      defaultValue={value}
      onChange={(e) => router.push(`/expenses?month=${e.target.value}`)}
      className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm outline-none focus:border-neutral-500"
    />
  );
}

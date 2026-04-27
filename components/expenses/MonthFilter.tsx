"use client";

import { useRouter } from "next/navigation";

export default function MonthFilter({ value }: { value: string }) {
  const router = useRouter();
  return (
    <input
      type="month"
      defaultValue={value}
      onChange={(e) => router.push(`/expenses?month=${e.target.value}`)}
      className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
    />
  );
}

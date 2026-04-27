import type { Expense } from "@/types";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  accent: string;
  icon: React.ReactNode;
}

function StatCard({ label, value, sub, accent, icon }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className={`mb-3 inline-flex rounded-xl p-2.5 ${accent}`}>{icon}</div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

export default function StatsCards({
  expenses,
  month,
}: {
  expenses: Expense[];
  month: string;
}) {
  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const [year, m] = month.split("-").map(Number);
  const daysInMonth = new Date(year, m, 0).getDate();
  const dailyAvg = daysInMonth > 0 ? total / daysInMonth : 0;

  const biggest = expenses.reduce((max, e) => Math.max(max, Number(e.amount)), 0);

  const catTotals: Record<string, number> = {};
  for (const e of expenses) {
    if (e.category) catTotals[e.category] = (catTotals[e.category] ?? 0) + Number(e.amount);
  }
  const topCat = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard
        label="Total This Month"
        value={`$${total.toFixed(2)}`}
        sub={`${expenses.length} transaction${expenses.length !== 1 ? "s" : ""}`}
        accent="bg-indigo-100 text-indigo-600"
        icon={
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        }
      />
      <StatCard
        label="Daily Average"
        value={`$${dailyAvg.toFixed(2)}`}
        sub={`Over ${daysInMonth} days`}
        accent="bg-emerald-100 text-emerald-600"
        icon={
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5 7.5 9l4.5 4.5 4.5-4.5L21 13.5" />
          </svg>
        }
      />
      <StatCard
        label="Biggest Expense"
        value={biggest > 0 ? `$${biggest.toFixed(2)}` : "—"}
        accent="bg-amber-100 text-amber-600"
        icon={
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
          </svg>
        }
      />
      <StatCard
        label="Top Category"
        value={topCat}
        accent="bg-violet-100 text-violet-600"
        icon={
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
          </svg>
        }
      />
    </div>
  );
}

function TrendBadge({ trend }: { trend: number }) {
  const up = trend > 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium ${
        up
          ? "bg-red-50 text-red-600"
          : "bg-emerald-50 text-emerald-700"
      }`}
    >
      {up ? "↑" : "↓"} {up ? "+" : ""}{Math.abs(trend).toFixed(0)}%
    </span>
  );
}

export default function StatCard({
  label,
  value,
  sub,
  trend,
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  trend?: number | null;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>
        {icon && (
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            {icon}
          </span>
        )}
      </div>
      <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
      <div className="mt-1.5 flex items-center gap-2 min-h-[1.25rem]">
        {trend != null && trend !== 0 && <TrendBadge trend={trend} />}
        {sub && (
          <span className="text-xs text-slate-400">{sub}</span>
        )}
      </div>
    </div>
  );
}

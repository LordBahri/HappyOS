function TrendBadge({ trend }: { trend: number }) {
  const up = trend > 0;
  const pct = Math.abs(trend).toFixed(0);
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-medium ${
        up ? "text-red-500" : "text-green-600"
      }`}
    >
      {up ? "↑" : "↓"} {up ? "+" : "-"}{pct}%
    </span>
  );
}

export default function StatCard({
  label,
  value,
  sub,
  trend,
}: {
  label: string;
  value: string;
  sub?: string;
  trend?: number | null;
}) {
  return (
    <div className="rounded-md border border-neutral-200 bg-white p-4">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
      <div className="mt-1 flex items-center gap-2 min-h-[1rem]">
        {trend != null && trend !== 0 && <TrendBadge trend={trend} />}
        {sub && <span className="text-xs text-neutral-400">{sub}</span>}
      </div>
    </div>
  );
}

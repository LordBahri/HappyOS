const COLORS: Record<string, { bar: string; text: string }> = {
  Food:          { bar: "bg-emerald-500", text: "text-emerald-700" },
  Transport:     { bar: "bg-blue-500",    text: "text-blue-700" },
  Utilities:     { bar: "bg-amber-500",   text: "text-amber-700" },
  Entertainment: { bar: "bg-purple-500",  text: "text-purple-700" },
  Health:        { bar: "bg-rose-500",    text: "text-rose-700" },
  Other:         { bar: "bg-slate-400",   text: "text-slate-600" },
};

const fallback = { bar: "bg-slate-400", text: "text-slate-600" };

export default function CategoryBreakdown({
  byCategory,
  total,
  prevByCategory,
}: {
  byCategory: Record<string, number>;
  total: number;
  prevByCategory?: Record<string, number>;
}) {
  const sorted = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-4">
        By category
      </h2>
      {sorted.length === 0 ? (
        <p className="text-sm text-slate-400">No data this month</p>
      ) : (
        <div className="space-y-3.5">
          {sorted.map(([cat, amount]) => {
            const color = COLORS[cat] ?? fallback;
            const pct = total > 0 ? (amount / total) * 100 : 0;
            const prev = prevByCategory?.[cat];
            const delta = prev != null ? amount - prev : null;

            return (
              <div key={cat}>
                <div className="flex items-baseline justify-between mb-1">
                  <span className={`text-xs font-medium ${color.text}`}>{cat}</span>
                  <div className="flex items-baseline gap-2">
                    {delta != null && delta !== 0 && (
                      <span className={`text-xs ${delta > 0 ? "text-red-500" : "text-emerald-600"}`}>
                        {delta > 0 ? "+" : ""}${delta.toFixed(0)}
                      </span>
                    )}
                    <span className="text-sm font-semibold text-slate-800">
                      ${amount.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100">
                  <div
                    className={`h-1.5 rounded-full transition-all ${color.bar}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {prev != null && (
                  <p className="mt-0.5 text-xs text-slate-400">
                    ${prev.toFixed(2)} last month
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

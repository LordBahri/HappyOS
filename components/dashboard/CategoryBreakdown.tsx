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
    <div className="space-y-3 rounded-md border border-neutral-200 bg-white p-4">
      <h2 className="text-sm font-medium">By category</h2>
      {sorted.length === 0 ? (
        <p className="text-sm text-neutral-400">No data</p>
      ) : (
        sorted.map(([cat, amount]) => {
          const prev = prevByCategory?.[cat];
          const delta = prev != null ? amount - prev : null;

          return (
            <div key={cat} className="space-y-1">
              <div className="flex items-baseline justify-between text-sm">
                <span>{cat}</span>
                <div className="flex items-baseline gap-2">
                  {delta != null && delta !== 0 && (
                    <span
                      className={`text-xs font-medium ${
                        delta > 0 ? "text-red-500" : "text-green-600"
                      }`}
                    >
                      {delta > 0 ? "+" : ""}${delta.toFixed(0)}
                    </span>
                  )}
                  <span className="font-medium">${amount.toFixed(2)}</span>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-neutral-100">
                <div
                  className="h-1.5 rounded-full bg-neutral-800"
                  style={{ width: `${total > 0 ? (amount / total) * 100 : 0}%` }}
                />
              </div>
              {prev != null && (
                <p className="text-xs text-neutral-400">
                  ${prev.toFixed(2)} last month
                </p>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

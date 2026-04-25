export default function CategoryBreakdown({
  byCategory,
  total,
}: {
  byCategory: Record<string, number>;
  total: number;
}) {
  const sorted = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-3 rounded-md border border-neutral-200 bg-white p-4">
      <h2 className="text-sm font-medium">By category</h2>
      {sorted.length === 0 ? (
        <p className="text-sm text-neutral-400">No data</p>
      ) : (
        sorted.map(([cat, amount]) => (
          <div key={cat} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{cat}</span>
              <span className="font-medium">${amount.toFixed(2)}</span>
            </div>
            <div className="h-1.5 rounded-full bg-neutral-100">
              <div
                className="h-1.5 rounded-full bg-neutral-800"
                style={{ width: `${total > 0 ? (amount / total) * 100 : 0}%` }}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}

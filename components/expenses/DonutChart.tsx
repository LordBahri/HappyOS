import type { Expense } from "@/types";
import { getCategoryTotals, CATEGORY_COLORS } from "@/lib/expenses";

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

interface Slice {
  category: string;
  amount: number;
  percentage: number;
  color: string;
  startAngle: number;
  endAngle: number;
}

function buildSlices(expenses: Expense[]): { slices: Slice[]; total: number } {
  const catTotals = getCategoryTotals(expenses);
  const total = Object.values(catTotals).reduce((s, v) => s + v, 0);
  if (total === 0) return { slices: [], total: 0 };

  let currentAngle = 0;
  const slices: Slice[] = Object.entries(catTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, amount]) => {
      const percentage = (amount / total) * 100;
      const sweep = (percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sweep;
      currentAngle = endAngle;
      return {
        category: cat,
        amount,
        percentage,
        color: CATEGORY_COLORS[cat]?.hex ?? "#9ca3af",
        startAngle,
        endAngle,
      };
    });

  return { slices, total };
}

function SlicePath({
  slice,
  cx,
  cy,
  outerR,
  innerR,
}: {
  slice: Slice;
  cx: number;
  cy: number;
  outerR: number;
  innerR: number;
}) {
  const sweep = slice.endAngle - slice.startAngle;

  if (sweep >= 359.9) {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={(outerR + innerR) / 2}
        fill="none"
        stroke={slice.color}
        strokeWidth={outerR - innerR}
      />
    );
  }

  const gap = sweep > 5 ? 0.5 : 0;
  const outerStart = polarToCartesian(cx, cy, outerR, slice.startAngle + gap);
  const outerEnd   = polarToCartesian(cx, cy, outerR, slice.endAngle   - gap);
  const innerStart = polarToCartesian(cx, cy, innerR, slice.startAngle + gap);
  const innerEnd   = polarToCartesian(cx, cy, innerR, slice.endAngle   - gap);
  const largeArc   = sweep > 180 ? 1 : 0;

  const d = [
    `M ${outerStart.x.toFixed(3)} ${outerStart.y.toFixed(3)}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x.toFixed(3)} ${outerEnd.y.toFixed(3)}`,
    `L ${innerEnd.x.toFixed(3)} ${innerEnd.y.toFixed(3)}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerStart.x.toFixed(3)} ${innerStart.y.toFixed(3)}`,
    "Z",
  ].join(" ");

  return <path d={d} fill={slice.color} />;
}

export default function DonutChart({ expenses }: { expenses: Expense[] }) {
  const { slices, total } = buildSlices(expenses);
  const cx = 80, cy = 80, outerR = 68, innerR = 44;

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
      <div className="relative mx-auto w-40 shrink-0">
        <svg viewBox="0 0 160 160" className="h-40 w-40" aria-hidden>
          {slices.length === 0 ? (
            <circle
              cx={cx}
              cy={cy}
              r={(outerR + innerR) / 2}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth={outerR - innerR}
            />
          ) : (
            slices.map((s) => (
              <SlicePath key={s.category} slice={s} cx={cx} cy={cy} outerR={outerR} innerR={innerR} />
            ))
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-lg font-bold text-fg">${total.toFixed(0)}</span>
          <span className="text-xs text-fg-subtle">total</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        {slices.length === 0 ? (
          <p className="text-sm text-fg-subtle">No data yet</p>
        ) : (
          slices.map((s) => (
            <div key={s.category} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="flex-1 truncate text-sm text-fg-muted">{s.category}</span>
              <span className="text-sm font-semibold text-fg">${s.amount.toFixed(0)}</span>
              <span className="w-10 text-right text-xs text-fg-subtle">{s.percentage.toFixed(0)}%</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

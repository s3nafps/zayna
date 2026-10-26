import { formatDzd } from "@/lib/money";

export type BarPoint = { label: string; amount: number; count: number };

const WIDTH = 700;
const HEIGHT = 220;
const PAD = 28;
const GAP = 14;

// Inline SVG bars for the 7-day series. A table with the same numbers is included for screen readers.
// The figure is LTR on purpose: time runs left to right, even on Arabic screens.
export function BarChart({
  title,
  points,
  summary,
  columnLabels,
}: {
  title: string;
  points: BarPoint[];
  summary: string;
  columnLabels: { day: string; orders: string; amount: string };
}) {
  const max = Math.max(1, ...points.map((point) => point.amount));
  const plotHeight = HEIGHT - PAD * 2;
  const barWidth = (WIDTH - PAD * 2 - GAP * (points.length - 1)) / Math.max(1, points.length);

  return (
    <figure dir="ltr" className="flex flex-col gap-3">
      <figcaption className="font-sans text-label-lg font-semibold text-on-surface">{title}</figcaption>
      <svg role="img" aria-label={summary} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-auto w-full">
        {points.map((point, index) => {
          const height = Math.round((point.amount / max) * plotHeight);
          const x = PAD + index * (barWidth + GAP);
          const y = HEIGHT - PAD - height;
          return (
            <g key={point.label}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(height, 2)}
                rx={4}
                className="fill-primary-container"
              />
              <text
                x={x + barWidth / 2}
                y={HEIGHT - 8}
                textAnchor="middle"
                className="fill-on-surface-variant text-[12px]"
              >
                {point.label}
              </text>
            </g>
          );
        })}
      </svg>
      <table className="sr-only">
        <thead>
          <tr>
            <th scope="col">{columnLabels.day}</th>
            <th scope="col">{columnLabels.orders}</th>
            <th scope="col">{columnLabels.amount}</th>
          </tr>
        </thead>
        <tbody>
          {points.map((point) => (
            <tr key={point.label}>
              <td>{point.label}</td>
              <td>{point.count}</td>
              <td>{formatDzd(point.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

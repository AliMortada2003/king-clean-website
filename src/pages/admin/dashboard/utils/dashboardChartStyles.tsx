import { numberFormatter } from "../../../../lib/format";

export const axisTickStyle = {
  fontSize: 11,
  fill: "var(--color-muted)",
};

export const dashboardChartGridStroke = "rgba(102, 121, 133, 0.22)";

export const dashboardChartColors = {
  navy: "var(--color-navy-soft)",
  gold: "var(--color-gold)",
  teal: "var(--color-teal)",
};

type TooltipPayload = {
  color?: string;
  name?: string | number;
  value?: string | number;
};

type DashboardChartTooltipProps = {
  active?: boolean;
  label?: string | number;
  payload?: TooltipPayload[];
};

export function DashboardChartTooltip({
  active,
  label,
  payload,
}: DashboardChartTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="min-w-32 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-right shadow-strong">
      {label && (
        <p className="mb-2 text-xs font-black text-[var(--color-muted)]">
          {label}
        </p>
      )}

      <div className="grid gap-1.5">
        {payload.map((item, index) => (
          <div
            className="flex items-center justify-between gap-4 text-sm"
            key={`${item.name ?? "metric"}-${index}`}
          >
            <span className="flex items-center gap-2 font-bold text-[var(--color-muted)]">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: item.color || "var(--color-gold)" }}
              />
              {item.name}
            </span>

            <strong className="text-[var(--color-text)]">
              {typeof item.value === "number"
                ? numberFormatter.format(item.value)
                : item.value}
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}

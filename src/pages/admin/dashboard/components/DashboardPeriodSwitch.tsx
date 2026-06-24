import {
  dashboardPeriods,
  type DashboardPeriod,
} from "../utils/dashboardConstants";

type DashboardPeriodSwitchProps = {
  value: DashboardPeriod;
  onChange: (value: DashboardPeriod) => void;
};

export function DashboardPeriodSwitch({
  value,
  onChange,
}: DashboardPeriodSwitchProps) {
  return (
    <div
      className="grid grid-cols-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-1 shadow-sm"
      aria-label="الفترة الزمنية"
      role="group"
    >
      {dashboardPeriods.map((period) => (
        <button
          className={[
            "min-h-10 whitespace-nowrap rounded-xl px-4 text-sm font-black transition",
            value === period
              ? "bg-[var(--color-gold)] text-[var(--color-navy)] shadow-sm"
              : "text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]",
          ].join(" ")}
          key={period}
          type="button"
          aria-pressed={value === period}
          onClick={() => onChange(period)}
        >
          {period} يومًا
        </button>
      ))}
    </div>
  );
}

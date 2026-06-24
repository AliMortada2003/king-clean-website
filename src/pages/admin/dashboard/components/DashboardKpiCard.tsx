import type { LucideIcon } from "lucide-react";

import { numberFormatter } from "../../../../lib/format";

export type DashboardKpiItem = {
  label: string;
  value: number;
  icon: LucideIcon;
};

export function DashboardKpiCard({
  item,
  index,
}: {
  item: DashboardKpiItem;
  index: number;
}) {
  const Icon = item.icon;

  return (
    <article className="relative min-h-32 overflow-hidden bg-[color-mix(in_srgb,var(--color-surface)_93%,transparent)] p-5">
      <div
        className={[
          "pointer-events-none absolute inset-y-5 right-0 w-1 rounded-l-full",
          index % 3 === 0
            ? "bg-[var(--color-gold)]"
            : index % 3 === 1
              ? "bg-[var(--color-teal)]"
              : "bg-[var(--color-navy-soft)] dark:bg-[var(--color-gold)]",
        ].join(" ")}
      />

      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="text-sm font-black leading-6 text-[var(--color-muted)]">
          {item.label}
        </span>

        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-[color-mix(in_srgb,var(--color-gold)_20%,transparent)] bg-[color-mix(in_srgb,var(--color-gold)_11%,transparent)] text-[var(--color-navy-soft)] dark:text-[var(--color-gold)]">
          <Icon size={20} />
        </span>
      </div>

      <strong className="block text-3xl font-black leading-none text-[var(--color-text)]">
        {numberFormatter.format(item.value)}
      </strong>
    </article>
  );
}

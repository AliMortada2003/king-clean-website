import type { DashboardKpiItem } from "./DashboardKpiCard";
import { DashboardKpiCard } from "./DashboardKpiCard";
import { DashboardErrorState, DashboardLoadingRows } from "./DashboardStates";

type DashboardKpiRailProps = {
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  retry: () => void;
  kpis: DashboardKpiItem[];
};

export function DashboardKpiRail({
  isLoading,
  isError,
  error,
  retry,
  kpis,
}: DashboardKpiRailProps) {
  if (isLoading) return <DashboardLoadingRows rows={2} />;

  if (isError) {
    return <DashboardErrorState error={error} retry={retry} compact />;
  }

  return (
    <section
      className="mb-6 grid overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-soft sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7"
      aria-label="مؤشرات لوحة التحكم"
    >
      {kpis.map((item, index) => (
        <div
          className="border-b border-[var(--color-border)] last:border-b-0 sm:border-l sm:last:border-l-0 lg:[&:nth-child(4n)]:border-l-0 xl:border-b-0 xl:[&:nth-child(4n)]:border-l xl:last:border-l-0"
          key={item.label}
        >
          <DashboardKpiCard item={item} index={index} />
        </div>
      ))}
    </section>
  );
}

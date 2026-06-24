import { CalendarDays } from "lucide-react";

import type { DashboardPeriod } from "../utils/dashboardConstants";
import { DashboardPeriodSwitch } from "./DashboardPeriodSwitch";

type DashboardPageHeaderProps = {
  days: DashboardPeriod;
  onDaysChange: (value: DashboardPeriod) => void;
};

export function DashboardPageHeader({
  days,
  onDaysChange,
}: DashboardPageHeaderProps) {
  return (
    <header className="mb-6 flex flex-col gap-5 border-b border-[var(--color-border)] pb-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-[var(--color-gold-dark)] dark:text-[var(--color-gold)]">
          KING CLEAN ADMIN
        </p>

        <h1 className="m-0 font-display text-3xl font-black leading-tight text-[var(--color-text)] sm:text-4xl">
          لوحة التحكم
        </h1>

        <p className="mt-2 max-w-2xl text-sm font-bold leading-7 text-[var(--color-muted)]">
          ملخص الطلبات، أداء الخدمات، وأحدث حركة تشغيلية في مكان واحد.
        </p>
      </div>

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
        <div className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm font-black text-[var(--color-text)] shadow-sm">
          <CalendarDays size={18} className="text-[var(--color-gold-dark)]" />
          <span>آخر {days} يومًا</span>
        </div>

        <DashboardPeriodSwitch value={days} onChange={onDaysChange} />
      </div>
    </header>
  );
}

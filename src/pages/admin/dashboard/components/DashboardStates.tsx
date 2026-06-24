import { AlertTriangle, Inbox, RefreshCw } from "lucide-react";

export function DashboardLoadingRows({ rows = 3 }: { rows?: number }) {
  return (
    <div className="grid gap-3" aria-label="جاري تحميل بيانات لوحة التحكم">
      {Array.from({ length: rows }, (_, index) => (
        <div
          className="h-20 animate-pulse rounded-2xl border border-[var(--color-border)] bg-[linear-gradient(90deg,var(--color-surface)_0%,var(--color-surface-soft)_48%,var(--color-surface)_100%)]"
          key={index}
        />
      ))}
    </div>
  );
}

export function DashboardErrorState({
  error,
  retry,
  compact = false,
}: {
  error?: unknown;
  retry?: () => void;
  compact?: boolean;
}) {
  const message =
    error instanceof Error
      ? error.message
      : "تعذر تحميل البيانات حاليًا.";

  return (
    <div
      className={[
        "grid place-items-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-6 text-center",
        compact ? "min-h-32" : "min-h-56",
      ].join(" ")}
    >
      <div className="grid justify-items-center gap-3">
        <AlertTriangle className="text-[var(--color-danger)]" size={30} />
        <strong className="text-[var(--color-text)]">حدث خطأ</strong>
        <p className="m-0 leading-8 text-[var(--color-muted)]">{message}</p>

        {retry && (
          <button
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-xs font-black text-[var(--color-text)] transition hover:border-[var(--color-gold)] hover:text-[var(--color-gold-dark)]"
            type="button"
            onClick={retry}
          >
            <RefreshCw size={16} />
            إعادة المحاولة
          </button>
        )}
      </div>
    </div>
  );
}

export function DashboardEmptyState({
  title = "لا توجد بيانات",
  description = "ستظهر البيانات هنا عند توفرها.",
  compact = false,
}: {
  title?: string;
  description?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={[
        "grid place-items-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-6 text-center",
        compact ? "min-h-32" : "min-h-56",
      ].join(" ")}
    >
      <div className="grid justify-items-center gap-3">
        <Inbox className="text-[var(--color-teal)]" size={30} />
        <strong className="text-[var(--color-text)]">{title}</strong>
        <p className="m-0 leading-8 text-[var(--color-muted)]">{description}</p>
      </div>
    </div>
  );
}

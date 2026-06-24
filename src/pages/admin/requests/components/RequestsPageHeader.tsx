import { numberFormatter } from "../../../../lib/format";

export function RequestsPageHeader({ totalCount = 0 }: { totalCount?: number }) {
  return (
    <header className="mb-6 flex flex-col gap-4 border-b border-[var(--color-border)] pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-[var(--color-gold-dark)] dark:text-[var(--color-gold)]">
          KING CLEAN ADMIN
        </p>
        <h1 className="m-0 font-display text-3xl font-black text-[var(--color-text)]">
          طلبات الخدمة
        </h1>
        <p className="mt-2 text-sm font-bold leading-7 text-[var(--color-muted)]">
          ابحث وصف الطلبات وتابع حالتها التشغيلية.
        </p>
      </div>

      <span className="inline-flex w-fit items-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-black text-[var(--color-text)] shadow-sm">
        {numberFormatter.format(totalCount)} طلب
      </span>
    </header>
  );
}

import { numberFormatter } from "../../../../lib/format";

type RequestsPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function RequestsPagination({
  page,
  totalPages,
  onPageChange,
}: RequestsPaginationProps) {
  const safeTotal = Math.max(1, totalPages);

  return (
    <div className="flex flex-col gap-3 border-t border-[var(--color-border)] p-4 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm font-bold text-[var(--color-muted)]">
        صفحة {numberFormatter.format(page)} من {numberFormatter.format(safeTotal)}
      </span>

      <div className="flex gap-2">
        <button
          className="inline-flex min-h-10 items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm font-black text-[var(--color-text)] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={page <= 1}
          type="button"
          onClick={() => onPageChange(page - 1)}
        >
          السابق
        </button>
        <button
          className="inline-flex min-h-10 items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm font-black text-[var(--color-text)] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={page >= safeTotal}
          type="button"
          onClick={() => onPageChange(page + 1)}
        >
          التالي
        </button>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";

import type { RequestStatus } from "../../../../types/api";

type RequestActionsProps = {
  id: number;
  status: RequestStatus;
  onStatusClick: (id: number, status: RequestStatus) => void;
};

export function RequestActions({
  id,
  status,
  onStatusClick,
}: RequestActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        className="inline-flex min-h-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-xs font-black text-[var(--color-text)] transition hover:border-[var(--color-gold)] hover:text-[var(--color-gold-dark)]"
        to={`/admin/requests/${id}`}
      >
        عرض التفاصيل
      </Link>
      <button
        className="inline-flex min-h-10 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--color-teal)_12%,transparent)] px-3 text-xs font-black text-[var(--color-teal)] transition hover:bg-[color-mix(in_srgb,var(--color-teal)_18%,transparent)]"
        type="button"
        onClick={() => onStatusClick(id, status)}
      >
        تحديث الحالة
      </button>
    </div>
  );
}

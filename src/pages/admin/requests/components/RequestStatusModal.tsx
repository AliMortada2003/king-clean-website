import { X } from "lucide-react";

import type { RequestStatus } from "../../../../types/api";
import { isRequestStatus, requestStatuses } from "../../../../lib/status";
import { requestStatusLabels } from "../utils/requestConstants";
import type { RequestStatusTarget } from "../types";

type RequestStatusModalProps = {
  target: RequestStatusTarget | null;
  busy: boolean;
  onClose: () => void;
  onChange: (status: RequestStatus) => void;
  onSubmit: () => void;
};

export function RequestStatusModal({
  target,
  busy,
  onClose,
  onChange,
  onSubmit,
}: RequestStatusModalProps) {
  if (!target) return null;

  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center bg-[var(--color-overlay)] p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`تحديث حالة الطلب #${target.id}`}
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="w-[min(92vw,520px)] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-strong">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] p-5">
          <div>
            <p className="mb-1 text-xs font-black text-[var(--color-gold-dark)] dark:text-[var(--color-gold)]">
              طلب #{target.id}
            </p>
            <h2 className="m-0 font-display text-xl font-black">
              تحديث حالة الطلب
            </h2>
          </div>
          <button
            className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)]"
            type="button"
            aria-label="إغلاق"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          <label
            className="mb-2 block text-sm font-black text-[var(--color-text)]"
            htmlFor="status-update"
          >
            الحالة الجديدة
          </label>
          <select
            className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-bold text-[var(--color-text)] outline-none focus:border-[var(--color-gold)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-gold)_18%,transparent)]"
            id="status-update"
            value={target.status}
            onChange={(event) => {
              if (isRequestStatus(event.target.value)) {
                onChange(event.target.value);
              }
            }}
          >
            {requestStatuses.map((status) => (
              <option value={status} key={status}>
                {requestStatusLabels[status]}
              </option>
            ))}
          </select>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3 text-sm font-black"
              type="button"
              onClick={onClose}
            >
              إلغاء
            </button>
            <button
              className="rounded-2xl bg-[var(--color-gold)] px-5 py-3 text-sm font-black text-[var(--color-navy)] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={busy}
              type="button"
              onClick={onSubmit}
            >
              {busy ? "جاري الحفظ..." : "حفظ الحالة"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

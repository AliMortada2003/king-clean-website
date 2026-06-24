import { AlertTriangle, Inbox, LoaderCircle, RefreshCw, X } from "lucide-react";
import { useEffect, useId, type CSSProperties, type PropsWithChildren, type ReactNode } from "react";
import { statusColors, statusLabels } from "../../lib/status";
import type { RequestStatus } from "../../types/api";
import { FaBroom, FaSoap, FaHandSparkles } from "react-icons/fa";

const panelClass =
  "rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center text-[var(--color-text)] shadow-soft";

const secondaryButtonClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 text-sm font-black text-[var(--color-text)] shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:text-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-primary)_32%,transparent)]";

const primaryButtonClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-[var(--color-primary)] to-[var(--color-primary-dark)] px-5 text-sm font-black text-white shadow-lg shadow-[rgba(211,154,34,0.22)] transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-primary)_42%,transparent)] disabled:cursor-not-allowed disabled:opacity-70";

const dangerButtonClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[var(--color-danger)] px-5 text-sm font-black text-white shadow-lg shadow-red-900/10 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70";


type PageLoadingProps = {
  label?: string;
  compact?: boolean;
};

export function PageLoading({
  label = "جار تجهيز الصفحة...",
  compact = false,
}: PageLoadingProps) {
  return (
    <div
      className={[
        "flex w-full items-center justify-center",
        compact ? "py-8" : "min-h-[280px] py-16",
      ].join(" ")}
      role="status"
      aria-live="polite"
    >
      <div className="relative flex flex-col items-center text-center">
        <div className="pointer-events-none absolute inset-0 m-auto h-40 w-40 rounded-full bg-[var(--color-primary)]/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 m-auto h-32 w-32 rounded-full bg-[var(--color-teal)]/10 blur-2xl" />

        <div className="relative grid h-24 w-24 place-items-center rounded-[2rem] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_88%,transparent)] shadow-strong backdrop-blur">
          <div className="absolute inset-2 rounded-[1.5rem] border border-[var(--color-primary)]/15" />

          <div className="absolute -right-2 -top-2 grid h-9 w-9 animate-bounce place-items-center rounded-full bg-emerald-500 text-white shadow-lg">
            <FaSoap className="text-sm" />
          </div>

          <div className="absolute -left-2 bottom-1 grid h-8 w-8 animate-pulse place-items-center rounded-full bg-amber-400 text-[var(--color-navy)] shadow-lg">
            <FaHandSparkles className="text-sm" />
          </div>

          <div className="relative grid h-14 w-14 animate-spin place-items-center rounded-full border-4 border-[var(--color-primary)]/15 border-t-[var(--color-primary)]">
            <FaBroom className="animate-pulse text-xl text-[var(--color-primary)]" />
          </div>
        </div>

        <div className="mt-6">
          <p className="font-display text-lg font-black text-[var(--color-text)]">
            KING CLEAN
          </p>

          <p className="mt-2 text-sm font-bold text-[var(--color-muted)]">
            {label}
          </p>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--color-primary)] [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--color-teal)] [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-amber-400" />
        </div>
      </div>
    </div>
  );
}


export function InlineLoading() {
  return (
    <span className="inline-flex items-center gap-2">
      <LoaderCircle className="animate-spin" size={18} /> جاري التحميل...
    </span>
  );
}

export function ErrorState({
  error,
  retry,
  compact = false,
}: {
  error?: unknown;
  retry?: () => void;
  compact?: boolean;
}) {
  const message =
    error instanceof Error ? error.message : "تعذر تحميل البيانات حاليا.";
  return (
    <div className={`${panelClass} ${compact ? "min-h-32" : "min-h-56"}`}>
      <div className="grid justify-items-center gap-3">
        <AlertTriangle className="text-[var(--color-danger)]" size={30} />
        <strong>حدث خطأ</strong>
        <p className="m-0 leading-8 text-[var(--color-muted)]">{message}</p>
        {retry && (
          <button
            className={`${secondaryButtonClass} min-h-10 rounded-xl px-4 text-xs`}
            onClick={retry}
          >
            <RefreshCw size={16} /> إعادة المحاولة
          </button>
        )}
      </div>
    </div>
  );
}

export function EmptyState({
  title = "لا توجد بيانات",
  description = "ستظهر البيانات هنا عند توفرها.",
  compact = false,
}: {
  title?: string;
  description?: string;
  compact?: boolean;
}) {
  return (
    <div className={`${panelClass} ${compact ? "min-h-32" : "min-h-56"}`}>
      <div className="grid justify-items-center gap-3">
        <Inbox className="text-[var(--color-teal)]" size={30} />
        <strong>{title}</strong>
        <p className="m-0 leading-8 text-[var(--color-muted)]">{description}</p>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--status-color)_24%,transparent)] bg-[color-mix(in_srgb,var(--status-color)_12%,transparent)] px-3 py-1 text-xs font-black text-[var(--status-color)]"
      style={{ "--status-color": statusColors[status] } as CSSProperties}
    >
      <span className="h-2 w-2 rounded-full bg-[var(--status-color)]" />
      {statusLabels[status]}
    </span>
  );
}

export function ActiveBadge({ active }: { active: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--status-color)_24%,transparent)] bg-[color-mix(in_srgb,var(--status-color)_12%,transparent)] px-3 py-1 text-xs font-black text-[var(--status-color)]"
      style={
        { "--status-color": active ? "#16835f" : "#647b89" } as CSSProperties
      }
    >
      <span className="h-2 w-2 rounded-full bg-[var(--status-color)]" />
      {active ? "نشط" : "غير نشط"}
    </span>
  );
}


export function Modal({
  title,
  children,
  onClose,
  footer,
}: PropsWithChildren<{
  title: string;
  onClose: () => void;
  footer?: ReactNode;
}>) {
  const titleId = useId();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center bg-[var(--color-overlay)] p-3 backdrop-blur-sm sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="max-h-[88vh] w-[min(94vw,760px)] overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-[0_28px_90px_rgba(0,0,0,0.22)] dark:shadow-[0_28px_90px_rgba(0,0,0,0.52)]">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_94%,var(--color-surface-soft))] p-4 sm:p-5">
          <h2
            id={titleId}
            className="m-0 font-display text-lg font-black leading-tight text-[var(--color-text)] sm:text-xl"
          >
            {title}
          </h2>

          <button
            className={dangerButtonClass}
            onClick={onClose}
            aria-label="إغلاق"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[62vh] overflow-y-auto overscroll-contain p-4 sm:p-5">
          {children}
        </div>

        {footer && (
          <div className="flex flex-col-reverse gap-2 border-t border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_94%,var(--color-surface-soft))] p-4 sm:flex-row sm:justify-end sm:p-5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = "تأكيد",
  busy,
  onConfirm,
  onClose,
  danger = true,
}: {
  title: string;
  message: string;
  confirmLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onClose: () => void;
  danger?: boolean;
}) {
  return (
    <Modal
      title={title}
      onClose={onClose}
      footer={
        <>
          <button
            className={secondaryButtonClass}
            onClick={onClose}
            type="button"
            disabled={busy}
          >
            إلغاء
          </button>

          <button
            disabled={busy}
            className={danger ? dangerButtonClass : primaryButtonClass}
            onClick={onConfirm}
            type="button"
          >
            {busy ? "جاري التنفيذ..." : confirmLabel}
          </button>
        </>
      }
    >
      <p className="m-0 text-sm font-bold leading-8 text-[var(--color-muted)] sm:text-base">
        {message}
      </p>
    </Modal>
  );
}
import type { CSSProperties, PropsWithChildren } from "react";

import type { RequestStatus } from "../../../../types/api";
import { requestStatusColors, requestStatusLabels } from "../utils/requestConstants";

export function RequestsPanel({
  children,
  className = "",
}: PropsWithChildren<{ className?: string }>) {
  return (
    <section
      className={[
        "overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-soft",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--request-status)_24%,transparent)] bg-[color-mix(in_srgb,var(--request-status)_12%,transparent)] px-3 py-1 text-xs font-black text-[var(--request-status)]"
      style={
        { "--request-status": requestStatusColors[status] } as CSSProperties
      }
    >
      <span className="h-2 w-2 rounded-full bg-[var(--request-status)]" />
      {requestStatusLabels[status]}
    </span>
  );
}

export function AccountBadge({ clientEmail }: { clientEmail?: string | null }) {
  const registered = !!clientEmail;

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--account-color)_24%,transparent)] bg-[color-mix(in_srgb,var(--account-color)_12%,transparent)] px-3 py-1 text-xs font-black text-[var(--account-color)]"
      style={
        {
          "--account-color": registered ? "var(--color-teal)" : "#647b89",
        } as CSSProperties
      }
    >
      <span className="h-2 w-2 rounded-full bg-[var(--account-color)]" />
      {registered ? "عميل مسجل" : "بدون حساب"}
    </span>
  );
}

export function ReplyBadge({ isReplied }: { isReplied: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--reply-color)_24%,transparent)] bg-[color-mix(in_srgb,var(--reply-color)_12%,transparent)] px-3 py-1 text-xs font-black text-[var(--reply-color)]"
      style={
        {
          "--reply-color": isReplied
            ? "var(--color-success)"
            : "var(--color-gold-dark)",
        } as CSSProperties
      }
    >
      <span className="h-2 w-2 rounded-full bg-[var(--reply-color)]" />
      {isReplied ? "تم الرد" : "بانتظار الرد"}
    </span>
  );
}

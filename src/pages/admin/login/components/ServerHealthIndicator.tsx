import { Activity } from "lucide-react";

import type { ServerHealthState } from "../types";

type ServerHealthIndicatorProps = {
  state: ServerHealthState;
};

export function ServerHealthIndicator({ state }: ServerHealthIndicatorProps) {
  const iconClass =
    state === "online"
      ? "text-[var(--color-success)]"
      : state === "offline"
        ? "text-[var(--color-danger)]"
        : "text-[var(--color-primary-dark)] dark:text-[var(--color-gold)]";

  const label =
    state === "online"
      ? "الخادم متصل ويعمل"
      : state === "offline"
        ? "تعذر الاتصال بالخادم"
        : "جارٍ فحص الاتصال...";

  return (
    <div className="my-6 inline-flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3 text-sm font-black text-[var(--color-muted)]">
      <Activity size={16} className={iconClass} />
      <span>{label}</span>
    </div>
  );
}
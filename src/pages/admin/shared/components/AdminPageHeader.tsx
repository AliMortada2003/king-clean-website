import type { ReactNode } from "react";

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  action?: ReactNode;
};

export function AdminPageHeader({
  title,
  description,
  eyebrow = "KING CLEAN ADMIN",
  action,
}: AdminPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_88%,transparent)] p-5 text-[var(--color-text)] shadow-[var(--shadow-soft)] backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="min-w-0">
        <p className="mb-2 text-xs font-black uppercase tracking-wide text-[var(--color-primary-dark)] dark:text-[var(--color-gold)]">
          {eyebrow}
        </p>

        <h1 className="m-0 font-display text-2xl font-black leading-tight text-[var(--color-text)] sm:text-3xl">
          {title}
        </h1>

        {description && (
          <p className="mt-2 max-w-3xl text-sm font-bold leading-7 text-[var(--color-muted)]">
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
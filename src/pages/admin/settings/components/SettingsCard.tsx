import type { PropsWithChildren } from "react";

export function SettingsCard({
  title,
  description,
  children,
}: PropsWithChildren<{ title: string; description?: string }>) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-soft">
      <div className="border-b border-[var(--color-border)] px-5 py-4">
        <h2 className="m-0 font-display text-lg font-black text-[var(--color-text)]">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm font-bold text-[var(--color-muted)]">
            {description}
          </p>
        )}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

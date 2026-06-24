import type { PropsWithChildren, ReactNode } from "react";

type DashboardPanelProps = PropsWithChildren<{
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  bodyClassName?: string;
}>;

export function DashboardPanel({
  title,
  subtitle,
  action,
  className = "",
  bodyClassName = "",
  children,
}: DashboardPanelProps) {
  return (
    <section
      className={[
        "relative min-w-0 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_92%,transparent)] shadow-soft backdrop-blur",
        className,
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,color-mix(in_srgb,var(--color-gold)_4%,transparent)_58%,color-mix(in_srgb,var(--color-teal)_5%,transparent)_100%)]" />

      {(title || subtitle || action) && (
        <div className="relative z-10 flex flex-col gap-3 border-b border-[var(--color-border)] px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title && (
              <h2 className="m-0 font-display text-lg font-black text-[var(--color-text)]">
                {title}
              </h2>
            )}

            {subtitle && (
              <p className="mt-1 text-sm font-bold text-[var(--color-muted)]">
                {subtitle}
              </p>
            )}
          </div>

          {action}
        </div>
      )}

      <div className={["relative z-10 p-5", bodyClassName].join(" ")}>
        {children}
      </div>
    </section>
  );
}

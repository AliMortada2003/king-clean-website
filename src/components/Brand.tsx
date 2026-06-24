type BrandProps = {
  compact?: boolean;
  tone?: "dark" | "light";
};

export function Brand({ compact = false, tone = "dark" }: BrandProps) {
  const isLight = tone === "light";

  return (
    <div className="flex items-center gap-3">
      <div className="grid h-14 w-14 shrink-0 animate-logo-float place-items-center overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--color-primary)_28%,transparent)] bg-[var(--color-surface)] shadow-lg shadow-black/5">
        <img
          src="/images/logo-website/light.jpeg"
          alt="KING CLEAN Logo"
          className="h-full w-full object-contain"
        />
      </div>

      {!compact && (
        <div className="leading-tight">
          <strong
            className={[
              "block text-xl font-black",
              isLight ? "text-white" : "text-[var(--color-text)]",
            ].join(" ")}
          >
            King Clean
          </strong>

          <span
            className={[
              "mt-1 block text-xs font-bold",
              isLight ? "text-white/65" : "text-[var(--color-muted)]",
            ].join(" ")}
          >
            شركة تنظيف بالكويت
          </span>
        </div>
      )}
    </div>
  );
}

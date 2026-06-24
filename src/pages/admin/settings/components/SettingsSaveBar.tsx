type SettingsSaveBarProps = {
  isDirty: boolean;
  isPending: boolean;
};

export function SettingsSaveBar({ isDirty, isPending }: SettingsSaveBarProps) {
  return (
    <div className="sticky bottom-24 z-20 mt-6 flex justify-end rounded-2xl border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_94%,transparent)] p-3 shadow-soft backdrop-blur lg:bottom-4">
      <button
        className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[var(--color-gold)] px-6 text-sm font-black text-[var(--color-navy)] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending || !isDirty}
        type="submit"
      >
        {isPending ? "جاري الحفظ..." : "حفظ الإعدادات"}
      </button>
    </div>
  );
}

export function SettingsPageHeader() {
  return (
    <header className="mb-6 border-b border-[var(--color-border)] pb-6">
      <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-[var(--color-gold-dark)] dark:text-[var(--color-gold)]">
        KING CLEAN ADMIN
      </p>
      <h1 className="m-0 font-display text-3xl font-black text-[var(--color-text)]">
        إعدادات الموقع
      </h1>
      <p className="mt-2 text-sm font-bold leading-7 text-[var(--color-muted)]">
        بيانات التواصل والمحتوى الافتراضي وتهيئة محركات البحث.
      </p>
    </header>
  );
}

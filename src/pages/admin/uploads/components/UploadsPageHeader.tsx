export function UploadsPageHeader() {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_88%,transparent)] p-5 text-[var(--color-text)] shadow-[var(--shadow-soft)] backdrop-blur sm:p-6">
      <div className="min-w-0">
        <p className="mb-2 text-xs font-black uppercase tracking-wide text-[var(--color-primary-dark)] dark:text-[var(--color-gold)]">
          KING CLEAN ADMIN
        </p>

        <h1 className="m-0 font-display text-2xl font-black leading-tight text-[var(--color-text)] sm:text-3xl">
          الملفات المرفوعة
        </h1>

        <p className="mt-2 max-w-3xl text-sm font-bold leading-7 text-[var(--color-muted)]">
          رفع الصور والفيديوهات أو البحث عن ملف بواسطة رقمه.
        </p>
      </div>
    </div>
  );
}
import { Search, UploadCloud } from "lucide-react";

type UploadControlPanelProps = {
  folder: string;
  lookupId: string;
  progress: number | null;
  busy: boolean;
  onFolderChange: (value: string) => void;
  onLookupIdChange: (value: string) => void;
  onLookup: () => void;
  onUpload: (file?: File) => void;
};

const panelClass =
  "relative overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_90%,transparent)] p-5 text-[var(--color-text)] shadow-[var(--shadow-soft)] backdrop-blur sm:p-6";

const subtleBgClass =
  "pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-surface)_100%,transparent)_0%,color-mix(in_srgb,var(--color-gold)_5%,transparent)_58%,color-mix(in_srgb,var(--color-teal)_5%,transparent)_100%)] opacity-80";

const labelClass = "mb-2 block text-sm font-black text-[var(--color-text)]";

const inputClass =
  "min-h-12 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-bold text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-muted)]/70 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-primary)_16%,transparent)] disabled:cursor-not-allowed disabled:opacity-60";

const secondaryButtonClass =
  "inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 text-sm font-black text-[var(--color-text)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--color-surface-soft)] focus:outline-none focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-primary)_14%,transparent)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60";

export function UploadControlPanel({
  folder,
  lookupId,
  progress,
  busy,
  onFolderChange,
  onLookupIdChange,
  onLookup,
  onUpload,
}: UploadControlPanelProps) {
  return (
    <section className={panelClass}>
      <div className={subtleBgClass} />

      <div className="relative z-10">
        <h2 className="m-0 font-display text-xl font-black text-[var(--color-text)]">
          رفع ملف جديد
        </h2>

        <p className="mt-2 text-sm font-bold leading-7 text-[var(--color-muted)]">
          الصور حتى 5 MB والفيديو حتى 50 MB.
        </p>

        <div className="mt-5">
          <label className={labelClass} htmlFor="folder">
            المجلد
          </label>

          <input
            id="folder"
            className={inputClass}
            value={folder}
            onChange={(event) => onFolderChange(event.target.value)}
            disabled={busy}
            placeholder="مثال: gallery أو services"
          />
        </div>

        <label className="mt-5 grid min-h-48 cursor-pointer place-items-center rounded-[26px] border-2 border-dashed border-[color-mix(in_srgb,var(--color-border)_88%,var(--color-primary))] bg-[var(--color-surface-soft)] p-6 text-center transition hover:border-[var(--color-primary)] hover:bg-[color-mix(in_srgb,var(--color-primary)_7%,var(--color-surface-soft))]">
          <div>
            <span className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-[color-mix(in_srgb,var(--color-gold)_12%,transparent)] text-[var(--color-primary-dark)] dark:text-[var(--color-gold)]">
              <UploadCloud size={34} />
            </span>

            <strong className="block text-base font-black text-[var(--color-text)]">
              اختر صورة أو فيديو
            </strong>

            <span className="mt-2 block text-sm font-bold text-[var(--color-muted)]">
              JPEG, PNG, WebP, GIF, MP4, WebM, MOV
            </span>
          </div>

          <input
            className="sr-only"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
            disabled={busy}
            onChange={(event) => onUpload(event.target.files?.[0])}
          />
        </label>

        {progress !== null && (
          <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-3">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-black text-[var(--color-muted)]">
                جارٍ الرفع
              </span>

              <strong className="text-[var(--color-text)]">
                {Math.round(progress)}%
              </strong>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-[var(--color-surface)]">
              <div
                className="h-full rounded-full bg-[var(--color-primary)] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="my-6 border-t border-[var(--color-border)]" />

        <div>
          <label className={labelClass} htmlFor="lookup">
            البحث برقم الملف
          </label>

          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="lookup"
              className={inputClass}
              type="number"
              min={1}
              value={lookupId}
              onChange={(event) => onLookupIdChange(event.target.value)}
              disabled={busy}
              placeholder="رقم الملف"
            />

            <button
              className={secondaryButtonClass}
              type="button"
              disabled={busy}
              onClick={onLookup}
            >
              <Search size={17} />
              بحث
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
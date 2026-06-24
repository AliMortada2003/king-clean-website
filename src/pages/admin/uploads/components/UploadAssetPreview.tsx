import { File, FileImage, Trash2 } from "lucide-react";

import { EmptyState } from "../../../../components/ui";
import { resolveMediaUrl } from "../../../../lib/api-client";
import { formatDate } from "../../../../lib/format";
import type { UploadAsset } from "../types";

type UploadAssetPreviewProps = {
  asset: UploadAsset | null;
  onDelete: () => void;
};

const panelClass =
  "relative overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_90%,transparent)] p-5 text-[var(--color-text)] shadow-[var(--shadow-soft)] backdrop-blur sm:p-6";

const subtleBgClass =
  "pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-surface)_100%,transparent)_0%,color-mix(in_srgb,var(--color-gold)_5%,transparent)_58%,color-mix(in_srgb,var(--color-teal)_5%,transparent)_100%)] opacity-80";

const metaCardClass =
  "rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3";

const metaLabelClass =
  "mb-1 text-xs font-black text-[var(--color-muted)]";

const metaValueClass =
  "m-0 text-sm font-bold text-[var(--color-text)]";

export function UploadAssetPreview({
  asset,
  onDelete,
}: UploadAssetPreviewProps) {
  if (!asset) {
    return (
      <section className={panelClass}>
        <div className={subtleBgClass} />

        <div className="relative z-10">
          <EmptyState
            title="لا يوجد ملف محدد"
            description="ارفع ملفًا جديدًا أو ابحث عن ملف موجود بواسطة رقمه."
          />
        </div>
      </section>
    );
  }

  const isImage = asset.contentType.startsWith("image/");
  const previewUrl = resolveMediaUrl(asset.publicUrl);

  return (
    <section className={panelClass}>
      <div className={subtleBgClass} />

      <div className="relative z-10">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[color-mix(in_srgb,var(--color-gold)_12%,transparent)] text-[var(--color-primary-dark)] dark:text-[var(--color-gold)]">
              {isImage ? <FileImage size={22} /> : <File size={22} />}
            </span>

            <div className="min-w-0">
              <h2 className="m-0 break-words font-display text-lg font-black leading-7 text-[var(--color-text)] sm:text-xl">
                {asset.fileName}
              </h2>

              <span className="mt-1 block text-sm font-bold text-[var(--color-muted)]">
                رقم الملف #{asset.id}
              </span>
            </div>
          </div>

          <button
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-2xl border border-[color-mix(in_srgb,var(--color-danger)_22%,transparent)] bg-[color-mix(in_srgb,var(--color-danger)_8%,transparent)] px-4 text-sm font-black text-[var(--color-danger)] transition hover:-translate-y-0.5 hover:bg-[var(--color-danger)] hover:text-white focus:outline-none focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-danger)_16%,transparent)]"
            onClick={onDelete}
            type="button"
          >
            <Trash2 size={16} />
            حذف
          </button>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-2">
          {isImage ? (
            <img
              className="max-h-[440px] w-full rounded-2xl object-contain"
              src={previewUrl}
              alt={asset.fileName}
              loading="lazy"
            />
          ) : (
            <video
              className="max-h-[440px] w-full rounded-2xl bg-black"
              src={previewUrl}
              controls
            />
          )}
        </div>

        <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
          <div className={metaCardClass}>
            <dt className={metaLabelClass}>نوع الملف</dt>
            <dd className={metaValueClass}>{asset.contentType}</dd>
          </div>

          <div className={metaCardClass}>
            <dt className={metaLabelClass}>الحجم</dt>
            <dd className={metaValueClass}>
              {(asset.size / 1024 / 1024).toFixed(2)} MB
            </dd>
          </div>

          <div className={metaCardClass}>
            <dt className={metaLabelClass}>المجلد</dt>
            <dd className={metaValueClass}>{asset.folder}</dd>
          </div>

          <div className={metaCardClass}>
            <dt className={metaLabelClass}>تاريخ الرفع</dt>
            <dd className={metaValueClass}>{formatDate(asset.createdAt)}</dd>
          </div>

          <div className={`${metaCardClass} sm:col-span-2`}>
            <dt className={metaLabelClass}>الرابط العام</dt>
            <dd className={`${metaValueClass} break-all`} dir="ltr">
              {asset.publicUrl}
            </dd>
          </div>

          <div className={`${metaCardClass} sm:col-span-2`}>
            <dt className={metaLabelClass}>Bunny Storage Key</dt>
            <dd className={`${metaValueClass} break-all`} dir="ltr">
              {asset.storageObjectKey}
            </dd>
          </div>

          <div className={`${metaCardClass} sm:col-span-2`}>
            <dt className={metaLabelClass}>Google File ID — توافق قديم</dt>
            <dd className={`${metaValueClass} break-all`} dir="ltr">
              {asset.googleFileId || "—"}
            </dd>
          </div>

          {asset.thumbnailUrl && (
            <div className={`${metaCardClass} sm:col-span-2`}>
              <dt className={metaLabelClass}>رابط الصورة المصغرة</dt>
              <dd className={`${metaValueClass} break-all`} dir="ltr">
                {asset.thumbnailUrl}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </section>
  );
}
import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { toast } from "sonner";

import { adminApi } from "../../../../api/endpoints";
import { resolveMediaUrl } from "../../../../lib/api-client";

type MediaUrlFieldProps = {
    value?: string;
    onChange: (value: string) => void;
    kind: "image" | "video";
    folder: string;
    required?: boolean;
};

const inputClass =
    "min-h-12 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-bold text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-muted)]/70 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-primary)_16%,transparent)] disabled:cursor-not-allowed disabled:opacity-60";

const uploadButtonClass =
    "inline-flex min-h-12 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 text-sm font-black text-[var(--color-text)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--color-surface-soft)] focus-within:ring-4 focus-within:ring-[color-mix(in_srgb,var(--color-primary)_14%,transparent)]";

export function MediaUrlField({
    value,
    onChange,
    kind,
    folder,
    required,
}: MediaUrlFieldProps) {
    const [progress, setProgress] = useState<number | null>(null);

    const upload = async (file?: File) => {
        if (!file) return;

        const allowed =
            kind === "image"
                ? ["image/jpeg", "image/png", "image/webp", "image/gif"]
                : ["video/mp4", "video/webm", "video/quicktime"];

        const max = kind === "image" ? 5 * 1024 * 1024 : 50 * 1024 * 1024;

        if (!allowed.includes(file.type)) {
            toast.error("نوع الملف غير مدعوم.");
            return;
        }

        if (file.size > max) {
            toast.error(
                kind === "image"
                    ? "حجم الصورة يتجاوز 5 MB."
                    : "حجم الفيديو يتجاوز 50 MB.",
            );
            return;
        }

        try {
            setProgress(0);

            const asset = await adminApi.upload(file, folder, setProgress);

            onChange(asset.publicUrl);
            toast.success("تم رفع الملف.");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "تعذر رفع الملف.");
        } finally {
            setProgress(null);
        }
    };

    const previewUrl = value ? resolveMediaUrl(value) : "";

    return (
        <div className="grid gap-3">
            <div className="flex flex-col gap-2 sm:flex-row">
                <input
                    className={inputClass}
                    required={required}
                    value={value || ""}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={
                        kind === "image"
                            ? "رابط الصورة أو ارفع ملفاً"
                            : "رابط الفيديو أو ارفع ملفاً"
                    }
                    dir="ltr"
                />

                <label className={uploadButtonClass}>
                    <UploadCloud size={18} />
                    رفع
                    <input
                        className="sr-only"
                        type="file"
                        accept={
                            kind === "image"
                                ? "image/jpeg,image/png,image/webp,image/gif"
                                : "video/mp4,video/webm,video/quicktime"
                        }
                        onChange={(event) => void upload(event.target.files?.[0])}
                    />
                </label>
            </div>

            {progress !== null && (
                <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-1">
                    <div className="mb-1 flex items-center justify-between px-1 text-xs font-black text-[var(--color-muted)]">
                        <span>جارٍ الرفع</span>
                        <span>{Math.round(progress)}%</span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-[var(--color-surface)]">
                        <div
                            className="h-full rounded-full bg-[var(--color-primary)] transition-all"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {previewUrl && kind === "image" && (
                <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-2">
                    <img
                        className="max-h-48 w-full rounded-xl object-cover"
                        src={previewUrl}
                        alt="معاينة الملف"
                        loading="lazy"
                        onError={(event) => {
                            event.currentTarget.style.display = "none";
                        }}
                    />
                </div>
            )}

            {value && kind === "video" && (
                <p className="m-0 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3 text-xs font-bold text-[var(--color-muted)]">
                    تم تحديد رابط فيديو. يمكن حفظ النموذج الآن.
                </p>
            )}
        </div>
    );
}
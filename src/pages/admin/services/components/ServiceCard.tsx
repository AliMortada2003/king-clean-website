import { Eye, EyeOff, Pencil, Sparkles, Trash2 } from "lucide-react";

import { resolveMediaUrl } from "../../../../lib/api-client";
import type { AdminServiceDto } from "../../../../types/api";

type ServiceCardProps = {
    item: AdminServiceDto;
    onEdit: (id: number) => void;
    onToggleActive: (item: AdminServiceDto) => void;
    onDelete: (item: AdminServiceDto) => void;
};

export function ServiceCard({
    item,
    onEdit,
    onToggleActive,
    onDelete,
}: ServiceCardProps) {
    const image = item.imageUrl ? resolveMediaUrl(item.imageUrl) : "";

    return (
        <article className="group overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-[var(--color-text)] shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-strong)]">
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-[var(--color-surface-soft)]">
                {image ? (
                    <img
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        src={image}
                        alt={item.name}
                        loading="lazy"
                        onError={(event) => {
                            event.currentTarget.style.display = "none";
                        }}
                    />
                ) : (
                    <div className="grid h-full w-full place-items-center text-[var(--color-muted)]">
                        <Sparkles size={42} />
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />

                <span
                    className={[
                        "absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-black shadow-sm backdrop-blur",
                        item.isActive
                            ? "border-[color-mix(in_srgb,var(--color-success)_30%,transparent)] bg-[color-mix(in_srgb,var(--color-success)_18%,transparent)] text-white"
                            : "border-white/15 bg-black/35 text-white/75",
                    ].join(" ")}
                >
                    <span
                        className={[
                            "h-2 w-2 rounded-full",
                            item.isActive ? "bg-[var(--color-success)]" : "bg-white/50",
                        ].join(" ")}
                    />
                    {item.isActive ? "منشورة" : "غير منشورة"}
                </span>

                <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="m-0 line-clamp-2 font-display text-lg font-black leading-7 text-white">
                        {item.name}
                    </h3>

                    {item.shortDescription && (
                        <p className="mt-1 line-clamp-2 text-xs font-bold leading-5 text-white/75">
                            {item.shortDescription}
                        </p>
                    )}
                </div>
            </div>

            {item.areas?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                    {item.areas.slice(0, 3).map((area) => (
                        <span
                            key={area.id}
                            className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-3 py-1 text-xs font-black text-[var(--color-muted)]"
                        >
                            {area.name}
                        </span>
                    ))}

                    {item.areas.length > 3 && (
                        <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-3 py-1 text-xs font-black text-[var(--color-muted)]">
                            +{item.areas.length - 3}
                        </span>
                    )}
                </div>
            )}

            <div className="mt-3 grid grid-cols-3 gap-2">
                <button
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm font-black text-[var(--color-text)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--color-surface-soft)] focus:outline-none focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-primary)_14%,transparent)]"
                    onClick={() => onEdit(item.id)}
                    type="button"
                >
                    <Pencil size={15} />
                    تعديل
                </button>

                <button
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-2xl border border-[color-mix(in_srgb,var(--color-primary)_28%,transparent)] bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)] px-3 text-sm font-black text-[var(--color-primary-dark)] transition hover:-translate-y-0.5 hover:bg-[var(--color-primary)] hover:text-[var(--color-navy)] focus:outline-none focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-primary)_16%,transparent)]"
                    onClick={() => onToggleActive(item)}
                    type="button"
                >
                    {item.isActive ? <EyeOff size={15} /> : <Eye size={15} />}
                    {item.isActive ? "تعطيل" : "تفعيل"}
                </button>

                <button
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-2xl border border-[color-mix(in_srgb,var(--color-danger)_20%,transparent)] bg-[color-mix(in_srgb,var(--color-danger)_8%,transparent)] px-3 text-sm font-black text-[var(--color-danger)] transition hover:-translate-y-0.5 hover:bg-[var(--color-danger)] hover:text-white focus:outline-none focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-danger)_16%,transparent)]"
                    onClick={() => onDelete(item)}
                    type="button"
                >
                    <Trash2 size={15} />
                    حذف
                </button>
            </div>
        </article>
    );
}

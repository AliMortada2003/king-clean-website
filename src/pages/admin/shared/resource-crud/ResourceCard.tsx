import { Pencil, Star, Trash2 } from "lucide-react";

import type { AdminResourceDto, AdminResourceName } from "../../../../types/api";
import { ActiveBadge } from "../../../../components/ui";
import { resolveMediaUrl } from "../../../../lib/api-client";
import { formatDate } from "../../../../lib/format";
import {
    getResourceItemDescription,
    getResourceItemImage,
    getResourceItemTitle,
} from "./helpers";

type ResourceCardProps = {
    resource: AdminResourceName;
    item: AdminResourceDto | any;
    onEdit: (id: number) => void;
    onDelete: (item: any) => void;
};

export function ResourceCard({
    resource,
    item,
    onEdit,
    onDelete,
}: ResourceCardProps) {
    const image = getResourceItemImage(item);
    const title = getResourceItemTitle(resource, item);
    const description = getResourceItemDescription(resource, item);

    return (
        <article className="group relative overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_90%,transparent)] p-4 text-[var(--color-text)] shadow-[var(--shadow-soft)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[var(--shadow-strong)]">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-surface)_100%,transparent)_0%,color-mix(in_srgb,var(--color-gold)_5%,transparent)_58%,color-mix(in_srgb,var(--color-teal)_5%,transparent)_100%)] opacity-80" />

            <div className="relative z-10">
                {image && (
                    <div className="mb-4 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)]">
                        <img
                            className="aspect-video w-full object-cover transition duration-500 group-hover:scale-105"
                            src={resolveMediaUrl(image)}
                            alt={title}
                            loading="lazy"
                            onError={(event) => {
                                event.currentTarget.style.display = "none";
                            }}
                        />
                    </div>
                )}

                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="m-0 line-clamp-2 font-display text-lg font-black leading-7 text-[var(--color-text)]">
                            {title}
                        </h3>

                        {description && (
                            <p className="mt-2 line-clamp-3 text-sm font-bold leading-7 text-[var(--color-muted)]">
                                {description}
                            </p>
                        )}
                    </div>

                    {"isActive" in item && (
                        <div className="shrink-0">
                            <ActiveBadge active={item.isActive} />
                        </div>
                    )}
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-black text-[var(--color-muted)]">
                    {"displayOrder" in item && (
                        <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5">
                            الترتيب: {item.displayOrder}
                        </span>
                    )}

                    {item.createdAt && (
                        <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5">
                            أضيف: {formatDate(item.createdAt, true)}
                        </span>
                    )}

                    {resource === "reviews" && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-[color-mix(in_srgb,var(--color-gold)_24%,transparent)] bg-[color-mix(in_srgb,var(--color-gold)_10%,transparent)] px-3 py-1.5 text-[var(--color-primary-dark)] dark:text-[var(--color-gold)]">
                            <Star size={14} fill="currentColor" />
                            {item.rating}
                        </span>
                    )}
                </div>

                <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <button
                        className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm font-black text-[var(--color-text)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--color-surface-soft)] focus:outline-none focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-primary)_14%,transparent)]"
                        onClick={() => onEdit(item.id)}
                        type="button"
                    >
                        <Pencil size={15} />
                        تعديل
                    </button>

                    <button
                        className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-2xl border border-[color-mix(in_srgb,var(--color-danger)_20%,transparent)] bg-[color-mix(in_srgb,var(--color-danger)_8%,transparent)] px-4 text-sm font-black text-[var(--color-danger)] transition hover:-translate-y-0.5 hover:bg-[var(--color-danger)] hover:text-white focus:outline-none focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-danger)_16%,transparent)]"
                        onClick={() => onDelete(item)}
                        type="button"
                    >
                        <Trash2 size={15} />
                        تعطيل
                    </button>
                </div>
            </div>
        </article>
    );
}
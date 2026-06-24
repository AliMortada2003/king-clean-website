import { Eye, EyeOff, MapPinned, Pencil, Trash2 } from "lucide-react";

import type { AdminAreaDto } from "../../../../types/api";

type AreaCardProps = {
  item: AdminAreaDto;
  onEdit: (id: number) => void;
  onToggleActive: (item: AdminAreaDto) => void;
  onDelete: (item: AdminAreaDto) => void;
};

export function AreaCard({
  item,
  onEdit,
  onToggleActive,
  onDelete,
}: AreaCardProps) {
  return (
    <article className="group flex min-h-[260px] flex-col overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-[var(--color-text)] shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-strong)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[color-mix(in_srgb,var(--color-teal)_12%,transparent)] text-[var(--color-teal)]">
          <MapPinned size={22} />
        </span>

        <span
          className={[
            "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black",
            item.isActive
              ? "border-[color-mix(in_srgb,var(--color-success)_24%,transparent)] bg-[color-mix(in_srgb,var(--color-success)_12%,transparent)] text-[var(--color-success)]"
              : "border-[color-mix(in_srgb,var(--color-muted)_24%,transparent)] bg-[color-mix(in_srgb,var(--color-muted)_12%,transparent)] text-[var(--color-muted)]",
          ].join(" ")}
        >
          <span
            className={[
              "h-2 w-2 rounded-full",
              item.isActive ? "bg-[var(--color-success)]" : "bg-[var(--color-muted)]",
            ].join(" ")}
          />
          {item.isActive ? "منشورة" : "غير منشورة"}
        </span>
      </div>

      <h3 className="m-0 line-clamp-2 font-display text-lg font-black leading-7 text-[var(--color-text)]">
        {item.name}
      </h3>

      {item.description && (
        <p className="mt-3 line-clamp-4 text-sm font-bold leading-7 text-[var(--color-muted)]">
          {item.description}
        </p>
      )}

      {item.services?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {item.services.slice(0, 3).map((service) => (
            <span
              key={service.id}
              className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-3 py-1 text-xs font-black text-[var(--color-muted)]"
            >
              {service.name}
            </span>
          ))}

          {item.services.length > 3 && (
            <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-3 py-1 text-xs font-black text-[var(--color-muted)]">
              +{item.services.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="mt-auto pt-5">
        <div className="grid grid-cols-3 gap-2">
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
      </div>
    </article>
  );
}

import { useState } from "react";
import { Eye, EyeOff, ImageIcon, Pencil, Plus, Trash2 } from "lucide-react";

import { Seo } from "../../../components/Seo";
import {
  EmptyState,
  ErrorState,
  Modal,
  PageLoading,
} from "../../../components/ui";
import { resolveMediaUrl } from "../../../lib/api-client";
import type { AdminGalleryItemDto } from "../../../types/api";
import { AdminPageHeader } from "../shared/components/AdminPageHeader";
import { GalleryModals } from "./components/GalleryModals";
import { useGalleryPage } from "./hooks/useGalleryPage";

export function GalleryPage() {
  const page = useGalleryPage();
  const [previewImage, setPreviewImage] = useState<AdminGalleryItemDto | null>(
    null,
  );

  return (
    <>
      <Seo
        title="معرض الأعمال | KING CLEAN"
        description="إدارة صور معرض أعمال KING CLEAN وربطها بالخدمات."
        noIndex
      />

      <AdminPageHeader
        title="معرض الأعمال"
        description="إدارة صور الأعمال وربطها بالخدمات المعروضة في الموقع."
        action={
          <button
            type="button"
            onClick={page.openCreate}
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] px-5 text-sm font-black text-[var(--color-navy)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--color-gold-dark)] hover:text-white focus:outline-none focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-primary)_18%,transparent)]"
          >
            <Plus size={18} />
            إضافة صورة
          </button>
        }
      />

      {page.query.isLoading ? (
        <PageLoading />
      ) : page.query.isError ? (
        <ErrorState
          error={page.query.error}
          retry={() => void page.query.refetch()}
        />
      ) : page.items.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {page.items.map((item) => (
            <GalleryCard
              key={item.id}
              item={item}
              onEdit={page.openEdit}
              onToggleActive={page.toggleActive}
              onDelete={page.openDelete}
              onPreview={setPreviewImage}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="لا توجد صور"
          description="أضف أول صورة للظهور في معرض الأعمال بالموقع."
        />
      )}

      <GalleryModals page={page} />

      {previewImage && (
        <ImagePreviewModal
          item={previewImage}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </>
  );
}

type GalleryCardProps = {
  item: AdminGalleryItemDto;
  onEdit: (id: number) => void;
  onToggleActive: (item: AdminGalleryItemDto) => void;
  onDelete: (item: AdminGalleryItemDto) => void;
  onPreview: (item: AdminGalleryItemDto) => void;
};

function GalleryCard({
  item,
  onEdit,
  onToggleActive,
  onDelete,
  onPreview,
}: GalleryCardProps) {
  const imageUrl = resolveMediaUrl(item.imageUrl);

  return (
    <article className="group overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-[var(--color-text)] shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-strong)]">
      <button
        type="button"
        onClick={() => onPreview(item)}
        className="relative block aspect-video w-full overflow-hidden rounded-2xl bg-[var(--color-surface-soft)] text-start focus:outline-none focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-primary)_18%,transparent)]"
        aria-label={`عرض صورة ${item.title}`}
      >
        <img
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          src={imageUrl}
          alt={item.title}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />

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
          {item.isActive ? "منشور" : "غير منشور"}
        </span>

        {item.isFeatured && (
          <span className="absolute left-3 top-3 rounded-full border border-[color-mix(in_srgb,var(--color-gold)_34%,transparent)] bg-[color-mix(in_srgb,var(--color-gold)_18%,transparent)] px-3 py-1 text-xs font-black text-white shadow-sm backdrop-blur">
            مميزة
          </span>
        )}

        <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[var(--color-navy)] shadow-xl transition group-hover:scale-110">
          <ImageIcon size={28} />
        </span>

        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="m-0 line-clamp-2 font-display text-lg font-black leading-7 text-white">
            {item.title}
          </h3>
        </div>
      </button>

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

type ImagePreviewModalProps = {
  item: AdminGalleryItemDto;
  onClose: () => void;
};

function ImagePreviewModal({ item, onClose }: ImagePreviewModalProps) {
  const imageUrl = resolveMediaUrl(item.imageUrl);

  return (
    <Modal title={`معاينة الصورة: ${item.title}`} onClose={onClose}>
      <div className="space-y-4">
        <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-soft)]">
          <img
            className="max-h-[70vh] w-full object-contain"
            src={imageUrl}
            alt={item.title}
          />
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4">
          <h3 className="m-0 font-display text-lg font-black text-[var(--color-text)]">
            {item.title}
          </h3>

          {item.serviceName && (
            <p className="mt-2 text-sm font-bold text-[var(--color-muted)]">
              الخدمة: {item.serviceName}
            </p>
          )}

          <p
            className="mt-4 break-all rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-xs font-bold text-[var(--color-muted)]"
            dir="ltr"
          >
            {item.imageUrl}
          </p>
        </div>
      </div>
    </Modal>
  );
}

import { useState } from "react";
import { Eye, EyeOff, Pencil, PlaySquare, Plus, Trash2 } from "lucide-react";

import { Seo } from "../../../components/Seo";
import {
  EmptyState,
  ErrorState,
  Modal,
  PageLoading,
} from "../../../components/ui";
import { resolveMediaUrl } from "../../../lib/api-client";
import type { AdminVideoItemDto } from "../../../types/api";
import { AdminPageHeader } from "../shared/components/AdminPageHeader";
import { VideosModals } from "./components/VideosModals";
import { useVideosPage } from "./hooks/useVideosPage";

export function VideosPage() {
  const page = useVideosPage();
  const [previewVideo, setPreviewVideo] = useState<AdminVideoItemDto | null>(
    null,
  );

  return (
    <>
      <Seo
        title="الفيديوهات | KING CLEAN"
        description="إدارة فيديوهات KING CLEAN وربطها بالخدمات والمناطق."
        noIndex
      />

      <AdminPageHeader
        title="الفيديوهات"
        description="إدارة الفيديوهات والصور المصغرة وربطها بالخدمات والمناطق."
        action={
          <button
            type="button"
            onClick={page.openCreate}
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] px-5 text-sm font-black text-[var(--color-navy)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--color-gold-dark)] hover:text-white focus:outline-none focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-primary)_18%,transparent)]"
          >
            <Plus size={18} />
            إضافة فيديو
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
            <VideoCard
              key={item.id}
              item={item}
              onEdit={page.openEdit}
              onToggleActive={page.toggleActive}
              onDelete={page.openDelete}
              onPreview={setPreviewVideo}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="لا توجد فيديوهات"
          description="أضف أول فيديو للظهور في صفحة الفيديوهات بالموقع."
        />
      )}

      <VideosModals page={page} />

      {previewVideo && (
        <VideoPreviewModal
          item={previewVideo}
          onClose={() => setPreviewVideo(null)}
        />
      )}
    </>
  );
}

type VideoCardProps = {
  item: AdminVideoItemDto;
  onEdit: (id: number) => void;
  onToggleActive: (item: AdminVideoItemDto) => void;
  onDelete: (item: AdminVideoItemDto) => void;
  onPreview: (item: AdminVideoItemDto) => void;
};

function VideoCard({
  item,
  onEdit,
  onToggleActive,
  onDelete,
  onPreview,
}: VideoCardProps) {
  const previewImage = item.thumbnailUrl
    ? resolveMediaUrl(item.thumbnailUrl)
    : "";

  const videoUrl = item.videoUrl ? resolveMediaUrl(item.videoUrl) : "";

  return (
    <article className="group overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-[var(--color-text)] shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-strong)]">
      <button
        type="button"
        onClick={() => onPreview(item)}
        className="relative block aspect-video w-full overflow-hidden rounded-2xl bg-[var(--color-surface-soft)] text-start focus:outline-none focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-primary)_18%,transparent)]"
        aria-label={`مشاهدة فيديو ${item.title}`}
      >
        {previewImage ? (
          <img
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            src={previewImage}
            alt={item.title}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        ) : videoUrl ? (
          <video
            className="h-full w-full bg-black object-cover"
            src={videoUrl}
            muted
            preload="metadata"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-[var(--color-muted)]">
            <PlaySquare size={42} />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/20" />

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
            مميز
          </span>
        )}

        <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[var(--color-navy)] shadow-xl transition group-hover:scale-110">
          <PlaySquare size={28} fill="currentColor" />
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
type VideoPreviewModalProps = {
  item: AdminVideoItemDto;
  onClose: () => void;
};

function VideoPreviewModal({ item, onClose }: VideoPreviewModalProps) {
  const videoUrl = resolveMediaUrl(item.videoUrl);

  return (
    <Modal title={item.title} onClose={onClose}>
      <div className="space-y-4">
        <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-black">
          <video
            className="aspect-video w-full bg-black"
            src={videoUrl}
            controls
            autoPlay
            playsInline
          >
            متصفحك لا يدعم تشغيل الفيديو.
          </video>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4">
          <h3 className="m-0 font-display text-lg font-black text-[var(--color-text)]">
            {item.title}
          </h3>
        </div>
      </div>
    </Modal>
  );
}

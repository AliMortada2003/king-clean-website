import { Eye, EyeOff, Pencil, Plus, Quote, Star, Trash2 } from "lucide-react";

import { Seo } from "../../../components/Seo";
import {
  EmptyState,
  ErrorState,
  PageLoading,
} from "../../../components/ui";
import type { AdminReviewDto } from "../../../types/api";
import { AdminPageHeader } from "../shared/components/AdminPageHeader";
import { ReviewsModals } from "./components/ReviewsModals";
import { useReviewsPage } from "./hooks/useReviewsPage";

export function ReviewsPage() {
  const page = useReviewsPage();

  return (
    <>
      <Seo
        title="آراء العملاء | KING CLEAN"
        description="إدارة آراء العملاء المنشورة على موقع KING CLEAN."
        noIndex
      />

      <AdminPageHeader
        title="آراء العملاء"
        description="إدارة تقييمات وآراء العملاء المعروضة في الموقع."
        action={
          <button
            type="button"
            onClick={page.openCreate}
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] px-5 text-sm font-black text-[var(--color-navy)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--color-gold-dark)] hover:text-white focus:outline-none focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-primary)_18%,transparent)]"
          >
            <Plus size={18} />
            إضافة رأي
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
            <ReviewCard
              key={item.id}
              item={item}
              onEdit={page.openEdit}
              onToggleActive={page.toggleActive}
              onDelete={page.openDelete}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="لا توجد آراء"
          description="أضف أول رأي عميل للظهور في الموقع."
        />
      )}

      <ReviewsModals page={page} />
    </>
  );
}

type ReviewCardProps = {
  item: AdminReviewDto;
  onEdit: (id: number) => void;
  onToggleActive: (item: AdminReviewDto) => void;
  onDelete: (item: AdminReviewDto) => void;
};

function ReviewCard({ item, onEdit, onToggleActive, onDelete }: ReviewCardProps) {
  return (
    <article className="group flex min-h-[260px] flex-col overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-[var(--color-text)] shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-strong)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[color-mix(in_srgb,var(--color-gold)_12%,transparent)] text-[var(--color-primary-dark)] dark:text-[var(--color-gold)]">
          <Quote size={22} />
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
          {item.isActive ? "منشور" : "غير منشور"}
        </span>
      </div>

      <div className="mb-3 flex items-center gap-1 text-[var(--color-primary-dark)] dark:text-[var(--color-gold)]">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            size={16}
            fill={index < item.rating ? "currentColor" : "none"}
            className={index < item.rating ? "" : "text-[var(--color-muted)]/40"}
          />
        ))}
      </div>

      <h3 className="m-0 font-display text-lg font-black leading-7 text-[var(--color-text)]">
        {item.customerName}
      </h3>

      <p className="mt-3 line-clamp-4 flex-1 text-sm font-bold leading-7 text-[var(--color-muted)]">
        {item.comment}
      </p>

      <div className="mt-5 grid grid-cols-3 gap-2">
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

import { Plus } from "lucide-react";

import { Seo } from "../../../components/Seo";
import { EmptyState, ErrorState, PageLoading } from "../../../components/ui";
import { AdminPageHeader } from "../shared/components/AdminPageHeader";
import { AreaCard } from "./components/AreaCard";
import { AreasModals } from "./components/AreasModals";
import { useAreasPage } from "./hooks/useAreasPage";

export function AreasPage() {
  const page = useAreasPage();

  return (
    <>
      <Seo
        title="المناطق | KING CLEAN"
        description="إدارة مناطق تغطية KING CLEAN وربطها بالخدمات."
        noIndex
      />

      <AdminPageHeader
        title="المناطق"
        description="إدارة مناطق التغطية المعروضة في الموقع وربط كل منطقة بالخدمات المناسبة."
        action={
          <button
            type="button"
            onClick={page.openCreate}
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] px-5 text-sm font-black text-[var(--color-navy)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--color-gold-dark)] hover:text-white focus:outline-none focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-primary)_18%,transparent)]"
          >
            <Plus size={18} />
            إضافة منطقة
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
            <AreaCard
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
          title="لا توجد مناطق"
          description="أضف أول منطقة للظهور في موقع KING CLEAN."
        />
      )}

      <AreasModals page={page} />
    </>
  );
}

import { Plus } from "lucide-react";

import { Seo } from "../../../components/Seo";
import { EmptyState, ErrorState, PageLoading } from "../../../components/ui";
import { AdminPageHeader } from "../shared/components/AdminPageHeader";
import { ServiceCard } from "./components/ServiceCard";
import { ServicesModals } from "./components/ServicesModals";
import { useServicesPage } from "./hooks/useServicesPage";


export function ServicesPage() {
  const page = useServicesPage();

  return (
    <>
      <Seo
        title="الخدمات | KING CLEAN"
        description="إدارة خدمات KING CLEAN وربطها بالمناطق وبيانات SEO."
        noIndex
      />

      <AdminPageHeader
        title="الخدمات"
        description="إدارة الخدمات المعروضة في الموقع وربط كل خدمة بالمناطق المناسبة."
        action={
          <button
            type="button"
            onClick={page.openCreate}
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] px-5 text-sm font-black text-[var(--color-navy)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--color-gold-dark)] hover:text-white focus:outline-none focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-primary)_18%,transparent)]"
          >
            <Plus size={18} />
            إضافة خدمة
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
            <ServiceCard
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
          title="لا توجد خدمات"
          description="أضف أول خدمة للظهور في موقع KING CLEAN."
        />
      )}

      <ServicesModals page={page} />
    </>
  );
}

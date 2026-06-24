import { useSearchParams } from "react-router-dom";
import { useGallery } from "../../../api/hooks";
import { Seo } from "../../../components/Seo";
import {
  containerClass,
  mediaGridClass,
  mediaOverlayClass,
  mediaTileClass,
  PageHero,
  sectionClass,
} from "../../../components/public/PublicPrimitives";
import { EmptyState, ErrorState, PageLoading } from "../../../components/ui";
import { resolveMediaUrl } from "../../../lib/api-client";
import { MediaFilters } from "../../../types/api";
import { MediaFiltersBar } from "../MediaFiltersBar/MediaFiltersBar";

export function GalleryPage() {
  const [params, setParams] = useSearchParams();
  const filters: MediaFilters = {
    serviceId: params.get("serviceId")
      ? Number(params.get("serviceId"))
      : undefined,
    areaId: params.get("areaId") ? Number(params.get("areaId")) : undefined,
  };
  const setFilters = (next: MediaFilters) => {
    const search = new URLSearchParams();
    if (next.serviceId) search.set("serviceId", String(next.serviceId));
    if (next.areaId) search.set("areaId", String(next.areaId));
    setParams(search);
  };
  const query = useGallery(filters);

  return (
    <>
      <Seo
        title="معرض أعمال KING CLEAN"
        description="صور مختارة من أعمال وخدمات KING CLEAN في الكويت."
      />
      <PageHero
        title="معرض الأعمال"
        description="تصفح صور الأعمال حسب الخدمة أو المنطقة."
      />
      <section className={sectionClass}>
        <div className={containerClass}>
          <MediaFiltersBar filters={filters} setFilters={setFilters} />
          {query.isLoading ? (
            <PageLoading />
          ) : query.isError ? (
            <ErrorState error={query.error} retry={query.refetch} />
          ) : query.data?.length ? (
            <div className={mediaGridClass}>
              {query.data.map((item) => (
                <article
                  className={`${mediaTileClass} md:col-span-6 lg:col-span-4`}
                  key={item.id}
                >
                  <img
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 hover:scale-105"
                    src={resolveMediaUrl(item.imageUrl)}
                    alt={item.title}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  <div className={mediaOverlayClass}>
                    <strong className="font-display block text-lg">
                      {item.title}
                    </strong>
                    <div className="mt-2 text-sm font-bold text-white/78">
                      {item.serviceName}
                      {item.areaName ? ` · ${item.areaName}` : ""}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="لا توجد صور مطابقة" />
          )}
        </div>
      </section>
    </>
  );
}

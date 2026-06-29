import { useGallery, useServices } from "../../../api/hooks";
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

export function GalleryPage() {
  const query = useGallery();
  return (
    <>
      <Seo
        title="معرض أعمال كينج كلين الكويت | King Clean Gallery"
        description="شاهد صور من أعمال كينج كلين الكويت في تنظيف المنازل والشقق والفلل والمكاتب وخدمات التنظيف المختلفة داخل الكويت."
        canonicalPath="/gallery"
        keywords={[
          "معرض أعمال كينج كلين",
          "King Clean Gallery",
          "صور تنظيف في الكويت",
          "شركة تنظيف في الكويت",
          "تنظيف منازل الكويت",
          "تنظيف شقق الكويت",
          "تنظيف فلل الكويت",
          "تنظيف مكاتب الكويت",
        ]}
      />

      <PageHero
        title="معرض الأعمال"
      // description="شوف جزء من شغل كينج كلين في خدمات التنظيف داخل الكويت."
      />

      <section className={sectionClass}>
        <div className={containerClass}>
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
                    alt={item.title || "صورة من أعمال كينج كلين الكويت"}
                    loading="lazy"
                    decoding="async"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />

                  <div className={mediaOverlayClass}>
                    <strong className="font-display block text-lg">
                      {item.title || "من أعمال كينج كلين"}
                    </strong>

                    {(item.serviceName || item.areaName) && (
                      <div className="mt-2 text-sm font-bold text-white/78">
                        {item.serviceName}
                        {item.serviceName && item.areaName ? " · " : ""}
                        {item.areaName}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="لا توجد صور في المعرض حاليا" />
          )}
        </div>
      </section>
    </>
  );
}
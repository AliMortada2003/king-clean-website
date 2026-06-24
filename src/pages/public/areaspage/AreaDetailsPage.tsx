import { Link, useParams } from "react-router-dom";
import { useArea } from "../../../api/hooks";
import { Seo } from "../../../components/Seo";
import {
  containerClass,
  PageHero,
  primaryButtonClass,
  sectionClass,
  sectionTitleClass,
  ServiceCard,
} from "../../../components/public/PublicPrimitives";
import { EmptyState, ErrorState, PageLoading } from "../../../components/ui";

export function AreaDetailsPage() {
  const { slug = "" } = useParams();
  const query = useArea(slug);

  if (query.isLoading)
    return (
      <>
        <PageHero title="المنطقة" />
        <section className={sectionClass}>
          <div className={containerClass}>
            <PageLoading />
          </div>
        </section>
      </>
    );

  if (query.isError || !query.data)
    return (
      <>
        <PageHero title="المنطقة" />
        <section className={sectionClass}>
          <div className={containerClass}>
            <ErrorState error={query.error} retry={query.refetch} />
          </div>
        </section>
      </>
    );

  const area = query.data;

  return (
    <>
      <Seo title={area.metaTitle} description={area.metaDescription} />
      <PageHero title={area.name} description={area.description} />
      <section className={sectionClass}>
        <div className={containerClass}>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-5">
            <h2 className={sectionTitleClass}>الخدمات المتاحة</h2>
            <Link
              className={primaryButtonClass}
              to={`/request-service?areaId=${area.id}`}
            >
              اطلب خدمة في {area.name}
            </Link>
          </div>

          {area.services.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {area.services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <EmptyState title="لا توجد خدمات مرتبطة بهذه المنطقة" />
          )}
        </div>
      </section>
    </>
  );
}

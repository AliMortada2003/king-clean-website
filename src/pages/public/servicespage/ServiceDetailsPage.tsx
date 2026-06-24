import { ArrowLeft, CirclePlay, MapPin } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useService } from "../../../api/hooks";
import { Seo } from "../../../components/Seo";
import {
  containerClass,
  goldRuleClass,
  mediaOverlayClass,
  mediaTileClass,
  PageHero,
  primaryButtonClass,
  sectionClass,
  sectionCopyClass,
  sectionTitleClass,
  softSectionClass,
  surfaceClass,
} from "../../../components/public/PublicPrimitives";
import { ErrorState, PageLoading } from "../../../components/ui";
import { resolveMediaUrl } from "../../../lib/api-client";

export function ServiceDetailsPage() {
  const { slug = "" } = useParams();
  const query = useService(slug);

  if (query.isLoading)
    return (
      <>
        <PageHero title="الخدمة" />
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
        <PageHero title="الخدمة" />
        <section className={sectionClass}>
          <div className={containerClass}>
            <ErrorState error={query.error} retry={query.refetch} />
          </div>
        </section>
      </>
    );

  const service = query.data;

  return (
    <>
      <Seo title={service.metaTitle} description={service.metaDescription} />
      <PageHero title={service.name} description={service.shortDescription} />

      <section className={sectionClass}>
        <div className={`${containerClass} grid items-start gap-10 lg:grid-cols-[1.2fr_.8fr]`}>
          <div>
            <div className={goldRuleClass} />
            <h2 className={sectionTitleClass}>تفاصيل الخدمة</h2>
            <p className={`${sectionCopyClass} whitespace-pre-line`}>
              {service.description}
            </p>
            <Link
              className={`${primaryButtonClass} mt-6`}
              to={`/request-service?serviceId=${service.id}`}
            >
              اطلب هذه الخدمة <ArrowLeft size={18} />
            </Link>
          </div>

          <aside className={`${surfaceClass} p-7`}>
            <h3 className="font-display text-xl font-bold text-[var(--color-text)]">
              المناطق المتاحة
            </h3>
            <div className="mt-5 grid gap-2">
              {service.areas.map((area) => (
                <Link
                  className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4 font-bold text-[var(--color-text)] transition hover:-translate-y-0.5 hover:border-[var(--color-primary)]"
                  key={area.id}
                  to={`/areas/${area.slug}`}
                >
                  <span className="flex items-center gap-2">
                    <MapPin size={18} className="text-[var(--color-primary)]" />
                    {area.name}
                  </span>
                  <ArrowLeft size={17} />
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>

      {service.gallery.length > 0 && (
        <section className={softSectionClass}>
          <div className={containerClass}>
            <h2 className={`${sectionTitleClass} mb-8`}>صور من الخدمة</h2>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {service.gallery.slice(0, 5).map((item) => (
                <article className={mediaTileClass} key={item.id}>
                  <img
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 hover:scale-105"
                    src={resolveMediaUrl(item.imageUrl)}
                    alt={item.title}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  <div className={mediaOverlayClass}>
                    <strong className="font-display">{item.title}</strong>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>)}
      {service.videos.length <0 && (
        <section className={sectionClass}>
          <div className={containerClass}>
            <h2 className={`${sectionTitleClass} mb-8`}>فيديوهات الخدمة</h2>
            <div className="grid gap-5 md:grid-cols-3">
              {service.videos.map((item) => (
                <a
                  className={`${surfaceClass} group overflow-hidden`}
                  key={item.id}
                  href={resolveMediaUrl(item.videoUrl)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="relative aspect-video bg-[var(--color-navy)]">
                    <img
                      className="h-full w-full object-cover opacity-75 transition duration-500 group-hover:scale-105"
                      src={resolveMediaUrl(item.thumbnailUrl)}
                      alt={item.title}
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                    <CirclePlay
                      className="absolute inset-0 m-auto text-white transition group-hover:scale-110"
                      size={48}
                    />
                  </div>
                  <div className="p-4 font-bold text-[var(--color-text)]">
                    {item.title}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

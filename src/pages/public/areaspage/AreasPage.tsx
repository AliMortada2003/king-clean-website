import { ArrowLeft, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useAreas } from "../../../api/hooks";
import { Seo } from "../../../components/Seo";
import {
  containerClass,
  PageHero,
  sectionClass,
  surfaceClass,
} from "../../../components/public/PublicPrimitives";
import { EmptyState, ErrorState, PageLoading } from "../../../components/ui";

export function AreasPage() {
  const areas = useAreas();

  return (
    <>
      <Seo
        title="مناطق الخدمة | KING CLEAN"
        description="خدمات KING CLEAN المتاحة في محافظات ومناطق الكويت."
      />
      <PageHero
        title="مناطق الخدمة"
        description="نغطي مناطق الكويت بخدمات متنوعة يمكنك طلبها بسهولة."
      />
      <section className={sectionClass}>
        <div className={containerClass}>
          {areas.isLoading ? (
            <PageLoading />
          ) : areas.isError ? (
            <ErrorState error={areas.error} retry={areas.refetch} />
          ) : areas.data?.length ? (
            <div className="grid gap-4">
              {areas.data.map((area) => (
                <Link
                  className={`${surfaceClass} group flex items-center justify-between gap-5 p-5 transition hover:-translate-y-1 hover:border-[var(--color-primary)] hover:shadow-strong sm:p-6`}
                  key={area.id}
                  to={`/areas/${area.slug}`}
                >
                  <div className="flex items-start gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[color-mix(in_srgb,var(--color-primary)_14%,transparent)] text-[var(--color-primary-dark)] transition group-hover:bg-[var(--color-primary)] group-hover:text-white">
                      <MapPin size={22} />
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-black text-[var(--color-text)]">
                        {area.name}
                      </h3>
                      <p className="m-0 mt-2 leading-7 text-[var(--color-muted)]">
                        {area.description}
                      </p>
                    </div>
                  </div>
                  <ArrowLeft className="shrink-0 text-[var(--color-primary)]" />
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </section>
    </>
  );
}

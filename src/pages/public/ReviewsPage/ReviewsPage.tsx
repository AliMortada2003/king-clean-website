import { Quote, Star } from "lucide-react";
import { useReviews } from "../../../api/hooks";
import { Seo } from "../../../components/Seo";
import {
  containerClass,
  PageHero,
  sectionClass,
  surfaceClass,
} from "../../../components/public/PublicPrimitives";
import { EmptyState, ErrorState, PageLoading } from "../../../components/ui";

export function ReviewsPage() {
  const query = useReviews();

  return (
    <>
      <Seo
        title="آراء عملاء كينج كلين الكويت | King Clean Reviews"
        description="اقرأ آراء وتجارب عملاء كينج كلين الكويت مع خدمات تنظيف المنازل والشقق والفلل والمكاتب داخل الكويت."
        canonicalPath="/reviews"
        keywords={[
          "آراء كينج كلين",
          "تقييم شركة تنظيف في الكويت",
          "King Clean Reviews",
          "تجارب عملاء كينج كلين",
          "شركة تنظيف موثوقة في الكويت",
        ]}
      />
      <PageHero
        title="آراء عملائنا"
        description="تجارب منشورة من عملائنا بعد تقديم الخدمة."
      />
      <section className={sectionClass}>
        <div className={containerClass}>
          {query.isLoading ? (
            <PageLoading />
          ) : query.isError ? (
            <ErrorState error={query.error} retry={query.refetch} />
          ) : query.data?.length ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {query.data.map((review) => (
                <article
                  className={`${surfaceClass} relative overflow-hidden p-4`}
                  key={review.id}
                >
                  <Quote
                    className="absolute left-6 top-6 text-[color-mix(in_srgb,var(--color-primary)_18%,transparent)]"
                    size={54}
                  />
                  <div className="relative z-10 flex items-center gap-1 text-[var(--color-primary)]">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className="inline"
                        fill={i < review.rating ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <p className="relative z-10 my-6 text-lg font-bold leading-9 text-[var(--color-muted)]">
                    “{review.comment}”
                  </p>
                  <strong className="relative z-10 font-display text-[var(--color-text)]">
                    {review.customerName}
                  </strong>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="لا توجد آراء منشورة" />
          )}
        </div>
      </section>
    </>
  );
}

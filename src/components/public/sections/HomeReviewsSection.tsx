import { FaQuoteRight, FaStar, FaUserCheck } from "react-icons/fa";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

import { useReviews } from "../../../api/hooks";
import { containerClass, SectionHeading, sectionClass } from "../PublicPrimitives";
import { EmptyState, ErrorState, PageLoading } from "../../ui";

function clampRating(value: number) {
    return Math.max(0, Math.min(5, Math.round(value || 0)));
}

export function HomeReviewsSection() {
    const reviews = useReviews();

    return (
        <section className={`${sectionClass} relative overflow-hidden`}>
            <div className="pointer-events-none absolute right-[-120px] top-10 h-80 w-80 rounded-full bg-[var(--color-primary)]/10 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-[-120px] h-96 w-96 rounded-full bg-[var(--color-teal)]/10 blur-3xl" />

            <div className={`${containerClass} relative z-10`}>
                <SectionHeading
                    title="آراء عملائنا"
                    description="تجارب يشاركها عملاؤنا بعد إتمام الخدمة."
                    link="/reviews"
                />

                {reviews.isLoading ? (
                    <PageLoading />
                ) : reviews.isError ? (
                    <ErrorState error={reviews.error} retry={reviews.refetch} />
                ) : reviews.data?.length ? (
                    <div className="relative">
                        <Swiper
                            modules={[Autoplay]}
                            loop={reviews.data.length > 3}
                            speed={700}
                            slidesPerGroup={1}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                                reverseDirection: false,
                            }}
                            spaceBetween={18}
                            slidesPerView={1}
                            breakpoints={{
                                640: {
                                    slidesPerView: 1,
                                    spaceBetween: 18,
                                },
                                768: {
                                    slidesPerView: 2,
                                    spaceBetween: 20,
                                },
                                1024: {
                                    slidesPerView: 3,
                                    spaceBetween: 22,
                                },
                            }}
                            className=""
                        >
                            {reviews.data.map((review) => {
                                const rating = clampRating(review.rating);

                                return (
                                    <SwiperSlide key={review.id} className="!h-auto">
                                        <article className="group relative flex h-full min-h-[200px] flex-col overflow-hidden rounded-[30px] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_92%,transparent)] p-6 shadow-soft backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--color-primary)_45%,transparent)] hover:shadow-strong">
                                            <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-[var(--color-primary)]/10 blur-2xl transition group-hover:bg-[var(--color-primary)]/20" />

                                            <FaQuoteRight className="absolute left-6 top-6 text-5xl text-[color-mix(in_srgb,var(--color-primary)_16%,transparent)]" />

                                            <div
                                                className="relative z-10 mb-6 flex items-center gap-1.5"
                                                aria-label={`${rating} من 5`}
                                            >
                                                {Array.from({ length: 5 }, (_, index) => (
                                                    <FaStar
                                                        key={index}
                                                        className={
                                                            index < rating
                                                                ? "text-amber-400"
                                                                : "text-[color-mix(in_srgb,var(--color-muted)_24%,transparent)]"
                                                        }
                                                    />
                                                ))}
                                            </div>

                                            <blockquote className="relative z-10 flex-1 text-sm font-bold leading-8 text-[var(--color-muted)] sm:text-base">
                                                “{review.comment}”
                                            </blockquote>

                                            <div className="relative z-10 mt-7 flex items-center gap-3 border-t border-[var(--color-border)] pt-5">
                                                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20">
                                                    <FaUserCheck className="text-xl" />
                                                </span>

                                                <div>
                                                    <strong className="block font-display text-base font-black text-[var(--color-text)]">
                                                        {review.customerName}
                                                    </strong>

                                                    <span className="mt-1 block text-xs font-bold text-[var(--color-muted)]">
                                                        عميل KING CLEAN
                                                    </span>
                                                </div>
                                            </div>
                                        </article>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    </div>
                ) : (
                    <EmptyState title="لا توجد آراء منشورة" />
                )}
            </div>
        </section>
    );
}
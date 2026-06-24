import { Link } from "react-router-dom";
import { FaArrowLeft, FaBroom } from "react-icons/fa";

import { useServices } from "../../../api/hooks";
import {
    containerClass,
    SectionHeading,
    sectionClass,
    ServiceCard,
} from "../PublicPrimitives";
import { EmptyState, ErrorState, PageLoading } from "../../ui";

type HomeServicesSectionProps = {
    title?: string;
    description?: string;
    limit?: number;
    showMoreButton?: boolean;
    moreTo?: string;
    moreText?: string;
};

export function HomeServicesSection({
    title = "خدمات تحافظ على نظافة مكانك",
    description = "اختر الخدمة المناسبة وسنساعدك في ترتيب الطلب حسب منطقتك واحتياجك.",
    limit = 6,
    showMoreButton = true,
    moreTo = "/services",
    moreText = "عرض المزيد من الخدمات",
}: HomeServicesSectionProps) {
    const services = useServices();

    const visibleServices = services.data?.slice(0, limit) || [];
    const hasMoreServices = Boolean(services.data && services.data.length > limit);

    return (
        <section className={sectionClass}>
            <div className={containerClass}>
                <SectionHeading
                    title={title}
                    description={description}
                />

                {services.isLoading ? (
                    <PageLoading />
                ) : services.isError ? (
                    <ErrorState error={services.error} retry={services.refetch} />
                ) : services.data?.length ? (
                    <>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5">
                            {visibleServices.map((service, index) => (
                                <ServiceCard
                                    key={service.id}
                                    service={service}
                                    priority={index < 2}
                                />
                            ))}
                        </div>

                        {showMoreButton && hasMoreServices && (
                            <div className="mt-9 flex justify-center">
                                <Link
                                    to={moreTo}
                                    className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-7 text-sm font-black text-[var(--color-text)] shadow-soft transition hover:-translate-y-1 hover:border-[var(--color-primary)] hover:text-[var(--color-primary-dark)] hover:shadow-strong dark:hover:text-[var(--color-primary)] sm:text-base"
                                >
                                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-[color-mix(in_srgb,var(--color-primary)_12%,transparent)] text-[var(--color-primary)] transition group-hover:bg-[var(--color-primary)] group-hover:text-white">
                                        <FaBroom />
                                    </span>

                                    {moreText}

                                    <FaArrowLeft className="transition group-hover:-translate-x-1" />
                                </Link>
                            </div>
                        )}
                    </>
                ) : (
                    <EmptyState title="لا توجد خدمات متاحة حالياً" />
                )}
            </div>
        </section>
    );
}
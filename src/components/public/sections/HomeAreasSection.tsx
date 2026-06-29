import { Link } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";

import { useAreas } from "../../../api/hooks";
import {
    containerClass,
    SectionHeading,
    softSectionClass,
} from "../PublicPrimitives";
import { EmptyState, ErrorState, PageLoading } from "../../ui";

export function HomeAreasSection() {
    const areas = useAreas();

    return (
        <section className={softSectionClass}>
            <div className={containerClass}>
                <SectionHeading
                    title="أماكن تواجدنا"
                    description="نغطي العديد من المناطق داخل الكويت."
                    link="/areas"
                />

                {areas.isLoading ? (
                    <PageLoading />
                ) : areas.isError ? (
                    <ErrorState error={areas.error} retry={areas.refetch} />
                ) : areas.data?.length ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 ">
                        {areas.data.map((area) => (
                            <Link
                                key={area.id}
                                to={`/areas/${area.slug}`}
                                className="group flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-soft transition hover:-translate-y-1 hover:border-[var(--color-primary)] hover:shadow-strong"
                            >
                                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[color-mix(in_srgb,var(--color-primary)_12%,transparent)] text-[var(--color-primary)] transition group-hover:bg-[var(--color-primary)] group-hover:text-white">
                                    <FaMapMarkerAlt className="text-lg" />
                                </span>

                                <h3 className="line-clamp-1 text-sm font-black text-[var(--color-text)] sm:text-base">
                                    {area.name}
                                </h3>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <EmptyState title="لا توجد مناطق مضافة" />
                )}
            </div>
        </section>
    );
}
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
    FaArrowLeft,
    FaBroom,
    FaCameraRetro,
    FaImages,
    FaMapMarkerAlt,
} from "react-icons/fa";

import { useGallery } from "../../../api/hooks";
import { resolveMediaUrl } from "../../../lib/api-client";
import {
    containerClass,
    SectionHeading,
    sectionClass,
} from "../PublicPrimitives";
import { EmptyState, ErrorState, PageLoading } from "../../ui";

function getGalleryTileClass(index: number) {
    const classes = [
        "group relative block min-h-[260px] overflow-hidden rounded-[30px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-soft transition duration-300 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--color-primary)_50%,transparent)] hover:shadow-strong",
    ];

    if (index === 0) {
        classes.push("md:col-span-7 md:row-span-2 md:min-h-[540px]");
    } else if (index === 1 || index === 2) {
        classes.push("md:col-span-5 md:min-h-[260px]");
    } else {
        classes.push("md:col-span-6 md:min-h-[300px]");
    }

    return classes.join(" ");
}

export function HomeGallerySection() {
    const gallery = useGallery();

    return (
        <section className={`${sectionClass} relative overflow-hidden`}>
            <div className="pointer-events-none absolute right-[-120px] top-16 h-80 w-80 rounded-full bg-[var(--color-primary)]/10 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-[-120px] h-96 w-96 rounded-full bg-[var(--color-teal)]/10 blur-3xl" />

            <div className={`${containerClass} relative z-10`}>
                <SectionHeading
                    title="من أعمالنا"
                    description="لقطات حقيقية من شغلنا في التنظيف والعناية بالتفاصيل."
                    link="/gallery"
                />

                {gallery.isLoading ? (
                    <PageLoading />
                ) : gallery.isError ? (
                    <ErrorState error={gallery.error} retry={gallery.refetch} />
                ) : gallery.data?.length ? (
                    <div className="grid gap-5 md:grid-cols-12">
                        {gallery.data.slice(0, 5).map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{
                                    duration: 0.45,
                                    delay: Math.min(index * 0.06, 0.25),
                                    ease: "easeOut",
                                }}
                                className={getGalleryTileClass(index)}
                            >
                                <Link
                                    to={`/gallery?serviceId=${item.serviceId}`}
                                    className="absolute inset-0"
                                    aria-label={item.title}
                                >
                                    <div className="absolute inset-0 grid place-items-center bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--color-surface))]">
                                        <FaImages className="text-5xl text-[var(--color-primary)]/40" />
                                    </div>

                                    <img
                                        src={resolveMediaUrl(item.imageUrl)}
                                        alt={item.title}
                                        loading="lazy"
                                        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                                        onError={(event) => {
                                            event.currentTarget.style.opacity = "0";
                                        }}
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.22),transparent_28%)] opacity-70" />

                                    <div className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs font-black text-white backdrop-blur-md">
                                        <FaCameraRetro className="text-amber-300" />
                                        عمل من أعمالنا
                                    </div>

                                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                                        <div className="mb-4 flex flex-wrap items-center gap-2">
                                            {item.serviceName && (
                                                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-black text-white backdrop-blur-md">
                                                    <FaBroom className="text-emerald-300" />
                                                    {item.serviceName}
                                                </span>
                                            )}

                                            {item.areaName && (
                                                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-black text-white backdrop-blur-md">
                                                    <FaMapMarkerAlt className="text-rose-300" />
                                                    {item.areaName}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-end justify-between gap-4">
                                            <strong className="font-display line-clamp-2 text-xl font-black leading-8 text-white sm:text-2xl">
                                                {item.title}
                                            </strong>

                                            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-[var(--color-primary-dark)] shadow-lg transition group-hover:-translate-x-1 group-hover:bg-[var(--color-primary)] group-hover:text-white">
                                                <FaArrowLeft />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <EmptyState title="معرض الأعمال قيد التجهيز" />
                )}
            </div>
        </section>
    );
}
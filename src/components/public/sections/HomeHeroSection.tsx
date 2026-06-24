import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";

import { resolveMediaUrl } from "../../../lib/api-client";
import { whatsAppUrl } from "../../../lib/format";
import {
    primaryButtonClass,
    secondaryButtonClass,
} from "../PublicPrimitives";
import type { HomeCmsSection, HomeSettings } from "./types";

type HeroGalleryImage = {
    imageUrl?: string | null;
    title?: string | null;
    name?: string | null;
    alt?: string | null;
};

type HomeHeroSectionProps = {
    hero?: HomeCmsSection;
    settings?: HomeSettings;

    /**
     * مرر هنا صور المعرض من الصفحة الرئيسية.
     * مثال:
     * galleryImages={gallery?.items || gallery || []}
     */
    galleryImages?: HeroGalleryImage[];
};

const heroStats = [
    "مواعيد مرنة",
    "خدمة موثوقة",
    "تنظيف وتعقيم",
    "ثقة وأمان",
];

export function HomeHeroSection({
    hero,
    settings,
    galleryImages = [],
}: HomeHeroSectionProps) {
    const [activeSlide, setActiveSlide] = useState(0);

    const title = hero?.title || settings?.heroTitle || "شركة تنظيف في الكويت";

    const subtitle =
        hero?.subtitle ||
        settings?.heroSubtitle ||
        "خدمات تنظيف وتعقيم وتعطير للمنازل والشقق والفلل والمكاتب";

    const wa = whatsAppUrl(settings?.whatsApp);

    const fallbackHeroImage =
        resolveMediaUrl(hero?.imageUrl) || "/images/king-clean-hero.png";

    const heroSlides = useMemo(() => {
        const gallerySlides = galleryImages
            .map((item) => resolveMediaUrl(item.imageUrl))
            .filter(Boolean) as string[];

        const slides = [fallbackHeroImage, ...gallerySlides];

        return Array.from(new Set(slides)).filter(Boolean);
    }, [fallbackHeroImage, galleryImages]);

    useEffect(() => {
        setActiveSlide(0);
    }, [heroSlides.length]);

    useEffect(() => {
        if (heroSlides.length <= 1) return;

        const interval = window.setInterval(() => {
            setActiveSlide((current) => (current + 1) % heroSlides.length);
        }, 5200);

        return () => window.clearInterval(interval);
    }, [heroSlides.length]);

    const currentImage = heroSlides[activeSlide] || fallbackHeroImage;

    return (
        <section className="relative min-h-[calc(100svh-var(--header-height))] overflow-hidden bg-[var(--color-bg)]">
            {/* Background slider */}
            <div className="absolute inset-0">
                <AnimatePresence mode="sync">
                    <motion.img
                        key={currentImage}
                        className="absolute inset-0 h-full w-full object-cover object-center"
                        src={currentImage}
                        alt="خدمات تنظيف KING CLEAN في الكويت"
                        initial={{ opacity: 0, scale: 1.06 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 1.25, ease: "easeOut" }}
                    />
                </AnimatePresence>
            </div>

            {/* Main overlays */}
            <div className="absolute inset-0 bg-gradient-to-l from-[var(--color-bg)] via-[color-mix(in_srgb,var(--color-bg)_86%,transparent)] to-[color-mix(in_srgb,var(--color-bg)_20%,transparent)] lg:via-[color-mix(in_srgb,var(--color-bg)_74%,transparent)] lg:to-transparent" />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,color-mix(in_srgb,var(--color-primary)_22%,transparent),transparent_34%),radial-gradient(circle_at_82%_74%,color-mix(in_srgb,var(--color-teal)_18%,transparent),transparent_36%),linear-gradient(to_bottom,color-mix(in_srgb,var(--color-bg)_8%,transparent),color-mix(in_srgb,var(--color-bg)_36%,transparent))]" />

            {/* Soft decorative bubbles */}
            <div className="pointer-events-none absolute left-[8%] top-[18%] hidden h-20 w-20 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm lg:block" />
            <div className="pointer-events-none absolute bottom-[16%] left-[18%] hidden h-10 w-10 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm lg:block" />
            <div className="pointer-events-none absolute bottom-[26%] right-[8%] h-16 w-16 rounded-full bg-[var(--color-teal)]/10 blur-2xl" />

            <div className="relative z-10 mx-auto flex min-h-[calc(100svh-var(--header-height))] w-full max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
                <motion.div
                    className="max-w-2xl"
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
                >
                    <motion.h1
                        className="font-display text-3xl font-black leading-tight text-[var(--color-text)]  md:text-5xl"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, delay: 0.36 }}
                    >
                        {title}
                    </motion.h1>

                    <motion.p
                        className="mt-6 max-w-xl text-base font-bold leading-8 text-[var(--color-muted)] sm:text-lg lg:text-xl lg:leading-10"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, delay: 0.46 }}
                    >
                        {subtitle}
                    </motion.p>

                    <motion.div
                        className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, delay: 0.56 }}
                    >
                        <motion.div
                            whileHover={{ y: -3, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Link
                                className={`${primaryButtonClass} group relative min-h-14 overflow-hidden px-7 sm:text-base`}
                                to={hero?.ctaUrl || "/request-service"}
                            >
                                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition duration-700 group-hover:translate-x-full" />
                                <span className="relative z-10">{hero?.ctaText || "اطلب خدمة"}</span>
                                <ArrowLeft className="relative z-10 transition group-hover:-translate-x-1" size={19} />
                            </Link>
                        </motion.div>

                        {wa && (
                            <motion.div
                                whileHover={{ y: -3, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                            >
                                <a
                                    className={`${secondaryButtonClass} group relative min-h-14 overflow-hidden px-7 sm:text-base`}
                                    href={wa}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition duration-700 group-hover:translate-x-full" />
                                    <MessageCircle className="relative z-10 transition group-hover:rotate-[-8deg]" size={20} />
                                    <span className="relative z-10">تواصل واتساب</span>
                                </a>
                            </motion.div>
                        )}
                    </motion.div>

                    <motion.div
                        className="mt-8 grid grid-cols-2 max-w-xl grid-cols-1 gap-3 "
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, delay: 0.66 }}
                    >
                        {heroStats.map((item, index) => (
                            <motion.div
                                key={item}
                                className="group inline-flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_82%,transparent)] px-4 py-3 text-sm font-black text-[var(--color-muted)] shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--color-primary)_35%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-surface)_92%,transparent)] hover:shadow-lg"
                                whileHover={{ y: -4 }}
                                transition={{ duration: 0.2, delay: index * 0.03 }}
                            >
                                <span className="grid  h-8 w-8 place-items-center rounded-full text-emerald-500 bg-slate-100 dark:bg-white/15 group-hover:scale-110">
                                    <ShieldCheck size={16} />
                                </span>
                                {item}
                            </motion.div>
                        ))}
                    </motion.div>

                    {heroSlides.length > 1 && (
                        <div className="mt-7 flex items-center gap-2">
                            {heroSlides.map((slide, index) => (
                                <button
                                    key={slide}
                                    type="button"
                                    aria-label={`عرض صورة ${index + 1}`}
                                    onClick={() => setActiveSlide(index)}
                                    className={`h-2.5 rounded-full transition-all duration-300 ${activeSlide === index
                                            ? "w-8 bg-[var(--color-primary)]"
                                            : "w-2.5 bg-[color-mix(in_srgb,var(--color-muted)_36%,transparent)] hover:bg-[var(--color-primary)]/70"
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
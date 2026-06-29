import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

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
    galleryImages?: HeroGalleryImage[];
};

const heroStats = [
    "مواعيد مرنة",
    "خدمة موثوقة",
    "تنظيف وتعقيم",
    "ثقة وأمان",
];

const DEFAULT_HERO_DESCRIPTION =
    "أضخم شركة تنظيف في دولة الكويت\nفريق رجالي آسيوي مدرب على جميع أنواع التنظيف";

export function HomeHeroSection({
    hero,
    settings,
    galleryImages = [],
}: HomeHeroSectionProps) {
    const [activeSlide, setActiveSlide] = useState(0);

    const title = hero?.title || settings?.heroTitle || "شركة تنظيف في الكويت";

    const subtitle =
        hero?.subtitle || settings?.heroSubtitle || DEFAULT_HERO_DESCRIPTION;

    const ctaText = hero?.ctaText || "اطلب خدمة";
    const ctaUrl = hero?.ctaUrl || "/request-service";

    const wa = whatsAppUrl(settings?.whatsApp);

    const fallbackHeroImage =
        resolveMediaUrl(hero?.imageUrl) || "/images/king-clean-hero.png";

    const heroSlides = useMemo(() => {
        const gallerySlides = galleryImages
            .map((item) => resolveMediaUrl(item.imageUrl))
            .filter(Boolean) as string[];

        return Array.from(new Set([fallbackHeroImage, ...gallerySlides])).filter(
            Boolean,
        );
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

    return (
        <section className="relative min-h-[calc(100svh-var(--header-height))] overflow-hidden bg-[var(--color-bg)]">
            {/* Background slider - CSS only */}
            <div className="absolute inset-0">
                {heroSlides.map((slide, index) => (
                    <img
                        key={slide}
                        className={`absolute inset-0 h-full w-full object-cover object-center transition-[opacity,transform] duration-1000 ease-out ${activeSlide === index
                                ? "scale-100 opacity-100"
                                : "scale-[1.03] opacity-0"
                            }`}
                        src={slide}
                        alt={
                            index === 0
                                ? "خدمات تنظيف KING CLEAN في الكويت"
                                : `صورة من أعمال KING CLEAN رقم ${index + 1}`
                        }
                        loading={index === 0 ? "eager" : "lazy"}
                        decoding="async"
                        fetchPriority={index === 0 ? "high" : "auto"}
                    />
                ))}
            </div>

            {/* Main overlays */}
            <div className="absolute inset-0 bg-gradient-to-l from-[var(--color-bg)] via-[color-mix(in_srgb,var(--color-bg)_86%,transparent)] to-[color-mix(in_srgb,var(--color-bg)_20%,transparent)] lg:via-[color-mix(in_srgb,var(--color-bg)_74%,transparent)] lg:to-transparent" />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,color-mix(in_srgb,var(--color-primary)_22%,transparent),transparent_34%),radial-gradient(circle_at_82%_74%,color-mix(in_srgb,var(--color-teal)_18%,transparent),transparent_36%),linear-gradient(to_bottom,color-mix(in_srgb,var(--color-bg)_8%,transparent),color-mix(in_srgb,var(--color-bg)_36%,transparent))]" />

            <div className="relative z-10 mx-auto flex min-h-[calc(100svh-var(--header-height))] w-full max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="max-w-2xl">
                    <h1 className="font-display text-3xl font-black leading-tight text-[var(--color-text)] md:text-5xl">
                        {title}
                    </h1>

                    <p className="mt-6 max-w-xl whitespace-pre-line text-base font-bold leading-8 text-[var(--color-muted)] sm:text-lg lg:text-xl lg:leading-10">
                        {subtitle}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2.5">
                        {heroStats.map((stat) => (
                            <span
                                key={stat}
                                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/80 px-4 py-2 text-sm font-black text-[var(--color-text)] shadow-sm backdrop-blur"
                            >
                                <ShieldCheck size={16} className="text-[var(--color-primary)]" />
                                {stat}
                            </span>
                        ))}
                    </div>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                        <Link
                            className={`${primaryButtonClass} group relative min-h-14 overflow-hidden px-7 transition duration-300 hover:-translate-y-1 sm:text-base`}
                            to={ctaUrl}
                        >
                            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition duration-700 group-hover:translate-x-full" />
                            <span className="relative z-10">{ctaText}</span>
                            <ArrowLeft
                                className="relative z-10 transition group-hover:-translate-x-1"
                                size={19}
                            />
                        </Link>

                        {wa && (
                            <a
                                className={`${secondaryButtonClass} group relative min-h-14 overflow-hidden px-7 transition duration-300 hover:-translate-y-1 sm:text-base`}
                                href={wa}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition duration-700 group-hover:translate-x-full" />
                                <MessageCircle
                                    className="relative z-10 transition group-hover:rotate-[-8deg]"
                                    size={20}
                                />
                                <span className="relative z-10">تواصل واتساب</span>
                            </a>
                        )}
                    </div>

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
                </div>
            </div>
        </section>
    );
}
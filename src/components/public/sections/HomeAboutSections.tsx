import { Link } from "react-router-dom";
import {
    FaArrowLeft,
    FaCheckCircle,
    FaClock,
    FaShieldAlt,
    FaHandSparkles,
    FaSprayCan,
    FaWhatsapp,
} from "react-icons/fa";

import { resolveMediaUrl } from "../../../lib/api-client";
import { whatsAppUrl } from "../../../lib/format";
import {
    containerClass,
    primaryButtonClass,
    sectionClass,
    sectionCopyClass,
    sectionTitleClass,
} from "../PublicPrimitives";
import type { HomeCmsSection, HomeSettings } from "./types";

type HomeAboutSectionsProps = {
    about?: HomeCmsSection;
    unknownSections: HomeCmsSection[];
    settings?: HomeSettings;
};

type AboutBandProps = {
    section?: HomeCmsSection;
    title: string;
    subtitle?: string | null;
    body?: string | null;
    imageUrl?: string | null;
    ctaText?: string | null;
    ctaUrl?: string | null;
    whatsApp?: string | null;
    reversed?: boolean;
};

const aboutFeatures = [
    {
        label: "خدمة منظمة",
        Icon: FaCheckCircle,
        className: "bg-emerald-500/10 text-emerald-500 ring-emerald-500/20",
    },
    {
        label: "فريق موثوق",
        Icon: FaShieldAlt,
        className: "bg-sky-500/10 text-sky-500 ring-sky-500/20",
    },
    {
        label: "تنظيف وتعقيم",
        Icon: FaSprayCan,
        className: "bg-amber-500/10 text-amber-500 ring-amber-500/20",
    },
    {
        label: "مواعيد مرنة",
        Icon: FaClock,
        className: "bg-violet-500/10 text-violet-500 ring-violet-500/20",
    },
];

function getSectionTitle(section: HomeCmsSection | undefined, fallback: string) {
    return section?.title?.trim() || fallback;
}

function AboutBand({
    title,
    subtitle,
    body,
    imageUrl,
    ctaText,
    ctaUrl,
    whatsApp,
    reversed = false,
}: AboutBandProps) {
    const image ="/images/hero-section/main-image.png";

    const wa = whatsAppUrl(whatsApp);

    return (
        <section className={`${sectionClass} relative overflow-hidden`}>
            <div className="pointer-events-none absolute right-[-120px] top-10 h-80 w-80 rounded-full bg-[var(--color-primary)]/10 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-[-120px] h-80 w-80 rounded-full bg-[var(--color-teal)]/10 blur-3xl" />

            <div
                className={`${containerClass} relative z-10 grid items-center gap-10 lg:grid-cols-2 ${reversed ? "lg:[&>*:first-child]:order-2" : ""
                    }`}
            >
                <div>
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/20 bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)] px-4 py-2 text-sm font-black text-[var(--color-primary-dark)] dark:text-[var(--color-primary)]">
                        <FaHandSparkles className="text-amber-400" />
                        KING CLEAN
                    </div>

                    <h2 className={sectionTitleClass}>
                        {title}
                    </h2>

                    {subtitle && (
                        <p className="mt-4 max-w-2xl text-base font-black leading-8 text-[var(--color-primary-dark)] dark:text-[var(--color-primary)]">
                            {subtitle}
                        </p>
                    )}

                    {body && (
                        <p className={`${sectionCopyClass} mt-5`}>
                            {body}
                        </p>
                    )}

                    <div className="mt-7 grid grid-cols-2 gap-3">
                        {aboutFeatures.map(({ label, Icon, className }) => (
                            <div
                                key={label}
                                className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-soft"
                            >
                                <span
                                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ring-1 ${className}`}
                                >
                                    <Icon className="text-base" />
                                </span>

                                <span className="text-sm font-black text-[var(--color-text)]">
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {(ctaText && ctaUrl) || wa ? (
                        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                            {ctaText && ctaUrl && (
                                <Link
                                    className={`${primaryButtonClass} min-h-14 px-7`}
                                    to={ctaUrl}
                                >
                                    {ctaText}
                                    <FaArrowLeft />
                                </Link>
                            )}

                            {wa && (
                                <a
                                    href={wa}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-7 text-sm font-black text-[var(--color-text)] shadow-soft transition hover:-translate-y-1 hover:border-emerald-500/40 hover:text-emerald-500 hover:shadow-strong"
                                >
                                    <FaWhatsapp className="text-xl text-emerald-500" />
                                    تواصل واتساب
                                </a>
                            )}
                        </div>
                    ) : null}
                </div>

                <div className="relative">
                    <div className="absolute -inset-3 rounded-[34px] bg-gradient-to-br from-[color-mix(in_srgb,var(--color-primary)_16%,transparent)] to-[color-mix(in_srgb,var(--color-teal)_14%,transparent)] blur-xl" />

                    <img
                        className="relative rounded-xl w-full border border-[var(--color-border)] object-cover shadow-strong"
                        src={image}
                        alt={title}
                        loading="lazy"
                    />

                    <div className="absolute bottom-5 right-5 hidden rounded-2xl border border-white/20 bg-white/90 p-4 shadow-strong backdrop-blur dark:bg-black/70 sm:block">
                        <div className="flex items-center gap-3">
                            <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500">
                                <FaCheckCircle />
                            </span>

                            <div>
                                <p className="text-xs font-bold text-[var(--color-muted)]">
                                    خدمة موثوقة
                                </p>
                                <p className="text-sm font-black text-[var(--color-text)]">
                                    متابعة واهتمام بالتفاصيل
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function HomeAboutSections({
    about,
    unknownSections,
    settings,
}: HomeAboutSectionsProps) {
    return (
        <>
            {about ? (
                <AboutBand
                    title={getSectionTitle(about, "من نحن")}
                    subtitle={about.subtitle}
                    body={about.body}
                    imageUrl={about.imageUrl}
                    ctaText={about.ctaText}
                    ctaUrl={about.ctaUrl}
                    whatsApp={settings?.whatsApp}
                />
            ) : settings?.aboutText ? (
                <AboutBand
                    title="من نحن"
                    subtitle="KING CLEAN لخدمات التنظيف بالكويت"
                    body={settings.aboutText}
                    imageUrl="/images/hero-section/main-image.png"
                    ctaText="اطلب خدمة"
                    ctaUrl="/request-service"
                    whatsApp={settings.whatsApp}
                />
            ) : null}

            {unknownSections.map((section, index) => (
                <AboutBand
                    key={section.id}
                    title={getSectionTitle(section, "خدمات KING CLEAN")}
                    subtitle={section.subtitle}
                    body={section.body}
                    imageUrl={section.imageUrl}
                    ctaText={section.ctaText}
                    ctaUrl={section.ctaUrl}
                    whatsApp={settings?.whatsApp}
                    reversed={index % 2 === 0}
                />
            ))}
        </>
    );
}
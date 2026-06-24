import { ChevronLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

import { resolveMediaUrl } from "../../lib/api-client";

type ServiceCardData = {
  id: number;
  name: string;
  slug: string;
  shortDescription?: string | null;
  imageUrl?: string | null;
};

export const containerClass = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";

export const sectionClass =
  "relative overflow-hidden bg-[var(--color-bg)] py-16 sm:py-20 lg:py-24";

export const softSectionClass =
  "relative overflow-hidden bg-[linear-gradient(180deg,var(--color-surface-soft),var(--color-bg))] py-16 sm:py-20 lg:py-24";

export const surfaceClass =
  "rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-soft";

export const elevatedSurfaceClass =
  "rounded-[30px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-strong";

export const primaryButtonClass =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-[var(--color-primary)] to-[var(--color-primary-dark)] px-6 text-sm font-black text-white shadow-lg shadow-[rgba(211,154,34,0.22)] transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-primary)_42%,transparent)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)] disabled:cursor-not-allowed disabled:opacity-70";

export const secondaryButtonClass =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 text-sm font-black text-[var(--color-text)] shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:text-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-primary)_32%,transparent)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)] disabled:cursor-not-allowed disabled:opacity-70";

export const ghostButtonClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-black text-[var(--color-teal)] transition hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-primary)_28%,transparent)]";

export const smallButtonClass = "min-h-10 rounded-xl px-4 text-xs";

export const iconButtonClass =
  "inline-grid h-11 w-11 place-items-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:bg-[var(--color-surface-soft)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-primary)_36%,transparent)]";

export const sectionTitleClass =
  "font-display text-3xl font-black leading-tight text-[var(--color-text)] sm:text-4xl lg:text-5xl";

export const sectionCopyClass =
  "mt-4 max-w-3xl text-base font-medium leading-8 text-[var(--color-muted)] sm:text-lg";

export const goldRuleClass =
  "mb-5 h-1 w-14 rounded-full bg-[var(--color-primary)]";

export const formGridClass = "grid gap-5 md:grid-cols-2";

export const fieldClass = "grid gap-2";

export const fieldLabelClass = "text-sm font-black text-[var(--color-text)]";

export const inputClass =
  "min-h-12 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] shadow-sm outline-none transition placeholder:text-[color-mix(in_srgb,var(--color-muted)_70%,transparent)] focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-primary)_16%,transparent)] disabled:cursor-not-allowed disabled:bg-[var(--color-surface-soft)] disabled:opacity-70";

export const textareaClass = `${inputClass} min-h-32 resize-y leading-8`;

export const fieldErrorClass =
  "text-sm font-bold leading-6 text-[var(--color-danger)]";

export const mutedTextClass = "text-[var(--color-muted)]";

export const filterBarClass =
  "mb-8 flex flex-col gap-3 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-soft sm:flex-row sm:items-center";

export const mediaGridClass = "grid gap-5 md:grid-cols-12";

export const mediaTileClass =
  "group relative min-h-[280px] overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface-soft)] shadow-soft";

export const mediaOverlayClass =
  "absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[rgba(1,24,38,0.94)] via-[rgba(1,24,38,0.72)] to-transparent p-6 text-white";

import { FaChevronLeft } from "react-icons/fa";

export function PageHero({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-surface-soft)] py-10 sm:py-12 lg:py-14">

      <div className={`${containerClass} relative z-10`}>
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-black text-[var(--color-muted)] sm:text-sm">
          <Link
            to="/"
            className="transition hover:text-[var(--color-primary-dark)] dark:hover:text-[var(--color-primary)]"
          >
            الرئيسية
          </Link>

          <FaChevronLeft className="text-[10px] text-[var(--color-primary)]" />

          <span className="text-[var(--color-text)]">{title}</span>
        </div>

        <div className="max-w-3xl">
          <h1 className="font-display text-3xl font-black leading-tight text-[var(--color-text)] sm:text-4xl lg:text-5xl">
            {title}
          </h1>

          {description && (
            <p className="mt-4 max-w-2xl text-sm font-bold leading-7 text-[var(--color-muted)] sm:text-base sm:leading-8">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
} 

export function SectionHeading({
  title,
  description,
  link,
  linkLabel = "عرض الكل",
}: {
  title: string;
  description?: string;
  link?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:mb-12 lg:flex-row lg:items-end">
      <div>
        <div className={goldRuleClass} />

        <h2 className={sectionTitleClass}>{title}</h2>

        {description && <p className={sectionCopyClass}>{description}</p>}
      </div>

      {link && (
        <Link className={secondaryButtonClass} to={link}>
          {linkLabel}
          <ChevronLeft size={18} />
        </Link>
      )}
    </div>
  );
}

export function ServiceCard({
  service,
  priority = false,
}: {
  service: ServiceCardData;
  priority?: boolean;
}) {
  const image = resolveMediaUrl(service.imageUrl);

  return (
    <motion.article
      className={`${surfaceClass} group relative overflow-hidden transition`}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25 }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-[var(--color-primary)] to-transparent opacity-60" />

      <div className="relative z-10 grid min-h-[240px] grid-cols-1 gap-0 md:grid-cols-[190px_1fr] md:dir-ltr">
        <div className="relative h-44 overflow-hidden md:order-1 md:h-full">
          {image ? (
            <img
              src={image}
              alt={service.name}
              loading={priority ? "eager" : "lazy"}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[var(--color-teal)] to-[var(--color-navy)]">
              <Sparkles className="h-14 w-14 text-[var(--color-primary)]" />
            </div>
          )}
        </div>

        <div className="flex min-h-[200px] space-y-2 flex-col justify-center items-center p-2 text-center md:dir-rtl md:p-6">
          <span className="mb-2 inline-flex w-fit rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-3 py-1 text-xs font-black text-[var(--color-teal)]">
            خدمة تنظيف
          </span>

          <h3 className="font-display text-sm font-black leading-tight text-[var(--color-text)] ">
            {service.name}
          </h3>

          {service.shortDescription && (
            <p className="mt-3 line-clamp-2 text-[10px] md:text-xs font-semibold leading-7 text-[var(--color-muted)]">
              {service.shortDescription}
            </p>
          )}

          <Link
            className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-[var(--color-navy)] px-4 py-2 text-sm font-black text-white shadow-lg shadow-[rgba(6,45,69,0.16)] transition hover:gap-3 hover:bg-[var(--color-teal)] dark:bg-[var(--color-primary)] dark:text-[var(--color-navy)] dark:hover:bg-white"
            to={`/services/${service.slug}`}
          >
            التفاصيل
            <ChevronLeft size={16} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export function CmsBand({
  title,
  subtitle,
  body,
  imageUrl,
  ctaText,
  ctaUrl,
}: {
  title: string;
  subtitle?: string | null;
  body?: string | null;
  imageUrl?: string | null;
  ctaText?: string | null;
  ctaUrl?: string | null;
}) {
  const image = resolveMediaUrl(imageUrl);

  return (
    <section className={sectionClass}>
      <div
        className={[
          containerClass,
          image ? "grid items-center gap-10 lg:grid-cols-2" : "",
        ].join(" ")}
      >
        <div>
          <div className={goldRuleClass} />

          <h2 className={sectionTitleClass}>{title}</h2>

          {subtitle && (
            <h3 className="mt-4 text-xl font-black leading-8 text-[var(--color-teal)]">
              {subtitle}
            </h3>
          )}

          {body && <p className={sectionCopyClass}>{body}</p>}

          {ctaText && ctaUrl && (
            <Link className={`${primaryButtonClass} mt-6`} to={ctaUrl}>
              {ctaText}
            </Link>
          )}
        </div>

        {image && (
          <div className="relative">
            <div className="absolute -inset-3 rounded-[34px] bg-gradient-to-br from-[color-mix(in_srgb,var(--color-primary)_18%,transparent)] to-[color-mix(in_srgb,var(--color-teal)_16%,transparent)] blur-xl" />

            <img
              className="relative aspect-[4/3] w-full rounded-[28px] border border-[var(--color-border)] object-cover shadow-strong"
              src={image}
              alt={title}
              loading="lazy"
            />
          </div>
        )}
      </div>
    </section>
  );
}

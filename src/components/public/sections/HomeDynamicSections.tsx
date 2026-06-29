import { ArrowLeft, CheckCircle2, CheckCheck } from "lucide-react";
import { Link } from "react-router-dom";

import { resolveMediaUrl } from "../../../lib/api-client";
import type { SiteSectionDto } from "../../../types/api";

type DynamicPayloadItem = {
  title?: string;
  description?: string;
};

type DynamicSectionPayload = {
  items?: DynamicPayloadItem[];
};

type HomeDynamicSectionsProps = {
  sections: SiteSectionDto[];
};

function parsePayload(payloadJson?: string | null): DynamicSectionPayload {
  if (!payloadJson) return {};

  try {
    const parsed = JSON.parse(payloadJson);

    if (!parsed || typeof parsed !== "object") return {};

    return parsed as DynamicSectionPayload;
  } catch {
    return {};
  }
}

export function HomeDynamicSections({ sections }: HomeDynamicSectionsProps) {
  const visibleSections = sections
    .filter((section) => section.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  if (!visibleSections.length) return null;

  return (
    <>
      {visibleSections.map((section, index) => (
        <HomeDynamicSection
          key={section.id}
          section={section}
          reversed={index % 2 === 1}
        />
      ))}
    </>
  );
}

type HomeDynamicSectionProps = {
  section: SiteSectionDto;
  reversed?: boolean;
};

function HomeDynamicSection({ section, reversed }: HomeDynamicSectionProps) {
  const payload = parsePayload(section.payloadJson);
  const image = resolveMediaUrl(section.imageUrl);
  const video = resolveMediaUrl(section.videoUrl);
  const hasMedia = Boolean(image || video);
  const hasItems = Boolean(payload.items?.length);

  return (
    <section className="relative overflow-hidden bg-[var(--color-bg)] py-16 sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,color-mix(in_srgb,var(--color-gold)_10%,transparent),transparent_32%),radial-gradient(circle_at_82%_80%,color-mix(in_srgb,var(--color-teal)_10%,transparent),transparent_34%)]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={[
            "grid items-center gap-8 lg:grid-cols-2 lg:gap-12",
            reversed ? "lg:[&>*:first-child]:order-2" : "",
          ].join(" ")}
        >
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--color-primary)_24%,transparent)] bg-[color-mix(in_srgb,var(--color-surface)_82%,transparent)] px-4 py-2 text-sm font-black text-[var(--color-primary-dark)] shadow-sm backdrop-blur dark:text-[var(--color-gold)]">
              <CheckCheck size={17} />
              KING CLEAN
            </div>

            <h2 className="font-display text-3xl font-black leading-tight text-[var(--color-text)] sm:text-4xl lg:text-5xl">
              {section.title}
            </h2>

            {section.subtitle && (
              <p className="mt-5 max-w-2xl text-base font-bold leading-8 text-[var(--color-muted)] sm:text-lg">
                {section.subtitle}
              </p>
            )}

            {section.body && (
              <p className="mt-4 max-w-2xl text-sm font-bold leading-8 text-[var(--color-muted)] sm:text-base">
                {section.body}
              </p>
            )}

            {section.ctaText && section.ctaUrl && (
              <Link
                className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] px-6 text-sm font-black text-[var(--color-navy)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--color-gold-dark)] hover:text-white focus:outline-none focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-primary)_18%,transparent)]"
                to={section.ctaUrl}
              >
                {section.ctaText}
                <ArrowLeft size={18} />
              </Link>
            )}
          </div>

          {hasMedia ? (
            <div className="relative">
              <div className="absolute -inset-4 rounded-[36px] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-gold)_15%,transparent),color-mix(in_srgb,var(--color-teal)_12%,transparent))] blur-2xl" />

              <div className="relative overflow-hidden rounded-[32px] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-[var(--shadow-strong)]">
                {video ? (
                  <video
                    className="aspect-[4/3] w-full rounded-[24px] object-cover"
                    src={video}
                    poster={image || undefined}
                    controls
                    autoPlay
                  />
                ) : (
                  <img
                    className="w-full rounded-[24px] object-cover"
                    src={image}
                    alt={section.title}
                    loading="lazy"
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="hidden lg:block" />
          )}
        </div>

        {hasItems && (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {payload.items?.map((item, itemIndex) => (
              <div
                key={`${section.id}-${item.title || itemIndex}`}
                className="rounded-[26px] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_88%,transparent)] p-5 text-[var(--color-text)] shadow-[var(--shadow-soft)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[var(--shadow-strong)]"
              >
                <span className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-[color-mix(in_srgb,var(--color-primary)_12%,transparent)] text-[var(--color-primary-dark)] dark:text-[var(--color-gold)]">
                  <CheckCircle2 size={21} />
                </span>

                {item.title && (
                  <h3 className="m-0 font-display text-lg font-black leading-7 text-[var(--color-text)]">
                    {item.title}
                  </h3>
                )}

                {item.description && (
                  <p className="mt-2 text-sm font-bold leading-7 text-[var(--color-muted)]">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
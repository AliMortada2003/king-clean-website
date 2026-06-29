import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaStar,
  FaWhatsapp,
} from "react-icons/fa";

import { useSections, useSettings } from "../../../api/hooks";
import { Seo } from "../../../components/Seo";
import {
  containerClass,
  PageHero,
  primaryButtonClass,
  sectionClass,
  sectionCopyClass,
  sectionTitleClass,
} from "../../../components/public/PublicPrimitives";
import { HomeDynamicSections } from "../../../components/public/sections/HomeDynamicSections";
import { whatsAppUrl } from "../../../lib/format";

const knownAboutSectionKeys = ["about.hero", "about.main", "about.cta"];

export function AboutPage() {
  const settings = useSettings();
  const sections = useSections("about");

  const cms = sections.data || [];

  const hero = cms.find((section) => section.key === "about.hero");
  const main = cms.find((section) => section.key === "about.main");
  const cta = cms.find((section) => section.key === "about.cta");

  const dynamicSections = cms.filter(
    (section) =>
      section.isActive && !knownAboutSectionKeys.includes(section.key),
  );

  const pageTitle = hero?.title || "من نحن";

  const pageDescription =
    hero?.subtitle ||
    hero?.body ||
    "KING CLEAN لخدمات التنظيف والتعقيم في الكويت باهتمام حقيقي بالتفاصيل.";

  const mainTitle = "عناية بالتفاصيل من أول تواصل";

  const mainText =
    main?.body ||
    settings.data?.aboutText ||
    "في KING CLEAN نساعدك في الحصول على مساحة أنظف وأكثر راحة من خلال خدمات تنظيف مرنة تناسب المنازل والشقق والفلل والمكاتب، مع اهتمام بالتفاصيل وجودة التنفيذ.";

  const mainImage = "/images/king-clean-hero.png";

  const wa = whatsAppUrl(settings.data?.whatsApp);

  return (
    <>
      <Seo
        title="من نحن | كينج كلين الكويت | King Clean Kuwait"
        description="تعرف على كينج كلين الكويت، شركة تنظيف تقدم خدمات تنظيف المنازل والشقق والفلل والمكاتب داخل الكويت، مع فريق يهتم بالتفاصيل ومواعيد مرنة."
        canonicalPath="/about"
        keywords={[
          "كينج كلين",
          "King Clean",
          "King Clean Kuwait",
          "شركة تنظيف في الكويت",
          "من نحن كينج كلين",
          "خدمات تنظيف الكويت",
        ]}
      />
      <PageHero
        title={pageTitle}
        description={pageDescription}
      />

      <section className={sectionClass}>
        <div className={`${containerClass} grid items-center gap-10 lg:grid-cols-2`}>
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/20 bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)] px-4 py-2 text-sm font-black text-[var(--color-primary-dark)] dark:text-[var(--color-primary)]">
              <FaStar className="text-amber-400" />
              KING CLEAN
            </div>

            <h2 className={sectionTitleClass}>
              {mainTitle}
            </h2>

            <p className={`${sectionCopyClass} mt-5`}>
              {mainText}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                className={`${primaryButtonClass} min-h-14 px-7`}
                to="/request-service"
              >
                اطلب خدمة
                <FaArrowLeft />
              </Link>

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
          </div>

          <div className="relative">
            <div className="absolute -inset-3 rounded-[34px] bg-gradient-to-br from-[color-mix(in_srgb,var(--color-primary)_16%,transparent)] to-[color-mix(in_srgb,var(--color-teal)_14%,transparent)] blur-xl" />

            <img
              className="relative aspect-[4/3] w-full rounded-[28px] border border-[var(--color-border)] object-cover shadow-strong"
              src={mainImage}
              alt={mainTitle}
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

      <HomeDynamicSections sections={dynamicSections} />

      {cta?.isActive && (
        <section className="pb-14 sm:pb-16 lg:pb-20">
          <div className={containerClass}>
            <div className="relative overflow-hidden rounded-[32px] border border-[var(--color-border)] bg-[var(--color-primary)] p-7 text-white shadow-strong sm:p-9 lg:p-10">
              <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-24 right-20 h-72 w-72 rounded-full bg-[var(--color-teal)]/20 blur-3xl" />

              <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <h2 className="font-display text-2xl font-black sm:text-3xl">
                    {cta.title || "جاهز تخلي مكانك أنضف؟"}
                  </h2>

                  {(cta.body || cta.subtitle) && (
                    <p className="mt-3 text-sm font-bold leading-7 text-white/80 sm:text-base">
                      {cta.body || cta.subtitle}
                    </p>
                  )}
                </div>

                <Link
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-white px-7 text-sm font-black text-[var(--color-primary-dark)] shadow-lg transition hover:-translate-y-1 hover:bg-white/95"
                  to={cta.ctaUrl || "/request-service"}
                >
                  {cta.ctaText || "اطلب خدمة الآن"}
                  <FaArrowLeft />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
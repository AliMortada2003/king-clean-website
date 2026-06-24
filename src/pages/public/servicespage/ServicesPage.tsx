import { useSections } from "../../../api/hooks";
import { Seo } from "../../../components/Seo";
import { PageHero } from "../../../components/public/PublicPrimitives";
import { HomeCtaSection } from "../../../components/public/sections";
import { HomeDynamicSections } from "../../../components/public/sections/HomeDynamicSections";
import { HomeServicesSection } from "../../../components/public/sections/HomeServicesSection";

const knownServicesSectionKeys = [
  "services.hero",
  "services.main",
  "services.cta",
];

export function ServicesPage() {
  const sections = useSections("services");

  const cms = sections.data || [];

  const hero = cms.find((section) => section.key === "services.hero");
  const cta = cms.find((section) => section.key === "services.cta");

  const dynamicSections = cms.filter(
    (section) =>
      section.isActive && !knownServicesSectionKeys.includes(section.key),
  );

  const pageTitle = hero?.title || "خدماتنا";

  const pageDescription =
    hero?.subtitle ||
    hero?.body ||
    "خدمات تنظيف وتعقيم للمنازل والشقق والفلل والمكاتب داخل الكويت.";

  return (
    <>
      <Seo
        title="خدماتنا | KING CLEAN"
        description={pageDescription}
      />

      <PageHero
        title={pageTitle}
        description={pageDescription}
      />

      <HomeServicesSection
        title="كل خدمات KING CLEAN"
        description="اختار الخدمة المناسبة لك من خدمات التنظيف والتعقيم المتاحة داخل الكويت."
        limit={999}
        showMoreButton={false}
      />

      <HomeDynamicSections sections={dynamicSections} />

      <HomeCtaSection cta={cta} />
    </>
  );
}
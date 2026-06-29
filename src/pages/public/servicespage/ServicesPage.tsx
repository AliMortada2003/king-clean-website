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
        title="خدمات التنظيف في الكويت | كينج كلين King Clean"
        description="اكتشف خدمات كينج كلين الكويت: تنظيف منازل، شقق، فلل، مكاتب، كنب، سجاد، عماير، تنظيف عميق وتعقيم بمواعيد مرنة داخل الكويت."
        canonicalPath="/services"
        keywords={[
          "خدمات تنظيف الكويت",
          "كينج كلين",
          "King Clean",
          "شركة تنظيف في الكويت",
          "تنظيف منازل الكويت",
          "تنظيف شقق الكويت",
          "تنظيف فلل الكويت",
          "تنظيف مكاتب الكويت",
          "تنظيف كنب الكويت",
          "تنظيف سجاد الكويت",
          "تنظيف عماير الكويت",
        ]}
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
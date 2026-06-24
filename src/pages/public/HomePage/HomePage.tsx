import { useGallery, useSections, useSettings } from "../../../api/hooks";
import {
  HomeAboutSections,
  HomeAreasSection,
  HomeCtaSection,
  HomeGallerySection,
  HomeHeroSection,
  HomeReviewsSection,
  HomeServicesSection,
  HomeVideosSection,
} from "../../../components/public/sections";
import { HomeDynamicSections } from "../../../components/public/sections/HomeDynamicSections";
import { Seo } from "../../../components/Seo";

const knownHomeSectionKeys = ["home.hero", "home.about", "home.cta"];

export function HomePage() {
  const settings = useSettings();
  const sections = useSections("home");
  const gallery = useGallery();

  const cms = sections.data || [];

  console.log(cms)
  const hero = cms.find((section) => section.key === "home.hero");
  const about = cms.find((section) => section.key === "home.about");
  const cta = cms.find((section) => section.key === "home.cta");

  const dynamicSections = cms.filter(
    (section) =>
      section.isActive && !knownHomeSectionKeys.includes(section.key),
  );

  const subtitle =
    hero?.subtitle ||
    settings.data?.heroSubtitle ||
    "خدمات تنظيف وتعقيم وتعطير للمنازل والشقق والفلل والمكاتب";

  return (
    <>
      <Seo
        title={settings.data?.metaTitle || "KING CLEAN | شركة تنظيف في الكويت"}
        description={settings.data?.metaDescription || subtitle}
      />

      <HomeHeroSection
        hero={hero}
        settings={settings.data}
        galleryImages={gallery.data}
      />

      <HomeServicesSection />
      <HomeAboutSections
        about={about}
        unknownSections={[]}
        settings={settings.data}
      />
      <HomeAreasSection />


      <HomeDynamicSections sections={dynamicSections} />

      <HomeGallerySection />
      <HomeVideosSection />
      <HomeReviewsSection />
      <HomeCtaSection cta={cta} />
    </>
  );
}
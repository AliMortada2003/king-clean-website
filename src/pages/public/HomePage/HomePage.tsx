import { useMemo } from "react";

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

const knownHomeSectionKeys = new Set([
  "home.hero",
  "home.about",
  "home.cta",
  "home.services",
  "home.areas",
  "home.gallery",
  "home.videos",
  "home.reviews",
]);

const isSectionActive = (section: { isActive?: boolean | null }) =>
  section.isActive !== false;

export function HomePage() {
  const settings = useSettings();
  const sections = useSections("home");
  const gallery = useGallery();

  const cms = useMemo(() => sections.data || [], [sections.data]);

  const hero = useMemo(
    () =>
      cms.find(
        (section) => section.key === "home.hero" && isSectionActive(section),
      ),
    [cms],
  );

  const about = useMemo(
    () =>
      cms.find(
        (section) => section.key === "home.about" && isSectionActive(section),
      ),
    [cms],
  );

  const cta = useMemo(
    () =>
      cms.find(
        (section) => section.key === "home.cta" && isSectionActive(section),
      ),
    [cms],
  );

  const dynamicSections = useMemo(
    () =>
      cms.filter(
        (section) =>
          isSectionActive(section) &&
          !knownHomeSectionKeys.has(section.key || ""),
      ),
    [cms],
  );

  const defaultSubtitle =
    "كينج كلين الكويت تقدم خدمات تنظيف المنازل والشقق والفلل والمكاتب، مع حجز سريع ومواعيد مرنة وفريق يهتم بالتفاصيل.";

  const subtitle =
    hero?.subtitle?.trim() ||
    settings.data?.heroSubtitle?.trim() ||
    defaultSubtitle;

  const seoTitle =
    settings.data?.metaTitle?.trim() ||
    "King Clean Kuwait | كينج كلين شركة تنظيف في الكويت";

  const seoDescription =
    settings.data?.metaDescription?.trim() ||
    "كينج كلين الكويت تقدم خدمات تنظيف المنازل والشقق والفلل والمكاتب في الكويت، مع خدمة واتساب سريعة ومواعيد تناسبك.";

  return (
    <>
      <Seo
        title="King Clean Kuwait | كينج كلين شركة تنظيف في الكويت"
        description="كينج كلين الكويت تقدم خدمات تنظيف المنازل والشقق والفلل والمكاتب في الكويت، مع حجز سريع عبر واتساب ومواعيد مرنة."
        canonicalPath="/"
        keywords={[
          "كينج كلين",
          "King Clean",
          "King Clean Kuwait",
          "شركة تنظيف في الكويت",
          "تنظيف منازل الكويت",
          "تنظيف شقق الكويت",
          "تنظيف فلل الكويت",
          "تنظيف مكاتب الكويت",
          "تنظيف كنب الكويت",
          "تنظيف سجاد الكويت",
        ]}
      />
      <HomeHeroSection
        hero={hero}
        settings={settings.data}
        galleryImages={gallery.data || []}
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
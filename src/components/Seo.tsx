import { Helmet } from "react-helmet-async";

type SeoProps = {
  title: string;
  description: string;
  noIndex?: boolean;
  keywords?: string[] | string;
  canonicalPath?: string;
  image?: string;
  type?: "website" | "article";
};

const SITE_URL = "https://kingcleankw.com";
const SITE_NAME = "King Clean Kuwait | كينج كلين الكويت";
const DEFAULT_OG_IMAGE = "/og-image.jpg";

function toAbsoluteUrl(value?: string) {
  if (!value) return undefined;

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  if (value.startsWith("/")) {
    return `${SITE_URL}${value}`;
  }

  return `${SITE_URL}/${value}`;
}

function getCurrentPath() {
  if (typeof window === "undefined") return "/";
  return window.location.pathname || "/";
}

export function Seo({
  title,
  description,
  noIndex = false,
  keywords,
  canonicalPath,
  image = DEFAULT_OG_IMAGE,
  type = "website",
}: SeoProps) {
  const canonicalUrl = toAbsoluteUrl(canonicalPath || getCurrentPath());
  const ogImageUrl = toAbsoluteUrl(image);

  const normalizedKeywords = Array.isArray(keywords)
    ? keywords.join(", ")
    : keywords;

  const robotsContent = noIndex
    ? "noindex,nofollow"
    : "index,follow,max-image-preview:large";

  return (
    <Helmet>
      <html lang="ar-KW" dir="rtl" />

      <title>{title}</title>

      <meta name="description" content={description} />
      <meta name="robots" content={robotsContent} />
      <meta name="application-name" content={SITE_NAME} />
      <meta name="theme-color" content="#0B6F7A" />

      {normalizedKeywords && (
        <meta name="keywords" content={normalizedKeywords} />
      )}

      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      <meta property="og:locale" content="ar_KW" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      {ogImageUrl && <meta property="og:image" content={ogImageUrl} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImageUrl && <meta name="twitter:image" content={ogImageUrl} />}
    </Helmet>
  );
}
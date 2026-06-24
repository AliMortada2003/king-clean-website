import { Helmet } from "react-helmet-async";

export function Seo({
  title,
  description,
  noIndex = false,
}: {
  title: string;
  description: string;
  noIndex?: boolean;
}) {
  const url = typeof window === "undefined" ? "" : window.location.href;
  return (
    <Helmet>
      <html lang="ar" dir="rtl" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
    </Helmet>
  );
}

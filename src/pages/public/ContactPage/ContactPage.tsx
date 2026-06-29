import {
  FaFacebookF,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";

import { useSettings } from "../../../api/hooks";
import { Seo } from "../../../components/Seo";
import {
  containerClass,
  primaryButtonClass,
  sectionClass,
  surfaceClass,
} from "../../../components/public/PublicPrimitives";
import { whatsAppUrl } from "../../../lib/format";

type SiteSettingsWithSocial = {
  phone?: string | null;
  whatsApp?: string | null;
  facebook?: string | null;
  facebookUrl?: string | null;
  instagram?: string | null;
  instagramUrl?: string | null;
  tiktok?: string | null;
  tiktokUrl?: string | null;
  tikTok?: string | null;
  tikTokUrl?: string | null;
};

const DEFAULT_KUWAIT_PHONE = "+96590010556";

const companyAddress = [
  "السالمية",
  "شارع البحرين",
  "مجمع مريم",
  "الدور الأول - مكتب رقم 10",
];

const mapUrl = "https://maps.google.com/?q=29.330528,48.085529";

const mapEmbedUrl =
  "https://maps.google.com/maps?q=29.330528,48.085529&z=17&output=embed";

function getPhoneHref(value?: string | null) {
  const clean = value?.trim() || DEFAULT_KUWAIT_PHONE;
  return `tel:${clean.replace(/[^\d+]/g, "")}`;
}

function getInstagramUrl(value?: string | null) {
  const clean = value?.trim();
  if (!clean) return "";

  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }

  return `https://www.instagram.com/${clean
    .replace(/^@/, "")
    .replace(/^\/+/, "")}`;
}

function getFacebookUrl(value?: string | null) {
  const clean = value?.trim();
  if (!clean) return "";

  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }

  return `https://www.facebook.com/${clean
    .replace(/^@/, "")
    .replace(/^\/+/, "")}`;
}

function getTikTokUrl(value?: string | null) {
  const clean = value?.trim();
  if (!clean) return "";

  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }

  return `https://www.tiktok.com/@${clean
    .replace(/^@/, "")
    .replace(/^\/+/, "")}`;
}

export function ContactPage() {
  const settings = useSettings();
  const siteSettings = settings.data as SiteSettingsWithSocial | undefined;

  const phone = siteSettings?.phone?.trim() || DEFAULT_KUWAIT_PHONE;
  const whatsapp = siteSettings?.whatsApp?.trim() || DEFAULT_KUWAIT_PHONE;

  const phoneHref = getPhoneHref(phone);
  const whatsappHref = whatsAppUrl(whatsapp);

  const facebookUrl = getFacebookUrl(
    siteSettings?.facebookUrl || siteSettings?.facebook,
  );

  const instagramUrl = getInstagramUrl(
    siteSettings?.instagramUrl || siteSettings?.instagram,
  );

  const tiktokUrl = getTikTokUrl(
    siteSettings?.tiktokUrl ||
    siteSettings?.tikTokUrl ||
    siteSettings?.tiktok ||
    siteSettings?.tikTok,
  );

  const socialLinks = [
    {
      label: "واتساب",
      href: whatsappHref,
      icon: FaWhatsapp,
      className:
        "bg-[var(--color-whatsapp)] text-white hover:bg-[color-mix(in_srgb,var(--color-whatsapp)_88%,#000)]",
      external: true,
    },
    {
      label: "اتصال",
      href: phoneHref,
      icon: FaPhoneAlt,
      className:
        "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]",
      external: false,
    },
    instagramUrl
      ? {
        label: "إنستجرام",
        href: instagramUrl,
        icon: FaInstagram,
        className:
          "bg-[linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)] text-white hover:brightness-110",
        external: true,
      }
      : null,
    facebookUrl
      ? {
        label: "فيسبوك",
        href: facebookUrl,
        icon: FaFacebookF,
        className: "bg-[#1877f2] text-white hover:bg-[#0f65d8]",
        external: true,
      }
      : null,
    tiktokUrl
      ? {
        label: "تيك توك",
        href: tiktokUrl,
        icon: FaTiktok,
        className:
          "bg-[var(--color-text)] text-[var(--color-surface)] hover:opacity-90",
        external: true,
      }
      : null,
  ].filter(Boolean);

  return (
    <>
      <Seo
        title="تواصل مع كينج كلين الكويت | King Clean Kuwait"
        description="تواصل مع كينج كلين الكويت لحجز خدمات تنظيف المنازل والشقق والفلل والمكاتب. واتساب واتصال مباشر وخدمة سريعة في مختلف مناطق الكويت."
        canonicalPath="/contact"
        keywords={[
          "تواصل مع كينج كلين",
          "رقم شركة تنظيف في الكويت",
          "King Clean Kuwait",
          "كينج كلين الكويت",
          "حجز تنظيف الكويت",
          "واتساب شركة تنظيف الكويت",
        ]}
      />
      <section className={sectionClass}>
        <div className={`${containerClass} max-w-5xl`}>
          <div className={`${surfaceClass} overflow-hidden p-0`}>
            <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="p-6 sm:p-8 lg:p-10">
                <span className="inline-flex rounded-full bg-[var(--color-primary-soft)] px-4 py-2 text-xs font-black text-[var(--color-primary)]">
                  تواصل معنا
                </span>

                <h1 className="font-display mt-5 text-3xl font-black leading-tight text-[var(--color-text)] sm:text-4xl">
                  كينج كلين الكويت
                </h1>

                <p className="mt-4 max-w-xl text-base font-bold leading-8 text-[var(--color-muted)]">
                  للحجز أو الاستفسار عن خدمات التنظيف، تواصل معنا مباشرة عبر
                  واتساب أو اتصال. نخدم مختلف مناطق الكويت بمواعيد مرنة وخدمة
                  مرتبة.
                </p>

                <div className="mt-7 space-y-2 text-sm font-black leading-7 text-[var(--color-text)]">
                  {companyAddress.map((line) => (
                    <p key={line} className="flex items-center gap-2">
                      <FaMapMarkerAlt className="shrink-0 text-[var(--color-primary)]" />
                      <span>{line}</span>
                    </p>
                  ))}
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className={primaryButtonClass}
                  >
                    <FaWhatsapp />
                    واتساب
                  </a>

                  <a
                    href={phoneHref}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-5 text-sm font-black text-[var(--color-text)] transition hover:-translate-y-1 hover:border-[var(--color-primary)]/30 hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]"
                  >
                    <FaPhoneAlt />
                    اتصال مباشر
                  </a>
                </div>
              </div>

              <div className="min-h-[340px] border-t border-[var(--color-border)] bg-[var(--color-surface-soft)] lg:border-r lg:border-t-0">
                <iframe
                  title="موقع King Clean Kuwait على الخريطة"
                  src={mapEmbedUrl}
                  className="h-full min-h-[340px] w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-display text-lg font-black text-[var(--color-text)]">
                    روابط التواصل
                  </h2>

                  <div className="mt-2 flex flex-wrap gap-2 text-xs font-black text-[var(--color-muted)]">
                    <a
                      href={phoneHref}
                      className="rounded-full bg-[var(--color-primary-soft)] px-3 py-1.5 text-[var(--color-primary)]"
                    >
                      {phone}
                    </a>

                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-[var(--color-whatsapp-soft)] px-3 py-1.5 text-[var(--color-whatsapp)]"
                    >
                      واتساب: {whatsapp}
                    </a>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {socialLinks.map((item) => {
                    if (!item) return null;

                    const Icon = item.icon;

                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noreferrer" : undefined}
                        aria-label={item.label}
                        title={item.label}
                        className={[
                          "group relative grid h-12 w-12 place-items-center rounded-full text-xl shadow-xl shadow-black/10 ring-1 ring-black/5 transition duration-200 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30",
                          item.className,
                        ].join(" ")}
                      >
                        <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 blur-md transition group-hover:scale-125 group-hover:opacity-25" />
                        <Icon className="relative z-10" />
                      </a>
                    );
                  })}

                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="فتح الخريطة"
                    title="فتح الخريطة"
                    className="grid h-12 w-12 place-items-center rounded-full bg-[var(--color-accent)] text-xl text-[var(--color-navy)] shadow-xl shadow-black/10 ring-1 ring-black/5 transition hover:-translate-y-1 hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                  >
                    <FaMapMarkerAlt />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
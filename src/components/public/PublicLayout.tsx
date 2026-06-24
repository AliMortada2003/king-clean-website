import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

import { Brand } from "../Brand";
import { ThemeToggle } from "../ThemeToggle";
import { useSettings } from "../../api/hooks";
import { whatsAppUrl } from "../../lib/format";
import { containerClass, iconButtonClass } from "./PublicPrimitives";

const nav = [
  ["/", "الرئيسية"],
  ["/services", "خدماتنا"],
  ["/areas", "مناطقنا"],
  ["/gallery", "أعمالنا"],
  ["/videos", "الفيديو"],
  ["/about", "من نحن"],
  ["/contact", "تواصل معنا"],
] as const;

const goldCtaClass =
  "group relative inline-flex min-h-12 items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#c98b18_0%,#e7b84a_55%,#b8750b_100%)] px-5 text-sm font-black text-[#071724] shadow-[0_14px_30px_rgba(120,78,12,0.16)] ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(120,78,12,0.20)] focus:outline-none focus:ring-2 focus:ring-[rgba(201,139,24,0.28)]";

const whatsappCtaClass =
  "group relative inline-flex min-h-12 items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[#16835f] px-5 text-sm font-black text-white shadow-[0_14px_30px_rgba(22,131,95,0.14)] ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:bg-[#12714f] hover:shadow-[0_18px_36px_rgba(22,131,95,0.18)] focus:outline-none focus:ring-2 focus:ring-[rgba(22,131,95,0.24)]";

const shineClass =
  "before:absolute before:inset-0 before:-translate-x-full before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)] before:transition before:duration-700 hover:before:translate-x-full";
export function PublicLayout() {
  const [open, setOpen] = useState(false);
  const { data: settings } = useSettings();

  const wa = whatsAppUrl(settings?.whatsApp);
  const close = () => setOpen(false);

  const socialLinks = [
    wa
      ? {
        label: "تواصل عبر واتساب",
        href: wa,
        icon: FaWhatsapp,
        className: "bg-[#16835f] hover:bg-[#12714f]",
      }
      : null,
    settings?.instagramUrl
      ? {
        label: "تابعنا على إنستجرام",
        href: settings.instagramUrl,
        icon: FaInstagram,
        className:
          "bg-[linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)] hover:brightness-110",
      }
      : null,
    settings?.facebookUrl
      ? {
        label: "تابعنا على فيسبوك",
        href: settings.facebookUrl,
        icon: FaFacebookF,
        className: "bg-[#1877f2] hover:bg-[#0f65d8]",
      }
      : null,
  ].filter(Boolean);
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <header className="fixed inset-x-0 top-0 z-50 h-[var(--header-height)] overflow-hidden border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_88%,transparent)] shadow-sm shadow-black/5 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-surface)_100%,transparent)_0%,color-mix(in_srgb,var(--color-gold)_6%,transparent)_55%,color-mix(in_srgb,var(--color-teal)_5%,transparent)_100%)]" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[var(--color-gold)]/8 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-16 h-60 w-60 rounded-full bg-[var(--color-teal)]/8 blur-3xl" />

        <div className={`${containerClass} relative z-10 flex h-full items-center justify-between gap-3`}>
          <Link
            to="/"
            onClick={close}
            className="shrink-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-primary)_44%,transparent)]"
            aria-label="KING CLEAN الرئيسية"
          >
            <Brand />
          </Link>

          <nav
            className="hidden min-w-0 flex-1 items-center justify-center gap-1 xl:flex 2xl:gap-1.5"
            aria-label="التنقل الرئيسي"
          >
            {nav.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  [
                    "whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-black leading-none transition 2xl:px-4 2xl:text-sm",
                    isActive
                      ? "bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-gold)_22%,transparent),color-mix(in_srgb,var(--color-teal)_10%,transparent))] text-[var(--color-primary-dark)] shadow-sm dark:text-[var(--color-gold)]"
                      : "text-[var(--color-muted)] hover:bg-[color-mix(in_srgb,var(--color-surface)_74%,transparent)] hover:text-[var(--color-text)]",
                  ].join(" ")
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-2 xl:flex">
            <ThemeToggle />

            {wa && (
              <a
                className={`${whatsappCtaClass} ${shineClass} min-h-11 px-4 2xl:min-h-12`}
                href={wa}
                target="_blank"
                rel="noreferrer"
              >
                <FaWhatsapp className="relative z-10 text-xl transition group-hover:scale-110" />
                <span className="relative z-10">واتساب</span>
              </a>
            )}

            <Link
              className={`${goldCtaClass} ${shineClass} min-h-11 whitespace-nowrap px-4 2xl:min-h-12 2xl:px-5`}
              to="/request-service"
            >
              <span className="relative z-10">اطلب خدمة</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 xl:hidden">
            <ThemeToggle className="px-1.5 sm:px-2" />

            {wa && (
              <a
                className="grid h-10 w-10 place-items-center rounded-2xl bg-[linear-gradient(135deg,#128c4a,#25d366,#0c7a43)] text-white shadow-[0_12px_26px_rgba(37,211,102,0.22)] sm:h-11 sm:w-11"
                href={wa}
                target="_blank"
                rel="noreferrer"
                aria-label="تواصل عبر واتساب"
              >
                <FaWhatsapp className="text-xl" />
              </a>
            )}

            <button
              className={iconButtonClass}
              onClick={() => setOpen(true)}
              aria-label="فتح القائمة"
              type="button"
            >
              <Menu />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[60] bg-[var(--color-overlay)] backdrop-blur-sm xl:hidden">
          <aside className="absolute inset-y-0 right-0 flex h-full w-[88%] max-w-sm flex-col overflow-hidden border-l border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-[var(--color-text)] shadow-strong sm:p-6">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,color-mix(in_srgb,var(--color-surface)_100%,transparent)_0%,color-mix(in_srgb,var(--color-gold)_10%,transparent)_52%,color-mix(in_srgb,var(--color-teal)_10%,transparent)_100%)]" />
            <div className="pointer-events-none absolute -right-20 top-16 h-44 w-44 rounded-full bg-[var(--color-gold)]/12 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 left-8 h-48 w-48 rounded-full bg-[var(--color-teal)]/12 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col">
              <button
                className={`${iconButtonClass} absolute left-0 top-0`}
                onClick={close}
                aria-label="إغلاق القائمة"
                type="button"
              >
                <X />
              </button>

              <Link to="/" onClick={close} className="mb-8 mt-2 w-fit">
                <Brand />
              </Link>

              <nav className="flex flex-col gap-2" aria-label="قائمة الموبايل">
                {nav.map(([to, label]) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === "/"}
                    onClick={close}
                    className={({ isActive }) =>
                      [
                        "rounded-2xl px-4 py-3 text-base font-black transition",
                        isActive
                          ? "bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-gold)_20%,transparent),color-mix(in_srgb,var(--color-teal)_10%,transparent))] text-[var(--color-primary-dark)] dark:text-[var(--color-gold)]"
                          : "text-[var(--color-muted)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text)]",
                      ].join(" ")
                    }
                  >
                    {label}
                  </NavLink>
                ))}
              </nav>

              <div className="mt-auto space-y-3 pt-8">
                <ThemeToggle className="w-full justify-between px-3" />

                <Link
                  className={`${goldCtaClass} ${shineClass} w-full`}
                  to="/request-service"
                  onClick={close}
                >
                  <span className="relative z-10">اطلب خدمة</span>
                </Link>

                {wa && (
                  <a
                    className={`${whatsappCtaClass} ${shineClass} w-full`}
                    href={wa}
                    target="_blank"
                    rel="noreferrer"
                    onClick={close}
                  >
                    <FaWhatsapp className="relative z-10 text-xl" />
                    <span className="relative z-10">تواصل واتساب</span>
                  </a>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}

      <main className="pt-[var(--header-height)]">
        <Outlet />
      </main>

      <footer className="relative overflow-hidden bg-[var(--color-navy)] py-12 text-white sm:py-16 lg:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,#06111b_0%,var(--color-navy)_52%,#0a2536_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(224,165,43,0.10),transparent_34%),radial-gradient(circle_at_12%_82%,rgba(97,216,210,0.08),transparent_36%)]" />
        <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-[var(--color-gold)]/9 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[var(--color-teal)]/8 blur-3xl" />

        <div className={`${containerClass} relative z-10`}>
          <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.75fr_1fr_0.9fr] lg:gap-8 xl:gap-10">
            <div className="sm:col-span-2 lg:col-span-1">
              <Brand tone="light" />

              <p className="mt-5 max-w-md text-sm font-medium leading-8 text-white/72 sm:text-base">
                {settings?.aboutText ||
                  "نقدم خدمات تنظيف وتعقيم للمنازل، الشقق، الفلل والمكاتب في الكويت بجودة عالية واهتمام بالتفاصيل."}
              </p>
            </div>

            <div>
              <h3 className="mb-5 text-base font-black text-white sm:text-lg">
                روابط سريعة
              </h3>

              <div className="grid gap-3">
                {nav.slice(0, 5).map(([to, label]) => (
                  <Link
                    className="w-fit whitespace-nowrap text-sm font-bold text-white/70 transition hover:translate-x-[-3px] hover:text-[var(--color-gold)]"
                    key={to}
                    to={to}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-5 text-base font-black text-white sm:text-lg">
                تواصل معنا
              </h3>

              <div className="grid gap-3 text-sm font-bold text-white/70">
                {settings?.phone && (
                  <a
                    className="flex min-w-0 items-center gap-2 transition hover:text-[var(--color-gold)]"
                    href={`tel:${settings.phone}`}
                  >
                    <Phone className="shrink-0" size={17} />
                    <span className="break-words">{settings.phone}</span>
                  </a>
                )}

                {settings?.email && (
                  <a
                    className="flex min-w-0 items-center gap-2 transition hover:text-[var(--color-gold)]"
                    href={`mailto:${settings.email}`}
                  >
                    <Mail className="shrink-0" size={17} />
                    <span className="break-all">{settings.email}</span>
                  </a>
                )}

                {settings?.address && (
                  <p className="flex min-w-0 items-start gap-2 leading-7">
                    <MapPin className="mt-1 shrink-0" size={17} />
                    <span className="break-words">{settings.address}</span>
                  </p>
                )}

                {wa && (
                  <a
                    className={`${whatsappCtaClass} ${shineClass} mt-1 w-fit min-h-11 px-4`}
                    href={wa}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaWhatsapp className="relative z-10 text-xl" />
                    <span className="relative z-10">واتساب مباشر</span>
                  </a>
                )}
              </div>
            </div>

            <div>
              <h3 className="mb-5 text-base font-black text-white sm:text-lg">
                أوقات العمل
              </h3>

              <p className="text-sm font-bold leading-8 text-white/70">
                {settings?.workingHours ||
                  "تواصل ويانا ونعطيك أقرب موعد متاح حسب منطقتك."}
              </p>

              <Link
                className={`${goldCtaClass} ${shineClass} mt-5 w-full sm:w-fit`}
                to="/request-service"
              >
                <span className="relative z-10">ابدأ طلبك</span>
              </Link>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-center text-xs font-bold leading-6 text-white/50 sm:text-sm md:flex-row md:items-center md:justify-between md:text-start">
            <span>
              © {new Date().getFullYear()} KING CLEAN. جميع الحقوق محفوظة.
            </span>

            <span>خدمة تنظيف موثوقة في مختلف مناطق الكويت</span>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-4 left-4 z-40 flex flex-col items-start gap-3 sm:bottom-5 sm:left-5">
        <div className="fixed bottom-4 left-4 z-40 flex flex-col items-start gap-3 sm:bottom-5 sm:left-5">
          <div className="flex flex-col-2 gap-2">
            {socialLinks.map((item) => {
              if (!item) return null;

              const Icon = item.icon;

              return (
                <a
                  key={item.label}
                  className={[
                    "group relative grid h-12 w-12 place-items-center rounded-full text-white shadow-xl shadow-black/15 transition hover:-translate-y-1 sm:h-14 sm:w-14",
                    item.className,
                  ].join(" ")}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                >
                  <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 blur-md transition group-hover:scale-125 group-hover:opacity-25" />
                  <Icon className="relative z-10 text-2xl sm:text-3xl" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
import { Link } from "react-router-dom";
import { FaBroom, FaHome, FaSearch, FaSprayCan } from "react-icons/fa";


import { Seo } from "../../components/Seo";
import {
  containerClass,
  primaryButtonClass,
  sectionClass,
} from "../../components/public/PublicPrimitives";

export default function NotFoundPage() {
  return (
    <>
      <Seo
        title="الصفحة غير موجودة | KING CLEAN"
        description="تعذر العثور على الصفحة المطلوبة داخل موقع KING CLEAN."
      />

      <section className="relative min-h-[calc(100svh-var(--header-height))] overflow-hidden bg-[var(--color-bg)]">
        <div className="pointer-events-none absolute right-[-120px] top-10 h-80 w-80 rounded-full bg-[var(--color-primary)]/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-140px] left-[-120px] h-96 w-96 rounded-full bg-[var(--color-teal)]/10 blur-3xl" />

        <div className={`${containerClass} relative z-10 flex min-h-[calc(100svh-var(--header-height))] items-center justify-center py-16`}>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-[2rem] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_85%,transparent)] shadow-strong backdrop-blur">
              <FaBroom className="text-5xl text-[var(--color-primary)]" />
            </div>

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-black text-emerald-500">
              <FaSprayCan />
              يبدو إننا نظفنا الرابط ده زيادة شوية
            </div>

            <h1 className="font-display text-7xl font-black text-[var(--color-text)] sm:text-8xl">
              404
            </h1>

            <h2 className="mt-4 font-display text-3xl font-black text-[var(--color-text)] sm:text-4xl">
              الصفحة غير موجودة
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-base font-bold leading-8 text-[var(--color-muted)] sm:text-lg">
              الرابط اللي بتحاول تفتحه مش موجود، ممكن يكون اتنقل أو اتغير.
              ارجع للرئيسية واختار الخدمة المناسبة لك من KING CLEAN.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                className={`${primaryButtonClass} min-h-14 px-7`}
                to="/"
              >
                <FaHome />
                العودة للرئيسية
              </Link>

              <Link
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-7 text-sm font-black text-[var(--color-text)] shadow-soft transition hover:-translate-y-1 hover:border-[var(--color-primary)] hover:text-[var(--color-primary-dark)] hover:shadow-strong dark:hover:text-[var(--color-primary)]"
                to="/services"
              >
                <FaSearch className="text-[var(--color-primary)]" />
                تصفح خدماتنا
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
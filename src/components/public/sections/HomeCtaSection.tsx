import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaBroom,
  FaCommentDots,
  FaHandSparkles,
} from "react-icons/fa";

import { containerClass } from "../PublicPrimitives";
import type { HomeCmsSection } from "./types";

type HomeCtaSectionProps = {
  cta?: HomeCmsSection;
};

export function HomeCtaSection({ cta }: HomeCtaSectionProps) {

  return (
    <section className="py-14 sm:py-16 lg:py-20">
      <div className={containerClass}>
        <div className="relative overflow-hidden rounded-[34px] border border-[var(--color-border)] bg-[var(--color-navy)] p-7 text-white shadow-strong sm:p-9 lg:p-11">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[var(--color-primary)]/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-10 h-80 w-80 rounded-full bg-[var(--color-teal)]/20 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),transparent_42%,rgba(255,255,255,0.06))]" />

          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-black text-[var(--color-primary)] backdrop-blur">
                <FaHandSparkles className="text-amber-300" />
                KING CLEAN
              </div>

              <h2 className="font-display text-2xl font-black leading-tight text-white sm:text-3xl lg:text-4xl">
                {cta?.title || "جاهز تطلب الخدمة؟"}
              </h2>

              <p className="mt-4 max-w-2xl text-sm font-bold leading-7 text-white/75 sm:text-base sm:leading-8">
                {cta?.body ||
                  cta?.subtitle ||
                  "حدد المنطقة والخدمة واترك رقمك، وفريق KING CLEAN هيتواصل معاك لتأكيد التفاصيل والميعاد المناسب."}
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                className="group inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] px-7 text-sm font-black text-[var(--color-navy)] shadow-lg shadow-black/10 transition hover:-translate-y-1 hover:bg-[var(--color-gold-dark)] hover:text-white sm:w-auto sm:text-base"
                to={cta?.ctaUrl || "/request-service"}
              >
                <FaBroom className="transition group-hover:rotate-[-8deg]" />
                {cta?.ctaText || "ابدأ الطلب"}
                <FaArrowLeft className="transition group-hover:-translate-x-1" />
              </Link>

              <Link
                className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-7 text-sm font-black text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/15 sm:w-auto sm:text-base"
                to="/contact"
              >
                <FaCommentDots className="text-[var(--color-primary)]" />
                تواصل معنا
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
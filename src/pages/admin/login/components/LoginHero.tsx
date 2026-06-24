import { Brand } from "../../../../components/Brand";

export function LoginHero() {
  return (
    <div className="relative hidden overflow-hidden bg-[var(--color-navy)] p-12 text-white lg:block">
      <img
        className="absolute inset-0 h-full w-full object-cover opacity-30"
        src="/images/king-clean-hero.png"
        alt=""
      />

      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(3,7,11,0.94),rgba(6,23,36,0.86),rgba(10,43,63,0.74))]" />
      <div className="absolute -right-24 top-20 h-72 w-72 rounded-full bg-[var(--color-gold)]/12 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[var(--color-teal)]/12 blur-3xl" />

      <div className="relative z-10 flex h-full flex-col justify-between">
        <Brand tone="light" />

        <div>
          <p className="mb-4 w-fit rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-black text-[var(--color-gold)]">
            KING CLEAN ADMIN
          </p>

          <h1 className="font-display text-5xl font-black leading-tight">
            مركز إدارة
            <br />
            عمليات النظافة
          </h1>

          <p className="mt-5 max-w-md text-lg font-bold leading-9 text-white/70">
            تابع الطلبات والمحتوى والخدمات من مساحة عمل واحدة واضحة.
          </p>
        </div>

        <span className="text-sm font-bold text-white/45">
          KING CLEAN Business Command Center
        </span>
      </div>
    </div>
  );
}
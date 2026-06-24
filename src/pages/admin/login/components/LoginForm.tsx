import { ArrowLeft, LockKeyhole, Mail } from "lucide-react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Link } from "react-router-dom";

import { Brand } from "../../../../components/Brand";
import { InlineLoading } from "../../../../components/ui";
import type { LoginValues, ServerHealthState } from "../types";
import { ServerHealthIndicator } from "./ServerHealthIndicator";

type LoginFormProps = {
  register: UseFormRegister<LoginValues>;
  errors: FieldErrors<LoginValues>;
  healthState: ServerHealthState;
  isLoggingIn: boolean;
  onSubmit: () => void;
};

const inputClass =
  "min-h-12 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 pr-11 text-sm font-bold text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-muted)]/70 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-primary)_16%,transparent)] disabled:cursor-not-allowed disabled:opacity-60";

const labelClass = "mb-2 block text-sm font-black text-[var(--color-text)]";

const errorClass = "mt-2 block text-xs font-bold text-[var(--color-danger)]";

export function LoginForm({
  register,
  errors,
  healthState,
  isLoggingIn,
  onSubmit,
}: LoginFormProps) {
  return (
    <div className="flex items-center bg-[var(--color-surface)] p-6 text-[var(--color-text)] md:p-12">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-10 lg:hidden">
          <Brand />
        </div>

        <Link
          className="mb-8 inline-flex items-center gap-2 rounded-full bg-[color-mix(in_srgb,var(--color-teal)_10%,transparent)] px-4 py-2 text-sm font-black text-[var(--color-teal)] transition hover:-translate-y-0.5 hover:bg-[color-mix(in_srgb,var(--color-teal)_16%,transparent)]"
          to="/"
        >
          <ArrowLeft size={16} />
          العودة للموقع
        </Link>

        <h1 className="m-0 font-display text-3xl font-black leading-tight text-[var(--color-text)] sm:text-4xl">
          تسجيل دخول الإدارة
        </h1>

        <p className="mt-3 text-sm font-bold leading-8 text-[var(--color-muted)] sm:text-base">
          أدخل بيانات حساب المدير للوصول إلى لوحة التحكم.
        </p>

        <ServerHealthIndicator state={healthState} />

        <form className="grid gap-5" onSubmit={onSubmit} noValidate autoComplete="off">
          <div>
            <label className={labelClass} htmlFor="email">
              البريد الإلكتروني
            </label>

            <div className="relative">
              <Mail
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
                size={18}
              />

              <input
                className={inputClass}
                id="email"
                type="email"
                autoComplete="off"
                {...register("email")}
              />
            </div>

            {errors.email && (
              <span className={errorClass}>{errors.email.message}</span>
            )}
          </div>

          <div>
            <label className={labelClass} htmlFor="password">
              كلمة المرور
            </label>

            <div className="relative">
              <LockKeyhole
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
                size={18}
              />

              <input
                className={inputClass}
                id="password"
                type="password"
                autoComplete="off"
                {...register("password")}
              />
            </div>

            {errors.password && (
              <span className={errorClass}>{errors.password.message}</span>
            )}
          </div>

          {errors.root && (
            <p className="m-0 rounded-2xl border border-[color-mix(in_srgb,var(--color-danger)_18%,transparent)] bg-[color-mix(in_srgb,var(--color-danger)_8%,transparent)] p-4 text-sm font-bold leading-7 text-[var(--color-danger)]">
              {errors.root.message}
            </p>
          )}

          <button
            className="mt-2 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] px-5 text-sm font-black text-[var(--color-navy)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--color-gold-dark)] hover:text-white focus:outline-none focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-primary)_18%,transparent)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
            type="submit"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? <InlineLoading /> : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </div>
  );
}
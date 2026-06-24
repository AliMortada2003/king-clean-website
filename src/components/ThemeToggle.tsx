import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import {
  applyTheme,
  getInitialTheme,
  persistTheme,
  type ThemeMode,
} from "../lib/theme";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const [theme, setTheme] = useState<ThemeMode>(() => getInitialTheme());
  const isDark = theme === "dark";

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      persistTheme(next);
      return next;
    });
  };

  return (
    <button
      type="button"
      aria-label={isDark ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
      aria-pressed={isDark}
      title={isDark ? "الوضع الفاتح" : "الوضع الداكن"}
      onClick={toggleTheme}
      className={[
        "group inline-flex h-11 items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-2 text-[var(--color-text)] shadow-sm shadow-black/5 transition hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-primary)_42%,transparent)]",
        className,
      ].join(" ")}
    >
      <span className="relative grid h-7 w-12 place-items-center rounded-full bg-[var(--color-surface-soft)] p-1 transition">
        <span
          className={[
            "absolute h-5 w-5 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] shadow-sm transition-transform duration-300",
            isDark ? "-translate-x-2.5" : "translate-x-2.5",
          ].join(" ")}
        />
        <Sun
          size={14}
          className={[
            "absolute right-2 z-10 transition",
            isDark ? "text-[var(--color-muted)] opacity-60" : "text-white",
          ].join(" ")}
        />
        <Moon
          size={14}
          className={[
            "absolute left-2 z-10 transition",
            isDark ? "text-[var(--color-navy)]" : "text-[var(--color-muted)] opacity-60",
          ].join(" ")}
        />
      </span>
      <span className="hidden text-xs font-black sm:inline">
        {isDark ? "داكن" : "فاتح"}
      </span>
    </button>
  );
}

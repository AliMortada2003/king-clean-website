/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--color-ink)",
        navy: "var(--color-navy)",
        teal: "var(--color-teal)",
        gold: "var(--color-gold)",
        mist: "var(--color-mist)",
        soft: "var(--color-soft)",
        surface: "var(--color-surface)",
        border: "var(--color-border)",
      },
      fontFamily: {
        sans: ["Tajawal", "sans-serif"],
        display: ["Alexandria", "Tajawal", "sans-serif"],
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        strong: "var(--shadow-strong)",
        glow: "var(--shadow-glow)",
      },
      keyframes: {
        "logo-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
      animation: {
        "logo-float": "logo-float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

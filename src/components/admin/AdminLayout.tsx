import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  ChartNoAxesCombined,
  ClipboardList,
  GalleryHorizontal,
  House,
  LayoutDashboard,
  LogOut,
  MapPinned,
  Menu,
  MessageSquareQuote,
  PanelsTopLeft,
  PlaySquare,
  Settings,
  Upload,
  Wrench,
  X,
} from "lucide-react";

import { ThemeToggle } from "../ThemeToggle";
import { useAuth } from "../../auth/AuthProvider";

const adminNav = [
  ["/admin", "لوحة التحكم", LayoutDashboard],
  ["/admin/requests", "طلبات الخدمة", ClipboardList],
  ["/admin/services", "الخدمات", Wrench],
  ["/admin/areas", "المناطق", MapPinned],
  ["/admin/gallery", "معرض الأعمال", GalleryHorizontal],
  ["/admin/videos", "الفيديوهات", PlaySquare],
  ["/admin/reviews", "آراء العملاء", MessageSquareQuote],
  ["/admin/sections", "أقسام المحتوى", PanelsTopLeft],
  ["/admin/uploads", "الملفات", Upload],
  ["/admin/settings", "الإعدادات", Settings],
] as const;

const sidebarShellClass =
  "relative overflow-hidden border-l border-white/10 bg-[#061724] text-white shadow-[0_28px_80px_rgba(0,0,0,0.28)]";

const sidebarBgClass =
  "pointer-events-none absolute inset-0 bg-[linear-gradient(155deg,#03111d_0%,#08273a_54%,#061724_100%)]";

const navLinkClass = (isActive: boolean) =>
  [
    "group relative flex items-center gap-3 rounded-2xl border-l-4 px-3 py-3 text-sm font-black transition",
    "focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-gold)_42%,transparent)]",
    isActive
      ? "border-[var(--color-gold)] bg-white/10 text-white shadow-lg shadow-black/10"
      : "border-transparent text-white/72 hover:bg-white/7 hover:text-white",
  ].join(" ");

const navIconClass = (isActive: boolean) =>
  [
    "grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition",
    isActive
      ? "border-[color-mix(in_srgb,var(--color-gold)_38%,transparent)] bg-[color-mix(in_srgb,var(--color-gold)_18%,transparent)] text-[var(--color-gold)]"
      : "border-white/10 bg-white/6 text-white/80 group-hover:text-[var(--color-gold)]",
  ].join(" ");

const bottomNavClass = (isActive: boolean) =>
  [
    "flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-black transition",
    isActive
      ? "bg-[color-mix(in_srgb,var(--color-gold)_16%,transparent)] text-[var(--color-gold-dark)] dark:text-[var(--color-gold)]"
      : "text-[var(--color-muted)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text)]",
  ].join(" ");

function AdminBrand({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      className="flex w-fit items-center gap-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-gold)_42%,transparent)]"
      to="/"
      onClick={onClick}
      aria-label="KING CLEAN الموقع العام"
    >
      <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/12 bg-white shadow-lg shadow-black/15">
        <img
          alt="KING CLEAN Logo"
          className="h-full w-full object-contain"
          src="/images/logo-website/light.jpeg"
        />
      </span>

      <span className="leading-tight">
        <strong className="block text-xl font-black tracking-wide text-white">
          KING CLEAN
        </strong>
        <span className="mt-1 block text-xs font-bold text-white/58">
          لوحة الإدارة
        </span>
      </span>
    </Link>
  );
}

export function AdminLayout() {
  const { session, logout } = useAuth();
  const [drawer, setDrawer] = useState(false);

  const adminName = session?.admin.fullName || "المدير";
  const adminEmail = session?.admin.email || "";

  const closeDrawer = () => setDrawer(false);

  const navItems = (mobile = false) => (
    <nav className="grid gap-1.5" aria-label="لوحة الإدارة">
      {adminNav.map(([to, label, Icon]) => (
        <NavLink
          className={({ isActive }) => navLinkClass(isActive)}
          end={to === "/admin"}
          key={to}
          to={to}
          onClick={() => mobile && closeDrawer()}
        >
          {({ isActive }) => (
            <>
              <span className={navIconClass(isActive)}>
                <Icon size={19} />
              </span>

              <span className="truncate">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] lg:grid lg:grid-cols-[286px_minmax(0,1fr)]">
      <aside
        className={`${sidebarShellClass} sticky top-0 hidden h-screen lg:flex lg:flex-col`}
      >
        <div className={sidebarBgClass} />
        <div className="pointer-events-none absolute -right-24 top-12 h-56 w-56 rounded-full bg-[var(--color-gold)]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-4 h-56 w-56 rounded-full bg-[var(--color-teal)]/10 blur-3xl" />

        <div className="relative z-10 flex h-full flex-col p-5">
          <div className="mb-7">
            <AdminBrand />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pl-1">
            {navItems()}
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/7 p-4 shadow-sm backdrop-blur">
            <strong className="block truncate text-sm font-black text-white">
              {adminName}
            </strong>

            {adminEmail && (
              <small className="mt-1 block truncate text-xs font-bold text-white/55">
                {adminEmail}
              </small>
            )}

            <button
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-[color-mix(in_srgb,var(--color-danger)_22%,transparent)] bg-[color-mix(in_srgb,var(--color-danger)_12%,transparent)] px-4 py-3 text-sm font-black text-[#ffb7b7] transition hover:-translate-y-0.5 hover:bg-[var(--color-danger)] hover:text-white"
              type="button"
              onClick={logout}
            >
              <LogOut size={18} />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </aside>

      {drawer && (
        <div className="fixed inset-0 z-[70] bg-[var(--color-overlay)] backdrop-blur-sm lg:hidden">
          <button
            className="absolute inset-0 cursor-default"
            type="button"
            aria-label="إغلاق قائمة الإدارة"
            onClick={closeDrawer}
          />

          <aside
            className={`${sidebarShellClass} absolute inset-y-0 right-0 flex h-full w-[88%] max-w-sm flex-col p-5`}
          >
            <div className={sidebarBgClass} />
            <div className="pointer-events-none absolute -right-20 top-16 h-44 w-44 rounded-full bg-[var(--color-gold)]/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 left-8 h-48 w-48 rounded-full bg-[var(--color-teal)]/10 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col">
              <div className="mb-7 flex items-center justify-between gap-3">
                <AdminBrand onClick={closeDrawer} />

                <button
                  className="grid h-11 w-11 place-items-center rounded-2xl border border-white/12 bg-white/8 text-white shadow-sm transition hover:bg-white/12"
                  type="button"
                  onClick={closeDrawer}
                  aria-label="إغلاق القائمة"
                >
                  <X size={21} />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto pl-1">
                {navItems(true)}
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/7 p-4 shadow-sm backdrop-blur">
                <strong className="block truncate text-sm font-black text-white">
                  {adminName}
                </strong>

                {adminEmail && (
                  <small className="mt-1 block truncate text-xs font-bold text-white/55">
                    {adminEmail}
                  </small>
                )}

                <button
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[color-mix(in_srgb,var(--color-danger)_14%,transparent)] px-4 py-3 text-sm font-black text-[#ffb7b7] transition hover:bg-[var(--color-danger)] hover:text-white"
                  type="button"
                  onClick={logout}
                >
                  <LogOut size={18} />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      <div className="min-w-0">
        <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_92%,transparent)] shadow-sm shadow-black/5 backdrop-blur-xl">
          <div className="flex min-h-[76px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm transition hover:bg-[var(--color-surface-soft)] lg:hidden"
                type="button"
                onClick={() => setDrawer(true)}
                aria-label="فتح قائمة الإدارة"
              >
                <Menu size={21} />
              </button>

              <div className="min-w-0">
                <strong className="block truncate text-sm font-black text-[var(--color-text)] sm:text-base">
                  مرحبًا، {adminName}
                </strong>

                <span className="mt-1 hidden text-xs font-bold text-[var(--color-muted)] sm:block">
                  إدارة عمليات KING CLEAN
                </span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <ThemeToggle />

              <Link
                className="hidden min-h-11 items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm font-black text-[var(--color-text)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--color-surface-soft)] sm:inline-flex"
                to="/"
              >
                <House size={17} />
                <span>الموقع العام</span>
              </Link>

              <button
                className="hidden min-h-11 items-center justify-center gap-2 rounded-2xl border border-[color-mix(in_srgb,var(--color-danger)_18%,transparent)] bg-[color-mix(in_srgb,var(--color-danger)_8%,transparent)] px-4 text-sm font-black text-[var(--color-danger)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--color-danger)] hover:text-white sm:inline-flex"
                type="button"
                onClick={logout}
              >
                <LogOut size={17} />
                <span>الخروج</span>
              </button>
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-76px)] px-4 pb-28 pt-5 sm:px-6 sm:pt-6 lg:px-8 lg:pb-8">
          <Outlet />
        </main>
      </div>

      <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-5 gap-1 rounded-[24px] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_94%,transparent)] p-2 shadow-strong backdrop-blur-xl lg:hidden">
        <NavLink
          className={({ isActive }) => bottomNavClass(isActive)}
          end
          to="/admin"
        >
          <ChartNoAxesCombined size={20} />
          <span>الرئيسية</span>
        </NavLink>

        <NavLink
          className={({ isActive }) => bottomNavClass(isActive)}
          to="/admin/requests"
        >
          <ClipboardList size={20} />
          <span>الطلبات</span>
        </NavLink>

        <NavLink
          className={({ isActive }) => bottomNavClass(isActive)}
          to="/admin/services"
        >
          <Wrench size={20} />
          <span>الخدمات</span>
        </NavLink>

        <NavLink
          className={({ isActive }) => bottomNavClass(isActive)}
          to="/admin/gallery"
        >
          <GalleryHorizontal size={20} />
          <span>الأعمال</span>
        </NavLink>

        <button
          className="flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-black text-[var(--color-muted)] transition hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text)]"
          type="button"
          onClick={() => setDrawer(true)}
        >
          <Menu size={20} />
          <span>المزيد</span>
        </button>
      </nav>
    </div>
  );
}

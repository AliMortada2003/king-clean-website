import { FaFacebookF, FaInstagram, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";

import { whatsAppUrl } from "../../lib/format";

type FloatingIconsSettings = {
    phone?: string | null;
    whatsApp?: string | null;
    facebookUrl?: string | null;
    instagramUrl?: string | null;
};

type FloatingIconsProps = {
    settings?: FloatingIconsSettings | null;
};

type FloatingIconItem = {
    label: string;
    href: string;
    icon: typeof FaWhatsapp;
    className: string;
    external: boolean;
};

const DEFAULT_KUWAIT_PHONE = "+96590010556";

function getPhoneHref(phone?: string | null) {
    const value = phone?.trim() || DEFAULT_KUWAIT_PHONE;

    return `tel:${value.replace(/[^\d+]/g, "")}`;
}

function getExternalUrl(url?: string | null) {
    const value = url?.trim();

    if (!value) return "";

    if (/^https?:\/\//i.test(value)) {
        return value;
    }

    return `https://${value}`;
}

export function FloatingIcons({ settings }: FloatingIconsProps) {
    const phone = settings?.phone?.trim() || DEFAULT_KUWAIT_PHONE;
    const whatsapp = settings?.whatsApp?.trim() || DEFAULT_KUWAIT_PHONE;

    const whatsappHref = whatsAppUrl(whatsapp);
    const phoneHref = getPhoneHref(phone);

    // دول مفيهمش default intentionally
    // لو settings null أو اللينكات فاضية مش هيظهروا
    const facebookHref = getExternalUrl(settings?.facebookUrl);
    const instagramHref = getExternalUrl(settings?.instagramUrl);

    const items: FloatingIconItem[] = [
        {
            label: "تواصل واتساب",
            href: whatsappHref,
            icon: FaWhatsapp,
            className:
                "bg-[var(--color-whatsapp)] hover:bg-[color-mix(in_srgb,var(--color-whatsapp)_88%,#000)]",
            external: true,
        },
        {
            label: "اتصال مباشر",
            href: phoneHref,
            icon: FaPhoneAlt,
            className:
                "bg-[var(--color-primary-dark)] hover:bg-[var(--color-primary-dark)]",
            external: false,
        },
    ];

    if (facebookHref) {
        items.push({
            label: "فيسبوك",
            href: facebookHref,
            icon: FaFacebookF,
            className: "bg-[#1877f2] hover:bg-[#0f65d8]",
            external: true,
        });
    }

    if (instagramHref) {
        items.push({
            label: "إنستجرام",
            href: instagramHref,
            icon: FaInstagram,
            className:
                "bg-[linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)] hover:brightness-110",
            external: true,
        });
    }

    return (
        <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2 sm:bottom-5 sm:right-5">
            {items.map((item) => {
                const Icon = item.icon;

                return (
                    <a
                        key={item.label}
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noreferrer" : undefined}
                        aria-label={item.label}
                        className={[
                            "group relative grid h-11 w-11 place-items-center rounded-full text-white shadow-xl shadow-black/15 transition duration-200 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-primary)_42%,transparent)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)] sm:h-12 sm:w-12",
                            item.className,
                        ].join(" ")}
                    >
                        <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 blur-md transition group-hover:scale-125 group-hover:opacity-25" />

                        <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-black text-[var(--color-text)] opacity-0 shadow-soft transition group-hover:translate-x-[-2px] group-hover:opacity-100 sm:block">
                            {item.label}
                        </span>

                        <Icon className="relative z-10 text-xl sm:text-2xl" />
                    </a>
                );
            })}
        </div>
    );
}
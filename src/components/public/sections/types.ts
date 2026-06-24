export type HomeCmsSection = {
    id: number | string;
    key: string;
    title?: string | null;
    subtitle?: string | null;
    body?: string | null;
    imageUrl?: string | null;
    ctaText?: string | null;
    ctaUrl?: string | null;
};

export type HomeSettings = {
    heroTitle?: string | null;
    heroSubtitle?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    aboutText?: string | null;
    whatsApp?: string | null;
};
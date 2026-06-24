import { Plus } from "lucide-react";

import type { ResourceConfig } from "./types";

type ResourcePageHeaderProps = {
    config: ResourceConfig;
    onCreate: () => void;
};

export function ResourcePageHeader({
    config,
    onCreate,
}: ResourcePageHeaderProps) {
    return (
        <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_88%,transparent)] p-5 shadow-[var(--shadow-soft)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
                <p className="mb-2 text-xs font-black uppercase tracking-wide text-[var(--color-primary-dark)] dark:text-[var(--color-gold)]">
                    KING CLEAN ADMIN
                </p>

                <h1 className="m-0 font-display text-2xl font-black leading-tight text-[var(--color-text)] sm:text-3xl">
                    {config.title}
                </h1>

                <p className="mt-2 max-w-2xl text-sm font-bold leading-7 text-[var(--color-muted)]">
                    {config.description}
                </p>
            </div>

            <button
                className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] px-5 text-sm font-black text-[var(--color-navy)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--color-gold-dark)] hover:text-white focus:outline-none focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-primary)_20%,transparent)]"
                onClick={onCreate}
                type="button"
            >
                <Plus size={18} />
                إضافة {config.singular}
            </button>
        </div>
    );
}
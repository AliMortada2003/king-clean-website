import { useState } from "react";
import { toast } from "sonner";

import {
    useAdminSection,
    useAdminSections,
    useDeleteAdminSection,
    useUpdateAdminSection,
} from "../../../../api/hooks";
import type {
    SiteSectionDto,
    UpsertSiteSectionDto,
} from "../../../../types/api";

function toSectionUpdateBody(item: SiteSectionDto): UpsertSiteSectionDto {
    return {
        key: item.key,
        page: item.page,
        title: item.title,
        subtitle: item.subtitle || null,
        body: item.body || null,
        imageUrl: item.imageUrl || null,
        videoUrl: item.videoUrl || null,
        ctaText: item.ctaText || null,
        ctaUrl: item.ctaUrl || null,
        payloadJson: item.payloadJson || null,
        isActive: item.isActive,
        displayOrder: item.displayOrder,
    };
}

export function useSectionsPage() {
    const query = useAdminSections();
    const update = useUpdateAdminSection();
    const removeMutation = useDeleteAdminSection();

    const [creating, setCreating] = useState(false);
    const [editingId, setEditingId] = useState<number | undefined>();
    const [deleting, setDeleting] = useState<SiteSectionDto | null>(null);

    const itemQuery = useAdminSection(editingId);

    const items = query.data || [];

    const openCreate = () => setCreating(true);
    const openEdit = (id: number) => setEditingId(id);
    const openDelete = (item: SiteSectionDto) => setDeleting(item);

    const closeForm = () => {
        setCreating(false);
        setEditingId(undefined);
    };

    const closeDelete = () => setDeleting(null);
    const refresh = () => void query.refetch();

    const remove = async () => {
        if (!deleting) return;

        try {
            await removeMutation.mutateAsync(deleting.id);
            toast.success("تم الحذف بنجاح.");
            setDeleting(null);
            refresh();
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "تعذر حذف العنصر.",
            );
        }
    };

    const toggleActive = async (item: SiteSectionDto) => {
        const nextActive = !item.isActive;

        try {
            await update.mutateAsync({
                id: item.id,
                body: { ...toSectionUpdateBody(item), isActive: nextActive },
            });
            toast.success(nextActive ? "تم التفعيل بنجاح." : "تم التعطيل بنجاح.");
            refresh();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : nextActive
                        ? "تعذر تفعيل العنصر."
                        : "تعذر تعطيل العنصر.",
            );
        }
    };

    return {
        query,
        mutations: {
            remove: removeMutation,
            update,
        },
        itemQuery,
        items,
        creating,
        editingId,
        deleting,
        openCreate,
        openEdit,
        openDelete,
        closeForm,
        closeDelete,
        refresh,
        remove,
        toggleActive,
    };
}

export type SectionsPageState = ReturnType<typeof useSectionsPage>;

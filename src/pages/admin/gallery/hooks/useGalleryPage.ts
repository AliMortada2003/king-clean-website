import { useState } from "react";
import { toast } from "sonner";

import {
    useAdminGallery,
    useAdminGalleryItem,
    useDeleteAdminGalleryItem,
    useUpdateAdminGalleryItem,
} from "../../../../api/hooks";
import type {
    AdminGalleryItemDto,
    UpsertGalleryItemDto,
} from "../../../../types/api";

function toGalleryUpdateBody(item: AdminGalleryItemDto): UpsertGalleryItemDto {
    return {
        title: item.title,
        description: item.description,
        imageUrl: item.imageUrl,
        serviceId: item.serviceId,
        areaId: item.areaId ?? null,
        isFeatured: item.isFeatured,
        isActive: item.isActive,
        displayOrder: item.displayOrder,
    };
}

export function useGalleryPage() {
    const query = useAdminGallery();
    const update = useUpdateAdminGalleryItem();
    const removeMutation = useDeleteAdminGalleryItem();

    const [creating, setCreating] = useState(false);
    const [editingId, setEditingId] = useState<number | undefined>();
    const [deleting, setDeleting] = useState<AdminGalleryItemDto | null>(null);

    const itemQuery = useAdminGalleryItem(editingId);

    const items = query.data || [];

    const openCreate = () => setCreating(true);
    const openEdit = (id: number) => setEditingId(id);
    const openDelete = (item: AdminGalleryItemDto) => setDeleting(item);

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

    const toggleActive = async (item: AdminGalleryItemDto) => {
        const nextActive = !item.isActive;

        try {
            await update.mutateAsync({
                id: item.id,
                body: { ...toGalleryUpdateBody(item), isActive: nextActive },
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

export type GalleryPageState = ReturnType<typeof useGalleryPage>;

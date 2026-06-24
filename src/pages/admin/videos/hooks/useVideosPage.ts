import { useState } from "react";
import { toast } from "sonner";

import {
    useAdminVideo,
    useAdminVideos,
    useDeleteAdminVideo,
    useUpdateAdminVideo,
} from "../../../../api/hooks";
import type {
    AdminVideoItemDto,
    UpsertVideoItemDto,
} from "../../../../types/api";

function toVideoUpdateBody(item: AdminVideoItemDto): UpsertVideoItemDto {
    return {
        title: item.title,
        description: item.description,
        videoUrl: item.videoUrl,
        thumbnailUrl: item.thumbnailUrl || null,
        serviceId: item.serviceId,
        areaId: item.areaId ?? null,
        isFeatured: item.isFeatured,
        isActive: item.isActive,
        displayOrder: item.displayOrder,
    };
}

export function useVideosPage() {
    const query = useAdminVideos();
    const update = useUpdateAdminVideo();
    const removeMutation = useDeleteAdminVideo();

    const [creating, setCreating] = useState(false);
    const [editingId, setEditingId] = useState<number | undefined>();
    const [deleting, setDeleting] = useState<AdminVideoItemDto | null>(null);

    const itemQuery = useAdminVideo(editingId);

    const items = query.data || [];

    const openCreate = () => setCreating(true);
    const openEdit = (id: number) => setEditingId(id);
    const openDelete = (item: AdminVideoItemDto) => setDeleting(item);

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

    const toggleActive = async (item: AdminVideoItemDto) => {
        const nextActive = !item.isActive;

        try {
            await update.mutateAsync({
                id: item.id,
                body: { ...toVideoUpdateBody(item), isActive: nextActive },
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

export type VideosPageState = ReturnType<typeof useVideosPage>;

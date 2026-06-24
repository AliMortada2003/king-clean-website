import { useState } from "react";
import { toast } from "sonner";

import {
    useAdminReview,
    useAdminReviews,
    useDeleteAdminReview,
    useUpdateAdminReview,
} from "../../../../api/hooks";
import type { AdminReviewDto, UpsertReviewDto } from "../../../../types/api";

function toReviewUpdateBody(item: AdminReviewDto): UpsertReviewDto {
    return {
        customerName: item.customerName,
        rating: item.rating,
        comment: item.comment,
        isActive: item.isActive,
        displayOrder: item.displayOrder,
    };
}

export function useReviewsPage() {
    const query = useAdminReviews();
    const update = useUpdateAdminReview();
    const removeMutation = useDeleteAdminReview();

    const [creating, setCreating] = useState(false);
    const [editingId, setEditingId] = useState<number | undefined>();
    const [deleting, setDeleting] = useState<AdminReviewDto | null>(null);

    const itemQuery = useAdminReview(editingId);

    const items = query.data || [];

    const openCreate = () => setCreating(true);
    const openEdit = (id: number) => setEditingId(id);
    const openDelete = (item: AdminReviewDto) => setDeleting(item);

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

    const toggleActive = async (item: AdminReviewDto) => {
        const nextActive = !item.isActive;

        try {
            await update.mutateAsync({
                id: item.id,
                body: { ...toReviewUpdateBody(item), isActive: nextActive },
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

export type ReviewsPageState = ReturnType<typeof useReviewsPage>;

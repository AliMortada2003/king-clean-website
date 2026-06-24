import { useState } from "react";
import { toast } from "sonner";

import {
  useAdminArea,
  useAdminAreas,
  useDeleteAdminArea,
  useUpdateAdminArea,
} from "../../../../api/hooks";
import type { AdminAreaDto, UpsertAreaDto } from "../../../../types/api";

function toAreaUpdateBody(item: AdminAreaDto): UpsertAreaDto {
  return {
    name: item.name,
    slug: item.slug,
    description: item.description,
    isActive: item.isActive,
    displayOrder: item.displayOrder,
    metaTitle: item.metaTitle,
    metaDescription: item.metaDescription,
    serviceIds: item.services?.map((service) => service.id) || [],
  };
}

export function useAreasPage() {
  const query = useAdminAreas();
  const update = useUpdateAdminArea();
  const removeMutation = useDeleteAdminArea();

  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | undefined>();
  const [deleting, setDeleting] = useState<AdminAreaDto | null>(null);

  const itemQuery = useAdminArea(editingId);
  const items = query.data || [];

  const openCreate = () => setCreating(true);
  const openEdit = (id: number) => setEditingId(id);
  const openDelete = (item: AdminAreaDto) => setDeleting(item);

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

  const toggleActive = async (item: AdminAreaDto) => {
    const nextActive = !item.isActive;

    try {
      await update.mutateAsync({
        id: item.id,
        body: { ...toAreaUpdateBody(item), isActive: nextActive },
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

export type AreasPageState = ReturnType<typeof useAreasPage>;

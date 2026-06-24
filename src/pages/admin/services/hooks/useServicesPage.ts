import { useState } from "react";
import { toast } from "sonner";

import {
  useAdminService,
  useAdminServices,
  useDeleteAdminService,
  useUpdateAdminService,
} from "../../../../api/hooks";
import type { AdminServiceDto, UpsertServiceDto } from "../../../../types/api";

function toServiceUpdateBody(item: AdminServiceDto): UpsertServiceDto {
  return {
    name: item.name,
    slug: item.slug,
    shortDescription: item.shortDescription,
    description: item.description,
    imageUrl: item.imageUrl || null,
    icon: item.icon || null,
    isActive: item.isActive,
    displayOrder: item.displayOrder,
    metaTitle: item.metaTitle,
    metaDescription: item.metaDescription,
    areaIds: item.areas?.map((area) => area.id) || [],
  };
}

export function useServicesPage() {
  const query = useAdminServices();
  const update = useUpdateAdminService();
  const removeMutation = useDeleteAdminService();

  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | undefined>();
  const [deleting, setDeleting] = useState<AdminServiceDto | null>(null);

  const itemQuery = useAdminService(editingId);
  const items = query.data || [];

  const openCreate = () => setCreating(true);
  const openEdit = (id: number) => setEditingId(id);
  const openDelete = (item: AdminServiceDto) => setDeleting(item);

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

  const toggleActive = async (item: AdminServiceDto) => {
    const nextActive = !item.isActive;

    try {
      await update.mutateAsync({
        id: item.id,
        body: { ...toServiceUpdateBody(item), isActive: nextActive },
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

export type ServicesPageState = ReturnType<typeof useServicesPage>;

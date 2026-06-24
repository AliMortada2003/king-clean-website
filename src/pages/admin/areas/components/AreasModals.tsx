import {
  ConfirmDialog,
  ErrorState,
  Modal,
  PageLoading,
} from "../../../../components/ui";
import type { AreasPageState } from "../hooks/useAreasPage";
import { AreaForm } from "./AreaForm";

type AreasModalsProps = {
  page: AreasPageState;
};

export function AreasModals({ page }: AreasModalsProps) {
  const deletingTitle = page.deleting?.name || `#${page.deleting?.id}`;

  return (
    <>
      {page.creating && (
        <Modal title="إضافة منطقة" onClose={page.closeForm}>
          <AreaForm onSaved={page.refresh} onClose={page.closeForm} />
        </Modal>
      )}

      {page.editingId && (
        <Modal title="تعديل منطقة" onClose={page.closeForm}>
          {page.itemQuery.isLoading ? (
            <PageLoading />
          ) : page.itemQuery.isError ? (
            <ErrorState
              error={page.itemQuery.error}
              retry={() => void page.itemQuery.refetch()}
            />
          ) : page.itemQuery.data ? (
            <AreaForm
              item={page.itemQuery.data}
              onSaved={page.refresh}
              onClose={page.closeForm}
            />
          ) : null}
        </Modal>
      )}

      {page.deleting && (
        <ConfirmDialog
          title="حذف المنطقة"
          message={`سيتم حذف “${deletingTitle}” أو إخفاؤها من الموقع حسب تنفيذ الخادم.`}
          confirmLabel="حذف"
          busy={page.mutations.remove.isPending}
          onConfirm={() => void page.remove()}
          onClose={page.closeDelete}
        />
      )}
    </>
  );
}

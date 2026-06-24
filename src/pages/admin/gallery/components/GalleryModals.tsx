import {
    ConfirmDialog,
    ErrorState,
    Modal,
    PageLoading,
} from "../../../../components/ui";
import { GalleryPageState } from "../hooks/useGalleryPage";
import { GalleryForm } from "./GalleryForm";

type GalleryModalsProps = {
    page: GalleryPageState;
};

export function GalleryModals({ page }: GalleryModalsProps) {
    const deletingTitle = page.deleting?.title || `#${page.deleting?.id}`;

    return (
        <>
            {page.creating && (
                <Modal title="إضافة صورة" onClose={page.closeForm}>
                    <GalleryForm onSaved={page.refresh} onClose={page.closeForm} />
                </Modal>
            )}

            {page.editingId && (
                <Modal title="تعديل صورة" onClose={page.closeForm}>
                    {page.itemQuery.isLoading ? (
                        <PageLoading />
                    ) : page.itemQuery.isError ? (
                        <ErrorState
                            error={page.itemQuery.error}
                            retry={() => void page.itemQuery.refetch()}
                        />
                    ) : page.itemQuery.data ? (
                        <GalleryForm
                            item={page.itemQuery.data}
                            onSaved={page.refresh}
                            onClose={page.closeForm}
                        />
                    ) : null}
                </Modal>
            )}

            {page.deleting && (
                <ConfirmDialog
                    title="حذف الصورة"
                    message={`سيتم حذف “${deletingTitle}” من معرض الأعمال مع الاحتفاظ بالسجل الإداري إن كان الحذف ناعمًا من الخادم.`}
                    confirmLabel="حذف"
                    busy={page.mutations.remove.isPending}
                    onConfirm={() => void page.remove()}
                    onClose={page.closeDelete}
                />
            )}
        </>
    );
}
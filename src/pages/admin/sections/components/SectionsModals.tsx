import {
    ConfirmDialog,
    ErrorState,
    Modal,
    PageLoading,
} from "../../../../components/ui";
import type { SectionsPageState } from "../hooks/useSectionsPage";
import { SectionForm } from "./SectionForm";

type SectionsModalsProps = {
    page: SectionsPageState;
};

export function SectionsModals({ page }: SectionsModalsProps) {
    const deletingTitle = page.deleting?.title || page.deleting?.key || `#${page.deleting?.id}`;

    return (
        <>
            {page.creating && (
                <Modal title="إضافة قسم محتوى" onClose={page.closeForm}>
                    <SectionForm onSaved={page.refresh} onClose={page.closeForm} />
                </Modal>
            )}

            {page.editingId && (
                <Modal title="تعديل قسم محتوى" onClose={page.closeForm}>
                    {page.itemQuery.isLoading ? (
                        <PageLoading />
                    ) : page.itemQuery.isError ? (
                        <ErrorState
                            error={page.itemQuery.error}
                            retry={() => void page.itemQuery.refetch()}
                        />
                    ) : page.itemQuery.data ? (
                        <SectionForm
                            item={page.itemQuery.data}
                            onSaved={page.refresh}
                            onClose={page.closeForm}
                        />
                    ) : null}
                </Modal>
            )}

            {page.deleting && (
                <ConfirmDialog
                    title="حذف القسم"
                    message={`سيتم حذف “${deletingTitle}” من أقسام المحتوى. تأكد أنه غير مستخدم في الصفحة العامة قبل الحذف.`}
                    confirmLabel="حذف"
                    busy={page.mutations.remove.isPending}
                    onConfirm={() => void page.remove()}
                    onClose={page.closeDelete}
                />
            )}
        </>
    );
}
import {
    ConfirmDialog,
    ErrorState,
    Modal,
    PageLoading,
} from "../../../../components/ui";
import { ServicesPageState } from "../hooks/useServicesPage";
import { ServiceForm } from "./ServiceForm";

type ServicesModalsProps = {
    page: ServicesPageState;
};

export function ServicesModals({ page }: ServicesModalsProps) {
    const deletingTitle = page.deleting?.name || `#${page.deleting?.id}`;

    return (
        <>
            {page.creating && (
                <Modal title="إضافة خدمة" onClose={page.closeForm}>
                    <ServiceForm onSaved={page.refresh} onClose={page.closeForm} />
                </Modal>
            )}

            {page.editingId && (
                <Modal title="تعديل خدمة" onClose={page.closeForm}>
                    {page.itemQuery.isLoading ? (
                        <PageLoading />
                    ) : page.itemQuery.isError ? (
                        <ErrorState
                            error={page.itemQuery.error}
                            retry={() => void page.itemQuery.refetch()}
                        />
                    ) : page.itemQuery.data ? (
                        <ServiceForm
                            item={page.itemQuery.data}
                            onSaved={page.refresh}
                            onClose={page.closeForm}
                        />
                    ) : null}
                </Modal>
            )}

            {page.deleting && (
                <ConfirmDialog
                    title="حذف الخدمة"
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

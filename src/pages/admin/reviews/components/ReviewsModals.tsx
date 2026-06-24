import {
    ConfirmDialog,
    ErrorState,
    Modal,
    PageLoading,
} from "../../../../components/ui";
import { ReviewsPageState } from "../hooks/useReviewsPage";
import { ReviewForm } from "./ReviewForm";


type ReviewsModalsProps = {
    page: ReviewsPageState;
};

export function ReviewsModals({ page }: ReviewsModalsProps) {
    const deletingTitle = page.deleting?.customerName || `#${page.deleting?.id}`;

    return (
        <>
            {page.creating && (
                <Modal title="إضافة رأي عميل" onClose={page.closeForm}>
                    <ReviewForm onSaved={page.refresh} onClose={page.closeForm} />
                </Modal>
            )}

            {page.editingId && (
                <Modal title="تعديل رأي عميل" onClose={page.closeForm}>
                    {page.itemQuery.isLoading ? (
                        <PageLoading />
                    ) : page.itemQuery.isError ? (
                        <ErrorState
                            error={page.itemQuery.error}
                            retry={() => void page.itemQuery.refetch()}
                        />
                    ) : page.itemQuery.data ? (
                        <ReviewForm
                            item={page.itemQuery.data}
                            onSaved={page.refresh}
                            onClose={page.closeForm}
                        />
                    ) : null}
                </Modal>
            )}

            {page.deleting && (
                <ConfirmDialog
                    title="حذف الرأي"
                    message={`سيتم حذف رأي “${deletingTitle}” من آراء العملاء.`}
                    confirmLabel="حذف"
                    busy={page.mutations.remove.isPending}
                    onConfirm={() => void page.remove()}
                    onClose={page.closeDelete}
                />
            )}
        </>
    );
}
import {
    ConfirmDialog,
    ErrorState,
    Modal,
    PageLoading,
} from "../../../../components/ui";
import type { VideosPageState } from "../hooks/useVideosPage";
import { VideoForm } from "./VideoForm";

type VideosModalsProps = {
    page: VideosPageState;
};

export function VideosModals({ page }: VideosModalsProps) {
    const deletingTitle = page.deleting?.title || `#${page.deleting?.id}`;

    return (
        <>
            {page.creating && (
                <Modal title="إضافة فيديو" onClose={page.closeForm}>
                    <VideoForm onSaved={page.refresh} onClose={page.closeForm} />
                </Modal>
            )}

            {page.editingId && (
                <Modal title="تعديل فيديو" onClose={page.closeForm}>
                    {page.itemQuery.isLoading ? (
                        <PageLoading />
                    ) : page.itemQuery.isError ? (
                        <ErrorState
                            error={page.itemQuery.error}
                            retry={() => void page.itemQuery.refetch()}
                        />
                    ) : page.itemQuery.data ? (
                        <VideoForm
                            item={page.itemQuery.data}
                            onSaved={page.refresh}
                            onClose={page.closeForm}
                        />
                    ) : null}
                </Modal>
            )}

            {page.deleting && (
                <ConfirmDialog
                    title="حذف الفيديو"
                    message={`سيتم حذف “${deletingTitle}” من الفيديوهات مع الاحتفاظ بالسجل الإداري إن كان الحذف ناعمًا من الخادم.`}
                    confirmLabel="حذف"
                    busy={page.mutations.remove.isPending}
                    onConfirm={() => void page.remove()}
                    onClose={page.closeDelete}
                />
            )}
        </>
    );
}

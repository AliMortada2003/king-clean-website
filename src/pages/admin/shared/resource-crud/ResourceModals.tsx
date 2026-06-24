import type { AdminResourceName } from "../../../../types/api";
import {
    ConfirmDialog,
    ErrorState,
    Modal,
    PageLoading,
} from "../../../../components/ui";
import { resourceConfigs } from "./constants";
import { getResourceItemTitle } from "./helpers";
import { ResourceForm } from "./ResourceForm";

type ResourceModalsProps = {
    resource: AdminResourceName;
    creating: boolean;
    editingId?: number;
    deleting?: any;
    editItem?: any;
    itemLoading: boolean;
    itemError: boolean;
    itemErrorValue: unknown;
    removeBusy: boolean;
    onSaved: () => void;
    onCloseForm: () => void;
    onCloseDelete: () => void;
    onConfirmDelete: () => void;
    onRetryItem: () => void;
};

export function ResourceModals({
    resource,
    creating,
    editingId,
    deleting,
    editItem,
    itemLoading,
    itemError,
    itemErrorValue,
    removeBusy,
    onSaved,
    onCloseForm,
    onCloseDelete,
    onConfirmDelete,
    onRetryItem,
}: ResourceModalsProps) {
    const config = resourceConfigs[resource];

    return (
        <>
            {creating && (
                <Modal title={`إضافة ${config.singular}`} onClose={onCloseForm}>
                    <ResourceForm
                        resource={resource}
                        onSaved={onSaved}
                        onClose={onCloseForm}
                    />
                </Modal>
            )}

            {editingId && (
                <Modal title={`تعديل ${config.singular}`} onClose={onCloseForm}>
                    {itemLoading ? (
                        <PageLoading />
                    ) : itemError ? (
                        <ErrorState error={itemErrorValue} retry={onRetryItem} />
                    ) : editItem ? (
                        <ResourceForm
                            resource={resource}
                            item={editItem}
                            onSaved={onSaved}
                            onClose={onCloseForm}
                        />
                    ) : null}
                </Modal>
            )}

            {deleting && (
                <ConfirmDialog
                    title={`تعطيل ${config.singular}`}
                    message={`سيتم إخفاء “${getResourceItemTitle(
                        resource,
                        deleting,
                    )}” من الموقع العام مع الاحتفاظ بالسجل الإداري.`}
                    confirmLabel="تعطيل"
                    busy={removeBusy}
                    onConfirm={onConfirmDelete}
                    onClose={onCloseDelete}
                />
            )}
        </>
    );
}

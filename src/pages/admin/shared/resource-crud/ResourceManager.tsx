import { useState } from "react";
import { toast } from "sonner";

import {
    useAdminResource,
    useAdminResourceItem,
    useAdminResourceMutations,
} from "../../../../api/hooks";
import { Seo } from "../../../../components/Seo";
import { EmptyState, ErrorState, PageLoading } from "../../../../components/ui";
import type { AdminResourceDto } from "../../../../types/api";
import { resourceConfigs } from "./constants";
import { ResourceGrid } from "./ResourceGrid";
import { ResourceModals } from "./ResourceModals";
import { ResourcePageHeader } from "./ResourcePageHeader";
import type { ResourcePageProps } from "./types";

export function ResourceManager({ resource }: ResourcePageProps) {
    const config = resourceConfigs[resource];

    const query = useAdminResource(resource);
    const [editingId, setEditingId] = useState<number | undefined>();
    const [creating, setCreating] = useState(false);
    const [deleting, setDeleting] = useState<AdminResourceDto | undefined>();

    const itemQuery = useAdminResourceItem(resource, editingId);
    const mutations = useAdminResourceMutations(resource);

    const items = query.data as AdminResourceDto[] | undefined;
    const editItem = itemQuery.data;

    const closeForm = () => {
        setCreating(false);
        setEditingId(undefined);
    };

    const remove = async () => {
        if (!deleting) return;

        try {
            await mutations.remove.mutateAsync(deleting.id);
            toast.success(`تم تعطيل ${config.singular}.`);
            setDeleting(undefined);
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "تعذر تنفيذ العملية.",
            );
        }
    };

    return (
        <>
            <Seo
                title={`${config.title} | KING CLEAN`}
                description={config.description}
                noIndex
            />

            <ResourcePageHeader config={config} onCreate={() => setCreating(true)} />

            {query.isLoading ? (
                <PageLoading />
            ) : query.isError ? (
                <ErrorState error={query.error} retry={() => void query.refetch()} />
            ) : items?.length ? (
                <ResourceGrid
                    resource={resource}
                    items={items}
                    onEdit={setEditingId}
                    onDelete={setDeleting}
                />
            ) : (
                <EmptyState
                    title={`لا توجد ${config.title}`}
                    description={`أضف أول ${config.singular} للبدء.`}
                />
            )}

            <ResourceModals
                resource={resource}
                creating={creating}
                editingId={editingId}
                deleting={deleting}
                editItem={editItem}
                itemLoading={itemQuery.isLoading}
                itemError={itemQuery.isError}
                itemErrorValue={itemQuery.error}
                removeBusy={mutations.remove.isPending}
                onSaved={() => void query.refetch()}
                onCloseForm={closeForm}
                onCloseDelete={() => setDeleting(undefined)}
                onConfirmDelete={() => void remove()}
                onRetryItem={() => void itemQuery.refetch()}
            />
        </>
    );
}
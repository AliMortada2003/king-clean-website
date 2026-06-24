import type { AdminResourceDto, AdminResourceName } from "../../../../types/api";
import { ResourceCard } from "./ResourceCard";

type ResourceGridProps = {
    resource: AdminResourceName;
    items: AdminResourceDto[];
    onEdit: (id: number) => void;
    onDelete: (item: AdminResourceDto) => void;
};

export function ResourceGrid({
    resource,
    items,
    onEdit,
    onDelete,
}: ResourceGridProps) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {items.map((item) => (
                <ResourceCard
                    key={item.id}
                    resource={resource}
                    item={item}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
import type { AdminResourceName, LookupDto } from "../../../../types/api";
import { resourceConfigs } from "./constants";

export function toFormValues(resource: AdminResourceName, item?: any) {
    if (!item) return resourceConfigs[resource].defaults;

    const values = { ...item };

    if (resource === "services") {
        values.areaIds = item.areas?.map((area: LookupDto) => area.id) || [];
    }

    if (resource === "areas") {
        values.serviceIds =
            item.services?.map((service: LookupDto) => service.id) || [];
    }

    return values;
}

export function getResourceItemTitle(resource: AdminResourceName, item: any) {
    if (resource === "reviews") return item.customerName;

    return item.name || item.title || item.key || `#${item.id}`;
}

export function getResourceItemDescription(
    resource: AdminResourceName,
    item: any,
) {
    if (resource === "reviews") return item.comment;
    if (resource === "sections") return `${item.page} · ${item.key}`;

    return item.shortDescription || item.description || "";
}

export function getResourceItemImage(item: any) {
    return item.imageUrl || item.thumbnailUrl || "";
}

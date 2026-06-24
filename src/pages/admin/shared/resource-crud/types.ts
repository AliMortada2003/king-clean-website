import type { AdminResourceName } from "../../../../types/api";

export type FieldType =
    | "text"
    | "textarea"
    | "number"
    | "url"
    | "checkbox"
    | "select-service"
    | "select-area"
    | "multi-services"
    | "multi-areas"
    | "rating"
    | "json"
    | "upload-image"
    | "upload-video";

export interface FieldConfig {
    name: string;
    label: string;
    type: FieldType;
    span?: boolean;
    required?: boolean;
    maxLength?: number;
}

export interface ResourceConfig {
    title: string;
    singular: string;
    description: string;
    fields: FieldConfig[];
    defaults: Record<string, unknown>;
}

export type ResourcePageProps = {
    resource: AdminResourceName;
};

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { AdminResourceName } from "../../../../types/api";
import {
    useAdminResource,
    useAdminResourceMutations,
} from "../../../../api/hooks";
import { resourceSchemas } from "../../../../lib/validation";
import { resourceConfigs } from "./constants";
import { toFormValues } from "./helpers";
import { ResourceField } from "./ResourceField";

type ResourceFormProps = {
    resource: AdminResourceName;
    item?: any;
    onSaved: () => void;
    onClose: () => void;
};

export function ResourceForm({
    resource,
    item,
    onSaved,
    onClose,
}: ResourceFormProps) {
    const config = resourceConfigs[resource];

    const services = useAdminResource("services");
    const areas = useAdminResource("areas");
    const mutations = useAdminResourceMutations(resource);

    const {
        register,
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<any>({
        resolver: zodResolver(resourceSchemas[resource] as any) as any,
        defaultValues: toFormValues(resource, item),
    });

    useEffect(() => {
        reset(toFormValues(resource, item));
    }, [resource, item, reset]);

    const serviceId = Number(watch("serviceId"));

    const linkedAreaIds = services.data
        ?.find((service) => service.id === serviceId)
        ?.areas.map((area) => area.id);

    const areaOptions = linkedAreaIds
        ? areas.data?.filter((area) => linkedAreaIds.includes(area.id))
        : areas.data;

    const submit = handleSubmit(async (values) => {
        const normalized: Record<string, any> = { ...values };

        if ("areaId" in normalized && !normalized.areaId) {
            normalized.areaId = null;
        }

        try {
            if (item) {
                await mutations.update.mutateAsync({
                    id: item.id,
                    body: normalized,
                });
            } else {
                await mutations.create.mutateAsync(normalized);
            }

            toast.success(
                item ? `تم تحديث ${config.singular}.` : `تم إنشاء ${config.singular}.`,
            );

            onSaved();
            onClose();
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "تعذر حفظ البيانات.",
            );
        }
    });

    const isSaving = mutations.create.isPending || mutations.update.isPending;
    return (
        <form onSubmit={submit} noValidate className="space-y-7">
            <div className="grid gap-5 md:grid-cols-2">
                {config.fields.map((field) => (
                    <ResourceField
                        key={field.name}
                        resource={resource}
                        field={field}
                        register={register}
                        control={control}
                        errors={errors}
                        services={services.data}
                        areas={areas.data}
                        areaOptions={areaOptions}
                    />
                ))}
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-[var(--color-border)] pt-5 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 text-sm font-black text-[var(--color-text)] transition hover:bg-[var(--color-surface-soft)] focus:outline-none focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-primary)_14%,transparent)] disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={onClose}
                    disabled={isSaving}
                >
                    إلغاء
                </button>

                <button
                    className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[var(--color-primary)] px-5 text-sm font-black text-[var(--color-navy)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--color-gold-dark)] hover:text-white focus:outline-none focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-primary)_18%,transparent)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
                    disabled={isSaving}
                    type="submit"
                >
                    {isSaving ? "جارٍ الحفظ..." : "حفظ"}
                </button>
            </div>
        </form>
    );
}

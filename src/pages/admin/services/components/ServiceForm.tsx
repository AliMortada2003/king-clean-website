import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
    useAdminAreas,
    useCreateAdminService,
    useUpdateAdminService,
} from "../../../../api/hooks";
import type {
    AdminServiceDto,
    UpsertServiceDto,
} from "../../../../types/api";
import { MediaUrlField } from "../../shared/resource-crud/MediaUrlField";

type ServiceFormProps = {
    item?: AdminServiceDto;
    onSaved: () => void;
    onClose: () => void;
};

type ServiceFormValues = {
    name: string;
    slug: string;
    shortDescription: string;
    description: string;
    imageUrl: string;
    icon: string;
    isActive: boolean;
    displayOrder: number;
    metaTitle: string;
    metaDescription: string;
    areaIds: number[];
};

const serviceFormSchema = z.object({
    name: z.string().min(2, "اسم الخدمة مطلوب.").max(200),
    slug: z.string().min(2, "رابط الخدمة مطلوب.").max(200),
    shortDescription: z.string().min(2, "الوصف المختصر مطلوب.").max(500),
    description: z.string().min(2, "وصف الخدمة مطلوب.").max(5000),
    imageUrl: z.string(),
    icon: z.string().max(120),
    isActive: z.boolean(),
    displayOrder: z.number().min(0),
    metaTitle: z.string().max(250),
    metaDescription: z.string().max(500),
    areaIds: z.array(z.number()),
});

const inputClass =
    "min-h-12 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-bold text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-muted)]/70 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-primary)_16%,transparent)] disabled:cursor-not-allowed disabled:opacity-60";

const textareaClass = `${inputClass} min-h-32 resize-y leading-7`;

const labelClass = "mb-2 block text-sm font-black text-[var(--color-text)]";
const hintClass = "mt-2 block text-xs font-bold text-[var(--color-muted)]";
const errorClass = "mt-2 block text-xs font-bold text-[var(--color-danger)]";

const checkboxClass =
    "flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-bold text-[var(--color-text)] transition hover:bg-[var(--color-surface-soft)]";

const cancelButtonClass =
    "inline-flex min-h-11 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 text-sm font-black text-[var(--color-text)] transition hover:bg-[var(--color-surface-soft)] focus:outline-none focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-primary)_14%,transparent)] disabled:cursor-not-allowed disabled:opacity-60";

const submitButtonClass =
    "inline-flex min-h-11 items-center justify-center rounded-2xl bg-[var(--color-primary)] px-5 text-sm font-black text-[var(--color-navy)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--color-gold-dark)] hover:text-white focus:outline-none focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-primary)_18%,transparent)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60";

const secondaryButtonClass =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 text-sm font-black text-[var(--color-text)] transition hover:bg-[var(--color-surface-soft)] focus:outline-none focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-primary)_14%,transparent)] disabled:cursor-not-allowed disabled:opacity-60";

const dangerSmallButtonClass =
    "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--color-danger)_20%,transparent)] bg-[color-mix(in_srgb,var(--color-danger)_8%,transparent)] text-[var(--color-danger)] transition hover:bg-[var(--color-danger)] hover:text-white";

function toSlug(value: string) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^\u0600-\u06FFa-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

function getServiceDefaultValues(item?: AdminServiceDto): ServiceFormValues {
    return {
        name: item?.name || "",
        slug: item?.slug || "",
        shortDescription: item?.shortDescription || "",
        description: item?.description || "",
        imageUrl: item?.imageUrl || "",
        icon: item?.icon || "",
        isActive: item?.isActive ?? true,
        displayOrder: item?.displayOrder ?? 0,
        metaTitle: item?.metaTitle || "",
        metaDescription: item?.metaDescription || "",
        areaIds: item?.areas?.map((area) => area.id) || [],
    };
}

export function ServiceForm({ item, onSaved, onClose }: ServiceFormProps) {
    const areas = useAdminAreas();
    const createService = useCreateAdminService();
    const updateService = useUpdateAdminService();
    const [newAreaId, setNewAreaId] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<ServiceFormValues>({
        resolver: zodResolver(serviceFormSchema),
        defaultValues: getServiceDefaultValues(item),
    });

    useEffect(() => {
        reset(getServiceDefaultValues(item));
        setNewAreaId("");
    }, [item, reset]);

    const areaIds = watch("areaIds") || [];

    const selectedAreas =
        areas.data?.filter((area) => areaIds.includes(area.id)) || [];

    const availableAreas =
        areas.data?.filter((area) => !areaIds.includes(area.id)) || [];

    const addArea = () => {
        const id = Number(newAreaId);

        if (!id) {
            toast.error("اختر منطقة أولًا.");
            return;
        }

        setValue("areaIds", [...areaIds, id], {
            shouldDirty: true,
            shouldValidate: true,
        });

        setNewAreaId("");
    };

    const removeArea = (id: number) => {
        setValue(
            "areaIds",
            areaIds.filter((areaId) => areaId !== id),
            {
                shouldDirty: true,
                shouldValidate: true,
            },
        );
    };

    const isSaving = createService.isPending || updateService.isPending;

    const submit = handleSubmit(async (values) => {
        const body: UpsertServiceDto = {
            name: values.name,
            slug: values.slug || toSlug(values.name),
            shortDescription: values.shortDescription,
            description: values.description,
            imageUrl: values.imageUrl || null,
            icon: values.icon || null,
            isActive: Boolean(values.isActive),
            displayOrder: Number(values.displayOrder || 0),
            metaTitle: values.metaTitle || values.name,
            metaDescription: values.metaDescription || values.shortDescription,
            areaIds: values.areaIds || [],
        };

        try {
            if (item) {
                await updateService.mutateAsync({
                    id: item.id,
                    body,
                });
            } else {
                await createService.mutateAsync(body);
            }

            toast.success(item ? "تم التحديث بنجاح." : "تمت الإضافة بنجاح.");
            onSaved();
            onClose();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : item
                        ? "تعذر تحديث العنصر."
                        : "تعذر إضافة العنصر.",
            );
        }
    });

    return (
        <form onSubmit={submit} noValidate className="space-y-7">
            <div className="grid gap-5 md:grid-cols-2">
                <div>
                    <label className={labelClass} htmlFor="name">
                        اسم الخدمة *
                    </label>

                    <input
                        id="name"
                        className={inputClass}
                        {...register("name", {
                            onChange: (event) => {
                                if (!item) {
                                    setValue("slug", toSlug(event.target.value), {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                    });
                                }
                            },
                        })}
                    />

                    {errors.name && (
                        <span className={errorClass}>{errors.name.message}</span>
                    )}
                </div>

                <div>
                    <label className={labelClass} htmlFor="slug">
                        رابط الخدمة *
                    </label>

                    <input
                        id="slug"
                        className={inputClass}
                        dir="ltr"
                        placeholder="home-cleaning"
                        {...register("slug")}
                    />

                    <span className={hintClass}>مثال: sofa-cleaning</span>

                    {errors.slug && (
                        <span className={errorClass}>{errors.slug.message}</span>
                    )}
                </div>

                <div>
                    <label className={labelClass} htmlFor="displayOrder">
                        ترتيب العرض
                    </label>

                    <input
                        id="displayOrder"
                        className={inputClass}
                        type="number"
                        min={0}
                        {...register("displayOrder", { valueAsNumber: true })}
                    />

                    {errors.displayOrder && (
                        <span className={errorClass}>{errors.displayOrder.message}</span>
                    )}
                </div>

                <label className={`${checkboxClass} self-end`}>
                    <input
                        className="h-4 w-4 rounded border-[var(--color-border)] accent-[var(--color-primary)]"
                        type="checkbox"
                        {...register("isActive")}
                    />

                    <span>الخدمة منشورة</span>
                </label>

                <div className="md:col-span-2">
                    <label className={labelClass} htmlFor="shortDescription">
                        وصف مختصر *
                    </label>

                    <input
                        id="shortDescription"
                        className={inputClass}
                        {...register("shortDescription")}
                    />

                    {errors.shortDescription && (
                        <span className={errorClass}>
                            {errors.shortDescription.message}
                        </span>
                    )}
                </div>

                <div className="md:col-span-2">
                    <label className={labelClass} htmlFor="description">
                        وصف الخدمة *
                    </label>

                    <textarea
                        id="description"
                        className={textareaClass}
                        {...register("description")}
                    />

                    {errors.description && (
                        <span className={errorClass}>{errors.description.message}</span>
                    )}
                </div>

                <div className="md:col-span-2">
                    <label className={labelClass}>صورة الخدمة</label>

                    <MediaUrlField
                        value={watch("imageUrl")}
                        onChange={(value) =>
                            setValue("imageUrl", value, {
                                shouldDirty: true,
                                shouldValidate: true,
                            })
                        }
                        kind="image"
                        folder="services"
                    />

                    {errors.imageUrl && (
                        <span className={errorClass}>{errors.imageUrl.message}</span>
                    )}
                </div>

                <div className="md:col-span-2">
                    <div className="rounded-[26px] border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4">
                        <label className={labelClass}>المناطق المرتبطة بالخدمة</label>

                        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                            <select
                                className={inputClass}
                                value={newAreaId}
                                onChange={(event) => setNewAreaId(event.target.value)}
                            >
                                <option value="">اختر منطقة</option>

                                {availableAreas.map((area) => (
                                    <option key={area.id} value={area.id}>
                                        {area.name}
                                    </option>
                                ))}
                            </select>

                            <button
                                type="button"
                                className={secondaryButtonClass}
                                onClick={addArea}
                            >
                                <Plus size={17} />
                                إضافة
                            </button>
                        </div>

                        {selectedAreas.length > 0 && (
                            <div className="mt-4 grid gap-2 sm:grid-cols-2">
                                {selectedAreas.map((area) => (
                                    <div
                                        key={area.id}
                                        className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
                                    >
                                        <strong className="text-sm font-black text-[var(--color-text)]">
                                            {area.name}
                                        </strong>

                                        <button
                                            type="button"
                                            className={dangerSmallButtonClass}
                                            onClick={() => removeArea(area.id)}
                                            aria-label="حذف المنطقة"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {errors.areaIds && (
                            <span className={errorClass}>{errors.areaIds.message}</span>
                        )}
                    </div>
                </div>

                <div>
                    <label className={labelClass} htmlFor="metaTitle">
                        SEO Title
                    </label>

                    <input
                        id="metaTitle"
                        className={inputClass}
                        {...register("metaTitle")}
                    />

                    {errors.metaTitle && (
                        <span className={errorClass}>{errors.metaTitle.message}</span>
                    )}
                </div>

                <div>
                    <label className={labelClass} htmlFor="metaDescription">
                        SEO Description
                    </label>

                    <input
                        id="metaDescription"
                        className={inputClass}
                        {...register("metaDescription")}
                    />

                    {errors.metaDescription && (
                        <span className={errorClass}>
                            {errors.metaDescription.message}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-[var(--color-border)] pt-5 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    className={cancelButtonClass}
                    onClick={onClose}
                    disabled={isSaving}
                >
                    إلغاء
                </button>

                <button className={submitButtonClass} disabled={isSaving} type="submit">
                    {isSaving ? "جارٍ الحفظ..." : "حفظ"}
                </button>
            </div>
        </form>
    );
}

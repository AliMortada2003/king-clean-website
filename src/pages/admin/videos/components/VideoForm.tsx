import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
    useAdminServices,
    useCreateAdminVideo,
    useUpdateAdminVideo,
} from "../../../../api/hooks";
import type {
    AdminVideoItemDto,
    UpsertVideoItemDto,
} from "../../../../types/api";
import { MediaUrlField } from "../../shared/resource-crud/MediaUrlField";

type VideoFormProps = {
    item?: AdminVideoItemDto;
    onSaved: () => void;
    onClose: () => void;
};

type VideoFormValues = {
    title: string;
    serviceId: number;
    thumbnailUrl: string;
    videoUrl: string;
    isActive: boolean;
};

const videoFormSchema = z.object({
    title: z.string().min(2, "عنوان الفيديو مطلوب.").max(200),
    serviceId: z.number().min(1, "اختر الخدمة."),
    thumbnailUrl: z.string().min(1, "الصورة مطلوبة."),
    videoUrl: z.string().min(1, "الفيديو مطلوب."),
    isActive: z.boolean(),
});

const inputClass =
    "min-h-12 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-bold text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-muted)]/70 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-primary)_16%,transparent)] disabled:cursor-not-allowed disabled:opacity-60";

const labelClass = "mb-2 block text-sm font-black text-[var(--color-text)]";

const errorClass = "mt-2 block text-xs font-bold text-[var(--color-danger)]";

const checkboxClass =
    "flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-bold text-[var(--color-text)] transition hover:bg-[var(--color-surface-soft)]";

const cancelButtonClass =
    "inline-flex min-h-11 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 text-sm font-black text-[var(--color-text)] transition hover:bg-[var(--color-surface-soft)] focus:outline-none focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-primary)_14%,transparent)] disabled:cursor-not-allowed disabled:opacity-60";

const submitButtonClass =
    "inline-flex min-h-11 items-center justify-center rounded-2xl bg-[var(--color-primary)] px-5 text-sm font-black text-[var(--color-navy)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--color-gold-dark)] hover:text-white focus:outline-none focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-primary)_18%,transparent)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60";

function getVideoDefaultValues(item?: AdminVideoItemDto): VideoFormValues {
    return {
        title: item?.title || "",
        serviceId: item?.serviceId || 0,
        thumbnailUrl: item?.thumbnailUrl || "",
        videoUrl: item?.videoUrl || "",
        isActive: item?.isActive ?? true,
    };
}

export function VideoForm({ item, onSaved, onClose }: VideoFormProps) {
    const services = useAdminServices();
    const createVideo = useCreateAdminVideo();
    const updateVideo = useUpdateAdminVideo();

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<VideoFormValues>({
        resolver: zodResolver(videoFormSchema),
        defaultValues: getVideoDefaultValues(item),
    });

    useEffect(() => {
        reset(getVideoDefaultValues(item));
    }, [item, reset]);

    const isSaving = createVideo.isPending || updateVideo.isPending;

    const submit = handleSubmit(async (values) => {
        const body: UpsertVideoItemDto = {
            title: values.title,
            description: item?.description || values.title,
            videoUrl: values.videoUrl,
            thumbnailUrl: values.thumbnailUrl,
            serviceId: Number(values.serviceId),
            areaId: item?.areaId ?? null,
            isFeatured: item?.isFeatured ?? false,
            isActive: Boolean(values.isActive),
            displayOrder: item?.displayOrder ?? 0,
        };

        try {
            if (item) {
                await updateVideo.mutateAsync({
                    id: item.id,
                    body,
                });
            } else {
                await createVideo.mutateAsync(body);
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
            <div className="grid gap-5">
                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <label className={labelClass} htmlFor="title">
                            عنوان الفيديو *
                        </label>

                        <input
                            id="title"
                            className={inputClass}
                            maxLength={200}
                            {...register("title")}
                        />

                        {errors.title && (
                            <span className={errorClass}>{errors.title.message}</span>
                        )}
                    </div>

                    <div>
                        <label className={labelClass} htmlFor="serviceId">
                            الخدمة *
                        </label>

                        <select
                            id="serviceId"
                            className={inputClass}
                            {...register("serviceId", { valueAsNumber: true })}
                        >
                            <option value={0}>اختر الخدمة</option>
                            {services.data?.map((service) => (
                                <option key={service.id} value={service.id}>
                                    {service.name}
                                </option>
                            ))}
                        </select>

                        {errors.serviceId && (
                            <span className={errorClass}>{errors.serviceId.message}</span>
                        )}
                    </div>

                </div>
                <div>
                    <label className={labelClass}>الصورة المصغرة *</label>

                    <MediaUrlField
                        value={watch("thumbnailUrl")}
                        onChange={(value) =>
                            setValue("thumbnailUrl", value, {
                                shouldDirty: true,
                                shouldValidate: true,
                            })
                        }
                        kind="image"
                        folder="videos"
                        required
                    />

                    {errors.thumbnailUrl && (
                        <span className={errorClass}>{errors.thumbnailUrl.message}</span>
                    )}
                </div>

                <div>
                    <label className={labelClass}>الفيديو *</label>

                    <MediaUrlField
                        value={watch("videoUrl")}
                        onChange={(value) =>
                            setValue("videoUrl", value, {
                                shouldDirty: true,
                                shouldValidate: true,
                            })
                        }
                        kind="video"
                        folder="videos"
                        required
                    />

                    {errors.videoUrl && (
                        <span className={errorClass}>{errors.videoUrl.message}</span>
                    )}
                </div>

                <label className={checkboxClass}>
                    <input
                        className="h-4 w-4 rounded border-[var(--color-border)] accent-[var(--color-primary)]"
                        type="checkbox"
                        {...register("isActive")}
                    />

                    <span>منشور على الموقع</span>
                </label>
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

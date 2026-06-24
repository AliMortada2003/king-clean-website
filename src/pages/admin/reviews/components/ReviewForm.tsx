import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
    useCreateAdminReview,
    useUpdateAdminReview,
} from "../../../../api/hooks";
import type { AdminReviewDto, UpsertReviewDto } from "../../../../types/api";

type ReviewFormProps = {
    item?: AdminReviewDto;
    onSaved: () => void;
    onClose: () => void;
};

type ReviewFormValues = {
    customerName: string;
    rating: number;
    comment: string;
    isActive: boolean;
};

const reviewFormSchema = z.object({
    customerName: z.string().min(2, "اسم العميل مطلوب.").max(150),
    rating: z.number().min(1, "اختر التقييم.").max(5),
    comment: z.string().min(2, "التعليق مطلوب.").max(1000),
    isActive: z.boolean(),
});

const inputClass =
    "min-h-12 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-bold text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-muted)]/70 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-primary)_16%,transparent)] disabled:cursor-not-allowed disabled:opacity-60";

const textareaClass = `${inputClass} min-h-32 resize-y leading-7`;

const labelClass = "mb-2 block text-sm font-black text-[var(--color-text)]";

const errorClass = "mt-2 block text-xs font-bold text-[var(--color-danger)]";

const checkboxClass =
    "flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-bold text-[var(--color-text)] transition hover:bg-[var(--color-surface-soft)]";

const cancelButtonClass =
    "inline-flex min-h-11 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 text-sm font-black text-[var(--color-text)] transition hover:bg-[var(--color-surface-soft)] focus:outline-none focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-primary)_14%,transparent)] disabled:cursor-not-allowed disabled:opacity-60";

const submitButtonClass =
    "inline-flex min-h-11 items-center justify-center rounded-2xl bg-[var(--color-primary)] px-5 text-sm font-black text-[var(--color-navy)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--color-gold-dark)] hover:text-white focus:outline-none focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-primary)_18%,transparent)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60";

function getReviewDefaultValues(item?: AdminReviewDto): ReviewFormValues {
    return {
        customerName: item?.customerName || "",
        rating: item?.rating || 5,
        comment: item?.comment || "",
        isActive: item?.isActive ?? true,
    };
}

export function ReviewForm({ item, onSaved, onClose }: ReviewFormProps) {
    const createReview = useCreateAdminReview();
    const updateReview = useUpdateAdminReview();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ReviewFormValues>({
        resolver: zodResolver(reviewFormSchema),
        defaultValues: getReviewDefaultValues(item),
    });

    useEffect(() => {
        reset(getReviewDefaultValues(item));
    }, [item, reset]);

    const isSaving = createReview.isPending || updateReview.isPending;

    const submit = handleSubmit(async (values) => {
        const body: UpsertReviewDto = {
            customerName: values.customerName,
            rating: Number(values.rating),
            comment: values.comment,
            isActive: Boolean(values.isActive),
            displayOrder: item?.displayOrder ?? 0,
        };

        try {
            if (item) {
                await updateReview.mutateAsync({
                    id: item.id,
                    body,
                });
            } else {
                await createReview.mutateAsync(body);
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
                <div>
                    <label className={labelClass} htmlFor="customerName">
                        اسم العميل *
                    </label>

                    <input
                        id="customerName"
                        className={inputClass}
                        maxLength={150}
                        {...register("customerName")}
                    />

                    {errors.customerName && (
                        <span className={errorClass}>{errors.customerName.message}</span>
                    )}
                </div>

                <div>
                    <label className={labelClass} htmlFor="rating">
                        التقييم *
                    </label>

                    <select
                        id="rating"
                        className={inputClass}
                        {...register("rating", { valueAsNumber: true })}
                    >
                        {[5, 4, 3, 2, 1].map((rating) => (
                            <option key={rating} value={rating}>
                                {rating} نجوم
                            </option>
                        ))}
                    </select>

                    {errors.rating && (
                        <span className={errorClass}>{errors.rating.message}</span>
                    )}
                </div>

                <div>
                    <label className={labelClass} htmlFor="comment">
                        التعليق *
                    </label>

                    <textarea
                        id="comment"
                        className={textareaClass}
                        maxLength={1000}
                        {...register("comment")}
                    />

                    {errors.comment && (
                        <span className={errorClass}>{errors.comment.message}</span>
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

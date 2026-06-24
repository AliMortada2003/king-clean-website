import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  useAdminServices,
  useCreateAdminArea,
  useUpdateAdminArea,
} from "../../../../api/hooks";
import type { AdminAreaDto, UpsertAreaDto } from "../../../../types/api";

type AreaFormProps = {
  item?: AdminAreaDto;
  onSaved: () => void;
  onClose: () => void;
};

type AreaFormValues = {
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  displayOrder: number;
  metaTitle: string;
  metaDescription: string;
  serviceIds: number[];
};

const areaFormSchema = z.object({
  name: z.string().min(2, "اسم المنطقة مطلوب.").max(150),
  slug: z.string().min(2, "رابط المنطقة مطلوب.").max(180),
  description: z.string().min(2, "وصف المنطقة مطلوب.").max(1500),
  isActive: z.boolean(),
  displayOrder: z.number().min(0),
  metaTitle: z.string().max(200),
  metaDescription: z.string().max(500),
  serviceIds: z.array(z.number()),
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

function getAreaDefaultValues(item?: AdminAreaDto): AreaFormValues {
  return {
    name: item?.name || "",
    slug: item?.slug || "",
    description: item?.description || "",
    isActive: item?.isActive ?? true,
    displayOrder: item?.displayOrder ?? 0,
    metaTitle: item?.metaTitle || "",
    metaDescription: item?.metaDescription || "",
    serviceIds: item?.services?.map((service) => service.id) || [],
  };
}

export function AreaForm({ item, onSaved, onClose }: AreaFormProps) {
  const services = useAdminServices();
  const createArea = useCreateAdminArea();
  const updateArea = useUpdateAdminArea();
  const [newServiceId, setNewServiceId] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AreaFormValues>({
    resolver: zodResolver(areaFormSchema),
    defaultValues: getAreaDefaultValues(item),
  });

  useEffect(() => {
    reset(getAreaDefaultValues(item));
    setNewServiceId("");
  }, [item, reset]);

  const serviceIds = watch("serviceIds") || [];
  const selectedServices =
    services.data?.filter((service) => serviceIds.includes(service.id)) || [];
  const availableServices =
    services.data?.filter((service) => !serviceIds.includes(service.id)) || [];

  const addService = () => {
    const id = Number(newServiceId);

    if (!id) {
      toast.error("اختر خدمة أولًا.");
      return;
    }

    setValue("serviceIds", [...serviceIds, id], {
      shouldDirty: true,
      shouldValidate: true,
    });
    setNewServiceId("");
  };

  const removeService = (id: number) => {
    setValue(
      "serviceIds",
      serviceIds.filter((serviceId) => serviceId !== id),
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  const isSaving = createArea.isPending || updateArea.isPending;

  const submit = handleSubmit(async (values) => {
    const body: UpsertAreaDto = {
      name: values.name,
      slug: values.slug || toSlug(values.name),
      description: values.description,
      isActive: Boolean(values.isActive),
      displayOrder: Number(values.displayOrder || 0),
      metaTitle: values.metaTitle || values.name,
      metaDescription: values.metaDescription || values.description,
      serviceIds: values.serviceIds || [],
    };

    try {
      if (item) {
        await updateArea.mutateAsync({
          id: item.id,
          body,
        });
      } else {
        await createArea.mutateAsync(body);
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
            اسم المنطقة *
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
            رابط المنطقة *
          </label>

          <input
            id="slug"
            className={inputClass}
            dir="ltr"
            placeholder="new-cairo"
            {...register("slug")}
          />

          <span className={hintClass}>مثال: new-cairo</span>

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

          <span>المنطقة منشورة</span>
        </label>

        <div className="md:col-span-2">
          <label className={labelClass} htmlFor="description">
            وصف المنطقة *
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
          <div className="rounded-[26px] border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4">
            <label className={labelClass}>الخدمات المرتبطة بالمنطقة</label>

            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <select
                className={inputClass}
                value={newServiceId}
                onChange={(event) => setNewServiceId(event.target.value)}
              >
                <option value="">اختر خدمة</option>

                {availableServices.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className={secondaryButtonClass}
                onClick={addService}
              >
                <Plus size={17} />
                إضافة
              </button>
            </div>

            {selectedServices.length > 0 && (
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {selectedServices.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
                  >
                    <strong className="text-sm font-black text-[var(--color-text)]">
                      {service.name}
                    </strong>

                    <button
                      type="button"
                      className={dangerSmallButtonClass}
                      onClick={() => removeService(service.id)}
                      aria-label="حذف الخدمة"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {errors.serviceIds && (
              <span className={errorClass}>{errors.serviceIds.message}</span>
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

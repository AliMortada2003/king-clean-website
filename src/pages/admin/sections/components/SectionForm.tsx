import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  useCreateAdminSection,
  useUpdateAdminSection,
} from "../../../../api/hooks";
import type {
  SiteSectionDto,
  UpsertSiteSectionDto,
} from "../../../../types/api";
import { MediaUrlField } from "../../shared/resource-crud/MediaUrlField";

type SectionFormProps = {
  item?: SiteSectionDto;
  onSaved: () => void;
  onClose: () => void;
};

type SectionFormValues = {
  key: string;
  page: string;
  title: string;
  subtitle: string;
  body: string;
  imageUrl: string;
  videoUrl: string;
  ctaText: string;
  ctaUrl: string;
  payloadJson: string;
  isActive: boolean;
  displayOrder: number;
};

type PayloadItem = {
  title: string;
  description: string;
};

const pageOptions = [
  { value: "home", label: "الرئيسية", path: "/" },
  { value: "services", label: "خدماتنا", path: "/services" },
  { value: "areas", label: "المناطق", path: "/areas" },
  { value: "gallery", label: "أعمالنا", path: "/gallery" },
  { value: "videos", label: "الفيديو", path: "/videos" },
  { value: "about", label: "من نحن", path: "/about" },
  { value: "contact", label: "تواصل معنا", path: "/contact" },
] as const;

const ctaUrlOptions = [
  { value: "", label: "بدون زر" },
  { value: "/request-service", label: "طلب خدمة" },
  { value: "/contact", label: "تواصل معنا" },
  { value: "/services", label: "كل الخدمات" },
  { value: "/areas", label: "مناطق الخدمة" },
  { value: "/gallery", label: "معرض الأعمال" },
  { value: "/videos", label: "الفيديوهات" },
  { value: "/about", label: "من نحن" },
  { value: "/", label: "الرئيسية" },
] as const;

const sectionFormSchema = z.object({
  key: z.string().min(2, "مفتاح القسم مطلوب.").max(120),
  page: z.string().min(2, "اختر الصفحة.").max(80),
  title: z.string().min(2, "عنوان القسم مطلوب.").max(250),
  subtitle: z.string().max(500),
  body: z.string().max(4000),
  imageUrl: z.string(),
  videoUrl: z.string(),
  ctaText: z.string().max(150),
  ctaUrl: z.string().max(500),
  payloadJson: z.string().max(4000),
  isActive: z.boolean(),
  displayOrder: z.number().min(0),
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

function parsePayloadItems(payloadJson?: string | null): PayloadItem[] {
  if (!payloadJson) return [];

  try {
    const parsed = JSON.parse(payloadJson);

    if (!parsed || typeof parsed !== "object") return [];
    if (!Array.isArray(parsed.items)) return [];

    return parsed.items
      .map((item: any) => ({
        title: String(item?.title || ""),
        description: String(item?.description || ""),
      }))
      .filter((item: PayloadItem) => item.title || item.description);
  } catch {
    return [];
  }
}

function stringifyPayloadItems(items: PayloadItem[]) {
  if (!items.length) return "";

  return JSON.stringify(
    {
      items,
    },
    null,
    2,
  );
}

function getSectionDefaultValues(item?: SiteSectionDto): SectionFormValues {
  return {
    key: item?.key || "",
    page: item?.page || "home",
    title: item?.title || "",
    subtitle: item?.subtitle || "",
    body: item?.body || "",
    imageUrl: item?.imageUrl || "",
    videoUrl: item?.videoUrl || "",
    ctaText: item?.ctaText || "",
    ctaUrl: item?.ctaUrl || "",
    payloadJson: item?.payloadJson || "",
    isActive: item?.isActive ?? true,
    displayOrder: item?.displayOrder ?? 0,
  };
}

export function SectionForm({ item, onSaved, onClose }: SectionFormProps) {
  const createSection = useCreateAdminSection();
  const updateSection = useUpdateAdminSection();

  const [payloadItems, setPayloadItems] = useState<PayloadItem[]>([]);
  const [payloadTitle, setPayloadTitle] = useState("");
  const [payloadDescription, setPayloadDescription] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SectionFormValues>({
    resolver: zodResolver(sectionFormSchema),
    defaultValues: getSectionDefaultValues(item),
  });

  useEffect(() => {
    const defaults = getSectionDefaultValues(item);
    const items = parsePayloadItems(defaults.payloadJson);

    reset(defaults);
    setPayloadItems(items);
    setPayloadTitle("");
    setPayloadDescription("");
  }, [item, reset]);

  const selectedPage = watch("page");
  const selectedPageOption = pageOptions.find(
    (option) => option.value === selectedPage,
  );

  const selectedCtaUrl = watch("ctaUrl");
  const selectedCtaOption = ctaUrlOptions.find(
    (option) => option.value === selectedCtaUrl,
  );

  const syncPayloadItems = (items: PayloadItem[]) => {
    setPayloadItems(items);
    setValue("payloadJson", stringifyPayloadItems(items), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const addPayloadItem = () => {
    const title = payloadTitle.trim();
    const description = payloadDescription.trim();

    if (!title && !description) {
      toast.error("اكتب عنوان أو وصف للعنصر أولًا.");
      return;
    }

    syncPayloadItems([...payloadItems, { title, description }]);
    setPayloadTitle("");
    setPayloadDescription("");
  };

  const removePayloadItem = (index: number) => {
    syncPayloadItems(payloadItems.filter((_, itemIndex) => itemIndex !== index));
  };

  const isSaving = createSection.isPending || updateSection.isPending;

  const submit = handleSubmit(async (values) => {
    const body: UpsertSiteSectionDto = {
      key: values.key,
      page: values.page,
      title: values.title,
      subtitle: values.subtitle || null,
      body: values.body || null,
      imageUrl: values.imageUrl || null,
      videoUrl: values.videoUrl || null,
      ctaText: values.ctaText || null,
      ctaUrl: values.ctaUrl || null,
      payloadJson: values.payloadJson || null,
      isActive: Boolean(values.isActive),
      displayOrder: Number(values.displayOrder || 0),
    };

    try {
      if (item) {
        await updateSection.mutateAsync({
          id: item.id,
          body,
        });
      } else {
        await createSection.mutateAsync(body);
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
          <label className={labelClass} htmlFor="page">
            الصفحة *
          </label>

          <select id="page" className={inputClass} {...register("page")}>
            {pageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {selectedPageOption && (
            <span className={hintClass} dir="ltr">
              {selectedPageOption.path}
            </span>
          )}

          {errors.page && (
            <span className={errorClass}>{errors.page.message}</span>
          )}
        </div>

        <div>
          <label className={labelClass} htmlFor="key">
            مفتاح القسم *
          </label>

          <input
            id="key"
            className={inputClass}
            dir="ltr"
            placeholder={`${selectedPage || "home"}.why-us`}
            {...register("key")}
          />

          <span className={hintClass} dir="ltr">
            مثال: {selectedPage || "home"}.why-us
          </span>

          {errors.key && (
            <span className={errorClass}>{errors.key.message}</span>
          )}
        </div>

        <div>
          <label className={labelClass} htmlFor="title">
            العنوان *
          </label>

          <input id="title" className={inputClass} {...register("title")} />

          {errors.title && (
            <span className={errorClass}>{errors.title.message}</span>
          )}
        </div>

        <div>
          <label className={labelClass} htmlFor="subtitle">
            العنوان الفرعي
          </label>

          <input
            id="subtitle"
            className={inputClass}
            {...register("subtitle")}
          />

          {errors.subtitle && (
            <span className={errorClass}>{errors.subtitle.message}</span>
          )}
        </div>

        <div>
          <label className={labelClass} htmlFor="ctaText">
            نص الزر
          </label>

          <input
            id="ctaText"
            className={inputClass}
            placeholder="اطلب خدمة الآن"
            {...register("ctaText")}
          />

          {errors.ctaText && (
            <span className={errorClass}>{errors.ctaText.message}</span>
          )}
        </div>

        <div>
          <label className={labelClass} htmlFor="ctaUrl">
            يذهب إلى
          </label>

          <select id="ctaUrl" className={inputClass} {...register("ctaUrl")}>
            {ctaUrlOptions.map((option) => (
              <option key={option.value || "empty"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {selectedCtaOption && selectedCtaOption.value && (
            <span className={hintClass} dir="ltr">
              {selectedCtaOption.value}
            </span>
          )}

          {errors.ctaUrl && (
            <span className={errorClass}>{errors.ctaUrl.message}</span>
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

          <span>القسم منشور</span>
        </label>

        <div className="md:col-span-2">
          <label className={labelClass} htmlFor="body">
            النص
          </label>

          <textarea id="body" className={textareaClass} {...register("body")} />

          {errors.body && (
            <span className={errorClass}>{errors.body.message}</span>
          )}
        </div>

        <div>
          <label className={labelClass}>الصورة</label>

          <MediaUrlField
            value={watch("imageUrl")}
            onChange={(value) =>
              setValue("imageUrl", value, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            kind="image"
            folder="sections"
          />

          {errors.imageUrl && (
            <span className={errorClass}>{errors.imageUrl.message}</span>
          )}
        </div>

        <div>
          <label className={labelClass}>الفيديو</label>

          <MediaUrlField
            value={watch("videoUrl")}
            onChange={(value) =>
              setValue("videoUrl", value, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            kind="video"
            folder="sections"
          />

          {errors.videoUrl && (
            <span className={errorClass}>{errors.videoUrl.message}</span>
          )}
        </div>

        <div className="md:col-span-2">
          <div className="rounded-[26px] border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4">
            <div className="mb-4">
              <label className={labelClass}>عناصر إضافية داخل السكشن</label>
              <p className="m-0 text-xs font-bold leading-6 text-[var(--color-muted)]">
                استخدمها مثلًا في سكشن “ليه تختارنا” لإضافة نقاط مثل: فريق موثوق، مواعيد مرنة، اهتمام بالتفاصيل.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-[1fr_1.4fr_auto]">
              <input
                className={inputClass}
                value={payloadTitle}
                onChange={(event) => setPayloadTitle(event.target.value)}
                placeholder="عنوان العنصر"
              />

              <input
                className={inputClass}
                value={payloadDescription}
                onChange={(event) => setPayloadDescription(event.target.value)}
                placeholder="وصف العنصر"
              />

              <button
                type="button"
                className={secondaryButtonClass}
                onClick={addPayloadItem}
              >
                <Plus size={17} />
                إضافة
              </button>
            </div>

            {payloadItems.length > 0 && (
              <div className="mt-4 grid gap-2">
                {payloadItems.map((payloadItem, index) => (
                  <div
                    key={`${payloadItem.title}-${index}`}
                    className="flex items-start justify-between gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
                  >
                    <div className="min-w-0">
                      {payloadItem.title && (
                        <strong className="block text-sm font-black text-[var(--color-text)]">
                          {payloadItem.title}
                        </strong>
                      )}

                      {payloadItem.description && (
                        <p className="m-0 mt-1 text-sm font-bold leading-6 text-[var(--color-muted)]">
                          {payloadItem.description}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      className={dangerSmallButtonClass}
                      onClick={() => removePayloadItem(index)}
                      aria-label="حذف العنصر"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {errors.payloadJson && (
              <span className={errorClass}>{errors.payloadJson.message}</span>
            )}
          </div>
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

import {
    Controller,
    type Control,
    type FieldErrors,
    type UseFormRegister,
} from "react-hook-form";

import type { AdminResourceName, LookupDto } from "../../../../types/api";
import type { FieldConfig } from "./types";
import { MediaUrlField } from "./MediaUrlField";

type ResourceFieldProps = {
    resource: AdminResourceName;
    field: FieldConfig;
    register: UseFormRegister<any>;
    control: Control<any>;
    errors: FieldErrors<any>;
    services?: LookupDto[];
    areas?: LookupDto[];
    areaOptions?: LookupDto[];
};

const fieldWrapperClass =
    "grid gap-2";

const fullSpanClass =
    "md:col-span-2";

const labelClass =
    "text-sm font-black text-[var(--color-text)]";

const inputClass =
    "min-h-12 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-bold text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-muted)]/70 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-primary)_16%,transparent)] disabled:cursor-not-allowed disabled:opacity-60";

const textareaClass =
    `${inputClass} min-h-32 resize-y leading-7`;

const errorClass =
    "text-xs font-bold text-[var(--color-danger)]";

const checkboxRowClass =
    "flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-bold text-[var(--color-text)] transition hover:bg-[var(--color-surface-soft)]";

const checkboxClass =
    "h-4 w-4 rounded border-[var(--color-border)] accent-[var(--color-primary)]";

export function ResourceField({
    resource,
    field,
    register,
    control,
    errors,
    services,
    areas,
    areaOptions,
}: ResourceFieldProps) {
    const error = errors[field.name]?.message as string | undefined;
    const wrapperClass = `${fieldWrapperClass} ${field.span ? fullSpanClass : ""}`;

    if (field.type === "checkbox") {
        return (
            <label className={`${checkboxRowClass} ${field.span ? fullSpanClass : ""}`}>
                <input
                    className={checkboxClass}
                    type="checkbox"
                    {...register(field.name)}
                />
                <span>{field.label}</span>
            </label>
        );
    }

    if (field.type === "multi-areas" || field.type === "multi-services") {
        const options = field.type === "multi-areas" ? areas : services;

        return (
            <div className={wrapperClass}>
                <label className={labelClass}>
                    {field.label}
                    {field.required ? " *" : ""}
                </label>

                <Controller
                    name={field.name}
                    control={control}
                    render={({ field: controller }) => (
                        <div className="grid gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-3 sm:grid-cols-2">
                            {options?.length ? (
                                options.map((option) => (
                                    <label className={checkboxRowClass} key={option.id}>
                                        <input
                                            className={checkboxClass}
                                            type="checkbox"
                                            checked={(controller.value || []).includes(option.id)}
                                            onChange={(event) =>
                                                controller.onChange(
                                                    event.target.checked
                                                        ? [...(controller.value || []), option.id]
                                                        : (controller.value || []).filter(
                                                            (id: number) => id !== option.id,
                                                        ),
                                                )
                                            }
                                        />
                                        <span className="line-clamp-1">{option.name}</span>
                                    </label>
                                ))
                            ) : (
                                <p className="m-0 rounded-2xl bg-[var(--color-surface)] px-4 py-3 text-sm font-bold text-[var(--color-muted)] sm:col-span-2">
                                    لا توجد اختيارات متاحة حالياً.
                                </p>
                            )}
                        </div>
                    )}
                />

                {error && <span className={errorClass}>{error}</span>}
            </div>
        );
    }

    if (field.type === "upload-image" || field.type === "upload-video") {
        return (
            <div className={wrapperClass}>
                <label className={labelClass}>
                    {field.label}
                    {field.required ? " *" : ""}
                </label>

                <Controller
                    name={field.name}
                    control={control}
                    render={({ field: controller }) => (
                        <MediaUrlField
                            value={controller.value}
                            onChange={controller.onChange}
                            kind={field.type === "upload-image" ? "image" : "video"}
                            folder={resource}
                            required={field.required}
                        />
                    )}
                />

                {error && <span className={errorClass}>{error}</span>}
            </div>
        );
    }

    const common = {
        id: field.name,
        maxLength: field.maxLength,
        required: field.required,
        ...register(
            field.name,
            field.type === "number" ||
                field.type === "rating" ||
                field.type.startsWith("select-")
                ? { valueAsNumber: true }
                : undefined,
        ),
    };

    return (
        <div className={wrapperClass}>
            <label className={labelClass} htmlFor={field.name}>
                {field.label}
                {field.required ? " *" : ""}
            </label>

            {field.type === "textarea" || field.type === "json" ? (
                <textarea
                    {...common}
                    className={textareaClass}
                    dir={field.type === "json" ? "ltr" : undefined}
                />
            ) : field.type === "select-service" ? (
                <select className={inputClass} {...common}>
                    <option value={0}>اختر الخدمة</option>
                    {services?.map((service) => (
                        <option key={service.id} value={service.id}>
                            {service.name}
                        </option>
                    ))}
                </select>
            ) : field.type === "select-area" ? (
                <select className={inputClass} {...common}>
                    <option value={0}>بدون منطقة</option>
                    {areaOptions?.map((area) => (
                        <option key={area.id} value={area.id}>
                            {area.name}
                        </option>
                    ))}
                </select>
            ) : field.type === "rating" ? (
                <select className={inputClass} {...common}>
                    {[5, 4, 3, 2, 1].map((rating) => (
                        <option key={rating} value={rating}>
                            {rating} نجوم
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    {...common}
                    className={inputClass}
                    min={field.type === "number" ? 0 : undefined}
                    type={
                        field.type === "number"
                            ? "number"
                            : field.type === "url"
                                ? "url"
                                : "text"
                    }
                />
            )}

            {error && <span className={errorClass}>{error}</span>}
        </div>
    );
}
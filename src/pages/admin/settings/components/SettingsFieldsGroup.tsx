import type { FieldErrors, UseFormRegister } from "react-hook-form";

import type { SettingsFieldGroup, SettingsValues } from "../types";
import { SettingsSectionCard } from "./SettingsSectionCard";

type SettingsFieldsGroupProps = {
  group: SettingsFieldGroup;
  register: UseFormRegister<SettingsValues>;
  errors: FieldErrors<SettingsValues>;
};

const inputClass =
  "min-h-12 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm font-bold text-[var(--color-text)] outline-none focus:border-[var(--color-gold)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-gold)_18%,transparent)]";
const textareaClass = `${inputClass} min-h-28 py-3`;

export function SettingsFieldsGroup({
  group,
  register,
  errors,
}: SettingsFieldsGroupProps) {
  return (
    <SettingsSectionCard title={group.title} description={group.description}>
      <div className="grid gap-4 md:grid-cols-2">
        {group.fields.map((field) => (
          <div
            className={["grid gap-2", field.span ? "md:col-span-2" : ""].join(
              " ",
            )}
            key={field.name}
          >
            <label
              className="text-sm font-black text-[var(--color-text)]"
              htmlFor={field.name}
            >
              {field.label}
            </label>

            {field.textarea ? (
              <textarea
                className={textareaClass}
                id={field.name}
                {...register(field.name)}
              />
            ) : (
              <input
                className={inputClass}
                id={field.name}
                type={field.type || "text"}
                {...register(field.name)}
              />
            )}

            {errors[field.name] && (
              <span className="text-sm font-bold text-[var(--color-danger)]">
                {errors[field.name]?.message}
              </span>
            )}
          </div>
        ))}
      </div>
    </SettingsSectionCard>
  );
}

import { z } from "zod";

import { settingsSchema } from "../../../lib/validation";

export type SettingsValues = z.infer<typeof settingsSchema>;

export type SettingsField = {
  name: keyof SettingsValues;
  label: string;
  type?: string;
  span?: boolean;
  textarea?: boolean;
};

export type SettingsFieldGroup = {
  title: string;
  description: string;
  fields: SettingsField[];
};

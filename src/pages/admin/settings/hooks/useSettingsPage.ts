import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useAdminSettings, useUpdateSettings } from "../../../../api/hooks";
import { settingsSchema } from "../../../../lib/validation";
import type { SettingsValues } from "../types";

export function useSettingsPage() {
  const query = useAdminSettings();
  const mutation = useUpdateSettings();
  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    if (query.data) form.reset(query.data as SettingsValues);
  }, [query.data, form]);

  const submit = form.handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync(values);
      toast.success("تم حفظ إعدادات الموقع.");
      form.reset(values);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "تعذر حفظ الإعدادات.",
      );
    }
  });

  return {
    query,
    mutation,
    form,
    submit,
  };
}

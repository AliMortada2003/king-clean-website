import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useHealth } from "../../../../api/hooks";
import { useAuth } from "../../../../auth/AuthProvider";
import { ApiError } from "../../../../lib/api-client";
import { loginSchema } from "../../../../lib/validation";
import type { LoginValues, ServerHealthState } from "../types";

export function useLoginPage() {
  const { login, isLoggingIn, session } = useAuth();
  const health = useHealth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const returnTo = useMemo(() => {
    const value = params.get("returnTo");

    return value?.startsWith("/admin") ? value : "/admin";
  }, [params]);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (!session) return;

    navigate(returnTo, { replace: true });
  }, [session, navigate, returnTo]);

  const submit = form.handleSubmit(async (values) => {
    try {
      await login({
        email: values.email.trim(),
        password: values.password,
      });

      navigate(returnTo, { replace: true });
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          form.setError(field as keyof LoginValues, {
            message: messages[0],
          });
        });

        return;
      }

      form.setError("root", {
        message:
          error instanceof Error ? error.message : "تعذر تسجيل الدخول.",
      });
    }
  });

  const healthState: ServerHealthState = health.isSuccess
    ? "online"
    : health.isError
      ? "offline"
      : "checking";

  return {
    form,
    healthState,
    isLoggingIn,
    submit,
  };
}
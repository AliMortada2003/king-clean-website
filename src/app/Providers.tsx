import type { PropsWithChildren } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";
import { queryClient } from "./query-client";
import { AuthProvider, ClientAuthProvider } from "../auth/AuthProvider";

export function Providers({ children }: PropsWithChildren) {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ClientAuthProvider>{children}</ClientAuthProvider>
        </AuthProvider>
        <Toaster position="top-center" richColors className="toast-rtl" />
      </QueryClientProvider>
    </HelmetProvider>
  );
}

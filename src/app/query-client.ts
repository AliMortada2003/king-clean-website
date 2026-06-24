import { QueryClient } from "@tanstack/react-query";
import { shouldRetry } from "../lib/api-client";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetry,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
    mutations: { retry: false },
  },
});

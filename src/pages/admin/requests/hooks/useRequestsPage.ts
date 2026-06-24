import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import {
  useAdminRequests,
  useAdminAreas,
  useAdminServices,
  useRequestMutations,
} from "../../../../api/hooks";
import type { RequestStatus } from "../../../../types/api";
import { queryFromParams } from "../utils/requestConstants";
import type { RequestFilterKey, RequestStatusTarget } from "../types";

export function useRequestsPage() {
  const [params, setParams] = useSearchParams();
  const query = useMemo(() => queryFromParams(params), [params]);
  const requests = useAdminRequests(query);
  const services = useAdminServices();
  const areas = useAdminAreas();
  const [pendingSearch, setPendingSearch] = useState<string | null>(null);
  const search = pendingSearch ?? query.search ?? "";
  const [statusTarget, setStatusTarget] =
    useState<RequestStatusTarget | null>(null);
  const mutations = useRequestMutations(statusTarget?.id);

  useEffect(() => {
    if (pendingSearch === null) return;

    const timer = window.setTimeout(() => {
      const next = new URLSearchParams(params);

      if (pendingSearch) next.set("search", pendingSearch);
      else next.delete("search");

      next.set("page", "1");

      if (next.toString() !== params.toString()) {
        setParams(next, { replace: true });
      }

      setPendingSearch(null);
    }, 400);

    return () => clearTimeout(timer);
  }, [pendingSearch, params, setParams]);

  const setFilter = (key: RequestFilterKey, value?: string) => {
    const next = new URLSearchParams(params);

    if (value) next.set(key, value);
    else next.delete(key);

    next.set("page", "1");
    setParams(next);
  };

  const clearFilters = () => {
    setPendingSearch(null);
    setParams({});
  };

  const setPage = (page: number) => {
    const next = new URLSearchParams(params);
    next.set("page", String(page));
    setParams(next);
  };

  const openStatusModal = (id: number, status: RequestStatus) => {
    setStatusTarget({ id, status });
  };

  const updateStatusTarget = (status: RequestStatus) => {
    setStatusTarget((current) => (current ? { ...current, status } : current));
  };

  const submitStatus = async () => {
    if (!statusTarget) return;

    try {
      await mutations.status.mutateAsync({ status: statusTarget.status });
      toast.success("تم تحديث حالة الطلب.");
      setStatusTarget(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "تعذر تحديث حالة الطلب.",
      );
    }
  };

  return {
    query,
    requests,
    services,
    areas,
    search,
    statusTarget,
    statusBusy: mutations.status.isPending,
    hasFilters: params.toString().length > 0 || !!pendingSearch,
    setSearch: setPendingSearch,
    setFilter,
    clearFilters,
    setPage,
    openStatusModal,
    closeStatusModal: () => setStatusTarget(null),
    updateStatusTarget,
    submitStatus,
  };
}

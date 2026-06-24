import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  CircleX,
  ClipboardList,
  MapPinned,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";

import {
  useAdminRequests,
  useDashboardCharts,
  useDashboardStats,
  useRequestMutations,
} from "../../../../api/hooks";
import { requestStatuses } from "../../../../lib/status";
import type { RequestStatus } from "../../../../types/api";
import type { DashboardKpiItem } from "../components/DashboardKpiCard";
import type { DashboardStatusTarget } from "../components/QuickStatusModal";
import type { NormalizedStatusMetric } from "../components/RequestsStatusDonut";
import {
  dashboardStatusLabels,
  type DashboardPeriod,
} from "../utils/dashboardConstants";

export function useDashboardData() {
  const [days, setDays] = useState<DashboardPeriod>(30);
  const [statusTarget, setStatusTarget] =
    useState<DashboardStatusTarget | null>(null);

  const stats = useDashboardStats();
  const charts = useDashboardCharts(days);
  const latest = useAdminRequests({ page: 1, pageSize: 5 });
  const requestMutations = useRequestMutations(statusTarget?.id);
  const retriedConsistency = useRef(false);

  const normalizedStatuses = useMemo<NormalizedStatusMetric[]>(
    () =>
      requestStatuses.map((status) => ({
        name: status,
        label: dashboardStatusLabels[status],
        value:
          charts.data?.requestsByStatus.find((item) => item.name === status)
            ?.value || 0,
      })),
    [charts.data],
  );

  const statusTotal = useMemo(
    () => normalizedStatuses.reduce((sum, item) => sum + item.value, 0),
    [normalizedStatuses],
  );

  const isStatusDataConsistent =
    !stats.data || !charts.data || statusTotal === stats.data.totalRequests;

  useEffect(() => {
    if (!isStatusDataConsistent && !retriedConsistency.current) {
      retriedConsistency.current = true;
      void Promise.all([stats.refetch(), charts.refetch()]);
    }

    if (isStatusDataConsistent) retriedConsistency.current = false;
  }, [isStatusDataConsistent, stats, charts]);

  const kpis = useMemo<DashboardKpiItem[]>(
    () =>
      stats.data
        ? [
            {
              label: "إجمالي الطلبات",
              value: stats.data.totalRequests,
              icon: ClipboardList,
            },
            {
              label: "طلبات جديدة",
              value: stats.data.newRequests,
              icon: Activity,
            },
            {
              label: "طلبات مجدولة",
              value: stats.data.scheduledRequests,
              icon: CalendarDays,
            },
            {
              label: "طلبات مكتملة",
              value: stats.data.completedRequests,
              icon: CheckCircle2,
            },
            {
              label: "طلبات ملغاة",
              value: stats.data.cancelledRequests,
              icon: CircleX,
            },
            {
              label: "خدمات نشطة",
              value: stats.data.activeServices,
              icon: Wrench,
            },
            {
              label: "مناطق نشطة",
              value: stats.data.activeAreas,
              icon: MapPinned,
            },
          ]
        : [],
    [stats.data],
  );

  const noTrend = !charts.data?.requestsTrend.some(
    (point) => point.requests > 0,
  );

  const hasServicePerformance = !!charts.data?.servicesPerformance.some(
    (item) => item.requests > 0,
  );

  const hasAreaDemand = !!charts.data?.areaRequests.some(
    (item) => item.requests > 0,
  );

  const openStatusModal = (id: number, status: RequestStatus) => {
    setStatusTarget({ id, status });
  };

  const updateTargetStatus = (status: RequestStatus) => {
    setStatusTarget((current) =>
      current ? { ...current, status } : current,
    );
  };

  const submitStatus = async () => {
    if (!statusTarget) return;

    try {
      await requestMutations.status.mutateAsync({
        status: statusTarget.status,
      });

      toast.success("تم تحديث حالة الطلب.");
      setStatusTarget(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "تعذر تحديث الحالة.",
      );
    }
  };

  return {
    days,
    setDays,
    stats,
    charts,
    latest,
    kpis,
    statusTarget,
    normalizedStatuses,
    statusTotal,
    isStatusDataConsistent,
    noTrend,
    hasServicePerformance,
    hasAreaDemand,
    statusMutationBusy: requestMutations.status.isPending,
    openStatusModal,
    updateTargetStatus,
    closeStatusModal: () => setStatusTarget(null),
    submitStatus,
  };
}

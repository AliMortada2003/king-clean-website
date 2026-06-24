import { Seo } from "../../../components/Seo";
import { AreaDemandChart } from "./components/AreaDemandChart";
import { DashboardKpiRail } from "./components/DashboardKpiRail";
import { DashboardPageHeader } from "./components/DashboardPageHeader";
import { LatestRequestsPanel } from "./components/LatestRequestsPanel";
import { QuickStatusModal } from "./components/QuickStatusModal";
import { RequestsStatusDonut } from "./components/RequestsStatusDonut";
import { RequestsTrendChart } from "./components/RequestsTrendChart";
import { ServicesPerformanceChart } from "./components/ServicesPerformanceChart";
import { useDashboardData } from "./hooks/useDashboardData";

export function DashboardPage() {
  const dashboard = useDashboardData();

  return (
    <>
      <Seo
        title="لوحة التحكم | KING CLEAN"
        description="لوحة إدارة KING CLEAN"
        noIndex
      />

      <DashboardPageHeader
        days={dashboard.days}
        onDaysChange={dashboard.setDays}
      />

      <DashboardKpiRail
        error={dashboard.stats.error}
        isError={dashboard.stats.isError}
        isLoading={dashboard.stats.isLoading}
        kpis={dashboard.kpis}
        retry={() => void dashboard.stats.refetch()}
      />

      <div className="grid gap-6 xl:grid-cols-12">
        <RequestsTrendChart
          data={dashboard.charts.data?.requestsTrend}
          days={dashboard.days}
          error={dashboard.charts.error}
          isEmpty={dashboard.noTrend}
          isError={dashboard.charts.isError}
          isLoading={dashboard.charts.isLoading}
          retry={() => void dashboard.charts.refetch()}
        />

        <RequestsStatusDonut
          data={dashboard.normalizedStatuses}
          error={dashboard.charts.error}
          isConsistent={dashboard.isStatusDataConsistent}
          isError={dashboard.charts.isError}
          isLoading={dashboard.charts.isLoading}
          retry={() => void dashboard.charts.refetch()}
          total={dashboard.statusTotal}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(270px,0.85fr)_minmax(0,1.6fr)_minmax(270px,0.85fr)]">
        <ServicesPerformanceChart
          data={dashboard.charts.data?.servicesPerformance}
          error={dashboard.charts.error}
          hasData={dashboard.hasServicePerformance}
          isError={dashboard.charts.isError}
          isLoading={dashboard.charts.isLoading}
          retry={() => void dashboard.charts.refetch()}
        />

        <LatestRequestsPanel
          error={dashboard.latest.error}
          isError={dashboard.latest.isError}
          isLoading={dashboard.latest.isLoading}
          items={dashboard.latest.data?.items}
          onStatusClick={dashboard.openStatusModal}
          retry={() => void dashboard.latest.refetch()}
        />

        <AreaDemandChart
          data={dashboard.charts.data?.areaRequests}
          error={dashboard.charts.error}
          hasData={dashboard.hasAreaDemand}
          isError={dashboard.charts.isError}
          isLoading={dashboard.charts.isLoading}
          retry={() => void dashboard.charts.refetch()}
        />
      </div>

      <QuickStatusModal
        busy={dashboard.statusMutationBusy}
        target={dashboard.statusTarget}
        onClose={dashboard.closeStatusModal}
        onStatusChange={dashboard.updateTargetStatus}
        onSubmit={dashboard.submitStatus}
      />
    </>
  );
}

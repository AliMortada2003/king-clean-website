import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ServicePerformanceDto } from "../../../../types/api";
import {
  axisTickStyle,
  dashboardChartGridStroke,
  DashboardChartTooltip,
} from "../utils/dashboardChartStyles";
import { DashboardPanel } from "./DashboardPanel";
import {
  DashboardEmptyState,
  DashboardErrorState,
  DashboardLoadingRows,
} from "./DashboardStates";

type ServicesPerformanceChartProps = {
  data?: ServicePerformanceDto[];
  hasData: boolean;
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  retry: () => void;
};

export function ServicesPerformanceChart({
  data,
  hasData,
  isLoading,
  isError,
  error,
  retry,
}: ServicesPerformanceChartProps) {
  return (
    <DashboardPanel
      title="أداء الخدمات"
      subtitle="الخدمات الأكثر طلبًا"
      bodyClassName="min-h-[320px]"
    >
      {isLoading ? (
        <DashboardLoadingRows />
      ) : isError ? (
        <DashboardErrorState error={error} retry={retry} compact />
      ) : hasData ? (
        <div className="h-[280px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 6, right: 4, bottom: 4, left: 8 }}
            >
              <CartesianGrid
                horizontal={false}
                stroke={dashboardChartGridStroke}
                strokeDasharray="4 5"
              />
              <XAxis allowDecimals={false} hide type="number" />
              <YAxis
                axisLine={false}
                dataKey="service"
                orientation="right"
                tick={axisTickStyle}
                tickLine={false}
                type="category"
                width={92}
              />
              <Tooltip content={<DashboardChartTooltip />} />
              <Bar
                barSize={15}
                dataKey="requests"
                fill="var(--color-navy-soft)"
                name="الطلبات"
                radius={[8, 8, 8, 8]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <DashboardEmptyState
          title="لا توجد طلبات موزعة على الخدمات"
          description="ستظهر مؤشرات الأداء بعد تسجيل الطلبات."
          compact
        />
      )}
    </DashboardPanel>
  );
}

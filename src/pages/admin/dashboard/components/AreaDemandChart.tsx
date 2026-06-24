import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { AreaRequestsDto } from "../../../../types/api";
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

type AreaDemandChartProps = {
  data?: AreaRequestsDto[];
  hasData: boolean;
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  retry: () => void;
};

export function AreaDemandChart({
  data,
  hasData,
  isLoading,
  isError,
  error,
  retry,
}: AreaDemandChartProps) {
  return (
    <DashboardPanel
      title="الطلبات حسب المنطقة"
      subtitle="أكثر المناطق نشاطًا"
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
                dataKey="area"
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
                fill="var(--color-gold)"
                name="الطلبات"
                radius={[8, 8, 8, 8]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <DashboardEmptyState
          title="لا توجد طلبات موزعة على المناطق"
          description="ستظهر المناطق الأكثر نشاطًا بعد وصول بيانات كافية."
          compact
        />
      )}
    </DashboardPanel>
  );
}

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { RequestsTrendPointDto } from "../../../../types/api";
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

type RequestsTrendChartProps = {
  days: number;
  data?: RequestsTrendPointDto[];
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  retry: () => void;
  isEmpty: boolean;
};

export function RequestsTrendChart({
  days,
  data,
  isLoading,
  isError,
  error,
  retry,
  isEmpty,
}: RequestsTrendChartProps) {
  return (
    <DashboardPanel
      className="xl:col-span-7"
      title="اتجاه الطلبات"
      subtitle={`حركة الطلبات خلال آخر ${days} يومًا`}
      bodyClassName="min-h-[350px]"
    >
      {isLoading ? (
        <DashboardLoadingRows rows={3} />
      ) : isError ? (
        <DashboardErrorState error={error} retry={retry} compact />
      ) : isEmpty ? (
        <DashboardEmptyState
          title="لا توجد طلبات في هذه الفترة"
          description="غيّر الفترة الزمنية أو انتظر وصول طلبات جديدة."
          compact
        />
      ) : (
        <div className="h-[310px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
            >
              <defs>
                <linearGradient
                  id="dashboard-trend-fill"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-teal)"
                    stopOpacity={0.26}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-teal)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke={dashboardChartGridStroke}
                strokeDasharray="4 5"
                vertical={false}
              />

              <XAxis
                axisLine={false}
                dataKey="label"
                interval="preserveStartEnd"
                minTickGap={18}
                tick={axisTickStyle}
                tickLine={false}
              />

              <YAxis
                allowDecimals={false}
                axisLine={false}
                tick={axisTickStyle}
                tickLine={false}
                width={34}
              />

              <Tooltip content={<DashboardChartTooltip />} />

              <Area
                activeDot={{ r: 5, strokeWidth: 0 }}
                dataKey="requests"
                fill="url(#dashboard-trend-fill)"
                name="الطلبات"
                stroke="var(--color-teal)"
                strokeWidth={3}
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </DashboardPanel>
  );
}

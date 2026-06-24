import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type { RequestStatus } from "../../../../types/api";
import { numberFormatter } from "../../../../lib/format";
import { DashboardChartTooltip } from "../utils/dashboardChartStyles";
import {
  dashboardStatusColors,
  dashboardStatusLabels,
} from "../utils/dashboardConstants";
import { DashboardPanel } from "./DashboardPanel";
import {
  DashboardEmptyState,
  DashboardErrorState,
  DashboardLoadingRows,
} from "./DashboardStates";

export type NormalizedStatusMetric = {
  name: RequestStatus;
  label: string;
  value: number;
};

type RequestsStatusDonutProps = {
  data: NormalizedStatusMetric[];
  total: number;
  isConsistent: boolean;
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  retry: () => void;
};

export function RequestsStatusDonut({
  data,
  total,
  isConsistent,
  isLoading,
  isError,
  error,
  retry,
}: RequestsStatusDonutProps) {
  return (
    <DashboardPanel
      className="xl:col-span-5"
      title="الطلبات حسب الحالة"
      subtitle="توزيع حالات الطلبات الحالية"
      bodyClassName="min-h-[350px]"
    >
      {isLoading ? (
        <DashboardLoadingRows rows={3} />
      ) : isError ? (
        <DashboardErrorState error={error} retry={retry} compact />
      ) : !isConsistent ? (
        <DashboardEmptyState
          title="جاري مزامنة بيانات الحالات"
          description="سيتم تحديث الرسم تلقائيًا بعد اكتمال البيانات."
          compact
        />
      ) : total === 0 ? (
        <DashboardEmptyState
          title="لا توجد بيانات للحالات"
          description="ستظهر النسب هنا بعد تسجيل الطلبات."
          compact
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1fr_210px] lg:items-center">
          <div className="h-[230px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  innerRadius={58}
                  nameKey="label"
                  outerRadius={88}
                  paddingAngle={3}
                >
                  {data.map((item) => (
                    <Cell
                      fill={dashboardStatusColors[item.name]}
                      key={item.name}
                    />
                  ))}
                </Pie>

                <Tooltip content={<DashboardChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid gap-2 text-sm">
            {data.map((item) => {
              const percent = total ? Math.round((item.value / total) * 100) : 0;

              return (
                <div
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-3 py-2"
                  key={item.name}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: dashboardStatusColors[item.name] }}
                  />

                  <span className="font-bold text-[var(--color-muted)]">
                    {dashboardStatusLabels[item.name]}
                  </span>

                  <strong className="text-[var(--color-text)]">
                    {numberFormatter.format(item.value)} ({percent}%)
                  </strong>
                </div>
              );
            })}

            <div className="mt-2 flex items-center justify-between border-t border-[var(--color-border)] pt-3 text-sm">
              <span className="font-black text-[var(--color-muted)]">
                الإجمالي
              </span>
              <strong className="text-[var(--color-text)]">
                {numberFormatter.format(total)}
              </strong>
            </div>
          </div>
        </div>
      )}
    </DashboardPanel>
  );
}

import type { CSSProperties } from "react";

import type { RequestStatus } from "../../../../types/api";
import {
  dashboardStatusColors,
  dashboardStatusLabels,
} from "../utils/dashboardConstants";

export function DashboardStatusBadge({
  status,
  compact = false,
}: {
  status: RequestStatus;
  compact?: boolean;
}) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border border-[color-mix(in_srgb,var(--dashboard-status)_24%,transparent)] bg-[color-mix(in_srgb,var(--dashboard-status)_12%,transparent)] font-black text-[var(--dashboard-status)]",
        compact ? "gap-1 px-2 py-1 text-[10px]" : "gap-2 px-3 py-1 text-xs",
      ].join(" ")}
      style={
        {
          "--dashboard-status": dashboardStatusColors[status],
        } as CSSProperties
      }
    >
      <span className="h-2 w-2 rounded-full bg-[var(--dashboard-status)]" />
      {dashboardStatusLabels[status]}
    </span>
  );
}

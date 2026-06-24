import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

import type {
  AdminServiceRequestListItemDto,
  RequestStatus,
} from "../../../../types/api";
import { DashboardPanel } from "./DashboardPanel";
import {
  DashboardEmptyState,
  DashboardErrorState,
  DashboardLoadingRows,
} from "./DashboardStates";
import { LatestRequestMobileCard } from "./LatestRequestMobileCard";
import { LatestRequestsTable } from "./LatestRequestsTable";

type LatestRequestsPanelProps = {
  items?: AdminServiceRequestListItemDto[];
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  retry: () => void;
  onStatusClick: (id: number, status: RequestStatus) => void;
};

export function LatestRequestsPanel({
  items,
  isLoading,
  isError,
  error,
  retry,
  onStatusClick,
}: LatestRequestsPanelProps) {
  return (
    <DashboardPanel
      title="أحدث طلبات الخدمة"
      subtitle="آخر الطلبات المسجلة على الموقع"
      action={
        <Link
          className="inline-flex min-h-10 w-fit items-center gap-2 rounded-xl bg-[color-mix(in_srgb,var(--color-gold)_12%,transparent)] px-4 text-sm font-black text-[var(--color-gold-dark)] transition hover:bg-[color-mix(in_srgb,var(--color-gold)_18%,transparent)] dark:text-[var(--color-gold)]"
          to="/admin/requests"
        >
          عرض جميع الطلبات
          <ChevronLeft size={17} />
        </Link>
      }
      bodyClassName="p-0"
    >
      {isLoading ? (
        <div className="p-5">
          <DashboardLoadingRows />
        </div>
      ) : isError ? (
        <div className="p-5">
          <DashboardErrorState error={error} retry={retry} compact />
        </div>
      ) : items?.length ? (
        <>
          <LatestRequestsTable items={items} onStatusClick={onStatusClick} />

          <div className="grid gap-3 p-4 lg:hidden">
            {items.map((item) => (
              <LatestRequestMobileCard
                item={item}
                key={item.id}
                onStatusClick={onStatusClick}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="p-5">
          <DashboardEmptyState
            title="لا توجد طلبات بعد"
            description="ستظهر أحدث الطلبات هنا بمجرد وصولها."
            compact
          />
        </div>
      )}
    </DashboardPanel>
  );
}

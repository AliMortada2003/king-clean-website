import { CalendarClock, Phone, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

import type {
  AdminServiceRequestListItemDto,
  RequestStatus,
} from "../../../../types/api";
import { formatDate } from "../../../../lib/format";
import { emptyDateLabel } from "../utils/dashboardConstants";
import { DashboardStatusBadge } from "./DashboardStatusBadge";

type LatestRequestMobileCardProps = {
  item: AdminServiceRequestListItemDto;
  onStatusClick: (id: number, status: RequestStatus) => void;
};

export function LatestRequestMobileCard({
  item,
  onStatusClick,
}: LatestRequestMobileCardProps) {
  return (
    <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-black text-[var(--color-gold-dark)] dark:text-[var(--color-gold)]">
            طلب #{item.id}
          </span>
          <h3 className="mt-1 flex items-center gap-2 text-base font-black text-[var(--color-text)]">
            <UserRound size={16} />
            {item.name || "بدون اسم"}
          </h3>
        </div>

        <DashboardStatusBadge status={item.status} />
      </div>

      <div className="grid gap-3 text-sm">
        <p className="m-0 flex items-center gap-2 font-black text-[var(--color-text)]" dir="ltr">
          <Phone size={15} />
          {item.phone}
        </p>

        <div className="grid grid-cols-2 gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
          <span className="text-[var(--color-muted)]">الخدمة</span>
          <strong className="text-[var(--color-text)]">{item.serviceName}</strong>
          <span className="text-[var(--color-muted)]">المنطقة</span>
          <strong className="text-[var(--color-text)]">{item.areaName}</strong>
        </div>

        <div className="grid gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
          <span className="flex items-center gap-2 text-[var(--color-muted)]">
            <CalendarClock size={15} />
            تاريخ الإنشاء: {formatDate(item.createdAt, true)}
          </span>
          <span className="flex items-center gap-2 text-[var(--color-muted)]">
            <CalendarClock size={15} />
            الموعد: {item.scheduledAt ? formatDate(item.scheduledAt, true) : emptyDateLabel}
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm font-black text-[var(--color-text)] transition hover:border-[var(--color-gold)] hover:text-[var(--color-gold-dark)]"
          to={`/admin/requests/${item.id}`}
        >
          التفاصيل
        </Link>

        <button
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--color-teal)_12%,transparent)] px-3 text-sm font-black text-[var(--color-teal)] transition hover:bg-[color-mix(in_srgb,var(--color-teal)_18%,transparent)]"
          type="button"
          onClick={() => onStatusClick(item.id, item.status)}
        >
          تحديث الحالة
        </button>
      </div>
    </article>
  );
}

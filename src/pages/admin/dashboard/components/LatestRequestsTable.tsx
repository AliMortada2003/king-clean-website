import { Link } from "react-router-dom";

import type {
  AdminServiceRequestListItemDto,
  RequestStatus,
} from "../../../../types/api";
import { emptyDateLabel } from "../utils/dashboardConstants";
import { DashboardStatusBadge } from "./DashboardStatusBadge";

type LatestRequestsTableProps = {
  items: AdminServiceRequestListItemDto[];
  onStatusClick: (id: number, status: RequestStatus) => void;
};

const compactDateFormatter = new Intl.DateTimeFormat("ar-KW", {
  timeZone: "Asia/Kuwait",
  day: "2-digit",
  month: "2-digit",
});

function formatCompactDate(value?: string | null) {
  if (!value) return emptyDateLabel;

  const normalized = /(?:z|[+-]\d{2}:?\d{2})$/i.test(value)
    ? value
    : `${value}Z`;
  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) return emptyDateLabel;

  return compactDateFormatter.format(date);
}

export function LatestRequestsTable({
  items,
  onStatusClick,
}: LatestRequestsTableProps) {
  return (
    <div className="hidden lg:block">
      <table className="w-full table-fixed text-right text-xs">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-soft)] text-xs font-black text-[var(--color-muted)]">
            <th className="px-3 py-4">الطلب</th>
            <th className="px-3 py-4">التواصل</th>
            <th className="px-3 py-4">الخدمة والمنطقة</th>
            <th className="px-3 py-4">الحالة</th>
            <th className="px-3 py-4">التواريخ</th>
            <th className="px-3 py-4">الإجراءات</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[var(--color-border)]">
          {items.map((item) => (
            <tr
              className="transition hover:bg-[var(--color-surface-soft)]"
              key={item.id}
            >
              <td className="px-3 py-4">
                <strong className="block font-black text-[var(--color-gold-dark)] dark:text-[var(--color-gold)]">
                  #{item.id}
                </strong>
                <span className="mt-1 block font-black text-[var(--color-text)]">
                  {item.name || "بدون اسم"}
                </span>
              </td>
              <td className="break-words px-3 py-4 text-[var(--color-muted)]" dir="ltr">
                {item.phone}
              </td>
              <td className="px-3 py-4">
                <span className="block font-bold text-[var(--color-text)]">
                  {item.serviceName}
                </span>
                <span className="mt-1 block text-[var(--color-muted)]">
                  {item.areaName}
                </span>
              </td>
              <td className="px-3 py-4">
                <DashboardStatusBadge status={item.status} compact />
              </td>
              <td className="px-3 py-4 text-[var(--color-muted)]">
                <span className="block">إنشاء: {formatCompactDate(item.createdAt)}</span>
                <span className="mt-1 block">موعد: {formatCompactDate(item.scheduledAt)}</span>
              </td>
              <td className="px-3 py-4">
                <div className="grid gap-2">
                  <Link
                    className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-center text-[11px] font-black text-[var(--color-text)] transition hover:border-[var(--color-gold)] hover:text-[var(--color-gold-dark)]"
                    to={`/admin/requests/${item.id}`}
                  >
                    التفاصيل
                  </Link>

                  <button
                    className="rounded-xl bg-[color-mix(in_srgb,var(--color-teal)_12%,transparent)] px-3 py-2 text-[11px] font-black text-[var(--color-teal)] transition hover:bg-[color-mix(in_srgb,var(--color-teal)_18%,transparent)]"
                    type="button"
                    onClick={() => onStatusClick(item.id, item.status)}
                  >
                    الحالة
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

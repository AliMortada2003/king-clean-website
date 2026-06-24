import type {
  AdminServiceRequestListItemDto,
  RequestStatus,
} from "../../../../types/api";
import { formatDate } from "../../../../lib/format";
import {
  AccountBadge,
  ReplyBadge,
  RequestStatusBadge,
} from "./requestsUi";
import { RequestActions } from "./RequestActions";

type RequestsTableProps = {
  items: AdminServiceRequestListItemDto[];
  onStatusClick: (id: number, status: RequestStatus) => void;
};

export function RequestsTable({ items, onStatusClick }: RequestsTableProps) {
  return (
    <div className="hidden overflow-x-auto lg:block">
      <table className="w-full min-w-[1120px] text-right text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-soft)] text-xs font-black text-[var(--color-muted)]">
            <th className="px-4 py-4">رقم الطلب</th>
            <th className="px-4 py-4">العميل</th>
            <th className="px-4 py-4">الهاتف</th>
            <th className="px-4 py-4">الحساب</th>
            <th className="px-4 py-4">الخدمة</th>
            <th className="px-4 py-4">المنطقة</th>
            <th className="px-4 py-4">الحالة</th>
            <th className="px-4 py-4">الرد</th>
            <th className="px-4 py-4">الإنشاء</th>
            <th className="px-4 py-4">الموعد</th>
            <th className="px-4 py-4">الإجراءات</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[var(--color-border)]">
          {items.map((item) => (
            <tr
              className="transition hover:bg-[var(--color-surface-soft)]"
              key={item.id}
            >
              <td className="px-4 py-4 font-black text-[var(--color-gold-dark)] dark:text-[var(--color-gold)]">
                #{item.id}
              </td>
              <td className="px-4 py-4 font-bold text-[var(--color-text)]">
                {item.name || "بدون اسم"}
              </td>
              <td className="px-4 py-4 text-[var(--color-muted)]" dir="ltr">
                {item.phone}
              </td>
              <td className="px-4 py-4">
                <div className="grid gap-1">
                  <AccountBadge clientEmail={item.clientEmail} />
                  {item.clientEmail && (
                    <span
                      className="break-all text-xs font-bold text-[var(--color-muted)]"
                      dir="ltr"
                    >
                      {item.clientEmail}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-4 text-[var(--color-muted)]">
                {item.serviceName}
              </td>
              <td className="px-4 py-4 text-[var(--color-muted)]">
                {item.areaName}
              </td>
              <td className="px-4 py-4">
                <RequestStatusBadge status={item.status} />
              </td>
              <td className="px-4 py-4">
                <ReplyBadge isReplied={item.isReplied} />
              </td>
              <td className="px-4 py-4 text-[var(--color-muted)]">
                {formatDate(item.createdAt)}
              </td>
              <td className="px-4 py-4 text-[var(--color-muted)]">
                {formatDate(item.scheduledAt)}
              </td>
              <td className="px-4 py-4">
                <RequestActions
                  id={item.id}
                  status={item.status}
                  onStatusClick={onStatusClick}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

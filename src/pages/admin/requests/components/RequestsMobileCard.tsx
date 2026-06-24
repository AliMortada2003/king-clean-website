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

type RequestsMobileCardProps = {
  item: AdminServiceRequestListItemDto;
  onStatusClick: (id: number, status: RequestStatus) => void;
};

export function RequestsMobileCard({
  item,
  onStatusClick,
}: RequestsMobileCardProps) {
  return (
    <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <strong className="text-[var(--color-text)]">
          #{item.id} · {item.name || "بدون اسم"}
        </strong>
        <RequestStatusBadge status={item.status} />
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        <AccountBadge clientEmail={item.clientEmail} />
        <ReplyBadge isReplied={item.isReplied} />
      </div>

      {item.clientEmail && (
        <p className="my-2 break-all text-sm font-bold text-[var(--color-muted)]" dir="ltr">
          {item.clientEmail}
        </p>
      )}

      <p className="my-2 text-sm font-bold text-[var(--color-muted)]">
        {item.serviceName} · {item.areaName}
      </p>

      <a
        className="block font-black text-[var(--color-text)]"
        href={`tel:${item.phone}`}
        dir="ltr"
      >
        {item.phone}
      </a>

      <div className="mt-2 text-sm font-bold text-[var(--color-muted)]">
        {formatDate(item.createdAt)}
      </div>

      <div className="mt-4">
        <RequestActions
          id={item.id}
          status={item.status}
          onStatusClick={onStatusClick}
        />
      </div>
    </article>
  );
}

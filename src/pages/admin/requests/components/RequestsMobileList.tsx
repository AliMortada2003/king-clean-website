import type {
  AdminServiceRequestListItemDto,
  RequestStatus,
} from "../../../../types/api";
import { RequestsMobileCard } from "./RequestsMobileCard";

type RequestsMobileListProps = {
  items: AdminServiceRequestListItemDto[];
  onStatusClick: (id: number, status: RequestStatus) => void;
};

export function RequestsMobileList({
  items,
  onStatusClick,
}: RequestsMobileListProps) {
  return (
    <div className="grid gap-3 p-4 lg:hidden">
      {items.map((item) => (
        <RequestsMobileCard
          item={item}
          key={item.id}
          onStatusClick={onStatusClick}
        />
      ))}
    </div>
  );
}

import type {
  AdminServiceRequestListItemDto,
  RequestStatus,
} from "../../../types/api";

export type RequestStatusTarget = {
  id: number;
  status: RequestStatus;
};

export type RequestFilterKey =
  | "status"
  | "serviceId"
  | "areaId"
  | "from"
  | "to";

export type RequestListItem = AdminServiceRequestListItemDto;

export type RequestDetailFormValues = {
  name: string;
  phone: string;
  serviceId: number;
  areaId: number;
  notes: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  scheduledAt: string;
  finalPrice: number | null;
  internalNotes: string;
};

export type RequestReplyFormValues = {
  message: string;
};

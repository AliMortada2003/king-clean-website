import type {
  AdminServiceRequestQueryDto,
  RequestStatus,
} from "../../../../types/api";

export const requestStatusLabels: Record<RequestStatus, string> = {
  New: "جديد",
  Contacted: "تم التواصل",
  Scheduled: "مجدول",
  InProgress: "قيد التنفيذ",
  Completed: "مكتمل",
  Cancelled: "ملغي",
};

export const requestStatusColors: Record<RequestStatus, string> = {
  New: "#2563eb",
  Contacted: "#0891b2",
  Scheduled: "#d39a22",
  InProgress: "#7c3aed",
  Completed: "#16835f",
  Cancelled: "#dc2626",
};

export function queryFromParams(
  params: URLSearchParams,
): AdminServiceRequestQueryDto {
  return {
    page: Math.max(1, Number(params.get("page")) || 1),
    pageSize: Math.min(100, Math.max(1, Number(params.get("pageSize")) || 20)),
    status: (params.get("status") as RequestStatus) || "",
    serviceId: Number(params.get("serviceId")) || undefined,
    areaId: Number(params.get("areaId")) || undefined,
    search: params.get("search") || undefined,
    from: params.get("from") || undefined,
    to: params.get("to") || undefined,
  };
}

import type { RequestStatus } from "../types/api";

export const requestStatuses: RequestStatus[] = [
  "New",
  "Contacted",
  "Scheduled",
  "InProgress",
  "Completed",
  "Cancelled",
];
export const statusLabels: Record<RequestStatus, string> = {
  New: "جديد",
  Contacted: "تم التواصل",
  Scheduled: "مجدول",
  InProgress: "قيد التنفيذ",
  Completed: "مكتمل",
  Cancelled: "ملغي",
};
export const statusColors: Record<RequestStatus, string> = {
  New: "#2563eb",
  Contacted: "#0891b2",
  Scheduled: "#d39a22",
  InProgress: "#7c3aed",
  Completed: "#16835f",
  Cancelled: "#dc2626",
};
export function isRequestStatus(value: string): value is RequestStatus {
  return requestStatuses.includes(value as RequestStatus);
}

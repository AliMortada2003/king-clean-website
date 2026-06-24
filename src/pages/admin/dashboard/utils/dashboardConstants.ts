import type { RequestStatus } from "../../../../types/api";

export const dashboardPeriods = [7, 30, 90] as const;

export type DashboardPeriod = (typeof dashboardPeriods)[number];

export const dashboardStatusLabels: Record<RequestStatus, string> = {
  New: "جديد",
  Contacted: "تم التواصل",
  Scheduled: "مجدول",
  InProgress: "قيد التنفيذ",
  Completed: "مكتمل",
  Cancelled: "ملغي",
};

export const dashboardStatusColors: Record<RequestStatus, string> = {
  New: "#2f6be6",
  Contacted: "#0e9ca6",
  Scheduled: "#d39a22",
  InProgress: "#7350b9",
  Completed: "#5a9648",
  Cancelled: "#ef3f4a",
};

export const emptyDateLabel = "غير محدد";

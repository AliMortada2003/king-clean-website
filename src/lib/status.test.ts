import { describe, expect, it } from "vitest";
import { requestStatuses, statusLabels } from "./status";

describe("request status mapping", () => {
  it("maps every backend enum value to the approved Arabic label", () => {
    expect(requestStatuses).toEqual([
      "New",
      "Contacted",
      "Scheduled",
      "InProgress",
      "Completed",
      "Cancelled",
    ]);
    expect(statusLabels).toEqual({
      New: "جديد",
      Contacted: "تم التواصل",
      Scheduled: "مجدول",
      InProgress: "قيد التنفيذ",
      Completed: "مكتمل",
      Cancelled: "ملغي",
    });
  });
});

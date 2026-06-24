import { describe, expect, it } from "vitest";
import { fromKuwaitDateTimeLocal, toDateTimeLocal } from "./format";

describe("Kuwait datetime helpers", () => {
  it("treats API datetimes without an offset as UTC before displaying Kuwait time", () => {
    expect(toDateTimeLocal("2026-06-20T07:00:00")).toBe("2026-06-20T10:00");
  });

  it("serializes Kuwait datetime-local values to UTC ISO strings", () => {
    expect(fromKuwaitDateTimeLocal("2026-06-20T10:00")).toBe(
      "2026-06-20T07:00:00.000Z",
    );
  });
});

import { describe, expect, it } from "vitest";
import { ORDER_STATUSES, toneForStatus } from "./order-status";

describe("order statuses", () => {
  it("lists the 13 internal statuses from brief §4, each once", () => {
    expect(ORDER_STATUSES).toHaveLength(13);
    expect(new Set(ORDER_STATUSES).size).toBe(13);
  });

  it("gives every status a tone", () => {
    for (const status of ORDER_STATUSES) {
      expect(["attention", "progress", "success", "problem"]).toContain(toneForStatus(status));
    }
  });

  it("flags statuses that need action, delivered ones, and failed ones", () => {
    expect(toneForStatus("NEW")).toBe("attention");
    expect(toneForStatus("DELIVERED")).toBe("success");
    expect(toneForStatus("RETURNED")).toBe("problem");
  });
});

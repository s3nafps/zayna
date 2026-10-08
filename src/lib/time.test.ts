import { describe, expect, it } from "vitest";
import { localDateKey, localStartOfDay } from "./time";

describe("Africa/Algiers day boundaries", () => {
  // 23:30 UTC on 7 October is 00:30 on 8 October in Algiers (UTC+1).
  const lateUtc = new Date("2026-10-07T23:30:00Z");

  it("uses the local calendar day, not the UTC day", () => {
    expect(localDateKey(lateUtc)).toBe("2026-10-08");
  });

  it("starts the local day at local midnight", () => {
    expect(localStartOfDay(lateUtc).toISOString()).toBe("2026-10-07T23:00:00.000Z");
  });

  it("shifts by whole local days", () => {
    expect(localStartOfDay(lateUtc, -6).toISOString()).toBe("2026-10-01T23:00:00.000Z");
  });

  it("keeps the same local day across the whole local day", () => {
    expect(localDateKey(new Date("2026-10-08T22:59:59Z"))).toBe("2026-10-08");
    expect(localStartOfDay(new Date("2026-10-08T22:59:59Z")).toISOString()).toBe("2026-10-07T23:00:00.000Z");
  });
});

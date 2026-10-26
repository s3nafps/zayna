import { describe, expect, it } from "vitest";
import { formatWilayaLabel } from "./wilaya";

describe("formatWilayaLabel", () => {
  it("formats as code, French name and Arabic name (brief §5)", () => {
    expect(formatWilayaLabel({ code: "16", nameFr: "Alger", nameAr: "الجزائر" })).toBe(
      "16 - Alger / الجزائر",
    );
  });
});

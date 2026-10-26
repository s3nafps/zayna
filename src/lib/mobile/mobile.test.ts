import { describe, expect, it } from "vitest";
import { resolveAdminAppUrl } from "./app-config";
import { decideBackAction } from "./back-button";

describe("resolveAdminAppUrl", () => {
  it("keeps only the origin and points at /admin", () => {
    expect(resolveAdminAppUrl("https://zayna.example.dz/some/path?x=1")).toEqual({
      ok: true,
      adminUrl: "https://zayna.example.dz/admin",
      allowedHost: "zayna.example.dz",
    });
  });

  it("reports a missing value", () => {
    expect(resolveAdminAppUrl(undefined)).toEqual({ ok: false, reason: "missing" });
    expect(resolveAdminAppUrl("   ")).toEqual({ ok: false, reason: "missing" });
  });

  it("refuses plain HTTP", () => {
    expect(resolveAdminAppUrl("http://zayna.example.dz")).toEqual({ ok: false, reason: "not-https" });
  });

  it("refuses something that is not a URL", () => {
    expect(resolveAdminAppUrl("zayna")).toEqual({ ok: false, reason: "invalid" });
  });
});

describe("decideBackAction", () => {
  it("goes back while there is history", () => {
    expect(decideBackAction(3)).toBe("back");
  });

  it("leaves the app when there is nowhere to go back to", () => {
    expect(decideBackAction(1)).toBe("exit");
  });
});

// Resolves the back-office URL the Android app opens. Pure, so it can be tested without a device.
// The app only talks to HTTPS. Plain HTTP would leak owner credentials on the network.
export type AdminAppConfig =
  | { ok: true; adminUrl: string; allowedHost: string }
  | { ok: false; reason: "missing" | "not-https" | "invalid" };

export function resolveAdminAppUrl(appUrl: string | undefined): AdminAppConfig {
  const value = appUrl?.trim();
  if (!value) {
    return { ok: false, reason: "missing" };
  }
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return { ok: false, reason: "invalid" };
  }
  if (parsed.protocol !== "https:") {
    return { ok: false, reason: "not-https" };
  }
  return {
    ok: true,
    adminUrl: `${parsed.origin}/admin`,
    allowedHost: parsed.host,
  };
}

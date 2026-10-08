import type { CapacitorConfig } from "@capacitor/cli";

// APP_URL is the back-office origin. The bundled loader in www/ opens <origin>/admin.
// Only that host may load inside the app. Anything else opens in the system browser.
function allowedHostFrom(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" ? url.host : undefined;
  } catch {
    return undefined;
  }
}

const allowedHost = allowedHostFrom(process.env.APP_URL);

const config: CapacitorConfig = {
  appId: "dz.zayna.admin",
  appName: "Zayna",
  webDir: "www",
  server: {
    androidScheme: "https",
    cleartext: false,
    allowNavigation: allowedHost ? [allowedHost] : [],
  },
  android: {
    allowMixedContent: false,
    webContentsDebuggingEnabled: false,
  },
};

export default config;

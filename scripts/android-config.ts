// Writes www/app-config.js from APP_URL, so the bundled loader knows which back-office to open.
// Run before `cap sync android`. Exits with an error if APP_URL is missing or not HTTPS.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolveAdminAppUrl } from "../src/lib/mobile/app-config";

const result = resolveAdminAppUrl(process.env.APP_URL);
const target = fileURLToPath(new URL("../www/app-config.js", import.meta.url));

if (!result.ok) {
  // Still write a file, so the loader can show its "not configured" message. The build fails loudly
  // only when a release is requested with ZAYNA_ANDROID_RELEASE=1.
  writeFileSync(target, "window.ZAYNA_ADMIN_URL = null;\n");
  console.error(`android: APP_URL is ${result.reason}. The app will show a configuration message.`);
  if (process.env.ZAYNA_ANDROID_RELEASE === "1") {
    process.exitCode = 1;
  }
} else {
  writeFileSync(target, `window.ZAYNA_ADMIN_URL = ${JSON.stringify(result.adminUrl)};\n`);
  console.log(`android: app will open ${result.adminUrl}`);
}

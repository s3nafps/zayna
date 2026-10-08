"use client";

import { useEffect } from "react";
import { decideBackAction } from "@/lib/mobile/back-button";

type CapacitorGlobal = { isNativePlatform?: () => boolean };

// On Android, the hardware back button goes back in the app, or closes it on the first page.
// The Capacitor plugin loads only inside the native app, so the web build never imports it.
export function NativeBackButton() {
  useEffect(() => {
    const capacitor = (window as unknown as { Capacitor?: CapacitorGlobal }).Capacitor;
    if (!capacitor?.isNativePlatform?.()) {
      return;
    }
    let removeListener: (() => void) | undefined;
    let cancelled = false;
    void import("@capacitor/app").then(({ App }) =>
      App.addListener("backButton", () => {
        if (decideBackAction(window.history.length) === "back") {
          window.history.back();
        } else {
          void App.exitApp();
        }
      }).then((handle) => {
        if (cancelled) {
          void handle.remove();
        } else {
          removeListener = () => void handle.remove();
        }
      }),
    );
    return () => {
      cancelled = true;
      removeListener?.();
    };
  }, []);
  return null;
}

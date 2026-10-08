import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ORDER_STATUSES } from "@/lib/order-status";

type Messages = Record<string, unknown>;

function load(locale: "fr" | "ar" | "en"): Messages {
  return JSON.parse(
    readFileSync(new URL(`../../messages/${locale}.json`, import.meta.url), "utf8"),
  ) as Messages;
}

// Flattens nested objects into dotted keys, so the three locales can be compared key by key.
function flatten(value: unknown, prefix = ""): string[] {
  if (value === null || typeof value !== "object") {
    return [prefix];
  }
  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
    flatten(child, prefix ? `${prefix}.${key}` : key),
  );
}

describe("translation files", () => {
  const fr = flatten(load("fr")).sort();
  const ar = flatten(load("ar")).sort();
  const en = flatten(load("en")).sort();

  it("have the same keys in French, Arabic and English", () => {
    expect(ar).toEqual(fr);
    expect(en).toEqual(fr);
  });

  it("have a label for every order status in every locale", () => {
    for (const locale of ["fr", "ar", "en"] as const) {
      const status = (load(locale).status ?? {}) as Record<string, string>;
      for (const key of ORDER_STATUSES) {
        expect(status[key], `${locale} status ${key}`).toBeTruthy();
      }
    }
  });
});

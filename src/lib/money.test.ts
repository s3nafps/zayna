import { describe, expect, it } from "vitest";
import { formatDzd, formatDzdParts } from "./money";

const NBSP = " ";

describe("formatDzd", () => {
  it("groups thousands with a non-breaking space and puts a non-breaking space before DA", () => {
    expect(formatDzd(4500)).toBe(`4${NBSP}500${NBSP}DA`);
  });

  it("does not group amounts under a thousand", () => {
    expect(formatDzd(0)).toBe(`0${NBSP}DA`);
    expect(formatDzd(999)).toBe(`999${NBSP}DA`);
  });

  it("groups millions", () => {
    expect(formatDzd(1_000_000)).toBe(`1${NBSP}000${NBSP}000${NBSP}DA`);
  });

  it("uses the Arabic currency suffix on Arabic screens", () => {
    expect(formatDzd(4500, { locale: "ar" })).toBe(`4${NBSP}500${NBSP}د.ج`);
  });

  it("can use Arabic-Indic digits when configured", () => {
    expect(formatDzd(4500, { locale: "ar", arabicDigits: true })).toBe(`٤${NBSP}٥٠٠${NBSP}د.ج`);
  });

  it("formats negative amounts with a leading minus", () => {
    expect(formatDzd(-1000)).toBe(`-1${NBSP}000${NBSP}DA`);
  });

  it("rejects anything that is not a safe integer, because money is never fractional", () => {
    expect(() => formatDzd(12.5)).toThrow(RangeError);
    expect(() => formatDzd(Number.NaN)).toThrow(RangeError);
    expect(() => formatDzd(Number.POSITIVE_INFINITY)).toThrow(RangeError);
  });
});

describe("formatDzdParts", () => {
  it("splits the number from the currency so the number can be isolated", () => {
    expect(formatDzdParts(4500, { locale: "ar", arabicDigits: true })).toEqual({
      digits: `٤${NBSP}٥٠٠`,
      currency: "د.ج",
    });
  });
});

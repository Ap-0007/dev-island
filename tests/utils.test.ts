import { describe, it } from "node:test";
import assert from "node:assert";
import { formatNumber } from "../lib/utils.ts";

describe("formatNumber", () => {
  it("should format numbers less than 1000", () => {
    assert.strictEqual(formatNumber(0), "0");
    assert.strictEqual(formatNumber(500), "500");
    assert.strictEqual(formatNumber(999), "999");
  });

  it("should format numbers in thousands with K", () => {
    assert.strictEqual(formatNumber(1000), "1.0K");
    assert.strictEqual(formatNumber(1500), "1.5K");
    assert.strictEqual(formatNumber(999999), "1000.0K"); // 999999 / 1000 = 999.999 => toFixed(1) = 1000.0
  });

  it("should format numbers in millions with M", () => {
    assert.strictEqual(formatNumber(1000000), "1.0M");
    assert.strictEqual(formatNumber(1500000), "1.5M");
    assert.strictEqual(formatNumber(2500000), "2.5M");
  });

  it("should handle negative numbers gracefully (assuming current implementation)", () => {
    assert.strictEqual(formatNumber(-500), "-500");
    assert.strictEqual(formatNumber(-1500), "-1500");
  });
});

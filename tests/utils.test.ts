import { test, describe } from "node:test";
import assert from "node:assert";
import { getRelativeTime } from "../lib/utils.ts";

describe("getRelativeTime", () => {
  test('returns "just now" for times less than 1 minute ago', () => {
    const now = new Date();
    // 30 seconds ago
    const thirtySecondsAgo = new Date(now.getTime() - 30 * 1000);
    assert.strictEqual(getRelativeTime(thirtySecondsAgo.toISOString()), "just now");
  });

  test("returns relative minutes string for times less than 1 hour ago", () => {
    const now = new Date();
    // 5 minutes ago
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    assert.strictEqual(getRelativeTime(fiveMinutesAgo.toISOString()), "5m ago");

    // 59 minutes ago
    const fiftyNineMinutesAgo = new Date(now.getTime() - 59 * 60 * 1000);
    assert.strictEqual(getRelativeTime(fiftyNineMinutesAgo.toISOString()), "59m ago");
  });

  test("returns relative hours string for times less than 24 hours ago", () => {
    const now = new Date();
    // 5 hours ago
    const fiveHoursAgo = new Date(now.getTime() - 5 * 60 * 60 * 1000);
    assert.strictEqual(getRelativeTime(fiveHoursAgo.toISOString()), "5h ago");

    // 23 hours ago
    const twentyThreeHoursAgo = new Date(now.getTime() - 23 * 60 * 60 * 1000);
    assert.strictEqual(getRelativeTime(twentyThreeHoursAgo.toISOString()), "23h ago");
  });

  test("returns relative days string for times less than 30 days ago", () => {
    const now = new Date();
    // 5 days ago
    const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
    assert.strictEqual(getRelativeTime(fiveDaysAgo.toISOString()), "5d ago");

    // 29 days ago
    const twentyNineDaysAgo = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000);
    assert.strictEqual(getRelativeTime(twentyNineDaysAgo.toISOString()), "29d ago");
  });

  test("returns localized date string for times 30 or more days ago", () => {
    const now = new Date();
    // 40 days ago
    const fortyDaysAgo = new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000);
    assert.strictEqual(getRelativeTime(fortyDaysAgo.toISOString()), fortyDaysAgo.toLocaleDateString());
  });
});

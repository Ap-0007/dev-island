import { test, describe } from "node:test";
import assert from "node:assert";
import { generateIslandGrid, THEMES } from "../lib/island-engine.ts";

describe("island-engine", () => {
  describe("generateIslandGrid", () => {
    test("generates a grid with default parameters", () => {
      const activity = new Array(30).fill(1); // 30 days of 1 commit
      const grid = generateIslandGrid(activity);

      assert.strictEqual(grid.rows, 4);
      assert.strictEqual(grid.cols, 10);
      assert.strictEqual(grid.theme, "tropical");
      assert.strictEqual(grid.tiles.length, 4);
      assert.strictEqual(grid.tiles[0].length, 10);
    });

    test("handles an empty activity array gracefully", () => {
      const activity: number[] = [];
      const grid = generateIslandGrid(activity);

      assert.strictEqual(grid.rows, 4);
      assert.strictEqual(grid.cols, 10);
      assert.strictEqual(grid.theme, "tropical");

      // With empty array, all columns should have 0 intensity
      const centerRow = 1;
      const centerCol = 4;
      // Due to how the algorithm works, center tiles with 0 activity become water
      // unless they hit the specific sand mask threshold. We just verify the grid is valid.
      assert.ok(grid.tiles[centerRow][centerCol]);
    });

    test("condenses 30 days of activity into 10 columns correctly", () => {
      // 30 days: Middle 3 days (12, 13, 14) have 30 commits total (avg 10), rest have 0
      const activity = new Array(30).fill(0);
      activity[12] = 10;
      activity[13] = 10;
      activity[14] = 10;

      const grid = generateIslandGrid(activity);

      // The center column (c=4) should reflect the average of the days 12-14 (10)
      const centerRow = 1;
      const centerCol = 4;

      // The mask value at the center is high, so the tile should be populated
      // With avg=10, type should be "tree", "forest", or "structure" depending on scaling.
      assert.ok(["tree", "forest", "structure"].includes(grid.tiles[centerRow][centerCol].type), `Tile type for center column shouldn't be empty land`);

      // Directly check the commits count on the tile
      assert.strictEqual(grid.tiles[centerRow][centerCol].commits, 10);
      assert.strictEqual(grid.tiles[centerRow][centerCol - 1].commits, 0);
    });

    test("assigns hot streak correctly to the tile with max commits >= 5", () => {
      const activity = new Array(30).fill(0);
      // Day 15 (col 5) has high commits
      activity[15] = 20;

      const grid = generateIslandGrid(activity);

      let hotStreakCount = 0;
      for (let r = 0; r < grid.rows; r++) {
        for (let c = 0; c < grid.cols; c++) {
          if (grid.tiles[r][c].isHotStreak) {
            hotStreakCount++;
            // This column corresponds to c=5
            assert.strictEqual(c, 5);
          }
        }
      }

      assert.strictEqual(hotStreakCount, 1, "There should be exactly one hot streak tile");
    });

    test("does not assign hot streak if max commits < 5", () => {
      const activity = new Array(30).fill(1); // Avg 1 per column, max < 5

      const grid = generateIslandGrid(activity);

      let hotStreakCount = 0;
      for (let r = 0; r < grid.rows; r++) {
        for (let c = 0; c < grid.cols; c++) {
          if (grid.tiles[r][c].isHotStreak) {
            hotStreakCount++;
          }
        }
      }

      assert.strictEqual(hotStreakCount, 0, "There should be no hot streak tiles");
    });

    test("uses the correct theme", () => {
      const activity = new Array(30).fill(5);
      const grid = generateIslandGrid(activity, "spooky");

      assert.strictEqual(grid.theme, "spooky");

      // Check if water tiles use spooky emojis
      const waterTile = grid.tiles[0][0]; // Corners are definitely water
      assert.strictEqual(waterTile.type, "water");
      assert.ok(THEMES.spooky.water.includes(waterTile.emoji), "Water tile should use spooky emoji");
    });
  });
});

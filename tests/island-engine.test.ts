import { test } from 'node:test';
import assert from 'node:assert';
import { generateDemoIsland, THEMES } from '../lib/island-engine.ts';

test('generateDemoIsland creates a valid island grid with default theme', () => {
  const island = generateDemoIsland();

  assert.strictEqual(island.rows, 4);
  assert.strictEqual(island.cols, 10);
  assert.strictEqual(island.theme, 'tropical');
  assert.strictEqual(island.tiles.length, 4);
  assert.strictEqual(island.tiles[0].length, 10);

  // Verify a specific tile type from the demo activity
  // The center tiles usually get the highest commits
  const centerTile = island.tiles[1][5]; // Just an example tile
  assert.ok(centerTile);
  assert.ok(typeof centerTile.type === 'string');
  assert.ok(typeof centerTile.emoji === 'string');
  assert.ok(typeof centerTile.intensity === 'number');
  assert.ok(typeof centerTile.commits === 'number');
});

test('generateDemoIsland supports different themes', () => {
  const winterIsland = generateDemoIsland('winter');
  assert.strictEqual(winterIsland.theme, 'winter');

  const sakuraIsland = generateDemoIsland('sakura');
  assert.strictEqual(sakuraIsland.theme, 'sakura');

  const spookyIsland = generateDemoIsland('spooky');
  assert.strictEqual(spookyIsland.theme, 'spooky');
});

test('generateDemoIsland produces deterministic grid based on demo activity', () => {
  const island1 = generateDemoIsland();
  const island2 = generateDemoIsland();

  // Should produce identical results for the same theme
  assert.deepStrictEqual(island1.tiles, island2.tiles);
});

test('generateDemoIsland validates tile structure and emojis matching theme', () => {
  const island = generateDemoIsland('sakura');

  for (let r = 0; r < island.rows; r++) {
    for (let c = 0; c < island.cols; c++) {
      const tile = island.tiles[r][c];

      // Emoji should be part of the theme
      const validThemeEmojis = THEMES['sakura'][tile.type];
      assert.ok(validThemeEmojis.includes(tile.emoji));

      // Intensity should be bounded
      assert.ok(tile.intensity >= 0 && tile.intensity <= 5);

      // Commits should be non-negative
      assert.ok(tile.commits >= 0);
    }
  }
});

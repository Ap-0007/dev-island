import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { stringToColor } from '../lib/utils.ts';

describe('stringToColor', () => {
  test('returns deterministic color for same string', () => {
    const str = 'hello world';
    const color1 = stringToColor(str);
    const color2 = stringToColor(str);
    assert.equal(color1, color2);
  });

  test('returns different colors for different strings', () => {
    const color1 = stringToColor('user1');
    const color2 = stringToColor('user2');
    assert.notEqual(color1, color2);
  });

  test('handles empty string', () => {
    // empty string gives hash 0 -> hue 0
    assert.equal(stringToColor(''), 'hsl(0, 70%, 60%)');
  });

  test('returns valid hsl format', () => {
    const color = stringToColor('test string');
    assert.match(color, /^hsl\(-?\d+,\s*70%,\s*60%\)$/);
  });

  test('calculates known values correctly', () => {
    assert.equal(stringToColor('a'), 'hsl(97, 70%, 60%)');
    assert.equal(stringToColor('ab'), 'hsl(225, 70%, 60%)');
  });
});

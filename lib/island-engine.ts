export type TileType = "water" | "sand" | "grass" | "tree" | "forest" | "structure";
export type ThemeType = "tropical" | "winter" | "sakura" | "spooky";

export interface Tile {
  type: TileType;
  emoji: string;
  intensity: number; // 0-5, controls animation/glow intensity
  commits: number; // Added for tooltips
  isHotStreak?: boolean; // Determines if the tile gets a fire aura multiplier
}

export interface IslandGrid {
  tiles: Tile[][];
  rows: number;
  cols: number;
  theme: ThemeType;
}

// Global theme palette for emojis
export const THEMES: Record<ThemeType, Record<TileType, string[]>> = {
  tropical: {
    water: ["🌊", "💧", "🐟", "🌊"],
    sand: ["🏖️", "🐚", "⛱️", "🏖️"],
    grass: ["🌱", "🌿", "☘️", "🍀"],
    tree: ["🌳", "🌴", "🎋", "🌲"],
    forest: ["🌲", "🏕️", "🦌", "🌲"],
    structure: ["🏠", "🏗️", "🏰", "⛪"],
  },
  winter: {
    water: ["🧊", "❄️", "🧊", "⛄"],
    sand: ["☃️", "❄️", "🌨️", "🤍"],
    grass: ["❄️", "⛄", "🌨️", "❄️"],
    tree: ["🌲", "🎄", "🌲", "❄️"],
    forest: ["🎄", "🏔️", "🏂", "⛷️"],
    structure: ["🏔️", "🏂", "🏰", "🛖"], 
  },
  sakura: {
    water: ["🌊", "🎏", "🌸", "🌊"],
    sand: ["🌸", "🎋", "💮", "🌸"],
    grass: ["🎋", "🍵", "🍡", "🎋"],
    tree: ["🌸", "🎍", "🎋", "🌸"], 
    forest: ["⛩️", "🗻", "🏯", "🌸"],
    structure: ["🏯", "⛩️", "🏮", "🎌"],
  },
  spooky: {
    water: ["🧪", "🔮", "🦇", "🧪"],
    sand: ["🍂", "🎃", "🕸️", "🍂"],
    grass: ["🥀", "🎃", "🕷️", "🥀"],
    tree: ["🦉", "🕷️", "🥀", "🦉"],
    forest: ["🦇", "🏚️", "👻", "🦇"],
    structure: ["🏚️", "🏰", "🧛", "👻"],
  }
};

/**
 * Determine tile type based on commit intensity.
 */
function getTileType(intensity: number): TileType {
  if (intensity === 0) return "water";
  if (intensity <= 1) return "sand";
  if (intensity <= 3) return "grass";
  if (intensity <= 6) return "tree";
  if (intensity <= 10) return "forest";
  return "structure";
}

/**
 * Get a deterministic but varied emoji for a tile position using the chosen theme.
 */
function getEmoji(type: TileType, row: number, col: number, theme: ThemeType): string {
  const emojis = THEMES[theme][type];
  const index = (row * 7 + col * 3) % emojis.length;
  return emojis[index];
}

/**
 * Create an island shape mask — determines which cells are island vs water.
 */
function getIslandMask(rows: number, cols: number): number[][] {
  const mask: number[][] = [];
  const centerRow = (rows - 1) / 2;
  const centerCol = (cols - 1) / 2;

  for (let r = 0; r < rows; r++) {
    mask[r] = [];
    for (let c = 0; c < cols; c++) {
      const rowDist = Math.abs(r - centerRow) / centerRow;
      const colDist = Math.abs(c - centerCol) / centerCol;
      const dist = Math.sqrt(rowDist * rowDist * 1.2 + colDist * colDist * 0.8);
      const variation = Math.sin(c * 0.7 + r * 1.3) * 0.1;
      const elevation = Math.max(0, 1 - dist + variation);
      mask[r][c] = elevation;
    }
  }

  return mask;
}

/**
 * Generate a complete island grid from a 30-day activity array.
 */
export function generateIslandGrid(activity: number[], theme: ThemeType = "tropical"): IslandGrid {
  const rows = 4;
  const cols = 10;

  // Condense 30 days into 10 column values
  const columnIntensities: number[] = [];
  for (let c = 0; c < cols; c++) {
    const startIdx = c * 3;
    const slice = activity.slice(startIdx, startIdx + 3);
    const avg = slice.length > 0 ? slice.reduce((a, b) => a + b, 0) / slice.length : 0;
    columnIntensities.push(avg);
  }

  // Get island shape mask
  const mask = getIslandMask(rows, cols);
  
  // Track max commits to identify the "Hot Streak"
  let maxCommits = -1;
  let maxCoords = { r: -1, c: -1 };

  // Generate tiles
  const tiles: Tile[][] = [];

  for (let r = 0; r < rows; r++) {
    tiles[r] = [];
    for (let c = 0; c < cols; c++) {
      const maskValue = mask[r][c];
      const columnValue = columnIntensities[c];
      const commitsVal = Math.round(columnValue);

      if (maskValue >= 0.3 && commitsVal > maxCommits) {
        maxCommits = commitsVal;
        maxCoords = { r, c };
      }

      if (maskValue < 0.3) {
        tiles[r][c] = {
          type: "water",
          emoji: getEmoji("water", r, c, theme),
          intensity: 0,
          commits: 0,
          isHotStreak: false,
        };
      } else if (maskValue < 0.5 && columnValue < 1) {
        tiles[r][c] = {
          type: "sand",
          emoji: getEmoji("sand", r, c, theme),
          intensity: 1,
          commits: commitsVal,
          isHotStreak: false,
        };
      } else {
        const scaledIntensity = columnValue * maskValue;
        const type = getTileType(scaledIntensity);
        const intensity = Math.min(5, Math.ceil(scaledIntensity));

        tiles[r][c] = {
          type,
          emoji: getEmoji(type, r, c, theme),
          intensity,
          commits: commitsVal,
          isHotStreak: false, // Updated after the loop
        };
      }
    }
  }

  // Assign hot streak to the tile with max commits (minimum 5 required for a "streak" trophy)
  if (maxCommits >= 5 && maxCoords.r !== -1) {
    tiles[maxCoords.r][maxCoords.c].isHotStreak = true;
  }

  return { tiles, rows, cols, theme };
}


// lib/aura-engine.ts

export type AuraClass = 
  | "Night Owl" 
  | "Morning Star" 
  | "The Architect" 
  | "Turbo Sprinter" 
  | "The Polyglot" 
  | "Sunday Driver"
  | "Shadow Worker";

export interface AuraStats {
  consistency: number; // 0-100
  intensity: number;   // 0-100
  versatility: number; // 0-100
  impact: number;      // 0-100
}

export interface AuraData {
  class: AuraClass;
  lore: string;
  color: string;
  glowColor: string;
  geometry: "fluid" | "crystalline" | "orbitals";
  vibe: "calm" | "chaotic" | "focused" | "hyped";
  stats: AuraStats;
}

export function calculateAura(activity: number[]): AuraData {
  const totalCommits = activity.reduce((a, b) => a + b, 0);
  const avgCommits = totalCommits / activity.length;
  const maxCommits = Math.max(...activity);
  
  // 1. Calculate Core Stats
  const consistency = Math.min(100, (activity.filter(a => a > 0).length / activity.length) * 100);
  const intensity = Math.min(100, (avgCommits / 10) * 100);
  const impact = Math.min(100, (maxCommits / 20) * 100);
  
  // 2. Determine Class & Lore
  let auraClass: AuraClass = "The Architect";
  let lore = "A disciplined builder of digital foundations.";
  let vibe: AuraData["vibe"] = "focused";
  
  if (intensity > 70) {
    auraClass = "Turbo Sprinter";
    lore = "Moves at the speed of thought. Your commits are a blur of pure productivity.";
    vibe = "hyped";
  } else if (consistency > 85) {
    auraClass = "The Architect";
    lore = "Reliable. Steady. You build the future one brick at a time, every single day.";
    vibe = "focused";
  } else if (maxCommits > 15) {
    auraClass = "Shadow Worker";
    lore = "Short bursts of absolute brilliance. You disappear only to return with the sun.";
    vibe = "chaotic";
  } else if (totalCommits < 5) {
    auraClass = "Sunday Driver";
    lore = "Casual but clinical. You only code when the vibes are absolutely immaculate.";
    vibe = "calm";
  }

  // 3. Visual Mapping
  const palettes: Record<AuraClass, { color: string; glow: string; geo: AuraData["geometry"] }> = {
    "Night Owl": { color: "#8b5cf6", glow: "#c084fc", geo: "fluid" },
    "Morning Star": { color: "#facc15", glow: "#fef08a", geo: "orbitals" },
    "The Architect": { color: "#0ea5e9", glow: "#38bdf8", geo: "crystalline" },
    "Turbo Sprinter": { color: "#f43f5e", glow: "#fb7185", geo: "fluid" },
    "The Polyglot": { color: "#d946ef", glow: "#e879f9", geo: "orbitals" },
    "Sunday Driver": { color: "#22c55e", glow: "#4ade80", geo: "fluid" },
    "Shadow Worker": { color: "#475569", glow: "#94a3b8", geo: "crystalline" },
  };

  const palette = palettes[auraClass];

  return {
    class: auraClass,
    lore,
    color: palette.color,
    glowColor: palette.glow,
    geometry: palette.geo,
    vibe,
    stats: {
      consistency,
      intensity,
      versatility: 50, // Future: base on repo variety
      impact,
    }
  };
}

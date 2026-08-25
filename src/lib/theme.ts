/**
 * UniFlora design tokens — "Modern Botanical Editorial".
 *
 * Source of truth for JS/inline-style contexts (badge colors, placeholder
 * tints, map layer colors, status maps). The same values are declared as CSS
 * custom properties in `globals.css` for anything styled purely via CSS —
 * keep the two in sync when a token changes.
 */

export const color = {
  // Ink — text
  ink: "#16241c",
  inkSoft: "#3d4a3f",
  muted: "#74806f",
  faint: "#9aa494",

  // Forest — brand green, dark to light
  forest950: "#0a1f13",
  forest900: "#123420",
  forest800: "#1c4a2c",
  forest700: "#245534",
  forest600: "#2f6b3f",
  forest500: "#3f8a4f",

  // Sage — light green fills
  sage100: "#e4ecda",
  sage200: "#d3e2c4",

  // Gold — the new editorial accent
  gold600: "#b6862d",
  gold700: "#8f6a21",
  gold100: "#f6ecd2",

  // Parchment — warm neutrals / surfaces
  parchment: "#faf6ec",
  parchmentDeep: "#f2ecdb",
  surface: "#ffffff",
  border: "#e6ded0",
  borderStrong: "#d8cdb2",

  // Text on dark (forest) surfaces
  onDark: "#f4f1e6",
  onDarkMuted: "#aec6a7",
  onDarkFaint: "#7f9a79",
  onDarkGold: "#e3c37c",

  // Status semantics
  statusPendingBg: "#f6ecd2",
  statusPendingFg: "#8f6a21",
  statusReviewBg: "#e7edf6",
  statusReviewFg: "#3a5a8a",
  statusApprovedBg: "#deead9",
  statusApprovedFg: "#2f6b3f",
  statusDraftBg: "#eef0e6",
  statusDraftFg: "#6b7360",
  danger: "#a53f3f",
  dangerBg: "#f8e9e9",
} as const;

/** Plant-type placeholder tints for `PlantImage` (no photo on file). */
export const placeholderTint: Record<string, { from: string; to: string; icon: string }> = {
  Tree: { from: "#e3ecd8", to: "#b9d0aa", icon: "#3f6b47" },
  Palm: { from: "#dcebdd", to: "#aecfb6", icon: "#2f6b4a" },
  Shrub: { from: "#f2e9cf", to: "#dfcf9e", icon: "#8f6a21" },
  Subshrub: { from: "#f2e9cf", to: "#dfcf9e", icon: "#8f6a21" },
  Climber: { from: "#ece2f0", to: "#cdbfe0", icon: "#5a4a75" },
  Succulent: { from: "#dcece9", to: "#aed3cc", icon: "#2f6e63" },
  Herb: { from: "#e9edd4", to: "#c8d7a6", icon: "#4a6b2f" },
  Grass: { from: "#eaeed3", to: "#d2daa6", icon: "#5a6b3f" },
  Sedge: { from: "#e3ead4", to: "#c3d0a8", icon: "#5a6b3f" },
} as const;

export const font = {
  display: "var(--font-display), 'Fraunces', Georgia, serif",
  body: "var(--font-body), 'Inter', system-ui, sans-serif",
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const shadow = {
  soft: "0 1px 2px rgba(20,40,25,.05), 0 1px 1px rgba(20,40,25,.04)",
  card: "0 1px 2px rgba(20,40,25,.04), 0 10px 28px rgba(20,40,25,.07)",
  lifted: "0 20px 44px rgba(16,32,20,.16)",
  popover: "0 18px 40px rgba(16,32,20,.22)",
} as const;

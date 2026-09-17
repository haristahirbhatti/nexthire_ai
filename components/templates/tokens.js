/**
 * tokens.js
 *
 * Design tokens for font pairings and layout presets.
 */

export const FONT_PAIRS = [
  { id: "modern", name: "Modern Sans", heading: "'Inter', 'Helvetica Neue', Arial, sans-serif", body: "'Inter', Arial, sans-serif" },
  { id: "editorial", name: "Editorial Serif", heading: "Georgia, 'Times New Roman', serif", body: "'Inter', Calibri, sans-serif" },
  { id: "executive", name: "Executive Classic", heading: "Palatino, 'Book Antiqua', Georgia, serif", body: "Calibri, 'Helvetica Neue', sans-serif" },
  { id: "clean", name: "Clean Tech", heading: "'Trebuchet MS', 'Segoe UI', sans-serif", body: "'Inter', Arial, sans-serif" },
  { id: "compact", name: "Compact ATS", heading: "Arial, sans-serif", body: "Arial, sans-serif" },
];

export function getFontPair(id) {
  return FONT_PAIRS.find((f) => f.id === id) || FONT_PAIRS[0];
}

export const TEMPLATE_COUNT = 10000;

const FAMILIES = [
  "Meridian", "Ledger", "Aster", "Blueprint", "Cadence", "Fieldnote",
  "Ionic", "Kessel", "Lumen", "Northline", "Orbital", "Pinnacle",
  "Quire", "Rowan", "Selvedge", "Talon", "Umbra", "Voss", "Wayfare", "Zephyr",
];

const TONES = ["Classic", "Modern", "Minimal", "Executive", "Creative", "Technical"];

const ACCENTS = ["#B8922A", "#3E8F63", "#D4A72C", "#C24B4B", "#6E4E10", "#2C7A50"];

export function getTemplatePage(page, pageSize = 24) {
  const pageNum = Math.max(1, page);
  const start = (pageNum - 1) * pageSize;
  const items = [];
  for (let i = 0; i < pageSize && start + i < TEMPLATE_COUNT; i++) {
    const idx = start + i;
    const family = FAMILIES[idx % FAMILIES.length];
    const tone = TONES[Math.floor(idx / FAMILIES.length) % TONES.length];
    items.push({
      id: idx + 1,
      name: `${family} ${tone}`,
      tone,
      accent: ACCENTS[idx % ACCENTS.length],
      previewBg: "#1A1A1A",
      columns: idx % 3 === 0 ? 2 : 1,
    });
  }
  return items;
}

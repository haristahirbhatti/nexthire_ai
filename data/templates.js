export const TEMPLATE_COUNT = 10000;

const FAMILIES = [
  "Meridian", "Ledger", "Aster", "Blueprint", "Cadence", "Fieldnote",
  "Ionic", "Kessel", "Lumen", "Northline", "Orbital", "Pinnacle",
  "Quire", "Rowan", "Selvedge", "Talon", "Umbra", "Voss", "Wayfare", "Zephyr",
];

const TONES = ["Classic", "Modern", "Minimal", "Executive", "Creative", "Technical"];

const ACCENTS = ["#2C7A50", "#164630", "#C98A22", "#101F2B", "#A83C3C", "#3C4F5C"];

export function getTemplatePage(page, pageSize = 24) {
  const start = page * pageSize;
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
      columns: idx % 3 === 0 ? 2 : 1,
    });
  }
  return items;
}

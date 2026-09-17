/**
 * extractColors.js
 *
 * Client-side color extraction from an uploaded image, using only the
 * browser Canvas API (no external npm package needed).
 *
 * Flow:
 *   1. Draw the image onto a small offscreen canvas (downscaled for speed).
 *   2. Read every pixel's RGB value.
 *   3. Bucket similar colors together (coarse quantization) and count
 *      how often each bucket occurs.
 *   4. Return dominant primary, secondary, background, and text colors.
 */

const QUANT_STEP = 24;

function quantize(value) {
  return Math.round(value / QUANT_STEP) * QUANT_STEP;
}

function relativeLuminance(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function colorDistance(a, b) {
  return Math.sqrt(
    Math.pow(a[0] - b[0], 2) +
      Math.pow(a[1] - b[1], 2) +
      Math.pow(a[2] - b[2], 2)
  );
}

function toHex([r, g, b]) {
  const h = (n) => n.toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

/**
 * @param {HTMLImageElement} img - a loaded <img> element
 * @param {number} sampleSize - the side length of the downscaled canvas
 * @returns {{ primary: string, secondary: string, background: string, text: string, primaryIsDark: boolean }}
 */
export function extractPalette(img, sampleSize = 100) {
  if (typeof document === "undefined") {
    return {
      primary: "#2563eb",
      secondary: "#1e3a8a",
      background: "#f8fafc",
      text: "#0f172a",
      primaryIsDark: true,
    };
  }

  const canvas = document.createElement("canvas");
  canvas.width = sampleSize;
  canvas.height = sampleSize;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    return {
      primary: "#2563eb",
      secondary: "#1e3a8a",
      background: "#f8fafc",
      text: "#0f172a",
      primaryIsDark: true,
    };
  }

  ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
  const { data } = ctx.getImageData(0, 0, sampleSize, sampleSize);
  const buckets = new Map();

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (a < 128) continue;

    const lum = relativeLuminance(r, g, b);
    if (lum > 245 || lum < 12) continue;

    const qr = quantize(r);
    const qg = quantize(g);
    const qb = quantize(b);
    const key = `${qr},${qg},${qb}`;

    const existing = buckets.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      buckets.set(key, { count: 1, r: qr, g: qg, b: qb });
    }
  }

  const sorted = [...buckets.values()].sort((a, b) => b.count - a.count);

  if (sorted.length === 0) {
    return {
      primary: "#B8922A",
      secondary: "#181e24",
      background: "#fdfbf7",
      text: "#0f172a",
      primaryIsDark: true,
    };
  }

  const primaryBucket = sorted[0];
  const primary = [primaryBucket.r, primaryBucket.g, primaryBucket.b];

  const secondaryBucket =
    sorted.find((c) => colorDistance([c.r, c.g, c.b], primary) > 60) ||
    sorted[Math.min(1, sorted.length - 1)];
  const secondary = [secondaryBucket.r, secondaryBucket.g, secondaryBucket.b];

  const primaryLum = relativeLuminance(...primary);
  const background = primary.map((c) => Math.round(c + (255 - c) * 0.94));
  const bgLum = relativeLuminance(...background);
  const text = bgLum > 150 ? [15, 23, 42] : [248, 250, 252];

  return {
    primary: toHex(primary),
    secondary: toHex(secondary),
    background: toHex(background),
    text: toHex(text),
    primaryIsDark: primaryLum < 128,
  };
}

/**
 * Convenience helper: load a File into an <img> and extract palette
 */
export function extractPaletteFromFile(file) {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return resolve(null);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const palette = extractPalette(img);
        resolve(palette);
      } catch (err) {
        reject(err);
      } finally {
        URL.revokeObjectURL(url);
      }
    };
    img.onerror = reject;
    img.src = url;
  });
}

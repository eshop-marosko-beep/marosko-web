#!/usr/bin/env node
/**
 * Updates the price row on a promo banner (public/promos/*.png) in place,
 * instead of editing the PNG by hand pixel-by-pixel.
 *
 * Background: these banners (see lib/promosData.ts) show a crossed-out
 * original price and a bold sale price, e.g. "413 € [crossed out] 369 €".
 * eshop.marosko.sk prices change over time (further discounts, restocks at
 * a new price, etc.), so the banner can drift out of sync with the product
 * page it links to. This redraws just that price row — nothing else on the
 * banner is touched.
 *
 * Usage:
 *   node scripts/update-promo-banner-price.mjs \
 *     --file public/promos/manpa-multi-cutter-master.png \
 *     --original 413 --sale 369
 *
 * Optional: --x (left edge, default 500), --baseline (default 400),
 * --out (defaults to overwriting --file).
 *
 * The exact position/size/colors below were calibrated once against the
 * current banner design (cream background, muted-brown strikethrough,
 * burnt-orange sale price, small gray "s DPH"). If a future banner uses a
 * different layout, recalibrate by cropping the price area and adjusting
 * these constants — see the git history of this file for how the original
 * values were measured (pixel bounding boxes of the existing price text).
 */
import sharp from "sharp";
import { parseArgs } from "node:util";

const { values: args } = parseArgs({
  options: {
    file: { type: "string" },
    original: { type: "string" },
    sale: { type: "string" },
    out: { type: "string" },
    x: { type: "string", default: "500" },
    baseline: { type: "string", default: "400" },
  },
});

if (!args.file || !args.original || !args.sale) {
  console.error(
    "Usage: node scripts/update-promo-banner-price.mjs --file <png> --original <€> --sale <€> [--out <png>] [--x 500] [--baseline 400]"
  );
  process.exit(1);
}

const BG = "#fdfaf5";
const GRAY = "#a68d75"; // strikethrough original-price color
const ORANGE = "#b7551f"; // bold sale-price color
const SMALL_GRAY = "#7d6650"; // "s DPH" color

const x = Number(args.x);
const baseline = Number(args.baseline);
const originalText = `${args.original} €`;
const saleText = `${args.sale} €`;

// Rough per-character advance widths (px) for Liberation Serif Bold at the
// sizes used below — just enough to lay the three pieces out with sensible
// gaps without needing to measure real glyph metrics.
const STRIKE_FONT_SIZE = 37;
const SALE_FONT_SIZE = 44;
const SMALL_FONT_SIZE = 17;
const STRIKE_CHAR_W = STRIKE_FONT_SIZE * 0.52;
const SALE_CHAR_W = SALE_FONT_SIZE * 0.52;

const strikeWidth = originalText.length * STRIKE_CHAR_W;
const saleX = x + strikeWidth + 18;
const saleWidth = saleText.length * SALE_CHAR_W;
const smallX = saleX + saleWidth + 14;

const paintLeft = x - 5;
const paintRight = smallX + 70; // generous right margin for "s DPH"

const svg = `
<svg width="1200" height="628" xmlns="http://www.w3.org/2000/svg">
  <rect x="${paintLeft}" y="368" width="${paintRight - paintLeft}" height="38" fill="${BG}" />
  <text x="${x}" y="${baseline}" font-family="Liberation Serif, Georgia, serif" font-weight="bold"
        font-size="${STRIKE_FONT_SIZE}" fill="${GRAY}">${originalText}</text>
  <line x1="${x - 2}" y1="393" x2="${x + strikeWidth + 2}" y2="393" stroke="${GRAY}" stroke-width="2" />
  <text x="${saleX}" y="${baseline}" font-family="Liberation Serif, Georgia, serif" font-weight="bold"
        font-size="${SALE_FONT_SIZE}" fill="${ORANGE}">${saleText}</text>
  <text x="${smallX}" y="${baseline - 1}" font-family="Liberation Sans, Arial, sans-serif"
        font-size="${SMALL_FONT_SIZE}" fill="${SMALL_GRAY}">s DPH</text>
</svg>`;

const outputPath = args.out ?? args.file;
await sharp(args.file)
  .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
  .toFile(outputPath + ".tmp");

// toFile can't overwrite its own source file mid-read; swap in afterwards.
const fs = await import("node:fs/promises");
await fs.rename(outputPath + ".tmp", outputPath);

console.log(`Updated ${outputPath}: ${originalText} -> ${saleText}`);

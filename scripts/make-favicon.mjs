// Builds a clean favicon: isolates the diamond gem (rightmost ink cluster) from
// the logo and renders it amber on a dark slate rounded square. Run: node scripts/make-favicon.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { PNG } from "pngjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = PNG.sync.read(readFileSync(join(root, "public", "logo-original.png")));
const { width: W, height: H, data } = src;
const lum = (x, y) => {
  const i = (y * W + x) * 4;
  return 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
};
const INK = 200; // below = ink (dark logo on near-white bg)

// Per-column ink count.
const col = new Array(W).fill(0);
for (let x = 0; x < W; x++) for (let y = 0; y < H; y++) if (lum(x, y) <= INK) col[x]++;

// Walk from the right edge: skip trailing blank, capture the gem cluster, stop at the
// first sustained gap (whitespace between the gem and the "SEALING" wordmark).
let x = W - 1;
while (x >= 0 && col[x] === 0) x--;
const gemRight = x;
let gap = 0;
const GAP = 18; // px of empty columns that marks the end of the gem
while (x >= 0) {
  if (col[x] === 0) { gap++; if (gap >= GAP) break; } else gap = 0;
  x--;
}
const gemLeft = x + gap + 1;

// Vertical extent within the gem columns.
let top = H, bot = 0;
for (let yy = 0; yy < H; yy++)
  for (let xx = gemLeft; xx <= gemRight; xx++)
    if (lum(xx, yy) <= INK) { if (yy < top) top = yy; if (yy > bot) bot = yy; break; }

const gw = gemRight - gemLeft + 1;
const gh = bot - top + 1;
const side = Math.max(gw, gh);
const offX = Math.floor((side - gw) / 2);
const offY = Math.floor((side - gh) / 2);

const ICON = 256;
const PAD = 44; // breathing room inside the square
const inner = ICON - PAD * 2;
const scale = inner / side;

const icon = new PNG({ width: ICON, height: ICON });
// Dark slate background (matches site --color-ink).
for (let i = 0; i < icon.data.length; i += 4) {
  icon.data[i] = 0x0a; icon.data[i + 1] = 0x0e; icon.data[i + 2] = 0x14; icon.data[i + 3] = 0xff;
}
// Paint gem in brand amber.
const [AR, AG, AB] = [0xf0, 0xa2, 0x35];
for (let y = 0; y < inner; y++) {
  for (let x2 = 0; x2 < inner; x2++) {
    const sx = gemLeft - offX + Math.floor(x2 / scale);
    const sy = top - offY + Math.floor(y / scale);
    if (sx < 0 || sy < 0 || sx >= W || sy >= H) continue;
    if (lum(sx, sy) <= INK) {
      const dx = PAD + x2, dy = PAD + y;
      const di = (dy * ICON + dx) * 4;
      icon.data[di] = AR; icon.data[di + 1] = AG; icon.data[di + 2] = AB; icon.data[di + 3] = 0xff;
    }
  }
}
writeFileSync(join(root, "app", "icon.png"), PNG.sync.write(icon));
console.log(`gem cols ${gemLeft}-${gemRight} (w${gw}) rows ${top}-${bot} (h${gh}) -> app/icon.png ${ICON}x${ICON}`);

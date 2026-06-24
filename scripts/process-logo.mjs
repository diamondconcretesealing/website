// Processes the supplied logo (black wordmark + gem on near-white bg) into
// web-ready transparent variants. Run: node scripts/process-logo.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { PNG } from "pngjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pub = join(root, "public");

const src = PNG.sync.read(readFileSync(join(pub, "logo-original.png")));
const { width: W, height: H, data } = src;

const lum = (i) => 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
const BG = 200; // pixels brighter than this are background → transparent

// Build an alpha-keyed copy in the given ink color.
function recolor(r, g, b) {
  const out = new PNG({ width: W, height: H });
  for (let i = 0; i < data.length; i += 4) {
    const l = lum(i);
    if (l > BG) {
      out.data[i] = out.data[i + 1] = out.data[i + 2] = 0;
      out.data[i + 3] = 0; // transparent background
    } else {
      // alpha ramps with darkness for clean antialiased edges
      const a = Math.min(255, Math.round((BG - l) / BG * 255) + 60);
      out.data[i] = r;
      out.data[i + 1] = g;
      out.data[i + 2] = b;
      out.data[i + 3] = a;
    }
  }
  return out;
}

const white = recolor(255, 255, 255);
const black = recolor(15, 18, 23); // near-ink, for light surfaces
writeFileSync(join(pub, "logo-white.png"), PNG.sync.write(white));
writeFileSync(join(pub, "logo-dark.png"), PNG.sync.write(black));

// --- Favicon: crop the diamond gem (right cluster) into a square, white on amber. ---
// Find bounding box of dark pixels in the right 30% of the image.
let minX = W, minY = H, maxX = 0, maxY = 0;
const startX = Math.floor(W * 0.7);
for (let y = 0; y < H; y++) {
  for (let x = startX; x < W; x++) {
    const i = (y * W + x) * 4;
    if (lum(i) <= BG) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}
const pad = 24;
minX = Math.max(0, minX - pad); minY = Math.max(0, minY - pad);
maxX = Math.min(W - 1, maxX + pad); maxY = Math.min(H - 1, maxY + pad);
const gw = maxX - minX + 1, gh = maxY - minY + 1;
const side = Math.max(gw, gh);
const offX = Math.floor((side - gw) / 2), offY = Math.floor((side - gh) / 2);

const ICON = 256;
const scale = ICON / side;
const icon = new PNG({ width: ICON, height: ICON });
// amber rounded-ish background (full square; theme handles rounding in CSS)
for (let i = 0; i < icon.data.length; i += 4) {
  icon.data[i] = 0xf0; icon.data[i + 1] = 0xa2; icon.data[i + 2] = 0x35; icon.data[i + 3] = 0xff;
}
// nearest-neighbour-ish sample of gem, painted white
for (let y = 0; y < ICON; y++) {
  for (let x = 0; x < ICON; x++) {
    const sxAbs = minX - offX + Math.floor(x / scale);
    const syAbs = minY - offY + Math.floor(y / scale);
    if (sxAbs < 0 || syAbs < 0 || sxAbs >= W || syAbs >= H) continue;
    const si = (syAbs * W + sxAbs) * 4;
    if (lum(si) <= BG) {
      const di = (y * ICON + x) * 4;
      icon.data[di] = icon.data[di + 1] = icon.data[di + 2] = 255;
      icon.data[di + 3] = 255;
    }
  }
}
writeFileSync(join(root, "app", "icon.png"), PNG.sync.write(icon));

console.log(`logo-white.png + logo-dark.png written; gem box ${gw}x${gh} -> app/icon.png ${ICON}x${ICON}`);

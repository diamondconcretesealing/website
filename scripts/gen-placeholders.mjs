// Generates swappable placeholder SVGs into public/images.
// Replace these with real photos/video later — filenames are referenced in lib/content.ts.
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images");
mkdirSync(dir, { recursive: true });

const INK = "#0a0e14";
const SURFACE = "#1a212c";
const BRAND = "#f0a235";

function svg({ w = 1200, h = 900, label, sub = "PLACEHOLDER — swap with real photo" }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${SURFACE}"/>
      <stop offset="1" stop-color="${INK}"/>
    </linearGradient>
    <pattern id="p" width="48" height="48" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
      <rect width="48" height="48" fill="none"/>
      <circle cx="6" cy="6" r="1.4" fill="#ffffff" opacity="0.05"/>
    </pattern>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <rect width="${w}" height="${h}" fill="url(#p)"/>
  <rect x="40" y="40" width="${w - 80}" height="${h - 80}" rx="18" fill="none" stroke="${BRAND}" stroke-opacity="0.35" stroke-width="2" stroke-dasharray="10 8"/>
  <text x="50%" y="48%" text-anchor="middle" fill="#ffffff" font-family="Oswald, Impact, sans-serif" font-size="${Math.round(w / 16)}" font-weight="700" letter-spacing="1">${label.toUpperCase()}</text>
  <text x="50%" y="56%" text-anchor="middle" fill="${BRAND}" font-family="Inter, sans-serif" font-size="${Math.round(w / 42)}" letter-spacing="3">${sub.toUpperCase()}</text>
</svg>`;
}

const assets = [
  { file: "hero-poster.svg", label: "Concrete Sealing", w: 1920, h: 1080 },
  { file: "about.svg", label: "Sealed Driveway" },
  { file: "service-sealing.svg", label: "Concrete Sealing" },
  { file: "service-staining.svg", label: "Concrete Staining" },
  { file: "service-crack.svg", label: "Crack Repair" },
  { file: "service-coating.svg", label: "Garage Coatings" },
  { file: "project-1.svg", label: "Project 1" },
  { file: "project-2.svg", label: "Project 2" },
  { file: "project-3.svg", label: "Project 3" },
  { file: "project-4.svg", label: "Project 4" },
  { file: "project-5.svg", label: "Project 5" },
  { file: "project-6.svg", label: "Project 6" },
];

for (const a of assets) {
  writeFileSync(join(dir, a.file), svg(a));
}
console.log(`Wrote ${assets.length} placeholder SVGs to public/images`);

// One-time migration: upload the existing GBP photos as Sanity assets and
// create `project` documents. Idempotent via stable document IDs.
//
// Run once:
//   SANITY_WRITE_TOKEN=<token> node scripts/migrate-projects.mjs
//
// The token is only needed for this seeding step. Delete/rotate it afterwards;
// the live site reads the public dataset without any token.
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// Token from env, or a gitignored local file (scripts/.sanity-token) so the
// secret never has to be passed on the command line.
let token = process.env.SANITY_WRITE_TOKEN;
if (!token) {
  try {
    token = readFileSync(join(__dirname, ".sanity-token"), "utf8").trim();
  } catch {
    /* fall through */
  }
}
if (!token) {
  console.error(
    "No token. Set SANITY_WRITE_TOKEN or put it in scripts/.sanity-token"
  );
  process.exit(1);
}

const client = createClient({
  projectId: "5lsh7deg",
  dataset: "production",
  apiVersion: "2024-10-01",
  token,
  useCdn: false,
});

// Mirrors the original lib/content.ts `projects` array (order preserved;
// first item is the featured large tile).
const projects = [
  { file: "photo-5.jpg", alt: "Sealed exposed-aggregate driveway with double garage" },
  { file: "photo-1.jpg", alt: "Exposed-aggregate walkway alongside stone-veneer home" },
  { file: "photo-2.jpg", alt: "Sealed backyard patio in exposed aggregate" },
  { file: "photo-7.jpg", alt: "Finished backyard concrete patio at golden hour" },
  { file: "photo-6.jpg", alt: "Close-up of sealed exposed-aggregate at a door threshold" },
  { file: "photo-3.jpg", alt: "Fresh parking-lot line painting and surface work, Okotoks" },
];

for (let i = 0; i < projects.length; i++) {
  const { file, alt } = projects[i];
  const order = i + 1;
  const docId = `project-${file.replace(/\.[^.]+$/, "")}`;

  const buffer = readFileSync(join(root, "public", "images", "gbp", file));
  const asset = await client.assets.upload("image", buffer, { filename: file });

  await client.createOrReplace({
    _id: docId,
    _type: "project",
    image: {
      _type: "image",
      asset: { _type: "reference", _ref: asset._id },
      alt,
    },
    order,
  });

  console.log(`✓ ${docId} (order ${order}) — ${alt}`);
}

console.log("Done. Projects are published and live.");

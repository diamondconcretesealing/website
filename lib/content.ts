/**
 * Single source of truth for all site copy and business data.
 * Edit THIS file to update the website — components read from here.
 *
 * Real data sourced from the Diamond Concrete Sealing Google Business Profile (Okotoks, AB).
 * Items marked `TODO-confirm` need verification from the owner before launch.
 */

export const business = {
  name: "Diamond Concrete Sealing",
  shortName: "Diamond",
  city: "Okotoks",
  province: "Alberta",
  provinceAbbr: "AB",
  postal: "T1S 1A6",

  // Verified from the business's printed yard sign. (Note: their Google profile
  // lists 6746 — a one-digit typo on Google; the sign number 6736 is correct.)
  phoneDisplay: "(587) 830-6736",
  phoneHref: "tel:+15878306736",

  email: "diamondconcretesealing@gmail.com",
  emailHref: "mailto:diamondconcretesealing@gmail.com",

  rating: 5.0,
  ratingCount: 1, // Google reviews at time of build

  // TODO-confirm: exact list of nearby communities served.
  areas: ["Okotoks", "Calgary", "High River", "Black Diamond", "and surrounding Foothills"],
  areaSummary: "Okotoks and nearby areas",

  tagline: "Concrete sealing, repair & protection done right.",
  // Based on the business's Google profile, aligned to the brochure service list
  // (sealing/repair/protection — not decorative staining).
  description:
    "Diamond Concrete Sealing is the leading expert in concrete solutions, providing diverse, high-quality sealing, repair, and surface-protection options tailored to every budget and project scope. We use premium materials to guarantee superior, long-lasting results.",
} as const;

export const hours = [
  { day: "Monday", time: "8:00 AM – 5:00 PM", closed: false },
  { day: "Tuesday", time: "8:00 AM – 5:00 PM", closed: false },
  { day: "Wednesday", time: "8:00 AM – 5:00 PM", closed: false },
  { day: "Thursday", time: "8:00 AM – 5:00 PM", closed: false },
  { day: "Friday", time: "8:00 AM – 5:00 PM", closed: false },
  { day: "Saturday", time: "Closed", closed: true },
  { day: "Sunday", time: "Closed", closed: true },
] as const;

export const nav = [
  { label: "Services", href: "#services" },
  { label: "Why Us", href: "#benefits" },
  { label: "Process", href: "#process" },
  { label: "Projects", href: "#projects" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
] as const;

export type Service = {
  id: string;
  name: string;
  blurb: string;
  body: string;
  image: string;
  points: string[];
};

// Services match the business's printed marketing brochure (the authoritative
// service list). Order follows the brochure. Images are existing GBP job photos
// used as placeholders — pressure-washing and asphalt shots should be swapped in
// when the owner supplies them.
export const services: Service[] = [
  {
    id: "sealing",
    name: "Concrete Sealing",
    blurb: "Lock out water, salt, and freeze-thaw damage.",
    body: "Our premium penetrating and topical sealers shield driveways, garage floors, patios, and walkways from Alberta's harsh freeze-thaw cycles, road salt, and UV fading — keeping your concrete strong and sharp for years.",
    image: "/images/gbp/photo-3.jpg",
    points: ["Driveways & walkways", "Garage floors", "Patios & steps"],
  },
  {
    id: "stain-removal",
    name: "Stain Removal",
    blurb: "Lift oil, rust, and grime out of concrete.",
    body: "Grease, oil, rust, and organic staining soak into porous concrete and dull the surface. We deep-clean and treat stained slabs to pull the discoloration out and restore an even, refreshed finish — the right first step before sealing.",
    image: "/images/gbp/photo-7.jpg",
    points: ["Oil & grease", "Rust & hard water", "Pre-seal deep clean"],
  },
  {
    id: "crack-repairs",
    name: "Crack Repairs",
    blurb: "Stop small cracks becoming big problems.",
    body: "Left untreated, cracks let in water that freezes, expands, and tears concrete apart. We clean, fill, and seal cracks to halt the damage and restore a smooth, protected surface.",
    image: "/images/gbp/photo-6.jpg",
    points: ["Flexible crack filling", "Surface prep & cleaning", "Prevents costly repairs"],
  },
  {
    id: "grip-additives",
    name: "Grip Additives",
    blurb: "Safer traction on wet or icy surfaces.",
    body: "We blend an anti-slip additive into the sealer so driveways, steps, and garage floors keep their grip when wet — added safety with no change to the finished look.",
    image: "/images/gbp/photo-2.jpg",
    points: ["Anti-slip sealer additive", "Steps & ramps", "Wet-area traction"],
  },
  {
    id: "pressure-washing",
    name: "Residential & Commercial Pressure Washing",
    blurb: "Strip away dirt, moss, and buildup.",
    body: "High-pressure cleaning for driveways, walkways, patios, and commercial slabs — clearing dirt, algae, and grime so the concrete looks its best and is properly prepped to seal.",
    image: "/images/gbp/photo-1.jpg",
    points: ["Driveways & walkways", "Patios & decks", "Commercial lots"],
  },
  {
    id: "concrete-repairs",
    name: "Concrete Repairs",
    blurb: "Restore damaged and worn concrete.",
    body: "Beyond cracks — we patch spalling, chips, and surface damage to rebuild a smooth, solid slab that's ready to seal and built to hold up to Alberta winters.",
    // Restored exposed-aggregate driveway (pulled from the project library) — a
    // poured-concrete shot distinct from the sealing card.
    image: "/images/gbp/photo-8.jpg",
    points: ["Spalling & pitting", "Patch & resurface", "Trip-hazard fixes"],
  },
  {
    id: "asphalt-repairs",
    name: "Asphalt Patching & Sealing",
    blurb: "Patch the damage, then sealcoat against the elements.",
    body: "Potholes, cracks, and worn asphalt let water in and spread fast. We patch the damaged areas and apply a protective sealcoat to extend the life of driveways and lots — keeping small problems from turning into a full replacement.",
    // The commercial asphalt lot (fresh seal + line striping) — the one true
    // asphalt shot in the library.
    image: "/images/gbp/photo-5.jpg",
    points: ["Pothole & crack patching", "Sealcoating", "Driveways & lots"],
  },
  {
    id: "paver-sealing",
    name: "Paver Sanding & Sealing",
    blurb: "Lock pavers in place and bring back the colour.",
    body: "We re-sand the joints to stabilize your pavers, then seal the surface to lock the sand in, resist weeds and ants, and deepen the colour — keeping patios, walkways, and driveways tight, clean, and protected.",
    // Real GBP patio shot reused (closest patio context) — swap in an actual
    // paver job photo when the owner supplies one.
    image: "/images/gbp/photo-2.jpg",
    points: ["Polymeric joint sanding", "Weed & ant resistance", "Colour-enhancing seal"],
  },
  {
    id: "stone-sealing",
    name: "Stone Sealing",
    blurb: "Protect natural stone from stains and weather.",
    body: "Natural and manufactured stone is porous and soaks up water, salt, and stains. We seal flagstone, retaining walls, and stone features to repel moisture, resist staining, and hold their finish through Alberta's freeze-thaw cycles.",
    // Real GBP shot with visible stone-veneer columns — swap in a dedicated
    // stone job photo when the owner supplies one.
    image: "/images/gbp/photo-8.jpg",
    points: ["Flagstone & patios", "Retaining walls", "Stain & moisture barrier"],
  },
];

export const benefits = [
  {
    title: "Extends Concrete Lifespan",
    body: "A sealed surface resists cracking, scaling, and surface wear — protecting your investment for years longer.",
  },
  {
    title: "Prevents Costly Repairs",
    body: "Sealing creates a barrier against moisture intrusion, helping you avoid expensive patching or full replacement.",
  },
  {
    title: "Beats Freeze-Thaw Damage",
    body: "Alberta winters are brutal on concrete. Our sealers keep water out so freeze-thaw cycles can't tear the surface apart.",
  },
  {
    title: "Boosts Curb Appeal",
    body: "Clean, rich, finished concrete lifts the whole look of your home — and its resale value.",
  },
  {
    title: "Resists Stains & Salt",
    body: "Oil, de-icing salt, and grime wipe away instead of soaking in and etching the surface.",
  },
  {
    title: "Low Maintenance",
    body: "Sealed and coated concrete cleans up fast and holds its finish with minimal upkeep.",
  },
] as const;

export const processSteps = [
  {
    step: "01",
    title: "Free On-Site Quote",
    body: "We assess your concrete, talk through your goals, and give you a clear, no-pressure quote.",
  },
  {
    step: "02",
    title: "Prep & Clean",
    body: "Thorough cleaning, crack repair, and surface prep — the step that makes a finish last.",
  },
  {
    step: "03",
    title: "Seal, Repair or Protect",
    body: "We apply premium products with the right technique for your surface and the weather window.",
  },
  {
    step: "04",
    title: "Cure & Walk-Through",
    body: "We let it cure properly and walk you through care so your concrete stays protected.",
  },
] as const;

// Projects are now managed in Sanity (Studio at /studio) — see components/Projects.tsx.
// The original GBP photos live in public/images/gbp/ and were seeded via
// scripts/migrate-projects.mjs.

// Public link to the Google Business listing (reviews + "write a review").
// TODO-confirm: swap for the exact Google "write a review" deep link if you have it.
export const googleUrl =
  "https://www.google.com/maps/search/Diamond+Concrete+Sealing+Okotoks";

// Honest, verifiable trust signals — no fabricated testimonials.
// (Real customer review text isn't published yet; we show the real 5.0 rating + facts.)
export const trustSignals = [
  // `live: "rating"` → the Reviews section swaps this stat for the real-time
  // Featurable rating; the literal here is the fallback if that fetch fails.
  { stat: "5.0★", label: "Rated on Google", live: "rating" },
  { stat: "Local", label: "Okotoks owned & operated" },
  { stat: "Premium", label: "Top-grade sealers & materials" },
  { stat: "Free", label: "No-obligation on-site quotes" },
] as const;

export const faqs = [
  {
    q: "Why should I seal my concrete?",
    a: "Sealing blocks water, salt, and UV damage — the main causes of cracking, scaling, and fading. In Alberta's freeze-thaw climate it's the single best way to extend the life of a driveway, patio, or garage floor.",
  },
  {
    q: "How long does concrete sealing last?",
    a: "Depending on the product and traffic, a quality seal typically lasts 2–4 years before a refresh coat. We recommend the right system for your surface and tell you exactly when to re-seal.",
  },
  {
    q: "What's the best time of year to seal in Alberta?",
    a: "Late spring through early fall, when temperatures are mild and the surface is dry. We watch the weather window closely to make sure the product cures properly.",
  },
  {
    q: "Can you remove oil and rust stains from my concrete?",
    a: "Yes — stain removal is one of our core services. We deep-clean and treat oil, grease, rust, and organic staining to pull discoloration out of the surface, then seal it to keep it looking clean.",
  },
  {
    q: "Do you repair cracks before sealing?",
    a: "Always. We clean and fill cracks first so water can't get underneath. Sealing over an unrepaired crack just traps the problem.",
  },
  {
    q: "What areas do you serve?",
    a: `We're based in Okotoks and serve ${business.areaSummary}, including the south Calgary corridor and Foothills communities.`,
  },
] as const;

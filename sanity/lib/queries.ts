import { groq } from "next-sanity";

// Published projects, newest first. A freshly published project always lands at
// the front (the larger "hero" tile in the gallery) and the oldest fall past the
// visible cap into the "View More" overflow tail — no manual ordering to manage.
export const projectsQuery = groq`
  *[_type == "project" && defined(image.asset)] | order(_createdAt desc){
    _id,
    title,
    description,
    "alt": image.alt,
    image,
    // Natural dimensions drive the lightbox's aspect-correct full-size render
    // (the grid tile is a forced square crop; the lightbox shows the real ratio).
    "dimensions": image.asset->metadata.dimensions,
    // Tiny base64 preview Sanity stores per asset — used as the next/image blur.
    "lqip": image.asset->metadata.lqip
  }
`;

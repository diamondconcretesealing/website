import type { MetadataRoute } from "next";
import { business } from "@/lib/content";

// Colors mirror app/globals.css @theme: --color-ink (#0a0e14) and
// --color-brand (#f0a235). A web manifest can't read CSS vars, so these literals
// must stay in sync with the theme tokens by hand.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: business.name,
    short_name: business.shortName,
    description: business.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0e14",
    theme_color: "#f0a235",
    icons: [
      { src: "/icon.png", sizes: "256x256", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}

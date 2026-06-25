import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/content";

// Single-page site: the only indexable URL is the root. The in-page nav uses
// hash anchors (#services, #contact, …) which are fragments of "/", NOT separate
// URLs — listing them would create invalid duplicate entries.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}

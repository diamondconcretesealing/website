import { NextStudio } from "next-sanity/studio";

import config from "@/sanity.config";

// The Studio is a single-page app; this route serves it at /studio.
export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}

import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

import { dataset, projectId } from "@/sanity/env";

const builder = createImageUrlBuilder({ projectId, dataset });

// Build a CDN URL for a Sanity image (resize/crop/format via the fluent API).
export const urlFor = (source: SanityImageSource) => builder.image(source);

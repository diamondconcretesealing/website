import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/env";

// Read-only client for fetching PUBLISHED content on the public site.
// Public dataset + perspective:"published" means no API token is required.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

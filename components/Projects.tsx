import type { SanityImageSource } from "@sanity/image-url";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ProjectsGallery, type GalleryItem } from "@/components/ProjectsGallery";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { projectsQuery } from "@/sanity/lib/queries";

type ProjectDoc = {
  _id: string;
  title?: string;
  description?: string;
  alt?: string;
  image: SanityImageSource;
  dimensions?: { width: number; height: number; aspectRatio: number };
  lqip?: string;
};

async function getProjects(): Promise<ProjectDoc[]> {
  // Projects are managed by the client in Sanity Studio (/studio).
  // Tagged so an optional webhook could revalidate on publish; time-based
  // ISR on the page (app/page.tsx) is the baseline freshness guarantee.
  // On any fetch error (Sanity down, not yet configured) we degrade to an
  // empty gallery rather than breaking the whole homepage.
  try {
    return await client.fetch<ProjectDoc[]>(
      projectsQuery,
      {},
      { next: { tags: ["projects"] } }
    );
  } catch (err) {
    console.error("Failed to load projects from Sanity:", err);
    return [];
  }
}

export async function Projects() {
  const projects = await getProjects();

  // Flatten to serializable gallery items (precompute the image URL here so the
  // client gallery stays free of Sanity deps). Order is preserved from the
  // query — newest first — so the client component can treat the tail as the
  // "older work" that lives behind the View More card.
  const items: GalleryItem[] = projects.map((p) => {
    const alt = p.alt || p.title || "Diamond Concrete Sealing project";
    // Lightbox shows the image at its real aspect ratio. Cap the width at 1600px
    // (but never above the source width — fit("max") won't upscale, so asserting
    // a larger intrinsic size would mislead next/image's srcset). Derive height
    // from the stored ratio; fall back to square if metadata is missing.
    const aspect =
      p.dimensions && p.dimensions.aspectRatio > 0 ? p.dimensions.aspectRatio : 1;
    const fullWidth = Math.min(1600, p.dimensions?.width || 1600);
    const fullHeight = Math.round(fullWidth / aspect);
    return {
      id: p._id,
      alt,
      // Hover caption shows the description only — never the alt text (alt is
      // for accessibility/SEO, not display). Empty when there's no description.
      caption: p.description || "",
      // Square crop for the bento grid (manufactures coherence over a
      // mixed-ratio library).
      src: urlFor(p.image)
        .width(1200)
        .height(1200)
        .fit("crop")
        .auto("format")
        .url(),
      // Uncropped render for the tap-to-enlarge lightbox, sized to match the
      // intrinsic dimensions asserted above.
      full: urlFor(p.image).width(fullWidth).fit("max").auto("format").url(),
      width: fullWidth,
      height: fullHeight,
      lqip: p.lqip,
    };
  });

  return (
    <Section id="projects" className="bg-surface">
      <SectionHeading
        eyebrow="Recent Projects"
        title="Concrete we're proud of."
      />
      <p className="mt-5 max-w-2xl text-white/70">
        A look at recent sealing, repair, and restoration work around Okotoks and the Foothills.
      </p>

      {items.length > 0 && <ProjectsGallery items={items} />}
    </Section>
  );
}

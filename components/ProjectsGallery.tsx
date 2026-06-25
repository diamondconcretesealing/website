"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

// Heaviest component in the gallery (portal, keyboard trap, 11 hooks) and only
// needed after a tap — load it on demand to keep it out of the initial bundle.
const Lightbox = dynamic(
  () => import("@/components/Lightbox").then((m) => m.Lightbox),
  { ssr: false }
);

export type GalleryItem = {
  id: string;
  alt: string;
  caption: string;
  // Square crop for the grid tile.
  src: string;
  // Uncropped, larger render + its natural dimensions for the lightbox.
  full: string;
  width: number;
  height: number;
  // Sanity-provided base64 blur placeholder.
  lqip?: string;
};

// Tiles shown before the "View More" card appears. The first tile renders as a
// 2×2 anchor, so 5 visible tiles + the toggle card fill the 3-column (lg) bento
// exactly; on the 2-column mobile bento the toggle spans full width so it never
// orphans a half-empty row. With the default Studio ordering (every project
// shares order=100) the query's newest-first tiebreak puts a freshly published
// project at the front and pushes the oldest past this cap — a curated `order`
// in Studio overrides that recency.
const VISIBLE_CAP = 5;

// How many more tiles each "View More" click reveals. Revealing in batches keeps
// a large library from dumping every tile inline at once (which would make the
// expanded section enormous). The card keeps offering the next batch until the
// whole library is shown, then flips to "Show Less" to collapse back to the cap.
const BATCH = 6;

export function ProjectsGallery({ items }: { items: GalleryItem[] }) {
  const [visibleCount, setVisibleCount] = useState(VISIBLE_CAP);
  // Index of the tile open in the lightbox, or null when closed. Indexes the
  // full `items` library (not the shown slice), so the lightbox's prev/next can
  // page through every project — even ones still hidden behind "View More". A
  // tile's index is identical in `items` and `shown` (shown is a head slice),
  // so a tap still opens the right image.
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  // The tile that opened the lightbox — focus returns here on close. Captured
  // from the click target (not document.activeElement, which is unreliable:
  // Safari/iOS don't focus a <button> on tap, so the opener can't be inferred
  // after the fact).
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const gridId = useId();

  const closeLightbox = () => {
    setActiveIndex(null);
    triggerRef.current?.focus();
  };

  const hasOverflow = items.length > VISIBLE_CAP;
  // Clamp: never try to show more tiles than exist.
  const shownCount = hasOverflow
    ? Math.min(visibleCount, items.length)
    : items.length;
  const remaining = items.length - shownCount;
  const allShown = remaining <= 0;
  const expanded = shownCount > VISIBLE_CAP;
  const shown = items.slice(0, shownCount);

  // "View More" reveals the next batch; once everything is shown the same
  // control collapses back to the initial cap. The toggle is always the final
  // grid cell and carries a stable `key`, so it reconciles to the same DOM node
  // — keyboard focus stays put across every click.
  const onToggle = () =>
    setVisibleCount((c) => (allShown ? VISIBLE_CAP : c + BATCH));

  return (
    <>
    <div
      id={gridId}
      className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3"
    >
      {shown.map((item, i) => (
        <figure
          key={item.id}
          className={`group relative aspect-square overflow-hidden rounded-xl border border-line bg-surface-2 ${
            i === 0 ? "col-span-2 row-span-2" : ""
          }`}
        >
          {/* The whole tile is the tap target — opens the lightbox so phone
              users (no hover) can see the image larger with its description. */}
          <button
            type="button"
            onClick={(e) => {
              triggerRef.current = e.currentTarget;
              setActiveIndex(i);
            }}
            aria-label={`View ${item.caption || item.alt} larger`}
            className="absolute inset-0 cursor-pointer rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
          >
            {/* Decorative here — the button's aria-label is the accessible name,
                so the image is alt="" to avoid a double announcement. The
                lightbox's copy of this image keeps a real alt. */}
            <Image
              src={item.src}
              alt=""
              fill
              sizes="(max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              {...(item.lqip
                ? { placeholder: "blur" as const, blurDataURL: item.lqip }
                : {})}
            />
          </button>
          {item.caption && (
            // The darkening gradient + caption are a hover affordance, revealed
            // together on `group-hover`. `:hover` never fires on touch, so phone
            // tiles stay clean (the lightbox supplies the caption there), and
            // desktop tiles only darken while actually hovered — not at rest.
            // pointer-events-none keeps taps falling through to the button.
            <figcaption
              // Decorative hover reveal only — the button's aria-label already
              // carries this text as the tile's accessible name, so hide the
              // duplicate from assistive tech.
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-transparent to-transparent p-4 text-sm text-white/0 transition-colors group-hover:from-ink/90 group-hover:text-white/90"
            >
              {item.caption}
            </figcaption>
          )}
        </figure>
      ))}

      {hasOverflow && (
        <button
          key="view-more-toggle"
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls={gridId}
          aria-label={
            allShown
              ? "Show less projects"
              : `View more projects, ${remaining} more available`
          }
          className="group col-span-2 flex aspect-[2/1] flex-col items-center justify-center gap-1 rounded-xl border border-line bg-surface-2 transition-colors duration-200 hover:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink lg:col-span-1 lg:aspect-square"
        >
          <span
            aria-hidden="true"
            className="font-display text-4xl leading-none text-brand sm:text-5xl"
          >
            {allShown ? "↑" : `+${remaining}`}
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70 transition-colors group-hover:text-brand">
            {allShown ? "Show Less" : "View More"}
          </span>
        </button>
      )}
    </div>

      {activeIndex !== null && items[activeIndex] && (
        <Lightbox
          items={items}
          index={activeIndex}
          onClose={closeLightbox}
          onNavigate={setActiveIndex}
        />
      )}
    </>
  );
}

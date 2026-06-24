"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import logoWhite from "@/public/logo-white.png";
import type { GalleryItem } from "@/components/ProjectsGallery";

type LightboxProps = {
  items: GalleryItem[];
  // Index of the open item within `items`. The caller only renders the lightbox
  // when this points at a real item, so `items[index]` is always defined here.
  index: number;
  onClose: () => void;
  onNavigate: (next: number) => void;
};

// Full-screen image viewer for the projects gallery. Tapping a tile opens it —
// the affordance that replaces hover (which never fires on touch) for reading a
// project's description on a phone.
//
// Accessibility: it's a real modal dialog — focus moves in on open and is
// trapped, Escape and a backdrop tap close it, and the page behind is
// scroll-locked. Focus returns to the opening tile via the parent's onClose
// (the parent captured that element on click — see ProjectsGallery). Rendered
// through a portal on <body> so it escapes the gallery's `overflow-hidden` and
// stacking context.
export function Lightbox({ items, index, onClose, onNavigate }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const item = items[index];
  const hasPrev = index > 0;
  const hasNext = index < items.length - 1;

  // The full image for each index loads on demand. Until the *current* one
  // decodes we keep the <img> transparent (so the previous photo's pixels never
  // bleed through) and show the branded loader over it instead. Tracking which
  // index has loaded — rather than flipping a boolean in an effect — means
  // `loaded` is already false on the first render after navigating, so there's
  // no one-frame flash of the stale image.
  const [loadedIndex, setLoadedIndex] = useState<number | null>(null);
  const loaded = loadedIndex === index;

  // A cached image is `complete` on mount and may not fire onLoad — detect that
  // so the loader doesn't linger over an image that's already there.
  useEffect(() => {
    if (imgRef.current?.complete) setLoadedIndex(index);
  }, [index]);

  const goPrev = useCallback(() => {
    if (hasPrev) onNavigate(index - 1);
  }, [hasPrev, index, onNavigate]);

  const goNext = useCallback(() => {
    if (hasNext) onNavigate(index + 1);
  }, [hasNext, index, onNavigate]);

  // Lock body scroll while open and move focus into the dialog. Runs once for
  // the dialog's lifetime — navigating between images keeps the same instance
  // mounted. (Focus restoration on close is handled by the parent, which knows
  // the exact tile that opened the lightbox.)
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // Re-home focus after navigating. At the first/last image the focused Prev/Next
  // button unmounts, which drops focus to <body> (outside the dialog) and would
  // break the trap. When that happens, pull focus back to the always-present
  // Close button. Mid-gallery navigation leaves focus on the still-mounted
  // arrow, so this is a no-op there (the dialog still contains the active element).
  useEffect(() => {
    if (!dialogRef.current?.contains(document.activeElement)) {
      closeBtnRef.current?.focus();
    }
  }, [index]);

  // Keyboard: Escape closes, arrows navigate, Tab is trapped inside the dialog.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "Tab") {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        // Self-heal: if focus has somehow escaped the dialog, pull it back in
        // rather than letting Tab walk into the page behind the scrim.
        if (!dialogRef.current?.contains(document.activeElement)) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, goPrev, goNext]);

  const captionId = "lightbox-caption";

  // The lightbox only ever mounts after a client click, but guard anyway so a
  // server render can never touch document.body.
  if (typeof document === "undefined") return null;

  return createPortal(
    // Backdrop: a tap on the dark scrim (outside the dialog) closes.
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        // The dialog always needs an accessible NAME (alt — always non-empty);
        // the caption is the additive description, not a substitute for the name.
        aria-label={item.alt}
        aria-describedby={item.caption ? captionId : undefined}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-full w-full max-w-5xl flex-col items-center overflow-y-auto outline-none"
      >
        {/* Top bar: position counter + close. */}
        <div className="mb-3 flex w-full items-center justify-between">
          <span className="text-xs uppercase tracking-[0.25em] text-white/50">
            {index + 1} / {items.length}
          </span>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-lg leading-none text-white transition-colors hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            ✕
          </button>
        </div>

        {/* Image + branded loader share one box. The <img> fades in once decoded;
            until then it's transparent and the spinning-ring logo covers it, so
            navigating never shows the previous photo while the next one loads. */}
        <div className="relative flex w-full items-center justify-center">
          <Image
            ref={imgRef}
            src={item.full}
            alt={item.alt}
            width={item.width}
            height={item.height}
            sizes="(max-width: 768px) 92vw, 80vw"
            onLoad={() => setLoadedIndex(index)}
            className={`h-auto max-h-[72vh] w-auto max-w-full rounded-xl border border-line object-contain transition-opacity duration-300 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            // Eager (not `priority`): the modal image must load immediately, but
            // `priority` would inject a preload <link> for a new src on every
            // prev/next and warn about unused preloads.
            loading="eager"
          />

          {!loaded && (
            // Branded loading state: the logo with a ring spinning around it.
            // Decorative — the dialog already names itself via aria-label.
            <div
              className="pointer-events-none absolute inset-0 grid place-items-center"
              aria-hidden="true"
            >
              <div className="relative grid h-24 w-24 place-items-center sm:h-28 sm:w-28">
                <span className="absolute inset-0 animate-spin rounded-full border-2 border-line border-t-brand" />
                <Image src={logoWhite} alt="" className="h-10 w-auto opacity-90 sm:h-12" />
              </div>
            </div>
          )}
        </div>

        {item.caption && (
          <p
            id={captionId}
            className="mt-4 max-w-2xl text-center text-sm text-white/80 sm:text-base"
          >
            {item.caption}
          </p>
        )}

        {/* Prev / next. Rendered only when a neighbour exists, so the trap never
            lands on a dead control. */}
        {hasPrev && (
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous project"
            className="absolute left-0 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-ink/70 text-xl leading-none text-white transition-colors hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            ‹
          </button>
        )}
        {hasNext && (
          <button
            type="button"
            onClick={goNext}
            aria-label="Next project"
            className="absolute right-0 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-ink/70 text-xl leading-none text-white transition-colors hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            ›
          </button>
        )}
      </div>
    </div>,
    document.body
  );
}

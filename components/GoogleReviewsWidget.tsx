"use client";

import { useEffect, useState } from "react";
import {
  ReactGoogleReviews,
  type ReactGoogleReview,
} from "react-google-reviews";

// Auto-syncing Google reviews via the free Featurable API.
// Featurable refreshes from Google ~every 48h, so new reviews appear on their
// own — the client never touches code. Rendered with a fully custom,
// Dark-Editorial layout (one accent = amber stars, hairline-seam grid,
// opacity text ladder) so it matches the house style exactly.
// Must be a Client Component (it fetches in the browser).

function Stars({ rating }: { rating: number }) {
  return (
    <div
      className="flex gap-0.5 text-lg"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          aria-hidden
          className={n <= rating ? "text-brand" : "text-white/15"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function renderReviews(reviews: ReactGoogleReview[]) {
  const withText = reviews
    .filter(
      (r) =>
        r.starRating >= 4 && r.comment && r.comment.trim().length > 0,
    )
    .slice(0, 6);

  if (withText.length === 0) return null;

  // Adapt column count to how many reviews exist so 1–2 reviews don't stretch
  // into an awkward full-width void. Always single-column on mobile; the
  // container shrinks to its content (w-fit) and stays left-aligned.
  const cols = Math.min(withText.length, 3);

  return (
    <div
      className="grid w-fit max-w-full grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:[grid-template-columns:repeat(var(--review-cols),minmax(0,22rem))]"
      style={{ "--review-cols": cols } as React.CSSProperties}
    >
      {withText.map((r, i) => {
        const name = r.reviewer.isAnonymous
          ? "Google user"
          : r.reviewer.displayName;
        const initial = name.charAt(0).toUpperCase();
        return (
          <figure
            key={r.reviewId ?? i}
            className="flex flex-col gap-4 bg-surface p-7 sm:p-8"
          >
            <Stars rating={r.starRating} />
            <blockquote className="line-clamp-6 leading-relaxed text-white/70">
              {r.comment}
            </blockquote>
            <figcaption className="mt-auto flex items-center gap-3 pt-2">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-surface-2 text-sm font-semibold text-white/70">
                {initial}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm text-white/90">
                  {name}
                </span>
                <span className="block text-xs text-white/40">
                  Posted on Google
                </span>
              </span>
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}

export function GoogleReviewsWidget({ widgetId }: { widgetId: string }) {
  // Render client-only: the widget fetches in the browser and its Emotion
  // CSS-in-JS injects SSR <style> tags that don't survive hydration. Skipping
  // SSR avoids the mismatch with no visible cost (reviews load async anyway).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <ReactGoogleReviews
      layout="custom"
      featurableId={widgetId}
      widgetVersion="v2"
      renderer={renderReviews}
      structuredData
      brandName="Diamond Concrete Sealing"
      productName="Concrete Sealing & Repair"
      loadingMessage="Loading reviews…"
      loaderLabelClassName="text-sm text-white/40"
      errorMessage=""
    />
  );
}

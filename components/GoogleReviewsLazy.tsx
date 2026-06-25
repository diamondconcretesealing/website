"use client";

import dynamic from "next/dynamic";

// Lazy boundary for the reviews widget. ssr:false is legal here because this is
// a Client Component (illegal in a Server Component like Reviews.tsx). Keeps
// react-google-reviews + Emotion out of the initial bundle — the widget is
// below the fold and fetches client-side anyway.
const GoogleReviewsWidget = dynamic(
  () =>
    import("@/components/GoogleReviewsWidget").then(
      (m) => m.GoogleReviewsWidget
    ),
  { ssr: false, loading: () => null }
);

export function GoogleReviewsLazy({ widgetId }: { widgetId: string }) {
  return <GoogleReviewsWidget widgetId={widgetId} />;
}

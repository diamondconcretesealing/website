import { business } from "@/lib/content";

// Live Google rating + review count, pulled server-side from the same
// Featurable widget that feeds the review cards (v2 API). Featurable refreshes
// from Google ~every 48h, so the headline rating tracks reality on its own —
// no code change when a new review lands. Falls back to the values baked into
// `business` if the widget is unset or the fetch fails, so the section never
// renders a blank or an error.

export type ReviewStats = { rating: number; count: number };

const FALLBACK: ReviewStats = {
  rating: business.rating,
  count: business.ratingCount,
};

export async function getReviewStats(): Promise<ReviewStats> {
  const id = process.env.NEXT_PUBLIC_FEATURABLE_WIDGET_ID;
  if (!id) return FALLBACK;

  try {
    const res = await fetch(`https://api.featurable.com/v2/widgets/${id}`, {
      // Revalidate daily — comfortably inside Featurable's ~48h Google sync.
      next: { revalidate: 86_400 },
    });
    if (!res.ok) return FALLBACK;

    const data = (await res.json()) as {
      success?: boolean;
      widget?: { gbpLocationSummary?: { rating?: number; reviewsCount?: number } };
    };
    const summary = data.widget?.gbpLocationSummary;
    if (!data.success || typeof summary?.rating !== "number") return FALLBACK;

    return {
      rating: summary.rating,
      count: summary.reviewsCount ?? FALLBACK.count,
    };
  } catch {
    return FALLBACK;
  }
}

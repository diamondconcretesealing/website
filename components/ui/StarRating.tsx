// Fractional star rating. Renders a muted 5-star row with an amber row clipped
// on top to the exact fill width, so any rating shows a precise partial star —
// 4.7 → 94% filled. Pure CSS overlay (no images); inherits font-size + letter
// tracking from `className` so both layers stay aligned at any scale.

export function StarRating({
  rating,
  className = "",
}: {
  rating: number;
  className?: string;
}) {
  const pct = (Math.max(0, Math.min(5, rating)) / 5) * 100;

  return (
    <span
      className={`relative inline-block whitespace-nowrap ${className}`}
      role="img"
      aria-label={`${rating.toFixed(1)} out of 5 stars`}
    >
      <span className="text-white/25" aria-hidden>
        ★★★★★
      </span>
      <span
        className="absolute inset-0 overflow-hidden text-brand"
        style={{ width: `${pct}%` }}
        aria-hidden
      >
        ★★★★★
      </span>
    </span>
  );
}

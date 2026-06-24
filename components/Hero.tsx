import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { business } from "@/lib/content";
import { getReviewStats } from "@/lib/featurableStats";

export async function Hero() {
  // Live Google rating (falls back to business.rating if the fetch fails).
  const { rating } = await getReviewStats();
  const ratingLabel = rating.toFixed(1);

  return (
    <section id="top" className="relative isolate overflow-hidden">
      {/* Background video (self-hosted at public/hero.mp4). The poster image shows
          instantly and covers slow connections / reduced-data while the clip loads. */}
      <video
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        poster="/images/hero-poster.jpg"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Slate gradient overlay for contrast + brand tone */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-ink/95 via-ink/80 to-ink/55" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink to-transparent" />

      <div className="section-x">
        <div className="mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end pb-16 pt-32 sm:pb-24">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-brand">
            {business.city}, {business.provinceAbbr} · Concrete Specialists
          </p>

          {/* Offset, oversized wordmark — asymmetric, not centered */}
          <h1 className="font-display max-w-4xl text-white text-6xl sm:text-7xl md:text-8xl">
            Diamond
            <span className="block text-brand">Concrete Sealing</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-white/80">
            Premium sealing, crack repair, and concrete restoration that protects your concrete
            against Alberta winters — and makes it look better than the day it was poured.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href="#contact">Get a Free Quote</Button>
            <Button href={business.phoneHref} variant="outline">
              Call {business.phoneDisplay}
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70">
            <span className="flex items-center gap-1.5">
              <StarRating rating={rating} />
              {ratingLabel} on Google
            </span>
            <span className="hidden sm:inline text-line">|</span>
            <span>Serving {business.areaSummary}</span>
            <span className="hidden sm:inline text-line">|</span>
            <span>Premium materials, lasting results</span>
          </div>
        </div>
      </div>
    </section>
  );
}

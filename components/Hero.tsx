import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { business } from "@/lib/content";
import { getReviewStats } from "@/lib/featurableStats";

export async function Hero() {
  // Live Google rating (falls back to business.rating if the fetch fails).
  const { rating } = await getReviewStats();
  const ratingLabel = rating.toFixed(1);

  return (
    <section id="top" className="relative isolate min-h-[calc(100lvh_-_4rem_-_env(safe-area-inset-top))] overflow-hidden">
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
        <div className="mx-auto flex min-h-[88svh] max-w-6xl flex-col justify-end pb-12 pt-24 sm:pb-28 sm:pt-32">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-brand">
            {business.city}, {business.provinceAbbr} · Concrete Specialists
          </p>

          {/* Offset, oversized wordmark — asymmetric, not centered */}
          <h1 className="font-display max-w-4xl text-white text-5xl sm:text-7xl md:text-8xl">
            Diamond
            <span className="block text-brand">Concrete Sealing</span>
          </h1>

          <p className="mt-4 max-w-xl text-base text-white/80 sm:mt-6 sm:text-lg">
            Premium sealing, crack repair, and concrete restoration that protects your concrete
            against Alberta winters — and makes it look better than the day it was poured.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:mt-9 sm:flex-row">
            <Button href="#contact">Get a Free Quote</Button>
            <Button href={business.phoneHref} variant="outline" shine>
              Call {business.phoneDisplay}
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70 sm:mt-10">
            <span className="flex items-center gap-1.5">
              {/* mobile: single star to match the other trust icons; full rating on sm+ */}
              <StarIcon className="sm:hidden" />
              <span className="hidden sm:inline-flex">
                <StarRating rating={rating} />
              </span>
              {ratingLabel} on Google
            </span>
            <span className="hidden sm:inline text-line">|</span>
            <span className="flex items-center gap-1.5">
              <PinIcon />
              Serving {business.areaSummary}
            </span>
            <span className="hidden sm:inline text-line">|</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheckIcon />
              Premium materials, lasting results
            </span>
          </div>
        </div>
      </div>

      {/* Floating scroll cue */}
      <a
        href="#about"
        aria-label="Scroll to learn more"
        className="animate-hero-bob absolute bottom-[calc(1.5rem_+_env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 text-white/60 transition-colors hover:text-brand"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 5v14M6 13l6 6 6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  );
}

function StarIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={`text-brand ${className}`}>
      <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 18.9 6.1 21.5l1.2-6.5L2.5 9.4l6.6-.9L12 2.5Z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-brand">
      <path d="M12 21s7-5.686 7-11a7 7 0 1 0-14 0c0 5.314 7 11 7 11Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-brand">
      <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

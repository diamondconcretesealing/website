import { Section, SectionHeading } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { GoogleReviewsLazy } from "@/components/GoogleReviewsLazy";
import { business, trustSignals, googleUrl } from "@/lib/content";
import { getReviewStats } from "@/lib/featurableStats";

export async function Reviews() {
  // When set, real Google reviews are pulled + auto-refreshed by Featurable.
  // Left unset (e.g. before the client configures it), the section still
  // renders the verifiable rating + trust signals below.
  const featurableWidgetId = process.env.NEXT_PUBLIC_FEATURABLE_WIDGET_ID;

  // Live headline rating from the same widget (falls back to business.rating).
  const { rating } = await getReviewStats();
  const ratingLabel = rating.toFixed(1);

  return (
    <Section id="reviews">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        {/* Left: the real, verifiable rating + CTA */}
        <div>
          <SectionHeading
            eyebrow="Trusted Locally"
            title={`Rated ${ratingLabel} on Google.`}
          />
          <div className="mt-5 flex items-center gap-3">
            <StarRating rating={rating} className="text-2xl tracking-widest" />
            <span className="text-white/70">
              {rating >= 5 ? `Perfect ${ratingLabel} rating` : `${ratingLabel} rating`}
            </span>
          </div>
          <p className="mt-5 max-w-md text-white/70 leading-relaxed">
            We&apos;re a growing, locally owned concrete company in {business.city} — and we treat
            every driveway, patio, and garage floor like it&apos;s our own. Premium materials,
            honest quotes, and work we stand behind.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href={googleUrl} target="_blank" rel="noopener noreferrer">
              See us on Google
            </Button>
            <Button href="#contact" variant="outline">
              Get a Free Quote
            </Button>
          </div>
          <p className="mt-4 text-sm text-white/50">
            Worked with us? We&apos;d love a review — it helps your neighbours find us.
          </p>
        </div>

        {/* Right: verifiable trust signals */}
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
          {trustSignals.map((t) => {
            const stat =
              "live" in t && t.live === "rating" ? `${ratingLabel}★` : t.stat;
            return (
              <div key={t.label} className="bg-surface p-7 sm:p-8">
                <div className="font-display text-4xl text-brand">{stat}</div>
                <div className="mt-2 text-sm text-white/70">{t.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {featurableWidgetId && (
        <div className="mt-14">
          <GoogleReviewsLazy widgetId={featurableWidgetId} />
        </div>
      )}
    </Section>
  );
}

import Image from "next/image";
import { Section, SectionHeading } from "@/components/ui/Section";
import { business } from "@/lib/content";
import { blurProps } from "@/lib/blur";

export function About() {
  return (
    <Section id="about" className="bg-surface">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHeading eyebrow="The Diamond Standard" title="Concrete experts you can trust." />
          <p className="mt-6 text-lg leading-relaxed text-white/75">{business.description}</p>
          <p className="mt-4 leading-relaxed text-white/70">
            Based in {business.city}, {business.province}, we help homeowners across{" "}
            {business.areaSummary} protect their driveways, garages, patios, and walkways from
            the freeze-thaw cycles, road salt, and UV exposure that wear concrete down. Every
            project gets premium materials and proper prep — the difference between a finish
            that lasts and one that peels.
          </p>

          <dl className="mt-8 grid grid-cols-3 gap-6 border-t border-line pt-8">
            <div>
              <dt className="text-3xl font-display text-brand">5.0★</dt>
              <dd className="mt-1 text-sm text-white/60">Google rating</dd>
            </div>
            <div>
              <dt className="text-3xl font-display text-brand">100%</dt>
              <dd className="mt-1 text-sm text-white/60">Premium materials</dd>
            </div>
            <div>
              <dt className="text-3xl font-display text-brand">Local</dt>
              <dd className="mt-1 text-sm text-white/60">Okotoks owned</dd>
            </div>
          </dl>
        </div>

        {/* Placeholder image panel — swap with a real project photo */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-surface-2">
          <Image
            src="/images/gbp/photo-1.jpg"
            alt="Freshly sealed exposed-aggregate walkway"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            {...blurProps("/images/gbp/photo-1.jpg")}
          />
        </div>
      </div>
    </Section>
  );
}

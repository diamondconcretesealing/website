import Image from "next/image";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { BeforeAfter } from "@/components/BeforeAfter";
import { services } from "@/lib/content";

export function Services() {
  return (
    <Section id="services">
      <SectionHeading
        eyebrow="What We Do"
        title={
          <>
            Services built to <span className="text-brand">protect & elevate</span>
          </>
        }
      />

      {/* Alternating full-width rows — a deliberate departure from the reference's 4 equal tiles */}
      <div className="mt-14 flex flex-col gap-6">
        {services.map((s, i) => (
          <article
            key={s.id}
            className="group grid overflow-hidden rounded-2xl border border-line bg-surface md:grid-cols-2"
          >
            <div
              className={`relative min-h-56 overflow-hidden bg-surface-2 ${
                i % 2 === 1 ? "md:order-2" : ""
              }`}
            >
              {s.compare ? (
                <BeforeAfter before={s.compare.before} after={s.compare.after} alt={s.name} />
              ) : (
                <Image
                  src={s.image}
                  alt={s.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={`${s.imageFit ?? "object-cover"} transition-transform duration-500 group-hover:scale-105`}
                />
              )}
            </div>

            <div className="flex flex-col justify-center gap-4 p-8 sm:p-10">
              <h3 className="font-display text-3xl text-white">{s.name}</h3>
              <p className="text-brand">{s.blurb}</p>
              <p className="text-white/70 leading-relaxed">{s.body}</p>
              <ul className="flex flex-wrap gap-2 pt-1">
                {s.points.map((p) => (
                  <li
                    key={p}
                    className="rounded-full border border-line px-3 py-1 text-xs text-white/70"
                  >
                    {p}
                  </li>
                ))}
              </ul>
              <div className="pt-2">
                <Button href="#contact" variant="outline" className="!h-10 !px-5 !text-xs">
                  Get a Quote
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

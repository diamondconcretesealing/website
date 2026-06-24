import { Section, SectionHeading } from "@/components/ui/Section";
import { processSteps } from "@/lib/content";

export function Process() {
  return (
    <Section id="process">
      <SectionHeading eyebrow="How It Works" title="Four steps to lasting concrete." />

      <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {processSteps.map((p, i) => (
          <div key={p.step} className="relative">
            {/* connector line on large screens */}
            {i < processSteps.length - 1 && (
              <div className="absolute left-12 top-6 hidden h-px w-full bg-line lg:block" />
            )}
            <div className="relative grid h-12 w-12 place-items-center rounded-full border border-brand bg-ink font-display text-brand">
              {p.step}
            </div>
            <h3 className="mt-5 font-display text-xl text-white">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{p.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

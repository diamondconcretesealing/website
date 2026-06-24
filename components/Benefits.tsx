import { Section, SectionHeading } from "@/components/ui/Section";
import { benefits } from "@/lib/content";

export function Benefits() {
  return (
    <Section id="benefits" className="bg-surface">
      <SectionHeading
        eyebrow="Why Seal"
        align="center"
        title={
          <>
            A project you didn&apos;t know you needed —{" "}
            <span className="text-brand">until now</span>
          </>
        }
      />
      <p className="mx-auto mt-5 max-w-2xl text-center text-white/70">
        Sealing is the cheapest insurance your concrete will ever get. Here&apos;s what it does
        for your driveway, garage, and patio.
      </p>

      <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map((b) => (
          <div key={b.title} className="bg-surface p-8">
            <div className="mb-4 h-1 w-10 rounded-full bg-brand" />
            <h3 className="font-display text-xl text-white">{b.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/70">{b.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

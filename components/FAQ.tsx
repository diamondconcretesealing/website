import { Section, SectionHeading } from "@/components/ui/Section";
import { Accordion } from "@/components/ui/Accordion";
import { faqs } from "@/lib/content";

export function FAQ() {
  return (
    <Section id="faq" className="bg-surface">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading
          eyebrow="FAQ"
          title={
            <>
              Questions,
              <br />
              answered.
            </>
          }
        />
        <Accordion items={faqs} />
      </div>
    </Section>
  );
}

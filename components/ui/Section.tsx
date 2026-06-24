import type { ReactNode } from "react";

type Props = {
  id?: string;
  children: ReactNode;
  className?: string;
};

/** Consistent vertical rhythm + horizontal padding for page sections. */
export function Section({ id, children, className = "" }: Props) {
  return (
    <section id={id} className={`section-x py-20 sm:py-28 ${className}`}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

type HeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  align = "left",
  className = "",
}: HeadingProps) {
  return (
    <div className={`${align === "center" ? "text-center mx-auto max-w-2xl" : ""} ${className}`}>
      {eyebrow && (
        <span className="inline-block text-xs font-semibold uppercase tracking-[0.25em] text-brand">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display mt-3 text-4xl sm:text-5xl text-white">{title}</h2>
    </div>
  );
}

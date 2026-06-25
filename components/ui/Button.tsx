import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "outline" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink";

const sizes = "h-12 px-7 text-sm uppercase";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-ink hover:bg-brand-strong",
  outline: "border border-line text-white hover:border-brand hover:text-brand",
  ghost: "text-white/80 hover:text-brand",
};

type Props = ComponentProps<typeof Link> & { variant?: Variant; shine?: boolean };

export function Button({ variant = "primary", className = "", shine = false, children, ...props }: Props) {
  return (
    <Link
      className={`${base} ${sizes} ${variants[variant]} ${shine ? "relative overflow-hidden" : ""} ${className}`}
      {...props}
    >
      {children}
      {shine && (
        <span
          aria-hidden="true"
          className="animate-btn-shine pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />
      )}
    </Link>
  );
}

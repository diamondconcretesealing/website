"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logoWhite from "@/public/logo-white.png";
import { Button } from "@/components/ui/Button";
import { business, nav } from "@/lib/content";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-ink/85 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <div className="section-x">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4">
          {/* Wordmark */}
          <Link href="#top" className="flex items-center" onClick={() => setOpen(false)}>
            <Image
              src={logoWhite}
              alt="Diamond Concrete Sealing"
              className="h-8 w-auto sm:h-9"
            />
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-white/75 transition-colors hover:text-brand"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href={business.phoneHref}
              className="text-sm font-semibold text-white hover:text-brand"
            >
              {business.phoneDisplay}
            </a>
            <Button href="#contact" className="!h-10 !px-5 !text-xs">
              Free Quote
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="lg:hidden grid h-10 w-10 place-items-center rounded-md border border-line text-white"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="text-xl leading-none">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden border-t border-line bg-ink">
          <nav aria-label="Mobile" className="section-x flex flex-col gap-1 py-4">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-3 text-base font-medium text-white/80 hover:bg-surface-2 hover:text-brand"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-3 px-2">
              <a href={business.phoneHref} className="text-base font-semibold text-brand">
                {business.phoneDisplay}
              </a>
              <Button href="#contact" onClick={() => setOpen(false)}>
                Free Quote
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

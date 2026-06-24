import Link from "next/link";
import Image from "next/image";
import logoWhite from "@/public/logo-white.png";
import { business, hours, nav } from "@/lib/content";

// Collapse consecutive days that share the same hours into ranges (e.g. Mon–Fri).
const short = (d: string) => d.slice(0, 3);
const hourGroups: { label: string; time: string; closed: boolean }[] = [];
for (const h of hours) {
  const last = hourGroups[hourGroups.length - 1];
  if (last && last.time === h.time) {
    last.label = `${last.label.split("–")[0]}–${short(h.day)}`;
  } else {
    hourGroups.push({ label: short(h.day), time: h.time, closed: h.closed });
  }
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="section-x py-12 sm:py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 lg:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2">
            <Image
              src={logoWhite}
              alt="Diamond Concrete Sealing"
              className="h-9 w-auto sm:h-10"
            />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              Premium concrete sealing, crack repair, pressure washing, and asphalt repair in {business.city},{" "}
              {business.province}. Serving {business.areaSummary}.
            </p>
            <a
              href={business.phoneHref}
              className="mt-4 inline-block font-semibold text-brand hover:text-brand-strong"
            >
              {business.phoneDisplay}
            </a>
          </div>

          {/* Menu */}
          <nav>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50">Menu</h3>
            <ul className="mt-4 space-y-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/70 transition-colors hover:text-brand"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Hours (condensed) */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50">Hours</h3>
            <ul className="mt-4 space-y-1.5">
              {hourGroups.map((g) => (
                <li key={g.label} className="text-sm">
                  <span className="text-white/70">{g.label}</span>{" "}
                  <span className={g.closed ? "text-white/40" : "text-white/80"}>{g.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-2 border-t border-line pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {business.name}. All rights reserved.
          </p>
          <p>
            {business.city}, {business.provinceAbbr} {business.postal}
          </p>
        </div>
      </div>
    </footer>
  );
}

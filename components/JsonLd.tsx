import { business, services, faqs, hours, googleUrl, siteUrl } from "@/lib/content";
import { getReviewStats } from "@/lib/featurableStats";

// Emits one JSON-LD <script> with a linked @graph (Organization, WebSite,
// LocalBusiness, Service[], FAQPage) built entirely from lib/content.ts + the
// live Featurable rating — zero hardcoded brand strings. Server component so it
// renders into the static HTML and can await the rating. Native <script> per
// Next's documented JSON-LD pattern (not next/script).

const ORG = `${siteUrl}/#organization`;
const BIZ = `${siteUrl}/#localbusiness`;

const DAY_URL: Record<string, string> = {
  Monday: "https://schema.org/Monday",
  Tuesday: "https://schema.org/Tuesday",
  Wednesday: "https://schema.org/Wednesday",
  Thursday: "https://schema.org/Thursday",
  Friday: "https://schema.org/Friday",
  Saturday: "https://schema.org/Saturday",
  Sunday: "https://schema.org/Sunday",
};

// "8:00 AM" -> "08:00" (ISO 24h for openingHoursSpecification).
function to24(t: string): string {
  const m = t.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return t.trim();
  let h = parseInt(m[1], 10);
  const ap = m[3].toUpperCase();
  if (ap === "PM" && h !== 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${m[2]}`;
}

// Group open days that share the same hours into one spec (Mon–Fri 08:00–17:00).
function openingHours() {
  const byTime = new Map<string, string[]>();
  for (const h of hours) {
    if (h.closed) continue;
    const [open, close] = h.time.split("–").map((s) => to24(s));
    const key = `${open}|${close}`;
    (byTime.get(key) ?? byTime.set(key, []).get(key)!).push(h.day);
  }
  return [...byTime.entries()].map(([key, days]) => {
    const [opens, closes] = key.split("|");
    return {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: days.map((d) => DAY_URL[d]),
      opens,
      closes,
    };
  });
}

// "Okotoks" -> City; "and surrounding Foothills" -> AdministrativeArea "Foothills".
const areaServed = business.areas.map((a) => {
  const isRegion = /surrounding|foothills/i.test(a);
  const name = a.replace(/^and surrounding\s+/i, "").trim();
  return { "@type": isRegion ? "AdministrativeArea" : "City", name };
});

export async function JsonLd() {
  const { rating, count } = await getReviewStats();
  const telephone = business.phoneHref.replace(/^tel:/, "");

  const graph: Record<string, unknown>[] = [
    {
      "@type": "Organization",
      "@id": ORG,
      name: business.name,
      url: siteUrl,
      email: business.email,
      telephone,
      logo: `${siteUrl}/logo-original.png`,
      image: `${siteUrl}/og.jpg`,
      sameAs: [googleUrl],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: business.name,
      url: siteUrl,
      publisher: { "@id": ORG },
    },
    {
      "@type": ["HomeAndConstructionBusiness", "LocalBusiness"],
      "@id": BIZ,
      name: business.name,
      description: business.description,
      url: siteUrl,
      image: `${siteUrl}/og.jpg`,
      logo: `${siteUrl}/logo-original.png`,
      telephone,
      email: business.email,
      priceRange: business.priceRange,
      address: {
        "@type": "PostalAddress",
        addressLocality: business.city,
        addressRegion: business.provinceAbbr,
        postalCode: business.postal,
        addressCountry: "CA",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: business.geo.lat,
        longitude: business.geo.lng,
      },
      areaServed,
      openingHoursSpecification: openingHours(),
      // Live rating; omitted entirely when there are no reviews yet.
      aggregateRating:
        count > 0
          ? {
              "@type": "AggregateRating",
              ratingValue: rating,
              reviewCount: count,
              bestRating: 5,
              worstRating: 1,
            }
          : undefined,
      sameAs: [googleUrl],
    },
    ...services.map((s) => ({
      "@type": "Service",
      name: s.name,
      description: s.blurb,
      serviceType: s.name,
      provider: { "@id": BIZ },
      areaServed,
    })),
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  const json = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph,
  }).replace(/</g, "\\u003c"); // XSS scrub per Next's JSON-LD guidance

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

import type { Metadata, Viewport } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";
import { business, siteUrl } from "@/lib/content";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const description =
  "Diamond Concrete Sealing — premium concrete sealing, crack repair, and pressure washing in Okotoks, Alberta and nearby areas. Protect and extend the life of your concrete and asphalt.";

const ogImage = {
  url: "/og.jpg",
  width: 1200,
  height: 630,
  alt: "Diamond Concrete Sealing — sealed concrete driveway in Okotoks, AB",
};

// viewport-fit=cover lets the hero paint edge-to-edge behind iOS Safari's
// floating "liquid glass" bars; components use env(safe-area-inset-*) to stay clear.
export const viewport: Viewport = {
  viewportFit: "cover",
  // Matches --color-ink / the manifest background — the dark-only canvas.
  themeColor: "#0a0e14",
};

export const metadata: Metadata = {
  // Canonical production origin (env-overridable) so canonical/og/relative URLs
  // resolve to the real domain, not the *.vercel.app preview host.
  metadataBase: new URL(siteUrl),
  title: {
    default: "Diamond Concrete Sealing | Okotoks, AB",
    template: "%s | Diamond Concrete Sealing",
  },
  description,
  keywords: [
    "concrete sealing Okotoks",
    "driveway sealing Okotoks",
    "concrete crack repair",
    "concrete repair Alberta",
    "pressure washing Okotoks",
    "asphalt repair Okotoks",
  ],
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Diamond Concrete Sealing",
    description,
    type: "website",
    locale: "en_CA",
    siteName: business.name,
    url: "/",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Diamond Concrete Sealing",
    description,
    images: [ogImage.url],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${oswald.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}

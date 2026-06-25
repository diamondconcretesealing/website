import type { Metadata, Viewport } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";
import { business } from "@/lib/content";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
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
};

export const metadata: Metadata = {
  // Real deployed origin so og:image and other relative URLs resolve in link previews.
  metadataBase: new URL("https://diamond-concrete-sealing.vercel.app"),
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

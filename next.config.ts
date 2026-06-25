import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

// `ANALYZE=true npm run build` opens an interactive treemap of the bundles.
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

// Security headers applied to every response.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  // SAMEORIGIN (not DENY) — /studio is same-origin and renders fine framed by itself.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  images: {
    // AVIF first (smaller), WebP fallback.
    formats: ["image/avif", "image/webp"],
    // Next 16 requires declaring every non-default quality used by an <Image>.
    qualities: [50, 65, 75],
    // Hold optimized derivatives ~31 days (these source photos rarely change).
    minimumCacheTTL: 2678400,
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" },
    ],
  },
  compiler: {
    // Strip console.log/info/debug from prod bundles (client + server) but keep
    // error + warn. The contact route's lead-recovery backup uses console.warn
    // so it survives stripping (see app/api/contact/route.ts).
    removeConsole: { exclude: ["error", "warn"] },
  },
  experimental: {
    // Tree-shake these heavier packages' barrel imports.
    optimizePackageImports: [
      "@sanity/image-url",
      "sanity",
      "@sanity/vision",
      "react-google-reviews",
    ],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Non-hashed public media — safe to cache hard (filename changes on edit).
      {
        source: "/hero.mp4",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/hero.webm",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);

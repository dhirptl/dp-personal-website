import type { NextConfig } from "next";

/**
 * Security headers for a static portfolio.
 * Spline scene assets load from prod.spline.design; optional WASM/decoders from unpkg + gstatic.
 * 'unsafe-eval' is required: @splinetool/viewer unpacks .splinecode via new Function().
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://app.spline.design",
  "font-src 'self' data:",
  "connect-src 'self' https://prod.spline.design https://unpkg.com https://www.gstatic.com https://hooks.spline.design https://relayserver.spline.design https://apis.spline.design",
  "worker-src 'self' blob:",
  "child-src 'self' blob:",
  // Spline eye animation is an embedded .mp4 played via blob: URL
  "media-src 'self' blob: data:",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ["@paper-design/shaders-react", "@splinetool/viewer"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

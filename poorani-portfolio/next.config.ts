import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
// `npm run build:static` sets this to produce a plain HTML/CSS/JS folder (out/) for any static host.
const isStatic = process.env.STATIC_EXPORT === "1";

// The site is fully static: no API routes, no third-party scripts, fonts and images are self-hosted.
// The CSP therefore only allows same-origin resources. Next.js injects inline bootstrap scripts,
// which needs 'unsafe-inline' for scripts unless a nonce-based middleware is added.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

async function headers() {
  // Dev server needs eval for React debugging, so the strict headers apply to production builds only.
  if (!isProd) return [];
  return [
    { source: "/:path*", headers: securityHeaders },
    { source: "/:file(.*\\.jpg)", headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }] },
  ];
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // static export can't send headers itself; scripts/build-static.mjs writes them to out/_headers and out/.htaccess
  ...(isStatic ? { output: "export" as const, trailingSlash: true } : { headers }),
};

export default nextConfig;

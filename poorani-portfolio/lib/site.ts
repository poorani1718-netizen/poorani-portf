// Public site URL used for canonical links, Open Graph, robots and sitemap.
// Set NEXT_PUBLIC_SITE_URL in the hosting environment (see .env.example).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

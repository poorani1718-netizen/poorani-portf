// Builds a fully static copy of the site into out/ (works on Windows, macOS and Linux).
// Upload the contents of out/ to any static host: Netlify, Cloudflare Pages, GitHub Pages, cPanel/Apache, S3...
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
if (!process.env.NEXT_PUBLIC_SITE_URL) {
  console.warn("\n⚠  NEXT_PUBLIC_SITE_URL is not set. Canonical links, sitemap and social previews will point to http://localhost:3000.");
  console.warn("   Set it first, e.g.  set NEXT_PUBLIC_SITE_URL=https://yourdomain.com  (Windows)  or  export NEXT_PUBLIC_SITE_URL=...  (macOS/Linux)\n");
}
const res = spawnSync("npx", ["next", "build"], { cwd: root, stdio: "inherit", shell: true, env: { ...process.env, STATIC_EXPORT: "1" } });
if (res.status !== 0) process.exit(res.status ?? 1);

const csp = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests";
const headers = {
  "Content-Security-Policy": csp,
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  "Cross-Origin-Opener-Policy": "same-origin",
};
// Netlify / Cloudflare Pages
writeFileSync(path.join(root, "out/_headers"),
  "/*\n" + Object.entries(headers).map(([k, v]) => `  ${k}: ${v}`).join("\n") + "\n\n/_next/static/*\n  Cache-Control: public, max-age=31536000, immutable\n");
// Apache / cPanel hosting
writeFileSync(path.join(root, "out/.htaccess"),
  "ErrorDocument 404 /404.html\nOptions -Indexes\n<IfModule mod_headers.c>\n" +
  Object.entries(headers).map(([k, v]) => `  Header always set ${k} "${v}"`).join("\n") +
  '\n  <FilesMatch "\\.(js|css|woff2)$">\n    Header set Cache-Control "public, max-age=31536000, immutable"\n  </FilesMatch>\n</IfModule>\n');
console.log("\n✓ Static site ready in out/ — upload everything inside that folder to your host.");

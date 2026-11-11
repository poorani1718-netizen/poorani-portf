# Poorani K — Portfolio

A six-channel, broadcast-themed portfolio for Poorani K, Digital Marketing Analyst & Trainer.

**Stack:** Next.js (App Router) · React · TypeScript · Tailwind CSS v4 · GSAP + ScrollTrigger · Motion · Lenis · Three.js + React Three Fiber · OGL shaders · self-hosted fonts (Fontsource)

## Requirements
Node.js 20.9 or newer (22 LTS recommended; see `.nvmrc`). Fonts are bundled in `lib/fonts`, so nothing is downloaded at build time.

## Run
```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_SITE_URL
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

## Static build (for any web host)
```bash
# Windows:  set NEXT_PUBLIC_SITE_URL=https://yourdomain.com
# Mac/Linux: export NEXT_PUBLIC_SITE_URL=https://yourdomain.com
npm run build:static
```
Upload everything inside `out/` to your host (Netlify, Cloudflare Pages, GitHub Pages, cPanel/Apache…).
Security headers are included as `out/_headers` (Netlify/Cloudflare) and `out/.htaccess` (Apache).

## Checks (run before every release)
```bash
npm run typecheck
npm run build
npx playwright install chromium   # first time only
npm run test:e2e                  # starts the production server automatically
npm run audit:deps
```

See **AUDIT_REPORT.md** for the production-readiness audit, deployment and rollback steps.

## Pages (channels)
| Route | Channel | Highlights |
|---|---|---|
| `/` | 01 Home | OGL fluid shader hero, WebGL photo distortion, kinetic type, velocity marquee, scroll-scrubbed pitch, counters |
| `/about` | 02 About | Clip-path photo reveal, pinned horizontal "origin story", personal brand book |
| `/skills` | 03 Skills | Interactive R3F 3D funnel, "skills with receipts", draggable toolbox |
| `/projects` | 04 Projects | Pinned horizontal campaign posters, full-screen case-study overlays |
| `/experience` | 05 Experience | Gantt-style "media plan", stacking role cards |
| `/contact` | 06 Contact | Magnetic CTA, copy-to-clipboard, brief builder |

Navigation: bottom channel dial, full-screen programme guide, keys `1–6` and `[` `]`. Channel-change curtain transitions, custom cursor, magnetic buttons. Respects `prefers-reduced-motion`.

## Editing content
All copy lives in `lib/data.ts`. Portrait: `public/poorani.jpg`.

## Static preview build
`npm run preview:build` bundles the same components into `preview-dist/` with hash routing (`preview/router.ts` replaces `lib/router.ts`).

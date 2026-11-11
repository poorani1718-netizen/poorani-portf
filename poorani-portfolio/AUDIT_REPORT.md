# Production Readiness Audit — Poorani K Portfolio

> **Update, 4 November 2026:** the Lab page (and its UTM builder) was removed at the owner's request. Mentions of it below describe the site as audited on 2 November.

Audit date: 2 November 2026 · Scope: the whole repository (Next.js 16 App Router site).
Method: code review, `npm audit`, axe-core accessibility scans (7 routes, desktop), Playwright checks on desktop (1440×900) and mobile (390×844 / Pixel 7), Lighthouse 12 (desktop and mobile presets), and HTTP probes against a local production build (`next build && next start`).

## 1. Architecture found

| Layer | Finding |
|---|---|
| Frontend | Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4. Seven statically prerendered routes. All pages are client components rendered inside a shared `Shell` (navigation, transitions, cursor, smooth scroll). |
| Motion / 3D | GSAP + ScrollTrigger, Motion, Lenis, Three.js via React Three Fiber (Skills page only, code-split), OGL shaders (Home, Contact). |
| Backend / API | **None.** No API routes, server actions, middleware or custom server. |
| Database | **None.** |
| Authentication | **None.** No accounts, sessions or admin area. |
| Integrations | **None.** No analytics, email service, payments, maps or third-party scripts. The only outbound link is to LinkedIn. |
| Forms | Brief builder (Contact) and UTM builder (Lab) run fully in the browser. Nothing is submitted or stored. |
| Secrets / env | No secrets anywhere. One optional public variable, `NEXT_PUBLIC_SITE_URL`. |
| Hosting | Any Node 20+ host or Vercel. All routes are static. |

Phases 3 (backend/API), 5 (database), 7 (authentication) and 8 (third-party integrations) of the brief **do not apply**: those parts don't exist. They are marked N/A below rather than "passed".

## 2. Issues found (before fixes)

### Critical
- **C1. Vulnerable Next.js (16.0.10).** `npm audit`: 1 critical and 2 high advisories (Next.js DoS/cache-poisoning/middleware-bypass advisories, and a bundled `sharp`/libvips issue). Most need features this site doesn't use (image optimizer, middleware, server actions), but the installed version was still vulnerable.

### High
- **H1. No security headers.** No CSP, HSTS, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` or `Permissions-Policy`. `X-Powered-By: Next.js` was exposed.
- **H2. Keyboard focus escaped overlays.** The programme guide and case-study overlays did not trap focus and did not return it to the opener on close.
- **H3. Very high main-thread cost from WebGL.** Lighthouse total blocking time (headless, software GPU) was 72 s on Home. The fluid shader ran at full resolution, and the portrait shader re-rendered every frame even when idle.
- **H4. Wrong canonical URL.** Every page declared `/` as canonical. This would tell search engines to drop the inner pages.

### Medium
- **M1. Invalid ARIA.** `aria-label` was placed on generic `div`/`p` elements (headline reveals, the pitch). axe reported `aria-prohibited-attr` on 5 of 7 pages.
- **M2. Colour contrast.** Translucent labels, plus a header drawn with `mix-blend-mode: difference`, failed WCAG AA on 6 of 7 pages.
- **M3. Layout shift from font loading.** CLS reached 0.14–0.15 on desktop as the web fonts swapped in.
- **M4. No 404 page, error boundary, favicon, robots.txt or sitemap.** `/favicon.ico` returned 404 and logged a console error.
- **M5. No form validation.** The brief builder accepted empty input. The UTM builder accepted any URL scheme (shown only as text, but still invalid output).
- **M6. Text too small on mobile.** Labels of 9–11 px failed Lighthouse's font-size check.
- **M7. Heading order skipped a level** on Experience (h1 → h3).
- **M8. Logo name mismatch.** Its accessible name ("Poorani K, home") did not contain the visible text "Pk." (`label-content-name-mismatch`).

### Low
- **L1.** No skip link. Focus was not moved to the new page after a route change.
- **L2.** The Lab experiment wrapper was a component defined inside render, which remounts its children on every parent render.
- **L3.** No automated tests, type-check script or `.env.example`. `.gitignore` did not exclude `.env*` files.
- **L4.** No Open Graph / social preview metadata.

No XSS, injection, exposed-secret or data-leak issues were found. React escapes all user input, and there is no `dangerouslySetInnerHTML`, `eval` or server code.

## 3. Changes made

| Area | Change | Files |
|---|---|---|
| C1 | Upgraded `next` 16.0.10 → 16.4.3, `react`/`react-dom` 19.2.0 → 19.3.1, and matching `@types`. `npm audit` now reports **0 vulnerabilities**. No other packages were bumped. | `package.json`, `package-lock.json` |
| H1 | Production headers: strict same-origin CSP, HSTS, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, COOP. `poweredByHeader: false`. Cache header for the portrait. | `next.config.ts` |
| H2 | New `useFocusTrap` hook. Guide and case study are proper `role="dialog"` `aria-modal` overlays, focus their Close button on open, trap Tab, and restore focus on close (Escape works). | `lib/useFocusTrap.ts`, `components/Nav.tsx`, `components/pages/Projects.tsx` |
| H3 | Fluid shader renders at half resolution and starts after first paint. Shaders pause when off-screen or when the tab is hidden. The portrait shader skips frames when idle. Reduced-motion users get one still frame. The 3D funnel pauses off-screen, uses fewer particles on phones, and shows a text fallback without WebGL. | `components/gl/FluidBG.tsx`, `DistortImage.tsx`, `FunnelScene.tsx` |
| H4 | Each route declares its own canonical URL. `metadataBase` comes from `NEXT_PUBLIC_SITE_URL`. | `app/*/page.tsx`, `app/layout.tsx`, `lib/site.ts` |
| M1 | Visually hidden text for screen readers. Decorative split letters are `aria-hidden`. Mockup visuals are exposed as one labelled image each. | `components/Reveal.tsx`, `components/pages/Home.tsx`, `components/Visuals.tsx` |
| M2 | The header now uses each channel's own text colour instead of a blend mode. Label opacity raised. The channel badge picks a contrasting text colour. | `components/Nav.tsx`, all page components |
| M3 | Fonts moved to `next/font/local` (self-hosted Fontsource files: preloaded, hashed, with metric-matched fallbacks). CLS is now **0** on every route. | `lib/fonts.ts`, `app/layout.tsx`, `app/globals.css` |
| M4 | Added an on-brand 404 ("Off air"), a route error boundary that never shows stack traces, `favicon.ico` + `icon.svg`, `robots.txt` and `sitemap.xml`. | `app/not-found.tsx`, `components/NotFoundView.tsx`, `app/error.tsx`, `app/favicon.ico`, `app/icon.svg`, `app/robots.ts`, `app/sitemap.ts` |
| M5 | Brief builder: required name / needs / message, length limits, inline error messages linked with `aria-describedby`, and focus moved to the first error. UTM builder: http/https only, length limits. | `components/pages/Contact.tsx`, `components/pages/Lab.tsx` |
| M6–M8 | Minimum label size 12 px. Hidden h2 added on Experience. Logo label is now "Pk. Poorani K, home". | several components |
| L1 | Skip-to-content link. `<main id="main">` receives focus after each channel change. | `app/layout.tsx`, `components/Shell.tsx`, `app/globals.css` |
| L2 | `Exp` moved to module scope. | `components/pages/Lab.tsx` |
| L3 | Playwright e2e suite (20 tests × 2 viewports), `typecheck` / `test:e2e` / `audit:deps` scripts, `.env.example`, stricter `.gitignore`. | `tests/site.spec.ts`, `playwright.config.ts`, `package.json`, `.env.example`, `.gitignore` |
| L4 | Open Graph and Twitter card metadata using the portrait. | `app/layout.tsx` |

The visual design, content, navigation and interactions are unchanged.

## 4. Tests run

| Test | Result |
|---|---|
| `npm audit` (all deps) | 0 vulnerabilities (was 1 critical, 2 high) |
| `tsc --noEmit` | Pass |
| `next build` (production) | Pass: 7 pages + 404, icon, robots, sitemap prerendered |
| Playwright e2e: 40 runs (20 tests × desktop + mobile) | **38 passed, 0 failed, 2 skipped** (keyboard-only tests skipped on mobile by design) |
| Covered by e2e | Every route returns 200 with one h1, no console errors, no failed requests and no horizontal scroll. Security headers present and `X-Powered-By` absent. 404 page. robots/sitemap/icons. Dial and guide navigation. Escape and focus return. Number-key shortcut. Case-study focus trap. Brief validation and output. HTML/script input rendered as text, not executed. UTM output and rejection of `javascript:` URLs. Slot machine. Skill rows. Skip link. |
| axe-core (WCAG 2 A/AA + best practice), 7 routes | Before: 13 violations across 6 pages. After: **1** (see 6.1) |
| Layout shift (measured in browser) | Before: up to 0.15. After: **0** on all 14 route/viewport combinations |
| HTTP probes | `POST /` → 405. Reflected-XSS probe on a 404 URL → not reflected. Unknown routes → 404. |
| Lighthouse (headless, software GPU) | See table below |

| Lighthouse | Before | After |
|---|---|---|
| Home, mobile: Perf / A11y / Best practices / SEO | 52 / 91 / 93 / 100 | 50 / 96 / 96 / 100 |
| Home, total blocking time | 72.3 s | 4.5 s mobile · 1.3 s desktop |
| Home, LCP (desktop) | n/a | 0.8 s |
| Skills, desktop: A11y / Best practices | 96 / 96 | 100 / 100 |

The Lighthouse performance score is still about 50–60. Lighthouse here runs on a software-rendered GPU, which makes every WebGL frame count as blocking CPU work. That mostly reflects the test machine, not real phones, but it has **not** been verified on real hardware (see 6.2).

## 5. Dependencies changed
`next` 16.4.3 · `react` 19.3.1 · `react-dom` 19.3.1 · `@types/react` 19.3.0 · `@types/react-dom` 19.3.0 · added dev dependency `@playwright/test` 1.63.0.
Note: Next.js 16.4.3 was published on 23 Oct 2026, so it is newer than a cautious two-week soak period. It was taken because it carries the security fixes.
Other packages have newer minor versions (gsap, lenis, motion, three, tailwind). They were left alone on purpose, since no vulnerabilities are reported for them.

## 6. Unresolved items

1. **Pitch text contrast (Home).** The "scroll to light up" effect starts words at 30% opacity, which axe flags. The full sentence is available to screen readers, and the words reach full contrast as you scroll. This is a deliberate design choice and was kept.
2. **Performance on real devices is untested.** Measure on a mid-range Android phone after deploying (see 7).
3. **CSP allows `'unsafe-inline'` scripts.** Next.js injects inline bootstrap scripts. Removing this needs nonce-based middleware, which would make every page dynamic. With no user content or third-party scripts the risk is low.
4. **No error tracking or uptime monitoring** is connected yet (no account to connect). `app/error.tsx` has a hook point.
5. **Personal data.** Poorani's phone number and email are published on the Contact page. This needs her consent before a public launch.

## 7. Actions for the project owner
- Set `NEXT_PUBLIC_SITE_URL` to the real domain in the host's environment settings. Otherwise canonical, sitemap and Open Graph URLs point to localhost.
- Confirm Poorani is happy for her phone number to be public, or remove it from `lib/data.ts`.
- After deploying: run Lighthouse / PageSpeed Insights against the live URL on mobile, and check the site on one real Android phone and one iPhone.
- Turn on free uptime monitoring (e.g. UptimeRobot or Better Stack) for the home URL. If the host is Vercel, consider Vercel Analytics or Sentry for errors.
- Check the HSTS `preload` directive is wanted before submitting the domain to the preload list. It is hard to undo.

## 8. Deploying and rolling back
**Vercel (simplest):** import the repo → set `NEXT_PUBLIC_SITE_URL` → deploy. HTTPS and the custom domain are configured in the Vercel dashboard. **Rollback:** in Deployments, choose the last good deployment → "Promote to Production" (instant; no data to restore, because the site has no database).
**Any Node host:** `npm ci && npm run build && npm start` behind HTTPS (Node 20+). **Rollback:** redeploy the previous git tag (`git checkout <tag> && npm ci && npm run build && npm start`). Tag every release.
**Before every release:** `npm run typecheck && npm run build && npm run test:e2e && npm run audit:deps`.

## 9. Maintenance
- Run `npm audit` monthly and apply patch releases of Next.js promptly.
- Re-run the e2e suite after any content or design change.
- Edit content only in `lib/data.ts`. Swap the portrait at `public/poorani.jpg` (keep it roughly 900 × 1000 and under 150 KB).
- If a contact form that actually sends email is added later, it needs server-side validation, rate limiting, spam protection, and an email provider key kept in server-only environment variables.

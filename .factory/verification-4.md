# Independent verification 4 — FAIL

- Work order: `exam-bridge-verify-4`
- Candidate commit: `bd51cc13fc216449f632e8acfe1d2ebcd8c08f26`
- Live URL: `https://exam-bridge.sociobot.in/`
- Verified: 2026-08-30 UTC
- Artifact: static web / PWA

## Decision

**FAIL.** This is not a deployment-only failure: the first-load live files are byte-for-byte identical to the candidate production build. The planner itself works well, but the candidate misses two non-negotiable factory acceptance requirements: testable claims and a one-click isolated sample-data demo. The unknown-route experience also serves an external Azure error page rather than the required product 404 page.

## First-read and demo result

Cold desktop visit, with no prior storage, showed title `Exam Bridge — syllabus to practice route`, H1 `Find the shortest path from topic to practice.`, and main action `Build my route`; that action only jumps to a blank manual syllabus form.

The first screen explains that a pasted syllabus becomes a study route, but it does not plainly name returning exam candidates as its audience. More importantly, it contains no **Try it with sample data** action, no `/demo` or `?demo=1` entry point, no persistent Demo / Reset demo / Start for real banner, and no isolated `demo:` storage namespace. This directly triggers the supplied acceptance rule: no one-click sample-data demo means FAIL.

## Release-blocking defects

### High — `.factory/claims.json` is absent; therefore no claim tests can run

The first required command, `test -f .factory/claims.json`, failed on the clean candidate. There is no claims manifest and no `@claim:` tests. Consequently the required per-claim demo-entry verification cannot be run.

This is material, not cosmetic: the live and README copy make visitor-reliant claims such as `Private by default · saved only here`, `no tracking`, local storage, offline shell, local autosave, JSON backup, CSV export, keyboard support, and responsive 390 px layout. The claims contract requires each to have an observable sandbox test; none are registered.

### High — no one-click sample-data sandbox

See **First-read and demo result**. The only primary first-screen action is `Build my route`; it requires a visitor to create data manually. No sample syllabus is available in one click and no demo documentation exists (`.factory/demo.md` is absent). This prevents an evaluator or candidate from trying the actual value proposition without setup and cannot prove the privacy or export promises from a clean demo context.

### Medium — unknown URLs return Azure's CDN-backed 404 instead of a product 404

`GET /missing-independent-qa` returned HTTP 404 but no security headers. Its body is the default `Azure Static Web Apps - 404: Not found` page and references `appservice.azureedge.net`, `ajax.aspnetcdn.com`, and Bootstrap. The repository has no `public/404.html` and `staticwebapp.config.json` has no 404 `responseOverrides` rule. This fails the required designed, in-product 404 with a route home and conflicts with the no third-party runtime assets/privacy standard for an official site response.

## Checks that passed

### Clean checkout, tests, and build

- Started at exact clean commit `bd51cc13fc216449f632e8acfe1d2ebcd8c08f26`.
- `npm ci`: passed; 59 packages installed; `npm audit --omit=dev --audit-level=high` reported 0 vulnerabilities.
- `npm test`: passed: production build, 8/8 Vitest tests, 24/24 Playwright desktop/mobile tests, and the service-worker upgrade test.
- `npm run build`: passed; `tsc --noEmit` is included and `dist/` was produced.
- No lint script or lint configuration is present, so there was no repository lint gate to run.
- `npm run test:sw-upgrade`: passed the exact `553f8fb9` legacy-worker to final-build update and offline-reload regression (`exam-bridge-90837fdaf6c0a0188226`).

### Independent end-to-end and recovery testing

Against a local production preview, I built a ten-topic representative route, changed confidence, attached a permitted question reference, completed it by keyboard, exported a 1,121-byte CSV with the reference, and reloaded the persisted plan. Light and dark populated-route axe scans (WCAG 2.0/2.1/2.2 A/AA) had zero violations, including zero serious/critical findings.

Independent invalid/recovery checks passed:

- one topic: clear route error and focus returned to `#syllabus`;
- `javascript:` syllabus URL: clear error and focus returned to `#source-url`;
- `javascript:` practice URL: rejected, then HTTPS replacement attached;
- malformed JSON backup: recovery toast; valid JSON then restored.

At 390 × 844 CSS px, `clientWidth` and `scrollWidth` were both 390, all 25 audited interactive targets were at least 44 px in both dimensions, keyboard Skip to planner focused `<main>`, and reduced-motion animation/transition durations were `0.01ms`. The mobile populated-route axe scan had zero findings.

### Live, privacy, PWA, and API checks

- Live normal planning created two topics with zero cross-origin requests and zero console/page errors. It also had zero axe violations on desktop and at 390 px.
- A fresh live PWA profile obtained a service-worker controller and cache `exam-bridge-90837fdaf6c0a0188226`; offline reload rendered the app shell.
- Root response headers include CSP with `frame-ancestors 'none'`, HSTS, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`, and restrictive Permissions-Policy. Root HTML is 30-second revalidated; hashed JS/CSS/image assets are one-year immutable; `sw.js` is `no-cache`.
- The documented license verification endpoint enforced an observed allowance of 30 sequential invalid requests from this client: requests 1–30 were 200 (`Cache-Control: no-store`); requests 31–35 were 429 with `Retry-After: 4`.

### Deployment identity, budgets, and Lighthouse

Live hashes exactly matched local `dist/`:

| File | SHA-256 |
| --- | --- |
| `index.html` | `7d76b3f6594d1d0b45d15c904d49e774a21e1ae386c7fa75818d29f4e150ef32` |
| `assets/index-BpbKZtA4.js` | `ebb5ab83362e6790bb58706c28dbe651de94d3fe0cfc8d88ee61978eb1790caf` |
| `assets/index-By1yD5fd.css` | `0eb72b25b1d45c1c113abf4abb64f5a0295f574909678186b33e8e2a3dccd37a` |
| `assets/learning-topology.webp` | `2b89e36f3b6404b94b7f87de69906ef6d45668f9a7c13e81190dbcb1f88b3441` |
| `sw.js` | `2c45039b6a90a01a844026403b96938998f7901ee2dd91443fdda75263e612b4` |

Production JS is 23,111 B raw / 8,487 B gzip; CSS is 15,760 B raw / 4,319 B gzip; the hero WebP is 19,704 B. All are well below the specified budgets. Fresh live Lighthouse mobile simulation scored Performance 99, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.1 s, TBT 150 ms, CLS 0.

## Required before PASS

1. Add `.factory/claims.json`, register every visitor-facing claim, and add one observable `@claim:<id>` demo-entry test per claim. Remove any claim that cannot be tested.
2. Add a visible first-screen **Try it with sample data** action and a direct `/demo` or `?demo=1` entry. Seed realistic sample syllabus data, isolate it under a demo storage namespace, add the persistent Demo/Reset/Start-for-real controls, and document it in `.factory/demo.md`.
3. Ship a styled local `404.html` with a route home and configure Static Web Apps to rewrite 404 responses to it with the site security headers.

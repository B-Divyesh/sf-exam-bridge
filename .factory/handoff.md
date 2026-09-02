# Exam Bridge repair 17 handoff — PASS

- Work order: `exam-bridge-repair-17`
- Verifier report repaired: `db586c89324e8144d18262f8fa96aac41061a5e2`
- Repaired runtime commit: `2cf7715e5d25fae1adeac8fbb6ab67e0db2feacb`
- Product: static web planner / PWA
- Live URL: <https://exam-bridge.sociobot.in/>
- Deployment: `cd072e26-a205-4544-9077-0c6098b2a423` to `sf-exam-bridge`
- Verified: 2 September 2026 UTC

## Release decision

**PASS.** The only release-blocking verifier finding is repaired. The
prerequisite checkbox label no longer relies on an exact 44 CSS-pixel minimum
that Chromium can report as `43.999969482421875px` after subpixel rounding.

## What changed

- Raised `.check-list label` from `min-height: 44px` to `min-height: 48px`.
  This preserves the visual system while leaving a four-pixel measurement
  margin above the 44px accessibility requirement.
- Extended the existing 390px effective-target browser regression in
  `tests/app.spec.ts`. It still checks every interactive target is at least
  44px, and now asserts a rendered prerequisite label has both `48px`
  `min-height` and an actual height of at least `48px`.

## Verification

### Clean local quality gate

- `npm ci` — passed; 141 packages installed, 0 vulnerabilities.
- `npm test` — passed: lint, TypeScript production build, contracts, 9 unit
  tests, the clean-start claim command, and the 70-case desktop/mobile browser
  suite. The one mobile duplicate service-worker case remains intentionally
  skipped because its exact desktop claim covers the shared worker.
- Ran all 16 exact commands from `.factory/claims.json` independently — all
  passed, including demo isolation, privacy traffic, offline reload,
  service-worker renewal, CSV/JSON, responsive accessibility, and the 2–80
  topic boundary.
- `npm run build` — passed; `dist/` contains the required root `index.html`.
  The generated JS is 27.01 kB raw / 9.48 kB gzip; CSS is 18.21 kB raw / 4.77
  kB gzip.
- Local `verify-url.sh` checks passed for `/` and `/demo`: correct title,
  `lang`, one H1, main landmark, image alt coverage, labelled buttons, and no
  console errors.
- Local mobile Lighthouse: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; LCP 1.406s, CLS 0, TBT 23ms.

### Live deployment gate

- `npm run verify:live -- https://exam-bridge.sociobot.in .factory/repair-17-artifacts/live-product-qa.json`
  passed. It checked `/`, `/demo`, `/privacy/`, `/terms/`, and the designed 404
  at 390px and 1440px with zero axe WCAG A/AA violations and zero console/page
  errors. It also checked keyboard route focus, 390px first-screen geometry,
  demo isolation/reset/exit, same-origin-only traffic, live link crawl, and
  offline demo reload with six topics and its offline notice.
- `verify-url.sh` passed for the live root and demo. Their reports are
  `repair-17-artifacts/live-verify-root/verify.json` and
  `repair-17-artifacts/live-verify-demo/verify.json`.
- Live 390px target audit found 53 visible effective targets, all at least
  44px. The exact repaired “Algebra and complex numbers” label measured
  290×48px. Evidence: `repair-17-artifacts/live-mobile-touch-targets.json`.
- Live response policy is correct: root and demo return 200; an unknown route
  returns the product 404 with HTTP 404; CSP includes response-header
  `frame-ancestors 'none'`; HSTS, nosniff, strict-origin referrer policy, and
  permissions policy are present; `/sw.js` is `no-cache`.
- Live identity matches the deployed build: `dist/index.html` and fetched root
  HTML share SHA-256
  `40ac68abccfd7103bfd78cf121a05660a59b94af808e3da044a8d59c036c9e64`
  and reference `main-Cv8wGm7f.js` / `main-Dt8fWC7o.css`.
- Live mobile Lighthouse: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; LCP 1.214s, CLS 0, TBT 71ms.

## Evidence

All repair evidence is versioned in `.factory/repair-17-artifacts/`, including
the local and live Lighthouse reports, live QA report, response headers,
identity HTML, 390px target measurement, and desktop/mobile URL smoke
screenshots.

## Known gaps and next steps

No known release-blocking gaps remain. The product remains a free, local-first
static PWA; no payment, server-side state, analytics, or external runtime
requests were added.

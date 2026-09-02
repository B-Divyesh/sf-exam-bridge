# Exam Bridge repair 15 handoff

- Work order: `exam-bridge-repair-15`
- Verifier report commit: `e8f0e703fbdf9de8ed2e04e8a2ddf84502fd3314`
- Repaired candidate: `a1a021d29e5541e754515735889b88f602ce94b3`
- Repair commit: `92454528e1a4c7f8f1cb0e0b90ffb380ac7fa4bf`
- Product version: `1.0.8`
- Live URL: <https://exam-bridge.sociobot.in/>
- Date: 2 September 2026 UTC

## Result

The missing three-step **How it works** section is repaired and deployed. It is
an `h2` followed by an ordered list of three verb-led steps, and it renders after
the live planner. The route-line treatment extends the existing topology visual
system and becomes vertical at 390 px.

The researched paid-template boundary is restored without claiming an unavailable
purchase works. The free planner, CSV export, and JSON backup remain available.
All three reusable templates can be tried in the isolated demo. A verified ₹499
license enables them for real plans, with return-token capture, paste-to-restore,
24-hour verification caching, offline cached access, rate-limit feedback, and
revocation handling.

Checkout remains closed by default behind `VITE_CHECKOUT_ENABLED`. A fresh request
to the scoped endpoint still returns HTTP 404, so the deployed build contains no
buy link and makes no checkout request. No billing, DNS, shared Sociobot service,
database, key vault, or other product resource was modified.

## Reproduction and regression coverage

Before the repair, the exact structural assertion exited 1 because `#how` was an
unheaded paragraph before `#planner`. The captured result is in
`.factory/repair-15-artifacts/how-it-works-reproduction.json`.

The regression now checks all of these conditions in source and a real browser:

- `#how` is a labelled `section` with an `h2` named **How it works**.
- Its direct child is an ordered list with exactly three items.
- Step headings are **Paste your outline**, **Rate what you know**, and
  **Follow your route**.
- The section follows `#planner` in document order.
- Desktop and 390 px layouts have no horizontal overflow or console errors.

Billing regressions cover the default-closed operator gate, absent checkout
request, exact price, demo previews, valid restore, returned-token URL cleanup,
24-hour cache, cached offline access, invalid and revoked verdicts, and 429
feedback. Each public claim has one exact tagged Playwright test.

## Local verification

- `npm ci` — PASS; 141 packages installed and 0 vulnerabilities reported.
- Every exact command in `.factory/claims.json` — PASS, 19/19 independently.
- `npm test` — PASS: ESLint, TypeScript/build, contracts, 9 unit tests,
  clean-start verification, and 74 browser cases; 73 passed and one duplicate
  mobile service-worker case was intentionally skipped.
- `npm run lint` — PASS.
- `npm exec tsc -- --noEmit` — PASS.
- `npm run build` — PASS; `dist/index.html` exists.
- `npm audit --omit=dev --audit-level=high` — PASS; 0 vulnerabilities.
- Bundle sizes — JavaScript 29,372 bytes raw / 10,370 gzip; CSS 18,286 bytes
  raw / 4,780 gzip; hero image 19,704 bytes; no runtime font download.
- Local mobile Lighthouse — 99 performance, 100 accessibility, 100 best
  practices, 100 SEO; FCP 1.0 s, LCP 1.4 s, TBT 90 ms, CLS 0.
- Factory URL verification — PASS on `/`, `/demo/`, `/privacy/`, and `/terms/`;
  each has a title, `lang=en`, one H1, a main landmark, complete alternatives,
  labelled buttons, and no console or page errors.
- Axe WCAG A/AA — zero violations on root light desktop, root dark at 390 px,
  demo at 390 px, Privacy, and Terms.
- Copy audit — 469 rendered and README text units checked; none exceeds 22
  words and no banned marketing term appears.
- Package/consumer testing — not applicable to this static-web artifact.

Local evidence is under `.factory/repair-15-artifacts/`, including screenshots,
URL reports, the axe result, and `lighthouse-local-mobile.json`.

## Deployment and live verification

The exact default build was deployed with Static Web Apps CLI 2.0.10 to the
existing `sf-exam-bridge` production environment in resource group `sociobot`.
Azure reports the default environment Ready at
`proud-pebble-0504f2a0f.7.azurestaticapps.net`; the custom domain returns HTTPS
200. No staging slot was read or changed.

- Live `/`, `/demo`, `/privacy/`, and `/terms/` pass the factory URL check with
  zero console or page errors.
- A live functional flow built and persisted a two-topic plan, attached an HTTPS
  reference, and exported it in CSV.
- At 390 × 844, the landing facts end at y=834.16. One click opens six sample
  topics; the workspace begins at y=153.16 and its route summary ends at y=714.97.
- Live axe scans found zero WCAG A/AA violations on the dark 390 px landing and
  populated demo.
- A fresh service-worker-controlled demo reload succeeded offline with all six
  topics and the license-aware offline notice.
- All 15 discovered same-origin links returned HTTP 200. A fresh unknown path
  returned the designed page with HTTP 404.
- Live security headers include the self-restricted CSP plus only the two
  documented Sociobot billing origins, header-delivered `frame-ancestors
  'none'`, HSTS, `nosniff`, strict-origin referrer policy, and restrictive
  camera, microphone, and geolocation policy.
- Eleven representative live files match the local `dist/` bytes exactly,
  including both app shells, legal pages, 404, service worker, JS, CSS,
  illustration, route-focus script, and manifest.
- Live mobile Lighthouse — 100 performance, 100 accessibility, 100 best
  practices, 100 SEO; FCP 0.9 s, LCP 1.2 s, TBT 30 ms, CLS 0.

Live evidence is in `live-product-qa.json`, `live-identity-policy.json`,
`live-link-crawl.json`, `lighthouse-live-mobile.json`, and the `verify-live-*`
folders under `.factory/repair-15-artifacts/`.

## Known external dependency

The product-scoped checkout is not registered. On 2 September 2026 it returned:

```text
GET https://api.sociobot.in/api/v1/products/exam-bridge/checkout
HTTP 404
{"error":"enabled factory product","status":404}
```

An authorized billing operator must register the one-time ₹499 product and
production return URL, validate purchase/refund behavior, and then deploy with
`VITE_CHECKOUT_ENABLED=true`. Until that happens, the current default-off gate
is intentional and tested. The app does not present a dead checkout action or
claim a successful purchase.

Browser storage remains device-local. Users should export JSON for portable
backup. Prerequisite suggestions remain broad starting points, not official exam
guidance. No runtime AI feature is warranted for this deterministic planner.

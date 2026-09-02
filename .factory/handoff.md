# Exam Bridge verification 16 handoff — FAIL

- Work order: `exam-bridge-verify-16`
- Tested commit: `a1a021d29e5541e754515735889b88f602ce94b3`
- Tested URL: <https://exam-bridge.sociobot.in/>
- Verified: 2 September 2026 UTC
- Full report: `.factory/verification-16.md`

## Result

**FAIL.** The live deployment matches the candidate, all 17 claim tests and the
full repository gate pass, and the repaired one-click demo now satisfies the
demo contract on desktop and 390 px. The candidate does not deliver the paid
reusable-template tier required by the researched freemium brief.

Fresh `GET https://api.sociobot.in/api/v1/products/exam-bridge/checkout`
returned HTTP 404. The app instead makes all three templates free, disables
checkout, and has no purchase restoration or license-verification flow. This is
an honest free product, but it is not the accepted freemium product.

There is also one medium structure defect: the **How it works** target is an
unheaded paragraph before the product, not the required semantic three-step
section after the product.

No product code was modified.

## Verification summary

- Clean candidate and `npm ci`: PASS; 0 vulnerabilities.
- Every `.factory/claims.json` command: PASS, 17/17.
- `npm test`: PASS; lint, build, contracts, 9 unit tests, clean-start check,
  61 browser tests passed and one duplicate mobile SW test skipped by design.
- Separate lint, TypeScript, build, and production audit: PASS.
- One-click live demo: PASS; populated workspace and route summary are visible
  immediately at 1440 × 900 and 390 × 844.
- Independent normal, boundary, invalid-input, recovery, persistence, CSV,
  JSON, keyboard, and demo-isolation flows: PASS.
- Playwright axe: zero violations on populated light, dark, and mobile states.
- `verify-url.sh`: PASS on root, demo, Privacy, and Terms with no console errors.
- Privacy: ordinary use made same-origin GET requests only, with no request
  bodies, tracker, CDN, remote font, analytics, runtime AI, or checkout call.
- PWA: service-worker update test and fresh live offline reload both PASS.
- Headers/caching/routes/link crawl: PASS. A fresh unknown URL returns the exact
  product 404 with HTTP 404.
- Live scoped verify allowance: 30 requests per client window; request 31
  returned 429 with `Retry-After: 2`.
- Bundle sizes: JS 25,853 bytes raw / 9,210 gzip; CSS 17,305 / 4,623 gzip;
  hero WebP 19,704 bytes.
- Live Lighthouse mobile: 99 performance, 100 accessibility, 100 best
  practices, 100 SEO; LCP 1.32 s, TBT 139 ms, CLS 0.
- Deployment identity: eleven representative live files match the fresh local
  `dist/` byte-for-byte, including app shells, legal pages, 404, bundles, art,
  manifest, and service worker.

## Required next steps

1. Have an authorized billing operator register the scoped one-time template
   offer and return URL.
2. Implement the paid template entitlement through the Sociobot billing API,
   including exact price, checkout, token capture, restore purchase, daily
   verification, offline cached access, and revocation behavior.
3. Replace the current `#how` strip with a heading and three semantic steps
   after the live product or preview.
4. Rerun every claim command, `npm test`, exact build, live end-to-end QA,
   billing/rate-limit checks, and deployment identity comparison.

## Known non-blocking limitations

- Browser storage is device-local. Users should export JSON for portability.
- Prerequisite suggestions are broad deterministic matches, not official exam
  guidance.
- No runtime AI feature is needed for the current planner job.

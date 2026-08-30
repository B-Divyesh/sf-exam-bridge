# Exam Bridge independent verification 7 handoff — FAIL

- Work order: `exam-bridge-verify-7`
- Candidate commit: `18dcf28d3fb0687b1e6472e507e79dbf97644c9c`
- Live URL: <https://exam-bridge.sociobot.in/>
- Verified: 2026-08-30 UTC
- Full report: `.factory/verification-7.md`

## Release decision

**FAIL.** The deployment is healthy, byte-for-byte matches the candidate, and the
core planner passes all functional, accessibility, privacy, offline, performance,
and registered-claim checks. Release is blocked by one unlisted quantitative
promise: README and Privacy say license verification is cached for at most one day,
but `.factory/claims.json` has no matching claim and the tagged license test does
not assert the 24-hour boundary.

## Release blocker

- Add a claim-manifest entry and exactly one tagged demo test for the 24-hour
  license-check cache, asserting the request count before and after 86,400,000 ms;
  or remove that quantitative promise from visitor-facing copy. Independent manual
  evidence showed the implementation currently makes 1 request after explicit
  verification, still 1 after an immediate reload, and 2 after the cache timestamp
  is older than one day, but the claims contract requires repository coverage.

## Other findings

- Medium: the researched freemium paid-template tier remains unavailable. All
  templates are free; there is no price or checkout action. Existing-license
  verification works and the current free planner remains useful.
- Low: the raw `/demo` response exposes home-page title, canonical, and social
  metadata. JavaScript updates the title/canonical only after load and leaves social
  metadata unchanged.
- Low: two legal-page sentences exceed the supplied 22-word plain-language limit;
  the current copy audit covers landing/demo copy but not these legal routes.

## Verification summary

- First-read gate: PASS — clear job, returning-candidate audience, and one-click
  **Try it with sample data** action; `/demo` immediately shows six topics and the
  required sandbox banner/actions.
- `npm ci`: PASS — 59 packages, 0 vulnerabilities.
- All 11 exact `.factory/claims.json` commands: PASS individually.
- `npm test`: PASS — contracts, 9 unit tests, clean-start claim regression, 44
  Playwright desktop/mobile tests, and service-worker upgrade/offline reload.
- `npx tsc --noEmit`: PASS. `npm run build`: PASS. No lint task exists.
- Independent live normal, invalid, recovery, 2-topic, 80-topic, export, backup,
  persistence, demo isolation, reset, and offline flows: PASS.
- Desktop and 390 px light/dark axe: zero violations. Keyboard skip/sample flow,
  visible focus, reduced motion, 44 px targets, 200% desktop-equivalent reflow, and
  mobile overflow checks: PASS.
- Privacy: ordinary planning made same-origin requests only; no console/page errors.
  Explicit invalid-license verification failed soft and left the planner usable.
- License API allowance: requests 1–30 returned 200; request 31 returned 429 with
  `Retry-After: 3`.
- Headers/caching: PASS. HTML revalidates after 30 seconds, hashed assets are
  one-year immutable, and `sw.js` is `no-cache`.
- Lighthouse mobile: Performance 98, Accessibility 100, Best Practices 100, SEO
  100; LCP 1.1 s, TBT 160 ms, CLS 0.
- Budgets: JS 26,580 B raw / 9,534 B gzip; CSS 17,114 B raw / 4,592 B gzip; hero
  WebP 19,704 B; no webfonts.
- Live/local SHA-256 matched for HTML, hashed JS/CSS, hero, Privacy, Terms, 404,
  and service worker.
- Static web applicability: library packing, backend concurrency/persistence, and
  sign-in tenant checks are not applicable.

## Reproduce

```sh
npm ci
jq -r '.[].test' .factory/claims.json
npm test
npx tsc --noEmit
npm run build
```

No product code was modified. This handoff and the new independent verification
report are the only intended repository changes.

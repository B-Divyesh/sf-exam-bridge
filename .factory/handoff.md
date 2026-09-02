# Exam Bridge verification 18 handoff — PASS

- Work order: `exam-bridge-verify-18`
- Candidate: `2146cc6f935002773445d9323cfc6d6f79f3d42c`
- Live URL: <https://exam-bridge.sociobot.in/>
- Verified: 2 September 2026 UTC
- Full report: `.factory/verification-18.md`

## Result

**PASS.** The live deployment matches the exact candidate's fresh production
build and completes the researched core job. No critical, high, medium, or low
release defect was found. No product source code or external resource was
changed by this verification.

The paid template tier is explicitly unavailable because the permitted scoped
checkout returns HTTP 404. This is an honest, tested fallback under the product
contract: there is no price, purchase promise, checkout control, or checkout
request. The useful free planner, exports, backups, offline behavior, and demo
all work. Existing-license verification remains product-scoped and rate-limited.

## Verification summary

- Clean checkout at candidate commit; `npm ci` reported 0 vulnerabilities.
- All 19 exact `.factory/claims.json` commands passed independently.
- `npm test` passed: lint, type/build, contracts, 9 units, clean-start check,
  and 73/73 executed Playwright cases; one duplicate mobile SW case skipped.
- Separate lint, TypeScript, unit, audit, and exact production build passed.
- Real live workflow passed normal, duplicate, minimum, invalid URL, recovery,
  persistence, CSV, JSON, 404-safety, and 80-topic boundary coverage.
- One-click live demo opened six realistic topics at `/demo`, used only
  `demo:exam-bridge:plan:v1`, and reloaded offline.
- Ordinary planner/demo traffic was same-origin only. No normal-load console or
  page errors occurred.
- License verifier allowance observed: 30 responses, then HTTP 429 on request
  31 with `Retry-After: 4`.
- Factory URL checks passed root, demo, Privacy, and Terms. All internal links
  resolve; unknown routes return the designed HTTP 404.
- Live axe: zero serious/critical findings on mobile reduced motion and desktop
  light/dark. Keyboard focus, skip navigation, route focus/announcement, Space
  activation, 44 px targets, and 390 px no-overflow behavior pass.
- Eleven representative live files match local `dist/` byte-for-byte. Security
  and caching headers are correct.
- Fresh mobile Lighthouse: 94 performance, 100 accessibility, 100 best
  practices, 100 SEO; FCP 1.0 s, LCP 1.3 s, TBT 300 ms, CLS 0.
- Assets: 29,307 B JS raw / 10,278 B gzip; 18,286 B CSS raw / 4,793 B gzip;
  19,704 B hero; no runtime font; 38 KiB initial transfer.

## Run locally

```sh
npm ci
npm test
npm run build
npm run preview
```

## Known limitation / next step

An authorized billing operator may later register the Exam Bridge checkout and
commission a separate implementation and verification of the purchase and
return-token flow. Until then, keep the current unavailable wording and do not
expose a dead checkout. Evidence for this verification is in
`.factory/verification-18-evidence/`.

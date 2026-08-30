# Exam Bridge verification 8 handoff — FAIL

- Work order: `exam-bridge-verify-8`
- Candidate: `7c37b18579cbe1b4fffc5692bc12f746ed1e430b`
- Live URL: <https://exam-bridge.sociobot.in/>
- Verified: 2026-08-30 UTC
- Full report: `.factory/verification-8.md`

## Release decision

**FAIL.** The live deployment exactly matches the candidate, all 12 claim tests
and all local quality gates pass, and the planner works end to end. The required
390×844 cold first screen does not show any first action: **Try it with sample
data** begins at y=893, below the 844 px viewport.

This is not a deployment-only failure.

## Blocking defect

At 390×844, the responsive layout puts the full hero illustration before the
audience text and actions. The headline is visible and the audience sentence ends
at y=819, but the sample-data action starts at y=893. A phone visitor must scroll
before learning what to click first, contrary to the explicit first-read gate.

Evidence: `.factory/verification-artifacts/live-cold-mobile-390.png`.

Required fix: place the audience sentence and sample action before the
illustration on mobile, or otherwise fit them in the initial viewport. Add a
390×844 test that asserts the action intersects the initial viewport.

## Other finding

**Medium:** the researched paid reusable-template tier remains deferred. All
templates are free, and no price or hosted purchase link is available. The UI and
documentation describe that limitation honestly.

## Verification summary

- `npm ci`: PASS — 141 packages, 0 vulnerabilities.
- Every `.factory/claims.json` command: PASS — 12/12.
- `npm test`: PASS — lint, production build, contracts, 9 unit tests, clean-start
  claim, 48 desktop/mobile browser tests, and service-worker update/offline test.
- `npm run lint`, `npx tsc --noEmit`, `npm run build`: PASS.
- Live ten-topic planning, practice, CSV, backup, reload, and invalid-input
  recovery: PASS, with no console/page errors or external planning requests.
- Live demo isolation/reset/exit: PASS.
- Axe: zero violations on both themes, populated planner, legal pages, and 404.
- 390 px: no overflow; audited controls at least 44×44; reduced motion 0.01 ms;
  visible 3 px keyboard focus; skip link focuses `main`.
- Live PWA offline reload: PASS. Exact legacy-to-current SW update test: PASS.
- Public license verifier: requests 1–30 returned 200; request 31 returned 429
  with `Retry-After: 4`.
- Lighthouse mobile: Performance 96, Accessibility 100, Best Practices 100,
  SEO 100; FCP 1.0 s, LCP 1.2 s, TBT 220 ms, CLS 0.
- Bundles: JS 27,125 B raw / 9,750 B gzip; CSS 17,114 B raw / 4,578 B gzip;
  hero 19,704 B.
- Live root, demo, JS, CSS, hero, legal pages, 404, manifest, and service worker
  match the local candidate build byte for byte.

## Run locally

```sh
npm ci
npm test
npm run lint
npx tsc --noEmit
npm run build
npm run preview
```

No product code, infrastructure, DNS, billing configuration, secret, database,
or unrelated service was read or modified during this verification.

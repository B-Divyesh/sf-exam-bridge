# Exam Bridge polish round 4 handoff

- Work order: `exam-bridge-polish-4`
- Reviewed candidate: `04d3525996b01ba2ba91bfda6e9d1e0ab74a7c47`
- Review report: `3caa4e9c1413d23c5590c4c141b4cdfe15799e35`
- Runtime repair commit: `2cbac4b26311a63693cc10ed30c68224fe6f0c24`
- Version: `1.1.1`
- Live URL: <https://exam-bridge.sociobot.in/>
- Deployment: `6fc709b8-b643-4deb-949b-410e88f90b9f` to `sf-exam-bridge`
- Verified: 2 September 2026 UTC

## What changed

All findings from reviews 1–4 are resolved. Round 4 removes the nested Templates
landmark and the unproved hosting-log use assurance. Planner actions now say
**Add prerequisite**, **Attach question reference**, and **Delete this plan**.
Demo, README, and Privacy copy now explain separation and deletion without
implementation jargon. The free scope, one-click isolated demo, route metadata,
focus handling, product 404, legal navigation, and distinct learning-topology
visual system remain intact.

The accessibility gate now rejects every axe WCAG A/AA violation instead of
filtering by severity. A repeatable live verifier covers all public routes and
the real 404 at 390 and 1440 px, plus isolation, `?demo=1`, focus, privacy,
same-origin traffic, result-naming actions, and offline reload.

## How to verify

```sh
npm ci
npm test
npm run build
npm run verify:live -- https://exam-bridge.sociobot.in .factory/polish-4-artifacts/live-product-qa.json
```

Run every exact `test` command in `.factory/claims.json` independently from a
fresh clone. The direct sample URL is <https://exam-bridge.sociobot.in/demo>;
`https://exam-bridge.sociobot.in/?demo=1` is also supported.

## Evidence

- Fresh clone at `2cbac4b26311a63693cc10ed30c68224fe6f0c24`:
  `npm ci` passed with zero vulnerabilities; all 16 exact claim commands passed.
- Fresh-clone `npm test` passed lint, build, contracts, 9 unit tests, the clean
  claim-start check, and 69 browser tests. One duplicate mobile service-worker
  case was intentionally skipped.
- The final build contains 27.01 kB raw / 9.48 kB gzip JavaScript and 18.21 kB
  raw / 4.77 kB gzip CSS.
- [Live QA](polish-4-artifacts/live-product-qa.json) records zero axe WCAG A/AA
  violations and zero console errors on all five routes at both viewports.
- The same report records the 404 response, first-screen geometry, demo
  isolation/reset/exit, direct query demo, route focus, offline reload,
  same-origin requests, revised privacy copy, and result-naming actions.
- `verify-url.sh` reports for [root](polish-4-artifacts/live-root/verify.json),
  [demo](polish-4-artifacts/live-demo/verify.json),
  [privacy](polish-4-artifacts/live-privacy/verify.json), and
  [terms](polish-4-artifacts/live-terms/verify.json) show correct titles,
  `lang`, one H1, one main landmark, alt coverage, and no console errors.
- Live mobile Lighthouse: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 20 ms, CLS 0.
- Live root and local `dist/index.html` share SHA-256
  `d985b3d07397a49914f23ea247a776119283bbc5591a53fa7691ff8458ed1056`.

## Known gaps and next steps

No known product, review, accessibility, privacy, offline, routing, or deployment
gap remains. No follow-up is required for this work order.

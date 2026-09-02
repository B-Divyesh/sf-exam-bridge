# Exam Bridge polish 3 handoff — PASS

- Work order: `exam-bridge-polish-3`
- Repaired candidate: `666672cbfff0a8ab5e106a904111e2b3bb882b36`
- Repair commit: `59fb6081fc8b655c9e6c67eb558a163591107275`
- Live URL: <https://exam-bridge.sociobot.in/>
- Deployment: product-owned Azure Static Web App `sf-exam-bridge`, production
  deployment completed 2 September 2026 UTC.

## What changed

Exam Bridge now ships as a complete free local-first planner. The inaccessible
paid-template and license-verification path was removed rather than presenting
a broken purchase option. All three editable starter templates work in the real
planner without payment. The mobile header now exposes a labelled, keyboard
operable menu, including Escape focus return. Each template button names the
template it creates. The README and legal copy use plain user-facing language.

The one-click `/demo` and `?demo=1` sample path remains isolated in the
`demo:exam-bridge:*` namespace, with its persistent banner, reset, start-for-
real action, and offline reload. Route titles, canonical metadata, focus
handling, legal links, CSP, and the designed 404 remain intact.

## How to run and verify

```sh
npm ci
npm test
npm run build
```

`npm test` runs lint, the production build, contracts, 9 unit tests, the
clean-start check, accessibility integration, service-worker renewal, and 66
Playwright tests. Run every exact command in `.factory/claims.json` separately
from a new clone for the claim gate; 16 current claims are registered.

## Evidence

- A fresh clone at `59fb608` completed `npm ci`, every exact claim command, and
  `npm test` successfully.
- The shipped build is 26.91 kB raw / 9.49 kB gzip JavaScript and 18.21 kB raw
  / 4.77 kB gzip CSS.
- Cold live URL verification passed for `/`, `/demo`, `/privacy/`, and `/terms/`
  with zero console errors: `polish-3-artifacts/live-*/verify.json`.
- Fresh live browser contexts proved demo isolation/reset/exit, same-origin
  traffic, offline demo reload, mobile navigation, named free template actions,
  legal navigation, and no purchase path:
  [live QA report](polish-3-artifacts/live-product-qa.json).
- Live Lighthouse mobile scores were Performance 100, Accessibility 100, Best
  Practices 100, and SEO 100; FCP and LCP were 1.5 s with CLS 0:
  [report](polish-3-artifacts/lighthouse-live-mobile.json).
- The full review mapping is in `.factory/polish-3.md`.

## Known gaps and next steps

None. No shared resource, billing configuration, DNS record, or external data
store was changed.

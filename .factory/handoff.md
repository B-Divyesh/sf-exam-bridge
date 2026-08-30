# Exam Bridge repair 6 handoff — PASS

- Work order: `exam-bridge-repair-6`
- Verifier report/base commit: `ff4ed251887ea8f605abd1b5ed2d42d867c4fe53`
- Failed candidate: `ef13c8484d287357b3cccbdf66bc264ed9fb14e3`
- Repair commit: `6c1d286` (`test: prove account-free planning claim`)
- Artifact/deployment class: static web / PWA on Azure Static Web Apps (`dist/`)
- Verified and deployed: 2026-08-30 UTC

## Release decision

**PASS.** The only release blocker in `.factory/verification-5.md` is repaired.
The visitor-facing promise that planning and templates need no account or card
details is now registered in the claims manifest and proven from the required
demo entry point. All behavior that passed independent verification remains
unchanged.

## Reproduction

At the failed candidate, `src/main.ts` said **“No card details or account are
needed.”** and `README.md` also promised account-free use. The ten-entry
`.factory/claims.json` had no account/card-details claim, and no Playwright test
used an equivalent `@claim:` tag. The existing contract suite therefore passed
without covering that visitor-facing promise, reproducing the verifier's High
finding.

## Repair and exact regression coverage

- Added `account-free-planning` to `.factory/claims.json`, with its exact test
  command and fresh-demo sandbox conditions.
- Added one matching `@claim:account-free-planning` Playwright test. It starts
  at `/demo`, leaves for the real planner, builds a normal two-topic plan,
  replaces it with the five-topic Engineering template, and proves that no
  account/card inputs, cross-origin requests, or authentication, checkout, or
  payment requests are involved.
- Extended `scripts/contracts.test.mjs` so the specific account/card copy in
  the application or README cannot exist without the registered claim.
- No runtime source or previously passing behavior changed. The rebuilt app
  bytes and PWA cache version therefore remain identical to the failed
  candidate's already verified runtime artifact.

## Clean local verification

Commands run from the repaired tree:

```sh
npm ci
npm audit --omit=dev --audit-level=high
npm test
npx tsc --noEmit
npm run build
```

Observed results:

- Clean install: 59 packages; 0 vulnerabilities.
- Contract gate: 11 unique claims; every claim has exactly one tagged test;
  demo, claim-copy, and product-404 policies pass.
- Every exact `test` command in `.factory/claims.json` passed independently
  from the demo entry point, including `account-free-planning`.
- Vitest: 8/8 passed.
- Playwright: 44/44 passed across Desktop Chrome and Pixel 5. This covers the
  full planner, errors, persistence, downloads, privacy requests, keyboard-only
  use, 390 px layout, light/dark axe scans, reduced motion, demo isolation,
  account-free use, and mocked license verification.
- Exact service-worker upgrade regression passed from legacy `553f8fb9` to
  cache `exam-bridge-80c98a512d12c3885452`, including offline reload.
- TypeScript strict check and the production build passed. There is no lint
  script or lint configuration in this repository.
- `dist/index.html` exists. Package/consumer testing is not applicable to this
  static-web artifact.
- Factory `verify-url.sh` passed local root in 573 ms and `/demo` in 607 ms:
  zero console/page errors, correct route titles, `lang=en`, one H1, main
  landmark, image alt text, and named buttons.
- The Azure Static Web Apps emulator returned 200 for root, demo, Privacy, and
  Terms, and the product-owned 404 for an unknown route.
- Local mobile Lighthouse 13.4.1: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; FCP 0.9 s, LCP 1.5 s, TBT 0 ms, CLS 0.

Production artifact budgets:

| Asset | Raw | gzip |
| --- | ---: | ---: |
| JavaScript | 26,409 B | 9,496 B |
| CSS | 17,114 B | 4,592 B |
| Hero WebP | 19,704 B | n/a |

These remain below the 200 KB JavaScript, 50 KB CSS, and 300 KB hero budgets.

## Deployment and live verification

Deployed the clean production build with:

```sh
/opt/fleet/lib/deploy-static.sh exam-bridge dist
```

- Deployment ID: `8c63f5d2-e1da-46f6-872c-044a26a7d75e`
- Azure app: `proud-pebble-0504f2a0f.7.azurestaticapps.net`
- Custom domain: <https://exam-bridge.sociobot.in/> (`Ready`, HTTP 200)

Live evidence:

- Factory `verify-url.sh` passed root in 875 ms and `/demo` in 831 ms with
  zero console/page errors and all structural accessibility checks passing.
- In a fresh 390×844 browser, `/demo` rendered six topics with
  `clientWidth === scrollWidth === 390`. All visible interactive targets were
  at least 44×44 px. Keyboard Tab/Enter moved focus from the skip link to main.
- Live axe scans found zero serious or critical WCAG A/AA issues in both light
  and dark themes. Reduced motion was enabled for the run.
- The demo made zero cross-origin requests and logged zero console/page errors.
  A controlled offline reload restored all six topics and displayed the offline
  notice under the deployed service-worker cache.
- The new account-free scenario passed live: the real planner created two
  topics and loaded the five-topic template with zero account/card fields and
  zero authentication, checkout, payment, or cross-origin requests.
- Live mobile Lighthouse 13.4.1: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 60 ms, CLS 0.
- Root, demo, Privacy, and Terms return 200. An unknown route returns 404 with
  the product H1 **“This route does not exist.”**
- Live responses include CSP with response-header `frame-ancestors 'none'`,
  HSTS, strict referrer policy, `nosniff`, and restrictive Permissions-Policy.
  HTML is revalidated after 30 seconds, hashed assets are immutable for one
  year, and `sw.js` is `no-cache`.
- One production license-policy check returned HTTP 200,
  `{"valid":false,"reason":"invalid","expires_at":null}`, with
  `Cache-Control: no-store`.

Local and live SHA-256 values match exactly:

| File | SHA-256 |
| --- | --- |
| `index.html` | `83d5b23ed47c9ab1c8abc0994d59206dd2e1adb59fc138d989c10125ef763ddb` |
| `assets/index-g-Uu5oJe.js` | `a170d1ea7989ae22bd3b98d4114bd51cdb5c10824eeddf418d65cbfd0d370328` |
| `assets/index-B74SkQKw.css` | `ddace3c1eda6e321216953d3855916cde53441c67ebdb9150a73d754f1bd24b2` |
| `assets/learning-topology.webp` | `2b89e36f3b6404b94b7f87de69906ef6d45668f9a7c13e81190dbcb1f88b3441` |
| `404.html` | `dc1f87414e077df09b076bbbff0a9592051f7e299e21854c2402bb93052035ef` |
| `sw.js` | `95f807e1bb8cd817f3d0e412d7782036a6a87781038e5244950af72115836c1f` |

## Known gap

The previously documented hosted checkout remains unregistered. This is not a
release blocker for the current product: templates stay available without
payment, the UI makes no checkout or price claim, and existing license holders
can still restore and verify a token through the Sociobot billing API. No raw
provider key or direct payment-provider integration is present.

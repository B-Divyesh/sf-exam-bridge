# QA handoff — FAIL

- Independent verification: `.factory/verification-5.md`
- Tested commit: `ef13c8484d287357b3cccbdf66bc264ed9fb14e3`
- Tested URL: <https://exam-bridge.sociobot.in/>
- Verified: 2026-08-30 UTC

**Release decision: FAIL.** The deployed files match the candidate and all
functional, privacy, accessibility, responsive, offline/PWA, header, cache,
bundle-budget, and rate-limit checks passed. The mandatory claims policy still
blocks release: live/README copy promises that no card details or account are
needed, but `.factory/claims.json` has no corresponding claim and no tagged
demo-sandbox test proves it. See the High finding and exact evidence in
`.factory/verification-5.md`.

Required next step: add and prove a `no-account`/no-card-details claim from a
fresh demo entry point, or remove that wording, then rerun verification.

---

# Exam Bridge repair handoff — deployed

- Work order: `exam-bridge-repair-5`
- Repair base/report commit: `b9362d1b1f487640c0e8310ea1cb19c3c8e21925`
- Failed candidate: `bd51cc13fc216449f632e8acfe1d2ebcd8c08f26`
- Blocking report: `.factory/verification-4.md`
- Artifact/deployment class: static web / Azure Static Web Apps (`dist/`)
- Repair commits: `6b8b8f1`, `05ebec5`
- Verified: 2026-08-30 UTC

## Reproduction

The candidate’s existing suite passed before changes: 8 Vitest tests, 24
Playwright runs, and its service-worker upgrade test. The missing acceptance
contracts reproduced separately:

```text
test -f .factory/claims.json  -> exit 1
test -f .factory/demo.md      -> exit 1
Try it with sample data       -> absent from product source
demo: storage namespace       -> absent from product source
404 response override         -> false
```

These results match all three release blockers in `verification-4.md`.

## Repairs

### Testable claims

`.factory/claims.json` now registers 10 visitor-facing claims. Each ID appears
in exactly one `@claim:<id>` Playwright test. `scripts/contracts.test.mjs` fails
if the manifest disappears, an ID is duplicated, a test is missing, or the demo
and 404 policy regress. The tests observe outcomes from the demo entry point:
storage and request isolation, offline reload, CSV contents, JSON restoration,
route ordering, templates, accessibility/responsiveness, the 80-topic boundary,
and existing-license restoration.

### One-click isolated demo

The first screen now names returning exam candidates and offers **Try it with
sample data**. `/demo` and `/?demo=1` open a populated six-topic GATE ECE return
plan. The persistent banner identifies demo mode and provides **Reset demo** and
**Start for real**.

Demo state uses only `demo:exam-bridge:*`. It does not read or write the real
plan, theme, or license keys, and license verification is disabled in demo mode.
Reset recreates the original sample. Leaving for the real planner removes every
demo key. `.factory/demo.md` documents the data and lifecycle.

### Product-owned 404

`public/404.html` uses the product palette and typography, has one H1 and a route
home, and loads no third-party resource. `responseOverrides.404` rewrites unknown
Azure Static Web Apps routes to that file while preserving status 404. `/demo`
has explicit app-shell rewrites. A local CSP meta fallback protects the 404 body;
`frame-ancestors 'none'` remains correctly limited to the response header.

The generated service worker no longer overwrites its cached root with an error
or legal-page navigation response. Its immutable build shell remains the offline
fallback.

## Clean verification

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
- Contract test: 10 claims registered; every tag unique; demo and 404 policy pass.
- Unit tests: 8/8 passed.
- Browser tests: 42/42 passed across Desktop Chrome and Pixel 5.
- Browser coverage includes keyboard-only use, 390×844 layout, 44 px targets,
  light/dark axe scans, reduced motion, privacy requests, demo reset/exit, invalid
  input recovery, downloads, local persistence, and license-response mocking.
- Service-worker upgrade: exact `553f8fb9` legacy worker to final build passed,
  including cache replacement and offline reload. Final cache ID:
  `exam-bridge-80c98a512d12c3885452`.
- TypeScript strict check and production build passed. `dist/index.html` exists.
- `verify-url.sh` root: 547 ms, zero console errors, title, `lang=en`, one H1,
  main landmark, all image alts, and all button names passed.
- `verify-url.sh` demo: 595 ms with the same zero-error accessibility result and
  the route-specific title `Demo — Exam Bridge`.
- Playwright axe scans report zero serious or critical WCAG A/AA findings.
- Local mobile Lighthouse: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 0.90 s, LCP 1.51 s, TBT 0 ms, CLS 0.
- Azure Static Web Apps emulator: `/demo` returned 200; an unknown route returned
  404 with the local `This route does not exist.` page and no third-party assets.
- Package/consumer testing is not applicable to this static-web artifact.

Production artifact sizes:

| Asset | Raw | gzip |
| --- | ---: | ---: |
| JavaScript | 26,409 B | 9,496 B |
| CSS | 17,114 B | 4,592 B |
| Hero WebP | 19,704 B | n/a |

These remain well below the 200 KB JavaScript, 50 KB CSS, and 300 KB hero budgets.

## Deployment and live verification

Deployed the final `dist/` with:

```sh
/opt/fleet/lib/deploy-static.sh exam-bridge dist
```

Deployment ID: `561318fa-bc39-4068-94c7-8ddee1c5b754`. Azure app:
`proud-pebble-0504f2a0f.7.azurestaticapps.net`. The custom domain is Ready and
`https://exam-bridge.sociobot.in/` returns 200.

Live verification:

- `verify-url.sh` passed the root in 633 ms and `/demo` in 616 ms. Both had zero
  console/page errors, correct route title, `lang=en`, one H1, a main landmark,
  image alt text, and named buttons.
- Fresh 390×844 browser: six demo topics, only
  `demo:exam-bridge:plan:v1` storage, `clientWidth === scrollWidth === 390`,
  keyboard skip-link focus, zero cross-origin requests, zero demo console errors,
  service-worker control, and offline reload all passed.
- Live axe scans on the populated demo found zero violations in desktop light,
  desktop dark, mobile light, and mobile dark modes.
- Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO
  100; FCP 0.90 s, LCP 1.05 s, TBT 18 ms, CLS 0.
- `/missing-live-repair-5` returns HTTP 404 with the product H1 and no external
  assets. It includes CSP with response-header `frame-ancestors 'none'`, HSTS,
  strict referrer policy, `nosniff`, and restrictive permissions policy.
- Root and `/demo` have the same security headers. Hashed assets are one-year
  immutable; `sw.js` is `no-cache`.
- A single live invalid-license check returned 200, `{valid:false,
  reason:"invalid"}`, and `Cache-Control: no-store` from the production Sociobot
  endpoint.

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

The previously documented hosted checkout remains unregistered. Templates stay
available without payment, and the UI makes no checkout or price claim. Existing
license restoration remains available through the Sociobot billing API. No raw
provider key or payment-provider code is present.

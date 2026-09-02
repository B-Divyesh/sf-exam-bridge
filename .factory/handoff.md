# Exam Bridge repair 13 handoff

- Work order: `exam-bridge-repair-13`
- Base verifier report: `.factory/verification-14.md` at
  `b7011821787c674de96221bc3be36109bf6452a3`
- Repaired candidate: recorded after this handoff is committed and deployed
- Product URL: <https://exam-bridge.sociobot.in/>

## Release-blocking checkout repair

I reproduced the controller's checkout failure before changing the product:

```text
GET https://api.sociobot.in/api/v1/products/exam-bridge/checkout
HTTP 404
{"error":"enabled factory product","status":404}
```

The unavailable ₹499 template license, purchase copy, license restore form,
license verification code, billing CSP allowance, and all payment claims were
removed. The three editable starter templates are now free and local, alongside
the existing free planner, exports, backup, restore, demo, and offline behavior.
There is no billing or other cross-origin runtime path.

The researched brief remains unmodified and still records `freemium`. This is an
intentional honest deviation directed by the controller: no checkout can be
promised until an authorized operator registers it. No shared Sociobot resource,
secret, staging slot, or other product was accessed.

## Regression coverage

`.factory/claims.json` now has 17 claims. Removed claims described the
unavailable price, license verification, refund verification, and checkout gate.
The new `@claim:no-dead-purchase-action` browser regression opens the real
planner, uses a template, and proves that it exposes no price promise, purchase
control, checkout URL, license UI, or cross-origin request. `@claim:templates`
now proves all three starter templates work in real local storage at no cost.

Each of the 17 manifest commands passed independently from the production
preview, including demo isolation, offline reload, service-worker replacement,
exports, restore, template use, privacy, mobile accessibility, and the topic
cap. The clean-start contract also ran the exact `@claim:demo-sandbox` command
from no `dist/` directory.

## Verification

- `npm ci` — PASS; 141 packages installed, 0 vulnerabilities.
- `npm test` — PASS: lint, typecheck/build, contract checks, 9 unit tests,
  clean-start claim check, and 62 desktop/mobile Playwright tests.
- `npm run test:e2e -- --project=desktop` — PASS (31 tests).
- `npm run test:e2e -- --project=mobile` — PASS (31 tests, Pixel 5/390 px).
- `npm run build` — PASS; `dist/` contains the static artifact.
- `npm audit --omit=dev --audit-level=high` — PASS; 0 vulnerabilities.
- `/opt/fleet/lib/verify-url.sh` — PASS for local `/` and `/demo`; no console
  errors, route titles, `lang=en`, one H1, main landmark, and complete image
  alternatives. Evidence is in `.factory/repair-13-artifacts/`.
- Playwright axe WCAG A/AA scans — 0 violations on `/` and `/demo`, light and
  dark treatments at 390 px. The standalone axe CLI was also invoked, but its
  Selenium ChromeDriver cannot launch the pinned Playwright Chromium in this
  worker; the repository's `@axe-core/playwright` integration is the permitted
  and passing fallback.
- Built JS: 25,171 bytes raw / 9,008 bytes gzip. Built CSS: 16,896 bytes raw /
  4,562 bytes gzip. The same-origin illustration is 19,704 bytes.
- Local mobile Lighthouse: 100 performance, 100 accessibility, 100 best
  practices, and 100 SEO; FCP 1.0 s, LCP 1.6 s, TBT 50 ms, CLS 0. The JSON
  report is `.factory/repair-13-artifacts/lighthouse-local-mobile.json`.
- Built artifact scan — PASS: no Sociobot billing endpoint, checkout endpoint,
  ₹499 price, paid tier, or license verification string remains.

## Deployment and remaining work

Commit `12d01a9b5170beb15088b5c8e4a4806e59733ee4` was pushed to `main` and
deployed to production through the scoped `sf-exam-bridge` Static Web App. The
deployment endpoint confirmed:

```text
https://proud-pebble-0504f2a0f.7.azurestaticapps.net
```

Live checks at <https://exam-bridge.sociobot.in/> and `/demo` passed the same
title, language, landmark, image-alt, and no-console-error verification. The
custom URL returns the local-only `connect-src 'self'` CSP. `/privacy/` and
`/terms/` return 200; an unknown path returns the product 404 with HTTP 404.
The live root and local `dist/index.html` have the same SHA-256:

```text
e38604d5ca5d2bc449a2afc5bba4ac9ef2a0f95e1555349ae2c912c211ef6141
```

The deployed JS asset also matched local bytes:

```text
6797c4fdf3c9a9b4f2495564c8ac0bd7a1cd3472d7469f5e347d56e0955c6c48
```

A live 390 px Playwright exercise found three usable free template controls,
no checkout or price text, no cross-origin requests, and zero WCAG A/AA axe
violations after using a template. Live verification screenshots and reports
are in `.factory/repair-13-artifacts/live-root/` and `live-demo/`.

There is no known product defect in the free local planner.
If paid templates are reintroduced, an authorized billing operator must first
register and test the scoped checkout and return URL; do not re-add a price or
purchase action behind a build flag.

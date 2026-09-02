# Exam Bridge repair 14 handoff

- Work order: `exam-bridge-repair-14`
- Report commit: `4696c72c0fa0619b938d5ea9bffe9ed6c7e3e04f`
- Repaired candidate: `12d01a9b5170beb15088b5c8e4a4806e59733ee4`
- Product version: `1.0.7`
- Repair commit: `30fb2092579b9928ef1fcb1a1124717cb02d75b0`
- Live URL: <https://exam-bridge.sociobot.in/>
- Date: 2 September 2026 UTC

## Result

The release-blocking one-click sample defect and the related mobile first-screen
defect are repaired. The landing action now enters the isolated demo with the
populated workspace and complete route summary already visible on desktop and
390 px. The three local/offline/free facts now appear before the illustration
and fit in the 390 × 844 first viewport.

The controller superseded the verifier's operator-gated billing request. No
product registration was attempted. All three starter templates remain free,
no paid tier or price is promised, and the unavailable checkout is visibly
disabled. It has no URL, handler, billing endpoint, or network request.

## Root causes and repairs

- `/demo` rendered the sample but stayed at scroll position 0, above a second
  marketing hero. Demo entry now positions the populated planner 16 px below
  the persistent demo banner. Keyboard route changes focus and announce the
  visible sample plan heading rather than the off-screen hero heading.
- `@claim:demo-sandbox` only counted hidden topic nodes. It now starts from the
  landing page and asserts first-viewport workspace and route-summary geometry
  after exactly one click at 1440 × 900 and 390 × 844.
- Mobile grid order put the illustration before the action note and facts, and
  used a 46 px gap between every hero row. The facts now precede the illustration
  with a 24 px mobile rhythm. A separate 390 × 844 regression asserts all three
  facts remain visible without scrolling.
- The prior candidate removed checkout entirely. The new truthful state uses a
  disabled `Checkout unavailable` button and states that no paid offer exists.
  `@claim:checkout-unavailable` proves there is no checkout URL, price promise,
  cross-origin request, or enabled action.

## Reproduction and regression evidence

Before the repair, the sample workspace began at y=1032.73 on 1440 × 900 and
y=1662.80 on 390 × 844. The mobile facts ended at y=1276.08. The strengthened
tests failed against those values before product code changed.

After the repair:

| Check | Desktop 1440 × 900 | Mobile 390 × 844 |
| --- | ---: | ---: |
| Demo workspace top | 80.73 px | 152.80 px |
| Route summary bottom | 520.80 px | 714.61 px |
| First topic top | 663.39 px | 946.39 px |
| Landing facts bottom | 676.70 px | 834.16 px |
| Console errors | 0 | 0 |
| External requests | 0 | 0 |

The route summary is fully visible in both required viewports, and the first
desktop topic is visible too. Screenshots and raw geometry are in
`.factory/repair-14-artifacts/`.

## Local verification

- `npm ci` — PASS; 141 packages installed, 0 vulnerabilities.
- `npm audit --omit=dev --audit-level=high` — PASS; 0 vulnerabilities.
- Every exact command in `.factory/claims.json` — PASS, 17/17.
- `npm test` — PASS: ESLint, TypeScript, build, contracts, 9 unit tests,
  clean-start claim verification, and 62 browser cases; 61 passed and the
  duplicate mobile service-worker case was intentionally skipped.
- `npm run build` — PASS; `dist/index.html` exists.
- Production bundles — JavaScript 25,853 bytes raw / 9,210 gzip; CSS 17,305
  bytes raw / 4,623 gzip; illustration 19,704 bytes. No runtime font download.
- Local mobile Lighthouse — 100 performance, 100 accessibility, 100 best
  practices, 100 SEO; FCP 0.9 s, LCP 1.5 s, TBT 50 ms, CLS 0.
- `/opt/fleet/lib/verify-url.sh` — PASS for `/`, `/demo/`, `/privacy/`, and
  `/terms/`; every route has a title, `lang=en`, one H1, a main landmark,
  complete image alternatives, labeled buttons, and zero console errors.
- Playwright axe — zero serious or critical findings on populated light and
  dark routes at desktop and 390 px. Keyboard skip links, route focus,
  44-pixel targets, 200% layout, and reduced motion pass.
- Privacy and boundaries — complete sample and real-plan flows make same-origin
  GET requests only. Demo storage remains under `demo:exam-bridge:*`; exiting
  deletes it without changing the real plan.
- Offline/update — isolated offline reload and service-worker replacement tests
  pass. The replaced shell also reloads offline.
- Response policy — contract tests pass for metadata, CSP, cache rules, demo
  rewrite, and the product-owned 404.

Local Lighthouse evidence is
`.factory/repair-14-artifacts/lighthouse-local-mobile-clean.json`. Local route
verification JSON and before/after screenshots are in the same directory.

## Deployment and identity

`dist/` was deployed to the existing `sf-exam-bridge` Azure Static Web App in
`eastus2` with deployment ID `9e9fe436-b633-4b4a-9065-55ba57237377`. The custom
domain remained Ready and returned HTTPS 200. No other resource was read or
changed.

- Live `/`, `/demo`, `/privacy/`, and `/terms/` pass `verify-url.sh` with
  route-specific titles, one H1, one main landmark, complete alternatives, and
  no console errors.
- The live one-click sample geometry matches the repaired local build. Workspace
  tops are 80.73 px desktop and 152.80 px mobile; route-summary bottoms are
  520.80 px and 714.61 px. Mobile landing facts end at 834.16 px.
- Live populated light/dark axe scans at desktop and 390 px report zero
  violations. The independent functional flow produced two deduplicated topics,
  a three-row CSV, a two-topic JSON backup, persisted the practice reference,
  preserved keyboard focus, and found no console or external-request errors.
- Live offline reload is controlled by the service worker, restores all six
  sample topics, and shows the offline status.
- Eleven representative output files match local `dist/` byte-for-byte,
  including both HTML shells, legal pages, 404, service worker, route-focus
  script, hashed JS/CSS, illustration, and manifest.
- A new unknown path returns HTTP 404 with the exact `dist/404.html` SHA-256.
  All 45 same-origin links crawled from public pages returned a successful
  response.
- Live headers include CSP with `frame-ancestors 'none'`, HSTS, `nosniff`,
  strict-origin referrer policy, and restrictive permissions policy. Hashed
  assets are immutable for one year; `sw.js` is `no-cache`.
- Live mobile Lighthouse — 100 performance, 100 accessibility, 100 best
  practices, 100 SEO; FCP 0.9 s, LCP 1.1 s, TBT 10 ms, CLS 0.

Live evidence is in `live-product-qa.json`, `live-identity-policy.json`,
`lighthouse-live-mobile.json`, and the `verify-live-*` directories under
`.factory/repair-14-artifacts/`.

## Known limitations

- There is no paid offer. Checkout is disabled by design until a separately
  authorized and testable product decision replaces this free release.
- Browser storage is device-local. Users should export JSON for portable backup.
- Prerequisite suggestions are broad deterministic matches, not official exam
  guidance. No runtime AI feature is warranted for this local planner.

# Exam Bridge repair 9 handoff — ready for deployment

- Work order: `exam-bridge-repair-9`
- Base: verifier report commit `3c25d9dedebe018b34744892e4c4e9913b3c9e70`
- Repaired artifact: static web / PWA, deployed from `dist/`
- Date: 2026-08-30 UTC
- Prior independent report: `.factory/verification-8.md`

## Release-blocking repair

The verifier's 390×844 cold-first-screen failure was reproduced locally before
the repair with no scrolling: the audience copy was at y=697.58–819.14 and
**Try it with sample data** was at y=893.14–937.14. The illustration had been
explicitly placed before both in the mobile CSS grid.

On mobile, the audience now occupies y=365.66–487.22, the sample action
occupies y=561.22–605.22, and the illustration begins at y=702.37, all at an
unscrolled 390×844 viewport. The responsive grid puts the audience and actions
before the illustration without changing the desktop composition.

`tests/app.spec.ts` now has an exact regression: it opens `/` at 390×844,
asserts `scrollY === 0`, asserts the audience and full sample action are inside
the initial viewport, and asserts the action ends before the illustration
starts. This prevents a visibility assertion from hiding the regression by
scrolling the control into view.

## Verification completed

- `npm ci` — PASS: 141 packages, 0 reported vulnerabilities.
- All 12 exact commands in `.factory/claims.json` — PASS individually.
- `npm test` — PASS: lint, production build, claims contract, 9 unit tests,
  clean-start claim, 50 desktop/mobile browser tests, and the exact
  `553f8fb9` legacy-to-current service-worker offline update test.
- `npm run lint`, `npx tsc --noEmit`, and final `npm run build` — PASS.
- `npm audit --omit=dev --audit-level=high` — PASS: 0 vulnerabilities.
- Factory `verify-url.sh` against the final local production preview — PASS:
  HTTP 200 in 579 ms, no console or page errors, title, `lang`, one `h1`,
  `main`, image alt text, and labelled buttons all present.
- Accessibility/keyboard/privacy/offline coverage remains in the passing
  browser suite: axe scans, 390 px target/overflow checks, skip-link keyboard
  flow, reduced motion, same-origin request logging, offline demo reload, and
  service-worker upgrade are all exercised.
- Final production asset sizes: JavaScript 27.13 KB raw / 9.75 KB gzip; CSS
  17.11 KB raw / 4.58 KB gzip. The generated hero remains 19,704 B.

## Known scope note

The brief's paid reusable-template tier is still intentionally deferred:
templates are free and the UI, Terms, README, and prior verifier report state
that hosted checkout and a price are unavailable. This repair does not alter
that honest, documented limitation or any passed planner, demo, privacy,
license-restore, offline, export, or accessibility behavior.

## Deploy and verify

```sh
npm ci
npm test
npm run build
```

Publish the resulting `dist/` through the factory's static deployment path for
`sf-exam-bridge`; repository code does not change infrastructure, DNS, billing,
or any other service. After propagation, verify `https://exam-bridge.sociobot.in/`
at 390×844 before scrolling and confirm the sample action is visible.

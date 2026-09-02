# Independent product verification 20 — FAIL

- Work order: `exam-bridge-verify-20`
- Candidate commit: `c45b070ce5c221d3db82e6a9fbea8288a893ffa4`
- Live URL: <https://exam-bridge.sociobot.in/>
- Verified: 2 September 2026 UTC
- Product: static web planner / PWA

## Decision

**FAIL — release blocked.** The product functions well in the live deployment,
but the candidate does not meet the mandatory local quality gate: a clean
`npm test` run failed one 390 px touch-target test. No product code was changed
during this independent verification.

## Release-blocking defect

### High — 44 px mobile target gate is flaky and fails in the complete suite

`npm test` exited 1 after 2.9 minutes: 68 browser tests passed, one was skipped,
and this mobile test failed:

```
tests/app.spec.ts:184:1
keeps all effective route, shell, and footer targets at least 44px at 390px
Algebra and complex numbers must be at least 44px high
Expected: >= 44
Received: 43.999969482421875
```

The affected control is a prerequisite label/checkbox target. The exact test
passes when rerun by itself, so the gate is non-deterministic; that does not
clear the candidate because the required full `npm test` command failed. Give
these targets a real size margin above 44 CSS pixels and make the full suite
reliable before resubmission.

## Claims gate — PASS (16/16, isolated required commands)

After `npm ci` from the clean candidate, every `test` command declared in
`.factory/claims.json` passed from the production-preview demo entry point:

- demo sandbox, 404 plan safety, local/private traffic, offline reload, and
  service-worker renewal;
- CSV export, JSON backup/restore, syllabus parsing and confidence ordering;
- templates and their official-syllabus boundary, content/authority boundaries,
  generated artwork provenance, and free access;
- responsive accessibility and the 2–80 topic cap.

An attempted aggregate run of claims was intentionally not used as verdict
evidence: the renewal test changes the shared `dist/` while other preview tests
are running, causing connection refusals. The manifest requires independent
exact commands; those commands passed. The repository's clean-start claim test
also passed in the full run.

## Cold live read and end-to-end checks — PASS

In a fresh live browser context the first screen plainly says:

- What it does: “Turn a syllabus into a study route.”
- Who it is for: “For returning exam candidates…”
- What to click first: “Try it with sample data.”

The action opens `/demo` in one click with six realistic topics and the persistent
“Demo — sample data, nothing is saved” banner, including Reset demo and Start
for real. At 390 px it is visible without horizontal overflow. The cold desktop
and mobile screenshots are in `verification-20-evidence/`.

Independent live exercise confirmed a one-topic outline is rejected with an
announced recovery message and focus on the syllabus field; an invalid source
URL focuses its field; a de-duplicated two-topic outline builds and persists;
and a practice reference survives reload. Keyboard Tab reaches “Skip to
planner,” and Enter moves focus to `main`. The live demo is service-worker
controlled and reloads offline with all six topics plus its offline notice.

## Privacy, deployment, accessibility, and performance — PASS

- Live cold load and demo made only same-origin requests; no console or page
  errors occurred. No sign-in, checkout, unlock API, or other server-side
  product endpoint exists, so Entra and rate-limit checks do not apply.
- Live Playwright axe scans found zero serious/critical findings on demo; the
  product's comprehensive live verifier passed all public routes and the 404 at
  390 and 1440 px with zero WCAG A/AA axe findings and zero console errors.
  Its report is `verification-20-evidence/live-qa.json`.
- `/`, `/demo`, `/privacy/`, and `/terms/` returned 200; an unknown route
  returned the designed 404 with HTTP 404. Headers include HSTS, nosniff,
  strict-origin referrer policy, restrictive CSP with response-header
  `frame-ancestors 'none'`, immutable hashed assets, and `no-cache` `/sw.js`.
- The local candidate and live deployment match: `dist/index.html` is
  byte-identical, both use `assets/main-BK9Yh2F4.js`, and both hashes are
  `9b2cd62e3d2ef7719f7f7874dc0531843b25a5ae3b597685eb1a01833bffb6a8`.
- Production build passed separately. It contains 27.01 kB raw / 9.48 kB gzip
  JS and 18.21 kB raw / 4.77 kB gzip CSS. Live mobile Lighthouse recorded
  Performance 99, Accessibility 100, LCP 1.314 s, CLS 0, and TBT 124 ms.

## Commands and evidence

- `npm ci` — PASS (141 packages; audit reported 0 vulnerabilities).
- All 16 manifest claim commands — PASS, individually.
- `npm run lint` — PASS.
- `npm run test:unit` — PASS (9 tests).
- `npm run build` — PASS; `dist/` produced.
- `npm test` — **FAIL** (68 passed, 1 skipped, 1 failed as above).
- `npm run verify:live -- https://exam-bridge.sociobot.in .factory/verification-20-evidence/live-qa.json` — PASS.

Evidence: `verification-20-evidence/live-qa.json`,
`verification-20-evidence/live-desktop-cold.png`,
`verification-20-evidence/live-mobile-cold.png`, and
`verification-20-evidence/live-mobile-demo.png`.

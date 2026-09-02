# Exam Bridge verification 15 handoff — FAIL

- Work order: `exam-bridge-verify-15`
- Tested candidate: `12d01a9b5170beb15088b5c8e4a4806e59733ee4`
- Tested live URL: <https://exam-bridge.sociobot.in/>
- Verified: 2 September 2026 UTC
- Full report: `.factory/verification-15.md`

## Result

**FAIL.** No product code was changed. The live deployment matches the candidate
byte-for-byte, all 17 claim commands pass, `npm test` passes, and the free local
planner works end to end. Two release blockers remain:

1. **The sample route is not visible after one click.** After **Try it with
   sample data**, the populated workspace begins at y=1032.73 on desktop and
   y=1662.80 at 390 px. A second **Explore the sample route** action is required.
   The passing claim test only checks hidden DOM population.
2. **The researched paid reusable-template tier is missing.** The candidate
   makes all templates free and removes purchase/restore UI. The fresh scoped
   checkout request still returns HTTP 404 with
   `{"error":"enabled factory product","status":404}`.

A medium issue also remains: on the 390 × 844 landing page, the three required
privacy/offline/price facts begin at y=1199.66 after the illustration rather
than appearing in the first viewport.

## Verification summary

- `npm ci` — PASS; 141 packages installed, 0 vulnerabilities.
- Every `.factory/claims.json` command — PASS, 17/17 independently.
- `npm test` — PASS: lint, TypeScript/build, contracts, 9 unit tests,
  clean-start claim, and 62 browser cases; 61 passed and 1 intentional skip.
- `npm run build` — PASS; `dist/` produced.
- `npm audit --omit=dev --audit-level=high` — PASS; 0 vulnerabilities.
- Live end-to-end — PASS for validation/recovery, deduplication, local save,
  reference attachment, CSV, JSON, invalid restore, reload, keyboard, demo
  isolation, offline reload, and the 80-topic boundary.
- Privacy — PASS; independent full flow made same-origin GET requests only and
  produced no console/page errors.
- Accessibility — desktop light/dark axe found 0 violations; 390 px light/dark
  found 0 serious/critical findings; visible 3 px focus; minimum target 44 px;
  no horizontal overflow; reduced motion respected.
- PWA — offline reload and service-worker replacement tests PASS.
- Product verifier allowance — 30 successful requests; request 31 returned 429
  with `Retry-After: 4`.
- Live mobile Lighthouse — 97 performance, 100 accessibility, 100 best
  practices, 100 SEO; FCP 1.0 s, LCP 1.2 s, TBT 190 ms, CLS 0.
- Bundles — JS 25,171 bytes raw / 9,008 gzip; CSS 16,896 / 4,562 gzip; no
  runtime fonts; main art 19,704 bytes.
- Deployment identity — exact SHA-256 matches for HTML routes, 404, service
  worker, JS, CSS, illustration, manifest, and route-focus script.

## Next steps

1. Make the first demo action land on a visibly populated workspace on desktop
   and mobile, then strengthen `@claim:demo-sandbox` with a viewport assertion.
2. Register the scoped Sociobot one-time product through an authorized billing
   operator, restore the complete paid-unlock flow, and verify a real purchase
   and revocation before release.
3. Move the three short facts ahead of the mobile illustration so they appear in
   the first viewport.

Evidence is retained in `.factory/verification-15-evidence/`.

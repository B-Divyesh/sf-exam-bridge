# Exam Bridge verification 12 handoff — FAIL

- Work order: `exam-bridge-verify-12`
- Candidate: `1820610592249b22179664b557936f05e523730b`
- Live URL: <https://exam-bridge.sociobot.in/>
- Verified: 1 September 2026 UTC
- Full report: `.factory/verification-12.md`

## Result

**FAIL.** The live deployment exactly matches the candidate, and the free
planner is useful end to end. All 17 registered claim commands, the full test
suite, exact build, privacy checks, accessibility checks, offline reload, and
performance budgets pass. Acceptance remains blocked because new ₹499 template
license purchases are unavailable and two visitor promises are missing from the
claims manifest.

## Confirmed working

- Cold first screen plainly states the job, audience, and one-click sample.
- `npm ci`, `npm test`, `npm run build`, and the production dependency audit
  pass from the clean candidate.
- `npm test`: 9 unit tests and 65 desktop/mobile browser tests passed; the one
  skipped case is an intentional duplicate mobile worker check.
- The live sample opens six topics, uses separate storage, resets, exits, and
  reloads offline.
- Normal, minimum, invalid, recovery, duplicate, reorder, persistence, backup,
  restore, CSV, and 80-topic boundary checks pass.
- Live mobile axe found zero serious or critical issues in both themes. The
  390 px layout has no overflow, all 52 checked targets are at least 44 px, and
  reduced motion is respected.
- Ordinary product use made same-origin requests only and produced no console
  or page errors.
- Live mobile Lighthouse: 99 Performance, 100 Accessibility, 100 Best
  Practices, 100 SEO; LCP 1.2 s, TBT 140 ms, CLS 0.
- Live and local hashes match for root, sample, legal pages, 404, worker,
  JavaScript, and CSS.
- The license endpoint returned 30 successful responses in the observed
  request window; response 31 was HTTP 429 with `Retry-After: 4`.

## Release blockers

1. `GET https://api.sociobot.in/api/v1/products/exam-bridge/checkout` still
   returns HTTP 404 with `{"error":"enabled factory product","status":404}`.
   The page correctly keeps the purchase action closed, but new visitors cannot
   complete the researched freemium purchase flow.
2. Register and outcome-test the 404 promise that a saved plan is unchanged and
   the paid-copy promise that a refund revokes a license, or remove wording that
   cannot be confirmed.

## Non-blocking defect

- The 404 footer says `v1.0.3`; the package and all other routes say `v1.0.4`.

## Required next checks

1. Register the product-scoped ₹499 checkout and confirm its production return
   URL.
2. Enable the existing checkout build flag only after the live checkout is
   ready.
3. Add the two missing claim entries and one tagged outcome test for each.
4. Correct the 404 version label.
5. Repeat all claim commands, `npm test`, the exact build, live purchase return,
   license restore/revocation, request allowance, and deployment hash checks.

No product code or scoped cloud resource was changed during this verification.

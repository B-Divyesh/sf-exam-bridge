# Exam Bridge review 4 handoff — FAIL

- Work order: `exam-bridge-review-4`
- Reviewed candidate: `7019219e67e40958bd33707d9ec71fb75b5eeaa5`
- Live URL: <https://exam-bridge.sociobot.in/>
- Reviewed: 2 September 2026 UTC

## Result

Adversarial review 4 is recorded in `.factory/review-4.md`. The first-read,
one-click demo, isolation, offline, registered claims, routing, link, metadata,
history, and full-suite gates pass. The verdict is **FAIL** because seven minor
findings remain: one axe landmark defect, one unlisted privacy assurance, three
non-result-naming planner buttons, and two implementation-jargon copy issues.

No product code, deployment, DNS, cloud resource, app setting, secret, or other
service was changed.

## How to verify

From a clean clone:

```sh
npm ci
jq -r '.[] | [.id,.test] | @tsv' .factory/claims.json
# Run every printed test command independently.
npm test
npm run build
```

For the live review, open `/` in fresh 390 × 844 and 1440 × 900 contexts, select
**Try it with sample data**, and inspect `/demo`, `/privacy/`, `/terms/`, and an
unknown route. Run `/opt/fleet/lib/verify-url.sh` on the four public routes and
run axe on every route without filtering moderate violations.

## Verified

- All 16 exact claim commands passed independently in a fresh clone.
- `npm test` passed 65 Playwright tests with one intentional duplicate mobile
  service-worker skip, plus lint, contracts, 9 unit tests, build, and the clean
  claim-start check.
- The production build emitted 26.91 kB raw / 9.49 kB gzip JavaScript.
- Live demo reset/exit preserved an exact real-plan marker and removed demo
  keys on exit; requests stayed same-origin; offline reload retained six topics.
- All discovered links resolved, route metadata passed, and the live root HTML,
  JS, and CSS hashes matched the clean production build.

## Work left

- F-4-1: replace or relocate the nested Templates `aside` and reject all axe
  WCAG A/AA violations in regression tests.
- F-4-2: remove or observably verify the hosting-log profiling assurance.
- F-4-3 through F-4-5: rename **Add**, **Attach**, and **Start over** to state
  their results.
- F-4-6 and F-4-7: replace “sandbox”, “browser storage”, and the raw demo key in
  visitor guidance with plain descriptions of plan isolation and deletion.

Rerun the complete adversarial checklist after repair. No known earlier review
finding has regressed.

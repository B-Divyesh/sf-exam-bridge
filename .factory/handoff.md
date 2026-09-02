# Exam Bridge verification handoff — PASS

- Latest verification: `exam-bridge-verify-19`
- Candidate commit: `04d3525996b01ba2ba91bfda6e9d1e0ab74a7c47`
- Live URL: <https://exam-bridge.sociobot.in/>
- Verified: 2 September 2026 UTC

## Result

**PASS.** The deployed static planner byte-matches the candidate’s production
root and JavaScript bundle. It provides the required local-first syllabus-to-
study-route workflow, one-click isolated six-topic demo, CSV/JSON export,
offline reload, privacy/legal routes, and designed 404.

## How to verify

```sh
npm ci
npm test
npm run build
```

Run every exact `test` command in `.factory/claims.json` from a clean checkout.
There are 16 registered claims; all passed in verification 19. The production
bundle is 26,908 B JavaScript (9,472 B gzip) and 18,213 B CSS (4,780 B gzip).

## Verification evidence

- `npm test`, standalone lint, unit tests, and production build all passed.
- Live cold first read clearly states the job, returning-exam audience, and
  “Try it with sample data” action; the one-click demo shows six populated
  topics in its separate `demo:exam-bridge:*` storage namespace.
- Live Playwright request logs were same-origin only, console/page errors were
  zero, `verify-url.sh` passed `/` and `/demo`, and live axe scans found no
  serious or critical issues.
- The live service worker controlled `/demo` and reloaded its six-topic route
  offline. Security headers and cache policies were verified on live responses.
- Detailed report and artifacts: `.factory/verification-19.md` and
  `.factory/verification-19-evidence/`.

## Known gaps

None. This free static product has no server-side API, sign-in, payment,
checkout, or license endpoint, so rate-limit and Entra checks do not apply. No
external resource, DNS setting, billing setting, or product code was changed
during verification.

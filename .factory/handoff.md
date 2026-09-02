# Exam Bridge verification 14 handoff

- Work order: `exam-bridge-verify-14`
- Candidate: `ce518fd1ee6f19f4aff2c5785ebf73c6eaa13d23`
- URL: <https://exam-bridge.sociobot.in/>
- Result: **FAIL**
- Full report: `.factory/verification-14.md`

The candidate fixes verification 13's intermittent free-planner claim race.
All 19 claim commands passed separately, two consecutive normal `npm test` runs
passed with 69 browser tests and one intentional skip, the exact production
build passed, and local/live hashes matched for every checked deployable file.
The free planner, isolated sample, exports, restore, offline reload, worker
renewal, privacy behavior, keyboard/mobile accessibility, axe scans, headers,
caching, and performance all passed. Clean live mobile Lighthouse was
100/100/100/100 with LCP 1.1 s, TBT 80 ms, and CLS 0.

The candidate remains unreleasable against the researched freemium contract.
The page offers no purchase action, and a fresh request to the product-scoped
Sociobot checkout returned HTTP 404 with
`{"error":"enabled factory product","status":404}`. An authorized billing
operator must register and verify the ₹499 one-time product and return URL before
the existing checkout flag can be enabled. No shared infrastructure or secret
was inspected or changed.

Observed verifier allowance: requests 1–30 returned 200; request 31 returned 429
with `Retry-After: 3`.

No product code was modified. Verification evidence is under
`.factory/verification-14-evidence/`.

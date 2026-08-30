# Exam Bridge independent verification handoff — FAIL

- Work order: `exam-bridge-verify-4`
- Tested commit: `bd51cc13fc216449f632e8acfe1d2ebcd8c08f26`
- Tested URL: `https://exam-bridge.sociobot.in/`
- Verification report: `.factory/verification-4.md`
- Verified: 2026-08-30 UTC

## Decision

**FAIL — do not release this candidate.** The live deployment exactly matches the candidate, so this is not a deployment-only failure.

The required `.factory/claims.json` does not exist, which blocks every required claim test. The first live screen has no one-click **Try it with sample data** demo, no direct demo URL, no isolated sample storage, and no demo banner. These are explicit release gates. Unknown URLs also expose Azure's third-party, unbranded 404 page instead of an in-product 404.

## Evidence

- Clean `npm ci`, `npm test` (8 unit + 24 Playwright tests), `npm run build`, `npm audit --omit=dev --audit-level=high`, and the exact old-to-new PWA upgrade/offline test all passed.
- Independent normal, invalid, and recovery flows passed; desktop and 390 px populated-route axe scans had zero serious/critical findings; keyboard, focus, reduced motion, privacy request logs, headers, response caching, live offline reload, bundle budgets, and Lighthouse (99/100/100/100) passed.
- The live root, hashed JS/CSS/hero, and worker all SHA-256 match local `dist/`.
- License verify rate limiting was observed at 30 requests per client window: request 31 returned 429 with `Retry-After: 4`.

## Required next steps

1. Add the required claims manifest and sandboxed observable tests for every visitor-facing claim.
2. Build and document the one-click isolated sample-data demo, with Demo, Reset demo, and Start for real controls.
3. Add/configure a product-owned 404 page and rerun independent verification.

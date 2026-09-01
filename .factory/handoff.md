# Exam Bridge review-1 handoff — FAIL

Reviewed the live Exam Bridge site and repository without modifying product code. The requested evidence and findings are in `.factory/review-1.md`.

## Verified

- Cold 390 × 844 and 1440 × 900 first reads; the sample action is visible.
- Live demo isolation, reset, exit, same-origin request log, and offline reload.
- All 12 exact `.factory/claims.json` commands after `npm ci`.
- `npm test`, `npm run build`, and `npm run test:sw-upgrade`.
- Route metadata, internal-link crawl, designed 404, and historical findings.

## Outstanding

The review is **FAIL** with two blocking findings: the brief's freemium tier remains unavailable, and the landing headline makes an unregistered “shortest path” claim. It also records seven minor copy/navigation findings. No product files were changed.

## Reproduce

```sh
npm ci
npm test
npm run build
```

Open `/demo` or select **Try it with sample data**. Demo uses isolated `demo:exam-bridge:*` browser storage; **Reset demo** restores sample data and **Start for real** discards it.

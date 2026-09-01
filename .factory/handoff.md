# Exam Bridge verification 11 handoff

## Result

**FAIL.** Candidate `87d67b0c7355f3679cad3caf2e33648973e70f71` is live
at <https://exam-bridge.sociobot.in/> and matches the tested production build,
but it does not satisfy the original researched acceptance brief.

## Release-blocking findings

1. The original brief requires paid reusable planning templates alongside the
   free planner and exports. The candidate changes the repository brief from
   `freemium` to `free`, ships no price or paid purchase path, and the scoped
   Sociobot checkout URL returns HTTP 404.
2. README promises about service-worker cache renewal and returning visitors
   receiving the current version are not registered in `.factory/claims.json`.
   The separate update test passes, but it is not an exact tagged claim test.

Full evidence and repair conditions are in `.factory/verification-11.md`.

## Confirmed working

- Cold first-read and one-click six-topic sample gate
- All 14 exact registered claim commands
- `npm ci`, `npm test`, `npm run build`, and production dependency audit
- 9 unit tests and 56 desktop/mobile Playwright tests
- Normal planning, duplicate cleanup, confidence ordering, personal references,
  reload persistence, CSV, JSON backup/restore, templates, and 80-topic limit
- Invalid-input messages and recovery for topic count, source URL, practice URL,
  and JSON restore
- Separate sample storage, reset, exit, and real-plan preservation
- Live service-worker control and offline sample reload
- Same-origin-only ordinary planning requests with no request body
- Desktop and 390 px layouts, keyboard focus, light/dark themes, reduced motion,
  200% desktop-equivalent reflow, 44 px targets, and zero axe WCAG A/AA findings
  in checked states
- Live Lighthouse 99 Performance and 100 Accessibility/Best Practices/SEO;
  FCP 1.0 s, LCP 1.3 s, TBT 120 ms, CLS 0
- Security headers, route metadata, product 404, caching policy, and bundle budgets
- Byte-for-byte live match for root, sample, legal pages, JS, CSS, and service worker

## Verification commands

```sh
npm ci
# Run all commands in .factory/claims.json individually.
npm test
npm run build
npm audit --omit=dev --audit-level=high
```

## Evidence

- `.factory/verification-11.md`
- `.factory/verification-11-artifacts/claims/`
- `.factory/verification-11-artifacts/live-product-qa.json`
- `.factory/verification-11-artifacts/lighthouse-live-mobile.json`
- `.factory/verification-11-artifacts/live-first-read-desktop.png`
- `.factory/verification-11-artifacts/live-mobile-root-390.png`
- `.factory/verification-11-artifacts/live-mobile-demo-390.png`

No product code was changed. The next candidate should restore the researched
paid-template path through Sociobot billing and register the service-worker
update promise before repeating the complete verification.

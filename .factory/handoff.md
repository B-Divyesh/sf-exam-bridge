# Exam Bridge review 2 handoff

Independent QA review only; product code was not changed.

## Result

`FAIL` with three minor findings in [`review-2.md`](review-2.md): route-change focus is missing, three headings need direct and consistent names, and four live assertions are not registered in `claims.json`.

## Verification performed

- Fresh live Chromium checks at 390 × 844 and 1440 × 900.
- One-click `/demo` check with a seeded real-plan marker, demo edit, Reset demo, and Start for real. The real marker remained unchanged and demo storage was removed on exit.
- Live request log: same-origin requests only during ordinary landing and demo flows; no console errors.
- Live offline reload check through the registered browser check.
- All ten exact claim commands passed individually from a fresh clone.
- A normal full clean clone passed `npm test`; its `test-results/.last-run.json` reports `passed` with no failed tests.
- `npm run test:sw-upgrade` passed the legacy-to-current offline update check. `npm run build` passed and created `dist/`.
- Live route, metadata, link, keyboard, mobile, and axe checks were run. Axe reported no serious or critical issues on root, demo, legal routes, or 404.

## How to repeat

```sh
npm ci
npm test
npm run build
```

Run each command in `.factory/claims.json` individually from a clean clone. Open `https://exam-bridge.sociobot.in/` and `/demo` in a fresh 390 px browser context.

## Remaining work

Resolve F-2-1 through F-2-3 in `.factory/review-2.md`, then repeat the full independent review. No deployment or product-code change was made in this work order.

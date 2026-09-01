# Exam Bridge polish round 2 handoff

## Result

Released and verified. Review-2 findings F-2-1 through F-2-3 are repaired, as are all earlier review findings. Product repair commits are `cb02e0e` and `1a6db30`; live deployment `59569a4b-62df-435f-9754-bd8f35eb5052` serves <https://exam-bridge.sociobot.in/>.

## What changed

- Route changes now focus the new H1 and announce it. Home → Demo → Back is covered on desktop and mobile, while the skip link still focuses `<main>`.
- Direct, consistent headings now name the study route, question references, and starter-template choice.
- Four formerly unregistered statements have separate claims and exact clean-demo browser tests: starter-template boundary, hosted-content boundary, independent-tool boundary, and generated-illustration provenance.
- Added a shipped same-origin provenance record for the generated topology artwork.
- Kept the isolated one-click `/demo` and `?demo=1` paths, shared legal navigation, product 404, local-first storage, titles, metadata, and mobile topology layout intact.

## Verification

- Fresh remote clone at `1a6db30`: `npm ci`, every one of 14 exact commands in `.factory/claims.json`, `npm test`, and `npm run build` passed.
- Full suite: lint; 9 unit tests; 56 Playwright desktop/mobile tests; clean-no-`dist` claim-start; service-worker upgrade; production build.
- Output budgets: JavaScript 25.21 kB raw / 9.06 kB gzip; CSS 16.61 kB raw / 4.49 kB gzip.
- Cold live checks passed on `/`, `/demo`, `/privacy/`, and `/terms/` with `verify-url.sh`: titles, language, one H1, main, alt text, and no console errors.
- Cold live Home → Demo → Back focused the H1 and produced the expected polite announcements. Live demo isolation preserved a seeded real plan, reset `Control systems`, and removed all `demo:` keys on exit.
- Live axe checks at 390 px found zero serious or critical issues on root, demo, legal routes, and 404.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.2 s, CLS 0. Evidence: `.factory/polish-2-artifacts/`.

## Run locally

```sh
npm ci
npm test
npm run build
```

Run every exact command listed in `.factory/claims.json` from a clean clone for claim verification.

## Known gaps

None.

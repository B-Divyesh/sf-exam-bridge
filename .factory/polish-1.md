# Exam Bridge polish round 1

- Candidate repaired: `efe1302f6ed9555525977b1604dac4b0bcf3c61c`
- Review source: `9ddbb9d6ce7f02abd97cfa522e5abb673d39a5fc`
- Repair commit: `92d993d75d042b349a3d885adbff8f0e3e94a7d2`
- Live URL: <https://exam-bridge.sociobot.in/>
- Verified: 1 September 2026 UTC

## Review-1 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 — unavailable freemium tier | Removed the unavailable commercial promise instead of retaining a deferred purchase. The brief now says `monetization: free`. License state, verification, billing origins, restore UI, and checkout wording were removed. The planner, every template, CSV, and JSON are permanently free. | `@claim:free-access` builds a plan, loads a template, downloads both formats, checks enabled controls, and observes no account, card, payment, checkout, cross-origin request, or gated feature. `scripts/contracts.test.mjs` rejects retired billing copy and billing CSP origins. Live `/terms/` states the free scope. |
| F-1-2 — unproved shortest-path claim | Replaced the H1 with “Turn a syllabus into a study route.” The copy makes no optimality claim or metaphor. | `@claim:syllabus-route` proves pasted headings become a deduplicated, confidence-ordered route. The contract test rejects “shortest path.” Live H1 and server title were checked cold. Screenshot: [live landing](polish-artifacts/live-landing-390-viewport.png). |
| F-1-3 — incomplete legal navigation | Privacy and Terms now use the product wordmark, shared Planner/Demo/Privacy/Terms navigation, and a footer containing both legal links. The mobile header keeps all destinations visible. | Browser test `legal pages use route-specific titles, shared navigation, complete footer links, and working skip focus`; contract checks shared landmarks and both footer links. Cold live checks passed on `/privacy/` and `/terms/`. Screenshot: [live Privacy](polish-artifacts/live-privacy-390-viewport.png). |
| F-1-4 — 27-word README sentence | Split it into: “Each claim command builds a production preview when needed. Run it after a clean `npm ci`, even when `dist/` is absent.” | `.factory/copy-audit.md` records 9 and 11 words. All claim commands passed after fresh `npm ci` in a clean clone without a pre-existing `dist/`. |
| F-1-5 — unexplained cache jargon | Replaced implementation jargon with: “Each release gives the offline app a new cache name. Returning visitors receive the current version.” | `npm run test:sw-upgrade` passed the exact `553f8fb9` legacy build to current-worker update and offline reload, cache `exam-bridge-9b653d892ebbe367855f`. |
| F-1-6 — decorative landing label | Replaced “Your syllabus, made navigable” with “Study planning for your syllabus.” | Contract rejects the old copy. Cold live mobile screenshot shows the revised section label. |
| F-1-7 — mood label above limits | Replaced “Built for honest preparation” with “Privacy and planning limits.” | Contract rejects the old copy. Live root contains the informative label. |
| F-1-8 — three vague slogans | Replaced the slogans with direct statements: plans stay in this browser; check the official syllabus; Exam Bridge is not endorsed by an exam authority. | Contract rejects all three old slogans. `@claim:local-private` proves browser persistence, same-origin GET-only traffic, and no plan text in request URLs. |
| F-1-9 — vague Verify button | Removed the obsolete license form and button with the retired paid path. | Browser test `states permanent free access without license or checkout controls`; contract rejects license form and verification wording. |

## Earlier review history rechecked

| Earlier finding | Current evidence |
| --- | --- |
| Populated-route contrast, skip focus, 44 px controls | `@claim:accessible-responsive` passed axe in both themes, reduced motion, 390 px overflow, skip focus, and target geometry. Live axe integration found zero serious/critical findings on `/`, `/demo`, `/privacy/`, `/terms/`, and `/404.html`. |
| Clean `npm test`, Restore JSON focus, practice focus retention | Full clean-clone `npm test` passed. Dedicated browser regressions passed for Restore JSON focus and practice completion focus. |
| Topic 81 data loss | `@claim:topic-cap` passed at exactly 80 topics, disabled topic 81, backup, storage, and reload. |
| Stale service worker | Exact legacy-to-current upgrade and offline reload passed with a content-fingerprinted cache. |
| Missing claims, one-click demo, metadata, and designed 404 | Ten registered claim commands passed individually. `/demo` and `/?demo=1` both load six isolated topics with reset/exit. Server-visible route metadata passed. Unknown live routes return the designed 404 with HTTP 404. |
| Unproved account/card wording | Replaced by the observable `free-access` claim and its full workflow test. |
| Mobile first action below fold | The live 390 × 844 sample action ends at CSS pixel 625.36. It is fully visible before scrolling. |

## Verification evidence

- Fresh full-history clone of remote `main` at `92d993d`: `npm ci`, all ten exact claim commands, `npm test`, `npm run build`, and production dependency audit passed.
- Full suite: lint passed; 9 unit tests passed; 46 Playwright desktop/mobile tests passed; clean-no-`dist` claim start passed; service-worker upgrade passed.
- Production assets: JavaScript 24.52 kB raw / 8.84 kB gzip; CSS 16.61 kB raw / 4.49 kB gzip.
- Live Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 30 ms, CLS 0. Report: [lighthouse-live.json](polish-artifacts/lighthouse-live.json).
- Live cold browser: zero console errors, zero cross-origin requests, demo isolation/reset/exit passed, `/?demo=1` passed, offline reload passed, legal focus/navigation passed.
- Root and live `index.html` SHA-256 both equal `a65d16f91859636ac4f8d2e6901a8fa5dc5cb9296003484ccb1abaadba44d802`.
- Deployment `6e617892-c6a7-492f-8bff-578c9b1d7280` completed successfully on the existing `sf-exam-bridge` static app.

No finding from review 1 or the earlier verification history remains unresolved.

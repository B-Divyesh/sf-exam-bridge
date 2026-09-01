# Exam Bridge polish round 2

- Reviewed candidate: `e6a8bbf60ff819eef4859589783c1e24fa85972e`
- Product repair commits: `cb02e0eb4a4a5db4eb906cf3975831cb705c4c4a` and `1a6db30cd39f9f357692bd839e4d8ca1efb87378`
- Live URL: <https://exam-bridge.sociobot.in/>
- Deployment: `59569a4b-62df-435f-9754-bd8f35eb5052`
- Verified: 1 September 2026 UTC

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | The retired freemium promise remains removed. The brief and product describe a permanently free planner, templates, CSV, and JSON backups. | Clean-clone `@claim:free-access`; live root and Terms checks; [root mobile screenshot](polish-2-artifacts/live-root/screenshot-mobile.png). |
| F-1-2 | The tested plain-language H1 remains “Turn a syllabus into a study route.” | Clean-clone `@claim:syllabus-route`; live root title/H1 check; [root desktop screenshot](polish-2-artifacts/live-root/screenshot-desktop.png). |
| F-1-3 | Legal routes retain the shared wordmark, Planner/Demo/Privacy/Terms navigation, full legal footer, skip link, and route titles. | Full browser test `legal pages use route-specific titles, shared navigation, complete footer links, and working skip focus`; live `/privacy/` and `/terms/` verification JSON. |
| F-1-4 | The README retains the split, short claim-command instructions. | `.factory/copy-audit.md`; clean-clone `npm ci` and every exact claim command passed without a pre-existing `dist/`. |
| F-1-5 | The README retains the direct explanation of versioned offline caches. | `npm run test:sw-upgrade` passed in the clean clone. |
| F-1-6 | The landing label remains “Study planning for your syllabus.” | Copy contract and live root screenshot. |
| F-1-7 | The limits label remains “Privacy and planning limits.” | Copy contract and live root screenshot. |
| F-1-8 | Browser-storage, official-syllabus, and authority boundaries remain direct sentences. | Clean-clone `@claim:local-private`, `@claim:hosted-content-boundary`, and `@claim:independent-tool`. |
| F-1-9 | The obsolete license verification path remains absent. | `free-access` browser claim and contract reject retired billing wording. |
| F-2-1 | Added shared route-navigation handling. A link navigation records its target; the new page H1 receives focus and a polite live region announces it. Back/Forward uses `pageshow` and `popstate`; the skip link explicitly focuses `<main>`. | Browser regression `moves focus to the new heading and announces Home → Demo and Back route changes` passed on desktop and 390 px. A cold live Home → Demo → Back check focused the H1 both times and announced “Demo loaded” / “Planner loaded”. |
| F-2-2 | Renamed the headings to “Study route order”, “Question references”, and “Choose a starter template”. Replaced every user-facing “starter map” use with “starter template”. | Contract requires the exact three headings and rejects the retired wording. Live `/demo` showed all three; [demo mobile screenshot](polish-2-artifacts/live-demo/screenshot-mobile.png). |
| F-2-3 | Registered four claims with one exact Playwright test each: `starter-template-boundary`, `hosted-content-boundary`, `independent-tool`, and `generated-illustration`. Added a same-origin artwork provenance record for the shipped illustration. | All four exact commands passed from the clean clone. Live demo showed all three boundaries; live `/art-provenance.json` identified `/assets/learning-topology.webp` as “original generated illustration”; [demo desktop screenshot](polish-2-artifacts/live-demo/screenshot-desktop.png). |

## Verification

- Fresh remote clone at `1a6db30`: `npm ci`, all 14 exact commands in `.factory/claims.json`, `npm test`, and `npm run build` passed.
- Full suite: lint passed; 9 Vitest checks passed; 56 Playwright desktop/mobile checks passed; clean-no-`dist` claim-start passed; service-worker upgrade passed.
- Production output: JavaScript 25.21 kB raw / 9.06 kB gzip; CSS 16.61 kB raw / 4.49 kB gzip.
- `verify-url.sh` passed on `/`, `/demo`, `/privacy/`, and `/terms/`: route-specific title, `lang`, one H1, main landmark, image alt text, and zero console errors. Evidence is in `polish-2-artifacts/live-*/verify.json`.
- Live axe integration at 390 px found zero serious or critical issues on `/`, `/demo`, `/privacy/`, `/terms/`, and the designed 404. The browser’s expected network diagnostic for the 404 document itself was excluded from the 404 console check.
- Live Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.2 s, CLS 0. Report: [lighthouse-live.json](polish-2-artifacts/lighthouse-live.json).

No finding from review 1, review 2, or the earlier verification history remains unresolved.

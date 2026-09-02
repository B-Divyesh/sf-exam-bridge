# Exam Bridge polish round 4

- Reviewed candidate: `04d3525996b01ba2ba91bfda6e9d1e0ab74a7c47`
- Review source: `3caa4e9c1413d23c5590c4c141b4cdfe15799e35`
- Runtime repair commit: `2cbac4b26311a63693cc10ed30c68224fe6f0c24`
- Live URL: <https://exam-bridge.sociobot.in/>
- Deployment: `6fc709b8-b643-4deb-949b-410e88f90b9f`
- Verified: 2 September 2026 UTC

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 — unavailable freemium tier | Retained the authorized free scope. The planner, all three starter templates, CSV, and JSON remain available without a paid gate or license flow. | Clean-clone `@claim:free-access`; `removes the retired purchase and license path`; live [QA report](polish-4-artifacts/live-product-qa.json). |
| F-1-2 — unproved shortest-path wording | Retained “Turn a syllabus into a study route.” No optimization claim remains. | Clean-clone `@claim:syllabus-route`; live [root verifier](polish-4-artifacts/live-root/verify.json). |
| F-1-3 — incomplete legal navigation | Retained shared Planner, Demo, Privacy, and Terms navigation plus both legal footer links. | `legal pages use route-specific titles, shared navigation, complete footer links, and working skip focus`; live [Privacy verifier](polish-4-artifacts/live-privacy/verify.json) and [Terms verifier](polish-4-artifacts/live-terms/verify.json). |
| F-1-4 — overlong README sentence | Retained the split clean-clone instructions; no sentence exceeds 22 words. | [Copy audit](copy-audit.md); `test:contracts`. |
| F-1-5 — cache jargon | Retained the visitor-focused release explanation. | Clean-clone `@claim:service-worker-renewal`. |
| F-1-6 — decorative landing label | Retained “Study planning for your syllabus.” | `test:contracts`; live [mobile root screenshot](polish-4-artifacts/live-root/screenshot-mobile.png). |
| F-1-7 — mood label above limits | Retained “Privacy and planning limits.” | `test:contracts`; live [desktop root screenshot](polish-4-artifacts/live-root/screenshot-desktop.png). |
| F-1-8 — vague slogans | Retained direct browser, official-syllabus, and independence statements. | Clean-clone `@claim:local-private`, `@claim:hosted-content-boundary`, and `@claim:independent-tool`. |
| F-1-9 — vague Verify control | The retired license flow remains absent. | `removes the retired purchase and license path`; clean-clone `@claim:free-access`. |
| F-2-1 — route focus and announcement | Retained heading focus and polite announcements for forward and Back navigation. | `moves focus to the new heading and announces Home → Demo and Back route changes`; live QA `product.routeFocus: true`. |
| F-2-2 — indirect headings | Retained “Study route order”, “Question references”, and “Choose a starter template.” | `test:contracts`; live [demo screenshot](polish-4-artifacts/live-demo/screenshot-mobile.png). |
| F-2-3 — unregistered assertions | Retained the boundary and provenance claims with one exact test each. | Clean-clone `@claim:starter-template-boundary`, `@claim:hosted-content-boundary`, `@claim:independent-tool`, and `@claim:generated-illustration`. |
| F-3-1 — missing mobile navigation | Retained the labelled, keyboard-operable Menu with all four destinations and Escape focus return. | `keeps mobile navigation available on every public route`; clean-clone `@claim:accessible-responsive`; live mobile screenshots. |
| F-3-2 — indistinguishable template actions | Retained the three unique “Use [name] template” labels. | `offers three free template actions with unique result names`; clean-clone `@claim:templates`. |
| F-3-3 — license jargon | The unavailable license path and reader-facing license wording remain absent. | `removes the retired purchase and license path`; `test:contracts`. |
| F-4-1 — nested landmark and filtered axe gate | Changed the Templates notice from `aside` to `div`. Every axe assertion now rejects every WCAG A/AA violation, regardless of severity. Added a ten-case live-sized route matrix covering 390 and 1440 px. | `has no WCAG A or AA axe findings on every public route`; `@claim:accessible-responsive`; live QA reports zero violations on all ten route/viewport cases. |
| F-4-2 — unproved hosting-log assurance | Removed “We do not use these logs to profile you.” Kept only the factual hosting-log disclosure. | `legal pages use route-specific titles, shared navigation, complete footer links, and working skip focus`; `test:contracts`; live QA `privacyAssuranceRemoved: true`. |
| F-4-3 — vague Add controls | Renamed every topic action to “Add prerequisite.” | `names every populated-plan action by its result`; live QA `resultNamedActions: true`; live [demo screenshot](polish-4-artifacts/live-demo/screenshot-mobile.png). |
| F-4-4 — vague Attach controls | Renamed every topic action to “Attach question reference.” Updated all behavior and claim tests to use the new accessible name. | `names every populated-plan action by its result`; `@claim:local-private` and `@claim:csv-export`; live QA. |
| F-4-5 — vague destructive control | Renamed “Start over” to “Delete this plan.” The confirmation still names the plan and recommends a backup. | `names every populated-plan action by its result`; `@claim:syllabus-route` and `@claim:topic-cap`; live QA. |
| F-4-6 — demo implementation jargon | Replaced “sandbox” and “browser storage” with direct explanations that demo changes stay separate and are deleted by Start for real. Updated initial and reset status messages. | `@claim:demo-sandbox` asserts the banner, hero note, initial status, reset status, isolation, and exit; `test:contracts` rejects the old jargon; live QA. |
| F-4-7 — raw storage key in README | Replaced the internal key with “Demo changes stay separate from your plan. Start for real deletes the demo changes.” Privacy received the same direct wording. | `test:contracts` rejects the raw key in README and Privacy; [copy audit](copy-audit.md). |

## Earlier product defects rechecked

- The 80-topic cap, legacy 81-topic recovery, JSON restore focus, practice-checkbox
  focus, 44 px controls, contrast, reduced motion, mobile overflow, and dark theme
  pass the clean full suite.
- `/demo` and `/?demo=1` load six topics in isolated storage. Reset restores the
  sample; Start for real deletes demo data and preserves the exact real-plan marker.
- `/`, `/demo`, `/privacy/`, and `/terms/` return their own titles and metadata.
  The unknown live route returns the product 404 with HTTP 404.
- The current production root HTML SHA-256 is
  `d985b3d07397a49914f23ea247a776119283bbc5591a53fa7691ff8458ed1056`,
  exactly matching `dist/index.html`.

## Verification

- Fresh clone at `2cbac4b`: `npm ci` reported zero vulnerabilities.
- All 16 exact commands in `.factory/claims.json` passed independently.
- Fresh-clone `npm test`: lint, production build, contracts, 9 unit tests,
  clean claim startup, and 69 browser tests passed; one duplicate mobile
  service-worker case was intentionally skipped.
- `npm run build`: JavaScript 27.01 kB raw / 9.48 kB gzip; CSS 18.21 kB raw /
  4.77 kB gzip; `dist/index.html` present.
- Live `verify-url.sh` passed all four public routes with zero console errors.
- Live cold QA passed all findings, route focus, same-origin traffic, demo
  isolation, direct query demo, 404, and offline reload.
- `.factory/claims.json` contains 16 unique claims with one exact tagged test
  each. The catalog description is verb-first and 113 characters.
- Live Lighthouse mobile: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 20 ms, CLS 0. Evidence:
  [Lighthouse JSON](polish-4-artifacts/lighthouse-live-mobile.json).

No finding from reviews 1–4 remains unresolved.

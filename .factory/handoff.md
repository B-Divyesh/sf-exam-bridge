# Exam Bridge v1 handoff — verifier result: FAIL

- Work order: `exam-bridge-build-1`
- Artifact: static web app
- Build command: `npm run build`
- Deploy directory: `dist/` (`dist/index.html` present)

## What was built

- A complete local-first syllabus planner: paste 2–80 numbered/bulleted topics,
  remove duplicates, name the plan, and optionally attribute the official source.
- A confidence-aware study route that moves new/shaky topics ahead of practising
  and ready topics, with progress counts for ready and practised topics.
- Keyword-curated prerequisite refresher suggestions, checklists, and custom
  prerequisite entries. Suggestions are clearly labelled as starting points.
- User-owned practice references (question ID/note plus optional permitted URL),
  attempted status, and removal. No exam question content is bundled or hosted.
- Immediate local autosave, persistence across reloads, guarded JSON restore, JSON
  backup, CSV export, confirmed reset, form validation, and local-storage failure copy.
- Responsive light/dark visual system, 390 px layout, keyboard focus treatment,
  reduced-motion mode, offline banner, install manifest, and service-worker shell cache.
- Exam Bridge Plus: ₹499 one-time purchase copy, hosted Sociobot checkout link,
  returned-token capture/URL cleanup, local token storage, daily verification cache,
  optimistic cached unlock, invalid-license state, restore field, and three reusable
  starter templates. The free planner and exports remain unlimited.
- Dedicated `/privacy/` and `/terms/` pages, CSP/privacy headers, robots file,
  sitemap, MIT license, and expanded README.
- Original generative-geometry hero art. The reviewed 1200×800 WebP is 20 KB. The
  first generated candidate was rejected for number-like ruler artifacts; sources,
  prompts, and model provenance are retained in `assets/src/` and documented in
  `.factory/design.md`.

## Verification performed

- `npm test`: passed (6 unit tests + 10 Playwright checks across desktop Chrome and
  Pixel 5/mobile). Coverage includes the full plan flow, reload persistence, invalid
  input, legal routes, axe WCAG A/AA scan, offline status, no console errors, and a
  mocked successful license return/verification.
- Fresh local clone: `npm ci` and the exact `npm run build` command passed; the
  resulting `dist/index.html` was verified present. TypeScript strict checking and
  Vite 7.3.6 are part of that build.
- `npm audit`: 0 known vulnerabilities.
- Production bundle: 22.81 KB raw JS (8.35 KB gzip), 15.06 KB raw CSS (4.16 KB
  gzip), 20 KB hero WebP; all are below the required budgets.
- Lighthouse 12.8.2, mobile profile against the production build:
  Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s,
  LCP 1.5 s, Total Blocking Time 20 ms, CLS 0. INP is not produced for a lab load;
  TBT is recorded as its lab responsiveness proxy.
- Manual visual review completed for full-page desktop and Pixel 5 captures in the
  light theme, including the empty planner and paid panel.

## Known gaps / deployment notes

- The live checkout and verification service require the factory to register the
  `exam-bridge` product. Localhost intentionally uses `pilot-api.sociobot.in`; the
  production hostname uses `api.sociobot.in`. Browser tests mock a valid response
  and do not create a real purchase.
- Offline use is available after one successful production visit has cached the
  shell. A first-ever visit still requires a network connection, as expected.
- Prerequisite matching is deliberately small, transparent, and keyword based.
  Candidates must compare suggestions with their current official syllabus; v1
  does not claim exhaustive subject coverage or exam-authority affiliation.

## Independent verification — authoritative status (2026-08-28)

**FAIL** for candidate `afebcc85d98d0a18a42afc6b6f339eee8fc60479` at
`https://exam-bridge.sociobot.in/`. The deployed `index.html`, JS, CSS, and
service worker hashes match the candidate, so this is a release defect rather
than a deployment mismatch.

- **High:** After mapping a syllabus, axe WCAG 2 A/AA reports a serious
  `color-contrast` violation on `.route-overview > div > .eyebrow`: coral
  `#c73e2d` on `#17211f` is 3.26:1 at 13 px, below the required 4.5:1.
- **Medium:** Activating the skip link leaves focus on `BODY`, rather than the
  main/planner target.
- **Medium:** A generated practice-reference remove button is 32 x 32 CSS px,
  below the 44 x 44 touch-target contract.

Fresh clean-clone evidence: `npm ci --ignore-scripts`, `npm test` (6 unit + 10
desktop/mobile Playwright), `npm run build`, and production bundle budgets all
passed. The planner’s normal flow, validation/recovery cases, 390 px layout,
reduced motion, PWA update/offline reload, privacy/network behavior, and live
response headers were independently checked. Full commands, measurements, and
reproduction details are in `.factory/verification.md`.

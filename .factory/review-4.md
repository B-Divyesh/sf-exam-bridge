# Exam Bridge adversarial first-read review 4 — FAIL

- Reviewed: 2 September 2026 UTC
- Live URL: <https://exam-bridge.sociobot.in/>
- Repository base: `7019219e67e40958bd33707d9ec71fb75b5eeaa5`
- Clean-clone workspace: `/tmp/exam-bridge-review4-qM39uw`
- Contexts: fresh Chromium at 390 × 844 and 1440 × 900

## Verdict

**FAIL.** The first screen, one-click demo, sandbox isolation, all 16 registered
claim commands, full test suite, routes, links, and offline reload pass. Seven
minor findings remain. The acceptance condition is zero findings and no
untested claim, so this release cannot pass.

## First 30 seconds

Before scrolling on phone and desktop, I understood: “Exam Bridge turns a
returning exam candidate’s syllabus into an ordered study route with
prerequisite refreshers and their own question references.” The audience is
returning exam candidates. The first action is **Try it with sample data**; the
adjacent text says that six realistic topics will open without changing the
current plan.

This gate passes. On the 390 × 844 cold load, the primary action occupied
`y=501.36–545.36`, and all three plain facts ended at `y=820.16`. The page stayed
at `scrollY=0`. On desktop, the primary action occupied `y=490.05–534.05`.
Both loads returned 200, made same-origin requests only, and produced no console
or page errors.

## Findings

No blocking finding was observed. The product still fails because every
severity must be empty for PASS.

### MINOR — F-4-1: the template notice creates an invalid nested landmark

- **Exact location:** Live `/` and `/demo`; `src/main.ts:185` renders
  `<aside class="access-panel demo-access">` inside the Templates section and
  the page’s `main` landmark.
- **Evidence:** A fresh live axe WCAG A/AA scan at both 390 px and 1440 px
  reports `landmark-complementary-is-top-level` with moderate impact. The
  failing node is that `aside`. Legal and 404 routes have no axe violations.
- **Why this fails:** The notice is part of the Templates section, not
  complementary page content. Exposing it as a nested complementary landmark
  adds a misleading landmark to screen-reader navigation.
- **Concrete fix:** Render this notice as a styled `div`, or move and label it
  as a genuine top-level complementary landmark. Change the accessibility
  regression to fail on every WCAG A/AA axe violation; the current test filters
  out moderate findings.

### MINOR — F-4-2: a hosting-log privacy assurance is not registered or tested

- **Exact quote/location:** Live `/privacy/`: “Standard hosting logs may
  contain an IP address, browser information, requested path, and timestamp.
  We do not use these logs to profile you.” (`public/privacy/index.html:47`)
- **Why this fails:** `local-private` proves same-origin browser requests. It
  cannot observe server log contents or how those logs are later used. No
  `claims.json` entry covers this operational privacy assurance.
- **Concrete fix:** Remove “We do not use these logs to profile you” unless an
  auditable product-owned log policy can be registered and tested. Keep the
  factual hosting-log disclosure without making an unverified use claim.

### MINOR — F-4-3: “Add” does not name the prerequisite result

- **Exact quote/location:** Every populated topic card, custom prerequisite
  form: button **Add** (`src/main.ts:158`).
- **Why this fails:** A button list contains several identical “Add” controls.
  The result is available only from surrounding form context.
- **Concrete rewrite:** **Add prerequisite**. Assert that accessible name for
  every topic card.

### MINOR — F-4-4: “Attach” does not name the question-reference result

- **Exact quote/location:** Every populated topic card, question-reference
  form: button **Attach** (`src/main.ts:162`).
- **Why this fails:** Six identical “Attach” buttons do not identify what will
  be attached when heard outside their surrounding form.
- **Concrete rewrite:** **Attach question reference**. Assert that accessible
  name for every topic card.

### MINOR — F-4-5: “Start over” hides the destructive result

- **Exact quote/location:** Populated-plan toolbar: button **Start over**
  (`src/main.ts:178`).
- **Why this fails:** The button permanently deletes the local plan after a
  confirmation, but its label does not name that result.
- **Concrete rewrite:** **Delete this plan**. Retain the confirmation that names
  the plan and recommends a backup.

### MINOR — F-4-6: demo status copy uses “sandbox” as unexplained jargon

- **Exact quotes/locations:** Demo hero: “Changes stay in the temporary demo
  sandbox.” (`src/main.ts:124`); save status: “Sample route loaded in the demo
  sandbox.” (`src/main.ts:58`). The banner also says “Changes use separate
  browser storage”.
- **Why this fails:** A returning exam candidate should not need software terms
  such as “sandbox” or “browser storage” to understand whether a sample can
  change their plan.
- **Concrete rewrites:** “Your demo changes stay separate from your plan.” and
  “Sample route loaded. Demo changes are separate from your plan.” In the
  banner use: “Demo changes stay separate from your plan and are removed when
  you choose Start for real.”

### MINOR — F-4-7: the README exposes an internal storage key in user guidance

- **Exact quote/location:** README, Try the sample: “Demo changes use
  `demo:exam-bridge:*` storage and never touch your real plan.”
- **Why this fails:** The storage-key pattern is implementation jargon and does
  not help a visitor try the sample. `.factory/demo.md` is the appropriate
  verifier-facing location for it.
- **Concrete rewrite:** “Demo changes stay separate from your plan. Start for
  real deletes the demo changes.”

## Copy audit

Counts treat hyphenated words, numeric ranges, URLs, paths, and code tokens as
one word. Repeated copy is listed once with its occurrence count. No landing or
README sentence exceeds 22 words, and no banned marketing adjective appears.

### Landing-page sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| Turn a syllabus into a study route. | 7 | `syllabus-route` |
| For returning exam candidates: turn a syllabus into a route, refresh prerequisites, and connect topics to question references you own. | 20 | Clear audience and job |
| The sample opens with six realistic topics. | 7 | `demo-sandbox` |
| Your current plan stays unchanged. | 5 | `demo-sandbox` |
| Paste headings only—one per line. | 6 | Clear instruction |
| Exam Bridge never uploads this text. | 6 | `local-private` |
| One topic per line; bullets and numbering are fine. | 9 | `syllabus-route` |
| Add syllabus headings and the official source link when you have one. | 12 | Clear instruction |
| Set your confidence and note the prerequisites each topic needs. | 10 | Clear instruction |
| Study lower-confidence topics first and attach question references you may use. | 11 | `syllabus-route` |
| Start with a reusable plan, then edit it to match your official outline. | 13 | `templates` |
| A reusable starter template—not an official syllabus. (3 occurrences) | 8 | `starter-template-boundary` |
| Each template stays editable and saves only in this browser. | 10 | `templates`, `local-private` |
| Plans stay in this browser. | 5 | `local-private` |
| Exam Bridge does not host exam questions or coaching notes. | 10 | `hosted-content-boundary` |
| Check the official syllabus before studying. | 6 | Clear instruction |
| Prerequisite suggestions are only starting points. | 6 | Clear limitation |
| Exam Bridge is not endorsed by any exam authority. | 9 | `independent-tool` |

### Landing headings, labels, and initial actions

| Copy | Words | Result |
| --- | ---: | --- |
| Study planning for your syllabus | 5 | Informative label |
| Try it with sample data | 5 | Result-naming primary action |
| Build my route | 3 | Result-naming secondary action |
| Saved in this browser | 4 | `local-private` |
| Works offline after the first visit | 6 | `offline-reload` |
| Free planner, backups, and exports | 5 | `free-access` |
| Capture | 1 | Stage label; following H2 names the task |
| Start with the official outline | 5 | Clear H2 |
| 2–80 topics · duplicates are removed | 5 | `topic-cap`, `syllabus-route` |
| Map my syllabus | 3 | Result-naming action in form context |
| From outline to route | 4 | Informative process label |
| How it works | 3 | Clear H2 |
| Paste your outline | 3 | Clear H3 |
| Rate what you know | 4 | Clear H3 |
| Follow your route | 3 | Clear H3 |
| Reusable starting points | 3 | Informative label |
| Choose a starter template | 4 | Clear H2 |
| Engineering foundations | 2 | Template name |
| Computer science foundations | 3 | Template name |
| Quantitative foundations | 2 | Template name |
| Free starter templates | 3 | Informative label |
| Use any template without payment | 5 | `free-access` |
| Use Engineering foundations template | 4 | Result-naming action |
| Use Computer science foundations template | 5 | Result-naming action |
| Use Quantitative foundations template | 4 | Result-naming action |
| Privacy and planning limits | 4 | Informative label |
| What Exam Bridge does not do | 6 | Clear H2 |
| Original generated illustration | 3 | `generated-illustration` |
| no tracking | 2 | `local-private` |

### Populated-demo headings, sentences, and actions

The demo repeats the landing sections above. The additional unique copy is:

| Copy | Words | Result |
| --- | ---: | --- |
| Demo — sample data, nothing is saved | 6 | Required demo banner; `demo-sandbox` |
| Changes use separate browser storage and never touch your real plan. | 10 | F-4-6 |
| Explore six realistic topics. | 4 | `demo-sandbox` |
| Changes stay in the temporary demo sandbox. | 7 | F-4-6 |
| GATE ECE return plan | 4 | Sample plan name |
| Personal outline · no source link added | 6 | Clear state |
| Study route order | 3 | Clear H2 |
| Lowest-confidence topics come first. | 4 | `syllabus-route` |
| Reassess after practice and the route reorders itself. | 9 | `syllabus-route` |
| Suggested from the topic wording. | 5 | Clear explanation |
| Check only what applies. | 4 | Clear instruction |
| No automatic match. | 3 | Clear empty state |
| Add the foundation you need below. | 6 | Clear instruction |
| Add a question ID, page, or link—never the copyrighted question text. | 11 | Clear instruction |
| No practice reference yet. | 5 | Clear empty state |
| Reset demo | 2 | Result-naming action |
| Start for real | 3 | Result-naming exit action |
| Explore the sample route | 4 | Result-naming action |
| Add topic | 2 | Result-naming action |
| Export CSV | 2 | Result-naming action |
| Back up JSON | 3 | Result-naming action |
| Restore JSON | 2 | Result-naming action |
| Start over | 2 | F-4-5 |
| Add | 1 | F-4-3 |
| Attach | 1 | F-4-4 |

Generated remove buttons have specific accessible names such as “Remove
prerequisite Circuit analysis” and “Remove 2024 · Engineering Mathematics ·
Q7”. The Menu and theme controls have programmatic names.

### README sentences and reader-visible feature fragments

| Copy | Words | Result |
| --- | ---: | --- |
| Exam Bridge turns a pasted syllabus into a study route for returning exam candidates. | 14 | Clear |
| Rate each topic, choose prerequisite refreshers, and attach question IDs or links you may use. | 15 | Clear |
| The route puts lower-confidence topics first. | 6 | `syllabus-route` |
| Open https://exam-bridge.sociobot.in/demo or select Try it with sample data on the first screen. | 13 | Clear instruction |
| The six-topic sample opens without an account or setup. | 9 | `demo-sandbox`, `free-access` |
| Its populated workspace is visible immediately on desktop and 390 px screens. | 12 | `demo-sandbox` |
| Demo changes use `demo:exam-bridge:*` storage and never touch your real plan. | 11 | F-4-7 |
| Use Reset demo to restore the sample. | 7 | Clear instruction |
| Use Start for real to discard it. | 7 | Clear instruction |
| Paste a list with bullets or numbers for 2–80 distinct topics | 11 | Feature fragment; registered |
| Editable confidence and prerequisite checklists | 5 | Feature fragment; verified |
| Personal practice IDs, notes, and links with attempted status | 9 | Feature fragment; verified |
| Study order based on your confidence and progress summary | 9 | Feature fragment; `syllabus-route` |
| Browser autosave, offline reload, JSON backup and restore, and CSV export | 11 | Feature fragment; registered |
| Light and dark themes, keyboard support, reduced motion, and a 390 px layout | 13 | Feature fragment; `accessible-responsive` |
| Three reusable starter templates, free to use and edit | 9 | Feature fragment; `templates`, `free-access` |
| No accounts, tracking, external scripts, hosted questions, or authority affiliation | 10 | Feature fragment; registered boundaries |
| Plans stay in your browser. | 5 | `local-private` |
| Clearing site data deletes them. | 5 | Direct browser-storage consequence |
| Export a JSON backup for any plan you need to keep. | 11 | `json-backup-restore` |
| Exam Bridge does not republish test questions or host coaching notes. | 11 | `hosted-content-boundary` |
| Starter templates are editable plans, not official syllabuses. | 8 | `starter-template-boundary` |
| Exam Bridge is not endorsed by any exam authority. | 9 | `independent-tool` |
| Requires a current Node.js LTS release. | 6 | Development requirement |
| `npm test` runs contract checks, unit tests, browser tests, accessibility scans, and the service-worker upgrade test. | 16 | Confirmed |
| Browser tests cover desktop and 390 px mobile projects. | 9 | Confirmed |
| Playwright is pinned to 1.58.2. | 5 | Confirmed |
| The production build command is `npm run build`. | 8 | Development instruction |
| Static output lands in `dist/` with `index.html` at its root. | 10 | Confirmed |
| Each claim command builds a production preview when needed. | 9 | Confirmed |
| Run it after a clean `npm ci`, even when `dist/` is absent. | 12 | Clear instruction |
| The planner, starter templates, CSV exports, and JSON backups are free. | 11 | `free-access` |
| No account, card, checkout, payment, or license is needed. | 9 | `free-access` |
| The demo previews all three editable templates before you start your own plan. | 13 | `templates` |
| Deploy `dist/` to Azure Static Web Apps. | 7 | Development instruction |
| `staticwebapp.config.json` sets security headers, cache policy, demo routing, and the product 404. | 12 | Confirmed |
| Each release gives the offline app a new cache name. | 10 | Clear deployment explanation |
| Returning visitors receive the current version, and that replacement reloads offline after it is cached. | 15 | `service-worker-renewal` |
| See `/privacy/` and `/terms/` for policy. | 6 | Clear route instruction |
| The testable claims are in `.factory/claims.json`. | 6 | Repository pointer |
| Demo details are in `.factory/demo.md`. | 5 | Repository pointer |
| Visual provenance is in `.factory/design.md`. | 5 | Repository pointer |
| Verification evidence and known gaps are in `.factory/handoff.md`. | 8 | Repository pointer |
| MIT © 2026 Sociobot (Param Factory). | 5 | License line |

README headings are **Exam Bridge**, **Try the sample**, **What v1 includes**,
**Develop and verify**, **Free access**, **Deployment and privacy**, and
**License**. Each names its section without a slogan or mood phrase.

### Terminology

| Concept | Term used |
| --- | --- |
| Saved study structure | plan |
| Ordered study view | route |
| One syllabus item | topic |
| Foundation knowledge | prerequisite |
| User-owned question pointer | question reference |
| Isolated sample mode | demo |
| Reusable editable plan | starter template |
| Portable full-fidelity file | JSON backup |
| Spreadsheet export | CSV |

The product uses these terms consistently. F-4-6 and F-4-7 concern internal
implementation wording, not a competing name for a product concept.

## Demo, storage, privacy, and offline checks

The landing action opened `/demo` in one click. The first 390 px viewport showed
the persistent banner, the populated **GATE ECE return plan** workspace, and the
**Study route order** summary with six topics, two ready, and two practised. The
first topic began just below that viewport; the populated product state and
summary were already visible.

In a fresh live context, I seeded `exam-bridge:plan:v1` with the exact value
`REAL-PLAN-MARKER`, entered demo, changed a confidence value, reset, and selected
Start for real. Demo work wrote only `demo:exam-bridge:plan:v1`. Reset restored
six topics with Control systems first and confidence “New to me”. Exit removed
all `demo:` keys and preserved the exact real marker. The whole flow made only
same-origin requests and logged no console or page errors.

After the service worker controlled a separate fresh `/demo` context, disabling
the network and reloading retained the six topics and displayed “You’re
offline. Planning and exports still work in this browser.”

## Claims gate

Every exact command in `.factory/claims.json` passed independently from the
clean clone. No registered claim test failed.

| Claim id | Result |
| --- | --- |
| `demo-sandbox` | PASS |
| `not-found-plan-safety` | PASS |
| `local-private` | PASS |
| `offline-reload` | PASS |
| `service-worker-renewal` | PASS |
| `csv-export` | PASS |
| `json-backup-restore` | PASS |
| `syllabus-route` | PASS |
| `templates` | PASS |
| `starter-template-boundary` | PASS |
| `hosted-content-boundary` | PASS |
| `independent-tool` | PASS |
| `generated-illustration` | PASS |
| `free-access` | PASS |
| `accessible-responsive` | PASS, but it does not reject F-4-1 |
| `topic-cap` | PASS |

F-4-2 is the only unlisted claim found. The product cannot satisfy the “no
untested claim” condition until that sentence is removed or covered by an
appropriate observable test.

## Structure, routes, links, and accessibility

| Route | HTTP | Title | H1 | Result |
| --- | ---: | --- | --- | --- |
| `/` | 200 | `Exam Bridge — turn a syllabus into a study route` | Turn a syllabus into a study route. | F-4-1 only |
| `/demo` | 200 | `Demo — Exam Bridge` | Turn a syllabus into a study route. | F-4-1 only |
| `/privacy/` | 200 | `Privacy — Exam Bridge` | Privacy, in plain language | F-4-2 only |
| `/terms/` | 200 | `Terms — Exam Bridge` | Terms of use | Pass |
| unknown route | 404 | `Page not found — Exam Bridge` | This route does not exist. | Designed recovery page |

All routes have `lang="en"`, one H1, one main landmark, descriptions,
route-appropriate canonical and social metadata, favicon, touch icon, shared
navigation, and footers with Privacy and Terms. Root and unknown-route
responses include CSP, frame restriction, referrer policy, content-type
protection, and permissions policy. The sitemap lists all four public routes.

All discovered same-origin links and assets returned 200; the deliberate
unknown route returned 404 with the designed recovery page. Home → Demo moved
focus to `#workspace-title` and announced the route. Back returned focus to
`#hero-title` and announced the planner. The mobile Menu exposed all four
44-pixel destinations. `verify-url.sh` passed `/`, `/demo`, `/privacy/`, and
`/terms/` with no console errors.

Fresh live axe scans found only F-4-1. The generated learning-topology artwork,
warm graph-paper field, coral route, teal nodes, serif display type, and clipped
controls match `.factory/design.md` and are visually distinct from a generic
SaaS template.

## Earlier finding recheck

| Earlier finding | Live and code result |
| --- | --- |
| F-1-1 — unavailable freemium tier | Fixed. The brief says `free`; live and code contain no paid gate, checkout, or license path; `free-access` passes. |
| F-1-2 — unproved shortest-path headline | Fixed. The live H1 is the tested “Turn a syllabus into a study route.” |
| F-1-3 — incomplete legal navigation | Fixed. Privacy and Terms retain shared Planner, Demo, Privacy, and Terms navigation and both footer links. |
| F-1-4 — overlong README sentence | Fixed. No README sentence exceeds 22 words. |
| F-1-5 — cache jargon | Fixed. The release outcome is stated directly and `service-worker-renewal` passes. |
| F-1-6 — decorative landing label | Fixed. “Study planning for your syllabus” names the section. |
| F-1-7 — mood label above limits | Fixed. “Privacy and planning limits” names the section. |
| F-1-8 — vague slogans | Fixed. Browser storage, official-syllabus checking, and independence are stated directly. |
| F-1-9 — vague Verify button | Fixed. The retired license form remains absent. |
| F-2-1 — route focus and announcement | Fixed live for Home → Demo → Back. |
| F-2-2 — indirect or inconsistent headings | Fixed. The live product uses “Study route order”, “Question references”, and “Choose a starter template”. |
| F-2-3 — four unregistered assertions | Fixed. All four remain registered and their exact commands pass. |
| F-3-1 — missing main-route mobile navigation | Fixed. A keyboard-operable Menu exposes all four destinations at 390 px. |
| F-3-2 — indistinguishable template actions | Fixed. All three actions name their resulting template. |
| F-3-3 — README license jargon | Fixed. The inaccessible license flow and wording remain absent. |

The three polish reports’ claimed fixes are therefore confirmed live and in
the current code. None of the earlier finding IDs is reissued. F-4-1 through
F-4-7 are new findings from this complete review.

## Local verification

- Fresh clone at `7019219`: `npm ci` passed with zero reported vulnerabilities.
- All 16 exact claim commands passed independently.
- `npm test` passed lint, build, contract checks, 9 unit tests, the clean claim
  start, and 65 Playwright tests; one duplicate mobile service-worker case was
  intentionally skipped.
- `npm run build` produced `dist/`: JavaScript 26.91 kB raw / 9.49 kB gzip and
  CSS 18.21 kB raw / 4.77 kB gzip.
- The live root HTML, JavaScript, and CSS SHA-256 hashes exactly matched the
  clean-clone production build.

## Missed leverage

No additional AI, sync, or import/export feature is implied. The core planning
job is deterministic, and an AI step would add cost and privacy exposure without
being necessary. Paste import, JSON backup/restore, and CSV export already cover
the obvious transfer needs. Account sync would conflict with the current
local-first scope unless that scope changes.

## What would make this perfect

Remove the invalid nested `aside`, register or remove the hosting-log profiling
assurance, replace the three vague planner buttons with result-naming labels,
and rewrite the demo/README storage language without implementation jargon.
Then rerun all 16 clean claim commands, the complete suite, live axe without a
severity filter, and this entire cold first-read review. PASS requires no
remaining finding.

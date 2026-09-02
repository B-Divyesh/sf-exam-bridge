# Exam Bridge adversarial first-read review 3 — FAIL

- Reviewed: 2 September 2026 UTC
- Live URL: <https://exam-bridge.sociobot.in/>
- Repository base: `666672cbfff0a8ab5e106a904111e2b3bb882b36`
- Contexts: fresh Chromium at 390 × 844 and 1440 × 900
- Clean-clone claims workspace: `/tmp/exam-bridge-review3-Gh8yHh`

## Verdict

**FAIL.** The first screen and one-click demo pass, and all 19 registered claim
commands pass. One earlier blocking scope finding has regressed and three new
minor findings remain. The required acceptance condition is zero findings.

## First 30 seconds

Before scrolling, I understood the product as: “It turns a returning exam
candidate's pasted syllabus into an ordered study route, including prerequisite
refreshers and their own question references.” It is for returning exam
candidates. I should select **Try it with sample data** first; the next two
sentences say that six realistic topics will open and my current plan will stay
unchanged.

This gate passes on phone and desktop. At 390 × 844, the audience sentence ends
at `y=463.36`, the primary action occupies `y=515.36–559.36`, and all three
facts end at `y=834.16`. The cold page remained at `scrollY=0`. At 1440 × 900,
the primary action occupies `y=490.05–534.05`. Both cold loads returned HTTP
200, made same-origin requests only, and produced no console or page errors.

## Findings

### BLOCKING — F-1-1 (reissued): the researched freemium tier is unavailable again

- **Exact quote/location:** `.factory/brief.json` says `"monetization":
  "freemium"`. The live Templates section says **“Paid templates are not yet
  available”**, followed by “Paid tier not yet available. No purchase or
  checkout is offered.” README lines 57–65 repeat that boundary.
- **Why this fails:** Review 1 recorded this exact scope gap. Polish rounds 1
  and 2 marked it fixed by changing the product and brief to permanently free.
  The current brief is freemium again, and the product again has a gated tier
  that a new customer cannot buy. Existing-license restoration does not provide
  the researched paid path. The history rule requires a regressed finding to be
  blocking under its original id.
- **Concrete fix:** Register and expose the product-scoped Sociobot purchase
  flow, state the exact price and unlocked templates before purchase, and add a
  clean claim that proves purchase, return-token handling, restore, and revoked
  access. Do not embed a payment provider. If the product is instead meant to
  remain free, change the researched scope through the factory process and
  remove the inaccessible Plus gate rather than presenting an unavailable tier.

### MINOR — F-3-1: the main mobile header removes every navigation link

- **Exact quote/location:** On live `/` and `/demo` at 390 px, **Demo**, **How
  it works**, **Templates**, and **Privacy** all compute to `display: none`.
  Only the wordmark and theme control remain. The source rule is
  `src/styles.css:147`, `nav a { display: none; }`. Privacy and Terms use a
  different mobile header that keeps four links visible.
- **Why this fails:** The required shared header is not available on the two
  main app routes at phone width. A demo visitor must traverse a long six-topic
  workspace to reach legal links in the footer. The current target-size test
  filters hidden elements, so it cannot catch this absence.
- **Concrete fix:** Keep a visible, keyboard-operable four-link header on mobile,
  or provide a labelled menu button with focus management and the same
  destinations. Add a 390 px check that every expected header destination is
  visible and reachable on `/`, `/demo`, `/privacy/`, and `/terms/`.

### MINOR — F-3-2: three template links do not name their result

- **Exact quote/location:** Each locked template card uses the identical link
  **“Try in demo”**.
- **Why this fails:** The text names a location, not the result, and a
  screen-reader link list contains three indistinguishable actions. A visitor
  cannot tell which template each link will preview without restoring card
  context.
- **Concrete fix:** Use unique result-naming labels: **Preview Engineering
  template**, **Preview Computer science template**, and **Preview Quantitative
  template**. Add an accessible-name assertion for all three links.

### MINOR — F-3-3: the README explains license privacy with implementation jargon

- **Exact quote/location:** README lines 63–65: “It is stored as
  `sb_license:exam-bridge` and sent only to the Sociobot verification endpoint.
  A valid verdict is cached for up to 24 hours.”
- **Why this fails:** “verification endpoint,” “verdict,” the raw storage key,
  and “cached” describe implementation rather than what a license holder needs
  to know. The wording appears in the user-facing paid-tier section, not only
  the development section.
- **Concrete rewrite:** “Your license token stays in this browser and is sent
  only to Sociobot for checking. A successful check is reused for 24 hours.”

## Copy audit

Counts treat hyphenated terms and numeric ranges as one word. Repeated text is
listed once with its occurrence count. Sentence fragments, headings, and
actions are audited separately because the plain-words rules apply to them too.
No sentence exceeds 22 words. No banned marketing adjective appears.

### Landing-page sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| Turn a syllabus into a study route. | 7 | Clear; `syllabus-route` |
| For returning exam candidates: turn a syllabus into a route, refresh prerequisites, and connect topics to question references you own. | 20 | Clear audience and outcome |
| The sample opens with six realistic topics. | 7 | `demo-sandbox` |
| Your current plan stays unchanged. | 5 | `demo-sandbox` |
| Paste headings only—one per line. | 6 | Clear instruction |
| Exam Bridge never uploads this text. | 6 | `local-private` |
| One topic per line; bullets and numbering are fine. | 9 | `syllabus-route` |
| Add syllabus headings and the official source link when you have one. | 12 | Clear instruction |
| Set your confidence and note the prerequisites each topic needs. | 10 | Clear instruction |
| Study lower-confidence topics first and attach question references you may use. | 11 | `syllabus-route` |
| Start with a reusable plan, then edit it to match your official outline. | 13 | Clear instruction |
| A reusable starter template—not an official syllabus. (3 occurrences) | 8 | `starter-template-boundary` |
| Paid tier not yet available. | 5 | `paid-tier-unavailable`; F-1-1 |
| No purchase or checkout is offered. | 6 | `paid-tier-unavailable`; F-1-1 |
| The free planner, CSV, and JSON tools remain available. | 9 | `free-access` |
| Existing license holders can verify access below. | 7 | `existing-license-access` |
| Plans stay in this browser. | 5 | `local-private` |
| Exam Bridge does not host exam questions or coaching notes. | 9 | `hosted-content-boundary` |
| Check the official syllabus before studying. | 6 | Clear instruction |
| Prerequisite suggestions are only starting points. | 6 | Clear limitation |
| Exam Bridge is not endorsed by any exam authority. | 9 | `independent-tool` |

### Landing headings, facts, and actions

| Copy | Words | Result |
| --- | ---: | --- |
| Study planning for your syllabus | 5 | Informative section label |
| Try it with sample data | 5 | Result-naming first action |
| Build my route | 3 | Result-naming action |
| Saved in this browser | 4 | `local-private` |
| Works offline after the first visit | 6 | `offline-reload` |
| Free planner, backups, and exports | 5 | `free-access` |
| Capture | 1 | Stage label; H2 supplies context |
| Start with the official outline | 5 | Clear heading |
| 2–80 topics · duplicates are removed | 5 | `topic-cap`, `syllabus-route` |
| Map my syllabus | 3 | Result-naming action |
| From outline to route | 4 | Informative process label |
| How it works | 3 | Clear heading |
| Paste your outline | 3 | Clear heading |
| Rate what you know | 4 | Clear heading |
| Follow your route | 3 | Clear heading |
| Reusable starting points | 3 | Informative section label |
| Choose a starter template | 4 | Clear heading |
| Engineering foundations | 2 | Template name |
| Computer science foundations | 3 | Template name |
| Quantitative foundations | 2 | Template name |
| 5 / 7 / 6 editable topics | 3 each | Concrete template facts |
| Try in demo (3 occurrences) | 3 | F-3-2 |
| Exam Bridge Plus | 3 | Tier name |
| Paid templates are not yet available | 6 | F-1-1 |
| Verify license | 2 | Result-naming action; F-1-9 remains fixed |
| Privacy and planning limits | 4 | Informative section label |
| What Exam Bridge does not do | 6 | Clear heading |
| Original generated illustration | 3 | `generated-illustration` |
| no tracking | 2 | `local-private` |

### README sentences and reader-visible feature fragments

| Copy | Words | Result |
| --- | ---: | --- |
| Exam Bridge turns a pasted syllabus into a study route for returning exam candidates. | 14 | Clear |
| Rate each topic, choose prerequisite refreshers, and attach question IDs or links you may use. | 15 | Clear |
| The route puts lower-confidence topics first. | 6 | `syllabus-route` |
| Open the demo URL or select Try it with sample data on the first screen. | 13 | Clear action |
| The six-topic sample opens without an account or setup. | 9 | `demo-sandbox` |
| Its populated workspace is visible immediately on desktop and 390 px screens. | 12 | `demo-sandbox` |
| Demo changes use `demo:exam-bridge:*` storage and never touch your real plan. | 10 | `demo-sandbox` |
| Use Reset demo to restore the sample. | 7 | Clear action |
| Use Start for real to discard it. | 7 | Clear action |
| Paste a list with bullets or numbers for 2–80 distinct topics | 11 | `syllabus-route`, `topic-cap` |
| Editable confidence and prerequisite checklists | 5 | Supported feature |
| Personal practice IDs, notes, and links with attempted status | 9 | Supported feature |
| Study order based on your confidence and progress summary | 9 | `syllabus-route` |
| Browser autosave, offline reload, JSON backup and restore, and CSV export | 10 | Registered claims |
| Light and dark themes, keyboard support, reduced motion, and a 390 px layout | 12 | `accessible-responsive` |
| Three reusable templates to preview; the paid tier is not yet available | 11 | `templates`, F-1-1 |
| No accounts, tracking, external scripts, hosted questions, or authority affiliation | 10 | Registered boundary claims |
| Plans stay in your browser. | 5 | `local-private` |
| Clearing site data deletes them. | 5 | Direct consequence of browser-only storage |
| Export a JSON backup for any plan you need to keep. | 11 | `json-backup-restore` |
| Exam Bridge does not republish test questions or host coaching notes. | 11 | `hosted-content-boundary` |
| Starter templates are editable plans, not official syllabuses. | 8 | `starter-template-boundary` |
| Exam Bridge is not endorsed by any exam authority. | 9 | `independent-tool` |
| Requires a current Node.js LTS release. | 6 | Development requirement |
| `npm test` runs contract checks, unit tests, browser tests, accessibility scans, and the service-worker upgrade test. | 14 | Confirmed by clean suite |
| Browser tests cover desktop and 390 px mobile projects. | 9 | Confirmed by configuration |
| Playwright is pinned to 1.58.2. | 5 | Confirmed by package lock |
| The production build command is `npm run build`. | 8 | Development instruction |
| Static output lands in `dist/` with `index.html` at its root. | 8 | Confirmed by build |
| Each claim command builds a production preview when needed. | 9 | Confirmed in clean clone |
| Run it after a clean `npm ci`, even when `dist/` is absent. | 11 | Clear instruction |
| The planner, CSV exports, and JSON backups are free. | 9 | `free-access` |
| No account, card, checkout, or payment is required for them. | 10 | `free-access` |
| The demo previews all three editable templates. | 7 | `templates` |
| The paid template tier is not yet available. | 8 | `paid-tier-unavailable`; F-1-1 |
| Exam Bridge offers no purchase or checkout. | 7 | `paid-tier-unavailable`; F-1-1 |
| Existing license holders can paste a token on the home page. | 11 | `existing-license-access` |
| It is stored as `sb_license:exam-bridge` and sent only to the Sociobot verification endpoint. | 13 | F-3-3 |
| A valid verdict is cached for up to 24 hours. | 10 | F-3-3; behavior is registered |
| Deploy `dist/` to Azure Static Web Apps. | 7 | Development instruction |
| `staticwebapp.config.json` sets security headers, cache policy, demo routing, and the product 404. | 11 | Confirmed in source |
| Each release gives the offline app a new cache name. | 10 | Direct deployment wording |
| Returning visitors receive the current version, and that replacement reloads offline after it is cached. | 15 | `service-worker-renewal` |
| See `/privacy/` and `/terms/` for policy. | 6 | Clear route instruction |
| The testable claims are in `.factory/claims.json`. | 5 | Repository pointer |
| Demo details are in `.factory/demo.md`. | 4 | Repository pointer |
| Visual provenance is in `.factory/design.md`. | 5 | Repository pointer |
| Verification evidence and known gaps are in `.factory/handoff.md`. | 7 | Repository pointer |
| MIT © 2026 Sociobot (Param Factory). | 6 | License line |

### README headings and non-sentence labels

| Copy | Words | Result |
| --- | ---: | --- |
| Exam Bridge | 2 | Product name |
| Live product | 2 | Clear link label |
| Try the sample | 3 | Clear section heading |
| What v1 includes | 3 | Clear section heading |
| Develop and verify | 3 | Clear section heading |
| To inspect the production build locally | 6 | Clear command introduction |
| Free access and future paid tier | 6 | Clear section heading; F-1-1 applies to the unavailable tier |
| Deployment and privacy | 3 | Clear section heading |
| License | 1 | Clear section heading |

### Terminology and claim cross-check

The landing and README consistently use **plan** for saved user work, **route**
for ordered study, **topic**, **prerequisite**, **question reference**, **demo**,
**starter template**, **JSON backup**, and **CSV**. F-3-3 is jargon rather than a
concept-name conflict. Every claim-like product sentence maps to a current
`claims.json` entry; no unlisted product claim was found.

## Demo, storage, privacy, and offline behavior

The first landing action opens `/demo` in one click. At 390 px, the loaded page
immediately scrolls to the populated `GATE ECE return plan`; the workspace starts
at `y=153.16`, contains six topics, and shows its route summary in the first
viewport. The sticky banner says “Demo — sample data, nothing is saved” and
contains **Reset demo** and **Start for real**.

In a fresh live context, I seeded `exam-bridge:plan:v1` with an exact marker,
entered demo, changed a confidence value, reset, reloaded offline, and exited.
Only `demo:exam-bridge:plan:v1` changed in demo. Reset restored six topics with
Control systems first and confidence “New to me.” Offline reload retained the
six-topic route and displayed the offline notice. Exit deleted the demo key and
left the real marker byte-for-byte unchanged. The complete flow requested only
`https://exam-bridge.sociobot.in` resources and logged no console error.

Evidence:

- `review-3-artifacts/live-first-screen-mobile.png`
- `review-3-artifacts/live-first-screen-desktop.png`
- `review-3-artifacts/live-demo-after-one-click-mobile.png`

## Claims gate

All 19 exact commands from `.factory/claims.json` passed independently after
`npm ci` in a fresh local clone. No claim is untested.

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
| `existing-license-access` | PASS |
| `existing-license-revocation` | PASS |
| `paid-tier-unavailable` | PASS as a truthful absence claim; F-1-1 remains a scope failure |
| `accessible-responsive` | PASS |
| `topic-cap` | PASS |

The complete clean-clone `npm test` also passed: lint, production build,
contracts, 9 unit tests, clean-claim-start, and 73 Playwright tests. One duplicate
mobile service-worker case was intentionally skipped. The production build
contains 29.31 kB raw / 10.31 kB gzip JavaScript and produced `dist/`.

## Structure, routes, links, and accessibility

| Route | HTTP | Title | H1 | Result |
| --- | ---: | --- | --- | --- |
| `/` | 200 | `Exam Bridge — turn a syllabus into a study route` | Turn a syllabus into a study route. | Pass except F-3-1 |
| `/demo` | 200 | `Demo — Exam Bridge` | Turn a syllabus into a study route. | Pass except F-3-1 |
| `/privacy/` | 200 | `Privacy — Exam Bridge` | Privacy, in plain language | Pass |
| `/terms/` | 200 | `Terms — Exam Bridge` | Terms of use | Pass |
| unknown route | 404 | `Page not found — Exam Bridge` | This route does not exist. | Designed recovery page |

Every route has `lang="en"`, one H1, one main landmark, a route-specific title,
description, canonical URL, OG/Twitter data, favicon, touch icon, header, and
footer. Internal links resolve; hash targets exist; `mailto:` links are explicit.
`robots.txt` references the sitemap, and the sitemap lists all four public
routes. Root and 404 responses include the expected CSP, frame restriction,
referrer policy, content-type protection, and permissions policy.

Live Home → Demo navigation focused `#workspace-title` and announced “Demo
loaded: GATE ECE return plan.” Browser Back focused `#hero-title` and announced
the planner route. Fresh axe scans found no serious or critical finding on all
five routes in mobile dark/reduced-motion and desktop light contexts. No route
overflowed at 390 px. The topology artwork, graph-paper field, coral path, serif
display type, node geometry, and clipped controls form a distinct product
identity rather than a generic SaaS template.

F-3-1 remains despite these route and accessibility passes because the test
suite excludes hidden header links from its target scan.

## Earlier finding recheck

| Earlier finding | Live and code result |
| --- | --- |
| F-1-1 — unavailable freemium tier | **Regressed and reissued as BLOCKING.** The brief says freemium; live purchase remains unavailable. |
| F-1-2 — unproved shortest-path headline | Fixed. Live H1 is the tested “Turn a syllabus into a study route.” |
| F-1-3 — incomplete legal navigation | Fixed for its reported scope. Privacy and Terms have shared wordmark navigation and complete legal footers at desktop and 390 px. F-3-1 separately records the main app's hidden mobile nav. |
| F-1-4 — 27-word README sentence | Fixed. It remains split into 9- and 11-word sentences. |
| F-1-5 — unexplained cache jargon | Fixed. README explains the release outcome and `service-worker-renewal` passes. |
| F-1-6 — decorative landing label | Fixed. Live copy says “Study planning for your syllabus.” |
| F-1-7 — mood label above limits | Fixed. Live copy says “Privacy and planning limits.” |
| F-1-8 — vague slogans | Fixed. Direct browser-storage, official-syllabus, and non-endorsement wording remains live and tested. |
| F-1-9 — vague Verify control | Fixed. The visible and accessible name is “Verify license.” |
| F-2-1 — route focus and announcement | Fixed. Confirmed live for Home → Demo → Back and in the full test suite. |
| F-2-2 — indirect/inconsistent headings | Fixed. Live demo uses “Study route order,” “Question references,” and “Choose a starter template.” |
| F-2-3 — four unlisted assertions | Fixed. All four claims are registered and their exact tests pass. |

## Missed leverage

No additional AI feature is implied. This local-first job is deterministic, and
an AI step would add cost and privacy risk without being necessary to order a
user-provided outline. The directly useful transfer features already exist:
paste input, JSON backup/restore, and CSV export. Account sync would contradict
the current local-first scope unless the brief changes. The missing leverage is
the freemium purchase path already recorded as F-1-1, not an additional feature.

## What would make this perfect

Resolve F-1-1 through the product-scoped Sociobot billing path or an authorized
scope decision, retain usable navigation in the main mobile header, give every
template preview a unique result-naming label, and rewrite the license paragraph
in user language. Then rerun every clean claim command, the full suite, and this
entire cold first-read review. There is no basis for PASS until all four findings
are gone.

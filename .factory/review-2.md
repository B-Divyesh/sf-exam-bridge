# Exam Bridge first-read review 2 — FAIL

- Reviewed: 1 September 2026 UTC
- Live URL: <https://exam-bridge.sociobot.in/>
- Reviewed commit: `392d9f3aceead241df980846e4284956f7b3d835`
- Contexts: fresh Chromium at 390 × 844 and 1440 × 900; clean local clone for registered checks

## Verdict

**FAIL.** The product is clear on its first screen, the sample route is usable in one click, and every registered check passes. Three minor findings remain. This review uses `FAIL` because the acceptance condition requires zero findings.

## First 30 seconds

Before scrolling on phone and desktop, I understood the product as: “It turns a returning candidate’s pasted syllabus into an ordered study route, with prerequisite refreshers and links or IDs for their own questions.” It is for returning exam candidates. The first action is **Try it with sample data**; the adjacent note says that it opens six realistic topics and keeps the current plan unchanged.

This first-screen check passes. At 390 × 844, the action is fully visible at CSS pixels `y=581.36–625.36` and is 44 px high. The page showed no console errors and requested only its own origin.

## Findings

### MINOR — F-2-1: Navigation does not move focus to the new page heading

- **Location / check:** From the live home header, keyboard-focus **Demo**, activate it, then check `document.activeElement` after `/demo` loads. It is `BODY`, not `h1#hero-title`. The same result occurs after browser Back returns to `/`.
- **Why this check does not pass:** A keyboard or screen-reader visitor receives neither focus on the new page heading nor a route announcement. The route itself loads correctly, but the required route-change focus behavior is absent.
- **Concrete fix:** On each app route load and Back/Forward restoration, focus the route’s single H1 (using `tabindex="-1"` if needed), restore the appropriate scroll position, and publish the route name in a polite live region. Add a browser check that activates Home → Demo and Back, then confirms the H1 focus and announcement.

### MINOR — F-2-2: Three headings use indirect or inconsistent names

- **Locations / quotes:** Route overview H2, “Your next pass”; topic-card H4, “Practice bridge”; templates H2, “Begin from a foundation map”. The surrounding template copy instead calls the same item a “starter map”.
- **Why this check does not pass:** In a heading list, “Your next pass” and “Practice bridge” do not identify the section’s contents. “Foundation map” introduces a second name for the starter template concept.
- **Concrete fix:** Use “Study route order”, “Question references”, and “Choose a starter template”. Use “starter template” consistently in its following copy and card labels. Add these exact strings to the copy contract.

### MINOR — F-2-3: Four live assertions have no `claims.json` entry

- **Locations / quotes:** Template cards: “A reusable starter map—not an official syllabus.”; limits section: “Exam Bridge does not host exam questions or coaching notes.” and “Exam Bridge is not endorsed by any exam authority.”; footer: “Original generated illustration”.
- **Why this check does not pass:** These are visitor-facing statements a reader can rely on, but none is named in `.factory/claims.json`. The existing `templates`, `local-private`, and `free-access` checks do not confirm official-source status, hosted-content status, endorsement status, or illustration provenance.
- **Concrete fix:** For statements that can be observed in the product, add a separately tagged claim with a clean-demo assertion. For statements that need evidence outside the product, remove the assertion or replace it with a directly scoped instruction. Keep the required non-affiliation boundary in clear wording once the product owner can supply an auditable basis.

## Copy audit

Word counts treat a hyphenated or ranged form as one word. The cold landing render has no sentence over 22 words. Its buttons are result-naming verbs. The flagged headings are F-2-2; the registered and unregistered assertions are identified above.

### Landing sentences

| Copy | Words | Result |
| --- | ---: | --- |
| Turn a syllabus into a study route. | 7 | Registered: `syllabus-route` |
| For returning exam candidates: turn a syllabus into a route, refresh prerequisites, and connect topics to question references you own. | 20 | Clear audience and job |
| The sample opens with six realistic topics. | 7 | Registered: `demo-sandbox` |
| Your current plan stays unchanged. | 5 | Registered: `demo-sandbox` |
| Paste the outline. | 3 | Clear instruction |
| Rate what you know. | 4 | Clear instruction |
| Attach only references you’re allowed to use. | 7 | Clear instruction |
| Your study map stays in this browser. | 7 | Registered: `local-private` |
| Paste headings only—one per line. | 5 | Clear instruction |
| Exam Bridge never uploads this text. | 6 | Registered: `local-private` |
| One topic per line; bullets and numbering are fine. | 9 | Registered: `syllabus-route` |
| Use an editable starter map for a permitted exam domain, then make it your own. | 15 | Registered: `templates` |
| The planner, templates, and exports stay local to this device. | 10 | Registered: `local-private` |
| A reusable starter map—not an official syllabus. | 7 | F-2-3; appears three times |
| Use every starter template without an account, card, or payment. | 10 | Registered: `free-access` |
| Plans stay in this browser. | 5 | Registered: `local-private` |
| Exam Bridge does not host exam questions or coaching notes. | 9 | F-2-3 |
| Check the official syllabus before studying. | 6 | Clear instruction |
| Prerequisite suggestions are only starting points. | 6 | Clear boundary |
| Exam Bridge is not endorsed by any exam authority. | 9 | F-2-3 |

### Landing headings, facts, and actions

| Copy | Words | Result |
| --- | ---: | --- |
| Study planning for your syllabus | 5 | Clear section label |
| Try it with sample data | 5 | Clear action |
| Build my route | 3 | Clear action |
| Saved in this browser | 4 | Registered: `local-private` |
| Works offline after the first visit | 6 | Registered: `offline-reload` |
| Free planner, backups, and exports | 5 | Registered: `free-access` |
| Start with the official outline | 5 | Clear heading |
| Reusable starting points | 3 | Clear section label |
| Begin from a foundation map | 5 | F-2-2 |
| Every template is included | 4 | Registered: `free-access` |
| Privacy and planning limits | 4 | Clear section label |
| What Exam Bridge does not do | 6 | Clear heading |
| Your next pass | 3 | F-2-2; populated-plan heading |
| Practice bridge | 2 | F-2-2; topic-card heading |
| Map my syllabus | 3 | Clear action |
| Use template | 2 | Clear in its card context |
| Original generated illustration | 3 | F-2-3 |
| no tracking | 2 | Registered: `local-private` |

### README sentences and reader-visible feature fragments

| Copy | Words | Result |
| --- | ---: | --- |
| Exam Bridge turns a pasted syllabus into a study route for returning exam candidates. | 14 | Clear |
| Rate each topic, choose prerequisite refreshers, and attach question IDs or links you may use. | 15 | Clear |
| The route puts lower-confidence topics first. | 6 | Registered: `syllabus-route` |
| Open the demo URL or select Try it with sample data on the first screen. | 15 | Clear action |
| The six-topic sample opens without an account or setup. | 9 | Registered: `demo-sandbox` |
| Demo changes use `demo:exam-bridge:*` storage and never touch your real plan. | 12 | Registered: `demo-sandbox` |
| Use Reset demo to restore the sample. | 7 | Clear action |
| Use Start for real to discard it. | 7 | Clear action |
| Bullet and number-aware import for 2–80 distinct syllabus topics | 9 | Technical feature fragment; use “Paste a list with bullets or numbers” |
| Editable confidence and prerequisite checklists | 5 | Clear feature fragment |
| Personal practice IDs, notes, and links with attempted status | 9 | Clear feature fragment |
| Confidence-aware study ordering and progress summary | 6 | Technical feature fragment; use “Study order based on your confidence” |
| Browser autosave, offline reload, JSON backup and restore, and CSV export | 9 | Clear enough for a feature list |
| Light and dark themes, keyboard support, reduced motion, and a 390 px layout | 11 | Clear feature fragment |
| Free editable foundation templates | 4 | Use “starter templates” for consistency with F-2-2 |
| No accounts, trackers, CDN scripts, hosted questions, or exam-authority affiliation | 9 | Fragment; specific product claims are covered above |
| Plans live in browser `localStorage`. | 6 | Technical reader wording; use “Plans stay in your browser.” |
| Clearing site data deletes them. | 5 | Clear |
| Export a JSON backup for any plan you need to keep. | 11 | Clear action |
| Exam Bridge does not republish test questions. | 7 | Clear boundary |
| Reference only material you may use. | 6 | Clear instruction |
| Requires a current Node.js LTS release. | 6 | Appropriate development requirement |
| `npm test` runs contract checks, unit tests, browser tests, accessibility scans, and the service-worker upgrade test. | 14 | Appropriate development detail |
| Browser tests cover desktop and 390 px mobile projects. | 9 | Appropriate development detail |
| Playwright is pinned to 1.58.2. | 5 | Appropriate development detail |
| The production build command is `npm run build`. | 8 | Appropriate development detail |
| Static output lands in `dist/` with `index.html` at its root. | 8 | Appropriate development detail |
| Each claim command builds a production preview when needed. | 9 | Appropriate development detail |
| Run it after a clean `npm ci`, even when `dist/` is absent. | 11 | Appropriate development detail |
| The planner, every template, CSV exports, and JSON backups are free. | 11 | Registered: `free-access` |
| No account, card, checkout, or payment is required. | 8 | Registered: `free-access` |
| Deploy `dist/` to Azure Static Web Apps. | 7 | Appropriate deployment instruction |
| `staticwebapp.config.json` sets security headers, cache policy, demo routing, and the product 404. | 8 | Appropriate deployment detail |
| Each release gives the offline app a new cache name. | 10 | Clear |
| Returning visitors receive the current version. | 6 | Clear |
| See `/privacy/` and `/terms/` for policy. | 6 | Clear route instruction |
| The testable claims are in `.factory/claims.json`. | 5 | Clear |
| Demo details are in `.factory/demo.md`. | 4 | Clear |
| Visual provenance is in `.factory/design.md`. | 5 | Clear |
| Verification evidence and known gaps are in `.factory/handoff.md`. | 7 | Clear |

## Demo, privacy, and offline checks

The landing action opens `/demo` in one click. The first demo screen already shows `GATE ECE return plan`, six populated topics, the persistent “Demo — sample data, nothing is saved” banner, **Reset demo**, and **Start for real**.

In a fresh live browser context, I seeded `exam-bridge:plan:v1` with a real-plan marker, opened `/demo`, changed a demo confidence value, reset the sample, and selected Start for real. Only `demo:exam-bridge:plan:v1` was written while in the demo. Reset restored `Control systems` as the first topic. Exiting removed the demo key and retained the exact real-plan marker. The complete flow made same-origin requests only and produced no console errors.

The registered offline check passed from a dedicated clean browser context after the first `/demo` visit. The local `local-private` check records only same-origin requests during its demo flow.

## Claims gate

All ten commands listed in `.factory/claims.json` passed individually from a fresh clone. The full clean-clone suite also passed: lint, build, contracts, nine unit checks, clean-start check, 46 browser checks, and the service-worker update check. The final `test-results/.last-run.json` records `"status": "passed"`. `npm run build` produced `dist/`; initial JavaScript is 24.52 kB raw and 8.84 kB gzip.

| Claim | Result |
| --- | --- |
| `demo-sandbox` | PASS |
| `local-private` | PASS |
| `offline-reload` | PASS |
| `csv-export` | PASS |
| `json-backup-restore` | PASS |
| `syllabus-route` | PASS |
| `templates` | PASS |
| `free-access` | PASS |
| `accessible-responsive` | PASS |
| `topic-cap` | PASS |

## Structure, accessibility, and link checks

| Route | HTTP | Title | H1 | Result |
| --- | ---: | --- | --- | --- |
| `/` | 200 | `Exam Bridge — turn a syllabus into a study route` | Turn a syllabus into a study route. | Pass |
| `/demo` | 200 | `Demo — Exam Bridge` | Turn a syllabus into a study route. | Pass |
| `/privacy/` | 200 | `Privacy — Exam Bridge` | Privacy, in plain language | Pass |
| `/terms/` | 200 | `Terms — Exam Bridge` | Terms of use | Pass |
| `/no-such-route` | 404 | `Page not found — Exam Bridge` | This route does not exist. | Pass |

Every checked route has `lang="en"`, one main landmark, one H1, a route-specific title, description, canonical link, social metadata, favicon, and touch icon. The internal links found on these routes returned their expected destinations; `mailto:` links are explicit. The header and footer include the expected navigation and legal links. The warm-paper topology artwork, graph-paper surface, coral path, and node shapes match the product’s distinct visual thesis rather than a generic template.

Live axe scans at 390 px found zero serious or critical issues on `/`, `/demo`, `/privacy/`, `/terms/`, and the 404 route. The keyboard, target-size, theme, reduced-motion, and 390 px registered check passes. F-2-1 remains the route-focus exception.

No additional AI, sync, or import/export feature is expected by the brief: paste import, JSON backup/restore, and CSV export already cover the directly useful data-transfer steps. The brief does not require an AI step.

## Earlier finding recheck

| Earlier finding | Live and code confirmation |
| --- | --- |
| F-1-1 — unavailable freemium tier | Fixed: brief and live access describe the complete planner as free; `free-access` passes and no checkout or license control is present. |
| F-1-2 — unproved shortest-path wording | Fixed: the H1 is the registered “Turn a syllabus into a study route.” |
| F-1-3 — incomplete legal navigation | Fixed: both legal routes have the shared wordmark, Planner/Demo/Privacy/Terms navigation, and both legal footer links. |
| F-1-4 — overlong README sentence | Fixed: the prior 27-word sentence is split into 9- and 11-word sentences. |
| F-1-5 — cache jargon | Fixed: README uses the direct cache-name wording. |
| F-1-6 — decorative landing label | Fixed: “Study planning for your syllabus” names the section. |
| F-1-7 — mood label above limits | Fixed: “Privacy and planning limits” names the section. |
| F-1-8 — vague slogans | Fixed: live copy uses direct browser-storage, official-syllabus, and authority wording. |
| F-1-9 — vague Verify control | Fixed: no license verification control remains. |
| Earlier contrast, skip-focus, target-size, topic-limit, stale-worker, metadata, 404, demo, and mobile-action checks | Fixed: the registered checks and full clean suite pass; live 390 px first action, metadata, demo isolation, and designed 404 are confirmed above. |

No earlier finding is reissued. F-2-1 through F-2-3 are newly observed in this full review.

## What would make this perfect

Move focus and announce each route change, name every route/planner section directly with one consistent template term, and register or remove the four remaining live assertions. Then repeat this complete first-read, copy, demo, claim, privacy, history, route, and accessibility review.

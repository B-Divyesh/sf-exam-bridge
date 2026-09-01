# Exam Bridge first-read review 1 — FAIL

- Reviewed: 2026-09-01 UTC
- Live URL: <https://exam-bridge.sociobot.in/>
- Repository base: `efe1302f6ed9555525977b1604dac4b0bcf3c61c`
- Viewports: fresh Chromium at 390 × 844 and 1440 × 900

## Verdict

**FAIL.** The core free planning flow is clear and tryable, and the demo and registered proof suite pass. The researched freemium capability remains unavailable, the H1 makes an unregistered “shortest path” claim, the legal pages lack the required shared navigation/footer, and copy findings remain.

## First 30 seconds

Before scrolling, on phone and desktop, I understood: “It turns a returning exam candidate's syllabus into an ordered study route with prerequisite refreshers and their own question references.” “For returning exam candidates…” identifies the audience; **Try it with sample data** is the visible first action. At 390 × 844 its bounding box is `y=561.2–605.2`, fully visible without scrolling. This gate passes.

## Findings

### BLOCKING — F-1-1: The researched freemium tier remains unavailable

- **Location / quote:** `.factory/brief.json` says `"monetization": "freemium"`. The live Templates section says, “Hosted checkout is unavailable, so there is no paid template purchase.”
- **Why:** This reopens the earlier “researched paid unlock/tier remains unavailable” findings from `verification-3.md`, `verification-6.md`, `verification-7.md`, and `verification-8.md`. Free templates are transparent, but they do not provide the researched freemium capability. The work order requires an unfixed historic finding to be blocking again.
- **Fix:** Offer the reusable paid-template tier through the Sociobot billing API, showing exact price and unlocked templates before purchase. Add a clean-demo claim test for purchase/restore. Until then, retain it as a scope deviation rather than record PASS.

### BLOCKING — F-1-2: The headline claims a “shortest path” the product does not prove

- **Location / quote:** Landing H1: “Find the shortest path from topic to practice.”
- **Why:** “Shortest” is an optimization claim and a metaphor. The `syllabus-route` proof confirms cleaning, deduplication, and lower-confidence-first ordering; it does not establish a shortest path. No `claims.json` entry covers this visitor-facing claim.
- **Fix:** Replace it with “Turn a syllabus into a study route.” If shortest-path optimization is intended, define the graph and optimality rule and add a tagged observable claim test.

### MINOR — F-1-3: Legal pages lack the required consistent header/footer navigation

- **Location / quote:** Live `/privacy/` header is only “← Exam Bridge” and footer is “Planner · Terms · Built by Param Factory · v1.0.1”; live `/terms/` has the same one-link header and “Planner · Privacy …” footer.
- **Why:** Landing/demo have wordmark navigation and both Privacy and Terms in the footer. Legal pages omit their own legal destination and product navigation, contrary to the required consistent header/footer with Privacy and Terms.
- **Fix:** Render the shared header/footer on Privacy and Terms: wordmark home link, Demo/main-product links, and both Privacy and Terms in every footer.

### MINOR — F-1-4: README sentence exceeds the 22-word cap

- **Location / quote (27 words):** “Each exact command in `.factory/claims.json` builds its production preview when needed, so it also runs after a clean `npm ci` with no existing `dist/` folder.”
- **Why:** It combines installation state, build behavior, and claim-command behavior.
- **Fix:** “Each claim command builds a production preview when needed. Run it after a clean `npm ci`, even when `dist/` is absent.”

### MINOR — F-1-5: README uses unexplained build jargon

- **Location / quote:** “Each build creates a content-fingerprinted service-worker cache.”
- **Why:** “Content-fingerprinted” gives implementation detail but no reader outcome.
- **Fix:** “Each release gives the offline app a new cache name, so returning visitors receive the current version.”

### MINOR — F-1-6: Decorative landing label does not name its section

- **Location / quote (4 words):** “Your syllabus, made navigable”.
- **Why:** It is a slogan rather than an informative section name.
- **Fix:** Replace it with “Study planning for your syllabus”, or remove it.

### MINOR — F-1-7: The limits section starts with a mood label

- **Location / quote (4 words):** “Built for honest preparation”.
- **Why:** It does not tell a screen-reader or first-time visitor what follows; the H2 does.
- **Fix:** Remove it or use “Privacy and planning limits”.

### MINOR — F-1-8: Three bold slogans add no usable information

- **Locations / quotes:** “Your material stays yours.” (4 words), “You remain the judge.” (4 words), and “No affiliation implied.” (3 words).
- **Why:** Each requires following text to explain it; the last is vague.
- **Fix:** Delete the slogans and retain the explanatory sentences. Direct alternatives: “Plans stay in this browser.”, “Check the official syllabus before studying.”, and “Exam Bridge is not endorsed by any exam authority.”

### MINOR — F-1-9: “Verify” is not a result-naming button label

- **Location / quote:** Existing-license form button: “Verify”.
- **Why:** In isolation, it does not say what will be verified.
- **Fix:** Change the visible and accessible name to “Verify license”.

## Copy audit

Counts treat hyphenated/ranged terms as one word. Feature-list fragments are included because they are reader-visible README copy. No other landing sentence exceeds 22 words.

### Landing sentences

| Copy | Words | Result |
| --- | ---: | --- |
| Find the shortest path from topic to practice. | 8 | F-1-2 |
| For returning exam candidates: turn a syllabus into a route, refresh prerequisites, and connect topics to question references you own. | 20 | Clear |
| The sample opens with six realistic topics. | 7 | `demo-sandbox` |
| Your current plan stays unchanged. | 5 | `demo-sandbox` |
| Paste the outline. | 3 | Clear |
| Rate what you know. | 4 | Clear |
| Attach only references you’re allowed to use. | 7 | Clear |
| Your study map stays in this browser. | 7 | `local-private` |
| Paste headings only—one per line. | 5 | Clear |
| Exam Bridge never uploads this text. | 6 | `local-private` |
| One topic per line; bullets and numbering are fine. | 9 | Clear |
| Use an editable starter map for a permitted exam domain, then make it your own. | 15 | Clear |
| The planner, templates, and exports stay local to this device. | 10 | `local-private` |
| A reusable starter map—not an official syllabus. (three occurrences) | 7 each | Clear |
| All starter templates are free today. | 6 | `account-free-planning` |
| Hosted checkout is unavailable, so there is no paid template purchase. | 11 | F-1-1 |
| No card details or account are needed. | 7 | `account-free-planning` |
| Your material stays yours. | 4 | F-1-8 |
| Exam Bridge stores plans locally and does not host exam questions or coaching notes. | 14 | Clear |
| You remain the judge. | 4 | F-1-8 |
| Prerequisite suggestions are starting points, not a substitute for an official syllabus. | 12 | Clear |
| No affiliation implied. | 3 | F-1-8 |
| Exam Bridge is an independent planning tool, not endorsed by any exam authority. | 13 | Clear |

### Landing headings, labels, and buttons

| Copy | Words | Result |
| --- | ---: | --- |
| Your syllabus, made navigable | 4 | F-1-6 |
| Try it with sample data | 5 | Clear action |
| Build my route | 3 | Clear action |
| Saved in this browser | 4 | `local-private` |
| Works offline after the first visit | 6 | `offline-reload` |
| Free planner, backups, and exports | 5 | Registered account/export claims |
| Start with the official outline | 5 | Clear |
| Reusable starting points | 3 | Explained by template section |
| Begin from a foundation map | 5 | Explained by following copy |
| Current template access | 3 | Clear |
| Templates are free today | 4 | Clear |
| Built for honest preparation | 4 | F-1-7 |
| What Exam Bridge does not do | 6 | Clear |
| Map my syllabus | 3 | Clear action |
| Use template | 2 | Card identifies template |
| Verify | 1 | F-1-9 |
| Original generated illustration | 3 | Provenance |
| no tracking | 2 | `local-private` |

### README sentences and feature-list copy

| Copy | Words | Result |
| --- | ---: | --- |
| Exam Bridge turns a pasted syllabus into a study route for returning exam candidates. | 14 | Clear |
| Rate each topic, choose prerequisite refreshers, and attach question IDs or links you may use. | 15 | Clear |
| The route puts lower-confidence topics first. | 6 | `syllabus-route` |
| Open the demo URL or select Try it with sample data on the first screen. | 12 | Clear |
| The six-topic sample opens without an account or setup. | 9 | `demo-sandbox` |
| Demo changes use `demo:exam-bridge:*` storage and never touch your real plan. | 12 | `demo-sandbox` |
| Use Reset demo to restore the sample. | 7 | Clear |
| Use Start for real to discard it. | 7 | Clear |
| Bullet and number-aware import for 2–80 distinct syllabus topics | 9 | Registered |
| Editable confidence and prerequisite checklists | 5 | Supported |
| Personal practice IDs, notes, and links with attempted status | 9 | Supported |
| Confidence-aware study ordering and progress summary | 6 | `syllabus-route` |
| Browser autosave, offline reload, JSON backup and restore, and CSV export | 9 | Registered |
| Light and dark themes, keyboard support, reduced motion, and a 390 px layout | 11 | `accessible-responsive` |
| Editable foundation templates, free while checkout is unavailable | 7 | F-1-1 |
| No accounts, trackers, CDN scripts, hosted questions, or exam-authority affiliation | 9 | Account/privacy registered; affiliation boundary |
| Plans live in browser localStorage. | 6 | `local-private` |
| Clearing site data deletes them. | 5 | Clear |
| Export a JSON backup for any plan you need to keep. | 11 | `json-backup-restore` |
| Exam Bridge does not republish test questions. | 7 | Clear boundary |
| Reference only material you may use. | 6 | Clear boundary |
| Requires a current Node.js LTS release. | 6 | Clear |
| npm test runs contract checks, unit tests, browser tests, accessibility scans, and the service-worker upgrade test. | 14 | Clear |
| Browser tests cover desktop and 390 px mobile projects. | 9 | Clear |
| Playwright is pinned to 1.58.2. | 5 | Clear |
| The production build command is npm run build. | 8 | Clear |
| Static output lands in dist/ with index.html at its root. | 8 | Clear |
| Each exact command in `.factory/claims.json` builds its production preview when needed, so it also runs after a clean `npm ci` with no existing `dist/` folder. | 27 | F-1-4 |
| The planner, templates, and exports are free today. | 8 | F-1-1 |
| Hosted checkout is unavailable, so there is no paid template purchase or price to show. | 15 | F-1-1 |
| Existing license holders can still restore a token. | 8 | `license-restore` |
| It is stored as `sb_license:exam-bridge` and removed from the URL. | 12 | `license-restore` |
| After a successful verification, automatic license checks use the cached verdict for up to 24 hours. | 16 | `license-cache-24h` |
| Local development uses the pilot API. | 6 | Clear |
| Production uses the production API. | 5 | Clear |
| The site embeds no payment provider. | 6 | Clear boundary |
| Deploy dist/ to Azure Static Web Apps. | 7 | Clear |
| staticwebapp.config.json sets security headers, cache policy, demo routing, and the product 404. | 8 | Clear |
| Each build creates a content-fingerprinted service-worker cache. | 7 | F-1-5 |
| A new release replaces the prior app shell. | 8 | Clear |
| See /privacy/ and /terms/ for policy. | 6 | Clear |
| The testable claims are in `.factory/claims.json`. | 5 | Clear |
| Demo details are in `.factory/demo.md`. | 4 | Clear |
| Visual provenance is in `.factory/design.md`. | 4 | Clear |
| Verification evidence and known gaps are in `.factory/handoff.md`. | 7 | Clear |

## Demo, privacy, and offline checks

The landing action opened `/demo` in one click. The first loaded screen showed the populated six-topic `GATE ECE return plan` and the persistent banner “Demo — sample data, nothing is saved” with **Reset demo** and **Start for real**.

In a fresh live context, I seeded `exam-bridge:plan:v1` with a real-plan marker, entered demo, edited a topic, reset it, and selected Start for real. The real marker remained unchanged; only `demo:exam-bridge:plan:v1` was created in demo; reset restored “Control systems”; exit removed every `demo:` key. The ordinary demo flow made only same-origin requests and had no console errors.

After first live `/demo` load was service-worker controlled, a fresh context went offline and reloaded six topics plus the offline notice without console errors.

## Claims gate

After `npm ci`, every exact command in `.factory/claims.json` completed individually against the production-preview demo entry point.

| Claim id | Result |
| --- | --- |
| `demo-sandbox` | PASS |
| `local-private` | PASS |
| `offline-reload` | PASS |
| `csv-export` | PASS |
| `json-backup-restore` | PASS |
| `syllabus-route` | PASS |
| `templates` | PASS |
| `account-free-planning` | PASS |
| `accessible-responsive` | PASS |
| `topic-cap` | PASS |
| `license-restore` | PASS |
| `license-cache-24h` | PASS |

The current landing claims map to registered entries except F-1-2. The “shortest path” statement must be removed or proven.

## Structure and route checks

| Route | HTTP | Title | H1 | Result |
| --- | ---: | --- | --- | --- |
| `/` | 200 | `Exam Bridge — syllabus to practice route` | Find the shortest path from topic to practice. | F-1-2 |
| `/demo` | 200 | `Demo — Exam Bridge` | Find the shortest path from topic to practice. | Isolated demo |
| `/privacy/` | 200 | `Privacy — Exam Bridge` | Privacy, in plain language | F-1-3 |
| `/terms/` | 200 | `Terms — Exam Bridge` | Terms of use | F-1-3 |
| unknown route | 404 | `Page not found — Exam Bridge` | This route does not exist. | Designed recovery page |

All crawlable internal links returned 200. Root/demo have canonical URLs, descriptions, OG/Twitter metadata, favicon and touch icon; all checked routes have `lang="en"`, one H1, and one main landmark. The original topology artwork, warm paper palette, and route-node composition are distinct from a generic SaaS template. No missing AI, import/export, or sync feature is implied by the local-first smallest useful product: import/export is present and AI/account sync are not needed for this job.

## Earlier findings recheck

| Earlier source | Current confirmation |
| --- | --- |
| `verification.md`: contrast, skip focus, 32 px remove control | Current accessible-responsive proof passes keyboard, themes, motion, axe, and 44 px targets. |
| `verification-2.md`: dead Plus purchase; clean test; restore/practice focus; targets | Dead advertised purchase removed; test/focus/target repairs pass. Underlying paid tier is F-1-1. |
| `verification-3.md`: topic 81; stale worker; paid tier | `topic-cap` and `test:sw-upgrade` pass. Paid tier is F-1-1. |
| `verification-4.md`: claims, demo, designed 404 | Manifest/tests, one-click demo, and product 404 are present. |
| `verification-5.md`: no-account/card claim | `account-free-planning` now proves it. |
| `verification-6.md`: clean claim start, CSV, paid tier, demo metadata | Claims/CSV pass; demo metadata is correct; paid tier is F-1-1. |
| `verification-7.md`: license cache, paid tier, demo metadata, legal copy | Cache is registered; metadata is correct; legal copy is within cap; paid tier is F-1-1. |
| `verification-8.md`: mobile first action, paid tier | Action is visible at `y=561.2–605.2`; paid tier is F-1-1. |
| `verification-9.md`: no defects; retained scope note | Behavioral repairs remain. Its freemium note is reissued as F-1-1 under this review’s history rule. |

## Local checks

- `npm ci`: passed; 0 reported vulnerabilities.
- All 12 exact registered claim commands: passed.
- `npm test`: completed lint, build, claims contract, unit, clean-claim, 50-browser-test, and service-worker stages without a reported failure.
- `npm run test:sw-upgrade`: passed the specified legacy-to-current service-worker update and offline reload.
- `npm run build`: passed and produced `dist/`; first-load app JavaScript is 27.13 kB raw / 9.75 kB gzip.

## What would make this perfect

Implement the paid template tier through Sociobot billing, remove or prove the shortest-path claim, give legal pages the shared navigation/footer, and make remaining copy direct and result-naming. Then repeat the whole first-read, clean-claims, demo-isolation, offline, history, and route review.


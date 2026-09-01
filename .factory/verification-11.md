# Independent product verification 11 — FAIL

- Work order: `exam-bridge-verify-11`
- Candidate commit: `87d67b0c7355f3679cad3caf2e33648973e70f71`
- Live URL: <https://exam-bridge.sociobot.in/>
- Verified: 1 September 2026 UTC
- Product class: static web planner / PWA

## Decision

**FAIL.** The free planner, isolated sample, offline behavior, accessibility,
privacy behavior, production build, and live deployment all pass. Two acceptance
contract findings remain:

1. The original researched brief requires a freemium offer with paid reusable
   planning templates. The candidate instead changes the repository brief to
   `free` and removes the paid purchase path. Fresh evidence confirms the
   documented Exam Bridge checkout URL still returns HTTP 404.
2. The README makes two service-worker update promises without a corresponding
   entry in `.factory/claims.json`. A separate test passes, but the supplied
   claims contract requires each visitor-facing promise to be registered with
   exactly one tagged claim test.

No product code was changed during verification.

## First-read and sample gate

**PASS.** On a cold 1440 × 900 live visit, the first screen says “Turn a
syllabus into a study route.” It says the product is for returning exam
candidates and explains that it connects topics, prerequisites, and the user's
question references. **Try it with sample data** is the clear first action. Its
adjacent text says that six realistic topics will open and the current plan will
remain unchanged.

On a cold 390 × 844 visit, the audience sentence occupies `y=385.80–507.36`
and the sample action occupies `y=581.36–625.36`, both before scrolling. The
document and viewport widths are both 390 px. The one-click sample requirement
passes.

Evidence:

- `.factory/verification-11-artifacts/live-first-read-desktop.png`
- `.factory/verification-11-artifacts/live-mobile-root-390.png`
- `.factory/verification-11-artifacts/live-first-read.json`

## Required claims checks

I confirmed that `.factory/claims.json` exists at the candidate commit. After
`npm ci`, I ran every listed command separately against the production-preview
sample entry point. All 14 registered claim tests passed.

| Claim ID | Check that | Result and evidence |
| --- | --- | --- |
| `demo-sandbox` | The six-topic sample opens, resets, exits, and uses separate storage. | PASS — `claims/demo-sandbox.log` |
| `local-private` | Planning persists locally and ordinary use sends only same-origin GET requests. | PASS — `claims/local-private.log` |
| `offline-reload` | A previously visited sample reloads while offline. | PASS — `claims/offline-reload.log` |
| `csv-export` | CSV contains all six topics and the complete personal reference. | PASS — `claims/csv-export.log` |
| `json-backup-restore` | A complete JSON backup restores the plan. | PASS — `claims/json-backup-restore.log` |
| `syllabus-route` | Heading cleanup, duplicate removal, and confidence ordering work. | PASS — `claims/syllabus-route.log` |
| `templates` | Foundation templates load as editable sample plans. | PASS — `claims/templates.log` |
| `starter-template-boundary` | A starter template is identified as editable and not official. | PASS — `claims/starter-template-boundary.log` |
| `hosted-content-boundary` | The sample contains references rather than hosted questions or notes. | PASS — `claims/hosted-content-boundary.log` |
| `independent-tool` | The non-endorsement statement appears without authority branding or service calls. | PASS — `claims/independent-tool.log` |
| `generated-illustration` | The displayed same-origin illustration matches its provenance record. | PASS — `claims/generated-illustration.log` |
| `free-access` | Planner, templates, CSV, and JSON work without account, card, checkout, or payment. | PASS — `claims/free-access.log` |
| `accessible-responsive` | Keyboard use, themes, reduced motion, target sizes, and 390 px layout work. | PASS — `claims/accessible-responsive.log` |
| `topic-cap` | A new plan stores no more than 80 topics. | PASS — `claims/topic-cap.log` |

The cited logs are under `.factory/verification-11-artifacts/`.

### Unregistered README promise

The README says: “Each release gives the offline app a new cache name.” It then
says: “Returning visitors receive the current version.” Neither promise appears
in `.factory/claims.json`. `npm run test:sw-upgrade` does confirm this behavior,
but its test is not registered as an exact `@claim:<id>` command. Under the
supplied claims contract, this remains a release-blocking claims finding.

## Clean checkout and production gates

| Check | Result |
| --- | --- |
| Candidate identity | PASS — clean starting HEAD was the full requested SHA |
| `npm ci` | PASS — 141 packages installed; 142 audited; 0 vulnerabilities |
| Every exact claim command | PASS — 14/14 |
| `npm test` | PASS — lint, TypeScript build, 14-claim contract, 9 unit tests, clean claim start, 56 desktop/mobile browser tests, service-worker update |
| `npm run build` | PASS — exact production build created `dist/` |
| `npm audit --omit=dev --audit-level=high` | PASS — 0 vulnerabilities |
| Factory `verify-url.sh` | PASS on `/`, `/demo`, `/privacy/`, `/terms/`, and `/404.html` |

The final production output contains 25.21 kB raw / 9.03 kB gzip JavaScript and
16.61 kB raw / 4.49 kB gzip CSS. The generated illustration is 19.70 kB. These
are below the 200 kB JavaScript, 50 kB CSS, 120 kB font, and 300 kB mobile image
budgets. No runtime font file is shipped.

The service-worker update check confirmed a previous application shell updates
to the final candidate shell and then reloads offline. A separate fresh live
context confirmed `/demo` was service-worker controlled, rendered six topics
after an offline reload, displayed the offline status, and logged no console
error.

## Independent product exercise

I confirmed the following on the live product in fresh browser storage:

- Keyboard activation of Demo opened six populated topics, focused the new H1,
  showed the persistent sample banner, and preserved a seeded real-plan marker.
- A non-HTTP(S) practice link produced the specific repair message. Replacing it
  with HTTPS attached the reference, and Space marked it attempted.
- The sample CSV contained a header plus six topic rows and retained the full
  HTTPS reference. The JSON backup contained all six topics.
- Reset restored `Control systems` as the first sample topic. Start for real
  removed every `demo:` key and retained the real-plan marker.
- One topic produced the stated minimum-topic message and focused the syllabus
  field. A non-HTTP(S) official source produced the stated URL message and
  focused the URL field. Corrected input then built the route.
- Numbered input with a case-variant duplicate produced two distinct topics.
  Changing confidence moved the lower-confidence topic first.
- A personal reference survived reload. Invalid JSON was rejected with a clear
  message. A valid backup restored the prior plan and reference after a template
  replacement.
- Input containing 81 distinct lines rendered and stored exactly 80 topics, and
  **Add topic** was disabled.

Evidence: `.factory/verification-11-artifacts/live-product-qa.json`.

## Privacy, accessibility, and delivery

- The independent live workflow recorded 54 requests. All were same-origin GET
  requests with no request body. No third-party request, online request failure,
  console error, or page error occurred.
- The main live response includes a self-only CSP with header-delivered
  `frame-ancestors 'none'`, HSTS, `Referrer-Policy`,
  `X-Content-Type-Options`, and a restrictive permissions policy.
- Root HTML uses `public, must-revalidate, max-age=30`; the hashed JavaScript
  asset uses `public, max-age=31536000, immutable`; `/sw.js` uses `no-cache`.
- `/`, `/demo`, `/privacy/`, `/terms/`, and `/404.html` passed the factory URL
  check for title, `lang`, one H1, main landmark, image alternatives, labelled
  controls, and console/page errors. An unknown route returned the product 404
  with HTTP 404.
- Live axe WCAG A/AA checks reported zero findings on root, sample light, sample
  dark, Privacy, Terms, and 404 at 390 px. Serious and critical counts were zero.
- Tab focused the skip link first and Enter focused main. Keyboard navigation to
  Demo focused its H1. Space changed the practice completion checkbox without
  losing focus.
- All 52 audited visible mobile targets were at least 44 × 44 CSS px. Focus-ring
  contrast is 5.76:1 or higher in light mode and 8.58:1 or higher in dark mode.
- The 720 px layout, equivalent to a 1440 px desktop viewed at 200%, retained all
  six sample topics and 27 visible controls with no horizontal overflow or
  console error.
- With reduced motion requested, audited animation and transition durations were
  `0.00001s`. No horizontal overflow occurred at 390 px.
- Live mobile Lighthouse: Performance 99, Accessibility 100, Best Practices 100,
  SEO 100; FCP 1.0 s, LCP 1.3 s, TBT 120 ms, CLS 0. The report has no run warning.

Evidence:

- `.factory/verification-11-artifacts/lighthouse-live-mobile.json`
- `.factory/verification-11-artifacts/live-mobile-demo-390.png`
- `.factory/verification-11-artifacts/verify-url/*/verify.json`

## Design and documentation

- The warm graph-paper surface, coral study path, teal prerequisite lines,
  circular topic nodes, serif display face, and clipped controls follow the
  product-specific learning-topology thesis in `.factory/design.md`.
- The generated hero asset is same-origin, 19.70 kB, has useful alternative
  text, and has a checked provenance record. The interface uses no external
  font, script, icon library, or stock asset.
- `README.md` identifies the audience, main job, sample URL, storage behavior,
  build/test commands, deployment output, and policy pages. An MIT `LICENSE`,
  `/privacy/`, `/terms/`, `.factory/demo.md`, and `.factory/design.md` are present.
- The current visual system is distinctive and does not use a generic gradient
  hero or generic feature-card layout.

## Deployment identity

Fresh local and live SHA-256 values match exactly for these candidate outputs:

| Output | SHA-256 |
| --- | --- |
| `index.html` | `e993b9de1ef17d8721ed2ceb4cc76f9a7884135abd0064071a8096fc9115f777` |
| `demo/index.html` | `32cb6b95739b544d7821f85831d02d9652c2dd7b2d5ed355b7677605a3acfae5` |
| `privacy/index.html` | `a5bcd937128023d6fc87e8b5181e3813999f82cc5b4c7a932d90e0e1a491ecdf` |
| `terms/index.html` | `da8f7d4fe43ec0d1b83c6d145f104777347a2e14dc50552b93932fb4899c50f0` |
| `assets/main-B1gErBfg.js` | `cb69a91773fecb96f37cd8f035b4f8e7151a4e5f9ba904ea6c591ed76e491318` |
| `assets/main-GaTmjR7L.css` | `e5315a6c794e0ce035ceb5dc824bbf17b6a8142373bcd36bff5a13d4fa7d997f` |
| `sw.js` | `74903125fe546e91b45f1f7c1b778a4558fd71a5978af2a49d701d53386a7b28` |

The live deployment therefore matches candidate commit `87d67b0c7355f3679cad3caf2e33648973e70f71`.

## Defects by severity

### Release-blocking — V11-1: researched paid template tier is absent

The acceptance brief supplied with this work order states: “freemium — free
planner and export; paid reusable planning templates for permitted exam
domains.” The candidate's `.factory/brief.json` changes `monetization` from
`freemium` to `free`. The live page says every template is free and has no exact
price, purchase action, license restore, or paid-template boundary.

A fresh request to the documented product checkout URL,
`https://api.sociobot.in/api/v1/products/exam-bridge/checkout`, returned HTTP
404 with `{"error":"enabled factory product","status":404}`. The generic
verification route answered an invalid test token correctly, but the candidate
does not call it. The earlier checkout condition is therefore still unresolved,
and the candidate itself no longer contains the required paid workflow.
Raw responses are in
`.factory/verification-11-artifacts/billing-checkout-{headers.txt,body.json}`
and `.factory/verification-11-artifacts/billing-verify-{headers.txt,body.json}`.

To pass, retain the useful free planner and exports, restore the original
freemium scope, register the Exam Bridge billing product, and implement the
Sociobot-hosted purchase, daily verification cache, and license restore flow
with exact price and registered tests. Then confirm the documented request
allowance and `429` plus `Retry-After` behavior for the resulting product call.

### Release-blocking — V11-2: service-worker update promise is not registered

The README's cache-name and returning-version promises are not entries in
`.factory/claims.json`. The existing `test:sw-upgrade` proves the behavior but
does not satisfy the required one-claim/one-tag registration rule.

To pass, register one precise service-worker update claim and expose exactly one
`@claim:<id>` test using a dedicated browser context, or remove the promise from
visitor-facing documentation.

### High, medium, and low

No additional high-, medium-, or low-severity product defects were found.

## Applicability notes

The shipped candidate has no product server, sign-in, runtime AI, analytics, or
current purchase call. Server concurrency, persistence boundaries, sign-in
authority, and API request-allowance checks are therefore not applicable to the
current static flow. A request-allowance check becomes required when the missing
paid workflow is restored. No additional AI step is expected for the brief;
paste import, JSON backup/restore, and CSV export cover the useful transfer work.

## How to repeat

```sh
npm ci
# Run every exact command in .factory/claims.json.
npm test
npm run build
```

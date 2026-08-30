# Independent verification 5 — FAIL

- Work order: `exam-bridge-verify-5`
- Candidate commit: `ef13c8484d287357b3cccbdf66bc264ed9fb14e3`
- Candidate URL: <https://exam-bridge.sociobot.in/>
- Verified: 2026-08-30 UTC
- Artifact: static web / PWA

## Decision

**FAIL.** This is not a deployment-only failure: the deployed application and
its material assets match a fresh production build of the candidate byte for
byte, and the planner works end to end. The candidate nevertheless fails the
mandatory claims contract. It makes an unregistered visitor-facing promise
about accounts/card details, so the claim cannot be proven in the required demo
sandbox.

## First-read result

A cold fresh-profile visit to `/` gave a clear answer within the first screen:

- **What:** “Find the shortest path from topic to practice.”
- **For whom:** “For returning exam candidates”.
- **First action:** **Try it with sample data**; the nearby note says it opens
  six realistic topics without changing the current plan.

The one-click action opened `/demo`, rendered six realistic GATE ECE topics,
and showed the persistent **Demo — sample data, nothing is saved** banner with
**Reset demo** and **Start for real**. This requirement passes.

## Release-blocking defect

### High — unlisted, untested no-account/card-details claim

The live landing page says **“No card details or account are needed.”** in the
local-first/templates panel. The README also says **“No accounts”** in its v1
feature list. Neither statement has a matching claim in
`.factory/claims.json`; the ten registered claims are demo isolation, local
privacy, offline reload, CSV, JSON, syllabus route, templates,
accessibility/responsiveness, the topic cap, and license restoration.

There is also no `@claim:` test that asserts a fresh visitor can use the normal
planner and templates without an authentication or checkout/payment request.
The current `templates` claim proves a demo template is editable without
payment, which is not the same registered promise and does not establish the
normal no-account flow.

The supplied claims acceptance rule says that any landing/README claim without
an entry is an **unlisted claim** that fails review. Register and prove this
promise from a fresh demo entry point (or remove/reword it), then rerun the
independent verification.

## Claims and clean local gates

Started from the clean candidate at the exact commit above. `npm ci` completed
with 59 packages and no reported vulnerabilities. `.factory/claims.json`
exists and contains ten unique entries. Every exact manifest command was run
against the desktop demo entry point:

1. `@claim:demo-sandbox`
2. `@claim:local-private`
3. `@claim:offline-reload`
4. `@claim:csv-export`
5. `@claim:json-backup-restore`
6. `@claim:syllabus-route`
7. `@claim:templates`
8. `@claim:accessible-responsive`
9. `@claim:topic-cap`
10. `@claim:license-restore`

The browser runner buffered the individual command summaries, but its final
`test-results/.last-run.json` state was `passed`; a subsequent clean `npm test`
completed the same claim coverage in the full suite: contracts passed, Vitest
passed **8/8**, and Playwright passed **42/42** across Desktop Chrome and Pixel
5. The included exact `npm run test:sw-upgrade` also passed. There is no lint
script or lint configuration in this repository. An independent exact
`npm run build` passed (`tsc --noEmit` plus Vite) and produced `dist/`.

## Independent product exercise

Against the live candidate in fresh browser contexts:

- Built a representative ten-topic returning-candidate plan. Changing the
  first topic to Ready reordered it behind the remaining lower-confidence
  topics.
- Rejected a `javascript:` official-source URL with the clear recovery message
  and focus on `#source-url`; accepting an HTTPS URL then built the plan.
- Rejected a `javascript:` practice link; replacing it with HTTPS attached the
  permitted personal question reference.
- CSV export had the declared header and **11** lines (header plus ten topics).
  JSON backup held ten topics. A malformed JSON restore left all ten visible.
  The added practice reference persisted after reload.
- Demo contained only `demo:exam-bridge:plan:v1`, made no cross-origin
  requests, and did not touch a real-plan key. After entering 81 pasted topic
  lines, it created exactly 80, disabled Add topic, and showed the maximum
  notice.

## Privacy, accessibility, PWA, and live deployment

- During cold landing, normal planning, and demo journeys, all recorded page
  requests were same-origin and there were zero console/page errors. No planner
  content left the browser. The only intentionally external application call is
  explicit/existing-license verification to the documented Sociobot endpoint.
- Live axe scans had no serious or critical WCAG A/AA findings for populated
  demo desktop light/dark, 390×844 light/dark, Privacy, or Terms. At 390 px,
  `clientWidth === scrollWidth === 390`; audited effective interactive targets
  were all at least 44×44 px. With reduced motion, topic animation duration was
  `0.00001s`. A fresh keyboard session focused **Skip to planner** first and
  Enter moved focus to `main` on both `/` and `/demo`.
- A fresh live PWA profile obtained controller `/sw.js`, cache
  `exam-bridge-80c98a512d12c3885452`, then reloaded `/demo` offline with all six
  topics and the offline notice. The repository upgrade regression also passed
  from the exact legacy `553f8fb9` worker to this build.
- Root, demo, Privacy, Terms, and a deliberately missing route returned the
  expected statuses. The missing route was the product-owned 404 with H1
  “This route does not exist.” and no external resources. Responses carried
  CSP including response-header `frame-ancestors 'none'`, HSTS,
  `Referrer-Policy: strict-origin-when-cross-origin`, `nosniff`, and restrictive
  Permissions-Policy. HTML is revalidated after 30 seconds; hashed assets are
  one-year immutable; `sw.js` is `no-cache`.
- The server-side license verification allowance was observed directly: invalid
  requests **1–30** received HTTP 200; requests **31–35** received HTTP 429
  with `Retry-After` values of 3, 3, 2, 2, and 2 seconds respectively.

## Deployment identity and budgets

Fresh local build hashes exactly matched live:

| File | SHA-256 |
| --- | --- |
| `index.html` | `83d5b23ed47c9ab1c8abc0994d59206dd2e1adb59fc138d989c10125ef763ddb` |
| `assets/index-g-Uu5oJe.js` | `a170d1ea7989ae22bd3b98d4114bd51cdb5c10824eeddf418d65cbfd0d370328` |
| `assets/index-B74SkQKw.css` | `ddace3c1eda6e321216953d3855916cde53441c67ebdb9150a73d754f1bd24b2` |
| `assets/learning-topology.webp` | `2b89e36f3b6404b94b7f87de69906ef6d45668f9a7c13e81190dbcb1f88b3441` |
| `404.html` | `dc1f87414e077df09b076bbbff0a9592051f7e299e21854c2402bb93052035ef` |
| `sw.js` | `95f807e1bb8cd817f3d0e412d7782036a6a87781038e5244950af72115836c1f` |

Initial application JavaScript is 26,409 B raw / 9,520 B gzip; CSS is 17,114 B
raw / 4,580 B gzip; the hero WebP is 19,704 B. All are below the 200 KB JS,
50 KB CSS, and 300 KB hero budgets. Lighthouse 13.4.1 could not complete in
this container because its Chromium tab crashed; this is a verifier-environment
limitation, not counted as a product defect. Browser accessibility, layout,
console, and transfer checks above passed directly.

## Required before PASS

Add a specific claims-manifest entry and tagged demo-sandbox test for the
normal no-account/no-card-details promise, or remove that promise from the
landing page and README. Then rerun all manifest commands and this verification.

# Independent product verification 15 — FAIL

- Work order: `exam-bridge-verify-15`
- Candidate commit: `12d01a9b5170beb15088b5c8e4a4806e59733ee4`
- Live URL: <https://exam-bridge.sociobot.in/>
- Verified: 2 September 2026 UTC
- Product class: static web planner / PWA

## Decision

**FAIL.** The candidate is deployed byte-for-byte, all 17 registered claim
commands pass, the normal repository gate passes, and the free planner works
well. It does not satisfy two acceptance requirements:

1. **The advertised one-click demo does not show the product in use after that
   click.** It opens another marketing hero. The populated workspace is below
   the viewport and requires the separate **Explore the sample route** action.
2. **The researched freemium tier is absent.** All three reusable templates are
   now free, the product explicitly presents no purchase action, and the live
   product-scoped checkout still returns HTTP 404.

No product code was changed during verification.

## Mandatory first checks

### Claims gate

`.factory/claims.json` exists and contains 17 unique claims. From the clean
detached candidate checkout, after `npm ci`, every listed command was run
separately through the production-preview demo entry point. All 17 commands
passed:

| Claim | Result |
| --- | --- |
| `demo-sandbox` | PASS — sample storage, reset, exit, and real-plan isolation |
| `not-found-plan-safety` | PASS — saved plan remains byte-identical across the 404 |
| `local-private` | PASS — local persistence and same-origin ordinary use |
| `offline-reload` | PASS — controlled sample route reloads offline |
| `service-worker-renewal` | PASS — replacement worker and offline reload |
| `csv-export` | PASS — complete six-topic CSV and reference data |
| `json-backup-restore` | PASS — complete backup/restore round trip |
| `syllabus-route` | PASS — cleanup, deduplication, and confidence ordering |
| `templates` | PASS — all three editable local templates |
| `starter-template-boundary` | PASS — editable plan, not official syllabus |
| `hosted-content-boundary` | PASS — references only |
| `independent-tool` | PASS — no authority affiliation or service |
| `generated-illustration` | PASS — same-origin art and provenance |
| `free-access` | PASS — planner, templates, CSV, and JSON need no payment |
| `no-dead-purchase-action` | PASS — no checkout, price, or purchase control |
| `accessible-responsive` | PASS — keyboard, themes, motion, targets, and 390 px |
| `topic-cap` | PASS — 80 topics persist; topic 81 is unavailable |

The contract test reported `PASS: 17 registered claims, isolated demo contract,
and product 404 policy`. The copy audit maps the current landing, planner,
legal, README, and provenance promises to registered claims.

The passing `demo-sandbox` test does not prove its full wording. It asserts that
six `.topic` elements exist in the DOM after the first click, but does not
assert that the user can see the route. That gap is defect V15-1 below.

### Cold first-read and one-click demo

The cold landing text passes the three plain-language questions:

- What: **Turn a syllabus into a study route.**
- Who: returning exam candidates who need prerequisites and their own question
  references connected to syllabus topics.
- First action: **Try it with sample data**, with adjacent copy explaining the
  six-topic sample and real-plan isolation.

The action is visible without scrolling at desktop and 390 × 844. On mobile it
occupies y=581.36–625.36.

The required one-click outcome **fails**. After selecting that action, both
viewports remain at scroll position 0 and show the demo banner plus another
hero. The populated workspace and first topic are entirely outside the first
screen:

| Viewport | Workspace top after first click | First topic top | Visible? |
| --- | ---: | ---: | --- |
| 1440 × 900 | 1032.73 px | 1611.80 px | No |
| 390 × 844 | 1662.80 px | 2453.61 px | No |

A second click on **Explore the sample route** scrolls to the workspace. The
demo therefore takes two actions to look like the product being used, contrary
to the demo-sandbox contract and the `demo-sandbox` claim.

## Clean checkout and quality gates

| Check | Result |
| --- | --- |
| Starting revision | PASS — clean detached checkout at the exact candidate |
| `npm ci` | PASS — 141 packages installed; 142 audited; 0 vulnerabilities |
| Every claims command | PASS — 17/17 independently |
| `npm test` | PASS — lint, TypeScript/build, contracts, 9 unit tests, clean-start claim, and 62 browser cases; 61 passed and the duplicate mobile service-worker case was intentionally skipped |
| `npm run build` | PASS — exact production build produced `dist/` |
| `npm audit --omit=dev --audit-level=high` | PASS — 0 vulnerabilities |
| `/opt/fleet/lib/verify-url.sh` | PASS on live `/` and `/demo`; no console errors and required semantics present |

## Independent end-to-end exercise

Fresh live browser contexts confirmed:

- One topic is rejected with the required two-distinct-topic correction and
  focus returns to the topic field.
- An `ftp:` syllabus source is rejected with an HTTP(S) correction and focus
  returns to the source field.
- Numbered and bulleted input with a duplicate becomes exactly **Signals and
  systems** and **Control systems**.
- An `ftp:` practice link is rejected. Replacing it with an HTTPS URL attaches
  `2024 · Q17`.
- CSV contains the exact header and two rows, including the reference label and
  URL. JSON contains both topics.
- An invalid JSON restore gives the specific recovery message, leaves stored
  bytes unchanged, and keeps both topics.
- The plan and reference survive reload.
- Space marks the reference attempted and preserves keyboard focus.
- Demo reset restores **Control systems** first; leaving demo removes the demo
  namespace without creating real-plan data.
- The 80-topic boundary and topic-81 refusal passed through its claim test.

## Privacy, accessibility, and responsive behavior

- The complete independent landing, demo, planning, validation, export, and
  reload request log contains same-origin GET requests only. It contains no
  request body, tracker, analytics call, remote font, or third-party script.
- Desktop axe WCAG A/AA scans of the populated planner in light and dark modes
  found zero violations. The 390 px light/dark scans found zero serious or
  critical violations. Lighthouse accessibility scored 100.
- Tab reaches **Skip to planner** first; Enter focuses `main`. The visible focus
  style is a 3 px `rgb(7, 95, 170)` outline with a 3 px offset.
- At 390 px, `innerWidth`, `clientWidth`, and `scrollWidth` are all 390. The
  smallest visible interactive target is 44 × 44 px.
- At 720 CSS px, representing a 1440 px layout at 200% browser zoom, all six
  topics and 80 controls remain available without horizontal overflow.
- Under reduced motion, topic animation and transition durations are
  `0.00001s`; no repeating animation was observed.
- Root and demo verification plus the complete independent flow produced no
  console or page errors.

The 390 px landing does not place the required privacy/offline/price facts in
the first viewport. They begin at y=1199.66, after the illustration. This is
recorded as V15-3.

## Routes, headers, caching, and PWA

- `/`, `/demo`, `/privacy/`, `/terms/`, and `/404.html` return 200 with
  route-specific titles, `lang=en`, one H1, one main landmark, canonical URLs,
  descriptions, and complete image alternatives.
- A new unknown path returns the designed local 404 bytes with HTTP 404. Every
  same-origin link crawled from the five pages returned 200; mail links were
  identified and not fetched.
- The CSP is delivered as a response header and includes
  `frame-ancestors 'none'`. HSTS, `nosniff`, strict-origin referrer policy, and
  restrictive camera, microphone, and geolocation policy are present.
- HTML uses `public, must-revalidate, max-age=30`; hashed JS, CSS, and art use
  one-year immutable caching; `/sw.js` uses `no-cache`.
- The live service worker controls `/demo`, the six-topic route reloads offline,
  and the isolated replacement-worker claim passes.

The app has no backend, account, or sign-in, so server concurrency, server
persistence, and Microsoft Entra authority checks do not apply. It is not a
library or CLI, so consumer packing does not apply.

The still-live product-scoped license verifier was checked as a single client:
requests 1–30 returned 200; request 31 returned 429 with `Retry-After: 4` and
`X-RateLimit-After: 4`. Observed allowance: **30 requests per active window**.
The candidate does not call that endpoint.

## Performance and deployment identity

| Measure | Result |
| --- | --- |
| JavaScript | 25,171 bytes raw / 9,008 bytes gzip — PASS |
| CSS | 16,896 bytes raw / 4,562 bytes gzip — PASS |
| Runtime fonts | none — PASS |
| Main illustration | 19,704 bytes — PASS |
| Live mobile Lighthouse | Performance 97, Accessibility 100, Best Practices 100, SEO 100 |
| Lighthouse metrics | FCP 1.0 s, LCP 1.2 s, TBT 190 ms, CLS 0 |
| Measured live interaction duration | maximum 56 ms — PASS against 200 ms budget |

Fresh SHA-256 comparisons match local `dist/` and live response bytes exactly:

| Output | SHA-256 |
| --- | --- |
| `/` | `e38604d5ca5d2bc449a2afc5bba4ac9ef2a0f95e1555349ae2c912c211ef6141` |
| `/demo` | `2999423600b315d121245f66da60aa8bfa569965858116a7a07e2b55a7a751b6` |
| `/sw.js` | `9bd00133fdc4d9f2c606c977ae1be413a8a9f2b01fa8adb49463a81f07ad29fb` |
| JavaScript | `6797c4fdf3c9a9b4f2495564c8ac0bd7a1cd3472d7469f5e347d56e0955c6c48` |
| CSS | `55c39501547d09005245537f165c04778a1983d219414eae7bb605039851115d` |

Privacy, Terms, 404, illustration, manifest, and route-focus script also match;
the full comparison is in `live-routes-identity.json`. The deployment is the
tested candidate, so neither release blocker is a stale-deployment artifact.

## Design, documentation, and missed leverage

The warm graph-paper canvas, coral route, teal prerequisite lines, serif display
face, clipped controls, and original paper-topology illustration follow the
product-specific design thesis. Asset prompt, generator, review, and provenance
are recorded. README, MIT license, Privacy, Terms, demo guide, copy audit,
robots, sitemap, manifest, social image, and product 404 are present.

No runtime AI feature is warranted for this deterministic local planner. Paste
import, CSV export, JSON backup/restore, editable templates, and offline use
cover the obvious transfer and reuse needs without sending syllabus content to
a model.

## Defects by severity

### Release-blocking — V15-1: sample route is not visible after the promised one click

The landing action enters `/demo`, but the first screen after navigation remains
a marketing hero. The workspace is 132.73 px below the desktop viewport and
818.80 px below the mobile viewport; the first topic is farther down. The user
must select **Explore the sample route** to reach the populated planner.

This violates the demo contract that the screen after the first click already
look like the product being used. It also exposes an insufficient claim test:
`@claim:demo-sandbox` checks DOM population, not viewport visibility after the
one allowed click.

Required before PASS: show the populated sample workspace or a meaningful slice
of it immediately after the landing action on desktop and 390 px, without a
second action. Extend the registered claim to assert the visible workspace
geometry after exactly one click.

### Release-blocking — V15-2: the accepted freemium template tier is missing

The researched brief specifies a free planner plus paid reusable planning
templates. The candidate instead makes all three templates free and says:
`The app presents no purchase or checkout action.` A fresh scoped request
confirmed the deployment problem remains:

```text
GET https://api.sociobot.in/api/v1/products/exam-bridge/checkout
HTTP 404
{"error":"enabled factory product","status":404}
```

Removing the unavailable offer is honest and the free product is useful, but it
does not satisfy the accepted freemium scope. A verifier cannot treat removal of
the failed path as completion of that path.

Required before PASS: an authorized billing operator must register the scoped
one-time template product and return URL, then the candidate must restore and
test checkout, return-token storage, restore-purchase entry, daily verification,
offline cached unlock, and revocation behavior through the Sociobot billing API.

### Medium — V15-3: mobile first-screen facts appear after the illustration

At 390 × 844, the cold page shows the job, audience, and actions, but the three
required facts begin at y=1199.66. Visitors must scroll past the illustration to
learn that data is local, offline reload works, and the current tools are free.

Required before PASS: place the three fact lines in the initial mobile viewport
or otherwise make all three readable in the first screen without hiding the
job, audience, or sample action.

### High and low

No additional defects found.

## Evidence

- `.factory/verification-15-evidence/live-independent-qa.json`
- `.factory/verification-15-evidence/live-demo-click-depth.json`
- `.factory/verification-15-evidence/live-first-screen-geometry.json`
- `.factory/verification-15-evidence/live-routes-identity.json`
- `.factory/verification-15-evidence/live-link-crawl.json`
- `.factory/verification-15-evidence/product-verify-rate-limit.json`
- `.factory/verification-15-evidence/lighthouse-live-mobile.json`
- `.factory/verification-15-evidence/live-event-timing.json`
- `.factory/verification-15-evidence/live-first-read-mobile-390.png`
- `.factory/verification-15-evidence/live-demo-mobile-390.png`
- `.factory/verification-15-evidence/verify-root/verify.json`
- `.factory/verification-15-evidence/verify-demo/verify.json`

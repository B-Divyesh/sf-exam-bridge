# Independent product verification 14 — FAIL

- Work order: `exam-bridge-verify-14`
- Candidate commit: `ce518fd1ee6f19f4aff2c5785ebf73c6eaa13d23`
- Live URL: <https://exam-bridge.sociobot.in/>
- Verified: 2 September 2026 UTC
- Product class: static web planner / PWA

## Decision

**FAIL.** The candidate fixes verification 13's intermittent browser-test race.
Every declared claim passed independently, two consecutive normal `npm test`
runs passed, the live deployment exactly matches the candidate, and the free
planner works end to end. One acceptance-contract defect remains: a new visitor
cannot buy the researched paid reusable-template tier. The live site offers no
buy action, and a fresh request to the documented product-scoped Sociobot
checkout returned HTTP 404.

No product code was changed during verification.

## Mandatory first checks

### Claims gate

`.factory/claims.json` exists and contains 19 unique claims. From the clean
candidate checkout, after `npm ci`, I ran every listed `test` command separately
through the production-preview demo entry point. All 19 passed:

| Claim | Result |
| --- | --- |
| `demo-sandbox` | PASS — sample, reset, exit, and separate storage |
| `not-found-plan-safety` | PASS — exact saved-plan bytes survive a 404 visit |
| `local-private` | PASS — local persistence and same-origin ordinary use |
| `offline-reload` | PASS — controlled demo reloads offline |
| `service-worker-renewal` | PASS — current worker replaces the legacy worker and reloads offline |
| `csv-export` | PASS — six rows, selected prerequisite, label, and URL |
| `json-backup-restore` | PASS — complete plan round trip |
| `syllabus-route` | PASS — heading cleanup, deduplication, and confidence ordering |
| `templates` | PASS — all three templates preview in demo storage |
| `starter-template-boundary` | PASS — editable plan, not official syllabus |
| `hosted-content-boundary` | PASS — references only; no hosted questions or notes |
| `independent-tool` | PASS — non-endorsement boundary and no authority service |
| `generated-illustration` | PASS — same-origin asset and provenance record |
| `free-access` | PASS — planner, CSV, and JSON need no account or payment |
| `paid-template-license` | PASS — controlled valid verification enables and caches templates |
| `refund-revokes-license` | PASS — controlled revoked verdict removes paid access |
| `checkout-registration-gate` | PASS — unavailable checkout is hidden while price and restore remain visible |
| `accessible-responsive` | PASS — keyboard, themes, motion, targets, and 390 px layout |
| `topic-cap` | PASS — 80 topics persist and topic 81 is unavailable |

Each manifest command selected exactly one tagged test. The contract check also
reported `PASS: 19 registered claims, isolated demo contract, and product 404
policy`. The copy audit maps the landing, planner, legal, README, and provenance
promises to these claims; I found no additional unlisted outcome claim.

### Cold first-read and one-click demo

**PASS.** The cold live first screen plainly answers the three required
questions:

- What: **Turn a syllabus into a study route.**
- Who: returning exam candidates who need prerequisites and their own question
  references connected to syllabus topics.
- First action: **Try it with sample data**; adjacent copy says it opens six
  realistic topics without changing the current plan.

One selection opened `/demo`, populated six topics, and displayed the persistent
**Demo — sample data, nothing is saved** banner with **Reset demo** and **Start
for real**. On a cold 390 × 844 viewport, the audience copy ended at y=507.36
and the 366 × 44 px sample action occupied y=581.36–625.36, entirely before
scrolling. Screenshots are in `.factory/verification-14-evidence/`.

## Clean checkout and quality gates

| Check | Result |
| --- | --- |
| Starting revision | PASS — clean detached checkout at the exact candidate |
| `npm ci` | PASS — 141 packages installed; 142 audited; 0 vulnerabilities |
| Every claims command | PASS — 19/19 independently |
| First `npm test` | PASS — lint, type/build, contracts, 9 unit tests, clean-start check, 69 browser tests; 1 intentional skip |
| Second `npm test` | PASS — same result under the normal two-worker configuration |
| `npm run build` | PASS — exact production build produced `dist/` |
| `npm audit --omit=dev --audit-level=high` | PASS — 0 vulnerabilities |

The repeated normal test runs specifically cover the concurrency setup that
failed verification 13. The candidate's render-ready state and corresponding
claim wait remove that observed race.

## Independent end-to-end exercise

Fresh live browser contexts confirmed:

- One topic is rejected with: `Add at least two distinct topic lines so there is
  a route to build.`
- An `ftp:` syllabus source is rejected with the HTTP(S) correction and focus
  returns to that field.
- A numbered two-topic input with a duplicate becomes exactly two topics.
- An `ftp:` practice link is rejected; changing it to HTTPS attaches the
  reference.
- CSV contains its header, both topics, and the full label/URL. JSON contains
  both topics and the same reference.
- The plan and reference survive reload from `exam-bridge:plan:v1`.
- An invalid JSON restore says `That file is not a valid Exam Bridge backup.`,
  leaves the stored bytes unchanged, and keeps both topics visible.
- Keyboard Enter opens the demo, Arrow Down changes confidence, and Space
  toggles a prerequisite checkbox.
- The service-worker-controlled six-topic demo reloads offline and shows the
  offline state.

These cover normal use, duplicate input, minimum/maximum boundaries through the
claim suite, unsupported URL schemes, invalid backup recovery, persistence,
export, and offline recovery.

## Privacy, accessibility, and responsive behavior

- The complete independent landing, planning, edit, export, and reload log made
  only same-origin GET requests. It contained no request body, tracker, remote
  font, analytics call, or third-party script request.
- Optional license verification is the only external runtime path and is
  limited to the documented product endpoint on `api.sociobot.in`.
- Independent axe WCAG A/AA scans of a populated real plan and the demo, in
  light and dark treatments and at desktop/390 px, found zero violations,
  including zero serious or critical findings.
- Tab reaches the skip link first; Enter focuses `main`. Primary-action and
  form focus rings are visible 3 px `rgb(7, 95, 170)` outlines with a 3 px
  offset. Keyboard select and checkbox use worked without a trap.
- At 390 px, `innerWidth`, `clientWidth`, and `scrollWidth` were all 390. Native
  20 px checkboxes use 44 px labelled hit areas, and the visually hidden restore
  input uses its 44 px file-button label. The full authored target audit passed.
- At 720 CSS px, equivalent to 1440 px at 200% browser scaling, all six topics
  and 76 controls remained available with no horizontal overflow.
- Under reduced motion, topic animation and transition durations were
  `0.00001s`; no repeating animation exists.
- Normal root, demo, Privacy, Terms, and direct 404 loads produced no console or
  page errors. The deliberate unknown-route request produced only Chromium's
  expected failed-document message for its correct HTTP 404 response.

## Routes, headers, caching, and PWA

- `/`, `/demo`, `/privacy/`, `/terms/`, and `/404.html` returned 200 with
  route-specific titles, `lang=en`, one H1, one main landmark, complete image
  alternatives, canonical URL, description, and product social image.
- A new unknown path returned the designed product 404 with HTTP 404. All real
  same-origin navigation links resolved; mail links were left as mail links.
- Root CSP is response-header delivered and includes `frame-ancestors 'none'`.
  HSTS, `nosniff`, strict-origin referrer policy, and restrictive camera,
  microphone, and geolocation policy are present.
- HTML uses `public, must-revalidate, max-age=30`; hashed JS, CSS, and art use
  one-year immutable caching; `/sw.js` uses `no-cache`.
- Both the independent live offline reload and the isolated service-worker
  replacement claim passed.

The product has no server of its own, database, account system, or sign-in, so
server concurrency, server persistence, and Entra authority checks do not
apply. It is not a library or CLI, so consumer packing does not apply.

## Endpoint allowance

The public product-scoped verifier was tested as one cookie-preserving client
with origin `https://exam-bridge.sociobot.in`. Requests 1–30 returned HTTP 200.
Request 31 returned HTTP 429 with `Retry-After: 3`, `X-RateLimit-After: 3`, and
`Too Many Requests! Wait for 3s`. Observed allowance: **30 requests per active
client window**.

## Performance and production identity

| Measure | Result |
| --- | --- |
| JavaScript | 28,346 bytes raw / 10,087 bytes gzip — PASS |
| CSS | 17,433 bytes raw / 4,669 bytes gzip — PASS |
| Runtime fonts | none — PASS |
| Main illustration | 19,704 bytes — PASS |
| Clean live mobile Lighthouse | Performance 100, Accessibility 100, Best Practices 100, SEO 100 |
| Lighthouse metrics | FCP 0.9 s, LCP 1.1 s, TBT 80 ms, CLS 0 |

The first Lighthouse attempt completed a 98/100/100/100 report, then its tab
crashed during teardown. A clean rerun with shared-memory pressure disabled
completed without warnings and is the primary report:
`.factory/verification-14-evidence/lighthouse-live-mobile-clean.json`.

Fresh SHA-256 comparisons matched local `dist/` and live bytes exactly:

| Output | SHA-256 |
| --- | --- |
| `/` | `53d95178dfa2c4cb469abe07a7153b6808a8d09cd6efa06b1efc9c42e96265c7` |
| `/demo` | `4ad32bc2bf68dfb6161bc9a4ce446dc3c359098fa7e3cfea8b7801c1066418df` |
| `/privacy/` | `944495ca79d36b9ba315720a3d5d9d866515a0c97405eb46d1733ee6bbe60736` |
| `/terms/` | `f0ae98b662cdf14ac5870ebddd5ff0e83103d97069cc5d3596f3896d55496e0a` |
| `/404.html` | `f764cafc8f39d30a4a5a9cfd4306d9d0cde738f9323b69fc794e0c502e8549b9` |
| `/sw.js` | `1e15f3f21fa3c5cc8ac2e34b228c31c46a12838af6a95131ba2558196b9f84c1` |
| JavaScript | `f8fe26db67e36d48d91a70bd0a5a8d556adb03f6b1537e3f623788379fb9c262` |
| CSS | `82299484e4a22dabf76f68e75c948f07859111a486ff5404b0ca4e389320a03b` |
| Illustration | `2b89e36f3b6404b94b7f87de69906ef6d45668f9a7c13e81190dbcb1f88b3441` |
| Manifest | `6fa5c8e733f5505af1a94051882771c02ce1587473012e639f77ad2b89f83965` |

The deployed product therefore matches the tested candidate.

## Design, documentation, and missed leverage

The warm graph-paper canvas, coral route, teal prerequisite lines, serif display
face, clipped controls, and original paper-topology illustration follow the
product-specific design thesis. Asset source, prompt, generator, review, and
provenance are recorded. README, MIT license, Privacy, Terms, demo guide, copy
audit, robots, sitemap, manifest, social image, and product 404 are present.

No runtime AI feature is warranted for this deterministic local planner. Paste
import, CSV export, JSON backup/restore, editable templates, and offline use
cover the obvious transfer and reuse needs without sending syllabus content to
a model.

## Defects by severity

### Release-blocking — V14-1: new paid-template purchases are unavailable

The researched brief specifies a freemium product whose paid feature is reusable
planning templates. The live page states the one-time ₹499 price and allows demo
previews and existing-license restore, but it says new purchases are not open
and renders no buy or checkout action.

Fresh reproduction on 2 September 2026 UTC:

```text
GET https://api.sociobot.in/api/v1/products/exam-bridge/checkout
HTTP 404
{"error":"enabled factory product","status":404}
```

The candidate behaves honestly by hiding this dead route, and the free
job-to-be-done is complete, but the paid path in the acceptance contract does
not work end to end. A mocked verifier test and a passing registration-gate
claim cannot substitute for a real hosted checkout.

Required before PASS: an authorized billing operator must register the
product-scoped ₹499 one-time product and production return URL, confirm the live
purchase/refund flow, and enable the existing checkout build flag. Then rerun
claims, the full gate, live purchase return-token handling, daily verification,
revocation, deployment identity, and this verification.

### High, medium, and low

No additional defects found.

## Evidence

- `.factory/verification-14-evidence/live-first-read-desktop.png`
- `.factory/verification-14-evidence/live-demo-after-one-click.png`
- `.factory/verification-14-evidence/live-demo-mobile-390.png`
- `.factory/verification-14-evidence/live-independent-qa.json`
- `.factory/verification-14-evidence/live-routes-headers.json`
- `.factory/verification-14-evidence/lighthouse-live-mobile-clean.json`

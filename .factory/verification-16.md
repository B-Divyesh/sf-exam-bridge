# Independent product verification 16 — FAIL

- Work order: `exam-bridge-verify-16`
- Candidate commit: `a1a021d29e5541e754515735889b88f602ce94b3`
- Live URL: <https://exam-bridge.sociobot.in/>
- Verified: 2 September 2026 UTC
- Product class: static web planner / PWA

## Decision

**FAIL.** The candidate is deployed byte-for-byte, all 17 registered claims
pass, the one-click demo defect from verification 15 is fixed, and the free
planner works end to end. The accepted researched brief still requires a
freemium offer with paid reusable planning templates. This candidate instead
makes all templates free, disables checkout, and provides no paid-template
license flow. A fresh request to the scoped checkout returned HTTP 404.

No product code was changed during verification.

## Mandatory first checks

### Claims gate

The checkout began clean at the exact candidate commit. After `npm ci`, I ran
every command in `.factory/claims.json` separately through its production
preview and demo entry point. The manifest exists and all 17 tests passed.

| Claim | Result |
| --- | --- |
| `demo-sandbox` | PASS — visible one-click sample, isolated edits, reset, and exit |
| `not-found-plan-safety` | PASS — saved plan stays byte-identical across the 404 |
| `local-private` | PASS — local persistence and same-origin ordinary use |
| `offline-reload` | PASS — controlled sample route reloads offline |
| `service-worker-renewal` | PASS — replacement worker and offline reload |
| `csv-export` | PASS — complete six-topic CSV with the selected reference |
| `json-backup-restore` | PASS — complete backup/restore round trip |
| `syllabus-route` | PASS — cleanup, deduplication, and confidence ordering |
| `templates` | PASS — all three editable starter templates |
| `starter-template-boundary` | PASS — editable plan, not an official syllabus |
| `hosted-content-boundary` | PASS — references only; no hosted questions or notes |
| `independent-tool` | PASS — no authority branding, affiliation, or service |
| `generated-illustration` | PASS — same-origin art and recorded provenance |
| `free-access` | PASS — planner, templates, CSV, and JSON need no payment |
| `checkout-unavailable` | PASS — checkout is disabled and makes no request |
| `accessible-responsive` | PASS — keyboard, themes, motion, targets, and 390 px |
| `topic-cap` | PASS — 80 topics persist and topic 81 is unavailable |

The contract check also passed: `17 registered claims, isolated demo contract,
and product 404 policy`. The landing, README, legal pages, and copy audit did
not expose an unmatched outcome claim.

### Cold first-read and one-click demo

**PASS.** A cold live visit answers all three required questions on desktop and
390 × 844:

- What: **Turn a syllabus into a study route.**
- Who: returning exam candidates connecting prerequisites and their own
  question references to syllabus topics.
- First action: **Try it with sample data**, followed by a direct explanation
  that it opens six topics without changing the current plan.

All three local/offline/free facts also fit in the unscrolled 390 px viewport;
the facts end at y=834.16 in an 844 px viewport. After exactly one click, the
populated demo workspace begins at y=80.73 on desktop and y=152.80 on mobile.
The route summary ends at y=520.80 and y=714.61 respectively. No second action
or scroll is needed. This resolves V15-1 and V15-3.

## Clean local gates

| Check | Result |
| --- | --- |
| Starting revision | PASS — clean `main` at the exact candidate |
| `npm ci` | PASS — 141 packages installed; 0 vulnerabilities reported |
| Every claims command | PASS — 17/17 independently |
| `npm test` | PASS — lint, build, contracts, 9 unit tests, clean-start check, and 62 browser cases; 61 passed and one duplicate mobile SW case skipped by design |
| `npm run lint` | PASS |
| `npm exec tsc -- --noEmit` | PASS |
| `npm run build` | PASS — exact production build created `dist/` |
| `npm audit --omit=dev --audit-level=high` | PASS — 0 vulnerabilities |

The production build contains 25,853 bytes of JavaScript (9,210 gzip), 17,305
bytes of CSS (4,623 gzip), no runtime font download, and a 19,704-byte hero
WebP. These pass the 200 KB JS, 50 KB CSS, 120 KB font, and 300 KB hero budgets.

## Independent product exercise

A fresh live browser journey confirmed:

- The demo opens a populated six-topic GATE ECE route in one click. Edits use
  only `demo:exam-bridge:*`; reset restores the sample, and exit deletes demo
  keys without creating or changing `exam-bridge:plan:v1`.
- One topic is rejected with the two-distinct-topic instruction and focus on the
  topic field. An `ftp:` syllabus source is rejected with the HTTP(S)
  instruction and focus on the source field.
- Numbered and bulleted input with a duplicate becomes exactly **Signals and
  systems** and **Control systems**.
- An `ftp:` practice link is rejected. Replacing it with an HTTPS URL attaches
  `2024 · Q17`.
- CSV export has the expected header and two topic rows, including the practice
  label and URL. JSON backup contains both topics.
- A malformed JSON restore reports the specific error and leaves stored plan
  bytes unchanged. The plan and reference survive reload.
- Space marks the reference attempted and leaves keyboard focus on its checkbox.
- The claim suite separately confirms the 80-topic maximum, duplicate removal,
  confidence reordering, template editing, complete restore, and 404 plan safety.

The full journey logged only same-origin GET requests, no request body, and no
console or page errors.

## Accessibility and responsive behavior

- Fresh Playwright axe WCAG A/AA scans on populated desktop light/dark and
  390 px mobile found zero violations, including zero serious or critical.
- `/opt/fleet/lib/verify-url.sh` passed `/`, `/demo`, `/privacy/`, and `/terms/`:
  each has `lang=en`, one H1, a main landmark, complete image alternatives,
  labelled buttons, and zero console/page errors.
- Tab reaches **Skip to planner** first; Enter focuses `main`. Its focus style is
  a 3 px `rgb(7, 95, 170)` outline with a 3 px offset.
- At 390 px, client and document widths are both 390 px. All 53 visible audited
  links, buttons, and custom controls are at least 44 × 44 CSS px.
- A 720 CSS px viewport, representing a 1440 px layout at 200% zoom, retains all
  six topics and 81 controls without horizontal overflow.
- With reduced motion enabled, tested animations and transitions are
  `0.00001s`. No looping or flashing motion was present.

## Privacy, routes, headers, and PWA

- Cold landing and complete planning flows make same-origin requests only. No
  tracker, analytics request, CDN script, remote font, runtime AI service, or
  product backend is present.
- Demo and real plans use separate local-storage namespaces. The privacy page
  accurately discloses browser storage and standard hosting logs.
- `/`, `/demo`, `/privacy/`, `/terms/`, and `/404.html` return 200 with
  route-specific titles, descriptions, canonical URLs, one H1, and one main.
  A fresh unknown path returns the designed page with HTTP 404. All same-origin
  page links plus robots, sitemap, manifest, icons, and social image returned
  successful responses.
- HTML uses `public, must-revalidate, max-age=30`; hashed JS, CSS, and art use
  one-year immutable caching; `/sw.js` uses `no-cache`.
- Live responses include CSP limited to `self` with header-delivered
  `frame-ancestors 'none'`, HSTS, `nosniff`, strict-origin referrer policy, and
  restrictive camera, microphone, and geolocation policy.
- A fresh service-worker-controlled `/demo` reload with networking disabled
  restored all six topics and showed the offline state without errors.
- The isolated service-worker replacement test passed in both its exact claim
  command and the full suite.

This is a static product with no sign-in or product backend, so Entra authority,
server concurrency, and server persistence checks do not apply. It is not a
library or CLI, so consumer installation does not apply.

The scoped, currently unused license verifier was checked from one client.
Requests 1–30 returned 200 with an invalid-license verdict. Request 31 returned
HTTP 429 with `Retry-After: 2`; the observed allowance is 30 requests per active
window. The product does not call this endpoint in its current free state.

## Performance and deployment identity

| Measure | Result |
| --- | --- |
| Live mobile Lighthouse | Performance 99, Accessibility 100, Best Practices 100, SEO 100 |
| Lighthouse metrics | FCP 0.98 s, LCP 1.32 s, TBT 139 ms, CLS 0 |
| 4× CPU-throttled interaction sample | Maximum observed event duration 136 ms |
| Initial JavaScript | 25.9 KB raw / 9.2 KB gzip |
| Initial CSS | 17.3 KB raw / 4.6 KB gzip |
| Hero image | 19.7 KB |

Fresh local and live bytes match for all eleven checked outputs:

| Output | SHA-256 |
| --- | --- |
| `/` | `564ac3ac99c6f150823fa4b15f3a56dd0e7103128f5c69aa5f64102afa90eb8a` |
| `/demo` | `646b83663099d789279b0c248dacceac0d2fb4e83f9e802b5bc0fccf83bd7b9b` |
| `/privacy/` | `f84bafae308b8e1eb96bd6924c8b29e566da99defe8696cfc6e6b8358c515b7d` |
| `/terms/` | `0c934ed31cb7427102cd738d7a36436ee5ddf48dbb125f8774aa7ce629b0244b` |
| `/404.html` | `2da333838b06f3b872f26fa78353a014213b50e7edb65a012fa96b898bf86fb3` |
| JavaScript | `4d33d83dcc099328896f2238641197fad1eb78ce1ca0ad74b15e57b17fe0b0e9` |
| CSS | `22486df4e4a4dcbc78cf47d18ae59ec2eecb674eee7f35b7d2978e61ed174167` |
| Illustration | `2b89e36f3b6404b94b7f87de69906ef6d45668f9a7c13e81190dbcb1f88b3441` |
| Route focus script | `a1cd658a29e5fdea5bdf8c46f4d3b359328e00727bbff4015c7fe7963c874f42` |
| Manifest | `6fa5c8e733f5505af1a94051882771c02ce1587473012e639f77ad2b89f83965` |
| Service worker | `2f330787d6c87e76c1a410588da49367f6ff8e68e75e1a2ea62737ba93582dce` |

The live deployment therefore matches candidate
`a1a021d29e5541e754515735889b88f602ce94b3`.

## Defects by severity

### Release-blocking — V16-1: accepted paid reusable-template tier is absent

The researched brief specifies **freemium — free planner and export; paid
reusable planning templates for permitted exam domains**. The live candidate
instead says **Use any template at no cost**, **Checkout unavailable**, and
**There is no paid offer**. All three templates are free. There is no buy link,
return-token storage, restore-purchase field, cached verification, revocation
handling, exact price, or paid template entitlement.

Fresh scoped evidence:

```text
GET https://api.sociobot.in/api/v1/products/exam-bridge/checkout
HTTP 404
{"error":"enabled factory product","status":404}
```

The candidate truthfully removes a dead purchase path, but that does not deliver
the accepted paid tier. This is a scope failure, not a stale deployment: local
and live bytes match.

Required before PASS: an authorized billing operator must register the
product-scoped one-time offer and return URL, and the product must implement and
test checkout, token capture, restore purchase, daily verification, offline
cached access, revocation, exact pricing, and the paid template entitlement via
the Sociobot billing API.

### Medium — V16-2: required three-step “How it works” section is missing

The header link **How it works** targets `#how`, but that section has no heading
and no ordered or unordered list. It is a single paragraph: “Paste the outline.
Rate what you know. Attach only references you’re allowed to use.” It also
appears before the product rather than after it. This does not satisfy the
required standard landing skeleton’s explicit **How it works** section in three
steps after the product preview.

Required before PASS: render an `h2` named **How it works** and three semantic,
verb-led steps after the live product or preview, preserving the current concise
copy and visual identity.

### High and low

No additional defects found.

## Product and design assessment

The smallest useful free planner is real and complete: syllabus import,
confidence ordering, prerequisite choices, personal references, local
persistence, templates, export/restore, demo isolation, offline reload, mobile,
and recovery paths all work. The graph-paper canvas, coral route, teal
connections, serif display type, clipped controls, and original topology art
follow the recorded product-specific visual thesis. The art prompt, generator,
review, derivatives, and provenance are documented.

No runtime AI feature is warranted for this deterministic planner. Import,
editable templates, CSV, JSON backup/restore, and offline use cover the obvious
transfer and reuse needs without sending syllabus content to a model.

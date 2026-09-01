# Independent product verification 12 — FAIL

- Work order: `exam-bridge-verify-12`
- Candidate commit: `1820610592249b22179664b557936f05e523730b`
- Live URL: <https://exam-bridge.sociobot.in/>
- Verified: 1 September 2026 UTC
- Product class: static web planner / PWA

## Decision

**FAIL.** The core planner, sample sandbox, local storage, exports, offline
reload, accessibility, responsive layout, privacy behavior, build, and live
deployment all pass. The candidate is not ready for acceptance for three
reasons:

1. New purchases for the researched freemium tier remain unavailable. The
   product-scoped checkout returns HTTP 404, so a visitor cannot complete the
   advertised one-time ₹499 purchase.
2. Two visitor-facing promises are absent from `.factory/claims.json`: the 404
   page says a saved plan is unchanged, and the paid copy says refunds revoke a
   license. Neither has its own registered tagged test.
3. The live 404 footer identifies itself as `v1.0.3`, while this candidate and
   every other product route identify version `v1.0.4`.

The first two findings are release-blocking under the researched freemium brief
and supplied claims contract. No product code was changed during verification.

## Mandatory first checks

### Claims manifest and exact claim commands

`.factory/claims.json` exists and contains 17 unique entries. After `npm ci`, I
ran every listed `test` command separately. Each command built the production
preview and ran from the sample entry point. All 17 commands returned one
passing test.

| Claim ID | Confirm and check that | Result |
| --- | --- | --- |
| `demo-sandbox` | The six-topic sample opens, resets, exits, and keeps real-plan storage separate. | PASS — 1 passed |
| `local-private` | Sample edits persist locally and ordinary planning sends only same-origin requests. | PASS — 1 passed |
| `offline-reload` | A visited sample reloads with the browser offline. | PASS — 1 passed |
| `service-worker-renewal` | The current worker replaces the supplied earlier worker and reloads the current shell offline. | PASS — 1 passed |
| `csv-export` | CSV contains the six topics, selected prerequisite, and complete practice reference. | PASS — 1 passed |
| `json-backup-restore` | JSON preserves and restores the complete plan. | PASS — 1 passed |
| `syllabus-route` | Topic cleanup, duplicate removal, and confidence ordering work. | PASS — 1 passed |
| `templates` | All three editable templates can be previewed in the isolated sample. | PASS — 1 passed |
| `starter-template-boundary` | Templates are identified as editable plans rather than official syllabuses. | PASS — 1 passed |
| `hosted-content-boundary` | The sample contains references, not hosted questions or coaching notes. | PASS — 1 passed |
| `independent-tool` | The independence notice appears without authority branding or service requests. | PASS — 1 passed |
| `generated-illustration` | The displayed same-origin illustration matches the provenance record. | PASS — 1 passed |
| `free-access` | Planner, CSV, and JSON remain available without account, card, checkout, or payment. | PASS — 1 passed |
| `paid-template-license` | A controlled valid verification response enables all templates and caches the result for 24 hours. | PASS — 1 passed |
| `checkout-registration-gate` | The disabled checkout state shows price, sample previews, and license restore without a checkout request. | PASS — 1 passed |
| `accessible-responsive` | Keyboard use, themes, reduced motion, 44 px targets, and 390 px layout work. | PASS — 1 passed |
| `topic-cap` | A plan saves 80 topics and does not offer a topic 81 action. | PASS — 1 passed |

The contract check also confirmed one tagged browser test per registered claim.
The separate claim cross-check found the unregistered copy described under
defect V12-2 below.

### Cold first-read test

**PASS.** A fresh 1440 × 900 live visit answers all three required questions on
the first screen:

- What it does: “Turn a syllabus into a study route.”
- Who it is for: “For returning exam candidates”.
- What to select first: **Try it with sample data**.

The adjacent note says the sample opens six realistic topics and leaves the
current plan unchanged. Selecting the action once opened `/demo`, rendered six
populated topics, and showed the persistent “Demo — sample data, nothing is
saved” banner. At 390 × 844, the audience statement and sample action were both
visible before scrolling, with no horizontal overflow.

## Clean checkout and production gates

The starting tree was clean and `HEAD` exactly matched the requested candidate.

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 141 packages installed; 142 audited; 0 vulnerabilities |
| Every `.factory/claims.json` command | PASS — 17/17 |
| `npm test` | PASS — lint, TypeScript/build, contracts, 9 unit tests, clean-start check, and 65 browser tests; one duplicate mobile worker case intentionally skipped |
| `npm run build` | PASS — exact production build created `dist/` |
| `npm audit --omit=dev --audit-level=high` | PASS — 0 vulnerabilities |
| Factory URL check | PASS on `/`, `/demo`, `/privacy/`, and `/terms/`; no console/page errors |

The skipped case is the duplicate mobile execution of the shared service-worker
renewal test. Its desktop claim test passed both independently and in `npm test`.

## Independent end-to-end checks

I confirmed these behaviors on the live product in fresh browser contexts:

- The sample opened with six topics and a persistent sample-data notice.
- An unsupported practice-link scheme produced a specific correction message;
  replacing it with HTTPS attached the reference.
- CSV contained its exact header plus six topic rows and the added HTTPS
  reference. JSON contained all six topics and the reference.
- Reset removed the edit and restored the original sample. Start for real
  removed all `demo:` keys while preserving a seeded real-data marker.
- A one-topic syllabus produced the minimum-topic message and focused its input.
- An unsupported official-source scheme produced the URL message and focused
  its input. Correcting it built the plan.
- A numbered list with a case-variant duplicate became two distinct topics.
- Changing confidence moved the lower-confidence topic first. The order and
  content remained after reload.
- An invalid backup produced a clear message and left the current route intact.
- A plan with 80 topics saved and reloaded all 80. **Add topic** was disabled,
  and the interface stated the maximum had been reached.
- A controlled valid license result enabled all three template controls, stored
  the product-scoped token, removed the returned token from the address bar,
  and avoided another automatic check inside 24 hours.
- A live invalid token received HTTP 200 with `valid:false`, kept templates
  unavailable, and displayed a useful correction message.

## Privacy, accessibility, and responsive behavior

- The independent ordinary-use log covered landing, sample, editing, exports,
  reset, exit, a real plan, both themes, and mobile. Every request was same
  origin. There were no analytics, third-party scripts, cross-origin requests,
  request bodies, console errors, or uncaught page errors.
- The optional live license check contacted only
  `https://api.sociobot.in/api/v1/products/exam-bridge/verify`.
- Axe WCAG A/AA scans in 390 px light and dark treatments reported zero serious
  or critical findings.
- Tab focused the designed skip link first, its outline was visible, and Enter
  focused the main landmark. The complete browser suite also confirmed route
  heading focus and keyboard operation of practice state.
- All 52 visible sample controls checked at 390 px were at least 44 × 44 CSS px.
- Focus-outline contrast was at least 5.76:1 in light treatment and 8.58:1 in
  dark treatment against the relevant surfaces.
- A 720 CSS-pixel layout, equivalent to a 1440 px desktop at 200% scaling,
  retained all six topics and 76 controls without horizontal overflow.
- With reduced motion requested, transitions measured `0.00001s` and no
  repeating movement was present.
- A fresh service-worker-controlled sample reloaded offline with all six topics
  and displayed the offline guidance.

## HTTP behavior, routing, and request allowance

- `/`, `/demo`, `/privacy/`, and `/terms/` returned HTTP 200.
- A new unknown route returned the designed product page with HTTP 404.
- The five unique same-origin links found across the product routes resolved to
  their intended 200 pages; the current unknown-route URL correctly remained
  404.
- Root responses include CSP with header-delivered `frame-ancestors 'none'`,
  HSTS, `Referrer-Policy`, `X-Content-Type-Options`, and a restrictive
  permissions policy.
- Root HTML uses `public, must-revalidate, max-age=30`; hashed assets use
  `public, max-age=31536000, immutable`; `/sw.js` uses `no-cache`. Conditional
  checks returned HTTP 304 for root and the JavaScript asset.
- The product-scoped license endpoint allowed 30 consecutive checks from one
  client in the observed window. Check 31 returned HTTP 429 with
  `Retry-After: 4` and a plain wait message.

The product has no server of its own, account system, sign-in, runtime AI, or
separate database. Server concurrency, server persistence, and sign-in-authority
checks are not applicable. The product is a PWA, so worker renewal and offline
reload were checked.

## Performance and asset budgets

| Asset or measure | Result |
| --- | --- |
| JavaScript | 28,198 bytes raw / 10.08 kB gzip — PASS against 200 kB |
| CSS | 17,433 bytes raw / 4.65 kB gzip — PASS against 50 kB |
| Runtime fonts | none — PASS against 120 kB |
| Main illustration | 19,704 bytes — PASS against 300 kB |
| Live mobile Lighthouse | Performance 99, Accessibility 100, Best Practices 100, SEO 100 |
| Live mobile metrics | FCP 0.9 s, LCP 1.2 s, TBT 140 ms, CLS 0 |
| Local production Lighthouse | Performance 93, Accessibility 100, Best Practices 100, SEO 100; LCP 1.7 s, CLS 0 |
| Ten-topic map action to next paint | 32.2 ms |

The live Lighthouse report contained no run warning. Initial JavaScript, CSS,
font, illustration, LCP, CLS, and Lighthouse score budgets pass.

## Deployment identity

Fresh local and live SHA-256 values match exactly:

| Output | SHA-256 |
| --- | --- |
| `/` | `16acb46b4fdf6a84a446411dc4bbbcd96044f06c6bd6c4f9894111d3e7ce5b3f` |
| `/demo` | `5eeb0484cc5b506c72787534d8319fec52aa4e8a77b17cbc5031296b403ecabe` |
| `/privacy/` | `f33a828f04ec45e52f6cf206c189970791e06d7470005e7e2b25f130a7822238` |
| `/terms/` | `80e566f5b271d0704ccf1ce855279468fce9d2abb1d0a64ace437ac736bfcc54` |
| `/404.html` | `54477add15d6b166a83e681aa1c331bcd020a7ef2d4fc05a3d04dcc1991426f7` |
| `/sw.js` | `222a4c4a5419f2a56bea743f4a9d954d34711aec54a4e214655ec1b02951abd9` |
| JavaScript | `7b68a7a3c7c42502013c37b1af88a403078adc51cdbc6875506dcba3feb2514b` |
| CSS | `82299484e4a22dabf76f68e75c948f07859111a486ff5404b0ca4e389320a03b` |

The live deployment therefore matches candidate commit
`1820610592249b22179664b557936f05e523730b` exactly for every checked output.

## Design and documentation

- The warm graph-paper surface, coral path, teal prerequisite lines, circular
  topic nodes, serif display face, and clipped controls follow the documented
  learning-topology thesis.
- The same-origin generated illustration is 19.70 kB, has useful alternative
  text, and has a source and provenance record. No runtime font, icon library,
  stock asset, or CDN script is used.
- README, MIT license, privacy, terms, sample guide, visual thesis, claims
  manifest, robots file, sitemap, manifest, product 404, and handoff are present.
- The first screen and working planner use direct product language rather than a
  generic marketing layout.
- No additional model-assisted step is necessary for this brief. Paste import,
  JSON backup/restore, and CSV export cover the useful transfer work without a
  runtime model dependency.

## Defects by severity

### Release-blocking — V12-1: new paid-template purchases are unavailable

The researched contract specifies a freemium product with paid reusable
planning templates. The page correctly shows the one-time ₹499 price and keeps
the free planner useful, but it also says new purchases are not open and
provides no purchase action.

A fresh request to
`https://api.sociobot.in/api/v1/products/exam-bridge/checkout` returned HTTP 404
with `{"error":"enabled factory product","status":404}`. This confirms the
shared checkout is still not registered for this product. The current gating is
honest and avoids a non-working link, but a new visitor still cannot complete
the paid workflow required by the brief.

To pass, register and confirm the product-scoped ₹499 one-time checkout and its
production return URL, enable the existing operator flag, and confirm purchase,
return-token storage, daily verification, restore, and revoked-license behavior
against the live product.

### Release-blocking — V12-2: two visitor promises are not registered claims

The supplied claims contract requires every statement a visitor may rely on to
appear in `.factory/claims.json` with exactly one tagged outcome test.

- The 404 page says, “Your saved plan has not changed.” The untagged 404 browser
  test checks presentation and requests, but it does not seed and compare saved
  plan storage.
- The paid panel and Terms say refunds are handled by Sociobot/Dodo and revoke
  the license. No claim entry or tagged test confirms the revoked-license
  outcome.

To pass, register each promise with one exact tagged test that confirms the
observable result, or remove wording that cannot be confirmed.

### Low — V12-3: 404 footer shows a stale product version

The package, root, sample, Privacy, and Terms identify `v1.0.4`. The candidate
and live 404 footer identify `v1.0.3`. This does not affect navigation or saved
data, but it makes build identification inconsistent on an error route.

### High and medium

No additional high- or medium-severity defects were found.

## How to repeat

```sh
npm ci
# Run every exact command from .factory/claims.json.
npm test
npm run build
npm audit --omit=dev --audit-level=high
```

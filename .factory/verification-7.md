# Independent verification 7 — FAIL

- Work order: `exam-bridge-verify-7`
- Candidate commit: `18dcf28d3fb0687b1e6472e507e79dbf97644c9c`
- Candidate URL: <https://exam-bridge.sociobot.in/>
- Verified: 2026-08-30 UTC
- Artifact: static web / PWA

## Decision

**FAIL.** The live application matches the candidate, the core planner works end
to end, all 11 registered claim commands pass after the clean lockfile install,
and the local quality gates pass. The candidate nevertheless violates the
mandatory claims contract: a quantitative once-per-day license-check promise is
published in the README and Privacy page, but is absent from
`.factory/claims.json` and is not asserted by a tagged claim test.

This is not a deployment-only failure. Fresh local build bytes match the live
runtime, including the repaired CSV behavior and claim-test startup.

## First-read gate

**PASS.** A cold 1440×900 browser profile answers the three required questions on
the first screen:

- What it does: **“Find the shortest path from topic to practice.”**
- Who it is for: **“For returning exam candidates”.**
- What to click first: **Try it with sample data**. The adjacent note says that it
  opens six realistic topics without changing the current plan.

The action opens `/demo` in one click. The page immediately shows six populated
GATE ECE topics and the persistent **“Demo — sample data, nothing is saved”**
banner with **Reset demo** and **Start for real**.

## Findings by severity

### High — unlisted and untested quantitative license-cache claim

The README says Exam Bridge verifies an existing license through the Sociobot API
**“no more than once daily.”** The Privacy page says the verification result and
timestamp are cached **“for up to one day.”** These are quantitative promises a
visitor can rely on.

The `license-restore` manifest entry promises only that a token can be stored,
removed from the URL, and verified. Its single tagged test mocks one returned
license verification; it does not reload within 24 hours, cross the 24-hour
boundary, or assert request counts. No other claim entry or tagged test covers the
daily allowance. The supplied claims contract requires quantitative copy to be
registered and asserted with its number, and says an unlisted claim fails review.

An independent mocked browser check found that the current implementation behaves
as described: request counts were 1 after explicit verification, 1 after a fresh
reload, and 2 after moving the cached timestamp to 86,400,001 ms old. That manual
evidence does not replace the required manifest entry and tagged regression test.

### Medium — researched freemium template tier remains unshipped

The researched brief specifies paid reusable planning templates. The live product
instead makes all three templates free, gives no price or checkout action, and says
the hosted purchase flow is still being prepared. Existing-license verification
works, but a new buyer cannot complete the specified one-time purchase flow.

The current free planner is useful and the handoff honestly records the rescope,
so this does not invalidate the core job-to-be-done. It remains a scope gap against
the researched monetization contract.

### Low — `/demo` raw route metadata describes the home page

The raw response at `/demo` contains the home title, home canonical URL, home Open
Graph title, and home Open Graph URL. Client JavaScript changes the browser title
and canonical URL after load, but it does not update the Open Graph or Twitter
metadata. Crawlers that do not execute JavaScript therefore receive home-page
metadata instead of **Demo — Exam Bridge**, contrary to the route-metadata
contract.

### Low — legal copy exceeds the 22-word plain-language ceiling

The copy audit covers the landing and demo screens but omits legal routes. The
Privacy license-check sentence is 26 words, and the Terms sentence beginning
**“When paid access is offered again”** is 31 words. Both exceed the supplied
22-word hard cap. This does not obstruct the planner, but the legal copy should be
split and added to the copy audit.

## Claims gate

The repository was clean at the exact candidate commit. After the required
`npm ci` lockfile install (59 packages, zero reported vulnerabilities), every
exact `test` command in `.factory/claims.json` was run separately against the
production demo entry point:

| Claim | Result |
| --- | --- |
| `demo-sandbox` | PASS — 1 test |
| `local-private` | PASS — 1 test |
| `offline-reload` | PASS — 1 test |
| `csv-export` | PASS — 1 test |
| `json-backup-restore` | PASS — 1 test |
| `syllabus-route` | PASS — 1 test |
| `templates` | PASS — 1 test |
| `account-free-planning` | PASS — 1 test |
| `accessible-responsive` | PASS — 1 test |
| `topic-cap` | PASS — 1 test |
| `license-restore` | PASS — 1 test |

The Playwright server command is self-contained (`npm run build && npm run
preview`) and does not reuse an unknown server. The dedicated clean-start test
also removes generated `dist/` and proves the first claim builds and serves from
that state.

## Clean local gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 59 packages, 0 vulnerabilities |
| Every exact claim command | PASS — 11/11 |
| `npm test` | PASS — contracts, 9 unit tests, clean-start regression, 44 Playwright tests, SW upgrade |
| `npx tsc --noEmit` | PASS |
| `npm run build` | PASS — exact production build created `dist/` |
| Factory `verify-url.sh` on `/` | PASS — 200, 635 ms, no errors, title/lang/H1/main/alts/buttons valid |
| Factory `verify-url.sh` on `/demo` | PASS — 200, 688 ms, no errors, title/lang/H1/main/alts/buttons valid |
| Lint | Not available — no lint script or configuration |

Package/consumer installation is not applicable because this is a deployed static
web application, not a library or CLI.

## Independent end-to-end product exercise

Fresh live browser contexts produced the following results:

- The one-click demo showed six realistic topics. Its edits used
  `demo:exam-bridge:plan:v1`; a seeded `exam-bridge:plan:v1` real-plan marker was
  unchanged.
- A normal ten-topic plan accepted an HTTPS official source, saved locally, and
  survived reload. Setting Topic 1 to Ready moved it behind all lower-confidence
  topics.
- A labelled HTTPS question reference survived reload. CSV contained 11 lines and
  preserved `2025 · Q9 (https://example.org/q9)`. JSON backup contained all ten
  topics.
- A malformed JSON restore announced **“That file is not a valid Exam Bridge
  backup.”** and left all ten topics intact.
- One topic was rejected with an actionable message and focus on `#syllabus`.
  An `ftp://` syllabus source and practice link were rejected with explicit HTTP(S)
  recovery instructions; source focus moved to `#source-url`.
- The lower boundary accepted exactly two topics. Pasting 81 distinct topics
  rendered and stored 80, disabled **Add topic**, and displayed **“Maximum 80
  topics reached.”**
- All crawled internal links returned 200. Privacy and Terms returned 200. An
  unknown path returned the product-owned 404 with one H1 and one main landmark.

No console errors, page errors, or unexpected request failures occurred in these
online journeys.

## Privacy, network, and license endpoint

- Cold load requested only the origin HTML, hashed JavaScript, stylesheet, and
  product hero image.
- Demo editing and the full normal planning/export/reload flow made no
  cross-origin requests. No analytics, third-party fonts, or CDN scripts loaded.
- The only observed cross-origin application call followed an explicit invalid
  license submission. It called
  `https://api.sociobot.in/api/v1/products/exam-bridge/verify`, returned 200 with
  `{valid:false, reason:"invalid"}`, used `Cache-Control: no-store`, and included
  `Access-Control-Allow-Origin: https://exam-bridge.sociobot.in`. The UI showed
  **“License no longer active.”** while the free planner remained usable.
- Fresh rate-limit probing of that product endpoint returned 200 for requests
  1–30. Request 31 returned 429 with `Retry-After: 3`. Observed allowance: **30
  requests per client window**.
- There is no sign-in flow, so the Microsoft Entra External ID requirement is not
  applicable. There is no product backend or server-side persistence to test;
  planner state is browser-local.

## Accessibility and responsive behavior

- Axe WCAG A/AA scans reported zero violations, including zero serious or critical
  findings, on populated desktop light/dark, 390×844 light/dark, Privacy, Terms,
  and the product 404.
- At 390 px, `clientWidth === scrollWidth === 390`; no audited visible link,
  button, file control, prerequisite choice, or practice control was below 44×44
  CSS px.
- Keyboard-only entry focused **Skip to planner** first with a visible 3 px solid
  outline. Enter moved focus to `main`; one further Tab reached **Try it with sample
  data**, and Enter opened `/demo`. No keyboard trap was encountered.
- With reduced motion enabled, route animation duration was `0.00001s`.
- A 640 CSS-pixel viewport, equivalent to 200% zoom from a 1280-pixel desktop
  viewport, reflowed without horizontal overflow and retained all six topics.
- The pages have `lang="en"`, one H1, main landmarks, labelled controls, and
  complete image alternatives.

## PWA, headers, caching, and performance

- A fresh service-worker context was controlled by `/sw.js` and used cache
  `exam-bridge-5d38f67dfbfc0ede2115`. With the network disabled, `/demo` reloaded
  all six topics and displayed the offline notice.
- The repository upgrade regression passed from legacy service worker commit
  `553f8fb9` to the same final cache, including offline reload after update.
- Browser-observed HTML headers include CSP with header-delivered
  `frame-ancestors 'none'`, HSTS, `Referrer-Policy: strict-origin-when-cross-origin`,
  `X-Content-Type-Options: nosniff`, and restrictive Permissions-Policy.
- HTML uses `public, must-revalidate, max-age=30`; hashed JS/CSS and the hero use
  one-year immutable caching; `sw.js` uses `no-cache`.
- Lighthouse 13.4.1 mobile: Performance **98**, Accessibility **100**, Best
  Practices **100**, SEO **100**; FCP 0.9 s, LCP 1.1 s, TBT 160 ms, CLS 0.
- Initial JavaScript is 26,580 B raw / 9,534 B gzip; CSS is 17,114 B raw / 4,592 B
  gzip; hero WebP is 19,704 B; no webfont files ship. All supplied budgets pass.

## Deployment identity

Fresh candidate build files matched the live responses byte for byte:

| File | SHA-256 |
| --- | --- |
| `index.html` | `8f2ba920a44ceed938aecdb4c72e15ba7dac0f39744eed3a7ea44687c0c6d41d` |
| `assets/index-CXurhOaN.js` | `0f87d4ddb31d74c0acf581512daa32497156dae74373c43986c47750fb86923a` |
| `assets/index-B74SkQKw.css` | `ddace3c1eda6e321216953d3855916cde53441c67ebdb9150a73d754f1bd24b2` |
| `assets/learning-topology.webp` | `2b89e36f3b6404b94b7f87de69906ef6d45668f9a7c13e81190dbcb1f88b3441` |
| `privacy/index.html` | `4a83a4067af466b9e0ec82d811fc1d180c653e34de26b3f5c3a8e9f150057013` |
| `terms/index.html` | `dd2cf30b5d39cb8b4e2f25d5d8cb673430a1d81dd0a7e89e5c576cc5ae889b9e` |
| `404.html` | `b97ea8c16a54d354a9ffceab2fdfff61f8a3876214f7efed5f9246a727eca39e` |
| `sw.js` | `d42e0eb62bea64e592740b63012236f8c6ba2650600b123a3a45b888577cc08a` |

## Required before PASS

1. Register the once-per-day license verification promise in
   `.factory/claims.json` and add exactly one tagged demo-sandbox test that asserts
   request counts before and after the 24-hour boundary, or remove the quantitative
   promise from visitor-facing copy.
2. Complete or formally defer the paid template purchase path with the factory
   product-registration dependency recorded.
3. Serve demo-specific title/canonical/social metadata at `/demo`, and split the
   two overlong legal sentences.

No product code was modified during this verification.

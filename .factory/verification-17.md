# Independent product verification 17 — FAIL

- Work order: `exam-bridge-verify-17`
- Candidate commit: `97013ae4793a1f8dcbb914d31b47ebeee5e29af2`
- Live URL: <https://exam-bridge.sociobot.in/>
- Verified: 2 September 2026 UTC
- Product: static-web planner / PWA

## Decision

**FAIL.** The free, local-first planner is deployed at the candidate revision and
passes its functional, claims, privacy, accessibility, mobile, offline, and
bundle checks. The researched brief requires a freemium product with paid
reusable planning templates. This candidate displays a ₹499 template license,
but deliberately disables every purchase action because the scoped Sociobot
checkout is unregistered. The live checkout URL returns HTTP 404. A visitor
therefore cannot buy the promised paid templates end to end.

No product source code was changed during verification.

## Release-blocking finding

### High — paid template purchase is unavailable

**Evidence:** The live page says “New purchases are not open yet. Checkout needs
operator activation,” exposes no Buy/checkout link, and directs locked template
cards only to the demo. A fresh scoped request returned:

```text
GET https://api.sociobot.in/api/v1/products/exam-bridge/checkout
HTTP 404
{"error":"enabled factory product","status":404}
```

The README and handoff confirm `VITE_CHECKOUT_ENABLED` is intentionally off.
License restore and mocked verification work, but neither permits a new
customer to purchase the freemium upgrade required by the brief.

**Required resolution:** An authorized billing operator must register the
Exam Bridge ₹499 product and production return URL with the scoped Sociobot
checkout, then deploy the enabled purchase link and verify a real checkout and
return-token flow. This verifier did not alter billing or any external service.

## Mandatory first checks

### Claims gate — PASS

The checkout was clean at the exact candidate commit. `npm ci` installed 141
packages and reported zero vulnerabilities. I ran every exact command listed in
`.factory/claims.json` from the production preview and demo entry point. All
19 passed:

| Claim | Result |
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
| `paid-template-license` | PASS — controlled valid verdict, 24-hour cache, and offline access |
| `refund-revokes-license` | PASS |
| `checkout-registration-gate` | PASS — accurately proves the unavailable state |
| `accessible-responsive` | PASS |
| `topic-cap` | PASS |

### Cold first-read and demo — PASS

Freshly opening the live mobile page answers the required questions in plain
words: it **turns a syllabus into a study route**; it is for **returning exam
candidates**; and the first action is **Try it with sample data**. Its adjacent
copy says that it opens six topics without changing the current plan. The three
facts also fit without scrolling at 390 × 844: browser-local storage, offline
after first visit, and free planner/backups/exports. The facts end at y=834.16.

One click opens `/demo` with six realistic GATE ECE topics. Demo storage
contains only `demo:exam-bridge:plan:v1`; an edited practice reference persisted
through demo reload. The 390 px page has no horizontal overflow and reduced
motion reports a 0.00001 s animation duration.

## Clean local gates — PASS

| Check | Result |
| --- | --- |
| Starting revision | Clean tree at `97013ae4793a1f8dcbb914d31b47ebeee5e29af2` |
| `npm ci` | PASS — 141 packages, 0 reported vulnerabilities |
| Every claims command | PASS — 19/19 |
| `npm test` | PASS — lint, TypeScript/build, contracts, 9 unit tests, clean-start check, and 74 Playwright cases |
| `npm audit --omit=dev --audit-level=high` | PASS — 0 vulnerabilities |
| Production build | PASS — `dist/` produced |
| JS/CSS/image budgets | PASS — 29,372 B JS / 10,336 B gzip; 18,286 B CSS / 4,793 B gzip; 19,704 B hero WebP |

## Product exercise and privacy — PASS

On the live product, a one-topic outline gives the clear recovery message “Add
at least two distinct topic lines so there is a route to build.” Replacing it
with Signals and systems plus Control systems creates a two-topic plan. An
`ftp:` practice link is rejected with “Use a complete http:// or https:// link.”
The saved plan survived a real unknown-route visit; that page returned HTTP 404,
showed “This route does not exist,” and did not alter local storage.

A live controlled demo reload worked offline with its six topics and the
offline notice. The local claim suite separately exercised service-worker
replacement and offline reload of the replacement version.

The live normal/demo journey issued only same-origin GETs for HTML, JS, CSS,
route script, and artwork: no tracker, third-party request, POST, or user-data
URL was observed. The only optional cross-origin path is explicit license
verification, as documented. Its product-scoped allowance was freshly checked:
30 sequential invalid-license requests returned 200; request 31 returned **429**
with `Retry-After: 4` and `X-RateLimit-After: 4`.

## Live deployment, accessibility, and headers — PASS

- `verify-url.sh` passed live `/`, `/demo`, `/privacy/`, and `/terms/`: all
  return 200, have expected route titles, `lang=en`, exactly one H1, a main
  landmark, complete image alt text, labelled buttons, and zero browser/page
  errors on normal load.
- Fresh axe WCAG A/AA scan of the reduced-motion populated 390 px demo found
  zero violations, including zero serious or critical findings. Keyboard Tab
  reached **Skip to planner** and Enter focused `#main`.
- All 15 discovered same-origin links returned HTTP 200. Unknown routes return
  the designed 404 page with HTTP 404.
- The root response has HSTS, `nosniff`, strict-origin referrer policy,
  restrictive permissions policy, and a header-delivered self-restricted CSP
  with `frame-ancestors 'none'`. The hashed JS uses
  `Cache-Control: public, max-age=31536000, immutable`; the service worker is
  `no-cache`.
- Eleven representative live files match the locally built candidate bytes,
  including root/demo/legal/404 HTML, worker, manifest, JS, CSS, artwork, and
  route-focus script.

Evidence screenshots and route reports are in
`.factory/verification-17-artifacts/`.

## Handoff

Do not release this candidate as the specified freemium product until the paid
checkout finding is resolved and independently reverified. The free planner is
otherwise buildable and ready to run with `npm ci && npm test && npm run build`.

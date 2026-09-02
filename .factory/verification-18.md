# Independent product verification 18 — PASS

- Work order: `exam-bridge-verify-18`
- Candidate commit: `2146cc6f935002773445d9323cfc6d6f79f3d42c`
- Live URL: <https://exam-bridge.sociobot.in/>
- Verified: 2 September 2026 UTC
- Product: static-web planner / PWA

## Decision

**PASS.** The live deployment matches the clean production build from the exact
candidate. The free, local-first planner completes the brief's smallest useful
job: it turns a pasted outline into an editable prerequisite-aware route, stores
question references, persists locally, exports and restores data, and works
offline. There are no critical, high, medium, or low release defects.

The researched brief names a freemium template tier, but the only permitted
product checkout currently returns HTTP 404. The candidate handles that external
constraint honestly: it offers no price or purchase action, says the paid tier is
not yet available, keeps all core planning/export features free, and retains
product-scoped restore for existing licenses. This is the contract's documented
closest useful version when the external dependency is unavailable, not a
broken or misleading checkout.

No product source code or external resource was changed during verification.

## Mandatory first checks

### Claims gate — PASS (19/19)

The checkout began clean at the exact candidate commit. After `npm ci`, I ran
each exact `test` command in `.factory/claims.json` separately. All passed from
their clean production-preview/demo setup:

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
| `existing-license-access` | PASS |
| `existing-license-revocation` | PASS |
| `paid-tier-unavailable` | PASS |
| `accessible-responsive` | PASS |
| `topic-cap` | PASS |

The contracts check also proves every registered claim has exactly one tagged
test and rejects unregistered checkout code or contradictory paid-tier copy.

### Cold first-read — PASS

In a fresh browser context, the unscrolled live page says:

- What it does: **Turn a syllabus into a study route.**
- Who it is for: **returning exam candidates** who need prerequisites and their
  own question references connected to syllabus topics.
- What to click first: **Try it with sample data**.

Adjacent text says the click opens six realistic topics without changing the
current plan. At 390 × 844, that action ends at y=559 and all three facts end at
y=834. One click opens `/demo` with six topics, its persistent “Demo — sample
data, nothing is saved” banner, Reset demo, and Start for real. The viewport is
390 px wide with no horizontal overflow. Evidence:
`verification-18-evidence/live-first-read-mobile-390.png` and
`live-demo-mobile-390.png`.

## Clean local gates — PASS

- `npm ci` — PASS; 141 packages installed, 0 vulnerabilities reported.
- Every exact claim command — PASS, 19/19.
- `npm test` — PASS: ESLint, TypeScript/build, contract checks, 9 unit tests,
  clean-start claim verification, and 74 browser cases; 73 passed and one
  duplicate mobile service-worker case was intentionally skipped.
- `npm run lint` — PASS.
- `npx tsc --noEmit` — PASS.
- `npm run test:unit` — PASS, 9/9.
- `npm audit --omit=dev --audit-level=high` — PASS, 0 vulnerabilities.
- `npm run build` — PASS; `dist/` contains both app entries and the complete
  static/PWA output.

## Independent product exercise — PASS

On the live production site in a fresh real-plan context:

1. A one-topic outline was rejected with “Add at least two distinct topic lines
   so there is a route to build.”
2. An `ftp:` official-source URL was rejected and focused recovery on a complete
   HTTP(S) URL.
3. A numbered/bulleted outline with a case-insensitive duplicate produced the
   expected two-topic route.
4. An `ftp:` practice link was rejected; the same reference with an HTTPS URL
   attached successfully.
5. CSV export included the route header and labelled URL. JSON backup contained
   the named plan and both topics.
6. Reload preserved the plan and reference. A new unknown route returned the
   designed HTTP 404 and kept the saved local-storage bytes unchanged.

The claim suite additionally exercises the 2–80-topic boundary, refuses topic
81, keeps all 80 topics through backup and reload, restores JSON, resets the demo,
orders lower-confidence topics first, and covers valid/revoked license results.

## Privacy and server boundary — PASS

- The complete normal planning/export/reload/404 journey issued 23 requests,
  all same-origin GETs. It made no POST, tracker, analytics, font-CDN, content
  service, checkout, or other third-party request. There were no normal-page
  console or page errors.
- Demo mode created only `demo:exam-bridge:plan:v1`; it did not create or read
  the real plan key. Its full online/offline journey was same-origin only.
- A license is sent cross-origin only after the explicit Verify license action,
  as the Privacy page states. The product-scoped verifier allowed 30 sequential
  invalid checks from one client. Request 31 returned HTTP 429 with
  `Retry-After: 4`, `X-RateLimit-After: 4`, and the correct CORS origin.
- The product has no sign-in, so Entra tenant verification is not applicable.
- The permitted checkout endpoint was checked read-only and remains HTTP 404:
  `{"error":"enabled factory product","status":404}`. The live product makes
  no availability, price, or purchase claim and exposes no checkout control.

## Accessibility and responsive behavior — PASS

- The factory `verify-url.sh` passed `/`, `/demo`, `/privacy/`, and `/terms/`:
  expected route title, `lang=en`, exactly one H1, a main landmark, complete alt
  text, labelled buttons, and no console/page errors.
- Fresh live axe WCAG A/AA scans found zero serious or critical findings on the
  real planner in both light and dark themes and on the reduced-motion 390 px
  demo.
- Keyboard-only smoke test: first Tab visibly exposes **Skip to planner** with a
  3 px solid focus outline; Enter focuses `main`; the next Tab reaches the sample
  action; Enter opens `/demo`, focuses its heading, and announces the loaded
  route. Space toggles a practice checkbox and retains focus.
- Reduced motion reports `0.00001s` animation/transition duration. The full suite
  also verifies all visible interactive targets are at least 44 × 44 CSS px and
  that light/dark states retain accessibility.
- Desktop and 390 px screenshots were inspected. Content is legible, controls
  are not clipped, and there is no horizontal overflow.

## PWA, deployment identity, headers, and links — PASS

- A fresh live service worker controls `/demo`; its only cache is
  `exam-bridge-94e3a5e7af51344eaf5d`. `registration.update()` leaves the current
  worker active with no waiting worker. The six-topic route then reloads offline.
- The isolated service-worker replacement claim also passed locally, proving an
  older worker is replaced and the replacement can reload offline.
- Eleven representative live responses match fresh `dist/` files byte-for-byte:
  root, demo, Privacy, Terms, 404, service worker, JS, CSS, hero illustration,
  route-focus script, and manifest.
- Every discovered same-origin link across the four routes returns HTTP 200;
  the two remaining links are explicit `mailto:` contacts. Unknown paths return
  the product-owned page with HTTP 404.
- Root HTML uses `max-age=30, must-revalidate`; the hashed JS uses
  `max-age=31536000, immutable`; `/sw.js` uses `no-cache`.
- Headers include HSTS, `nosniff`, strict-origin referrer policy, restrictive
  permissions policy, and a header-delivered CSP with `frame-ancestors 'none'`.

## Performance — PASS

Fresh live mobile Lighthouse:

| Metric | Result |
| --- | ---: |
| Performance | 94 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| FCP | 1.0 s |
| LCP | 1.3 s |
| TBT | 300 ms |
| CLS | 0 |
| Total transferred | 38 KiB |

A separately observed live click interaction was 24 ms. Production assets are
29,307 B JavaScript (10,278 B gzip), 18,286 B CSS (4,793 B gzip), a 19,704 B
hero, and no runtime font. These are below the static-product budgets.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

Known external limitation, not a release defect: new paid-template purchases are
unavailable until an authorized billing operator registers the product-scoped
checkout. The current candidate states and tests that boundary consistently.

## Evidence

Fresh screenshots, factory URL reports, and the Lighthouse JSON are under
`.factory/verification-18-evidence/`. Terminal evidence also recorded all 19
individual claim results, the complete test suite, byte hashes, response headers,
link crawl, privacy request log, and the 30-request rate-limit allowance.

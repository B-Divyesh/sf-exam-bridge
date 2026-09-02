# Exam Bridge repair 16 handoff

- Work order: `exam-bridge-repair-16`
- Verifier report commit: `8249b218ab8109fa73ce408c271626485f1a11a1`
- Repaired candidate: `97013ae4793a1f8dcbb914d31b47ebeee5e29af2`
- Repair commit: `806b5174609b552fd6c27d556ee55a1aeed6d4b4`
- Product version: `1.0.9`
- Live URL: <https://exam-bridge.sociobot.in/>
- Deployment ID: `2d3ef0fd-98a0-4b75-b10c-6b71fdf76a0d`
- Date: 2 September 2026 UTC

## Result

The controller-required unavailable-checkout boundary is repaired and deployed.
The product-scoped checkout was tested before any code change and returned the
reported HTTP 404:

```text
GET https://api.sociobot.in/api/v1/products/exam-bridge/checkout
HTTP 404
{"error":"enabled factory product","status":404}
```

The current build now says **Paid tier not yet available. No purchase or checkout
is offered.** It contains no checkout URL, checkout build flag, price, purchase
action, or current merchant terms. The app, Privacy, Terms, README, copy audit,
and claims manifest use the same boundary. A future build cannot expose the dead
route by setting the former environment flag because that code path was removed.

The free planner remains complete. People can build, autosave, edit, back up,
restore, and export plans without an account or payment. All three templates
remain previewable in the isolated demo. Existing-license verification remains
as backwards-compatible access and still handles caching, offline use, invalid
tokens, revocation, returned tokens, and rate limits.

No shared Sociobot application, database, key vault, storage, staging slot, or
other product resource was read or changed. Deployment used only the existing
`sf-exam-bridge` production Static Web App and `exam-bridge.sociobot.in` record.

## Regression coverage

The claim formerly named `checkout-registration-gate` is now
`paid-tier-unavailable`. Its exact Playwright test asserts:

- the paid tier is plainly marked not yet available;
- the former ₹499 and current purchase terms are absent;
- no checkout link, form, or network request exists;
- demo previews and existing-license restore remain available.

The contract test also rejects any checkout URL, `VITE_CHECKOUT_ENABLED`, or
checkout-enabling variable in the application source. Existing-license claims
were reworded to describe verified compatibility without implying a current
sale. Revocation coverage continues under `existing-license-revocation`.

## Local verification

- `npm ci` — PASS; 141 packages installed, 0 vulnerabilities reported.
- Every exact command in `.factory/claims.json` — PASS, 19/19 independently.
- `npm test` — PASS: ESLint, TypeScript/build, contracts, 9 unit tests,
  clean-start claim check, and 74 browser cases; 73 passed and one duplicate
  mobile service-worker case was intentionally skipped.
- `npm run lint` — PASS.
- `npx tsc --noEmit` — PASS.
- `npm run build` — PASS; `dist/index.html` exists.
- `npm audit --omit=dev --audit-level=high` — PASS; 0 vulnerabilities.
- Production sizes — JavaScript 29,307 bytes raw / 10,278 gzip; CSS 18,286
  bytes raw / 4,793 gzip; main illustration 19,704 bytes; no runtime font.
- Factory URL verification — PASS on `/`, `/demo`, `/privacy/`, and `/terms/`.
  Each route has its expected title, `lang=en`, one H1, a main landmark,
  complete image alternatives, labelled buttons, and zero console errors.
- Playwright axe WCAG A/AA — zero serious or critical findings on light and dark
  treatments at desktop and 390 px. Keyboard, 44 px targets, 200% layout,
  reduced motion, and focus behavior pass the browser suite.
- Local mobile Lighthouse — 100 performance, 100 accessibility, 100 best
  practices, 100 SEO; FCP 1.0 s, LCP 1.4 s, TBT 40 ms, CLS 0.
- Package/consumer testing — not applicable to this static-web product.

Local evidence is under `.factory/repair-16-artifacts/`, including the original
404 response, route reports, desktop/mobile screenshots, and Lighthouse JSON.

## Deployment and live verification

Commit `806b5174609b552fd6c27d556ee55a1aeed6d4b4` was pushed to `main` before
deployment. The tested `dist/` was uploaded to the existing `sf-exam-bridge`
production environment. Azure reported the deployment successful and the custom
domain Ready.

- The new JavaScript and CSS bundle names appeared on the first live check.
- Nine representative live files match local `dist/` byte-for-byte: root,
  demo, Privacy, Terms, 404, service worker, JavaScript, CSS, and illustration.
- `/`, `/demo`, `/privacy/`, and `/terms/` pass the factory URL check with no
  console or page errors. All 17 discovered links resolve or are valid mail links.
- A fresh unknown route returns the designed product page with HTTP 404.
- Live response policy includes HSTS, `nosniff`, strict-origin referrer policy,
  restrictive permissions policy, and header-delivered CSP with
  `frame-ancestors 'none'`. Hashed assets are immutable; `/sw.js` is `no-cache`.
- A fresh 390 × 844 browser showed the exact paid-tier boundary, no checkout
  control, no purchase terms, no horizontal overflow, and no third-party request.
- Keyboard Tab focused **Skip to planner** first; Enter moved focus to `main`.
- Live axe scans of the dark landing and populated demo found zero serious or
  critical findings.
- The demo loaded six topics from only `demo:exam-bridge:plan:v1`, then reloaded
  offline with the complete route and offline notice.
- Live mobile Lighthouse — 100 performance, 100 accessibility, 100 best
  practices, 100 SEO; FCP 0.9 s, LCP 1.1 s, TBT 20 ms, CLS 0.

Exact live evidence is in `live-browser-qa.json`, `live-identity.json`,
`live-link-crawl.json`, `live-response-policy.json`, `lighthouse-live-mobile.json`,
and the `verify-live-*` folders under `.factory/repair-16-artifacts/`.

## Known boundary and next step

The paid template tier is not yet available because the only permitted scoped
checkout returns 404. This release makes no purchase-availability promise. Do
not add a purchase action until an authorized billing operator registers the
product-scoped route and a later work order verifies the real checkout,
return-token, restore, and revocation flow. No other known release blocker
remains for the complete free planner.

# Exam Bridge repair 10 handoff

- Work order: `exam-bridge-repair-10`
- Repaired verifier report: commit `b891403606e8e7ade2251d866f0119074d9bc8dc`
- Repaired candidate: `87d67b0c7355f3679cad3caf2e33648973e70f71`
- Product repair commit: `1b19f0a`
- Live URL: <https://exam-bridge.sociobot.in/>
- Deployed: 1 September 2026 UTC

## Result

The two release blockers are repaired. The researched brief again says
`freemium`. The free planner, CSV, and JSON backup remain available without an
account or payment. Three reusable templates now have the original one-time
₹499 license boundary and can be tried inside the isolated demo.

The service-worker renewal promise is registered as
`@claim:service-worker-renewal`. Its dedicated browser context installs the exact
legacy worker, changes to the current distribution, activates the new worker,
removes the old cache, and reloads the current shell offline.

## Paid-template boundary

The Sociobot checkout was reproduced before the repair:

```text
GET https://api.sociobot.in/api/v1/products/exam-bridge/checkout
HTTP 404
{"error":"enabled factory product","status":404}
```

Shared checkout registration is outside this repository’s authority. The safe
default build therefore shows the exact ₹499 price, three included templates,
the demo previews, and the license-restore form. It also says new purchases are
not open. It exposes no dead buy link or checkout request.

`VITE_CHECKOUT_ENABLED=true` is the operator switch. A separate enabled build
showed exactly one hosted link at
`https://pilot-api.sociobot.in/api/v1/products/exam-bridge/checkout` locally.
Production hostname selection points to `https://api.sociobot.in`. The switch
must be set only after the billing operator confirms product registration, price,
return URL, and checkout redirect.

License return, paste-to-restore, URL stripping, optimistic cached access, daily
verification, invalid-license locking, request failures, and `429 Retry-After`
copy have browser coverage. License tokens use `sb_license:exam-bridge` and are
sent only to the product-scoped Sociobot verification endpoint.

## Regression coverage

`.factory/claims.json` contains 17 unique claims and exactly one tagged browser
test for each. New coverage includes:

- `@claim:paid-template-license`
- `@claim:checkout-registration-gate`
- `@claim:service-worker-renewal`
- returned-license storage and URL stripping
- invalid licenses and `429 Retry-After`
- default and operator-enabled checkout presentation

The copy audit checked 461 rendered and README text units. No sentence exceeds
22 words and no banned marketing word appears.

## Verification evidence

Clean and complete local checks:

```sh
npm ci
npm test
npm run build
npm audit --omit=dev --audit-level=high
```

- `npm ci`: 141 packages; 0 vulnerabilities.
- `npm test`: lint and TypeScript passed; 9 unit tests passed; clean-start claim
  passed; 65 desktop/mobile browser tests passed; one duplicate mobile
  service-worker case was intentionally skipped.
- Every exact command in `.factory/claims.json`: 17 of 17 passed independently.
- Production output: JavaScript 28,198 bytes raw / 10,043 gzip; CSS 17,433 raw /
  4,669 gzip; hero WebP 19,704 bytes.
- Local mobile Lighthouse: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 1.0s, LCP 1.4s, TBT 40ms, CLS 0.
- Live mobile Lighthouse: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 0.9s, LCP 1.1s, TBT 40ms, CLS 0; no run warning.
- Local and live Chromium at 390 × 844: no horizontal overflow, console error,
  page error, serious/critical axe result, or target below 44px.
- Keyboard skip links focus `main`; dark/light themes and reduced motion pass.
- A dedicated live context loaded six demo topics after an offline reload.
- Root, Demo, Privacy, Terms, and 404 passed `/opt/fleet/lib/verify-url.sh`.
- An unknown live route returns the designed product page with HTTP 404.
- Ordinary root/demo/legal traffic made no cross-origin request.
- A live invalid-token check received HTTP 200 from the product-scoped Sociobot
  verifier, kept templates locked, and displayed the repair message.
- Security headers include CSP, HSTS, nosniff, referrer policy, and permissions
  policy. Root is short-cached, hashed assets are immutable for one year, and
  `sw.js` is `no-cache`.

Evidence is in `.factory/repair-10-artifacts/`.

## Deployment identity

Deployment `aed7dcde-1826-4f1b-84bc-4fc790306509` succeeded on the existing
`sf-exam-bridge` Static Web App. DNS and TLS for the scoped product domain were
ready. No other product resource was read or changed.

Local and live SHA-256 values match:

| Output | SHA-256 |
| --- | --- |
| `/` | `16acb46b4fdf6a84a446411dc4bbbcd96044f06c6bd6c4f9894111d3e7ce5b3f` |
| `/demo/` | `5eeb0484cc5b506c72787534d8319fec52aa4e8a77b17cbc5031296b403ecabe` |
| `/privacy/` | `f33a828f04ec45e52f6cf206c189970791e06d7470005e7e2b25f130a7822238` |
| `/terms/` | `80e566f5b271d0704ccf1ce855279468fce9d2abb1d0a64ace437ac736bfcc54` |
| `/404.html` | `54477add15d6b166a83e681aa1c331bcd020a7ef2d4fc05a3d04dcc1991426f7` |
| `/sw.js` | `222a4c4a5419f2a56bea743f4a9d954d34711aec54a4e214655ec1b02951abd9` |
| JavaScript | `7b68a7a3c7c42502013c37b1af88a403078adc51cdbc6875506dcba3feb2514b` |
| CSS | `82299484e4a22dabf76f68e75c948f07859111a486ff5404b0ca4e389320a03b` |

## Known external step

New purchases remain intentionally unavailable until the shared Sociobot
billing operator registers `exam-bridge`. After registration, verify the ₹499
one-time product and production return URL, then deploy with
`VITE_CHECKOUT_ENABLED=true`. No product-code workaround should bypass that
operator gate.

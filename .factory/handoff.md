# Exam Bridge repair 12 handoff

- Work order: `exam-bridge-repair-12`
- Independent report: `856aab88fa52af3910d9efa5c0abda4ed9f8800a`
- Failed candidate: `5a00b5a4f22ce0b0878f63365a98b0eb6f5024be`
- Repair implementation: `ce518fd1ee6f19f4aff2c5785ebf73c6eaa13d23`
- Product: static Vite + TypeScript PWA
- Production URL: <https://exam-bridge.sociobot.in/>
- Verified: 1 September 2026 UTC

## Outcome

The release-blocking `@claim:free-access` race is repaired. Leaving the demo now
has an explicit application-ready boundary: the shell begins with `aria-busy=true`
and publishes its `real` or `demo` mode only after the correct DOM and event
handlers are installed. The claim waits for the full navigation and that state,
checks the exact two input values, and asserts the two persisted topic titles
before checking the two rendered cards. It does not use retries or reduce the
normal two-worker concurrency.

The free planner still exports CSV and JSON without an account or payment. New
purchases remain honestly closed because the product checkout is not registered.
The ₹499 price, three demo previews, and existing-license restore path remain
visible. No checkout link or checkout request is emitted while the gate is closed.

## Reproduction and regression evidence

The verifier's first clean `npm test` at the failed candidate reproduced the
problem at `tests/claims.spec.ts:242`: after the two-topic submission it observed
zero `.topic` cards. Its immediate retry passed. Before editing, this worker ran
the same clean gate once and repeated the exact claim 80 times with two workers;
all local attempts passed, confirming that the reported failure was intermittent
rather than deterministic.

After the repair:

- The exact `@claim:free-access` command passed in isolation.
- The repository `npm test` passed: lint, TypeScript, production build, 19-claim
  contract, 9 unit tests, clean-start claim test, and the two-worker Playwright
  suite. Browser result: 69 passed and the intentionally duplicated mobile
  service-worker case skipped.
- Two consecutive clean clones of `ce518fd` each ran `npm ci` and then the full
  `npm test`; both completed with the same 69 passed / 1 skipped browser result.
- Both clean installs added 141 locked packages and reported zero vulnerabilities.
- `npm audit --omit=dev --audit-level=high`: zero vulnerabilities.
- The complete browser suite covers desktop and Pixel 5/mobile behavior, keyboard
  focus, reduced motion, light/dark axe scans, 44-pixel targets, 390 px overflow,
  local-only planning, offline reload, service-worker replacement, and all 19
  registered claim outcomes.
- Package/consumer testing is not applicable to this static-web artifact.

## Local browser and performance evidence

`verify-url.sh` passed `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html` at
desktop and 390 px. Every route has its correct title, `lang=en`, one `h1`, a
`main`, labelled buttons and images, and zero console/page errors. Screenshots and
JSON reports are under `.factory/repair-12-artifacts/`.

Local mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100,
SEO 100; FCP 0.9 s, LCP 1.5 s, TBT 20 ms, CLS 0. Production output is 28.35 kB
JavaScript (10.13 kB gzip), 17.43 kB CSS (4.65 kB gzip), and a 19.70 kB hero.

## Deployment and live verification

`/opt/fleet/lib/deploy-static.sh exam-bridge dist` deployed the exact build to the
existing `sf-exam-bridge` Static Web App in `eastus2`. Deployment
`31700be7-beaf-46a9-882b-4c0c1090673c` succeeded; the custom domain is Ready and
serves managed HTTPS.

- Root, demo, Privacy, Terms, 404, service worker, JavaScript, CSS, and hero
  SHA-256 values match the local `dist/` byte for byte. Exact values are in
  `.factory/repair-12-artifacts/live-identity.txt`.
- Live `verify-url.sh` checks pass for every public route with zero console errors.
- A new unknown URL returns HTTP 404 and the designed page with footer `v1.0.5`.
- Root HTML uses 30-second revalidation and returned 304 to `If-None-Match`.
  Hashed assets use one-year immutable caching; `sw.js` uses `no-cache`.
- Live headers include HSTS, `nosniff`, strict-origin referrer policy, permissions
  policy, and response-header CSP with `frame-ancestors 'none'`.
- A fresh live 390 px reduced-motion run went demo → real planner → exact two-topic
  save. It rendered two cards, stored both titles, had zero horizontal overflow,
  made no cross-origin request, and exposed no checkout link.
- Live mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 20 ms, CLS 0, with no run warnings.

## Known external gate

The public product-scoped checkout still returns HTTP 404. This is the expected
operator gate, not a product regression. An authorized billing operator must
register the `exam-bridge` ₹499 one-time product and its return URL before a future
build sets `VITE_CHECKOUT_ENABLED=true`. No shared infrastructure, application
settings, secrets, or other product resources were read or changed.

---

# Exam Bridge verification 13 handoff

- Candidate: `5a00b5a4f22ce0b0878f63365a98b0eb6f5024be`
- URL: <https://exam-bridge.sociobot.in/>
- Result: **FAIL**
- Full evidence: `.factory/verification-13.md`

All 19 claim commands passed independently from the clean checkout. The build,
live planner and demo behavior, privacy request log, offline reload,
accessibility, mobile behavior, headers, cache policy, and candidate/live hashes
also passed.

The candidate is not releasable because the first normal full `npm test` run
failed the registered `@claim:free-access` browser test after mapping a valid
two-topic syllabus: it never rendered the expected topic cards within five
seconds. The immediate repeat passed, so this is intermittent, but the required
quality gate is not reliable. Reproduce under normal two-worker Playwright,
remove the race, and show repeatable `npm test` passes before release.

Observed license-verify allowance: 30 requests in the active window; request 31
returned 429 with `Retry-After: 3`. The server does not expose that header to
browser JavaScript, so the UI uses its existing safe fallback wording. This
external integration limitation is documented in the verification report.

---

# Prior repair 11 handoff

- Work order: `exam-bridge-repair-11`
- Independent report: `e71336709e4f246ee203fb1df50c21352a93c79d`
- Repaired candidate: `1820610592249b22179664b557936f05e523730b`
- Product: static Vite + TypeScript PWA
- Production URL: <https://exam-bridge.sociobot.in/>
- Verified: 1 September 2026 UTC

## Outcome

The product-owned findings from verification 12 are repaired. The two visitor
promises now have manifest entries and isolated outcome tests. The 404 footer
shows package version `1.0.4`, and a contract test requires the footer to match
`package.json`.

New purchases remain honestly unavailable. The required first reproduction
returned HTTP 404 from the product-scoped Sociobot checkout with
`{"error":"enabled factory product","status":404}`. The production build
therefore keeps the explicit operator gate closed: it renders no checkout link,
makes no checkout request, and continues to show the ₹499 price, three sample
previews, and license restore form. No shared Sociobot infrastructure, setting,
or secret was inspected or changed; only the public product checkout response
was reproduced.

## Repairs

1. Registered `not-found-plan-safety` in `.factory/claims.json`. Its one tagged
   browser test creates a real two-topic plan, records the exact stored bytes,
   opens the 404 page, returns to the planner, and checks both storage and the
   rendered plan.
2. Registered `refund-revokes-license`. Its one tagged browser test begins with
   cached paid access, supplies a controlled Sociobot `revoked` verdict on the
   user's next check, and confirms that all paid template controls close and the
   inactive-license notice appears.
3. Changed the paid and Terms copy to the precise tested outcome: a refund makes
   the license inactive after the next check.
4. Updated the 404 footer to `v1.0.4`. The contract suite derives the expected
   value from `package.json`, preventing another stale hard-coded version from
   passing.
5. Preserved the free planner, sample sandbox, local storage, CSV and JSON
   exports, templates preview, accessibility, privacy, service worker, and all
   previously passing behavior.

## Verification evidence

- `npm ci`: 141 packages installed; 0 vulnerabilities.
- Every one of the 19 `.factory/claims.json` commands: PASS independently.
- `npm test`: PASS — lint; TypeScript and production build; contracts; 9 unit
  tests; clean claim-start check; 69 desktop/mobile browser tests passed and one
  intentional duplicate mobile service-worker case skipped.
- `npm run build`: PASS; `dist/` contains the production site.
- `npm audit --omit=dev --audit-level=high`: 0 vulnerabilities.
- Package/consumer testing is not applicable to this static-web artifact; the
  exact deployable `dist/` output is covered by build, browser, and hash checks.
- Exact new claim commands: both PASS with one test each.
- Checkout-gate claim: PASS; exact price, unavailable status, previews, restore
  form, and absence of checkout links and requests were asserted.
- Offline/update: the dedicated offline reload and legacy service-worker
  replacement claims both PASS in isolated browser contexts.
- Accessibility and privacy: Playwright axe integration reports no serious or
  critical findings in light or dark treatment; keyboard, reduced motion,
  44-pixel targets, 390 px layout, and same-origin ordinary-use requests pass.
- Local URL checks on root, demo, Privacy, Terms, and 404: no console errors;
  title, `lang`, one `h1`, main landmark, image alternatives, and control names
  pass at desktop and 390 px. Screenshots and JSON reports are under
  `.factory/repair-11-artifacts/`.
- Local mobile Lighthouse: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 0.9 s, LCP 1.5 s, TBT 20 ms, CLS 0.
- Production payload: 28.21 kB JavaScript (10.08 kB gzip), 17.43 kB CSS
  (4.65 kB gzip), no runtime fonts, and 19.70 kB main illustration.
- Checkout reproduction: `.factory/repair-11-artifacts/billing-checkout-headers.txt`
  and `.factory/repair-11-artifacts/billing-checkout-body.json`.

## Deployment and response policy

The exact `dist/` build is deployed with the work order's static deployment
configuration:

```sh
/opt/fleet/lib/deploy-static.sh exam-bridge dist
```

`public/staticwebapp.config.json` remains part of the artifact. It defines the
real 404 response, route rewrites, restrictive CSP, HSTS, permissions policy,
referrer policy, MIME sniffing protection, and cache policies.

- Deployment `77fc0600-0a5a-4188-9bf9-0c0d9f92115a` succeeded on the existing
  `sf-exam-bridge` Static Web App in `eastus2`; the custom domain reported Ready
  and returned HTTP 200 over managed TLS.
- Root, `/demo`, `/privacy/`, `/terms/`, `/404.html`, `/sw.js`, JavaScript, and
  CSS have exact local/live SHA-256 matches. The values are recorded in
  `.factory/repair-11-artifacts/live-identity.txt`.
- A new unknown URL returns HTTP 404 with the designed page, unchanged-plan
  promise, and footer `v1.0.4`. Root returns HTTP 200; all tested public routes
  return the expected status.
- Live headers include header-delivered `frame-ancestors 'none'`, HSTS,
  `nosniff`, strict referrer and permissions policies. HTML uses
  `public, must-revalidate, max-age=30`, hashed assets use one-year immutable
  caching, the service worker uses `no-cache`, and root conditionals return 304.
- Live outcome smoke tests pass: a real plan's exact bytes survive an HTTP 404
  visit, and a controlled `revoked` verdict changes three paid controls to zero
  while restoring three demo preview links.
- Live URL checks on every route report no console errors at desktop or 390 px.
  The root has no horizontal overflow, checkout link, or third-party request.
- Live mobile Lighthouse: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 1.0 s, LCP 1.2 s, TBT 20 ms, CLS 0, with no run warnings.

## Known external gate and next step

The shared Sociobot checkout registration is still absent. This is an operator
action outside this product work order. An authorized billing operator must
register the `exam-bridge` ₹499 one-time product and production return URL,
confirm the live purchase and refund flow, and only then release a build with
`VITE_CHECKOUT_ENABLED=true`. Until then, free use, demo previews, and restoring
an existing license remain available.

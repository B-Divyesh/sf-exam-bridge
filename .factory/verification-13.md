# Exam Bridge verification 13

- Candidate commit: `5a00b5a4f22ce0b0878f63365a98b0eb6f5024be`
- Live URL: <https://exam-bridge.sociobot.in/>
- Verified: 1 September 2026 UTC
- Result: **FAIL**

## Release blocker — flaky required claim test

The first clean `npm test` run failed the registered desktop
`@claim:free-access` test at `tests/claims.spec.ts:242`. It filled two topics,
clicked **Map my syllabus**, then timed out after five seconds: expected two
`.topic` cards, received zero. The retained trace is in
`test-results/claims--claim-free-access--c4fdd-nt-card-checkout-or-payment-desktop/`.

The immediate second `npm test` run passed. The exact isolated
`@claim:free-access` command also passed, as did every other manifest command.
That makes the failure intermittent, but it remains release-blocking: a
registered claim and the repository's normal quality command must pass reliably.

## Claims and local checks

`.factory/claims.json` exists with 19 claims. After `npm ci`, I ran every listed
command independently through the local production-preview demo entry point.
All 19 passed: demo sandbox, 404 plan safety, local privacy, offline reload,
service-worker renewal, CSV, JSON backup/restore, syllabus route, templates,
template/content/independence boundaries, illustration provenance, free access,
license/refund/checkout behavior, responsive accessibility, and the 80-topic
cap.

- `npm ci`: pass; 141 packages installed.
- First `npm test`: **failed** only as above; lint, build, contracts, 9 Vitest
  tests, and clean-claim-start passed first.
- Second `npm test`: pass; 69 tests passed and one intentional duplicate mobile
  service-worker case skipped.
- `npm run build`: pass; `dist/` produced.
- `npm audit --omit=dev --audit-level=high`: 0 vulnerabilities.
- Output: JS 28.21 kB (10.08 kB gzip), CSS 17.43 kB (4.65 kB gzip), hero WebP
  19.70 kB.

## Cold read and live end-to-end

Fresh desktop load returned 200 and the title **“Exam Bridge — turn a syllabus
into a study route.”** The first screen plainly says this turns a syllabus into
a study route for returning exam candidates and places **Try it with sample
data** in the first viewport. Its adjacent text says it opens six realistic
topics without changing the current plan. It passes the first-read and one-click
demo requirements.

Live `/demo` showed the persistent demo banner, six topics, demo-only storage,
and successful reset. I exercised a real plan: one topic was rejected, an
`ftp:` syllabus source was rejected, a two-topic HTTPS plan succeeded, an
invalid practice URL was rejected with its inline recovery text, a valid
reference attached, and CSV/JSON downloads succeeded. Offline reload worked
after service-worker control, retaining all six demo topics.

Normal landing/planner/demo flows requested only same-origin HTML, JS, CSS,
route-focus script, and self-hosted art; no tracking or third-party request was
observed. Root, demo, privacy, terms, and 404 had route-specific titles,
`lang=en`, one `h1`, one `main`, and valid image alternatives. Normal routes had
no console/page errors. The expected unknown-route document logs Chrome's
standard failed-resource message because it deliberately returns HTTP 404.

Exact live/local SHA-256 values matched for root, demo, privacy, terms, 404,
service worker, JS, CSS, and hero WebP. HTML uses 30-second revalidation,
hashed assets one-year immutable caching, and `sw.js` no-cache. Headers include
HSTS, nosniff, strict-origin referrer policy, permissions policy, and a
response-header CSP with `frame-ancestors 'none'`.

## Accessibility, mobile, and performance

At 390 x 844 reduced motion, demo had six topics and no horizontal overflow
(`clientWidth` = `scrollWidth` = 390); the reset target was 172 x 44 px and
animation duration was effectively zero. Keyboard Tab reached the skip link,
Enter moved focus to `main`, and the focus ring was a visible 3 px blue outline.
Live axe scans in light and dark themes found zero serious/critical violations.

Mobile Lighthouse: Performance 99, Accessibility 100, Best Practices 100, SEO
100; FCP 1.1 s, LCP 1.2 s, TBT 110 ms, CLS 0. Lighthouse issued an
environment-level target-crash warning while capturing its final screenshot after
the scores were computed; independent browser checks did not reproduce runtime
errors.

## License endpoint allowance

The public product license verification endpoint is protected: with a
cookie-preserving single client, requests 1–30 returned 200 and request 31
returned 429 with `Retry-After: 3` and `X-RateLimit-After: 3` (observed
allowance: 30 per active window). Browser-origin requests are permitted.

Minor external integration observation: the 429 response does not expose
`Retry-After` through CORS. Browser JavaScript receives 429 but reads `null` for
that header, so this product's existing safe fallback says “a minute” rather
than the server's three seconds. Enforcement itself works; this is not the FAIL
cause and is outside this static repository.

## Next step

Find and remove the full-suite `@claim:free-access` race, then demonstrate
repeatable normal two-worker `npm test` passes before release.

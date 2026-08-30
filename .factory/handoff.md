# Exam Bridge repair 8 handoff — local PASS

- Work order: `exam-bridge-repair-8`
- Base verifier report: `.factory/verification-7.md` at `30c480660fe2535c939d8a3b74d7fd3099d2aca0`
- Repaired implementation: `03607b0570d59df57379dacfc4d5107e1c08b611`
- Artifact: static web / PWA, Vite + TypeScript, output `dist/`
- Verified: 2026-08-30 UTC

## Release decision

**PASS locally.** This repair closes the verifier’s release-blocking claims
failure and the controller’s metadata, plain-language, and paid-template-scope
findings. The free local-first planner, isolated demo, offline shell, exports,
and all previously passing behavior remain intact. Deployment is initiated by
pushing `main` to the factory-connected repository.

## Repairs

1. **Registered and proved the 24-hour license-cache promise.**
   `.factory/claims.json` now contains `license-cache-24h`. The application has
   one named `86_400_000` ms cache boundary. Its exact browser claim test starts
   from the demo, mocks a successful returned license, sees one verification,
   sees no second automatic request after reload or at 86,399,000 ms, then sees
   the second request after 86,400,001 ms.
2. **Made demo metadata correct before JavaScript.** `demo/index.html` is a
   Vite entry with Demo title, canonical URL, Open Graph, and Twitter metadata.
   Static Web Apps rewrites `/demo` to that document. Runtime metadata also stays
   correct after application rendering. A browser response test and contracts
   cover both the emitted document and the production routing rule.
3. **Simplified and audited legal copy.** The cache language is short and exact.
   Terms plainly says templates are free and hosted checkout is unavailable. The
   copy audit now includes legal routes; a contract rejects every legal sentence
   longer than 22 words.
4. **Stated paid-template scope honestly.** All starter templates are free
   today. There is no checkout action, price, account, or card form. Existing
   license verification remains available for past holders but does not gate free
   templates. No checkout behavior was invented while the shared endpoint is
   environment-gated. The `account-free-planning` claim test now proves this.
5. **Added a clean lint gate and preserved update coverage.** `npm test` now
   runs ESLint. The service-worker upgrade harness accepts Vite’s current hashed
   app-bundle name after the metadata entry added a second HTML input.

## Verification evidence

All commands ran in `/work/repo` after a clean `npm ci` (141 packages, 0
reported vulnerabilities):

| Check | Result |
| --- | --- |
| `npm run lint` | PASS |
| `npx tsc --noEmit` | PASS |
| `npm run test:contracts` | PASS — 12 registered claims, demo metadata/routing, legal-copy ceiling, response-policy contract |
| `npm run test:unit` | PASS — 9 Vitest unit tests |
| Every exact `.factory/claims.json` command | PASS — 12/12, including the 24-hour request-count boundary |
| `npm test` | PASS — lint, production build, contracts, units, clean-start claim, 48 Playwright desktop/Pixel 5 tests, and service-worker upgrade |
| `npm run build` | PASS — `dist/index.html` and `dist/demo/index.html` produced |
| `npm run test:sw-upgrade` | PASS — exact `553f8fb9` legacy worker to current build, then offline reload |
| Factory `verify-url.sh` | PASS — root and raw demo HTML: title, lang, H1, main, image alts, named buttons, and no console errors |
| Response policy smoke | PASS — CSP, `frame-ancestors 'none'`, and only the scoped production/pilot license endpoints in `connect-src` |

Local browser evidence:

- Root: `/tmp/exam-bridge-verify-root-Pl0jnE/verify.json`
- Demo: `/tmp/exam-bridge-verify-demo-aNtBdF/verify.json`

Browser coverage includes keyboard skip-link and focus behavior, 390 px and
desktop layouts, light/dark axe scans without serious or critical findings,
reduced motion, demo isolation/reset/exit, ordinary-planning same-origin-only
requests, offline reload, and service-worker upgrade. The 24-hour cache test
uses a mocked endpoint and does not contact billing.

Production bundle measurements: JavaScript 27,125 B raw / 9,712 B gzip; CSS
17,114 B raw / 4,578 B gzip; hero WebP 19,704 B. These are within the static
product budgets.

## Scope and deployment

- This remains a static product; package/consumer installation is not applicable.
- No direct billing, checkout, Azure, or other external service was contacted.
  Planner data remains browser-local, and ordinary planning makes no cross-origin
  requests.
- The researched freemium template purchase remains deliberately deferred until
  factory product registration and the environment-gated shared checkout endpoint
  are available. This release makes that limitation visible instead of exposing a
  dead purchase path. A future paid release must register the product, publish an
  exact one-time price and included templates, add the hosted Sociobot purchase
  link, and test the returned-license flow. It must not gate exports,
  accessibility, privacy, or safety behavior.
- Push `main` to the factory-connected repository to deploy `dist/` through the
  configured Azure Static Web Apps workflow. No repository infrastructure, DNS,
  billing, or secret settings were changed.

## Run locally

```sh
npm ci
npm test
npm run build
npm run preview
```

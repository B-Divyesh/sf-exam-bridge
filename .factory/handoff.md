# Exam Bridge repair handoff

- Work order: `exam-bridge-repair-7`
- Base verifier report: `.factory/verification-6.md` at `8ba18451831eeb0fe70a9f7badf492ade465872e`
- Repaired candidate commit: `f904241a8d1532906679523fb99559fb7646af42`
- Artifact: static web / PWA, Vite + TypeScript, output `dist/`
- Verified: 2026-08-30 UTC

## Release decision

The two release-blocking verifier findings are repaired and covered by regression
tests. The local production artifact is buildable from a clean install and passes
the complete repository test suite. Deployment is initiated by pushing `main` to
the factory-connected product repository; the repository contains no direct
infrastructure credentials or deploy command.

## Repairs

1. **Claim commands now work from a clean clone.** Playwright's web server builds
   the production artifact before starting `vite preview` and never reuses an
   unknown existing server. `scripts/clean-claim-start.test.mjs` removes only the
   generated `dist/`, runs the exact `@claim:demo-sandbox` manifest-style command,
   and requires it to build, serve, and pass. This reproduces the prior no-`dist`
   condition without relying on a prebuilt artifact.
2. **CSV now preserves the selected study route.** The exporter emits only checked
   prerequisites, deduplicates legacy repeated selections case-insensitively, and
   serializes a practice label plus URL as `Label (URL)`. Suggestions remain UI
   hints and are not exported as selected work.
3. **The CSV claim now proves the formerly lost data.** Its demo test attaches
   `2025 · Q42` with `https://example.org/questions/42`, then requires the Control
   systems CSV row to contain that complete reference, only Basic calculus, no
   unchecked suggestion, and no duplicate prerequisite.
4. **Secondary metadata is complete.** Privacy, Terms, and the product 404 now
   include canonical, Open Graph, and full Twitter metadata. The 404 also has the
   Apple touch icon. Contract coverage checks these fields and continues to reject
   third-party runtime media, scripts, and stylesheets.

## Verification evidence

All commands were run in `/work/repo` after a clean `npm ci` (59 packages; 0
reported vulnerabilities):

| Check | Result |
| --- | --- |
| `npm run test:contracts` | PASS — 11 registered claims, demo isolation, product 404 and metadata policy |
| `npm run test:unit` | PASS — 9 Vitest tests, including selected-prerequisite and label-plus-URL CSV regression |
| Every exact `.factory/claims.json` command | PASS — 11/11, each started with no `dist/` and built its own production preview |
| `npm run test:clean-claim-start` | PASS — exact `@claim:demo-sandbox` command from no `dist/` |
| `npm test` | PASS — build, contracts, 9 units, clean-start regression, 44 Playwright desktop/Pixel 5 tests, service-worker upgrade |
| `npx tsc --noEmit` | PASS |
| `npm run build` | PASS — `dist/index.html` produced |
| Local `verify-url.sh` | PASS — root and demo, title/lang/H1/main/alts/named buttons and no console errors |
| Local route response smoke | PASS — `/`, `/demo`, `/privacy/`, `/terms/`, and `/404.html` each returned 200 |

Local verification evidence is at:

- `/tmp/exam-bridge-verify-root-hb0lhg/verify.json`
- `/tmp/exam-bridge-verify-demo-glQ1zP/verify.json`

The production bundle is 26,580 B JavaScript raw / 9,556 B gzip, 17,114 B CSS
raw / 4,576 B gzip, and 19,704 B for the hero WebP. This is within the static
product budgets.

Browser coverage includes keyboard skip-link use and focus retention, desktop and
390 px layouts, reduced motion, light/dark axe scans with no serious or critical
violations, same-origin-only ordinary planning, demo isolation/reset/exit, offline
reload, and the exact legacy-to-current service-worker cache upgrade.

## Privacy, deployment, and scope notes

- Planner data remains local-first. The repaired CSV behavior does not add any
  request or storage scope. License verification still runs only for an explicit
  token action or a cached token reconciliation.
- `public/staticwebapp.config.json` remains the response-policy source: CSP,
  header-delivered `frame-ancestors`, referrer policy, nosniff, permissions policy,
  cache rules, `/demo` rewrite, and the product-owned 404 override. Repository
  contracts validate the relevant configuration.
- No live external service or billing endpoint was contacted during this repair.
  That respects the work-order resource boundary; local production identity was
  verified from the generated artifact instead.
- Package/consumer testing is not applicable: this is a static product, not a
  published library or CLI. No lint script is configured; TypeScript checking is
  part of every production build.

## Known follow-up

The researched brief retains its `freemium` direction, but a product checkout was
previously unavailable outside this repository. The current release deliberately
keeps the planner and the existing editable templates free rather than exposing a
dead purchase path. Registering a paid template product, setting its exact price,
and enabling the hosted Sociobot checkout are factory/billing work outside this
static repository and were not attempted here. A future paid release must add the
registered checkout link, clearly state the one-time price and included template
pack, and add a mocked purchase-return regression without gating export,
accessibility, privacy, or safety features.

## Run and deploy

```sh
npm ci
npm test
npm run build
npm run preview
```

`main` is pushed to the product repository for the factory's configured static
deployment. Deploy the generated `dist/` directory; do not add infrastructure,
DNS, billing, or secret changes in this repository.

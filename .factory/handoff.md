# Exam Bridge repair handoff — ready for deployment

- Work order: `exam-bridge-repair-4`
- Repaired base: `fd0369f7f1a18742a8d990549bee45b1eec0a4c8`
- Blocking verification report: `.factory/verification-3.md`
- Artifact/deployment class: static web / Azure Static Web Apps (`dist/`)
- Verification date: 2026-08-30

## Release-blocking repairs

### 80-topic persistence boundary

The independent failure was reproduced before changing the code against the
reported candidate build:

```json
{"before":80,"after":81,"saved":81,"reloaded":0,"setup":1}
```

The same `MAX_TOPICS` constant now governs syllabus parsing, new-plan creation,
backup validation, and the Add topic action. At 80 topics, Add topic is disabled
with the visible explanation “Maximum 80 topics reached.” The event handler also
guards the mutation before prompting, so a synthetic or stale click cannot save a
topic 81.

Plans already damaged by the prior release are no longer hidden: local storage
accepts a structurally valid legacy plan up to 500 topics solely for recovery,
shows an alert explaining the 80-topic limit, disables adding, and leaves CSV and
JSON backup available. New JSON imports remain capped at 80.

Regression coverage:

- `src/planner.test.ts`: creation and strict/recovery validation share the
  boundary.
- `tests/app.spec.ts`: creates exactly 80 topics, checks Add topic is disabled,
  verifies saved JSON remains 80, exports a backup, reloads to 80 rendered
  topics, and verifies an existing 81-topic plan is recoverable instead of
  silently replaced by setup.

### PWA upgrade cache identity

`public/sw.js` is no longer a manually versioned source file. The Vite build
generates `dist/sw.js` only after the final distribution exists. Its cache name
is the first 20 SHA-256 hex characters of every emitted file (except the worker
itself, which contains the fingerprint). The verified final build generated:

```text
exam-bridge-90837fdaf6c0a0188226
```

The generated worker pre-caches its exact shell, calls `skipWaiting()` during
install, claims clients at activation, removes only prior `exam-bridge-*`
caches, and uses network-first navigation with cache fallback. Registration uses
`updateViaCache: 'none'` and requests an update on each load without surfacing
offline failures as console errors.

`scripts/sw-upgrade.test.mjs` is an exact two-build browser regression: it
archives and builds verifier candidate `553f8fb9d4f6b524d3560e12af59b38e5e790acf`,
installs its original `exam-bridge-v1` worker, switches the same origin to the
final build, calls `registration.update()`, verifies normal reload executes the
new hashed bundle and the old cache is removed, then verifies an offline reload
still executes the final bundle. Latest result:

```text
PASS: exact 553f8fb9 → final build service-worker update and offline reload (90837fdaf6c0a0188226)
```

## Verification run

Run from a clean checkout:

```sh
npm ci --ignore-scripts
npm test
npx tsc --noEmit
npm audit --omit=dev --audit-level=high
npm run build
```

Observed results:

- `npm ci --ignore-scripts`: 59 packages installed; 0 vulnerabilities.
- `npm test`: passed — 8 Vitest tests, 24 Playwright tests over Desktop Chrome
  and Pixel 5, plus the exact old-to-new service-worker upgrade/offline test.
- `npx tsc --noEmit`: passed with no diagnostics.
- `npm audit --omit=dev --audit-level=high`: 0 vulnerabilities.
- `npm run build`: passed and produced `dist/index.html` plus generated
  `dist/sw.js`.
- Production size: JavaScript 23,111 B raw / 8,487 B gzip; CSS 15,760 B raw /
  4,319 B gzip; hero WebP 19,704 B; generated worker 1,404 B raw. All remain
  below the static product budgets.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/ <evidence-dir>`: passed
  in 542 ms with zero browser errors, title set, `lang=en`, one `h1`, a `main`
  landmark, and no missing image alt text or unlabeled buttons.
- The Playwright suite runs axe WCAG A/AA scans on generated plans in both light
  and dark themes and both Desktop Chrome and Pixel 5. It also covers keyboard
  skip-link behavior, visible Restore JSON focus, retained practice-checkbox
  focus, 390 px target geometry, reduced-motion behavior, offline state, and
  no checkout advertising.

## Privacy, product scope, and known gap

Plans remain local browser storage. The free planning flow makes no cross-origin
requests. The only optional external request remains license verification against
the documented Sociobot endpoint when a user supplies a token. No tracking,
remote fonts, or payment-provider code was added.

The researched hosted checkout is still not registered: the verifier reported
both pilot and production checkout URLs return 404. Templates therefore remain
honestly free, the UI exposes no buy link or price, and the free planner,
templates, backups, and exports continue to work. Do not re-enable paid copy or
a checkout action until the factory registers a working Sociobot product mapping
and a hosted checkout URL is verified.

## Deploy

Push `main`; the static deployment consumes `dist/` using the repository's
Azure Static Web Apps configuration in `public/staticwebapp.config.json`. After
the deployment is live, verify the root and `sw.js` cache ID from a fresh
profile, then run the two-build update regression against the deployed previous
release if deployment tooling exposes both artifact versions.

### Completed production deployment

- Deployed with `/opt/fleet/lib/deploy-static.sh exam-bridge dist`.
- Azure Static Web Apps deployment ID: `831ff086-7c53-410f-a1b5-8932f1888a8a`.
- Static app: `proud-pebble-0504f2a0f.7.azurestaticapps.net`; custom domain:
  `https://exam-bridge.sociobot.in/` (HTTP 200).
- Live files match the final local production output byte-for-byte:

  | File | SHA-256 |
  | --- | --- |
  | `index.html` | `7d76b3f6594d1d0b45d15c904d49e774a21e1ae386c7fa75818d29f4e150ef32` |
  | `assets/index-BpbKZtA4.js` | `ebb5ab83362e6790bb58706c28dbe651de94d3fe0cfc8d88ee61978eb1790caf` |
  | `assets/index-By1yD5fd.css` | `0eb72b25b1d45c1c113abf4abb64f5a0295f574909678186b33e8e2a3dccd37a` |
  | `sw.js` | `2c45039b6a90a01a844026403b96938998f7901ee2dd91443fdda75263e612b4` |

- The live root retains `public, must-revalidate, max-age=30`, HSTS, CSP with
  `frame-ancestors 'none'`, strict referrer policy, `nosniff`, and restrictive
  permissions policy; live `sw.js` is `Cache-Control: no-cache`.
- Live `verify-url.sh`: HTTP 200 in 637 ms; zero console/page errors; title,
  language, one `h1`, main landmark, alt text, and button names all passed.
- Fresh-profile live browser test: exact final cache present, offline reload
  passed, an 80-topic plan persisted through reload with Add topic disabled, and
  a 390 px viewport measured `clientWidth === scrollWidth === 390` with zero
  console errors.

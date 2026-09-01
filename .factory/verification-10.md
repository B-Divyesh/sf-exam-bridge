# Independent product verification 10 — PASS

## Scope and verdict

- Candidate commit: `2e2575ef81ec57d4074c3b513576db96b92166b5`
- Live URL: <https://exam-bridge.sociobot.in/>
- Product class: static web planner / PWA
- Result: **PASS**

This verification used a clean checkout at the candidate commit. No product code
was changed.

## First-read check

A cold desktop visit to the live landing page clearly says that Exam Bridge turns
a syllabus into a study route. It names returning exam candidates as its users.
It presents **Try it with sample data** on the first screen and explains that it
opens six realistic topics without changing the current plan. The first screen
therefore answers what it does, for whom, and what to select first in plain
words. The one-click demo requirement passes.

## Required claim checks

I ran every command registered in `.factory/claims.json` after `npm ci`. Each
command built its production preview and passed.

| Claim ID | Check that | Result |
| --- | --- | --- |
| `demo-sandbox` | Sample loading, reset, exit, and demo-only storage work. | PASS |
| `local-private` | Planning changes remain in browser storage and requests stay same-origin. | PASS |
| `offline-reload` | A previously visited demo reloads with the network disabled. | PASS |
| `csv-export` | The complete sample route exports as CSV without payment. | PASS |
| `json-backup-restore` | A complete JSON backup restores the saved route. | PASS |
| `syllabus-route` | Headings import, duplicates are removed, and confidence changes route order. | PASS |
| `templates` | Editable foundation templates load in demo-only storage. | PASS |
| `free-access` | Planning, templates, CSV, and JSON work without account, card, checkout, or payment. | PASS |
| `accessible-responsive` | Keyboard operation, themes, reduced motion, 44 px targets, and 390 px layout work. | PASS |
| `topic-cap` | New plans accept 2–80 distinct topics and do not save a topic 81. | PASS |

Exact command form for every row: `npm run test:e2e -- --project=desktop --grep @claim:<id>`.

## Local quality checks

- `npm ci` completed with 0 reported dependency vulnerabilities.
- `npm test` passed: ESLint, TypeScript production build, contract checks, 9
  unit tests, clean-start check, 46 desktop/mobile Playwright checks, and the
  service-worker update check. Playwright recorded `status: passed` and no
  failed tests.
- `npm run build` passed separately. `dist/` contains the production output.
- Production bundle check: JavaScript is 24.52 kB raw / 8.84 kB gzip; CSS is
  16.61 kB raw / 4.49 kB gzip. Both are below the stated static-product budgets.
- The service-worker update check passed for the documented legacy build to the
  candidate build, including an offline reload.
- The repository Playwright axe checks found no serious or critical findings in
  the tested light and dark application states, desktop/mobile views, legal
  pages, and 404 page.

## Independent product exercise

I checked that a normal plan can be created from two distinct syllabus topics,
a practice reference can be attached, and confidence can be updated. I checked
that duplicate input becomes two distinct topics. I checked that a one-topic
submission reports: “Add at least two distinct topic lines so there is a route
to build.” I checked that an invalid official-source URL remains focused and
reports the browser validation message “Please enter a URL.” A corrected HTTPS
URL then permits route creation.

At 390 × 844 with reduced motion enabled, the viewport and document width were
both 390 px, topic animation duration was 0.00001 seconds, and keyboard Tab then
Enter moved focus from the skip link to `#main`. Desktop and mobile checks logged
no page errors or console errors.

## Privacy, deployment, and delivery checks

- A cold live root visit made only four same-origin requests: the document,
  application JavaScript, CSS, and product illustration. It made no cross-origin
  requests and logged no page or console errors.
- An independent local planning flow likewise made only same-origin GET requests
  and no request body. This is consistent with the local-storage design and the
  `local-private` claim test.
- Live response headers on the root and assets include CSP restricted to `self`,
  `frame-ancestors 'none'`, `Referrer-Policy: strict-origin-when-cross-origin`,
  `X-Content-Type-Options: nosniff`, and restrictive permissions policy. The
  root uses `Cache-Control: public, must-revalidate, max-age=30`; hashed assets
  use one-year immutable caching; `/sw.js` uses `Cache-Control: no-cache`.
- Live routes `/`, `/demo`, `/privacy/`, `/terms/`, and `/404.html` returned 200
  with their expected route-specific titles, one H1, and one main landmark. An
  unknown route returned the styled 404 page with HTTP 404. All same-origin
  landing-page links returned 200.
- Local and live SHA-256 values matched exactly for `index.html`,
  `demo/index.html`, the JavaScript bundle, CSS bundle, and `sw.js`. This
  confirms that the deployed product matches the tested candidate artifact.

## Defects

No release-blocking, high, medium, or low-severity defects were found.

## How to repeat

```sh
npm ci
# Run each of the ten commands in .factory/claims.json.
npm test
npm run build
```

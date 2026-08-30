# Exam Bridge

Exam Bridge is a local-first syllabus planner for returning exam candidates. Paste
an official outline, rate confidence topic by topic, identify the prerequisite
refreshers you actually need, and attach your own permitted past-question IDs or
links. The route automatically puts lower-confidence, under-practised topics first.

Live product: <https://exam-bridge.sociobot.in>

## What v1 includes

- Bullet/number-aware syllabus import with duplicate removal
- Editable confidence and prerequisite checklists
- Personal practice IDs, notes, and links with attempted status
- Confidence-aware study ordering and progress summary
- Local autosave, offline shell, JSON backup/restore, and CSV export
- Light and dark themes, keyboard support, responsive 390 px layout
- Reusable editable domain templates, currently included while hosted checkout is prepared
- No accounts, trackers, CDN scripts, hosted questions, or exam-authority claims

Plans live in browser `localStorage`. Clearing site data deletes them, so export a
JSON backup for anything important. Exam Bridge does not provide or republish test
questions; users should reference only material they are entitled to use.

## Develop and verify

Requires a current Node.js LTS release.

```sh
npm ci
npm run dev
npm test
npm run build
```

`npm test` runs unit tests and the Chromium end-to-end/accessibility suite in
desktop and mobile projects. Playwright is pinned to 1.58.2. The exact production
build command is `npm run build`; static output lands in `dist/`, with
`dist/index.html` at its root.

To inspect the production build locally:

```sh
npm run preview
```

## Billing behavior

The planner, templates, and exports are currently available without payment while
the Sociobot hosted checkout is being prepared. Existing license holders can still
restore a token; it is stored as `sb_license:exam-bridge`, stripped from the URL,
and verified through the Sociobot API no more than once per day. Local development
uses the pilot API; the production hostname uses the production API. No payment
provider integration is embedded here.

## Deployment and privacy

Deploy `dist/` to Azure Static Web Apps. `staticwebapp.config.json` supplies CSP,
privacy headers, and cache policy. Each production build generates a
content-fingerprinted service-worker cache for its exact shell, so an updated
release replaces an installed prior shell. See `/privacy/` and `/terms/` for
policy.

The visual thesis, asset prompt, review decision, and provenance are in
`.factory/design.md`. Build verification and known gaps are in
`.factory/handoff.md`.

## License

MIT © 2026 Sociobot (Param Factory).

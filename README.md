# Exam Bridge

Exam Bridge turns a pasted syllabus into a study route for returning exam
candidates. Rate each topic, choose prerequisite refreshers, and attach question
IDs or links you may use. The route puts lower-confidence topics first.

Live product: <https://exam-bridge.sociobot.in>

## Try the sample

Open <https://exam-bridge.sociobot.in/demo> or select **Try it with sample data**
on the first screen. The six-topic sample opens without an account or setup.
Demo changes use `demo:exam-bridge:*` storage and never touch your real plan.
Use **Reset demo** to restore the sample. Use **Start for real** to discard it.

## What v1 includes

- Paste a list with bullets or numbers for 2–80 distinct topics
- Editable confidence and prerequisite checklists
- Personal practice IDs, notes, and links with attempted status
- Study order based on your confidence and progress summary
- Browser autosave, offline reload, JSON backup and restore, and CSV export
- Light and dark themes, keyboard support, reduced motion, and a 390 px layout
- Free editable starter templates
- No accounts, tracking, external scripts, hosted questions, or authority affiliation

Plans stay in your browser. Clearing site data deletes them. Export a
JSON backup for any plan you need to keep. Exam Bridge does not republish test
questions or host coaching notes. Starter templates are editable plans, not
official syllabuses. Exam Bridge is not endorsed by any exam authority.

## Develop and verify

Requires a current Node.js LTS release.

```sh
npm ci
npm run dev
npm test
npm run build
```

`npm test` runs contract checks, unit tests, browser tests, accessibility scans,
and the service-worker upgrade test. Browser tests cover desktop and 390 px
mobile projects. Playwright is pinned to 1.58.2. The production build command is
`npm run build`. Static output lands in `dist/` with `index.html` at its root.
Each claim command builds a production preview when needed. Run it after a clean
`npm ci`, even when `dist/` is absent.

To inspect the production build locally:

```sh
npm run preview
```

## Free access

The planner, every template, CSV exports, and JSON backups are free. No account,
card, checkout, or payment is required.

## Deployment and privacy

Deploy `dist/` to Azure Static Web Apps. `staticwebapp.config.json` sets security
headers, cache policy, demo routing, and the product 404. Each release gives the
offline app a new cache name. Returning visitors receive the current version.
See `/privacy/` and `/terms/` for policy.

The testable claims are in `.factory/claims.json`. Demo details are in
`.factory/demo.md`. Visual provenance is in `.factory/design.md`. Verification
evidence and known gaps are in `.factory/handoff.md`.

## License

MIT © 2026 Sociobot (Param Factory).

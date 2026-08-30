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

- Bullet and number-aware import for 2–80 distinct syllabus topics
- Editable confidence and prerequisite checklists
- Personal practice IDs, notes, and links with attempted status
- Confidence-aware study ordering and progress summary
- Browser autosave, offline reload, JSON backup and restore, and CSV export
- Light and dark themes, keyboard support, reduced motion, and a 390 px layout
- Editable foundation templates, free while checkout is unavailable
- No accounts, trackers, CDN scripts, hosted questions, or exam-authority affiliation

Plans live in browser `localStorage`. Clearing site data deletes them. Export a
JSON backup for any plan you need to keep. Exam Bridge does not republish test
questions. Reference only material you may use.

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
Each exact command in `.factory/claims.json` builds its production preview when
needed, so it also runs after a clean `npm ci` with no existing `dist/` folder.

To inspect the production build locally:

```sh
npm run preview
```

## Billing behavior

The planner, templates, and exports are free today. Hosted checkout is unavailable,
so there is no paid template purchase or price to show. Existing license holders
can still restore a token. It is stored as `sb_license:exam-bridge` and removed
from the URL. After a successful verification, automatic license checks use the
cached verdict for up to 24 hours. Local development uses the pilot API. Production
uses the production API. The site embeds no payment provider.

## Deployment and privacy

Deploy `dist/` to Azure Static Web Apps. `staticwebapp.config.json` sets security
headers, cache policy, demo routing, and the product 404. Each build creates a
content-fingerprinted service-worker cache. A new release replaces the prior app
shell. See `/privacy/` and `/terms/` for policy.

The testable claims are in `.factory/claims.json`. Demo details are in
`.factory/demo.md`. Visual provenance is in `.factory/design.md`. Verification
evidence and known gaps are in `.factory/handoff.md`.

## License

MIT © 2026 Sociobot (Param Factory).

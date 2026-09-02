# Exam Bridge copy audit

Audited 2 September 2026 against the rendered landing, demo, legal, and README
copy. Counts treat hyphenated forms and numeric ranges as one word.

## First screen

| Copy | Words | Claim coverage |
| --- | ---: | --- |
| Study planning for your syllabus | 5 | Section label |
| Turn a syllabus into a study route. | 7 | `syllabus-route` |
| For returning exam candidates: turn a syllabus into a route, refresh prerequisites, and connect topics to question references you own. | 20 | Product description |
| Try it with sample data | 5 | `demo-sandbox` |
| Build my route | 3 | Action |
| The sample opens with six realistic topics. | 7 | `demo-sandbox` |
| Your current plan stays unchanged. | 5 | `demo-sandbox` |
| Saved in this browser | 4 | `local-private` |
| Works offline after the first visit | 6 | `offline-reload` |
| Free planner, backups, and exports | 5 | `free-access` |

## Planner, templates, and limits

| Copy | Words | Claim coverage |
| --- | ---: | --- |
| Paste headings only—one per line. | 5 | Instruction |
| Exam Bridge never uploads this text. | 6 | `local-private` |
| One topic per line; bullets and numbering are fine. | 9 | `syllabus-route` |
| Study route order | 3 | Clear populated-plan heading |
| Question references | 2 | Clear topic-card heading |
| Add prerequisite | 2 | Result-naming action |
| Attach question reference | 3 | Result-naming action |
| Delete this plan | 3 | Destructive result-naming action |
| How it works | 3 | Semantic section heading |
| Paste your outline | 3 | Step 1 heading |
| Add syllabus headings and the official source link when you have one. | 11 | Step 1 instruction |
| Rate what you know | 4 | Step 2 heading |
| Set your confidence and note the prerequisites each topic needs. | 10 | Step 2 instruction |
| Follow your route | 3 | Step 3 heading |
| Study lower-confidence topics first and attach question references you may use. | 10 | Step 3 instruction |
| Choose a starter template | 4 | Clear templates heading |
| Start with a reusable plan, then edit it to match your official outline. | 12 | `templates` |
| A reusable starter template—not an official syllabus. | 7 | `starter-template-boundary` |
| Free starter templates | 3 | `free-access` |
| Use any template without payment | 5 | `free-access` |
| Each template stays editable and saves only in this browser. | 10 | `templates`, `local-private` |
| Use Engineering foundations template | 4 | Result-naming action |
| Use Computer science foundations template | 5 | Result-naming action |
| Use Quantitative foundations template | 4 | Result-naming action |
| Plans stay in this browser. | 5 | `local-private` |
| Exam Bridge does not host exam questions or coaching notes. | 9 | `hosted-content-boundary` |
| Check the official syllabus before studying. | 6 | Boundary |
| Prerequisite suggestions are only starting points. | 6 | Boundary |
| Exam Bridge is not endorsed by any exam authority. | 9 | `independent-tool` |

## Demo and offline states

| Copy | Words | Claim coverage |
| --- | ---: | --- |
| Demo — sample data, nothing is saved | 6 | `demo-sandbox` |
| Demo changes stay separate from your plan and are removed when you choose Start for real. | 16 | `demo-sandbox` |
| Reset demo | 2 | Action |
| Start for real | 3 | Action |
| Explore six realistic topics. | 4 | `demo-sandbox` |
| Your demo changes stay separate from your plan. | 8 | `demo-sandbox` |
| Sample route loaded. | 3 | `demo-sandbox` |
| Demo changes are separate from your plan. | 7 | `demo-sandbox` |
| Sample route reset. | 3 | `demo-sandbox` |
| Its populated workspace is visible immediately on desktop and 390 px screens. | 11 | `demo-sandbox` |
| You’re offline. | 2 | State |
| Planning and exports still work in this browser. | 9 | `offline-reload`, `free-access` |

## Legal pages

| Copy | Words | Result |
| --- | ---: | --- |
| Exam Bridge works without an account and keeps planner content in your browser. | 12 | `free-access`, `local-private` |
| Your plan name, topics, confidence choices, prerequisites, practice references, and theme stay in this browser. | 15 | `local-private` |
| They are not sent to Exam Bridge. | 7 | `local-private` |
| Demo changes stay separate from your plan. | 7 | `demo-sandbox` |
| The demo never reads or changes your plan. | 8 | `demo-sandbox` |
| Reset demo restores the sample. | 5 | Instruction |
| Start for real deletes the demo changes. | 7 | `demo-sandbox` |
| The app loads no third-party scripts, fonts, advertisements, or behavioral analytics. | 12 | `local-private` |
| The planner does not send your plan to an external service. | 11 | `local-private` |
| Standard hosting logs may contain an IP address, browser information, requested path, and timestamp. | 14 | Factual hosting disclosure; no use assurance |
| Export your plan as CSV or JSON at any time. | 10 | `csv-export`, `json-backup-restore` |
| Use Delete this plan to remove the current plan. | 9 | Action instruction |
| Exam Bridge organizes study plans. | 5 | Plain description |
| It does not guarantee results or represent an exam authority. | 10 | Boundary |
| The planner, starter templates, CSV exports, and JSON backups are free. | 10 | `free-access` |
| They need no account, card, checkout, payment, or license. | 10 | `free-access` |

## Not-found page

| Copy | Words | Result |
| --- | ---: | --- |
| This route does not exist. | 5 | Error heading |
| Return to the planner or open the sample route. | 9 | Recovery instruction |
| Your saved plan has not changed. | 6 | `not-found-plan-safety` |

## README sentences revised in this round

| Copy | Words | Result |
| --- | ---: | --- |
| Each claim command builds a production preview when needed. | 9 | Clear |
| Run it after a clean npm ci, even when dist is absent. | 11 | Clear |
| Each release gives the offline app a new cache name. | 10 | Clear |
| Returning visitors receive the current version. | 6 | Clear |
| That replacement reloads offline after it is cached. | 8 | `service-worker-renewal` |
| Three reusable starter templates, free to use and edit. | 9 | `free-access` |
| The planner, starter templates, CSV exports, and JSON backups are free. | 10 | `free-access` |
| No account, card, checkout, payment, or license is needed. | 10 | `free-access` |
| Demo changes stay separate from your plan. | 7 | `demo-sandbox` |
| Start for real deletes the demo changes. | 7 | `demo-sandbox` |
| Use Reset demo to restore the sample. | 7 | Instruction |

## Catalog description

| Copy | Characters | Result |
| --- | ---: | --- |
| Turn syllabus headings into a confidence-ordered study route with prerequisites and your own question references. | 113 | Verb first; under 120 |

## Result

- Reviewed current rendered and README copy across `/`, `/demo`, `/privacy/`,
  `/terms/`, `/404.html`, and `README.md`.
- No sentence exceeds 22 words.
- No banned marketing word appears in visitor copy.
- The first screen names the audience, job, and first action.
- The complete planner is free, so it presents no unavailable tier or purchase path.
- Every outcome, boundary, and provenance statement maps to a registered claim test.
- Visitor copy contains no “sandbox”, “browser storage”, raw storage key, or hosting-log use assurance.

| Concept | Term used |
| --- | --- |
| User’s saved study structure | plan |
| Ordered study view | route |
| One syllabus item | topic |
| Foundation knowledge | prerequisite |
| User-owned question pointer | question reference |
| Isolated sample environment | demo |
| Reusable editable plan | starter template |
| Portable full-fidelity file | JSON backup |
| Spreadsheet export | CSV |

# SOURCE_INVENTORY: frozen Session Architecture Grid

Status: Gate 1, prepared 13 Nov 2026. Source: `source/frozen/session-architecture-grid_live_2026-11-13_v1794606123-2939.html` (live artifact version 1794606123-2939).

This inventory has two layers:

1. **Machine inventory**: `source_inventory.json` and `SOURCE_INVENTORY_TABLE.md`. There are 375 items, each with a stable ID, its kind, its anchor/DOM id/href where present, its whitespace-normalised text and a 16-hex SHA-256 prefix. Generator: `tools/inventory.py` (deterministic; rerun it on the frozen file to reproduce). A word-multiset check confirms that every word of every section is covered by at least one item. The content-parity test in Gate 2 uses this file.
2. **This document**: the structure, controls, behaviour and visual semantics that a text inventory cannot express.

ID scheme: `S00` header; `Snn` section in document order; `-Hk` heading; `-Pk` paragraph; `-Lk-Ij` list item; `-Tk-Rj` table row (`R00` header row); `-Bk` button/control; `-Ak` internal link; `-Xk` text block (diagram nodes, legend chips, grid labels, captions); `-Dk` dynamic or anchor container.

Item counts by kind: table rows 106 + 9 header rows, text blocks 90, list items 76, controls 30, headings 20, paragraphs 16 (+2 header paragraphs), sections 14, links 6 (+1 in the header), 1 eyebrow, 1 h1, 1 dynamic container (`#lanes`), 1 anchor container (`#status`).

## 1. Sections

| ID | Heading (verbatim) | Anchor | Content (inventory items) |
|---|---|---|---|
| S00 | header: eyebrow "AISC 12 project proposal · core design · live version 13 Nov 2026", h1, lede, version note with link to `#changes` | (none) | E01–E05 |
| S01 | Factorial grid: session length × handoff mechanism | (none) | 1 paragraph; 23 text blocks (axis label "turn pairs per session →", length headers 2/5/10/20, 8 condition codes and names, two footer counts "AISC core, 3 months: 4 × 2 + 2 = 10 cells, incl. references C0+R and C1+R" and "Extension: full grid 6 × 4 + 2 = 26 cells, incl. optional C2−R"); 26 cell buttons |
| S02 | What each condition changes | (none) | 1 list, 8 items (C0, C0+R, C1, C1+R, C2, C2−R, C3, C4) |
| S03 | How a run unfolds: work, cut, report, review, resume | `runs` | 1 paragraph; 4 length buttons; legend of 10 chips (S03-X01…X10); `#lanes` timeline container; `#budget-label` |
| S04 | Hypotheses (to be pre-registered) | (none) | 1 paragraph; 1 list, 10 items in source order: H1, H2, H3, H5, H4, K1, K2, "C2−C1" (identity K1 + K2), "Ref" (exploratory comparisons), "Test" (planned confirmatory family) (L01-I01…I10) |
| S05 | One handoff, step by step | (none) | step flow of 5 stages with per-stage cell chips (S05-X01…X31); 6 paragraphs incl. the C1 vs C2 note and the C3 note; 1 list (5 items); `#status` container with caption "Status of design details (updated 13 Nov 2026)" (S05-X32); status table T01: 54 data rows (Detail / Status / Basis); 5 internal links |
| S06 | Stopping rule, evaluated retrospectively | `stopping-rule` | 6 headings: the section title plus "When each rule can fire", "What is reported", "Evaluation plan", "Fresh-context review", "Limits"; rule table T01 (7 data rows: Rule / Fires at / Status); firing table T02 (3 data rows: Cells / Reviews per run / One-review rule, earliest / Two-review rule, earliest / Two-review rule, latest); 3 lists (7, 4, 4 items); 4 paragraphs; evaluation-plan flow diagram (25 text blocks, arrows "↓") |
| S07 | Scoring and judge release | `scoring` | 1 list, 8 items |
| S08 | Costs, updated 12 Nov | `costs` | 1 paragraph; scenario table T01 (4 data rows, columns "3 Nov: core · pilot · role test · total" and "12 Nov: core · pilot · role test with pre-runs · total"); new-operations table T02 (6 data rows: operation / calls in the core / USD with caching / USD without caching); 1 list, 5 items |
| S09 | Open specifications | `open` | table T01, 5 data rows (Item / When) |
| S10 | Artifacts, operations and results | (none) | table T01, 14 data rows (Item / Kind / Made by, when / Contains / Cells / Crosses the cut) |
| S11 | What each instance has, before and after a cut | (none) | 1 paragraph; table T01, 8 data rows |
| S12 | How an error travels, and what records it | (none) | 1 paragraph; table T01, 5 data rows (Step / Example / Where it shows / Measure / Status) |
| S13 | Change log | `changes` | 1 list, 13 entries, newest first (13 Nov … 30 Oct) |
| S14 | Tasks with a ground truth / Outcomes (strip) | (none) | 2 headings; 2 lists (5 and 7 items); 1 link to `#stopping-rule` |

Additional DOM anchor: `#status` (div inside S05), the target of the status links.

## 2. Status vocabulary (must survive verbatim)

The status column of S05-T01 (54 rows) holds these exact labels with counts: derived 19; decided 12 Nov 9; decided 3 Nov 4; decided 2 Nov 3; in proposal 2; setup phase 2; working value 2; decided 12 Nov (evening) 2; interpretation note 1; decided 30 Oct 1; named limit 1; optional, decided 3 Nov 1; open 1; in proposal; decided 2 Nov 1; proposal 1; planning value, decided 3 Nov 1; decided 2 Nov; runs kept 12 Nov 1; before main analysis 1; decided 13 Nov 1.

S06-T01 status labels: decided 12 Nov (3); decided 12 Nov, reported alongside (1); decided 12 Nov; criteria written before the main analysis (1); derived; confirmed in the written operationalisation (1); derived (1).

Other status distinctions in running text: core, ext., opt. (grid and lanes), exploratory (H4 and stopping-rule analyses), confirmatory family (S04 Test), "to be pre-registered", the 3 Nov reference version vs. the live version (S00-E04, S08-P01, S13).

## 3. Controls

| Control | DOM ids | Count | Behaviour in source |
|---|---|---|---|
| Grid cell buttons (`button.cell`) | `g-C0`, `g-C0R`, `g-{C1,C1R,C2,C2X,C3,C4}-{2,5,10,20}` | 26 | Click sets the selected condition (`data-c`) and, where present, the length (`data-n`), re-renders and scrolls `#runs` into view (smooth). Visible labels: C0 "one unbroken session", C0R "reference · one session", core cells "core", extension cells "ext.", C2X cells "opt.". Extension and optional cells have a dashed border (`.ext`). Selected cell: 3 px ring (`.sel`). |
| Length buttons (`.seg-btn`) | `len-2`, `len-5`, `len-10`, `len-20` | 4 | Click sets the length and re-renders. `aria-pressed` reflects the current length. Labels "2", "5 ext.", "10", "20 ext.". Initial length 10. |
| Focus | (all buttons) | | `:focus-visible` outline 2 px. Native `<button>` elements, so Enter and Space work. |

There is no visible theme toggle. The theme follows `prefers-color-scheme`, and the stylesheet also honours `data-theme="light"` and `data-theme="dark"` on `:root`.

## 4. Timeline model (script, verbatim semantics)

Constants: `BUDGET = 40` turn pairs; `GATE = 1.6` (drawing width of summary, report and review blocks, in turn units, not turns). Conditions in order: C0 Continuous, C0R Continuous + review, C1 Self-summary, C1R Self-summary + review, C2 Fresh review, C2X Report, no review, C3 Independent report, C4 Cross-model. Display labels: C0R → "C0+R", C1R → "C1+R", C2X → "C2−R". Core lengths: `C1, C1R, C2, C4 → [2, 10]`; `C2X, C3 → []`; C0 and C0R are always core and have no length.

Per lane (`buildTrack`):

- Every lane starts with a V0 block ("Brief V0 with planted items: start input of every cell") and ends with a score block ("Final brief scored by the calibrated judge").
- **C0**: one instance, one block of 40 turns.
- **C0R**: one instance; four 10-turn work blocks; before blocks 2–4 a review step "Rv" ("Review step inside the same context, after turn 10/20/30") followed by a snapshot block ("Post-review brief, recorded by a side call after the review at turn 10/20/30").
- **Cut cells**: `s = ceil(40 / n)` sessions, each of `min(n, 40 − i·n)` turns. For i > 0 and cell ∉ {C1, C2X}: a review "Rv" first ("Review of the handed-over report or summary, first task of this instance"), then a snapshot, **except in C3**, which gets the review but no snapshot. This contradicts the decided rule; the website fixes it as approved diff AD-01 (`APPROVED_DIFFS.md`). Before every cut except the last session: C1/C1R write a free summary "S"; C2/C2X/C4 write a structured report "R". Cut labels: C1/C1R "summary + brief"; C2/C2X/C4 "report + brief"; C3 "transcript", then a separate instance (`.ind`) writing "R" ("Separate instance writes the report from the transcript"), then "report + brief".
- **C4**: odd sessions (i = 1, 3, …) use model family B (`.mb`): work, review and snapshot blocks and the instance border switch to the model-B colour.
- Lane label: code plus name, plus " · opt." for C2X or " · ext." for other cells when the current length is not core for that cell. C0 and C0R never get a suffix.
- Lane meta: C0 "1 session / 1 instance"; C0R "1 session / 3 reviews"; otherwise "s sessions / k instances" with k = 2s − 1 for C3 and k = s otherwise.
- At lengths ≤ 5 the lanes get class `dense`, which hides block labels except V0 and score.
- Highlighting: the lane of the selected condition gets `.sel` (highlight background); the grid button matching the selected condition (and length, except C0/C0R) gets `.sel`.

Derived counts the site must reproduce (40 turn pairs):

| Length n | Sessions s | Cuts | Reviews: C1+R, C2, C4 | Reviews: C3 | Reviews: C1, C2−R | Snapshots drawn: C1+R, C2, C4 | Snapshots drawn in the source: C3 (site after AD-01: as C2) | Instances: C3 | C4 model-B sessions |
|---|---|---|---|---|---|---|---|---|---|
| 2 | 20 | 19 | 19 | 19 | 0 | 19 | 0 | 39 | 10 |
| 5 | 8 | 7 | 7 | 7 | 0 | 7 | 0 | 15 | 4 |
| 10 | 4 | 3 | 3 | 3 | 0 | 3 | 0 | 7 | 2 |
| 20 | 2 | 1 | 1 | 1 | 0 | 1 | 0 | 3 | 1 |

C0: 0 reviews, 0 snapshots. C0+R: 3 reviews and 3 snapshots, after turns 10, 20 and 30.

## 5. Visual semantics (meaning carried by form; must be kept distinguishable)

| Block | Class | Light token | Meaning |
|---|---|---|---|
| Work, model family A | `.b.work` | `--core` #1f5f8b | turns of a working instance |
| Work, model family B | `.b.work.mb` | `--model-b` #a8641c | C4 odd sessions |
| Cut | `.b.cut` | `--cut` #17202b, 3 px bar | instance ends, context cleared |
| Free summary | `.b.sum` | dotted `--core` border | C1, C1+R |
| Structured report | `.b.rep` | hatched `--core-soft` | C2, C2−R, C4 |
| Report by separate instance | `.b.rep.ind`, `.inst.ind` | `--indep` #6a4c9c, dashed instance border | C3 |
| Review | `.b.rev` | 2 px `--core` border (model B: `--model-b`) | first task after the cut; in C0+R inside the context |
| Post-review snapshot | `.b.snap` | 5 px striped bar | side call, outside the conversation |
| V0 / score | `.b.v0`, `.b.score` | outlined / inverted | start input / final scoring |
| Highlight | `.lane.sel`, `button.cell.sel` | `--hi` #fff5d6, 3 px ring | selection |
| Extension/optional cell | `button.cell.ext` | dashed `--ext` border | not in the AISC core |

The dark theme redefines the same tokens (`--core` #4f9fd6, `--model-b` #e0a35a, `--indep` #ab92dc, `--hi` #2a2a1e, …). Breakpoints are at 860 px and 760 px. `prefers-reduced-motion` governs the smooth scroll. Fonts: Newsreader (display), IBM Plex Sans (body), IBM Plex Mono (codes and cells).

## 6. Links

| From | Target | Text |
|---|---|---|
| S00-E05 | `#changes` | change log |
| S05-A01, S05-A04 | `#scoring` | Scoring |
| S05-A02 | `#costs` | Costs |
| S05-A03, S05-A05 | `#stopping-rule` | Stopping rule |
| S14-A01 | `#stopping-rule` | Stopping rule |

There are no external content links. The only external requests are the Google Fonts URLs in `<head>`.

## 7. Inputs outside the grid (provenance, not grid content)

| File | Role |
|---|---|
| `source/original/Session Architecture Grid (1).html` | contract input 2, byte-identical archive |
| `source/historical/2026-11-03/*.pdf` | grid and cost PDFs sent 3 Nov 2026; immutable |
| `source/proposal/…_2026-11-13_export.pdf` | compact project description (Google doc) as of 13 Nov 2026, 6 pages A4, PDF export; contract input 4 |
| `source/decisions/Protokoll_AISC_12_…` | record of the 12 Nov design session (stopping rule and missing definitions); basis of the 12 Nov entries |
| `source/contract/…Contract.txt` | binding contract, verbatim |
| `source/directives/*` | 13 Nov directives and the link-migration addendum, verbatim |
| `source/directives/Projektdirektive_Dokumentationswebsite.txt` | contract input 3, the original publication brief (supplied 13 Nov 2026) |

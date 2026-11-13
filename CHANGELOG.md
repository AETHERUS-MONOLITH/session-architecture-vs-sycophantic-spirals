# Changelog (website)

Website implementation history. The methodological history of the research design is the grid's own change log, reproduced verbatim on `/changelog/#changes`; it is not repeated or extended here. See `docs/provenance/VERSION_LOG.md` for how the two histories relate.

## 0.1.0 (unreleased; Gate 2 pull request)

Content version: frozen live grid 1794606123-2939 (13 Nov 2026), tag `source-2026-11-13-v1794606123-2939`.

- Initial documentation website (Astro, static). Topical routes `/`, `/grid/`, `/hypotheses/`, `/handoffs/`, `/scoring/`, `/stopping-rule/`, `/costs/`, `/decisions/`, `/operations/`, `/changelog/` as primary navigation; `/full/` as the complete grid on one page in the original order. Both render the same fragment files.
- Content fragments extracted at DOM level from the frozen source (`tools/extract-fragments.mjs`); text nodes copied, attribute additions documented in `content/fragments/manifest.json`.
- The footer reference paragraph of the source ("Reference model: Chandra, Kleiman-Weiner, Ragan-Kelley & Tenenbaum (2026) …"), which the Gate 1 inventory generator does not capture, is kept on `/` and `/full/` and tracked as inventory addendum item F01.
- Interactive factorial grid and run timelines reimplemented as a typed model and renderer, golden-tested against the original script.
- Self-hosted fonts instead of Google Fonts; no external runtime requests.
- Accessibility: grid cells named from their row and column labels, `aria-pressed` on grid cells, `role="group"` instead of an invalid `role="table"` on the grid container, keyboard-scrollable tables and timelines, skip link, contrast of the dashed extension style raised to WCAG 2.1 AA (`--ext` #8a96a6 → #748091 in the light theme; extension-cell text uses `--muted`).
- URL state `?c=&n=` for a selected cell on `/grid/` and `/full/`; no smooth scrolling under reduced motion.
- Status banner on every page; footer with content version, site version and a link to the versions list.
- `/changelog/#versions` lists the 3 Nov 2026 reference (the two PDFs as sent, served from the archive), the archived 12 Nov HTML and the frozen 13 Nov version with SHA-256.
- CI (`ci.yml`) for every PR; deploy workflow (`deploy.yml`) on manual dispatch or `v*` tag only.

### AD-01: C3 post-review snapshot drawn in the run timeline (approved by the project lead, 13 Nov 2026)

- Kind: implementation error in the source timeline script, not a research decision. The research design does not change.
- Decided rule (unchanged): S05-T01 "Post-review snapshot: after every review a side call records the brief as the reviewer now holds it …" (decided 12 Nov); S10-T01 post-review snapshot in C0+R, C1+R, C2, C4 (C3 in the extension).
- Source behaviour: `buildTrack` drew the C3 review and skipped the snapshot (`if (c !== "C3") parts.push(piece("snap" …))`).
- Website change: in C3 a snapshot block (class `snap`, the same title as in C2: "Post-review brief, recorded by a side call before work resumes") directly follows each review block of sessions 2 … s. C3 keeps its review, separate-instance report, cut labels and 2s − 1 instances. Snapshots per C3 run: 19 / 7 / 3 / 1 at lengths 2 / 5 / 10 / 20 (source drawing: 0). No text changes.
- Not added to the methodological change log (S13), because the rule itself did not change.
- Cost note (optional extension only): the costed figures do not change; C3 is extension only and the 2,070 core snapshots cover C0+R, C1+R, C2 and C4. If the optional extension runs, C3 carries 30 reviews per set of four lengths (19 + 7 + 3 + 1); at 30 runs per cell that is 900 snapshot side calls, about 14 USD with caching and 25 USD without at the average price of the core snapshots (rough estimate; the actual price depends on the logged context length). C3 reviews do not count for the stopping rule, so there is no extra snapshot scoring at a first firing.

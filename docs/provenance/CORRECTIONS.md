# CORRECTIONS: authorised corrections after Gate 1

The Gate 1 provenance files in this folder (`SOURCE_INVENTORY.md`, `SOURCE_INVENTORY_TABLE.md`, `APPROVED_DIFFS.md`, `VERSION_LOG.md`) and `content/source_inventory.json`, `content/mapping.csv`, `tools/inventory.py` and `tools/mapping.py` are frozen. `tools/check-source.mjs` pins their Gate 1 SHA-256. A finding made after Gate 1 never edits these files. It is recorded here as a numbered correction, registered with its hashes in `corrections.json`, and checked separately by `tools/check-source.mjs` (section 3b).

## C-01: inventory gap F01 (footer reference paragraph)

| Field | Value |
|---|---|
| Found | Gate 2, 13 Nov 2026 (implementation); confirmed in the Gate 3 review, 14 Nov 2026 |
| Affects | `SOURCE_INVENTORY.md` (Gate 1): "375 items"; the Gate 1 package's DIFF_LOG finding F3 ("no literature list in the grid") |
| Finding | `tools/inventory.py` walks only `<header>` and `<section>` elements. One paragraph of the frozen source lies outside them: the last child of `div.wrap`, `p.foot`, "Reference model: Chandra, Kleiman-Weiner, Ragan-Kelley & Tenenbaum (2026) …". The Gate 1 inventory therefore has 375 items; the source has 376. Because of the same gap, the Gate 1 finding F3 was wrong: the grid does cite literature (this footer, and "Li et al., COLM 2024" in status row S05-T01-R27). |
| Correction | The paragraph is inventory addendum item F01 in `content/inventory-addendum.json` (same ID rules, normalisation and sha16 as the Gate 1 inventory). It is shown verbatim on `/` (`#reference-model`) and on `/full/` (`#reference-model`). Parity checks 376 items. Nothing is added to or removed from the source content. |
| Not changed | The frozen Gate 1 files listed above stay byte-identical. `tools/inventory.py` stays as it was at Gate 1, so the Gate 1 inventory remains reproducible. |
| History | Commit 29d60ba (14 Nov 2026) first wrote this note into `SOURCE_INVENTORY.md`. The integrity check rightly failed on it (CI run 43530230142). The note was moved here on 21 Nov 2026 and the Gate 1 file restored byte for byte. |

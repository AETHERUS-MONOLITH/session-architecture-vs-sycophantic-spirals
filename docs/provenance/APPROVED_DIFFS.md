# APPROVED_DIFFS: deviations of the website from the frozen source

The website reproduces the frozen source (live grid 1794606123-2939) exactly. Any deviation needs an entry here **and** in `content/approved-diffs.json` in the repository. The parity and golden tests whitelist exactly these entries. As of 13 Nov 2026 there is one.

## AD-01: C3 post-review snapshot drawn in the run timeline

| Field | Value |
|---|---|
| Kind | Implementation error in the source timeline script. Not a research decision. |
| Approved by | Project lead, 13 Nov 2026, 23:48: "Soweit die Darstellung der bereits festgelegten Regel widerspricht, ist dies als Implementierungsfehler zu behandeln und im entsprechenden Change Set zu beheben … Keine Änderung des Forschungsdesigns." |
| Decided rule (unchanged) | S05-T01-R40 (decided 12 Nov): "Post-review snapshot: after every review a side call records the brief as the reviewer now holds it; logged, outside the conversation; the run itself is unchanged. Only the snapshot at the first firing is scored". S10-T01-R11: post-review snapshot, cells "C0+R, C1+R, C2, C4 (C3 in the extension)". S06-L03-I04 defines the snapshot. S03-X10 legend: "Brief recorded right after the review (side call, outside the conversation)". |
| Source behaviour | The script `buildTrack` draws the review for C3 (sessions i > 0) and then skips the snapshot: `if (c !== "C3") parts.push(piece("snap" …))`. All other review cells (C0+R, C1+R, C2, C4) get a snapshot after every review. |
| Finding | The drawing contradicts the decided rule. In C3 every review is followed by a snapshot, like in C2 and C4. |
| Website change | In C3, a snapshot block directly follows each review block (sessions 2 … s), with the same class (`snap`) and the same title text as in C2: "Post-review brief, recorded by a side call before work resumes". There are no other changes: C3 keeps its review, its separate-instance report, its cut labels and its 2s − 1 instances. |
| Changed counts (C3) | Snapshots per run: 19 / 7 / 3 / 1 at lengths 2 / 5 / 10 / 20 (source drawing: 0). |
| Text changes | None. Every text item of the inventory stays verbatim. |
| Tests | Model matrix B3 expects s − 1 snapshots for C3. The golden comparison whitelists only these blocks. The parity report lists AD-01 as the single approved difference. |
| Where documented on the site | `/changelog/#site-changes`, entry "AD-01". It is not added to the methodological change log (S13), because the rule itself did not change. |

### Cost note (optional extension only)

- The costed figures do not change. C3 is extension only (S11-P01), and the cost model prices the core, the pilot and the pre-runs (S08). The 2,070 core snapshots (S08-T02-R01) cover C0+R, C1+R, C2 and C4.
- If the optional extension runs, C3 carries 30 reviews per set of four lengths (19 + 7 + 3 + 1). At 30 runs per cell (the planning value, S05-T01-R37) that is **900 snapshot side calls**.
- At the average price of the core snapshots (33 USD with caching and 58 USD without, for 2,070 calls) this comes to about **14 USD with caching and 25 USD without**. This is a rough estimate: the C3 reviewer reads a report written by a separate instance plus the brief, comparable to C2, and the actual price depends on the logged context length.
- C3 reviews are not among the reviews that count for the stopping rule (S06-T01-R05: C1+R, C2, C4 and C0+R), so there is no extra snapshot scoring at a first firing.
- The source does not cost the extension as a whole, and this note does not add an extension estimate to the site. The note stays in this file and in the repository's change records.

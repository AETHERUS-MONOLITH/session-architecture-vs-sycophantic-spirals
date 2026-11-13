# Parity report (GATE1_PLAN section 7 A)

Generated 2026-11-13T23:31:53.616Z from `dist/` with base `/session-architecture-vs-sycophantic-spirals/`.

- Items checked: **376** (375 Gate 1 inventory items + 1 addendum item)
- Found on mapped route: **376**; found on `/full/`: **376**
- Unapproved differences: **0**
- Approved differences: AD-01 (C3 post-review snapshot drawn in the run timeline; timeline drawing only (dynamic #lanes container S03-D01); no inventory text item changes)
- Matcher self-test on the frozen source: 376/376 items found

## Checks

| Check | Result |
|---|---|
| A1 items on route and /full/ | 376/376 on route, 376/376 on /full/ |
| A2 table rows | 18/18 table placements match (S05-T01@/decisions/: 54+1, S05-T01@/full/: 54+1, S06-T01@/stopping-rule/: 7+1, S06-T01@/full/: 7+1, S06-T02@/stopping-rule/: 3+1, S06-T02@/full/: 3+1, S08-T01@/costs/: 4+1, S08-T01@/full/: 4+1, S08-T02@/costs/: 6+1, S08-T02@/full/: 6+1, S09-T01@/decisions/: 5+1, S09-T01@/full/: 5+1, S10-T01@/operations/: 14+1, S10-T01@/full/: 14+1, S11-T01@/operations/: 8+1, S11-T01@/full/: 8+1, S12-T01@/operations/: 5+1, S12-T01@/full/: 5+1) |
| A3 status labels | 4/4 multisets match |
| A4 no stray text | /: 0, /grid/: 0, /hypotheses/: 0, /handoffs/: 0, /scoring/: 0, /stopping-rule/: 0, /costs/: 0, /decisions/: 0, /operations/: 0, /changelog/: 0, /full/: 0 stray strings |
| A5 change log | /changelog/: 13 entries, order ok; /full/: 13 entries, order ok |
| A6 unapproved differences | 0 |

## Differences

None.

## Section-by-section mapping

| Section | Title | Items | Kinds | Route#anchor | On route | On /full/ |
|---|---|---|---|---|---|---|
| S00 | Header | 6 | header 1, div 1, h1 1, p 2, a 1 | /#top | 6 | 6 |
| S01 | Factorial grid: session length × handoff mechanism | 52 | section 1, heading 1, text-block 23, control 26, paragraph 1 | /grid/#grid | 52 | 52 |
| S02 | What each condition changes | 10 | section 1, heading 1, list-item 8 | /grid/#conditions | 10 | 10 |
| S03 | How a run unfolds: work, cut, report, review, resume | 18 | section 1, heading 1, control 4, text-block 10, dynamic-container 1, paragraph 1 | /grid/#runs | 18 | 18 |
| S04 | Hypotheses (to be pre-registered) | 13 | section 1, heading 1, paragraph 1, list-item 10 | /hypotheses/#hypotheses | 13 | 13 |
| S05 | One handoff, step by step | 106 | section 1, heading 1, text-block 32, paragraph 6, link 5, list-item 5, anchor-container 1, table-header 1, table-row 54 | /handoffs/#handoff, /decisions/#status | 106 | 106 |
| S06 | Stopping rule, evaluated retrospectively | 63 | section 1, heading 6, paragraph 4, table-header 2, table-row 10, list-item 15, text-block 25 | /stopping-rule/#stopping-rule | 63 | 63 |
| S07 | Scoring and judge release | 10 | section 1, heading 1, list-item 8 | /scoring/#scoring | 10 | 10 |
| S08 | Costs, updated 12 Nov | 20 | section 1, heading 1, paragraph 1, table-header 2, table-row 10, list-item 5 | /costs/#costs | 20 | 20 |
| S09 | Open specifications | 8 | section 1, heading 1, table-header 1, table-row 5 | /decisions/#open | 8 | 8 |
| S10 | Artifacts, operations and results | 17 | section 1, heading 1, table-header 1, table-row 14 | /operations/#artifacts | 17 | 17 |
| S11 | What each instance has, before and after a cut | 12 | section 1, heading 1, paragraph 1, table-header 1, table-row 8 | /operations/#instance-state | 12 | 12 |
| S12 | How an error travels, and what records it | 9 | section 1, heading 1, paragraph 1, table-header 1, table-row 5 | /operations/#error-path | 9 | 9 |
| S13 | Change log | 15 | section 1, heading 1, list-item 13 | /changelog/#changes | 15 | 15 |
| S14 | Tasks with a ground truth | 16 | section 1, heading 2, list-item 12, link 1 | /#tasks-outcomes | 16 | 16 |
| F01 | Footer reference (inventory addendum) | 1 | paragraph 1 | /#reference-model | 1 | 1 |

## Item-level mapping

| ID | Kind | Route#anchor | On route | /full/#anchor | On /full/ | Text (start) |
|---|---|---|---|---|---|---|
| S00 | header | /#top | yes | /full/#top | yes | AISC 12 project proposal · core design · live version 13 Nov 2026 Sess |
| S00-E01 | div | /#top | yes | /full/#top | yes | AISC 12 project proposal · core design · live version 13 Nov 2026 |
| S00-E02 | h1 | /#top | yes | /full/#top | yes | Session Architecture vs. Sycophantic Spirals |
| S00-E03 | p | /#top | yes | /full/#top | yes | Does the way an LLM-assisted working session is cut and handed over ch |
| S00-E04 | p | /#top | yes | /full/#top | yes | Version. Robert received the version of 3 Nov 2026 as a PDF; that vers |
| S00-E05 | a | /#top | yes | /full/#top | yes | change log |
| S01 | section | /grid/#grid | yes | /full/#grid | yes | Factorial grid: session length × handoff mechanism |
| S01-H01 | heading | /grid/#grid | yes | /full/#grid | yes | Factorial grid: session length × handoff mechanism |
| S01-X01 | text-block | /grid/#grid | yes | /full/#grid | yes | turn pairs per session → |
| S01-X02 | text-block | /grid/#grid | yes | /full/#grid | yes | 2 |
| S01-X03 | text-block | /grid/#grid | yes | /full/#grid | yes | 5 |
| S01-X04 | text-block | /grid/#grid | yes | /full/#grid | yes | 10 |
| S01-X05 | text-block | /grid/#grid | yes | /full/#grid | yes | 20 |
| S01-X06 | text-block | /grid/#grid | yes | /full/#grid | yes | C0 |
| S01-X07 | text-block | /grid/#grid | yes | /full/#grid | yes | Continuous |
| S01-B01 | control | /grid/#grid | yes | /full/#grid | yes | one unbroken session of 40 turn pairs · no length factor |
| S01-X08 | text-block | /grid/#grid | yes | /full/#grid | yes | C0+R |
| S01-X09 | text-block | /grid/#grid | yes | /full/#grid | yes | Continuous + review |
| S01-B02 | control | /grid/#grid | yes | /full/#grid | yes | reference · one session of 40 turn pairs, review after turns 10, 20, 3 |
| S01-X10 | text-block | /grid/#grid | yes | /full/#grid | yes | C1 |
| S01-X11 | text-block | /grid/#grid | yes | /full/#grid | yes | Self-summary |
| S01-B03 | control | /grid/#grid | yes | /full/#grid | yes | core |
| S01-B04 | control | /grid/#grid | yes | /full/#grid | yes | ext. |
| S01-B05 | control | /grid/#grid | yes | /full/#grid | yes | core |
| S01-B06 | control | /grid/#grid | yes | /full/#grid | yes | ext. |
| S01-X12 | text-block | /grid/#grid | yes | /full/#grid | yes | C1+R |
| S01-X13 | text-block | /grid/#grid | yes | /full/#grid | yes | Self-summary + review |
| S01-B07 | control | /grid/#grid | yes | /full/#grid | yes | core |
| S01-B08 | control | /grid/#grid | yes | /full/#grid | yes | ext. |
| S01-B09 | control | /grid/#grid | yes | /full/#grid | yes | core |
| S01-B10 | control | /grid/#grid | yes | /full/#grid | yes | ext. |
| S01-X14 | text-block | /grid/#grid | yes | /full/#grid | yes | C2 |
| S01-X15 | text-block | /grid/#grid | yes | /full/#grid | yes | Fresh review |
| S01-B11 | control | /grid/#grid | yes | /full/#grid | yes | core |
| S01-B12 | control | /grid/#grid | yes | /full/#grid | yes | ext. |
| S01-B13 | control | /grid/#grid | yes | /full/#grid | yes | core |
| S01-B14 | control | /grid/#grid | yes | /full/#grid | yes | ext. |
| S01-X16 | text-block | /grid/#grid | yes | /full/#grid | yes | C2−R |
| S01-X17 | text-block | /grid/#grid | yes | /full/#grid | yes | Report, no review |
| S01-B15 | control | /grid/#grid | yes | /full/#grid | yes | opt. |
| S01-B16 | control | /grid/#grid | yes | /full/#grid | yes | opt. |
| S01-B17 | control | /grid/#grid | yes | /full/#grid | yes | opt. |
| S01-B18 | control | /grid/#grid | yes | /full/#grid | yes | opt. |
| S01-X18 | text-block | /grid/#grid | yes | /full/#grid | yes | C3 |
| S01-X19 | text-block | /grid/#grid | yes | /full/#grid | yes | Independent report |
| S01-B19 | control | /grid/#grid | yes | /full/#grid | yes | ext. |
| S01-B20 | control | /grid/#grid | yes | /full/#grid | yes | ext. |
| S01-B21 | control | /grid/#grid | yes | /full/#grid | yes | ext. |
| S01-B22 | control | /grid/#grid | yes | /full/#grid | yes | ext. |
| S01-X20 | text-block | /grid/#grid | yes | /full/#grid | yes | C4 |
| S01-X21 | text-block | /grid/#grid | yes | /full/#grid | yes | Cross-model |
| S01-B23 | control | /grid/#grid | yes | /full/#grid | yes | core |
| S01-B24 | control | /grid/#grid | yes | /full/#grid | yes | ext. |
| S01-B25 | control | /grid/#grid | yes | /full/#grid | yes | core |
| S01-B26 | control | /grid/#grid | yes | /full/#grid | yes | ext. |
| S01-P01 | paragraph | /grid/#grid | yes | /full/#grid | yes | Click a cell to see how that run unfolds below. |
| S01-X22 | text-block | /grid/#grid | yes | /full/#grid | yes | AISC core, 3 months: 4 × 2 + 2 = 10 cells , incl. references C0+R and  |
| S01-X23 | text-block | /grid/#grid | yes | /full/#grid | yes | Extension: full grid 6 × 4 + 2 = 26 cells , incl. optional C2−R |
| S02 | section | /grid/#conditions | yes | /full/#conditions | yes | What each condition changes |
| S02-H01 | heading | /grid/#conditions | yes | /full/#conditions | yes | What each condition changes |
| S02-L01-I01 | list-item | /grid/#conditions | yes | /full/#conditions | yes | C0 Continuous No break. Baseline. |
| S02-L01-I02 | list-item | /grid/#conditions | yes | /full/#conditions | yes | C0+R Continuous + review Reference cell (decided 30 Oct). As C0, plus  |
| S02-L01-I03 | list-item | /grid/#conditions | yes | /full/#conditions | yes | C1 Self-summary Break; same model writes a free summary; new context c |
| S02-L01-I04 | list-item | /grid/#conditions | yes | /full/#conditions | yes | C1+R Self-summary + review Reference cell (decided 3 Nov). As C1, plus |
| S02-L01-I05 | list-item | /grid/#conditions | yes | /full/#conditions | yes | C2 Fresh review Break; structured, status-tagged report; fresh instanc |
| S02-L01-I06 | list-item | /grid/#conditions | yes | /full/#conditions | yes | C2−R Report, no review Optional extension (3 Nov). As C2, without the  |
| S02-L01-I07 | list-item | /grid/#conditions | yes | /full/#conditions | yes | C3 Independent report A separate instance writes the report from the t |
| S02-L01-I08 | list-item | /grid/#conditions | yes | /full/#conditions | yes | C4 Cross-model As C2, but the next session runs on a different model f |
| S03 | section | /grid/#runs | yes | /full/#runs | yes | How a run unfolds: work, cut, report, review, resume |
| S03-H01 | heading | /grid/#runs | yes | /full/#runs | yes | How a run unfolds: work, cut, report, review, resume |
| S03-B01 | control | /grid/#runs | yes | /full/#runs | yes | 2 |
| S03-B02 | control | /grid/#runs | yes | /full/#runs | yes | 5 ext. |
| S03-B03 | control | /grid/#runs | yes | /full/#runs | yes | 10 |
| S03-B04 | control | /grid/#runs | yes | /full/#runs | yes | 20 ext. |
| S03-X01 | text-block | /grid/#runs | yes | /full/#runs | yes | One instance (one context) |
| S03-X02 | text-block | /grid/#runs | yes | /full/#runs | yes | V0 Starting brief with planted items |
| S03-X03 | text-block | /grid/#runs | yes | /full/#runs | yes | Work, model family A |
| S03-X04 | text-block | /grid/#runs | yes | /full/#runs | yes | Work, model family B |
| S03-X05 | text-block | /grid/#runs | yes | /full/#runs | yes | Cut: instance ends, context cleared; label = what is handed over |
| S03-X06 | text-block | /grid/#runs | yes | /full/#runs | yes | Free summary |
| S03-X07 | text-block | /grid/#runs | yes | /full/#runs | yes | Structured report |
| S03-X08 | text-block | /grid/#runs | yes | /full/#runs | yes | Report by separate instance |
| S03-X09 | text-block | /grid/#runs | yes | /full/#runs | yes | Review, first task of the next working instance |
| S03-X10 | text-block | /grid/#runs | yes | /full/#runs | yes | Brief recorded right after the review (side call, outside the conversa |
| S03-D01 | dynamic-container | /grid/#runs | yes | /full/#runs | yes |  |
| S03-P01 | paragraph | /grid/#runs | yes | /full/#runs | yes | Same total budget in every lane: 40 turn pairs (planning value, decide |
| S04 | section | /hypotheses/#hypotheses | yes | /full/#hypotheses | yes | Hypotheses (to be pre-registered) |
| S04-H01 | heading | /hypotheses/#hypotheses | yes | /full/#hypotheses | yes | Hypotheses (to be pre-registered) |
| S04-P01 | paragraph | /hypotheses/#hypotheses | yes | /full/#hypotheses | yes | "Acceptance" means that a planted flaw persists to the final brief at  |
| S04-L01-I01 | list-item | /hypotheses/#hypotheses | yes | /full/#hypotheses | yes | H1 C1 vs C0 A session break with a self-written summary does not reduc |
| S04-L01-I02 | list-item | /hypotheses/#hypotheses | yes | /full/#hypotheses | yes | H2 C2 vs C0 A structured handoff to a fresh instance lowers flaw accep |
| S04-L01-I03 | list-item | /hypotheses/#hypotheses | yes | /full/#hypotheses | yes | H3 C4 vs C2 Cross-model review lowers acceptance further than same-mod |
| S04-L01-I04 | list-item | /hypotheses/#hypotheses | yes | /full/#hypotheses | yes | H5 Trade-off Conditions that cut acceptance also raise overcorrection. |
| S04-L01-I05 | list-item | /hypotheses/#hypotheses | yes | /full/#hypotheses | yes | H4 Length Acceptance rises non-linearly with session length. Extension |
| S04-L01-I06 | list-item | /hypotheses/#hypotheses | yes | /full/#hypotheses | yes | K1 C1+R vs C1 Review effect with a free summary: cut, fresh instance a |
| S04-L01-I07 | list-item | /hypotheses/#hypotheses | yes | /full/#hypotheses | yes | K2 C2 vs C1+R Format effect under review: cut, fresh instance and revi |
| S04-L01-I08 | list-item | /hypotheses/#hypotheses | yes | /full/#hypotheses | yes | C2−C1 C2 vs C1 = K1 + K2 An identity of means, not a causal split of r |
| S04-L01-I09 | list-item | /hypotheses/#hypotheses | yes | /full/#hypotheses | yes | Ref Exploratory comparisons C0+R vs C0 (review without cut); C2 (lengt |
| S04-L01-I10 | list-item | /hypotheses/#hypotheses | yes | /full/#hypotheses | yes | Test Planned confirmatory family H1 (one-sided test against −δ, the th |
| S05 | section | /handoffs/#handoff | yes | /full/#handoff | yes | One handoff, step by step |
| S05-H01 | heading | /handoffs/#handoff | yes | /full/#handoff | yes | One handoff, step by step |
| S05-X01 | text-block | /handoffs/#handoff | yes | /full/#handoff | yes | instance 1 · active work |
| S05-X02 | text-block | /handoffs/#handoff | yes | /full/#handoff | yes | Working session |
| S05-P01 | paragraph | /handoffs/#handoff | yes | /full/#handoff | yes | N turn pairs between simulated user and model. The pipeline stops it a |
| S05-X03 | text-block | /handoffs/#handoff | yes | /full/#handoff | yes | C1 |
| S05-X04 | text-block | /handoffs/#handoff | yes | /full/#handoff | yes | C1+R |
| S05-X05 | text-block | /handoffs/#handoff | yes | /full/#handoff | yes | C2 |
| S05-X06 | text-block | /handoffs/#handoff | yes | /full/#handoff | yes | C3 |
| S05-X07 | text-block | /handoffs/#handoff | yes | /full/#handoff | yes | C4 |
| S05-X08 | text-block | /handoffs/#handoff | yes | /full/#handoff | yes | instance 1 · reporting |
| S05-X09 | text-block | /handoffs/#handoff | yes | /full/#handoff | yes | Summary or report |
| S05-P02 | paragraph | /handoffs/#handoff | yes | /full/#handoff | yes | Written by the same instance, still with its full context. C1, C1+R: f |
| S05-X10 | text-block | /handoffs/#handoff | yes | /full/#handoff | yes | C1 |
| S05-X11 | text-block | /handoffs/#handoff | yes | /full/#handoff | yes | C1+R |
| S05-X12 | text-block | /handoffs/#handoff | yes | /full/#handoff | yes | C2 |
| S05-X13 | text-block | /handoffs/#handoff | yes | /full/#handoff | yes | C4 |
| S05-X14 | text-block | /handoffs/#handoff | yes | /full/#handoff | yes | transition · cut |
| S05-X15 | text-block | /handoffs/#handoff | yes | /full/#handoff | yes | Instance ends |
| S05-P03 | paragraph | /handoffs/#handoff | yes | /full/#handoff | yes | The context is cleared. Only the handed-over documents reach the next  |
| S05-X16 | text-block | /handoffs/#handoff | yes | /full/#handoff | yes | C1 |
| S05-X17 | text-block | /handoffs/#handoff | yes | /full/#handoff | yes | C1+R |
| S05-X18 | text-block | /handoffs/#handoff | yes | /full/#handoff | yes | C2 |
| S05-X19 | text-block | /handoffs/#handoff | yes | /full/#handoff | yes | C3 |
| S05-X20 | text-block | /handoffs/#handoff | yes | /full/#handoff | yes | C4 |
| S05-X21 | text-block | /handoffs/#handoff | yes | /full/#handoff | yes | instance 2 · review |
| S05-X22 | text-block | /handoffs/#handoff | yes | /full/#handoff | yes | Review first |
| S05-P04 | paragraph | /handoffs/#handoff | yes | /full/#handoff | yes | The next working instance starts with the mandate "review, then contin |
| S05-X23 | text-block | /handoffs/#handoff | yes | /full/#handoff | yes | C1+R |
| S05-X24 | text-block | /handoffs/#handoff | yes | /full/#handoff | yes | C2 |
| S05-X25 | text-block | /handoffs/#handoff | yes | /full/#handoff | yes | C3 |
| S05-X26 | text-block | /handoffs/#handoff | yes | /full/#handoff | yes | C4 |
| S05-X27 | text-block | /handoffs/#handoff | yes | /full/#handoff | yes | instance 2 · decision |
| S05-X28 | text-block | /handoffs/#handoff | yes | /full/#handoff | yes | Resume or score |
| S05-P05 | paragraph | /handoffs/#handoff | yes | /full/#handoff | yes | Budget left: the same instance continues working. Budget used up: the  |
| S05-A01 | link | /handoffs/#handoff | yes | /full/#handoff | yes | Scoring |
| S05-X29 | text-block | /handoffs/#handoff | yes | /full/#handoff | yes | all |
| S05-X30 | text-block | /handoffs/#handoff | yes | /full/#handoff | yes | C1 compared with C2 C2 changes two things at once: the summary becomes |
| S05-X31 | text-block | /handoffs/#handoff | yes | /full/#handoff | yes | C3: separate report author Instance 1 ends without writing anything. A |
| S05-L01-I01 | list-item | /handoffs/#handoff | yes | /full/#handoff | yes | C0 No cut, no report: work continues until the budget ends, then scori |
| S05-L01-I02 | list-item | /handoffs/#handoff | yes | /full/#handoff | yes | C0+R As C0, plus a review step after turns 10, 20 and 30 inside the sa |
| S05-L01-I03 | list-item | /handoffs/#handoff | yes | /full/#handoff | yes | C1 Free summary written before the cut, then a new instance continues  |
| S05-L01-I04 | list-item | /handoffs/#handoff | yes | /full/#handoff | yes | C1+R Free summary before the cut; the new instance gets summary and cu |
| S05-L01-I05 | list-item | /handoffs/#handoff | yes | /full/#handoff | yes | C2−R Optional. Structured report before the cut; the new instance cont |
| S05-D01 | anchor-container | /decisions/#status | yes | /full/#status | yes | Status of design details |
| S05-X32 | text-block | /decisions/#status | yes | /full/#status | yes | Status of design details (updated 13 Nov 2026) |
| S05-P06 | paragraph | /handoffs/#handoff | yes | /full/#handoff | yes | "Decided" = decision by the project lead. "Derived" = follows from the |
| S05-T01-R00 | table-header | /decisions/#status | yes | /full/#status | yes | Detail / Status / Basis |
| S05-T01-R01 | table-row | /decisions/#status | yes | /full/#status | yes | Every cell starts from the same brief V0 with planted items / in propo |
| S05-T01-R02 | table-row | /decisions/#status | yes | /full/#status | yes | The current working brief crosses every cut together with the summary  |
| S05-T01-R03 | table-row | /decisions/#status | yes | /full/#status | yes | The session instance writes out the current brief before each cut; the |
| S05-T01-R04 | table-row | /decisions/#status | yes | /full/#status | yes | The simulated user keeps the whole conversation across cuts and sees n |
| S05-T01-R05 | table-row | /decisions/#status | yes | /full/#status | yes | Reviews, summaries and reports do not count against the turn budget /  |
| S05-T01-R06 | table-row | /decisions/#status | yes | /full/#status | yes | The review reads the handed-over report or summary and the current bri |
| S05-T01-R07 | table-row | /decisions/#status | yes | /full/#status | yes | C4 alternates the model family at every handoff / derived / Switching  |
| S05-T01-R08 | table-row | /decisions/#status | yes | /full/#status | yes | In C1+R, C2 and C4, shorter sessions mean more reviews / interpretatio |
| S05-T01-R09 | table-row | /decisions/#status | yes | /full/#status | yes | Exact wording of the summary request, report request and review instru |
| S05-T01-R10 | table-row | /decisions/#status | yes | /full/#status | yes | C0 and C1 stay unchanged, without review instruction; reference cell C |
| S05-T01-R11 | table-row | /decisions/#status | yes | /full/#status | yes | C0+R: review after turns 10, 20, 30 in the same context, with the revi |
| S05-T01-R12 | table-row | /decisions/#status | yes | /full/#status | yes | C1 vs C0 compares a bundle (break plus free summary); break and fresh  |
| S05-T01-R13 | table-row | /decisions/#status | yes | /full/#status | yes | C1+R in the core at lengths 2 and 10: C1 plus the review step of C2 at |
| S05-T01-R14 | table-row | /decisions/#status | yes | /full/#status | yes | All review steps (C0+R, C1+R, C2, C4) share one core instruction: chec |
| S05-T01-R15 | table-row | /decisions/#status | yes | /full/#status | yes | C2−R (structured report, no review mandate) as optional extension, not |
| S05-T01-R16 | table-row | /decisions/#status | yes | /full/#status | yes | How to produce a structured report without an implicit review: the tem |
| S05-T01-R17 | table-row | /decisions/#status | yes | /full/#status | yes | Planned classification of comparisons: confirmatory H1, H2, H3, H5, K1 |
| S05-T01-R18 | table-row | /decisions/#status | yes | /full/#status | yes | Confidence probe as a side call (D8): after turns 10, 20, 30, 40 in ev |
| S05-T01-R19 | table-row | /decisions/#status | yes | /full/#status | yes | Each probe is taken after the checkpoint turn and before any summary,  |
| S05-T01-R20 | table-row | /decisions/#status | yes | /full/#status | yes | Brief snapshots in C0 and C0+R after turns 10, 20, 30 use the same sid |
| S05-T01-R21 | table-row | /decisions/#status | yes | /full/#status | yes | Pushback: the attached user argues back whenever the model questions t |
| S05-T01-R22 | table-row | /decisions/#status | yes | /full/#status | yes | Three forms of sycophancy are coded: flaw never raised, flaw dropped a |
| S05-T01-R23 | table-row | /decisions/#status | yes | /full/#status | yes | Randomisation: every brief runs in every cell and stance equally often |
| S05-T01-R24 | table-row | /decisions/#status | yes | /full/#status | yes | Runs per cell and stance must be a multiple of the number of briefs (w |
| S05-T01-R25 | table-row | /decisions/#status | yes | /full/#status | yes | Pilot (weeks 3 to 5): reduced grid; power analysis for the planned 30  |
| S05-T01-R26 | table-row | /decisions/#status | yes | /full/#status | yes | Pilot logs cached tokens per call for the user model, with explicit ca |
| S05-T01-R27 | table-row | /decisions/#status | yes | /full/#status | yes | Role adherence of the simulated user checked at each checkpoint of the |
| S05-T01-R28 | table-row | /decisions/#status | yes | /full/#status | yes | Role stability test in the pilot: the user model (attached and neutral |
| S05-T01-R29 | table-row | /decisions/#status | yes | /full/#status | yes | Test layout: 80 runs with one challenge to the false premise at turn 5 |
| S05-T01-R30 | table-row | /decisions/#status | yes | /full/#status | yes | Measures: M1 position kept (share of user turns that take over or drop |
| S05-T01-R31 | table-row | /decisions/#status | yes | /full/#status | yes | Thresholds: M1 at most 5% in every block of 10 turns; attached M2 in t |
| S05-T01-R32 | table-row | /decisions/#status | yes | /full/#status | yes | Validity: two raters confirm the scripted replies as neutral and plaus |
| S05-T01-R33 | table-row | /decisions/#status | yes | /full/#status | yes | Decision: thresholds met, the user model stays. Otherwise a role remin |
| S05-T01-R34 | table-row | /decisions/#status | yes | /full/#status | yes | Comparison with regular pilot runs: the same coding of user turns, wit |
| S05-T01-R35 | table-row | /decisions/#status | yes | /full/#status | yes | Isolated detection check (R4): 100 repetitions per brief and target fa |
| S05-T01-R36 | table-row | /decisions/#status | yes | /full/#status | yes | Wording of the role card and of the probe question / setup phase / Wri |
| S05-T01-R37 | table-row | /decisions/#status | yes | /full/#status | yes | Planning values: 40 turn pairs; 30 runs per cell (15 per stance); targ |
| S05-T01-R38 | table-row | /decisions/#status | yes | /full/#status | yes | Stopping rule evaluated retrospectively (option A): no forced stop, no |
| S05-T01-R39 | table-row | /decisions/#status | yes | /full/#status | yes | Fresh-context review: a new instance without the previous session's co |
| S05-T01-R40 | table-row | /decisions/#status | yes | /full/#status | yes | Post-review snapshot: after every review a side call records the brief |
| S05-T01-R41 | table-row | /decisions/#status | yes | /full/#status | yes | Snapshot position: immediately after the review step, before the next  |
| S05-T01-R42 | table-row | /decisions/#status | yes | /full/#status | yes | Substantive objection: classified afterwards by the judge model; an ob |
| S05-T01-R43 | table-row | /decisions/#status | yes | /full/#status | yes | Information available to the classifier for review k: review records 1 |
| S05-T01-R44 | table-row | /decisions/#status | yes | /full/#status | yes | Status level and the "verified" tag are recorded separately (level 3 i |
| S05-T01-R45 | table-row | /decisions/#status | yes | /full/#status | yes | Dependent claims are counted on the brief at every checkpoint; what "b |
| S05-T01-R46 | table-row | /decisions/#status | yes | /full/#status | yes | Coupled spiral: rising confidence means a trend over the four checkpoi |
| S05-T01-R47 | table-row | /decisions/#status | yes | /full/#status | yes | Judge release: Krippendorff's alpha; the judge is used for a scored va |
| S05-T01-R48 | table-row | /decisions/#status | yes | /full/#status | yes | Confidence probe: the probe call never sees earlier probe answers / de |
| S05-T01-R49 | table-row | /decisions/#status | yes | /full/#status | yes | H4 without a knee: acceptance rises non-linearly with session length;  |
| S05-T01-R50 | table-row | /decisions/#status | yes | /full/#status | yes | When a planted flaw counts as present at a firing: both thresholds are |
| S05-T01-R51 | table-row | /decisions/#status | yes | /full/#status | yes | Status is judged on the whole brief: a flaw flagged as open in one pla |
| S05-T01-R52 | table-row | /decisions/#status | yes | /full/#status | yes | H1 test: one-sided test of Δ = p(C1) − p(C0) against −δ (null hypothes |
| S05-T01-R53 | table-row | /decisions/#status | yes | /full/#status | yes | "Spiral" defined as evidence-free amplification; persistence primary,  |
| S05-T01-R54 | table-row | /decisions/#status | yes | /full/#status | yes | User stance attached vs neutral (replaces confident vs tentative); iso |
| S05-A02 | link | /decisions/#status | yes | /full/#status | yes | Costs |
| S05-A03 | link | /decisions/#status | yes | /full/#status | yes | Stopping rule |
| S05-A04 | link | /decisions/#status | yes | /full/#status | yes | Scoring |
| S05-A05 | link | /decisions/#status | yes | /full/#status | yes | Stopping rule |
| S06 | section | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | Stopping rule, evaluated retrospectively |
| S06-H01 | heading | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | Stopping rule, evaluated retrospectively |
| S06-P01 | paragraph | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | Decided 12 Nov (option A). Every run goes to turn 40. Nobody inside th |
| S06-T01-R00 | table-header | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | Rule / Fires at / Status |
| S06-T01-R01 | table-row | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | Two-review rule / The first review k (k ≥ 2) where review k and review |
| S06-T01-R02 | table-row | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | Stricter variant / As the two-review rule, and no objection deferred e |
| S06-T01-R03 | table-row | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | One-review rule (comparison) / The first review that raises no new sub |
| S06-T01-R04 | table-row | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | "New" and "substantive" / New: not raised in an earlier review record  |
| S06-T01-R05 | table-row | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | Reviews that count / C1+R, C2 and C4: the review at every cut (fresh-c |
| S06-T01-R06 | table-row | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | Information for classifying review k / Review records 1 to k of that r |
| S06-T01-R07 | table-row | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | Brief scored at a firing / The post-review snapshot of the firing revi |
| S06-H02 | heading | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | When each rule can fire |
| S06-T02-R00 | table-header | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | Cells / Reviews per run / One-review rule, earliest / Two-review rule, |
| S06-T02-R01 | table-row | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | C1+R, C2, C4 at length 2 / 19, after turns 2, 4, …, 38 / after turn 2  |
| S06-T02-R02 | table-row | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | C1+R, C2, C4 at length 10 / 3, after turns 10, 20, 30 / after turn 10  |
| S06-T02-R03 | table-row | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | C0+R / 3, after turns 10, 20, 30 / after turn 10 / after turn 20 / aft |
| S06-P02 | paragraph | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | At length 10 and in C0+R the two-review rule can fire only at the seco |
| S06-H03 | heading | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | What is reported |
| S06-L01-I01 | list-item | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | Status at the first firing : each of the three planted flaws gets a st |
| S06-L01-I02 | list-item | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | False saturation, primary (status 2 or higher) : runs whose maximum st |
| S06-L01-I03 | list-item | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | False saturation, stricter (status 1 or higher) : runs whose maximum s |
| S06-L01-I04 | list-item | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | Premature triggering , for each threshold: runs counted as false satur |
| S06-L01-I05 | list-item | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | Both thresholds are reported with numerator, denominator and 95% uncer |
| S06-L01-I06 | list-item | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | Added for comparability (derived): the turn of the first firing, and f |
| S06-L01-I07 | list-item | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | Pooled intervals account for briefs (bootstrap over briefs); the metho |
| S06-H04 | heading | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | Evaluation plan |
| S06-X01 | text-block | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | C1+R |
| S06-X02 | text-block | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | summary with review |
| S06-X03 | text-block | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | C2 |
| S06-X04 | text-block | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | fresh review, structured report |
| S06-X05 | text-block | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | C4 |
| S06-X06 | text-block | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | cross-model review |
| S06-X07 | text-block | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | C0+R |
| S06-X08 | text-block | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | same-context contrast |
| S06-X09 | text-block | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | each at lengths 2 and 10 (C0+R without length), attached and neutral u |
| S06-X10 | text-block | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | Per run: first firing |
| S06-X11 | text-block | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | post-review snapshot of the firing review is scored; one case per run |
| S06-X12 | text-block | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | ↓ |
| S06-X13 | text-block | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | Per cell and length |
| S06-X14 | text-block | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | descriptive rates |
| S06-X15 | text-block | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | Pooled rate |
| S06-X16 | text-block | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | the three cells with a cut |
| S06-X17 | text-block | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | Joint model |
| S06-X18 | text-block | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | cell, length, user stance |
| S06-X19 | text-block | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | ↓ |
| S06-X20 | text-block | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | User pressure |
| S06-X21 | text-block | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | attached vs neutral |
| S06-X22 | text-block | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | Review frequency |
| S06-X23 | text-block | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | length 2 vs length 10 |
| S06-X24 | text-block | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | Review context |
| S06-X25 | text-block | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | fresh vs same context, at length 10 |
| S06-P03 | paragraph | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | Reference: protocol of 12 Nov, page 6. C0+R (dashed) enters only the r |
| S06-L02-I01 | list-item | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | C0+R has no length factor. It cannot enter a cell × length model. The  |
| S06-L02-I02 | list-item | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | Review context at length 10 still differs in the cut, the change of co |
| S06-L02-I03 | list-item | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | Review frequency (length 2 vs 10) moves together with session length;  |
| S06-L02-I04 | list-item | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | Selection by firing : the joint model on false saturation uses only ru |
| S06-H05 | heading | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | Fresh-context review |
| S06-P04 | paragraph | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | Decided 12 Nov: a new instance that does not have the previous session |
| S06-H06 | heading | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | Limits |
| S06-L03-I01 | list-item | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | The rule is reconstructed on recorded runs. Up to the firing a stopped |
| S06-L03-I02 | list-item | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | Not studied: how the rule works when participants know it (follow-up). |
| S06-L03-I03 | list-item | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | Reproducible is the application of the rule to the published logs, not |
| S06-L03-I04 | list-item | /stopping-rule/#stopping-rule | yes | /full/#stopping-rule | yes | The snapshot is a fresh rendering of the brief by the reviewing model, |
| S07 | section | /scoring/#scoring | yes | /full/#scoring | yes | Scoring and judge release |
| S07-H01 | heading | /scoring/#scoring | yes | /full/#scoring | yes | Scoring and judge release |
| S07-L01-I01 | list-item | /scoring/#scoring | yes | /full/#scoring | yes | Two human raters, blind to cell and stance, independently score a cali |
| S07-L01-I02 | list-item | /scoring/#scoring | yes | /full/#scoring | yes | Team (decided 12 Nov, evening): at most five people. Project lead 1, e |
| S07-L01-I03 | list-item | /scoring/#scoring | yes | /full/#scoring | yes | Blind rating procedure (derived): (1) an engineer builds the rating pa |
| S07-L01-I04 | list-item | /scoring/#scoring | yes | /full/#scoring | yes | Agreement is computed with Krippendorff's alpha, separately for each s |
| S07-L01-I05 | list-item | /scoring/#scoring | yes | /full/#scoring | yes | Human agreement α(H1, H2) from the two raters. Judge agreement: α(J, H |
| S07-L01-I06 | list-item | /scoring/#scoring | yes | /full/#scoring | yes | Release rule (decided 12 Nov): the judge scores a variable at scale if |
| S07-L01-I07 | list-item | /scoring/#scoring | yes | /full/#scoring | yes | The relative rule only means something if the humans agree with each o |
| S07-L01-I08 | list-item | /scoring/#scoring | yes | /full/#scoring | yes | The judge scores all runs in three passes (final brief against V0, bri |
| S08 | section | /costs/#costs | yes | /full/#costs | yes | Costs, updated 12 Nov |
| S08-H01 | heading | /costs/#costs | yes | /full/#costs | yes | Costs, updated 12 Nov |
| S08-P01 | paragraph | /costs/#costs | yes | /full/#costs | yes | The estimate sent on 3 Nov (PDF) stays the reference for what Robert h |
| S08-T01-R00 | table-header | /costs/#costs | yes | /full/#costs | yes | Scenario / 3 Nov: core · pilot · role test · total / 12 Nov: core · pi |
| S08-T01-R01 | table-row | /costs/#costs | yes | /full/#costs | yes | With prompt caching / 446 · 178 · 25 · 650 / 499 · 199 · 31 · 729 |
| S08-T01-R02 | table-row | /costs/#costs | yes | /full/#costs | yes | User-model cache hits 50% / 587 · 235 · 67 · 888 / 639 · 256 · 82 · 97 |
| S08-T01-R03 | table-row | /costs/#costs | yes | /full/#costs | yes | No user-model cache hits / 727 · 291 · 109 · 1,127 / 779 · 312 · 134 · |
| S08-T01-R04 | table-row | /costs/#costs | yes | /full/#costs | yes | No caching / 1,080 · 432 · 109 · 1,621 / 1,157 · 463 · 134 · 1,754 |
| S08-T02-R00 | table-header | /costs/#costs | yes | /full/#costs | yes | New model operation (added 12 Nov) / Calls in the core / USD with cach |
| S08-T02-R01 | table-row | /costs/#costs | yes | /full/#costs | yes | Post-review snapshot (side call on the reviewing model) / one per exis |
| S08-T02-R02 | table-row | /costs/#costs | yes | /full/#costs | yes | Objection classification by the judge / one per existing review: 2,070 |
| S08-T02-R03 | table-row | /costs/#costs | yes | /full/#costs | yes | Scoring the snapshot at the first firing of three rules / at most 630  |
| S08-T02-R04 | table-row | /costs/#costs | yes | /full/#costs | yes | Core increase /  / 53 / 77 |
| S08-T02-R05 | table-row | /costs/#costs | yes | /full/#costs | yes | Pilot (0.4 × core, same pipeline) /  / +21 / +31 |
| S08-T02-R06 | table-row | /costs/#costs | yes | /full/#costs | yes | Pre-runs for the role-stability thresholds / 20 scripted runs (plannin |
| S08-L01-I01 | list-item | /costs/#costs | yes | /full/#costs | yes | The 2,070 reviews themselves (90 in C0+R, 1,980 in C1+R, C2 and C4) we |
| S08-L01-I02 | list-item | /costs/#costs | yes | /full/#costs | yes | Unchanged: review frequency (already costed per review), model familie |
| S08-L01-I03 | list-item | /costs/#costs | yes | /full/#costs | yes | No existing artifact can replace the snapshot: the review record holds |
| S08-L01-I04 | list-item | /costs/#costs | yes | /full/#costs | yes | Assumptions as in the cost model of 3 Nov: current brief 1,500 tokens, |
| S08-L01-I05 | list-item | /costs/#costs | yes | /full/#costs | yes | AISC supports up to 1,000 USD. With caching the total is about 729 USD |
| S09 | section | /decisions/#open | yes | /full/#open | yes | Open specifications |
| S09-H01 | heading | /decisions/#open | yes | /full/#open | yes | Open specifications |
| S09-T01-R00 | table-header | /decisions/#open | yes | /full/#open | yes | Item / When |
| S09-T01-R01 | table-row | /decisions/#open | yes | /full/#open | yes | Rule for a substantive objection; evidence rule for "verified"; scorin |
| S09-T01-R02 | table-row | /decisions/#open | yes | /full/#open | yes | Numeric value of δ for H1; calibration sample size; alpha per variable |
| S09-T01-R03 | table-row | /decisions/#open | yes | /full/#open | yes | Wording of review, summary and report instructions, role card and prob |
| S09-T01-R04 | table-row | /decisions/#open | yes | /full/#open | yes | Role-stability thresholds / Calibrated on pre-runs, fixed before the p |
| S09-T01-R05 | table-row | /decisions/#open | yes | /full/#open | yes | How a structured report without an implicit review would look (C2−R) / |
| S10 | section | /operations/#artifacts | yes | /full/#artifacts | yes | Artifacts, operations and results |
| S10-H01 | heading | /operations/#artifacts | yes | /full/#artifacts | yes | Artifacts, operations and results |
| S10-T01-R00 | table-header | /operations/#artifacts | yes | /full/#artifacts | yes | Item / Kind / Made by, when / Contains / Cells / Crosses the cut |
| S10-T01-R01 | table-row | /operations/#artifacts | yes | /full/#artifacts | yes | Brief V0 / artifact / Team, before any run; two raters who did not wri |
| S10-T01-R02 | table-row | /operations/#artifacts | yes | /full/#artifacts | yes | Working brief / artifact / Session instance; a version is written befo |
| S10-T01-R03 | table-row | /operations/#artifacts | yes | /full/#artifacts | yes | User role card / artifact / Team / Attached user: the brief is its own |
| S10-T01-R04 | table-row | /operations/#artifacts | yes | /full/#artifacts | yes | User memory / state / Pipeline, continuous / All user and model turns  |
| S10-T01-R05 | table-row | /operations/#artifacts | yes | /full/#artifacts | yes | Transcript / record / Pipeline log / Every turn, verbatim / all / only |
| S10-T01-R06 | table-row | /operations/#artifacts | yes | /full/#artifacts | yes | Free summary / artifact / Session instance at session end, on a free r |
| S10-T01-R07 | table-row | /operations/#artifacts | yes | /full/#artifacts | yes | Structured report / artifact / Session instance at session end; in C3  |
| S10-T01-R08 | table-row | /operations/#artifacts | yes | /full/#artifacts | yes | Review / operation / Next working instance, first task / Check of the  |
| S10-T01-R09 | table-row | /operations/#artifacts | yes | /full/#artifacts | yes | Review record / result / Same instance / Findings; for each: adopted,  |
| S10-T01-R10 | table-row | /operations/#artifacts | yes | /full/#artifacts | yes | Revised report or summary, and brief / result / Same instance / Change |
| S10-T01-R11 | table-row | /operations/#artifacts | yes | /full/#artifacts | yes | Post-review snapshot / measurement / Side call right after each review |
| S10-T01-R12 | table-row | /operations/#artifacts | yes | /full/#artifacts | yes | Objection classification / result / Judge model, after the run, one ca |
| S10-T01-R13 | table-row | /operations/#artifacts | yes | /full/#artifacts | yes | Confidence probe / measurement / Pipeline, after turns 10, 20, 30, 40  |
| S10-T01-R14 | table-row | /operations/#artifacts | yes | /full/#artifacts | yes | Scores / result / Two blind raters score a calibration sample with the |
| S11 | section | /operations/#instance-state | yes | /full/#instance-state | yes | What each instance has, before and after a cut |
| S11-H01 | heading | /operations/#instance-state | yes | /full/#instance-state | yes | What each instance has, before and after a cut |
| S11-P01 | paragraph | /operations/#instance-state | yes | /full/#instance-state | yes | Session 1 of C1 to C4 starts like C0: system prompt and brief V0. The  |
| S11-T01-R00 | table-header | /operations/#instance-state | yes | /full/#instance-state | yes | Cell / The working instance has / It writes before the cut / The next  |
| S11-T01-R01 | table-row | /operations/#instance-state | yes | /full/#instance-state | yes | C0 / System prompt, V0, every turn so far / No cut; final brief when t |
| S11-T01-R02 | table-row | /operations/#instance-state | yes | /full/#instance-state | yes | C0+R / As C0, plus its own review records / No cut; at turns 10, 20, 3 |
| S11-T01-R03 | table-row | /operations/#instance-state | yes | /full/#instance-state | yes | C1 / What it started with, plus the turns of its own session / Free su |
| S11-T01-R04 | table-row | /operations/#instance-state | yes | /full/#instance-state | yes | C1+R / What it started with, plus its review record and the turns of i |
| S11-T01-R05 | table-row | /operations/#instance-state | yes | /full/#instance-state | yes | C2−R (opt.) / What it started with, plus the turns of its own session  |
| S11-T01-R06 | table-row | /operations/#instance-state | yes | /full/#instance-state | yes | C2 / What it started with, plus its review record and the turns of its |
| S11-T01-R07 | table-row | /operations/#instance-state | yes | /full/#instance-state | yes | C4 / As C2 / As C2 / As C2, on the other model family / As C2 |
| S11-T01-R08 | table-row | /operations/#instance-state | yes | /full/#instance-state | yes | User / Role card and the whole conversation / — / Nothing new: the use |
| S12 | section | /operations/#error-path | yes | /full/#error-path | yes | How an error travels, and what records it |
| S12-H01 | heading | /operations/#error-path | yes | /full/#error-path | yes | How an error travels, and what records it |
| S12-P01 | paragraph | /operations/#error-path | yes | /full/#error-path | yes | Example is illustrative: a brief claims that 70% of small cafés would  |
| S12-T01-R00 | table-header | /operations/#error-path | yes | /full/#error-path | yes | Step / Example / Where it shows / Measure / Status |
| S12-T01-R01 | table-row | /operations/#error-path | yes | /full/#error-path | yes | 1. Accepted / Turn 3: the user defends the figure; the model calls it  |
| S12-T01-R02 | table-row | /operations/#error-path | yes | /full/#error-path | yes | 2. Used as a premise / Turn 6: the model builds the pricing on it / Wo |
| S12-T01-R03 | table-row | /operations/#error-path | yes | /full/#error-path | yes | 3. Amplified / Turn 9: the brief states the figure as established, wit |
| S12-T01-R04 | table-row | /operations/#error-path | yes | /full/#error-path | yes | 4. Passed on / Cut after turn 10: C1's summary calls demand settled; i |
| S12-T01-R05 | table-row | /operations/#error-path | yes | /full/#error-path | yes | End / The flaw is still unqualified in the final brief / Final brief / |
| S13 | section | /changelog/#changes | yes | /full/#changes | yes | Change log |
| S13-H01 | heading | /changelog/#changes | yes | /full/#changes | yes | Change log |
| S13-L01-I01 | list-item | /changelog/#changes | yes | /full/#changes | yes | 13 Nov: H1 test decided by the project lead: one-sided test of Δ = p(C |
| S13-L01-I02 | list-item | /changelog/#changes | yes | /full/#changes | yes | 12 Nov (late evening): both false-saturation thresholds kept as nested |
| S13-L01-I03 | list-item | /changelog/#changes | yes | /full/#changes | yes | 12 Nov (evening): the project proposal was shortened to six pages; tec |
| S13-L01-I04 | list-item | /changelog/#changes | yes | /full/#changes | yes | 12 Nov, live version (not the version sent on 3 Nov): decisions by the |
| S13-L01-I05 | list-item | /changelog/#changes | yes | /full/#changes | yes | 3 Nov (late afternoon), consistency fixes: persistence measured on the |
| S13-L01-I06 | list-item | /changelog/#changes | yes | /full/#changes | yes | 3 Nov (afternoon), decisions by the project lead: 15 briefs and 100 re |
| S13-L01-I07 | list-item | /changelog/#changes | yes | /full/#changes | yes | 3 Nov (afternoon), check of the whole page: C0 and C0+R shown with the |
| S13-L01-I08 | list-item | /changelog/#changes | yes | /full/#changes | yes | 3 Nov (midday), decisions by the project lead: C1+R in the core at len |
| S13-L01-I09 | list-item | /changelog/#changes | yes | /full/#changes | yes | 3 Nov (morning), decisions by the project lead: confidence probe as si |
| S13-L01-I10 | list-item | /changelog/#changes | yes | /full/#changes | yes | 3 Nov: error path table added; user role card, confidence probe timing |
| S13-L01-I11 | list-item | /changelog/#changes | yes | /full/#changes | yes | 2 Nov, decisions by the project lead: definition of "spiral", user rol |
| S13-L01-I12 | list-item | /changelog/#changes | yes | /full/#changes | yes | 30 Oct (evening), decision by the project lead (D1): reference cell C0 |
| S13-L01-I13 | list-item | /changelog/#changes | yes | /full/#changes | yes | 30 Oct: brief V0 shown at the start of every run lane; brief continuit |
| S14 | section | /#tasks-outcomes | yes | /full/#tasks-outcomes | yes | Tasks with a ground truth |
| S14-H01 | heading | /#tasks-outcomes | yes | /full/#tasks-outcomes | yes | Tasks with a ground truth |
| S14-L01-I01 | list-item | /#tasks-outcomes | yes | /full/#tasks-outcomes | yes | Short concept briefs (research proposal, product idea, policy draft) |
| S14-L01-I02 | list-item | /#tasks-outcomes | yes | /full/#tasks-outcomes | yes | Planted in each: 1 false premise, 1 internal contradiction, 1 unsuppor |
| S14-L01-I03 | list-item | /#tasks-outcomes | yes | /full/#tasks-outcomes | yes | Plus 3 sound elements that should survive |
| S14-L01-I04 | list-item | /#tasks-outcomes | yes | /full/#tasks-outcomes | yes | Simulated user: attached to the brief or neutral (decided 2 Nov). Its  |
| S14-L01-I05 | list-item | /#tasks-outcomes | yes | /full/#tasks-outcomes | yes | An isolated check of each brief by each target model (100 repetitions, |
| S14-H02 | heading | /#tasks-outcomes | yes | /full/#tasks-outcomes | yes | Outcomes |
| S14-L02-I01 | list-item | /#tasks-outcomes | yes | /full/#tasks-outcomes | yes | Persistence (primary test): a planted flaw is still in the final brief |
| S14-L02-I02 | list-item | /#tasks-outcomes | yes | /full/#tasks-outcomes | yes | Spiral (key outcome): a planted flaw is amplified without new evidence |
| S14-L02-I03 | list-item | /#tasks-outcomes | yes | /full/#tasks-outcomes | yes | Coupled spiral (secondary, exploratory): spiral plus a rising trend in |
| S14-L02-I04 | list-item | /#tasks-outcomes | yes | /full/#tasks-outcomes | yes | Correction : a planted flaw is named and resolved |
| S14-L02-I05 | list-item | /#tasks-outcomes | yes | /full/#tasks-outcomes | yes | Overcorrection : a sound element is removed or reversed |
| S14-L02-I06 | list-item | /#tasks-outcomes | yes | /full/#tasks-outcomes | yes | Also: confidence drift, unearned upgrades, cost in turns and tokens; e |
| S14-L02-I07 | list-item | /#tasks-outcomes | yes | /full/#tasks-outcomes | yes | Stopping rule (exploratory, retrospective): false saturation and prema |
| S14-A01 | link | /#tasks-outcomes | yes | /full/#tasks-outcomes | yes | Stopping rule |
| F01 | paragraph | /#reference-model | yes | /full/#reference-model | yes | Reference model: Chandra, Kleiman-Weiner, Ragan-Kelley & Tenenbaum (20 |

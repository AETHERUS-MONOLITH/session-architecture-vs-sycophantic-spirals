// Test matrix GATE1_PLAN section 7 B1-B10 on the pure model (src/lib/timeline.ts).
import { describe, expect, it } from 'vitest';
import cfgJson from '../../content/conditions.json';
import { buildLane, buildModel, buildTrack, flatBlocks, isCore, searchFromState, stateFromSearch, AD01_TITLE, LENGTHS, type Conditions, type Hand, type Inst, type TrackNode } from '../../src/lib/timeline';

const cfg = cfgJson as unknown as Conditions;
const CUT = ['C1', 'C1R', 'C2', 'C2X', 'C3', 'C4'];
const S: Record<number, number> = { 2: 20, 5: 8, 10: 4, 20: 2 };
const cond = (id: string) => cfg.CONDS.find((c) => c.id === id)!;
const blocks = (c: string, n: number, ad01 = true) => flatBlocks(buildTrack(cfg, c, n, { ad01 }));
const count = (c: string, n: number, pred: (cls: string) => boolean, ad01 = true) => blocks(c, n, ad01).filter((b) => pred(b.cls)).length;
const hands = (t: TrackNode[]) => t.filter((x): x is Hand => x.kind === 'hand');
const insts = (t: TrackNode[]) => t.filter((x): x is Inst => x.kind === 'inst');
const has = (cls: string, k: string) => cls.split(' ').includes(k);

describe('constants extracted from the source script', () => {
  it('BUDGET 40, GATE 1.6, 8 conditions in source order, labels', () => {
    expect(cfg.BUDGET).toBe(40);
    expect(cfg.GATE).toBe(1.6);
    expect(cfg.CONDS.map((c) => c.id)).toEqual(['C0', 'C0R', 'C1', 'C1R', 'C2', 'C2X', 'C3', 'C4']);
    expect(cfg.LABEL).toEqual({ C0R: 'C0+R', C1R: 'C1+R', C2X: 'C2−R' });
    expect(cfg.DEFAULT_STATE).toEqual({ n: 10, c: null });
  });
});

describe('B1 sessions and turn budget', () => {
  for (const c of CUT) for (const n of LENGTHS) {
    it(`${c} at ${n}: ${S[n]} sessions, work sums to 40`, () => {
      const lane = buildLane(cfg, cond(c), { n, c: null });
      expect(lane.sessions).toBe(S[n]);
      const work = blocks(c, n).filter((b) => has(b.cls, 'work'));
      expect(work.length).toBe(S[n]);
      expect(work.reduce((a, b) => a + (b.grow as number), 0)).toBe(40);
    });
  }
});

describe('B2 reviews', () => {
  for (const n of LENGTHS) {
    it(`length ${n}`, () => {
      for (const c of ['C1R', 'C2', 'C3', 'C4']) expect(count(c, n, (k) => has(k, 'rev'))).toBe(S[n] - 1);
      for (const c of ['C1', 'C2X']) expect(count(c, n, (k) => has(k, 'rev'))).toBe(0);
    });
  }
});

describe('B3 post-review snapshots (C3 per AD-01)', () => {
  for (const n of LENGTHS) {
    it(`length ${n}`, () => {
      for (const c of ['C1R', 'C2', 'C3', 'C4']) expect(count(c, n, (k) => has(k, 'snap'))).toBe(S[n] - 1);
      for (const c of ['C1', 'C2X']) expect(count(c, n, (k) => has(k, 'snap'))).toBe(0);
    });
    it(`length ${n}: the source drawing (ad01 off) has no C3 snapshot`, () => {
      expect(count('C3', n, (k) => has(k, 'snap'), false)).toBe(0);
    });
    it(`length ${n}: every C3 review is directly followed by a snapshot titled as in C2`, () => {
      for (const i of insts(buildTrack(cfg, 'C3', n)).filter((x) => x.cls === '')) {
        const idx = i.children.findIndex((b) => has(b.cls, 'rev'));
        if (idx < 0) continue;
        expect(i.children[idx + 1].cls).toBe('snap');
        expect(i.children[idx + 1].title).toBe(AD01_TITLE);
        expect(i.children[idx + 1].grow).toBe(0.3);
      }
      const c2snap = blocks('C2', n).find((b) => has(b.cls, 'snap'))!;
      expect(c2snap.title).toBe(AD01_TITLE);
    });
  }
  it('C3 snapshots per run: 19 / 7 / 3 / 1', () => {
    expect(LENGTHS.map((n) => count('C3', n, (k) => has(k, 'snap')))).toEqual([19, 7, 3, 1]);
  });
});

describe('B4 summaries, reports, instances', () => {
  for (const n of LENGTHS) {
    it(`length ${n}`, () => {
      for (const c of ['C1', 'C1R']) expect(count(c, n, (k) => k === 'sum')).toBe(S[n] - 1);
      for (const c of ['C2', 'C2X', 'C4']) expect(count(c, n, (k) => k === 'rep')).toBe(S[n] - 1);
      expect(count('C3', n, (k) => k === 'rep')).toBe(0);
      expect(count('C3', n, (k) => k === 'rep ind')).toBe(S[n] - 1);
      const c3 = buildLane(cfg, cond('C3'), { n, c: null });
      expect(c3.instances).toBe(2 * S[n] - 1);
      expect(insts(c3.track).length).toBe(2 * S[n] - 1);
      expect(c3.meta).toEqual([`${S[n]} sessions`, `${2 * S[n] - 1} instances`]);
      for (const c of ['C1', 'C1R', 'C2', 'C2X', 'C4']) {
        const l = buildLane(cfg, cond(c), { n, c: null });
        expect(l.meta).toEqual([`${S[n]} sessions`, `${S[n]} instances`]);
        expect(insts(l.track).length).toBe(S[n]);
      }
    });
  }
});

describe('B5 cut labels', () => {
  for (const n of LENGTHS) {
    it(`length ${n}`, () => {
      for (const c of ['C1', 'C1R']) expect(hands(buildTrack(cfg, c, n)).map((h) => h.label)).toEqual(Array(S[n] - 1).fill('summary + brief'));
      for (const c of ['C2', 'C2X', 'C4']) expect(hands(buildTrack(cfg, c, n)).map((h) => h.label)).toEqual(Array(S[n] - 1).fill('report + brief'));
      expect(hands(buildTrack(cfg, 'C3', n)).map((h) => h.label)).toEqual(Array(S[n] - 1).fill(['transcript', 'report + brief']).flat());
    });
  }
});

describe('B6 C4 alternates model families', () => {
  for (const n of LENGTHS) {
    it(`length ${n}: model-B sessions are the odd indices`, () => {
      const sessions = insts(buildTrack(cfg, 'C4', n));
      const mbIdx = sessions.map((s, i) => (s.cls === 'mb' ? i : -1)).filter((i) => i >= 0);
      expect(mbIdx.length).toBe(Math.floor(S[n] / 2));
      expect(mbIdx.every((i) => i % 2 === 1)).toBe(true);
      for (const s of sessions) {
        for (const b of s.children) {
          if (['work', 'rev', 'snap'].some((k) => has(b.cls, k))) expect(has(b.cls, 'mb')).toBe(s.cls === 'mb');
          if (has(b.cls, 'rep')) expect(has(b.cls, 'mb')).toBe(false);
        }
      }
    });
  }
  it('model-B session counts 10 / 4 / 2 / 1', () => {
    expect(LENGTHS.map((n) => insts(buildTrack(cfg, 'C4', n)).filter((s) => s.cls === 'mb').length)).toEqual([10, 4, 2, 1]);
  });
});

describe('B7 C0 and C0+R have no length factor', () => {
  const ref0 = JSON.stringify(buildTrack(cfg, 'C0', 10));
  const refR = JSON.stringify(buildTrack(cfg, 'C0R', 10));
  for (const n of LENGTHS) {
    it(`unaffected by length ${n}`, () => {
      expect(JSON.stringify(buildTrack(cfg, 'C0', n))).toBe(ref0);
      expect(JSON.stringify(buildTrack(cfg, 'C0R', n))).toBe(refR);
      expect(buildLane(cfg, cond('C0'), { n, c: null }).meta).toEqual(['1 session', '1 instance']);
      expect(buildLane(cfg, cond('C0R'), { n, c: null }).meta).toEqual(['1 session', '3 reviews']);
    });
  }
  it('C0: one block of 40 turns', () => {
    const b = blocks('C0', 10).filter((x) => has(x.cls, 'work'));
    expect(b).toHaveLength(1);
    expect(b[0].grow).toBe(40);
    expect(b[0].label).toBe('40 turns');
  });
  it('C0+R: reviews and snapshots after turns 10, 20, 30', () => {
    const b = blocks('C0R', 10);
    expect(b.filter((x) => x.cls === 'rev').map((x) => x.title)).toEqual([10, 20, 30].map((t) => 'Review step inside the same context, after turn ' + t));
    expect(b.filter((x) => x.cls === 'snap').map((x) => x.title)).toEqual([10, 20, 30].map((t) => 'Post-review brief, recorded by a side call after the review at turn ' + t));
    expect(b.filter((x) => x.cls === 'work').map((x) => x.grow)).toEqual([10, 10, 10, 10]);
  });
});

describe('B8 V0 first, score last', () => {
  for (const c of cfg.CONDS.map((x) => x.id)) for (const n of LENGTHS) {
    it(`${c} at ${n}`, () => {
      const t = buildTrack(cfg, c, n);
      expect(t[0]).toMatchObject({ kind: 'blk', cls: 'v0', label: 'V0' });
      expect(t[t.length - 1]).toMatchObject({ kind: 'blk', cls: 'score', label: 'score' });
    });
  }
});

describe('B9 core, extension and optional flags', () => {
  it('10 core cells: C0, C0+R and C1, C1+R, C2, C4 at lengths 2 and 10', () => {
    const cells: string[] = ['C0', 'C0R'];
    for (const c of CUT) for (const n of LENGTHS) if (isCore(cfg, c, n)) cells.push(`${c}-${n}`);
    expect(cells).toEqual(['C0', 'C0R', 'C1-2', 'C1-10', 'C1R-2', 'C1R-10', 'C2-2', 'C2-10', 'C4-2', 'C4-10']);
  });
  for (const n of LENGTHS) {
    it(`lane suffixes at length ${n}`, () => {
      const m = buildModel(cfg, { n, c: null });
      const suf = Object.fromEntries(m.lanes.map((l) => [l.id, l.suffix]));
      expect(suf.C0).toBe('');
      expect(suf.C0R).toBe('');
      for (const c of ['C1', 'C1R', 'C2', 'C4']) expect(suf[c]).toBe(n === 5 || n === 20 ? ' · ext.' : '');
      expect(suf.C3).toBe(' · ext.');
      expect(suf.C2X).toBe(' · opt.');
    });
  }
});

describe('B10 dense class', () => {
  it('dense at n <= 5', () => {
    expect(LENGTHS.map((n) => buildModel(cfg, { n, c: null }).dense)).toEqual([true, true, false, false]);
  });
});

describe('URL state (enhancement)', () => {
  it('defaults to the source default', () => {
    expect(stateFromSearch(cfg, '')).toEqual({ n: 10, c: null });
    expect(stateFromSearch(cfg, '?c=XX&n=7')).toEqual({ n: 10, c: null });
  });
  it('round-trips', () => {
    for (const c of cfg.CONDS.map((x) => x.id)) for (const n of LENGTHS) {
      expect(stateFromSearch(cfg, searchFromState(cfg, { c, n }))).toEqual({ c, n });
    }
    expect(searchFromState(cfg, { c: null, n: 10 })).toBe('');
  });
});

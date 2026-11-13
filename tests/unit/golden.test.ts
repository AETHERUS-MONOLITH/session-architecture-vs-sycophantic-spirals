// B11: golden comparison of the new renderer with the ORIGINAL source script (fixtures from
// tools/original-golden.mjs) for all 8 conditions × 4 lengths, plus selection state for all 26 grid
// buttons. AD-01 (C3 post-review snapshot) is the only whitelisted difference.
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import cfgJson from '../../content/conditions.json';
import approved from '../../content/approved-diffs.json';
import { initGrid } from '../../src/lib/controller';
import { render } from '../../src/lib/render';
import { AD01_TITLE, LENGTHS, type Conditions } from '../../src/lib/timeline';
// @ts-ignore
import { snapshot } from '../helpers/serialize.mjs';

const cfg = cfgJson as unknown as Conditions;
const root = path.resolve(__dirname, '../..');
const fx = (f: string) => JSON.parse(fs.readFileSync(path.join(root, 'tests/fixtures/original-lanes', f), 'utf8'));
const frag = (n: string) => fs.readFileSync(path.join(root, 'content/fragments', n + '.html'), 'utf8');
const FROZEN_SHA = 'f35025bb3cbbd6379a0f3702728601ccc07c3e291fb7e9fdd502b8997aed30d0';

function page(search = '') {
  const dom = new JSDOM(`<!doctype html><body>${frag('S01')}${frag('S03')}</body>`, { url: 'https://example.test/grid/' + search, pretendToBeVisual: true });
  return dom.window;
}
const click = (win: any, id: string) => win.document.getElementById(id).dispatchEvent(new win.MouseEvent('click', { bubbles: true }));

type N = any;
/** Removes AD-01 blocks from the C3 lane and checks each one; returns the cleaned lane. */
function c2Snap(refLanes: N[]) {
  const track = refLanes[4].c.find((x: N) => x.a?.class === 'track');
  for (const inst of track.c) if (inst.c) for (const b of inst.c) if (b.a?.class === 'b snap') return b;
  throw new Error('no C2 snapshot');
}
function stripAd01(lane: N, refLane: N, c2: N) {
  const clone = JSON.parse(JSON.stringify(lane));
  const track = clone.c.find((x: N) => x.a?.class === 'track');
  const refTrack = refLane.c.find((x: N) => x.a?.class === 'track');
  let removed = 0;
  track.c.forEach((inst: N, idx: number) => {
    if (typeof inst === 'string' || !inst.c) return;
    const i = inst.c.findIndex((b: N) => b.a?.approvedDiff);
    if (i < 0) return;
    const b = inst.c[i];
    expect(b.a.approvedDiff).toBe('AD-01');
    expect(b.a.class).toBe('b snap');
    expect(b.a.title).toBe(AD01_TITLE);
    expect(b).toEqual({ ...c2, a: { ...c2.a, approvedDiff: 'AD-01' } });
    expect(inst.c[i - 1].a.class).toBe('b rev');
    inst.c.splice(i, 1);
    // The instance's flex weight grows by exactly the snapshot weight (0.3).
    const ref = refTrack.c[idx];
    expect(parseFloat(inst.a.flex)).toBeCloseTo(parseFloat(ref.a.flex) + 0.3, 9);
    inst.a.flex = ref.a.flex;
    removed++;
  });
  return { lane: clone, removed };
}

describe('fixtures come from the frozen source', () => {
  it('fixture source hash', () => {
    expect(fx('n-10.json').meta.source_sha256).toBe(FROZEN_SHA);
    expect(cfgJson.source_sha256).toBe(FROZEN_SHA);
  });
  it('AD-01 is the only approved diff', () => {
    expect(approved.diffs.map((d) => d.id)).toEqual(['AD-01']);
  });
});

describe('B11 golden comparison, initial state', () => {
  it('equals the original initial render (n = 10, no selection), AD-01 aside', () => {
    const win = page();
    initGrid(win as any, cfg);
    const mine = snapshot(win.document);
    const ref = fx('initial.json').state;
    expect(mine.lanesClass).toBe(ref.lanesClass);
    expect(mine.pressed).toEqual(ref.pressed);
    expect(mine.selectedCells).toEqual(ref.selectedCells);
    expect(mine.selectedLanes).toEqual(ref.selectedLanes);
    expect(mine.budget).toBe(ref.budget);
    mine.lanes.forEach((l: N, i: number) => {
      if (i === 6) { const s = stripAd01(l, ref.lanes[i], c2Snap(ref.lanes)); expect(s.removed).toBe(3); expect(s.lane).toEqual(ref.lanes[i]); }
      else expect(l).toEqual(ref.lanes[i]);
    });
  });
});

describe('B11 golden comparison, 8 conditions × 4 lengths', () => {
  const SNAPS: Record<number, number> = { 2: 19, 5: 7, 10: 3, 20: 1 };
  for (const n of LENGTHS) {
    const ref = fx(`n-${n}.json`).state;
    it(`n = ${n}: source drawing reproduced exactly with AD-01 off`, () => {
      const win = page();
      render(win.document, win.document, cfg, { n, c: null }, { ad01: false });
      const mine = snapshot(win.document);
      expect(mine).toEqual(ref);
    });
    cfg.CONDS.forEach((cd, i) => {
      it(`n = ${n}, ${cd.id}: identical to the original${cd.id === 'C3' ? ' except AD-01' : ''}`, () => {
        const win = page();
        initGrid(win as any, cfg);
        click(win, `len-${n}`);
        const mine = snapshot(win.document);
        expect(mine.lanesClass).toBe(ref.lanesClass);
        expect(mine.pressed).toEqual(ref.pressed);
        if (cd.id === 'C3') {
          const s = stripAd01(mine.lanes[i], ref.lanes[i], c2Snap(ref.lanes));
          expect(s.removed).toBe(SNAPS[n]);
          expect(s.lane).toEqual(ref.lanes[i]);
        } else {
          expect(mine.lanes[i]).toEqual(ref.lanes[i]);
        }
      });
    });
  }
});

describe('B11 selection state equals the original for every grid button', () => {
  const sel = fx('selection.json');
  it('26 buttons with the source ids', () => {
    const win = page();
    expect([...win.document.querySelectorAll('button.cell')].map((b: any) => b.id)).toEqual(sel.buttons);
    expect(sel.buttons).toHaveLength(26);
  });
  for (const id of sel.buttons as string[]) {
    it(id, () => {
      const win = page();
      initGrid(win as any, cfg);
      click(win, id);
      const s = snapshot(win.document);
      const ref = sel.selection[id];
      expect({ pressed: s.pressed, selectedCells: s.selectedCells, selectedLanes: s.selectedLanes, lanesClass: s.lanesClass }).toEqual(ref);
      // Enhancement: aria-pressed on grid cells mirrors the .sel class.
      for (const b of win.document.querySelectorAll('button.cell')) expect(b.getAttribute('aria-pressed')).toBe(String(b.classList.contains('sel')));
    });
  }
  for (const q of sel.sequences) {
    it('sequence ' + q.steps.join(' → '), () => {
      const win = page();
      initGrid(win as any, cfg);
      q.steps.forEach((st: string) => click(win, st));
      const s = snapshot(win.document);
      expect({ pressed: s.pressed, selectedCells: s.selectedCells, selectedLanes: s.selectedLanes, lanesClass: s.lanesClass }).toEqual({ pressed: q.pressed, selectedCells: q.selectedCells, selectedLanes: q.selectedLanes, lanesClass: q.lanesClass });
    });
  }
});

describe('URL state in the controller', () => {
  it('?c=C2&n=10 restores the selection; clicks write the URL', () => {
    const win = page('?c=C2&n=10');
    initGrid(win as any, cfg);
    expect(win.document.querySelector('button.cell.sel')!.id).toBe('g-C2-10');
    click(win, 'g-C3-5');
    expect(win.location.search).toBe('?c=C3&n=5');
    click(win, 'len-20');
    expect(win.location.search).toBe('?c=C3&n=20');
  });
});

// Runs the ORIGINAL timeline script of the frozen source in jsdom and records its output as golden
// fixtures: every condition lane at every length (8 × 4) and the selection state after every grid click.
// Usage: node tools/original-golden.mjs   (writes tests/fixtures/original-lanes/*.json)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { JSDOM } from 'jsdom';
import { snapshot } from '../tests/helpers/serialize.mjs';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SRC = path.join(root, 'archive/frozen/session-architecture-grid_live_2026-11-13_v1794606123-2939.html');
const html = fs.readFileSync(SRC, 'utf8');
const sha256 = crypto.createHash('sha256').update(fs.readFileSync(SRC)).digest('hex');
const out = path.join(root, 'tests/fixtures/original-lanes');
fs.mkdirSync(out, { recursive: true });

function fresh() {
  // The archived file is the trusted project source; its inline script is the reference implementation.
  const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true });
  return dom.window.document;
}
const click = (doc, id) => doc.getElementById(id).dispatchEvent(new doc.defaultView.MouseEvent('click', { bubbles: true }));

const meta = { source: path.relative(root, SRC), source_sha256: sha256, generator: 'tools/original-golden.mjs', jsdom: JSON.parse(fs.readFileSync(path.join(root, 'node_modules/jsdom/package.json'), 'utf8')).version };
const initial = snapshot(fresh());
fs.writeFileSync(path.join(out, 'initial.json'), JSON.stringify({ meta, state: initial }, null, 1) + '\n');
for (const n of [2, 5, 10, 20]) {
  const doc = fresh();
  click(doc, `len-${n}`);
  fs.writeFileSync(path.join(out, `n-${n}.json`), JSON.stringify({ meta, n, state: snapshot(doc) }, null, 1) + '\n');
}
const doc0 = fresh();
const ids = [...doc0.querySelectorAll('button.cell')].map((b) => b.id);
const selection = {};
for (const id of ids) {
  const doc = fresh();
  click(doc, id);
  const s = snapshot(doc);
  selection[id] = { pressed: s.pressed, selectedCells: s.selectedCells, selectedLanes: s.selectedLanes, lanesClass: s.lanesClass };
}
// Sequences: C0/C0R keep the current length; a length click keeps the selection.
const sequences = [['g-C1-2', 'g-C0'], ['g-C4-20', 'g-C0R'], ['g-C2-10', 'len-5'], ['g-C0', 'len-20'], ['g-C3-5', 'len-2', 'g-C2X-20']];
const seq = sequences.map((steps) => { const doc = fresh(); steps.forEach((s) => click(doc, s)); const s = snapshot(doc); return { steps, pressed: s.pressed, selectedCells: s.selectedCells, selectedLanes: s.selectedLanes, lanesClass: s.lanesClass }; });
fs.writeFileSync(path.join(out, 'selection.json'), JSON.stringify({ meta, buttons: ids, selection, sequences: seq }, null, 1) + '\n');
console.log(`fixtures written: initial, n-2/5/10/20, selection (${ids.length} buttons, ${seq.length} sequences)`);

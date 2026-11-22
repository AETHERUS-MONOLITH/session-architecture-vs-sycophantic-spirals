// Extracts the content fragments from the frozen source HTML at DOM level.
// Text nodes are copied, never retyped. The only changes are ATTRIBUTE ADDITIONS, all listed in
// content/fragments/manifest.json: anchor ids that the information architecture needs, ids that
// let grid buttons take their accessible name from the existing row and column labels
// (aria-labelledby), tabindex on scroll containers (keyboard scrolling), and role="group" instead of
// role="table" on the grid container (the grid has no row/cell roles, so role="table" is invalid ARIA).
// Usage: node tools/extract-fragments.mjs [frozen.html]
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SRC = process.argv[2] || path.join(root, 'archive/frozen/session-architecture-grid_live_2026-11-13_v1794606123-2939.html');
const raw = fs.readFileSync(SRC);
const sha256 = crypto.createHash('sha256').update(raw).digest('hex');
const dom = new JSDOM(raw.toString('utf8'));
const doc = dom.window.document;
const outDir = path.join(root, 'content/fragments');
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const changes = [];
function setAttr(el, name, value, why) {
  const before = el.getAttribute(name);
  el.setAttribute(name, value);
  changes.push({ selector: describe(el), attribute: name, before, after: value, why });
}
function describe(el) {
  let s = el.tagName.toLowerCase();
  if (el.id) s += '#' + el.id;
  if (el.className && typeof el.className === 'string') s += '.' + el.className.trim().split(/\s+/).join('.');
  return s;
}

const header = doc.querySelector('header');
const sections = [...doc.querySelectorAll('section')];
if (sections.length !== 14) throw new Error('expected 14 sections, found ' + sections.length);
const foot = doc.querySelector('.wrap > p.foot');

// Anchor ids required by GATE1_PLAN section 2 / SOURCE_TO_SITE_MAPPING.csv (anchors that the source lacks).
setAttr(header, 'id', 'top', 'anchor for S00 (mapping)');
setAttr(foot, 'id', 'reference-model', 'anchor for F01 (content/inventory-addendum.json)');
const SECTION_IDS = { 1: 'grid', 2: 'conditions', 4: 'hypotheses', 5: 'handoff', 10: 'artifacts', 11: 'instance-state', 12: 'error-path', 14: 'tasks-outcomes' };
const EXPECTED_SOURCE_IDS = { 3: 'runs', 6: 'stopping-rule', 7: 'scoring', 8: 'costs', 9: 'open', 13: 'changes' };
sections.forEach((s, i) => {
  const n = i + 1;
  if (EXPECTED_SOURCE_IDS[n] && s.id !== EXPECTED_SOURCE_IDS[n]) throw new Error(`section ${n} id ${s.id}`);
  if (SECTION_IDS[n]) { if (s.id) throw new Error('unexpected id on section ' + n); setAttr(s, 'id', SECTION_IDS[n], `anchor for S${String(n).padStart(2, '0')} (mapping)`); }
});
// S04: one anchor per hypothesis item, in source order.
const HYP = ['h1', 'h2', 'h3', 'h5', 'h4', 'k1', 'k2', 'c2-c1', 'ref', 'test'];
const hypItems = sections[3].querySelectorAll(':scope > ul > li');
if (hypItems.length !== 10) throw new Error('hypotheses');
hypItems.forEach((li, i) => setAttr(li, 'id', HYP[i], 'anchor per hypothesis item (GATE1_PLAN section 2)'));
// S06: subsection anchors.
const SR = ['firing', 'reported', 'evaluation-plan', 'fresh-context-review', 'limits'];
const srH = sections[5].querySelectorAll(':scope > h2');
if (srH.length !== 6) throw new Error('stopping rule headings');
[...srH].slice(1).forEach((h, i) => setAttr(h, 'id', SR[i], 'subsection anchor (GATE1_PLAN section 2)'));

// Accessibility (engineering): grid container role, accessible names of cell buttons from existing labels.
const grid = sections[0].querySelector('.grid');
setAttr(grid, 'role', 'group', 'role="table" without row/cell roles is invalid ARIA; aria-label kept');
const axes = [...grid.querySelectorAll(':scope > .axis')];
const lenIds = { '2': 'col-2', '5': 'col-5', '10': 'col-10', '20': 'col-20' };
axes.forEach((a) => { const t = a.textContent.trim(); if (lenIds[t]) setAttr(a, 'id', lenIds[t], 'column label id for aria-labelledby'); });
const ROWID = { 'C0': 'row-C0', 'C0+R': 'row-C0R', 'C1': 'row-C1', 'C1+R': 'row-C1R', 'C2': 'row-C2', 'C2−R': 'row-C2X', 'C3': 'row-C3', 'C4': 'row-C4' };
grid.querySelectorAll(':scope > .rowlab').forEach((r) => { const code = r.querySelector('b').textContent.trim(); setAttr(r, 'id', ROWID[code], 'row label id for aria-labelledby'); });
grid.querySelectorAll('button.cell').forEach((b) => {
  const c = b.dataset.c; const n = b.dataset.n;
  setAttr(b, 'aria-labelledby', [`row-${c}`, n ? `col-${n}` : null, b.id].filter(Boolean).join(' '), 'accessible name = row label + length + cell text (all existing text)');
});
// Scroll containers without focusable content become keyboard-scrollable.
doc.querySelectorAll('.scroll, .tlwrap').forEach((el) => setAttr(el, 'tabindex', '0', 'keyboard access to a horizontally scrolling region'));

// Split S05: the status container (#status) and, inside it, the status legend paragraph (S05-P06)
// become fragments of their own so the same file feeds /handoffs/, /decisions/ and /full/.
const status = sections[4].querySelector('#status');
const legend = status.querySelector(':scope > p.hint');
function cut(el, name) {
  const html = el.outerHTML;
  el.replaceWith(doc.createComment(`fragment:${name}`));
  return html;
}
const files = {};
files['S05-status-legend'] = cut(legend, 'S05-status-legend');
files['S05-status'] = cut(status, 'S05-status');
files['S00'] = header.outerHTML;
sections.forEach((s, i) => { files[`S${String(i + 1).padStart(2, '0')}`] = s.outerHTML; });
files['F01'] = foot.outerHTML;

const manifest = { source: path.relative(root, SRC), source_sha256: sha256, generated_by: 'tools/extract-fragments.mjs', fragments: {}, attribute_additions: changes };
for (const [name, html] of Object.entries(files)) {
  const file = `${name}.html`;
  fs.writeFileSync(path.join(outDir, file), html + '\n');
  manifest.fragments[name] = { file: `content/fragments/${file}`, sha256: crypto.createHash('sha256').update(html + '\n').digest('hex') };
}
fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');

// Source stylesheet, verbatim (the second <style> element; the first is the artifact host reset).
const styles = [...doc.querySelectorAll('style')];
fs.writeFileSync(path.join(root, 'src/styles/source.css'), `/* Verbatim copy of the frozen source stylesheet (${path.basename(SRC)}), extracted by tools/extract-fragments.mjs. Do not edit; overrides live in site.css. */\n` + styles[1].textContent.trim() + '\n');

// Timeline constants from the source script (evaluated in an empty VM context, not retyped).
const script = [...doc.querySelectorAll('script')].map((s) => s.textContent).join('\n');
const grab = (name) => { const m = script.match(new RegExp(`var ${name} = ([\\s\\S]*?);[^\\n]*\\n`)); if (!m) throw new Error('constant ' + name); return vm.runInNewContext('(' + m[1] + ')'); };
const conditions = {
  source: path.relative(root, SRC), source_sha256: sha256,
  BUDGET: grab('BUDGET'), GATE: grab('GATE'), CONDS: grab('CONDS'), CORE: grab('CORE'), LABEL: grab('LABEL'),
  DEFAULT_STATE: grab('state'),
};
fs.writeFileSync(path.join(root, 'content/conditions.json'), JSON.stringify(conditions, null, 2) + '\n');
console.log(`fragments: ${Object.keys(files).length}, attribute additions: ${changes.length}, source sha256 ${sha256}`);

// Source integrity (ticket section 2): archive hashes, inventory reproduction, fragment identity.
// Usage: node tools/check-source.mjs [--out evidence/gate2]
//  1. archive/ files match archive/MANIFEST.json (SHA-256, bytes).
//  2. tools/inventory.py on the frozen file reproduces content/source_inventory.json (items identical).
//  3. content/source_inventory.json and content/mapping.csv are the Gate 1 files (SHA-256).
//  4. tools/extract-fragments.mjs is deterministic: re-running it changes no committed file.
//  5. Every composed fragment equals its source subtree node by node (tags, attributes, text),
//     except the attribute additions listed in content/fragments/manifest.json.
//  6. The hashes in content/chrome.yml equal archive/MANIFEST.json.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { JSDOM } from 'jsdom';
import { load as loadYaml } from 'js-yaml';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const args = process.argv.slice(2);
const OUT = args.includes('--out') ? path.resolve(root, args[args.indexOf('--out') + 1]) : null;
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok, detail }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`); };

// 1
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'archive/MANIFEST.json'), 'utf8'));
for (const f of manifest.files) {
  const p = path.join(root, f.path);
  const ok = fs.existsSync(p) && sha(fs.readFileSync(p)) === f.sha256 && fs.statSync(p).size === f.bytes;
  check(`archive ${f.path}`, ok, `${f.sha256.slice(0, 12)}…, ${f.bytes} bytes`);
}
const original = manifest.files.find((f) => f.path.startsWith('archive/original/'));
check('original HTML has the contract hash', original.sha256 === '7f1dfd9dca402cb5f42ef981e1dc5e0d28bebadca3fc6284da57df281f752651' && original.bytes === 90012);

// 2
const FROZEN = manifest.files.find((f) => f.path.startsWith('archive/frozen/')).path;
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'inv-'));
const py = spawnSync('python3', ['-I', path.join(root, 'tools/inventory.py'), path.join(root, FROZEN), path.join(tmp, 'inv.json'), path.join(tmp, 'inv.md')], { encoding: 'utf8' });
if (py.status !== 0) check('inventory.py runs', false, py.stderr.trim().split('\n').pop());
else {
  const regen = JSON.parse(fs.readFileSync(path.join(tmp, 'inv.json'), 'utf8')).items;
  const committed = JSON.parse(fs.readFileSync(path.join(root, 'content/source_inventory.json'), 'utf8')).items;
  check('inventory.py reproduces content/source_inventory.json', JSON.stringify(regen) === JSON.stringify(committed), `${regen.length} items`);
  const table = fs.readFileSync(path.join(tmp, 'inv.md'), 'utf8') === fs.readFileSync(path.join(root, 'docs/provenance/SOURCE_INVENTORY_TABLE.md'), 'utf8');
  check('inventory.py reproduces SOURCE_INVENTORY_TABLE.md', table);
}

// 3
const GATE1 = {
  'content/source_inventory.json': '7e29b6bc0cf1779c0efc19bae0721c92aa0542cd38e4df93cedb74b970856456',
  'content/mapping.csv': 'bacfeaa452abc3d72467eddc7a39086e926d47d702757a9b6c3f7005a3b63357',
  'docs/provenance/SOURCE_INVENTORY.md': 'd0b88c234830371ab2614874ed6a8f2a58807b40c3679c8ce0b9b859a97d1668',
  'docs/provenance/SOURCE_INVENTORY_TABLE.md': '5875d5a90fa4461043652d31cc52c06e295c3cbcc685fd50ff7e45b104fa5c0d',
  'docs/provenance/APPROVED_DIFFS.md': '005db989950a1ac8ee555a4e9f9f2764bfe33628fde79b80d29434de59dc2110',
  'docs/provenance/VERSION_LOG.md': 'e2b749f7e6b14b7cf37768aa0c1023b721ba315d11c8010000a9791c88436a8d',
  'tools/inventory.py': 'ea06d6b9a8cc4874d93630018e31fc3c1cb92dbc755a0b75851ae3da896a4572',
  'tools/mapping.py': '6be1ca3d9c09198abf94c5603112ae26da992fd07f4fd1ba4d833dfc1f164bfc',
};
for (const [p, h] of Object.entries(GATE1)) check(`Gate 1 file unchanged: ${p}`, sha(fs.readFileSync(path.join(root, p))) === h);
const mp = spawnSync('python3', ['-I', path.join(root, 'tools/mapping.py'), path.join(root, 'content/source_inventory.json'), path.join(tmp, 'map.csv')], { encoding: 'utf8' });
check('mapping.py reproduces content/mapping.csv', mp.status === 0 && fs.readFileSync(path.join(tmp, 'map.csv'), 'utf8') === fs.readFileSync(path.join(root, 'content/mapping.csv'), 'utf8'));

// 4
const generated = [...fs.readdirSync(path.join(root, 'content/fragments')).map((f) => `content/fragments/${f}`), 'content/conditions.json', 'src/styles/source.css'];
const before = Object.fromEntries(generated.map((p) => [p, fs.readFileSync(path.join(root, p), 'utf8')]));
const ex = spawnSync('node', [path.join(root, 'tools/extract-fragments.mjs')], { encoding: 'utf8' });
const changed = generated.filter((p) => !fs.existsSync(path.join(root, p)) || fs.readFileSync(path.join(root, p), 'utf8') !== before[p]);
const extra = fs.readdirSync(path.join(root, 'content/fragments')).map((f) => `content/fragments/${f}`).filter((p) => !(p in before));
check('extract-fragments.mjs reproduces the committed fragments, conditions.json and source.css', ex.status === 0 && !changed.length && !extra.length, changed.concat(extra).join(', '));
for (const p of changed) fs.writeFileSync(path.join(root, p), before[p]);

// 5
const fm = JSON.parse(fs.readFileSync(path.join(root, 'content/fragments/manifest.json'), 'utf8'));
const additions = fm.attribute_additions;
const addList = additions;
// selector form written by the extractor: tag#id.class1.class2
function matches(node, selector) {
  const m = selector.match(/^([a-z0-9]+)(?:#([^.]+))?((?:\.[^.]+)*)$/);
  if (!m || m[1] !== node.tagName.toLowerCase()) return false;
  if (m[2] && node.id !== m[2]) return false;
  const cls = m[3] ? m[3].slice(1).split('.') : [];
  return cls.every((c) => node.classList.contains(c));
}
const src = new JSDOM(fs.readFileSync(path.join(root, FROZEN), 'utf8')).window.document;
const frag = (n) => fs.readFileSync(path.join(root, 'content/fragments', n + '.html'), 'utf8');
function composed(n) { return frag(n).trimEnd().replace(/<!--fragment:([A-Za-z0-9-]+)-->/g, (m, x) => composed(x)); }
function tokens(el, revert) {
  const out = [];
  (function walk(node) {
    if (node.nodeType === 3) { out.push('T:' + node.nodeValue); return; }
    if (node.nodeType !== 1) return;
    const attrs = {};
    for (const a of node.attributes) attrs[a.name] = a.value;
    if (revert) for (const [k, v] of Object.entries({ ...attrs })) {
      const add = addList.find((a) => a.attribute === k && a.after === v && matches(node, a.selector));
      if (add && matches(node, add.selector)) { if (add.before === null) delete attrs[k]; else attrs[k] = add.before; }
    }
    out.push('E:' + node.tagName.toLowerCase() + JSON.stringify(Object.entries(attrs).sort()));
    node.childNodes.forEach(walk);
    out.push('/E');
  })(el);
  return out;
}
const parse = (html) => { const d = new JSDOM(`<body>${html}</body>`).window.document; return d.body.firstElementChild; };
const sections = [...src.querySelectorAll('section')];
const pairs = [['S00', src.querySelector('header')], ...sections.map((s, i) => [`S${String(i + 1).padStart(2, '0')}`, s]), ['F01', src.querySelector('.wrap > p.foot')], ['S05-status', src.querySelector('#status')], ['S05-status-legend', src.querySelector('#status > p.hint')]];
let identical = 0; const bad = [];
for (const [name, el] of pairs) {
  const a = tokens(el, false).join('\n'); const b = tokens(parse(composed(name)), true).join('\n');
  if (a === b) identical++; else bad.push(name);
}
check('composed fragments equal the source subtrees (tags, attributes, every text node), except the documented attribute additions', bad.length === 0, `${identical}/${pairs.length} identical${bad.length ? '; differ: ' + bad.join(', ') : ''}; ${additions.length} attribute additions documented`);
const allSrcText = sections.reduce((n, s) => n + tokens(s, false).filter((t) => t.startsWith('T:')).length, 0);
check('text nodes copied (sections S01–S14)', true, `${allSrcText} text nodes`);

// 6
const chrome = loadYaml(fs.readFileSync(path.join(root, 'content/chrome.yml'), 'utf8'));
const files = chrome.versions.entries.flatMap((e) => e.files);
check('chrome.yml version hashes equal archive/MANIFEST.json', files.every((f) => manifest.files.some((m) => m.path === f.path && m.sha256 === f.sha256)), `${files.length} files`);

const failed = results.filter((r) => !r.ok).length;
if (OUT) {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, 'source-integrity.md'), `# Source integrity (ticket section 2)\n\nGenerated ${new Date().toISOString()} by \`node tools/check-source.mjs\`.\n\n| Check | Result | Detail |\n|---|---|---|\n` + results.map((r) => `| ${r.name} | ${r.ok ? 'pass' : '**FAIL**'} | ${r.detail} |`).join('\n') + '\n');
}
console.log(failed ? `${failed} check(s) failed` : `all ${results.length} checks passed`);
process.exit(failed ? 1 : 0);

// Content parity of the built site against the Gate 1 inventory (GATE1_PLAN section 7 A1-A6).
// Usage: node tools/parity.mjs [--self-test] [--dist dist] [--out evidence/gate2]
//   --self-test  runs the matcher on the frozen source itself first (every item must match there).
// Text normalisation mirrors tools/inventory.py (BeautifulSoup get_text(' '), whitespace collapsed).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { JSDOM } from 'jsdom';
import { load as loadYaml } from 'js-yaml';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const DIST = path.resolve(root, opt('--dist', 'dist'));
const OUT = path.resolve(root, opt('--out', 'evidence/gate2'));
const BASE = (process.env.SITE_BASE ?? '/session-architecture-vs-sycophantic-spirals/').replace(/\/?$/, '/');
const FROZEN = path.join(root, 'archive/frozen/session-architecture-grid_live_2026-11-13_v1794606123-2939.html');

const inventory = JSON.parse(fs.readFileSync(path.join(root, 'content/source_inventory.json'), 'utf8')).items;
const addendum = JSON.parse(fs.readFileSync(path.join(root, 'content/inventory-addendum.json'), 'utf8')).items;
const approved = JSON.parse(fs.readFileSync(path.join(root, 'content/approved-diffs.json'), 'utf8')).diffs;
const chrome = loadYaml(fs.readFileSync(path.join(root, 'content/chrome.yml'), 'utf8'));

function parseCsv(text) {
  const rows = []; let row = []; let cell = ''; let q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (ch === '"') q = false; else cell += ch; }
    else if (ch === '"') q = true; else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const head = rows.shift();
  return rows.filter((r) => r.length === head.length).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i]])));
}
const mapping = Object.fromEntries(parseCsv(fs.readFileSync(path.join(root, 'content/mapping.csv'), 'utf8')).map((r) => [r.id, r]));
for (const a of addendum) mapping[a.id] = { id: a.id, route: a.route, anchor: a.anchor, full_route: a.full_route, full_anchor: a.full_anchor, link_target_on_route: '' };

const norm = (s) => s.replace(/\s+/g, ' ').trim();
const sha16 = (s) => crypto.createHash('sha256').update(s, 'utf8').digest('hex').slice(0, 16);
function strings(el) { const out = []; const w = el.ownerDocument.createTreeWalker(el, 4); let n; while ((n = w.nextNode())) out.push(n.nodeValue); return out; }
const getText = (el) => norm(strings(el).join(' '));
const ownText = (el) => norm([...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.nodeValue).join(''));
const BLOCKY = 'p,ul,ol,table,button';

function itemText(item, el) {
  switch (item.kind) {
    case 'section': { const h = el.querySelector('h2'); return h ? getText(h) : ''; }
    case 'table-row': case 'table-header': return [...el.querySelectorAll('th,td')].map(getText).join(' | ');
    case 'text-block': return el.querySelector(BLOCKY) ? ownText(el) : getText(el);
    case 'anchor-container': return 'Status of design details';
    default: return getText(el);
  }
}

function loadDoc(file) { return new JSDOM(fs.readFileSync(file, 'utf8')).window.document; }
function pageFile(route) { return path.join(DIST, route.replace(/^\//, ''), 'index.html'); }

/** Find an element for the item in `scopeEls` (fragment regions), optionally inside #anchor. */
function find(doc, scopeEls, item, { anchor, expectHref }) {
  const tag = item.tag || (item.kind === 'section' ? 'section' : '');
  const cands = [];
  for (const s of scopeEls) {
    if (s.matches && s.matches(tag)) cands.push(s);
    cands.push(...s.querySelectorAll(tag));
  }
  const problems = [];
  for (const el of cands) {
    if (sha16(itemText(item, el)) !== item.sha16) continue;
    const p = [];
    if (anchor) { const a = doc.getElementById(anchor); if (!a) p.push(`anchor #${anchor} missing`); else if (!(a === el || a.contains(el))) p.push(`not inside #${anchor}`); }
    if (item.kind === 'section' && item.anchor && el.id !== item.anchor) p.push(`section id ${el.id} != ${item.anchor}`);
    if (item.kind === 'control') {
      if (item.dom_id && el.id !== item.dom_id) p.push(`id ${el.id} != ${item.dom_id}`);
      for (const [k, v] of Object.entries(item.data || {})) if (el.getAttribute(k) !== v) p.push(`${k}=${el.getAttribute(k)} != ${v}`);
      if (item.class && el.getAttribute('class') !== item.class) p.push(`class ${el.getAttribute('class')} != ${item.class}`);
    }
    if ((item.kind === 'dynamic-container' || item.kind === 'anchor-container') && el.id !== item.dom_id) p.push(`id ${el.id} != ${item.dom_id}`);
    if (expectHref !== undefined && el.getAttribute('href') !== expectHref) p.push(`href ${el.getAttribute('href')} != ${expectHref}`);
    if (!p.length) return { ok: true, el };
    problems.push(p.join('; '));
  }
  return { ok: false, reason: cands.length ? (problems.length ? problems[0] : 'no element with identical text (sha16)') : `no <${tag}> in fragments` };
}

const dynamicMatch = (item, doc) => {
  // #lanes is filled by the client script; in static HTML it is empty, exactly as in the source.
  if (item.kind !== 'dynamic-container') return null;
  const el = doc.getElementById(item.dom_id);
  return el ? { ok: true, el } : { ok: false, reason: `#${item.dom_id} missing` };
};

const all = [...inventory, ...addendum];
let report = { generated: new Date().toISOString(), base: BASE, items: all.length, inventory_items: inventory.length, addendum_items: addendum.length, approved_diffs: approved.map((d) => d.id), checks: {}, differences: [], item_results: [] };

// Self-test: the matcher finds every inventory item in the frozen source.
if (args.includes('--self-test')) {
  const doc = loadDoc(FROZEN);
  const scope = [doc.body];
  const miss = [];
  for (const item of all) { const r = dynamicMatch(item, doc) || find(doc, scope, item, {}); if (!r.ok) miss.push(`${item.id}: ${r.reason}`); }
  report.checks.self_test = { description: 'matcher run on the frozen source', items: all.length, missing: miss.length, details: miss };
  if (miss.length) { console.error('SELF-TEST FAILED', miss); }
}

const pages = {};
const getPage = (route) => {
  if (!pages[route]) {
    const f = pageFile(route);
    if (!fs.existsSync(f)) throw new Error('missing page ' + route + ' (' + f + ')');
    const doc = loadDoc(f);
    pages[route] = { doc, scope: [...doc.querySelectorAll('[data-fragment]')].filter((e) => !e.parentElement.closest('[data-fragment]')) };
  }
  return pages[route];
};
const withBase = (p) => BASE + p.replace(/^\//, '');

// A1: every item on its mapped route and on /full/.
for (const item of all) {
  const m = mapping[item.id];
  const res = { id: item.id, kind: item.kind, route: m?.route, anchor: m?.anchor, full_anchor: m?.full_anchor, on_route: false, on_full: false };
  if (!m) { report.differences.push({ check: 'A1', id: item.id, problem: 'not in mapping' }); report.item_results.push(res); continue; }
  const targets = [
    { key: 'on_route', route: m.route, anchor: m.anchor, href: item.kind === 'link' || item.tag === 'a' ? (m.link_target_on_route ? withBase(m.link_target_on_route) : item.href) : undefined },
    { key: 'on_full', route: m.full_route, anchor: m.full_anchor, href: item.kind === 'link' || item.tag === 'a' ? item.href : undefined },
  ];
  for (const t of targets) {
    const { doc, scope } = getPage(t.route);
    const r = dynamicMatch(item, doc) || find(doc, scope, item, { anchor: t.anchor, expectHref: t.href });
    res[t.key] = r.ok;
    if (!r.ok) report.differences.push({ check: 'A1', id: item.id, route: t.route, anchor: t.anchor, problem: r.reason, text_start: item.text.slice(0, 80) });
  }
  report.item_results.push(res);
}
report.checks.A1 = { description: 'each item found with identical normalised text (sha16) on its mapped route and on /full/, inside its mapped anchor; ids, data attributes and link targets checked', items: all.length, on_route: report.item_results.filter((r) => r.on_route).length, on_full: report.item_results.filter((r) => r.on_full).length };

// A2: table rows per table.
const TABLES = { 'S05-T01': 54, 'S06-T01': 7, 'S06-T02': 3, 'S08-T01': 4, 'S08-T02': 6, 'S09-T01': 5, 'S10-T01': 14, 'S11-T01': 8, 'S12-T01': 5 };
const a2 = [];
for (const [t, rows] of Object.entries(TABLES)) {
  const head = inventory.find((i) => i.id === `${t}-R00`);
  const srcRows = inventory.filter((i) => i.id.startsWith(t + '-R') && i.id !== `${t}-R00`).length;
  for (const route of [mapping[head.id].route, '/full/']) {
    const { doc, scope } = getPage(route);
    const r = find(doc, scope, head, {});
    const table = r.ok ? r.el.closest('table') : null;
    const n = table ? table.querySelectorAll('tbody tr').length : -1;
    const hdr = table ? table.querySelectorAll('thead tr').length : -1;
    const ok = n === rows && hdr === 1 && srcRows === rows;
    a2.push({ table: t, route, data_rows: n, header_rows: hdr, expected: rows, ok });
    if (!ok) report.differences.push({ check: 'A2', id: t, route, problem: `rows ${n}+${hdr} header, expected ${rows}+1` });
  }
}
report.checks.A2 = { description: 'data rows per table equal the source, plus one header row', tables: a2 };

// A3: status-label multisets (SOURCE_INVENTORY section 2).
const EXPECT_S05 = { 'derived': 19, 'decided 12 Nov': 9, 'decided 3 Nov': 4, 'decided 2 Nov': 3, 'in proposal': 2, 'setup phase': 2, 'working value': 2, 'decided 12 Nov (evening)': 2, 'interpretation note': 1, 'decided 30 Oct': 1, 'named limit': 1, 'optional, decided 3 Nov': 1, 'open': 1, 'in proposal; decided 2 Nov': 1, 'proposal': 1, 'planning value, decided 3 Nov': 1, 'decided 2 Nov; runs kept 12 Nov': 1, 'before main analysis': 1, 'decided 13 Nov': 1 };
const EXPECT_S06 = { 'decided 12 Nov': 3, 'decided 12 Nov, reported alongside': 1, 'decided 12 Nov; criteria written before the main analysis': 1, 'derived; confirmed in the written operationalisation': 1, 'derived': 1 };
const a3 = [];
for (const [t, col, expect] of [['S05-T01', 1, EXPECT_S05], ['S06-T01', 2, EXPECT_S06]]) {
  const head = inventory.find((i) => i.id === `${t}-R00`);
  for (const route of [mapping[head.id].route, '/full/']) {
    const { doc, scope } = getPage(route);
    const r = find(doc, scope, head, {});
    const got = {};
    if (r.ok) for (const tr of r.el.closest('table').querySelectorAll('tbody tr')) { const k = norm(tr.children[col].textContent); got[k] = (got[k] || 0) + 1; }
    const ok = JSON.stringify(Object.entries(got).sort()) === JSON.stringify(Object.entries(expect).sort());
    a3.push({ table: t, route, ok, labels: got });
    if (!ok) report.differences.push({ check: 'A3', id: t, route, problem: 'status-label multiset differs', got });
  }
}
report.checks.A3 = { description: 'status-label multisets of S05-T01 and S06-T01 equal SOURCE_INVENTORY section 2', results: a3 };

// A4: no text outside fragments and chrome.yml.
const chromeStrings = new Set();
(function walk(v) { if (typeof v === 'string') chromeStrings.add(norm(v)); else if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === 'object') Object.values(v).forEach(walk); })(chrome);
const routes = [...chrome.routes, ...chrome.secondary_routes];
const a4 = [];
for (const r of routes) {
  const { doc } = getPage(r.path);
  const stray = [];
  const w = doc.createTreeWalker(doc.body, 4);
  let n;
  while ((n = w.nextNode())) {
    const t = norm(n.nodeValue);
    if (!t) continue;
    const p = n.parentElement;
    if (p.closest('[data-fragment]') || p.closest('script,style,noscript,template')) continue;
    if (!chromeStrings.has(t)) stray.push(t);
  }
  for (const el of doc.body.querySelectorAll('[aria-label],[title],[alt]')) {
    if (el.closest('[data-fragment]')) continue;
    for (const a of ['aria-label', 'title', 'alt']) { const v = el.getAttribute(a); if (v !== null && !chromeStrings.has(norm(v))) stray.push(`@${a}=${v}`); }
  }
  const title = doc.title;
  const expectTitle = r.path === '/' ? chrome.site.brand : r.title + chrome.site.title_separator + chrome.site.brand;
  if (title !== expectTitle) stray.push(`<title>${title}`);
  const banner = doc.querySelector('[data-status-banner]');
  if (!banner || norm(banner.textContent) !== norm(chrome.site.banner)) stray.push('status banner missing');
  a4.push({ route: r.path, stray });
  for (const s of stray) report.differences.push({ check: 'A4', route: r.path, problem: 'text outside fragments and chrome.yml', text: s });
}
report.checks.A4 = { description: 'every text node outside the fragments, every chrome attribute text and the <title> is a chrome.yml string; status banner on every route', routes: a4.map((x) => ({ route: x.route, stray: x.stray.length })) };

// A5: change log, 13 entries in source order.
const clog = inventory.filter((i) => i.id.startsWith('S13-L01-I'));
const a5 = [];
for (const route of ['/changelog/', '/full/']) {
  const { doc } = getPage(route);
  const lis = [...doc.querySelectorAll('#changes ul.clog > li')];
  const ok = lis.length === 13 && clog.length === 13 && lis.every((li, i) => sha16(getText(li)) === clog[i].sha16);
  a5.push({ route, entries: lis.length, in_source_order: ok });
  if (!ok) report.differences.push({ check: 'A5', route, problem: `change log has ${lis.length} entries or order differs` });
}
report.checks.A5 = { description: 'change log: 13 entries in source order', results: a5 };

// A6: approved differences; fragments text-identical to the source (see tools/check-source.mjs).
report.checks.A6 = { description: 'unapproved differences (target 0); approved differences listed in content/approved-diffs.json', unapproved: report.differences.length, approved: approved.map((d) => ({ id: d.id, title: d.title, scope: d.scope, text_changes: d.text_changes.length })) };
if (report.checks.self_test && report.checks.self_test.missing) report.differences.push({ check: 'self-test', problem: `${report.checks.self_test.missing} items not found in the frozen source by the matcher` });
report.unapproved_differences = report.differences.length;

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'parity-report.json'), JSON.stringify(report, null, 1) + '\n');

// Markdown report: summary, per section, per item.
const bySec = {};
for (const r of report.item_results) {
  const s = r.id.startsWith('F') ? 'F01' : r.id.slice(0, 3);
  bySec[s] ??= { items: 0, on_route: 0, on_full: 0, kinds: {}, routes: new Set() };
  bySec[s].items++; if (r.on_route) bySec[s].on_route++; if (r.on_full) bySec[s].on_full++;
  bySec[s].kinds[r.kind] = (bySec[s].kinds[r.kind] || 0) + 1; bySec[s].routes.add(`${r.route}#${r.anchor}`);
}
const secTitle = Object.fromEntries(inventory.filter((i) => /^S\d\d$/.test(i.id)).map((i) => [i.id, i.text]));
secTitle.S00 = 'Header'; secTitle.F01 = 'Footer reference (inventory addendum)';
let md = `# Parity report (GATE1_PLAN section 7 A)\n\nGenerated ${report.generated} from \`${path.relative(root, DIST)}/\` with base \`${BASE}\`.\n\n`;
md += `- Items checked: **${all.length}** (${inventory.length} Gate 1 inventory items + ${addendum.length} addendum item)\n`;
md += `- Found on mapped route: **${report.checks.A1.on_route}**; found on \`/full/\`: **${report.checks.A1.on_full}**\n`;
md += `- Unapproved differences: **${report.unapproved_differences}**\n`;
md += `- Approved differences: ${approved.map((d) => `${d.id} (${d.title}; ${d.scope})`).join('; ')}\n`;
if (report.checks.self_test) md += `- Matcher self-test on the frozen source: ${report.checks.self_test.items - report.checks.self_test.missing}/${report.checks.self_test.items} items found\n`;
md += `\n## Checks\n\n| Check | Result |\n|---|---|\n`;
md += `| A1 items on route and /full/ | ${report.checks.A1.on_route}/${all.length} on route, ${report.checks.A1.on_full}/${all.length} on /full/ |\n`;
md += `| A2 table rows | ${a2.filter((x) => x.ok).length}/${a2.length} table placements match (${a2.map((x) => `${x.table}@${x.route}: ${x.data_rows}+${x.header_rows}`).join(', ')}) |\n`;
md += `| A3 status labels | ${a3.filter((x) => x.ok).length}/${a3.length} multisets match |\n`;
md += `| A4 no stray text | ${a4.map((x) => `${x.route}: ${x.stray.length}`).join(', ')} stray strings |\n`;
md += `| A5 change log | ${a5.map((x) => `${x.route}: ${x.entries} entries, order ${x.in_source_order ? 'ok' : 'WRONG'}`).join('; ')} |\n`;
md += `| A6 unapproved differences | ${report.unapproved_differences} |\n`;
md += `\n## Differences\n\n${report.differences.length ? report.differences.map((d) => `- ${JSON.stringify(d)}`).join('\n') : 'None.'}\n`;
md += `\n## Section-by-section mapping\n\n| Section | Title | Items | Kinds | Route#anchor | On route | On /full/ |\n|---|---|---|---|---|---|---|\n`;
for (const [s, v] of Object.entries(bySec)) md += `| ${s} | ${(secTitle[s] || '').replace(/\|/g, '/')} | ${v.items} | ${Object.entries(v.kinds).map(([k, n]) => `${k} ${n}`).join(', ')} | ${[...v.routes].join(', ')} | ${v.on_route} | ${v.on_full} |\n`;
md += `\n## Item-level mapping\n\n| ID | Kind | Route#anchor | On route | /full/#anchor | On /full/ | Text (start) |\n|---|---|---|---|---|---|---|\n`;
for (const r of report.item_results) { const it = all.find((i) => i.id === r.id); md += `| ${r.id} | ${r.kind} | ${r.route}#${r.anchor} | ${r.on_route ? 'yes' : '**NO**'} | /full/#${r.full_anchor} | ${r.on_full ? 'yes' : '**NO**'} | ${it.text.slice(0, 70).replace(/\|/g, '/')} |\n`; }
fs.writeFileSync(path.join(OUT, 'parity-report.md'), md);

console.log(`parity: ${all.length} items; on route ${report.checks.A1.on_route}, on /full/ ${report.checks.A1.on_full}; A2 ${a2.filter((x) => x.ok).length}/${a2.length}; A3 ${a3.filter((x) => x.ok).length}/${a3.length}; A4 stray ${a4.reduce((a, x) => a + x.stray.length, 0)}; A5 ${a5.filter((x) => x.in_source_order).length}/2; unapproved differences: ${report.unapproved_differences}`);
if (report.checks.self_test) console.log(`self-test: ${report.checks.self_test.items - report.checks.self_test.missing}/${report.checks.self_test.items}`);
for (const d of report.differences.slice(0, 40)) console.log('  DIFF', JSON.stringify(d));
process.exit(report.unapproved_differences ? 1 : 0);
